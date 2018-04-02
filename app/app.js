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

        /**
         * Run the Mobile/Desktop PS Tests
         */
        let MobileResult = PSMobile(res, job.data.report.url);
        let DesktopResult = PSDesktop(res, job.data.report.url);
        let LightHouseResult = LightHouse(res, job.data.report.url, lhConfig);
        let WebPageTestResult = WebPageTest(res, job.data.report.url);

        const promiseArray = [MobileResult, DesktopResult, LightHouseResult, WebPageTestResult];


        return auth.then(auth => {
            return Promise.all(promiseArray)
                .catch(function(err) {
                    // log that I have an error, return the entire array;
                    console.log('A promise failed to resolve', err);
                    return promiseArray;
                }).then(function (values) {

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
                job.data.report.wptlink = values[3].summary;

                const rankings = {
                    type: "high",
                    poor: 70,
                    average: 80,
                    good: 90,
                    perfect: 100
                };

                // Quick Report for front end
                job.data.report.formatted = {
                    "PS Mobile Score" : {
                        result: job.data.report.mobilescore,
                        ranking: rankings
                    },
                    "PS Mobile Usability" : {
                        result: job.data.report.mobileusability,
                        ranking: rankings
                    },
                    "PS Desktop Score" : {
                        result: job.data.report.desktopscore,
                        ranking: rankings
                    },
                    "LH Performance" : {
                        result: job.data.report.perf,
                        ranking: rankings
                    },
                    "LH PWA" : {
                        result: job.data.report.pwa,
                        ranking: rankings
                    },
                    "LH a11y" : {
                        result: job.data.report.accessibility,
                        ranking: rankings
                    },
                    "LH Best Practice" : {
                        result: job.data.report.bestpractice,
                        ranking: rankings
                    },
                    "LH SEO" : {
                        result: job.data.report.seo,
                        ranking: rankings
                    },
                    "WPT Load" : {
                        result: job.data.report.loadTime,
                        ranking: {
                            type: "low",
                            poor: 14000,
                            average: 9000,
                            good: 6000,
                            perfect: 3000
                        }
                    },
                    "WPT TTFB" : {
                        result: job.data.report.TTFB,
                        ranking: {
                            type: "low",
                            poor: 2000,
                            average: 1500,
                            good: 1000,
                            perfect: 500
                        }
                    },
                    "WPT Fully Loaded" : {
                        result: job.data.report.fullyLoaded,
                        ranking: {
                            type: "low",
                            poor: 9000,
                            average: 6000,
                            good: 4000,
                            perfect: 2000
                        }
                    },
                    "WPT First Paint" : {
                        result: job.data.report.firstPaint,
                        ranking: {
                            type: "low",
                            poor: 4000,
                            average: 3000,
                            good: 2000,
                            perfect: 1000
                        }
                    },
                    "WPT Vis-Complete" : {
                        result: job.data.report.visualComplete,
                        ranking: {
                            type: "low",
                            poor: 9000,
                            average: 6000,
                            good: 4000,
                            perfect: 2000
                        }
                    },
                    "WPT SpeedIndex" : {
                        result: job.data.report.SpeedIndex,
                        ranking: {
                            type: "low",
                            poor: 9000,
                            average: 6000,
                            good: 4000,
                            perfect: 2000
                        }
                    },
                };

               storeData(auth, job);
               return job.data;
            });
        });
    }

    return runBeagle(job, res).then(result => {
        return result;
    }).catch(err => {
        console.log(err);
        return err;
    });
};

