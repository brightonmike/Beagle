const authentication = require("../lib/authentication");
const storeData = require('../app/store');
const PSMobile = require('../app/pagespeed-mobile');
const PSDesktop = require('../app/pagespeed-desktop');
const LightHouse = require('../app/lighthouse');
//require('../lib/parseLighthouse');
const twirlTimer = require('../lib/timer');

const data = [];

module.exports = function(app, db) {
    app.get('/report', (req, res) => {

        console.log('Doing stuff');

        res.render('../views/pages/sent');
        res.end();

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
        const MIN_DESKTOP_SCORE = 9;
        const MIN_USABILITY_SCORE = 8;
        const MIN_MOBILE_SCORE = 8;
        const MIN_LS_SCORE = 10;
        let TEST_FAIL = false;

        /**
         * Run the Mobile/Desktop PS Tests
         */
        let MobileResult = PSMobile(res, data.url);
        let DesktopResult = PSDesktop(res, data.url);

        auth.then(auth => {
            Promise.all([MobileResult, DesktopResult]).then(function (values) {

                /**
                 * Run Lighthouse
                 * @type {*|LighthouseCron}
                 */

                let lightHouseTest = LightHouse(res, data.url);

                lightHouseTest.on('auditComplete', function (audit) {
                    clearInterval(twirlTimer);
                    const report = generateTrackableReport(audit);
                    console.log(report);

                    data.mobilescore = values[0].ruleGroups.SPEED.score;
                    data.mobileusability = values[0].ruleGroups.USABILITY.score;
                    data.desktopscore = values[1].ruleGroups.SPEED.score;
                    data.lighthousescore = report.score;
                    data.fmp = report.results['first-meaningful-paint']['value'];
                    data.speedindex = report.results['speed-index-metric']['value'];
                    data.tti = report.results['time-to-interactive']['value'];

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

                    if (data.lighthousescore < MIN_LS_SCORE) {
                        TEST_FAIL = true;
                    }

                    /**
                     * We're done here.
                     */
                    res.end();
                    console.log('Awaiting next test...');
                });

                console.log('Running lighthouse');
                lightHouseTest.init();

            });
        });

    });

    app.get('/', (req, res) => {
        return res.render('../views/pages/index');
    });
};



// Pulling out the metrics we are interested in
function generateTrackableReport(audit) {
    const reports = [
        'first-meaningful-paint',
        'speed-index-metric',
        'estimated-input-latency',
        'time-to-interactive',
        'total-byte-weight',
        'dom-size'
    ];

    const obj = {
        metadata: audit.metadata,
        score: Math.round(audit.score),
        results: {}
    };

    reports.forEach(report => {
        obj.results[report] = getRequiredAuditMetrics(audit.results.audits[report]);
    });
    return obj;
};

// getting the values we interested in
function getRequiredAuditMetrics(metrics) {
    return {
        score: metrics.score,
        value: metrics.rawValue,
        optimal: metrics.optimalValue
    };
}
