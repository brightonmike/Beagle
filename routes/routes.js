const Beagle = require('../app/app');
const data = [];
const site = [];
const options = [];
let running = false;

module.exports = function(app, io) {

    app.get('/generate', (req, res) => {
        Beagle(req, res, data).then(result => {
           console.log('Results: ' + result);
        });
    });

    app.get('/report', (req, res) => {

        site.url = req.query.url;

        res.render('../views/pages/sent');
        res.end();

        io.on('connection', function (socket) {

            if(running === true) {
                return;
            }

            running = true;

            if(!site.url) {
                socket.emit('beagle-result', ['You must supply a valid URL!']);
                return;
            }

            Beagle(site, res, data).then(result => {
                socket.emit('beagle-result', result, site.url);
                console.log('Results: ' + result);
                running = false;

                socket.on('disconnect', function() {
                    console.log('Disconnected');
                });

                for (const prop of Object.keys(site)) {
                    delete site[prop];
                }

            }).catch(function (result) {
                socket.emit('beagle-result', result, site.url);
                console.log('Results: ' + result);
                running = false;

                socket.on('disconnect', function() {
                    console.log('Disconnected');
                });

                for (const prop of Object.keys(site)) {
                    delete site[prop];
                }

            });


        });

    });


    app.get('/', (req, res) => {
        return res.render('../views/pages/index');
    });
};
