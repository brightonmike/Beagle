const authentication = require("../lib/authentication");
const storeData = require('../app/store');
const PSMobile = require('../app/pagespeed-mobile');
const PSDesktop = require('../app/pagespeed-desktop');
const LightHouse = require('../app/lighthouse');
const twirlTimer = require('../lib/timer');

const data = [];

module.exports = function(app, db) {
    app.get('/report', (req, res) => {

        console.log('Doing stuff');
        res.render('../views/pages/sent');

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
        const MIN_DESKTOP_SCORE = 9;
        const MIN_USABILITY_SCORE = 8;
        const MIN_MOBILE_SCORE = 8;
        const MIN_LS_SCORE = 10;
        const MIN_ALLY_SCORE = 40;
        let TEST_FAIL = false;

        /**
         * Run the Mobile/Desktop PS Tests
         */
        let MobileResult = PSMobile(res, data.url);
        let DesktopResult = PSDesktop(res, data.url);
        let LightHouseResult = LightHouse(res, data.url, lhconfig);


        auth.then(auth => {
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

                let returnMessage = "Your test failed!";

                if(TEST_FAIL === false) {
                    returnMessage = "Your test succeeded! Well done.";
                }

                res.send('Test finished! Your site: ' + returnMessage);
                res.end();
                console.log('Awaiting next test...');
            });

        });
    });


    app.get('/', (req, res) => {
        return res.render('../views/pages/index');
    });
};



// Pulling out the metrics we are interested in
// function generateTrackableReport(audit) {
//     const reports = [
//         'first-meaningful-paint',
//         'speed-index-metric',
//         'estimated-input-latency',
//         'time-to-interactive',
//         'total-byte-weight',
//         'dom-size'
//     ];
//
//     const obj = {
//         metadata: audit.metadata,
//         score: Math.round(audit.score),
//         results: {}
//     };
//
//     reports.forEach(report => {
//         obj.results[report] = getRequiredAuditMetrics(audit.results.audits[report]);
//     });
//     return obj;
// };
//
// // getting the values we interested in
// function getRequiredAuditMetrics(metrics) {
//     return {
//         score: metrics.score,
//         value: metrics.rawValue,
//         optimal: metrics.optimalValue
//     };
// }
