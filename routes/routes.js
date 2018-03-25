const Beagle = require('../app/app');
const data = [];
const options = [];

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
            Beagle(req, res, data).then(result => {
                socket.emit('beagle-result', 'Results: ' + result);
                console.log('Results: ' + result);
            });
        });

    });


    app.get('/', (req, res) => {
        return res.render('../views/pages/index');
    });

    // io.on('connection', function (socket) {
    //     socket.emit('beagle-result', 'Results: ');
    // });
};
