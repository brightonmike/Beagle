const Beagle = require('../app/app');
const data = [];
const options = [];

module.exports = function(app, db) {

    app.get('/generate', (req, res) => {
        Beagle(req, res, data).then(result => {
           console.log('Results: ' + result);
        });
    });

    app.get('/report', (req, res) => {
        Beagle(req, res, data).then(result => {
            console.log('Results: ' + result);
        });
        res.render('../views/pages/sent');
        res.end();
    });


    app.get('/', (req, res) => {
        return res.render('../views/pages/index');
    });
};
