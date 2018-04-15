const Beagle = require('../app/app');
const kue = require('kue');
const queue = kue.createQueue();
const uuidv1 = require('uuid/v1');
const consola = require('consola');

module.exports = function(app, io) {

    // Process Jobs as they are added to the queue
    queue.process('test', (job, done) => {

        if(!job.data.site) {
            done();
        }

        // Run Beagle
        Beagle(job).then(result => {
            done(null, result);
        }).catch(result => {
            done(null, result);
        });

    });

    // Create connection to users
    io.on('connection', (socket) => {
        consola.info('a user connected');

        // We'll add something here
        socket.on('disconnect', () => {
            consola.info('user disconnected');
        });

        // When send site is created, process the job
        socket.on ('send site', function (request) {
            let job = queue.create('test', {
                title: 'job ran at ' + Date.now(),
                time: +new Date(),
                site: request.url,
                id: uuidv1(),
                report: {},
                socketId: socket.id
            }).removeOnComplete(true).save(function (err) {
                if (!err) consola.info('Job ID queued: ' + job.id + ' Socket:' + socket.id);
            }).on('complete', function(result) {
                socket.emit('beagle-result', result);
            });
        });
    });

    // Express Routes
    app.use('/kue-ui', kue.app);

    // Browser
    app.get('/', (req, res) => {
        return res.render('../views/pages/index');
    });

    // Generate end point for web hooks
    app.get('/generate', (req, res) => {
        let job = queue.create('test', {
            title: 'job ran at ' + Date.now(),
            time: +new Date(),
            site: req.query.url,
            id: uuidv1(),
            report: {}
        }).save(function (err) {
            if (!err) consola.info('Job ID queued: ' + job.id);
        }).on('complete', function(result) {
            res.send(result);
        });
    });
};
