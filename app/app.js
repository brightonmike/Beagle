const authentication = require("../lib/authentication");
const twirlTimer = require('../lib/timer');
const storeData = require('./store');
const PSMobile = require('./pagespeed-mobile');
const PSDesktop = require('./pagespeed-desktop');
const LightHouse = require('./lighthouse');

module.exports = function(req, res, data) {

    function runBeagle(req, res, data){
        return new Promise(function (resolve, reject) {
            console.log('Running Beagle...');

            data.url = req.query.url;

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

                    console.log('Storing data..');
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

                    if (TEST_FAIL === false) {
                        reject('Your test was a fail');
                    } else {
                        resolve('Your test was a success');
                    }

                });
            });
        });
    }

    return runBeagle(req, res, data).then(result => {
        return result;
    });
};

