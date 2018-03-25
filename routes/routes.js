const Beagle = require('../app/app');
const data = [];
const options = [];
let running = false;

module.exports = function(app, io) {

    app.get('/generate', (req, res) => {
        Beagle(req, res, data).then(result => {
           console.log('Results: ' + result);
        });
    });

    app.get('/report', (req, res) => {
        res.render('../views/pages/sent');
        res.end();

        io.on('connection', function (socket) {

            if(running === true) {
                return;
            }

            running = true;

            if(!req.query.url) {
                socket.emit('beagle-result', ['You must supply a valid URL!']);
                return;
            }

            Beagle(req, res, data).then(result => {
                socket.emit('beagle-result', result, req.query.url);
                console.log('Results: ' + result);
                running = false;
            }).catch(function (result) {
                socket.emit('beagle-result', result, req.query.url);
                console.log('Results: ' + result);
                running = false;
            });


        });

    });


    app.get('/', (req, res) => {
        return res.render('../views/pages/index');
    });
};
