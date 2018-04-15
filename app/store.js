/**
 * Store the page speed results in a spreadsheet
 * @type {GoogleApis}
 */
const google = require('googleapis');
const sheets = google.sheets('v4');
const consola = require('consola');

module.exports = function (auth, job) {

    const spreadsheetId = process.env.SPREADSHEET_ID;

    console.log('Adding?');

    function storeData(auth, job) {

        return new Promise(function (resolve, reject) {

            sheets.spreadsheets.values.append({
                auth: auth,
                spreadsheetId: spreadsheetId,
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
            }, function (err, result) {
                if (err) {

                    consola.error("Past data not retrieved");
                    reject(err);

                } else {

                    consola.info('Data added to sheet.');
                    resolve(result);
                }
            });

        });

    }

    return storeData(auth, job).then(result => {
        return result;
    }).catch(err => {
        return err;
    });

};