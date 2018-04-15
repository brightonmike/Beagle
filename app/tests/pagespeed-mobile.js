/**
 * Retrieve the mobile page speed scores
 * @type {psi}
 */
const psi = require('psi');
const consola = require('consola');

module.exports = function (res, url) {
    consola.info('Running mobile PS...');
    return psi(url, {
        nokey: 'true',
        strategy: 'mobile',
    });
};