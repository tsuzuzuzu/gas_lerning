// プロパティに関する情報
let sp = PropertiesService.getScriptProperties();

// Googleスプレッドシート情報
const SHEET_ID = sp.getProperty('SHEET_ID');
const SHEET_NAME = sp.getProperty('SHEET_NAME');
const DRIVE_ID = sp.getProperty('DRIVE_ID');

// Google ドライうのファイルを、スプレッドシートにクリックするだけでDL可能にしたリンクを転記
function genDownloadUrl() {
    let ss = SpreadsheetApp.openById(SHEET_ID);
    let sheet = ss.getSheetByName(SHEET_NAME);

    let firstRow = 2;

    let files = DriveApp.getFolderById(DRIVE_ID).getFiles();
    while (files.hasNext()) {
        let file = files.next();
        let name = file.getName();

        // DL URLを生成
        let url = file.getUrl().replace("file/d/", "uc?export=download&id=").replace("/view?usp=drivesdk", "");

        sheet.getRange(firstRow, 1).setValue(name);
        sheet.getRange(firstRow, 2).setValue(url);
        firstRow += 1;
    }
}
