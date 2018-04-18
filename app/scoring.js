module.exports = function (job) {

    let isPass = "Pass";



    if(job.data.report.perf <= job.data.report.past.mobilescore) {
        isPass = "Fail";
    }

    job.data.report.forEach(function (item, key) {

    });

    return isPass;

};