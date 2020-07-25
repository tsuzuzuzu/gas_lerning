// プロパティに関する情報
let sp = PropertiesService.getScriptProperties();

// Googleスプレッドシート情報
const SHEET_ID = sp.getProperty('SHEET_ID');
const SHEET_NAME = sp.getProperty('SHEET_NAME');
let ss = SpreadsheetApp.openById(SHEET_ID);
let sheet = ss.getSheetByName(SHEET_NAME);

const WEBHOOK_URL = sp.getProperty('WEBHOOK_URL');


// Gmailで受信するGithubのコメントをGoogle チャットに投稿
function getGithubCommentFromGmail() {
    let subject = "[hoge/fuga]";
    let mailMax = 5;
    let chatMessage;
    let threads = GmailApp.search(subject, 0, mailMax);
    let messages = GmailApp.getMessagesForThreads(threads);
    let dateMessage;
    let firstRow = 2;

    messages.forEach(message => {
        chatMessage = message[0].getSubject();
        dateMessage = message[0].getDate();
        let date = Utilities.formatDate(dateMessage, "JST", "yyyy/MM/dd");

        let botMessage = { 'text': chatMessage }
        let options = {
            'method': 'POST',
            'headers': {
                'Content-Type': 'application/json; charset=UTF-8'
            },
            'payload': JSON.stringify(botMessage)
        }
        let _result = UrlFetchApp.fetch(WEBHOOK_URL, options);
        let result = JSON.parse(_result);

        sheet.getRange(firstRow, 1).setValue(date);
        sheet.getRange(firstRow, 2).setValue(result.text);
        firstRow += 1;
    });
}