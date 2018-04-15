const WebPageTest = require('webpagetest');
const wpkey = process.env.WPTAPI;
const wptPublic = new WebPageTest('www.webpagetest.org', wpkey);
const consola = require('consola');

module.exports = function (res, url) {
    consola.info("Running webpagetest...");
    consola.info(url);

    function runWPT(url){

        consola.info(url);

        return new Promise(function (resolve, reject) {
            consola.info(url);

            wptPublic.getLocations((err, data) => {
                console.log(err || data.response.data.location);
                resolve(data.location);
            });

            wptPublic.runTest(url, {
                connectivity: '3GFast',
                location: 'London:Chrome',
                firstViewOnly: false,
                runs: 1,
                pollResults: 5,
                video: true
            }, function processTestResult(err, result) {

                console.log('hello');
                console.log(result);
                console.log(err);

                if(result) {
                    resolve(result.data);
                }

                if(err) {
                    reject(err);
                }
            });
        });

    }

    return runWPT(url).then(results => {
        return results;
    }).catch(err => {
        return err;
    });

};