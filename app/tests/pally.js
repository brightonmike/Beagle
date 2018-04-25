const consola = require('consola');

module.exports = function (url) {
    // run the tests and output the results in the console
    consola.info('Running pa11y...');

    const pa11y = require('pa11y');
    const puppeteer = require('puppeteer');

    // Async function required for us to use await
    async function runExample() {
        let browser;
        let pages;
        try {

            // Launch our own browser
            browser = await puppeteer.launch({
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });

            const page = await browser.newPage();

            // Test http://example.com/ with our shared browser
            const result1 = await pa11y(url, {
                browser: browser,
                page: page
            });

            // Output the raw result objects
            return result1;

            // Close the browser instance and pages now we're done with it
            for (const page of pages) {
                await page.close();
            }
            await browser.close();

        } catch (error) {

            // Output an error if it occurred
            consola.error('Error!');
            consola.error(error.message);

            // Close the browser instance and pages if theys exist
            if (pages) {
                for (const page of pages) {
                    await page.close();
                }
            }
            if (browser) {
                await browser.close();
            }

        }
    }


    return runExample();
};