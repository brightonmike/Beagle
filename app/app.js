const authentication = require("../lib/authentication");
const storeData = require('./store');
const retrieveData = require('./retrieve');

const PSMobile = require('./tests/pagespeed-mobile');
const PSDesktop = require('./tests/pagespeed-desktop');
const LightHouse = require('./tests/lighthouse');
const Pally = require('./tests/pally');
const WebPageTest = require('./tests/wpt');

const slack = require('./slack');

const consola = require('consola');

module.exports = function(job, res) {

    function runBeagle(job, res){
        job.data.report.url = job.data.site;
        consola.start('Running Beagle on.. ' + job.id + " Site: " + job.data.report.url);

        /**
         * Authenticate for Google Sheets API
         */
        let auth = authentication.authenticate();

        return auth.then(data => {

            consola.info('Authenticated');

            /**
             * Get the previous result for this site, if exists
             */
            return retrieveData(data, job);

        }).then(data => {

            consola.info('Past data retrieved');

            if(data) {
                job.data.report.past = {};

                // add past scores
                job.data.report.past.mobilescore = data[4];
                job.data.report.past.mobileusability = data[5];
                job.data.report.past.desktopscore = data[6];
                job.data.report.past.perf = data[7];
                job.data.report.past.pwa = data[8];
                job.data.report.past.accessibility = data[9];
                job.data.report.past.bestpractice = data[10];
                job.data.report.past.seo = data[11];
            }

            /**
             * Chrome headless flags
             * @type {{chromeFlags: string[]}}
             */
            const lhConfig = {
                chromeFlags: ['--show-paint-rects', '--headless']
            };

            /**
             * Run the Mobile/Desktop PS Tests
             */
            let mobileResult = PSMobile(res, job.data.report.url);
            let desktopResult = PSDesktop(res, job.data.report.url);
            let lightHouseResult = LightHouse(res, job.data.report.url, lhConfig);
            let accessibilityResult = Pally(job.data.report.url);
            // WPT is not working currently *shrug*
            //let webPageTestResult = WebPageTest(res, job.data.report.url);

            // Now return all the promises
            const promiseArray = [mobileResult, desktopResult, lightHouseResult, accessibilityResult];
            return Promise.all(promiseArray);

        }).then(values => {

            consola.info('Tests ran, adding to report.');

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
            job.data.report.lhAudit = values[2].audits;

            // Add Pa11y data to report
            job.data.report.pa11y = values[3].issues;

            const rankings = {
                type: "high",
                poor: 70,
                average: 80,
                good: 90,
                perfect: 100
            };

            // Formatted data for the Browser
            if(job.data.report.past) {
                job.data.report.formatted = {
                    "PS Mobile Score": {
                        result: job.data.report.mobilescore,
                        pastResult: job.data.report.past.mobilescore,
                        ranking: rankings
                    },
                    "PS Mobile Usability": {
                        result: job.data.report.mobileusability,
                        pastResult: job.data.report.past.mobileusability,
                        ranking: rankings
                    },
                    "PS Desktop Score": {
                        result: job.data.report.desktopscore,
                        pastResult: job.data.report.past.desktopscore,
                        ranking: rankings
                    },
                    "LH Performance": {
                        result: job.data.report.perf,
                        pastResult: job.data.report.past.perf,
                        ranking: rankings
                    },
                    "LH PWA": {
                        result: job.data.report.pwa,
                        pastResult: job.data.report.past.pwa,
                        ranking: rankings
                    },
                    "LH a11y": {
                        result: job.data.report.accessibility,
                        pastResult: job.data.report.past.accessibility,
                        ranking: rankings
                    },
                    "LH Best Practice": {
                        result: job.data.report.bestpractice,
                        pastResult: job.data.report.past.bestpractice,
                        ranking: rankings
                    },
                    "LH SEO": {
                        result: job.data.report.seo,
                        pastResult: job.data.report.past.seo,
                        ranking: rankings
                    },
                };

            } else {
                job.data.report.formatted = {
                    "PS Mobile Score": {
                        result: job.data.report.mobilescore,
                        ranking: rankings
                    },
                    "PS Mobile Usability": {
                        result: job.data.report.mobileusability,
                        ranking: rankings
                    },
                    "PS Desktop Score": {
                        result: job.data.report.desktopscore,
                        ranking: rankings
                    },
                    "LH Performance": {
                        result: job.data.report.perf,
                        ranking: rankings
                    },
                    "LH PWA": {
                        result: job.data.report.pwa,
                        ranking: rankings
                    },
                    "LH a11y": {
                        result: job.data.report.accessibility,
                        ranking: rankings
                    },
                    "LH Best Practice": {
                        result: job.data.report.bestpractice,
                        ranking: rankings
                    },
                    "LH SEO": {
                        result: job.data.report.seo,
                        ranking: rankings
                    },
                };
            }

            // Ping Slack
            slack(job);

            return auth.then(data => {
                return storeData(data, job);
            }).then(data => {
                consola.info('New data added to Sheet');
                return data.job;
            });

        }).catch(err => {
            consola.error('Fail');
            consola.error(err);
            return err;
        })


        // Add WPT data to sheet report

        //     consola.info(values[3]);
        //
        // job.data.report.loadTime = values[3].average.firstView.loadTime;
        // job.data.report.TTFB = values[3].average.firstView.TTFB;
        // job.data.report.fullyLoaded = values[3].average.firstView.fullyLoaded;
        // job.data.report.firstPaint = values[3].average.firstView.firstPaint;
        // job.data.report.visualComplete = values[3].average.firstView.visualComplete;
        // job.data.report.SpeedIndex = values[3].average.firstView.SpeedIndex;
        // job.data.report.wptlink = values[3].summary;

        // const rankings = {
        //     type: "high",
        //     poor: 70,
        //     average: 80,
        //     good: 90,
        //     perfect: 100
        // };

        // Quick Report for front end
            // "WPT Load" : {
            //     result: job.data.report.loadTime,
            //     ranking: {
            //         type: "low",
            //         poor: 14000,
            //         average: 9000,
            //         good: 6000,
            //         perfect: 3000
            //     }
            // },
            // "WPT TTFB" : {
            //     result: job.data.report.TTFB,
            //     ranking: {
            //         type: "low",
            //         poor: 2000,
            //         average: 1500,
            //         good: 1000,
            //         perfect: 500
            //     }
            // },
            // "WPT Fully Loaded" : {
            //     result: job.data.report.fullyLoaded,
            //     ranking: {
            //         type: "low",
            //         poor: 9000,
            //         average: 6000,
            //         good: 4000,
            //         perfect: 2000
            //     }
            // },
            // "WPT First Paint" : {
            //     result: job.data.report.firstPaint,
            //     ranking: {
            //         type: "low",
            //         poor: 4000,
            //         average: 3000,
            //         good: 2000,
            //         perfect: 1000
            //     }
            // },
            // "WPT Vis-Complete" : {
            //     result: job.data.report.visualComplete,
            //     ranking: {
            //         type: "low",
            //         poor: 9000,
            //         average: 6000,
            //         good: 4000,
            //         perfect: 2000
            //     }
            // },
            // "WPT SpeedIndex" : {
            //     result: job.data.report.SpeedIndex,
            //     ranking: {
            //         type: "low",
            //         poor: 9000,
            //         average: 6000,
            //         good: 4000,
            //         perfect: 2000
            //     }
            // },

    }

    return runBeagle(job, res).then(result => {
        return result;
    }).catch(err => {
        consola.error('FAIL');
        consola.error(err);
        return err;
    });
};

