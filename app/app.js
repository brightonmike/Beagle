const authentication = require("../lib/authentication");
const twirlTimer = require('../lib/timer');
const storeData = require('./store');
const PSMobile = require('./pagespeed-mobile');
const PSDesktop = require('./pagespeed-desktop');
const LightHouse = require('./lighthouse');

module.exports = function(site, res, data) {

    function runBeagle(site, res, data){
        return new Promise(function (resolve, reject) {
            console.log('Running Beagle on.. ' + site.url);

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
            let MobileResult = PSMobile(res, site.url);
            let DesktopResult = PSDesktop(res, site.url);
            let LightHouseResult = LightHouse(res, site.url, lhconfig);


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

                    console.log('Storing data..');
                    storeData(auth, data, site);

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
                        reject(['Test finished for: ' + site.url, 'Your test was a fail. Your build does not meet the minimum criteria.', resultData]);
                    } else {
                        resolve(['Test finished for: ' + site.url, 'Your test was a success. Your build adheres to the minimum criteria.', resultData]);
                    }

                });
            });
        });
    }

    return runBeagle(site, res, data).then(result => {
        return result;
    }).catch(result => {
        return result;
    });
};

