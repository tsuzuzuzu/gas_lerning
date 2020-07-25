// プロパティに関する情報
let sp = PropertiesService.getScriptProperties();

// Googleスプレッドシート情報
const SHEET_ID = sp.getProperty('SHEET_ID');
const SHEET_NAME = sp.getProperty('SHEET_NAME');
let ss = SpreadsheetApp.openById(SHEET_ID);
let sheet = ss.getSheetByName(SHEET_NAME);
let date = sheet.getRange("D2").getValue();

// GoogleDriveの情報
const DRIVE_ID = sp.getProperty('DRIVE_ID');

// Gmailに関する情報
const TO = sp.getProperty('recipient');
const SUBJECT = sp.getProperty('subject');


// GoogleDriveに保存されている画像情報をスプレッドシートへIMAGE関数の形式で転記
function getImageFromDrive() {
    try {
        let files = DriveApp.getFolderById(DRIVE_ID).getFiles();
        let firstRow = 2;
        while (files.hasNext()) {
            let file = files.next();
            let name = file.getName();

            let url = file.getUrl().replace("file/d/", "uc?export=download&id=").replace("/view?usp=drivesdk", "");
            let imageUrl = file.getUrl().replace("file/d/", "uc?export=view&id=").replace("/view?usp=drivesdk", "");

            sheet.getRange(firstRow, 5).setValue(name);
            sheet.getRange(firstRow, 6).setValue(url);
            let replaceFunc = "=IMAGE(" + imageUrl + ")";
            let insertBeginQuotation = replaceFunc.replace('=IMAGE(https:', '=IMAGE("https:');
            let endOfText = replaceFunc.slice(-1);
            let insertEndQuotation = endOfText.replace(endOfText, '"' + endOfText);
            let insertFunc = insertBeginQuotation.replace(")", insertEndQuotation);
            sheet.getRange(firstRow, 7).setValue(insertFunc);
            firstRow += 1;
            Logger.log(name);
        }
    } catch (err) {
        Logger.log(err);
        // Slackにメッセージを送る
        let = postToSlack = "getImageFromDrive\n" + err.message;
        GmailApp.sendEmail(TO, SUBJECT, postToSlack);
        throw (err);
    }
}



// // 以下関数を連携して、イメージ関数の隣のセルにOCR処理後のテキストを記載
// function myFunction() {
//     // OCR機能の実現
//     var folder = DriveApp.getFoldersByName('GAS_IMAGE').next();
//     var images = folder.getFilesByType('image/png');
//     while (images.hasNext()) {
//         var image = images.next();
//         var docName = image.getName().split("\.")[0];
//         var Request_body = {
//             title: docName,
//             mimeType: 'image/jpeg'
//         }
//         Drive.Files.insert(Request_body, image, { ocr: true });
//         var newFile = DriveApp.getFilesByName(docName).next();
//         folder.addFile(newFile);
//         // Drive.Files.insert をした画像→ドキュメントファイルを、完了後にフォルダ毎削除したい
//         DriveApp.getRootFolder().removeFile(newFile);
//     }
// }
