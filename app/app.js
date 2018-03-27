const authentication = require("../lib/authentication");
const twirlTimer = require('../lib/timer');
const storeData = require('./store');
const PSMobile = require('./pagespeed-mobile');
const PSDesktop = require('./pagespeed-desktop');
const LightHouse = require('./lighthouse');

module.exports = function(job, res) {

    function runBeagle(job, res){
        let data = {
            url: job.params.url,
            time: job.time,
            id: job.id
        };

        return new Promise(function (resolve, reject) {
            console.log('Running Beagle on.. ' + data.url);

            /**
             * Authenticate for Google Sheets API
             */
            let auth = authentication.authenticate();

            /**
             * Set some base minimum scores for a success
             * These might be best set ENV
             * @type {number}
             */
            const lhconfig = {
                chromeFlags: ['--show-paint-rects', '--headless']
            };

            const MIN_DESKTOP_SCORE = 85;
            const MIN_USABILITY_SCORE = 85;
            const MIN_MOBILE_SCORE = 80;
            const MIN_LS_SCORE = 75;
            const MIN_ALLY_SCORE = 85;
            let TEST_FAIL = false;

            /**
             * Run the Mobile/Desktop PS Tests
             */
            let MobileResult = PSMobile(res, data.url);
            let DesktopResult = PSDesktop(res, data.url);
            let LightHouseResult = LightHouse(res, data.url, lhconfig);


            return auth.then(auth => {
                console.log('App authenticated');
                Promise.all([MobileResult, DesktopResult, LightHouseResult]).then(function (values) {

                    console.log(values[2].reportCategories[0].score);

                    data.mobilescore = values[0].ruleGroups.SPEED.score;
                    data.mobileusability = values[0].ruleGroups.USABILITY.score;
                    data.desktopscore = values[1].ruleGroups.SPEED.score;

                    data.perf = values[2].reportCategories[0].score;
                    data.pwa = values[2].reportCategories[1].score;
                    data.accessibility = values[2].reportCategories[2].score;
                    data.bestpractice = values[2].reportCategories[3].score;
                    data.seo = values[2].reportCategories[4].score;

                    const resultData = {
                        "PS Mobile Score" : data.mobilescore,
                        "PS Mobile Usability" : data.mobileusability,
                        "PS Desktop Score" : data.desktopscore,
                        "LH Performance" : data.perf,
                        "LH PWA" : data.pwa,
                        "LH a11y" : data.accessibility,
                        "LH Best Practice" : data.bestpractice,
                        "LH SEO" : data.seo
                    };

                    storeData(auth, data);

                    if(data.mobileusability < MIN_USABILITY_SCORE) {
                        TEST_FAIL = true;
                    }

                    if (data.mobilescore < MIN_MOBILE_SCORE) {
                        TEST_FAIL = true;
                    }

                    if (data.desktopscore < MIN_DESKTOP_SCORE) {
                        TEST_FAIL = true;
                    }

                    if (data.perf < MIN_LS_SCORE) {
                        TEST_FAIL = true;
                    }

                    if (data.accessibility < MIN_ALLY_SCORE) {
                        TEST_FAIL = true;
                    }

                    /**
                     * We're done here.
                     */

                    if (TEST_FAIL === true) {
                        reject(['Test finished for: ' + data.url, 'Your test was a fail. Your build does not meet the minimum criteria.', resultData]);
                    } else {
                        resolve(['Test finished for: ' + data.url, 'Your test was a success. Your build adheres to the minimum criteria.', resultData]);
                    }

                });
            });
        });
    }

    return runBeagle(job, res).then(result => {
        return result;
    }).catch(result => {
        return result;
    });
};

