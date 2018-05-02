const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const config = require('../lib/lhconfig');
const consola = require('consola');

module.exports = function (res, url) {

    consola.info("Running lighthouse..");

    const opts = {
        chromeFlags: ['--show-paint-rects', '--headless', '--no-sandbox=true']
    };

    function launchChromeAndRunLighthouse(url, opts, config) {
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