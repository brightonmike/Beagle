const Slack = require('slack-node');

module.exports = function (job) {

    const webhook = process.env.SLACK_WEBHOOK;

    let message = `Beagle ran on: ${job.url}. 
         PS Mobile: ${Math.round(parseInt(job.mobilescore))}, 
         PS Usability: ${Math.round(parseInt(job.mobileusability))}, 
         PS Desktop: ${Math.round(parseInt(job.desktopscore))}, 
         LH Perf: ${Math.round(parseInt(job.perf))}, 
         LH PWA: ${Math.round(parseInt(job.pwa))}, 
         LH a11y: ${Math.round(parseInt(job.accessibility))}, 
         LH BP: ${Math.round(parseInt(job.bestpractice))}, 
         LH SEO: ${Math.round(parseInt(job.seo))}`;

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