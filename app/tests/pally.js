const pa11y = require('pa11y');

module.exports = function (url) {
    // run the tests and output the results in the console
    console.log('Running pa11y...');
    return pa11y(url).then((results) => {
        console.log('pa11y results');
        console.log(results);
        return results;
    }).catch(error => {
        console.log('pa11y error');
        console.log(error);
    });
};