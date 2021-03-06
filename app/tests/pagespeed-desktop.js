/**
 * Retrieve the desktop page speed scores
 * @type {psi}
 */
const psi = require('psi');
const consola = require('consola');

module.exports = function (res, url) {
    consola.info('Running desktop PS...');
    return psi(url, {
        nokey: 'true',
        strategy: 'desktop',
    });
};