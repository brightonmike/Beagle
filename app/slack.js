const Slack = require('slack-node');

module.exports = function (job) {

    const webhook = process.env.SLACK_WEBHOOK;

    let message = `Beagle ran on: ${Math.round(parseInt(job.data.report.url))}. 
         LH Perf: ${Math.round(parseInt(job.data.report.perf))}, 
         LH PWA: ${Math.round(parseInt(job.data.report.pwa))}, 
         LH a11y: ${Math.round(parseInt(job.data.report.accessibility))}, 
         LH Best Practice: ${Math.round(parseInt(job.data.report.bestpractice))}, 
         LH SEO: ${Math.round(parseInt(job.data.report.seo))}`;

    const slack = new Slack();
    slack.setWebhook(webhook);

    function sendSlack() {
        return new Promise(function (resolve, reject) {
            // slack emoji
            slack.webhook({
                channel: "#perfpete",
                username: "PerformancePete",
                icon_emoji: ":ghost:",
                text: message
            }, function (err, response) {
                console.log(response);
                resolve(response);

                if(err){
                    reject(err);
                }
            });
        });
    }

    return sendSlack(job).then(result => {
        return result;
    }).catch(err => {
        return err;
    });

};