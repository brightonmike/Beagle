/**
 * Retrieve the mobile page speed scores
 * @type {psi}
 */
const psi = require('psi');

module.exports = function (res, url) {
    console.log('Running mobile PS...');
    return psi(url, {
        nokey: 'true',
        strategy: 'mobile',
    });
};