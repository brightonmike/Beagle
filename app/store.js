/**
 * Store the page speed results in a spreadsheet
 * @type {GoogleApis}
 */
const google = require('googleapis');
const sheets = google.sheets('v4');
const consola = require('consola');

module.exports = function (auth, job, allJobs) {

    const spreadsheetId = process.env.SPREADSHEET_ID;

    consola.info("Storing data...");

    function storeData(auth, job) {

        return new Promise(function (resolve, reject) {

            sheets.spreadsheets.values.append({
                auth: auth,
                spreadsheetId: spreadsheetId,
                range: 'Sheet1!A2:B',
                valueInputOption: "USER_ENTERED",
                resource: {
                    values: [ [
                        job.jobId,
                        job.id,
                        job.reportDate,
                        job.url,
                        job.mobilescore,
                        job.mobileusability,
                        job.desktopscore,
                        job.perf,
                        job.pwa,
                        job.accessibility,
                        job.bestpractice,
                        job.seo
                    ] ]
                }
            }, (err, response) => {
                if (err) {
                    console.log('The API returned an error: ' + err);
                    reject(err);
                } else {
                    console.log('Data added to sheet.');
                    let data = {
                        response: response,
                        job: allJobs
                    };
                    console.log(data.allJobs);
                    resolve(data);
                }
            });

        });

    }

    return storeData(auth, job).then(result => {
        consola.info('Data added to sheet');
        return result;
    }).catch(err => {
        consola.error(err);
        return err;
    });

};