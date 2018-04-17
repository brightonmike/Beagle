/**
 * Retrieve the spreadsheet
 * @type {GoogleApis}
 */
const google = require('googleapis');
const sheets = google.sheets('v4');
const consola = require('consola');

module.exports = function (auth, job) {

    consola.info("Getting past data..");

    /**
     *
     * @param auth
     * @param job
     * @returns {Promise<any>}
     */
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

                    let filteredArray = response.values.filter(function( obj ) {
                        return obj[3] === job.data.report.url;
                    }).map(function( obj ) {
                        return obj;
                    });

                    /**
                     * Let's only store the five previous results with our new result
                     * So the data doesn't get too hefty. We shouldn't need to compare
                     * further back than this.
                     */
                    let result = filteredArray.slice(-5);

                    resolve(result);
                }
            });

        });

    }

    return getPastData(auth, job).then(result => {
        return result;
    }).catch(err => {
        return err;
    });

};