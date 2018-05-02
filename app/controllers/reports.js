const mongoose = require('mongoose'),
database = {
        mongo_url: process.env.MONGO_URL,
        mongo_db: process.env.MONGO_DB,
        mongo_collection: process.env.MONGO_COLLECTION
};

class Reports {
    constructor(database){
        this.mongo_url = database.mongo_url;
        this.mongo_db = database.mongo_db;
        this.mongo_collection = database.mongo_collection;
    }

    connect(mongo_url){
        return mongoose.connect(mongo_url);
        // return new Promise((resolve, reject) => {
        //     MongoClient.connect(mongo_url, function (err, client) {
        //         if (err) {
        //             reject(err);
        //         }
        //         resolve(client);
        //     });
        // });
    }

    getReports(){
        const { mongo_url } = this;

        this.connect(mongo_url).then((client) => {
            
        });
    }

    getReport(){

    }

    postReport(job){
        const { mongo_url, mongo_db, mongo_collection } = this;

        this.connect(mongo_url).then(() => {
            job.save((err,report) => {
                if(err) {
                    return console.log(err);
                }
                else { //If no errors, send it back to the client
                    return console.log('Done!');
                }
            });
        });

        // this.connect(mongo_url).then((client) => {
        //     const db = client.db(mongo_db);

        //     db.collection(mongo_collection).insertOne({
        //         jobid: job.id,
        //         reportdate: job.reportDate,
        //         url: job.url,
        //         mobilescore: job.mobilescore,
        //         mobileusability: job.mobileusability,
        //         desktopscore: job.desktopscore,
        //         lhperf: job.perf,
        //         lhpwa: job.pwa,
        //         lhally: job.accessibility,
        //         lhbp: job.bestpractice,
        //         lhseo: job.seo
        //     }, function (err, res) {
        //         if (err) {
        //             db.close();
        //             return console.log(err);
        //         }
        //         // Success
        //         return console.log('Done!');
        //         db.close();
        //     });

        // });
    }

}

module.exports = new Reports(database);
