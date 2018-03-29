/**
 * Store the page speed results in a spreadsheet
 * @type {GoogleApis}
 */
const google = require('googleapis');
const sheets = google.sheets('v4');

module.exports = function (auth, job) {

    const spreadsheetid = process.env.SPREADSHEET_ID;

    return sheets.spreadsheets.values.append({
        auth: auth,
        spreadsheetId: spreadsheetid,
        range: 'Sheet1!A2:B',
        valueInputOption: "USER_ENTERED",
        resource: {
            values: [ [
                job.id,
                job.data.id,
                job.data.time,
                job.data.report.url,
                job.data.report.mobilescore,
                job.data.report.mobileusability,
                job.data.report.desktopscore,
                job.data.report.perf,
                job.data.report.pwa,
                job.data.report.accessibility,
                job.data.report.bestpractice,
                job.data.report.seo
            ] ]
        }
    }, (err, response) => {
        if (err) {
            console.log('The API returned an error: ' + err);
            return;
        } else {
            console.log('Data added to sheet.');
            return response;
        }
    });

};