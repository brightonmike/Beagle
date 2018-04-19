const Beagle = require('../app/app');
const kue = require('kue');
const uuidv1 = require('uuid/v1');
const consola = require('consola');

let redisConf = {};

if (process.env.REDISTOGO_URL) {

    console.log('Heroku Redis');
    redisConf = {
        prefix: 'q',
        redis: {
        port: 10809,
        host: 'angelfish.redistogo.com',
        auth: '41973843e0863c322704246a7640bb87',
        db: 1, // if provided select a non-default redis db
        }
    };

} 

let queue = kue.createQueue(redisConf);

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
