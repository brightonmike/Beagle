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

module.exports = function (job, res) {

    /**
     *
     * @param jobId
     * @param id
     * @param reportDate
     * @param url
     * @param mobilescore
     * @param mobileusability
     * @param desktopscore
     * @param perf
     * @param pwa
     * @param accessibility
     * @param bestpractice
     * @param seo
     * @param lhAudit
     * @constructor
     */

    function SiteReport(
        jobId,
        id,
        reportDate,
        url,
        mobilescore,
        mobileusability,
        desktopscore,
        perf,
        pwa,
        accessibility,
        bestpractice,
        seo,
        lhAudit,
        pa11y
    ) {
        return {
            jobId,
            id,
            reportDate,
            url,
            mobilescore,
            mobileusability,
            desktopscore,
            perf,
            pwa,
            accessibility,
            bestpractice,
            seo,
            lhAudit,
            pa11y
        }    
    }

    function runBeagle(job, res) {
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

            /**
             * This array will contain the previous results (up to 5)
             * And the new result - with Lighthouse and Pa11y Audits
             * Audits are not included with past data (too big)
             * @type {Array}
             */

            job.data.siteReports = [];

            if (data) {

                consola.info('adding past data');
                /**
                 * Add the five previous results to siteReports
                 */
                let thisResult = null;
                for (let i = 0; i < data.length; i++) {
                    thisResult = new SiteReport(data[i][0], data[i][1], data[i][2], data[i][3], data[i][4], data[i][5], data[i][6], data[i][7], data[i][8], data[i][9], data[i][10], data[i][11]);
                    job.data.siteReports.push(thisResult);
                }

            }

            /**
             * Chrome headless flags
             * @type {{chromeFlags: string[]}}
             */
            const lhConfig = {
                chromeFlags: ['--show-paint-rects', '--headless', '--no-sandbox=true']
            };

            /**
             * Run the Mobile/Desktop PS Tests
             */
            let mobileResult = PSMobile(res, job.data.report.url);
            let desktopResult = PSDesktop(res, job.data.report.url);
            let lightHouseResult = LightHouse(res, job.data.report.url, lhConfig);
            let accessibilityResult = Pally(job.data.report.url);

            /**
             * Return the promises
             * @type {*[]}
             */
            const promiseArray = [mobileResult, desktopResult, lightHouseResult, accessibilityResult];
            return Promise.all(promiseArray);

        }).then(values => {

            consola.info('Tests ran, adding to report.');

            /**
             * Create new SiteReport for new data
             * @type {SiteReport}
             */
            let thisResult = new SiteReport(
                job.id,
                job.data.id,
                job.data.time,
                job.data.report.url,
                values[0].ruleGroups.SPEED.score,
                values[0].ruleGroups.USABILITY.score,
                values[1].ruleGroups.SPEED.score,
                values[2].reportCategories[0].score,
                values[2].reportCategories[1].score,
                values[2].reportCategories[2].score,
                values[2].reportCategories[3].score,
                values[2].reportCategories[4].score,
                values[2].audits,
                values[3].issues
            );

            /**
             * Add new report to SiteReports array
             */
            job.data.siteReports.push(thisResult);

            /**
             * Ping Slack the result
             */
            let channel = "#perfpete";
            if(job.data.slackChannel){
                channel = job.data.slackChannel;
            }

            slack(job.data.siteReports, channel);

            return auth.then(data => {
                return storeData(data, thisResult, job.data.siteReports);
            }).then(data => {
                consola.info('New data added to Sheet');
                return data;
            });

        }).catch(err => {
            consola.error('Fail');
            consola.error(err);
            return err;
        })

    }

    return runBeagle(job, res).then(result => {
        return result;
    }).catch(err => {
        consola.error('FAIL');
        consola.error(err);
        return err;
    });
};