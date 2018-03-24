/**
 * Retrieve the mobile page speed scores
 * @type {psi}
 */
const psi = require('psi');

module.exports = function (res, url) {
    return psi(url, {
        nokey: 'true',
        strategy: 'mobile',
    });
};