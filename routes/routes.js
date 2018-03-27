const Beagle = require('../app/app');
const kue = require('kue');
const queue = kue.createQueue();
const uuidv1 = require('uuid/v1');
let running = false;

module.exports = function(app, io) {

    queue.process('test', (job, done) => {
        if(!job.data.params.url) {
            done();
        }

        Beagle(job.data).then(result => {
            done();
        }).catch(result => {
            done();
        });
    });

    app.use('/kue-ui', kue.app);

    app.get('/generate', (req, res) => {

        let job = queue.create('test', {
            title: 'job ran at ' + Date.now(),
            time: +new Date(),
            params: req.query,
            id: uuidv1()
        }).save( function(err){
            if( !err ) console.log( 'Job ID: ' + job.id );
        });

        res.render('../views/pages/sent');
        res.end();
    });

    app.get('/report', (req, res) => {

        site.time = +new Date();
        site.url = req.query.url;
        site.id = uuidv1();


        io.on('connection', function (socket) {

            if(running === true) {
                return;
            }

            running = true;

            if(!site.url) {
                socket.emit('beagle-result', ['You must supply a valid URL!']);

                clearData();

                return;
            }

            Beagle(site, res, data).then(result => {
                socket.emit('beagle-result', result, site.url);
                console.log('Results: ' + result);
                running = false;

                socket.on('disconnect', function() {
                    console.log('Disconnected');
                });

                clearData();

            }).catch(function (result) {
                socket.emit('beagle-result', result, site.url);
                console.log('Results: ' + result);
                running = false;

                socket.on('disconnect', function() {
                    console.log('Disconnected');
                });

                clearData();

            });


        });

    });


    app.get('/', (req, res) => {
        return res.render('../views/pages/index');
    });
};

function clearData(){
    for (const prop of Object.keys(site)) {
        delete site[prop];
    }
}