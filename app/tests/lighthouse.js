const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const consola = require('consola');

module.exports = function (res, url, opts) {

    consola.info("Running lighthouse..");

    function launchChromeAndRunLighthouse(url, opts, config = null) {
        return chromeLauncher.launch({chromeFlags: opts.chromeFlags}).then(chrome => {
            opts.port = chrome.port;
            return lighthouse(url, opts, config).then(results => {
                // The gathered artifacts are typically removed as they can be quite large (~50MB+)
                delete results.artifacts;
                return chrome.kill().then(() => results)
            });
        });
    }

    return launchChromeAndRunLighthouse(url, opts).then(results => {
        return results;
    });
};