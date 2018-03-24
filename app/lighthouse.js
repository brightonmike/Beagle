const LighthouseCron = require('lighthouse-cron');

module.exports = function (res, url) {

    return new LighthouseCron(
        [
            {
                url: url
            }
        ],
        '00 00,15,30,45 * * * 0-6',
        'Europe/London',
        ['--headless']
    );

};