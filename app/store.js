/**
 * Store the page speed results in a spreadsheet
 * @type {GoogleApis}
 */
const google = require('googleapis');
const sheets = google.sheets('v4');

module.exports = function (auth, data) {

    const spreadsheetid = '1ukZDSkkwd_HEqf2rGDUkSvFfNjNDS8powhTv0bChkC0';

    return sheets.spreadsheets.values.append({
        auth: auth,
        spreadsheetId: spreadsheetid,
        range: 'Sheet1!A2:B',
        valueInputOption: "USER_ENTERED",
        resource: {
            values: [ [
                data.url,
                data.mobilescore,
                data.mobileusability,
                data.desktopscore,
                data.lighthousescore,
                data.fmp,
                data.speedindex,
                data.tti
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