const authentication = require("../lib/authentication");
const twirlTimer = require('../lib/timer');
const storeData = require('./store');

const PSMobile = require('./tests/pagespeed-mobile');
const PSDesktop = require('./tests/pagespeed-desktop');
const LightHouse = require('./tests/lighthouse');
const WebPageTest = require('./tests/wpt');

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
            const lhConfig = {
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
            let LightHouseResult = LightHouse(res, job.data.report.url, lhConfig);
            let WebPageTestResult = WebPageTest(res, job.data.report.url);


            return auth.then(auth => {
                Promise.all([MobileResult, DesktopResult, LightHouseResult, WebPageTestResult]).then(function (values) {

                    console.log(values[3]);

                    console.log(values[2].reportCategories[0].score);

                    // Add PS data to sheet report
                    job.data.report.mobilescore = values[0].ruleGroups.SPEED.score;
                    job.data.report.mobileusability = values[0].ruleGroups.USABILITY.score;
                    job.data.report.desktopscore = values[1].ruleGroups.SPEED.score;

                    // Add LH data to sheet report
                    job.data.report.perf = values[2].reportCategories[0].score;
                    job.data.report.pwa = values[2].reportCategories[1].score;
                    job.data.report.accessibility = values[2].reportCategories[2].score;
                    job.data.report.bestpractice = values[2].reportCategories[3].score;
                    job.data.report.seo = values[2].reportCategories[4].score;

                    // Add WPT data to sheet report

                    job.data.report.loadTime = values[3].average.firstView.loadTime;
                    job.data.report.TTFB = values[3].average.firstView.TTFB;
                    job.data.report.fullyLoaded = values[3].average.firstView.fullyLoaded;
                    job.data.report.firstPaint = values[3].average.firstView.firstPaint;
                    job.data.report.visualComplete = values[3].average.firstView.visualComplete;
                    job.data.report.SpeedIndex = values[3].average.firstView.SpeedIndex;

                    // Quick Report for front end
                    job.data.report.formatted = {
                        "PS Mobile Score" : job.data.report.mobilescore,
                        "PS Mobile Usability" : job.data.report.mobileusability,
                        "PS Desktop Score" : job.data.report.desktopscore,
                        "LH Performance" : job.data.report.perf,
                        "LH PWA" : job.data.report.pwa,
                        "LH a11y" : job.data.report.accessibility,
                        "LH Best Practice" : job.data.report.bestpractice,
                        "LH SEO" : job.data.report.seo,
                        "WPT Load" : job.data.report.loadTime,
                        "WPT TTFB" : job.data.report.TTFB,
                        "WPT Fully Loaded" : job.data.report.fullyLoaded,
                        "WPT First Paint" : job.data.report.firstPaint,
                        "WPT Vis-Complete" : job.data.report.visualComplete,
                        "WPT SpeedIndex" : job.data.report.SpeedIndex
                    };

                   // storeData(auth, job);

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
    }).catch(err => {
        return err;
    });
};

