const authentication = require("./lib/authentication");
const storeData = require('./store');
const retrieveData = require('./retrieve');

const ReportDb = require('./controllers/reports');
const Report = require('./models/reports');

const PSMobile = require('./tests/pagespeed-mobile');
const PSDesktop = require('./tests/pagespeed-desktop');
const LightHouse = require('./tests/lighthouse');
const Pally = require('./tests/pally');
const WebPageTest = require('./tests/wpt');

// const slack = require('./slack');
const consola = require('consola');

module.exports = function (job, res) {

    function runBeagle(job, res) {
        let siteUrl = job.data.site;
        consola.start('Running Beagle on.. ' + job.id + " Site: " + siteUrl);

        /**
         * Run the Mobile/Desktop PS Tests
         */
        let mobileResult = PSMobile(res, siteUrl);
        let desktopResult = PSDesktop(res, siteUrl);
        let lightHouseResult = LightHouse(res, siteUrl);
        let reportData = new Array();
        
        const promiseArray = [mobileResult, desktopResult, lightHouseResult];
        return Promise.all(promiseArray).then(data => {

            reportData.push(data);
            return Pally(siteUrl);

        }).then(data => {

            reportData.push(data);

            let pa11y = null;
            if(reportData[1]['issues'].length < 1) {
                pa11y = "No accessibility issues found";
            } else {
                pa11y = reportData[1]['issues'];
            }

            let thisResult = new Report({
                title: reportData[0][0]['title'],
                jobId: job.id,
                id: job.data.id,
                reportDate: job.data.time,
                url: siteUrl,
                mobilescore: reportData[0][0]['ruleGroups']['SPEED']['score'],
                mobileusability: reportData[0][0]['ruleGroups']['SPEED']['usability'],
                desktopscore: reportData[0][1]['ruleGroups']['SPEED']['score'],
                perf: reportData[0][2].reportCategories[0].score,
                pwa: reportData[0][2].reportCategories[1].score,
                accessibility: reportData[0][2].reportCategories[2].score,
                bestpractice: reportData[0][2].reportCategories[3].score,
                seo: reportData[0][2].reportCategories[4].score,
                lhAudit: reportData[0][2].audits,
                pa11y: pa11y
            });

            return ReportDb.postReport(thisResult);

        }).then(() => {

            return authentication.authenticate();

        }).then(auth => {

            return storeData(data, thisResult, job.data.siteReports);

        }).then(() => {

            consola.log('Done!');

        }).catch(err => {

            consola.error(err);
            return err;

        });
        
        // /**
        //  * Authenticate for Google Sheets API
        //  */
        // let auth = authentication.authenticate();

        // return auth.then(data => {

        //     consola.info('Authenticated');

        //     /**
        //      * Get the previous result for this site, if exists
        //      */
        //     return retrieveData(data, job);

        // }).then(data => {

        //     consola.info('Past data retrieved');



        //     /**
        //      * Return the promises
        //      * @type {*[]}
        //      */
        //     const promiseArray = [mobileResult, desktopResult, lightHouseResult, accessibilityResult];
        //     return Promise.all(promiseArray);

        // }).then(values => {

        //     consola.info('Tests ran, adding to report.');

        //     /**
        //      * Create new SiteReport for new data
        //      * @type {SiteReport}
        //      */
        //     let thisResult = {
        //         title: "Another job",
        //         jobId: job.id,
        //         id: job.data.id,
        //         reportDate: job.data.time,
        //         url: job.data.report.url,
        //         mobilescore: values[0].ruleGroups.SPEED.score,
        //         mobileusability: values[0].ruleGroups.USABILITY.score,
        //         desktopscore: values[1].ruleGroups.SPEED.score,
        //         perf: values[2].reportCategories[0].score,
        //         pwa: values[2].reportCategories[1].score,
        //         accessibility: values[2].reportCategories[2].score,
        //         bestpractice: values[2].reportCategories[3].score,
        //         seo: values[2].reportCategories[4].score,
        //         lhAudit: values[2].audits,
        //         pa11y: values[3].issues
        //     }

        //     /**
        //      * Ping Slack the result
        //      */
        //     // let channel = "#perfpete";
        //     // if(job.data.slackChannel){
        //     //     channel = job.data.slackChannel;
        //     // }

        //    // slack(job.data.siteReports, channel);


        //     const MongoStore = require('./models/reports');
        //     MongoStore.addReport(thisResult);

        //     // TODO: we should now retrieve up to 5 most recent results
        //     // including lighthouse ;)

        //     return auth.then(data => {
        //         return storeData(data, thisResult, job.data.siteReports);
        //     }).then(data => {
        //         consola.info('New data added to Sheet');
        //         return data;
        //     });

        // }).catch(err => {
        //     consola.error(err);
        //     return err;
        // })

    }

    return runBeagle(job, res).then(result => {
        return result;
    }).catch(err => {
        consola.error('FAIL');
        consola.error(err);
        return err;
    });
};