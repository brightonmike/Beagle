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

        site.time = +new Date();
        site.url = req.query.url;
        site.id = uuidv4();

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

function uuidv4() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    )
}