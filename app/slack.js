const Slack = require('slack-node');

module.exports = function (job, channel) {

    const webhook = process.env.SLACK_WEBHOOK;
    let newJob = job.slice(-1)[0],
        lastJob = job.slice(-2)[0];

    let message = `Beagle ran on: ${newJob.url}. 
         PS Mobile: ${Math.round(parseInt(newJob.mobilescore))} (${Math.round(parseInt(lastJob.mobilescore))}), 
         PS Usability: ${Math.round(parseInt(newJob.mobileusability))} (${Math.round(parseInt(lastJob.mobileusability))}), 
         PS Desktop: ${Math.round(parseInt(newJob.desktopscore))} (${Math.round(parseInt(lastJob.desktopscore))}), 
         LH Perf: ${Math.round(parseInt(newJob.perf))} (${Math.round(parseInt(lastJob.perf))}), 
         LH PWA: ${Math.round(parseInt(newJob.pwa))} (${Math.round(parseInt(lastJob.pwa))}), 
         LH a11y: ${Math.round(parseInt(newJob.accessibility))} (${Math.round(parseInt(lastJob.accessibility))}), 
         LH BP: ${Math.round(parseInt(newJob.bestpractice))} (${Math.round(parseInt(lastJob.bestpractice))}), 
         LH SEO: ${Math.round(parseInt(newJob.seo))} (${Math.round(parseInt(lastJob.seo))})`;

    const slack = new Slack();
    slack.setWebhook(webhook);

    function sendSlack() {
        return new Promise(function (resolve, reject) {
            // slack emoji
            slack.webhook({
                channel: channel,
                username: "PerformancePete",
                icon_emoji: ":ghost:",
                text: message
            }, function (err, response) {
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