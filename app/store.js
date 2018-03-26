/**
 * Store the page speed results in a spreadsheet
 * @type {GoogleApis}
 */
const google = require('googleapis');
const sheets = google.sheets('v4');

module.exports = function (auth, data, site) {

    const spreadsheetid = process.env.SPREADSHEET_ID;

    return sheets.spreadsheets.values.append({
        auth: auth,
        spreadsheetId: spreadsheetid,
        range: 'Sheet1!A2:B',
        valueInputOption: "USER_ENTERED",
        resource: {
            values: [ [
                site.id,
                site.time,
                site.url,
                data.mobilescore,
                data.mobileusability,
                data.desktopscore,
                data.perf,
                data.pwa,
                data.accessibility,
                data.bestpractice,
                data.seo
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