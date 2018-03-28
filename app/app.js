const authentication = require("../lib/authentication");
const twirlTimer = require('../lib/timer');
const storeData = require('./store');
const PSMobile = require('./pagespeed-mobile');
const PSDesktop = require('./pagespeed-desktop');
const LightHouse = require('./lighthouse');

module.exports = function(job, res) {

    function runBeagle(job, res){
        job.data.report.url = job.data.site;

        return new Promise(function (resolve, reject) {
            console.log('Running Beagle on.. ' + job.id + " Site: " + job.data.report.url);

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
            let MobileResult = PSMobile(res, job.data.report.url);
            let DesktopResult = PSDesktop(res, job.data.report.url);
            let LightHouseResult = LightHouse(res, job.data.report.url, lhconfig);


            return auth.then(auth => {
                Promise.all([MobileResult, DesktopResult, LightHouseResult]).then(function (values) {

                    console.log(values[2].reportCategories[0].score);

                    job.data.report.mobilescore = values[0].ruleGroups.SPEED.score;
                    job.data.report.mobileusability = values[0].ruleGroups.USABILITY.score;
                    job.data.report.desktopscore = values[1].ruleGroups.SPEED.score;

                    job.data.report.perf = values[2].reportCategories[0].score;
                    job.data.report.pwa = values[2].reportCategories[1].score;
                    job.data.report.accessibility = values[2].reportCategories[2].score;
                    job.data.report.bestpractice = values[2].reportCategories[3].score;
                    job.data.report.seo = values[2].reportCategories[4].score;

                    job.data.report.formatted = {
                        "PS Mobile Score" : job.data.report.mobilescore,
                        "PS Mobile Usability" : job.data.report.mobileusability,
                        "PS Desktop Score" : job.data.report.desktopscore,
                        "LH Performance" : job.data.report.perf,
                        "LH PWA" : job.data.report.pwa,
                        "LH a11y" : job.data.report.accessibility,
                        "LH Best Practice" : job.data.report.bestpractice,
                        "LH SEO" : job.data.report.seo
                    };

                    storeData(auth, job);

                    if(job.data.report.mobileusability < MIN_USABILITY_SCORE) {
                        TEST_FAIL = true;
                    }

                    if (job.data.report.mobilescore < MIN_MOBILE_SCORE) {
                        TEST_FAIL = true;
                    }

                    if (job.data.report.desktopscore < MIN_DESKTOP_SCORE) {
                        TEST_FAIL = true;
                    }

                    if (job.data.report.perf < MIN_LS_SCORE) {
                        TEST_FAIL = true;
                    }

                    if (job.data.report.accessibility < MIN_ALLY_SCORE) {
                        TEST_FAIL = true;
                    }

                    /**
                     * We're done here.
                     */

                    if (TEST_FAIL === true) {
                        reject(job.data);
                    } else {
                        resolve(job.data);
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

