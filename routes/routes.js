const Beagle = require('../app/app');
const kue = require('kue');
const queue = kue.createQueue();
const uuidv1 = require('uuid/v1');

module.exports = function(app, io) {

    queue.process('test', (job, done) => {

        if(!job.data.site) {
            done();
        }

        Beagle(job).then(result => {
            done(null, result);
        }).catch(result => {
            done(null, result);
        });
    });

    io.on('connection', (socket) => {
        console.log('a user connected');

        socket.on('disconnect', () => {
            console.log('user disconnected');
        });

        socket.on ('send site', function (request) {
            let job = queue.create('test', {
                title: 'job ran at ' + Date.now(),
                time: +new Date(),
                site: request.url,
                id: uuidv1(),
                report: {},
                socketId: socket.id
            }).save(function (err) {
                if (!err) console.log('Job ID queued: ' + job.id + ' Socket:' + socket.id);
            }).on('complete', function(result) {
                socket.emit('beagle-result', result);
            });
        });
    });

    // actual routes

    app.use('/kue-ui', kue.app);

    app.get('/', (req, res) => {
        return res.render('../views/pages/index');
    });

    app.get('/generate', (req, res) => {
        let job = queue.create('test', {
            title: 'job ran at ' + Date.now(),
            time: +new Date(),
            site: req.query.url,
            id: uuidv1(),
            report: {}
        }).save(function (err) {
            if (!err) console.log('Job ID queued: ' + job.id);
        }).on('complete', function(result) {
            res.send(result);
        });
    });
};
