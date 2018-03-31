const WebPageTest = require('webpagetest');
const wpkey = process.env.WPTAPI;
const wptPublic = new WebPageTest('www.webpagetest.org', wpkey);

module.exports = function (res, url) {
    console.log("Running webpagetest..");

    function runWPT(url){

        return new Promise(function (resolve, reject) {
            wptPublic.runTest(url, {
                connectivity: '4G',
                location: 'Manchester:Chrome',
                firstViewOnly: false,
                runs: 1,
                pollResults: 5,
                video: true
            }, function processTestResult(err, result) {
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

    // return wptPublic.runTest(url, (err, data) => {
    //     console.log(err || data);
    // });
};