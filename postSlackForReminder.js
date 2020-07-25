// プロパティに関する情報
let sp = PropertiesService.getScriptProperties();
const WEBHOOK_URL = sp.getProperty('WEBHOOK_URL');
const CHANNEL = sp.getProperty('CHANNEL');
const SLACK_OAUTH_TOKEN = sp.getProperty('SLACK_OAUTH_TOKEN');

// Googleスプレッドシート情報
const SHEET_ID = sp.getProperty('SHEET_ID');
const SHEET_NAME = sp.getProperty('SHEET_NAME');
let sheet = SpreadsheetApp.openById(SHEET_ID);
let dateAsParam = sheet.getSheetByName(SHEET_NAME);

// Gmailに関する情報
const TO = sp.getProperty('recipient');
const SUBJECT = sp.getProperty('subject');


// Google スプレッドシートの表から、3日追記のない場合にリマインド通知を投稿する
function remindPostForHistoryLog() {
    try {
        let _dateForCheck = dateAsParam.getRange("F2").getValue();
        let dateForCheck = Date.parse(_dateForCheck);
        let sheetNames = dateAsParam.getRange("G2:G7").getValues();

        sheetNames.forEach(sheetName => {
            let member = sheet.getSheetByName(sheetName);
            let val = member.getRange('C:C').getValues();
            let _lastRow = val.filter(String).length;
            let lastRow = _lastRow + 1;
            let getDate = member.getRange(lastRow, 3).getValue();
            let _inputDate = Utilities.formatDate(getDate, "Asia/Tokyo", "yyyy/MM/dd");
            let inputDate = Date.parse(_inputDate);

            if (dateForCheck <= inputDate) {
                let result = sheetName + ", good!";
                Logger.log(result);
            } else {
                let result = "【" + sheetName + "】" + "\nこれはリマインダー\n入力忘れ防止\n\n";
                notifySlack(result)
                Logger.log(result);
            }
        });
    } catch (err) {
        console.log(err);
        // Slackにメッセージを送る
        let = postToSlack = "remindPostForHistoryLog\n" + err.message;
        GmailApp.sendEmail(TO, SUBJECT, postToSlack);
        throw (err);
    }
}



function notifySlack(result) {
    let text = "<!USERID>" + result;
    let payload = {
        'text': text, 
        'username': 'リマインダー',
        "token": SLACK_OAUTH_TOKEN,
        'channel': CHANNEL,
    };
    let options = {
        'method': 'post',
        'contentType': 'application/json',
        'payload': JSON.stringify(payload)
    };

    UrlFetchApp.fetch(WEBHOOK_URL, options);
}