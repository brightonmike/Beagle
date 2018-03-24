/**
 * Retrieve the desktop page speed scores
 * @type {psi}
 */
const psi = require('psi');

module.exports = function (res, url) {
    console.log('Running desktop PS...');
    return psi(url, {
        nokey: 'true',
        strategy: 'desktop',
    });
};