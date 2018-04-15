/**
 * Retrieve the spreadsheet
 * @type {GoogleApis}
 */
const google = require('googleapis');
const sheets = google.sheets('v4');
const consola = require('consola');

module.exports = function (auth, job) {

    consola.info("Getting past data..");

    function getPastData(auth, job) {

        return new Promise(function (resolve, reject) {

            sheets.spreadsheets.values.get({
                spreadsheetId: process.env.SPREADSHEET_ID,
                range: 'A2:L',
                auth: auth
            }, function (err, response) {
                if (err) {

                    consola.error("Past data not retrieved");
                    reject(err);

                } else {

                    let url = job.data.report.url;
                    let reversedArray = response.values.reverse();
                    let result = reversedArray.find(data => data[3] === url);

                    resolve(result);
                }
            });

        });

    }

    return getPastData(auth, job).then(result => {
        consola.info('Past data:')
        console.log(result);

        return result;
    }).catch(err => {
        return err;
    });

};