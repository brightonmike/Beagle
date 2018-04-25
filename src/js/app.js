// import dummyData from './dummydata';
import lighthouse from './reports/lighthouse';
import pa11y from './reports/pally';
import keyScores from './reports/keyscores';
import perfCharts from './reports/charts';

const socket = io();
const form = $('.js-get-report');
const errorDialog = document.getElementById('dialog');
const errorClose = document.getElementById('cancel');

class SiteReport {
    constructor(data) {
        this.data = data;
        this.newJob = data.job.slice(-1)[0];
        this.previousJob = data.job.slice(-2)[0];
        this.siteUrl = this.newJob.url;
        this.lhAudit = this.newJob.lhAudit;
        this.pa11yAudit = this.newJob.pa11yAudit;
        this.lhAuditContainer = $('.js-audit');
        this.pa11yAuditContainer = $('.js-pally');

        this.veryGood = getComputedStyle(document.body).getPropertyValue("--verygood");
        this.good = getComputedStyle(document.body).getPropertyValue("--good");
        this.average = getComputedStyle(document.body).getPropertyValue("--average");
        this.poor = getComputedStyle(document.body).getPropertyValue("--poor");

        this.rankings = {
            type: "high",
            poor: 70,
            average: 80,
            good: 90,
            perfect: 100
        };
    }

    init() {
        const {
            data,
            siteUrl,
            newJob,
            previousJob,
            rankings,
            lhAuditContainer,
            lhAudit,
            pa11yAuditContainer,
            pa11yAudit,
            veryGood,
            good,
            average,
            poor
        } = this,
        resultSummary = $('.js-summary');

        $('body').removeClass('is-sending').addClass('has-report');
        $(resultSummary).html(siteUrl);
        
        lighthouse.create(lhAuditContainer, lhAudit, veryGood, good, average, poor);
        pa11y.create(pa11yAuditContainer, pa11yAudit, veryGood, good, average, poor);
        keyScores.get(newJob, previousJob, rankings, veryGood, good, average, poor);
        perfCharts.create(data);

        this.criticalFailure();
    }

    criticalFailure() {
        const { lhAudit } = this;
        let criticalFailPWALoad = false,
        criticalFailHttps = false,
        criticalFailCrawlable = false,
        criticalFailFirstInteractive = false,
        criticalFailFirstPaint = false,
        criticalArray = new Array();

        if (lhAudit['is-crawlable']['score'] === false) {
            criticalFailCrawlable = true;
            criticalArray.push(lhAudit['is-crawlable']);
        }

        if (lhAudit['is-on-https']['score'] === false) {
            criticalFailHttps = true;
            criticalArray.push(lhAudit['is-on-https']);
        }

        if (lhAudit['load-fast-enough-for-pwa']['score'] === false) {
            criticalFailPWALoad = true;
            criticalArray.push(lhAudit['load-fast-enough-for-pwa']);
        }

        if (lhAudit['first-interactive']['score'] < 60) {
            criticalFailFirstInteractive = true;
            criticalArray.push(lhAudit['first-interactive']);
        }

        if (lhAudit['first-meaningful-paint']['score'] < 75) {
            criticalFailFirstPaint = true;
            criticalArray.push(lhAudit['first-meaningful-paint']);
        }


        if (criticalArray) {
            $('.panel--alert').show();
            const failContainer = $('.js-critical-audit');

            let criticalCount = 0;
            for (var i = 0; i < criticalArray.length; i++) {
                criticalCount++;
                let description = marked(criticalArray[i]['description']),
                    helpText = marked(criticalArray[i]['helpText']),
                    score = criticalArray[i]['score'],
                    display = criticalArray[i]['displayValue'];

                let item = `<details class='audit__item--fail'>
                                <summary class='summary'>${description} (${displayValue})</summary>
                                ${helpText}
                                <div class='audit__score'>${score}</div>
                            </details>`;
                failContainer.append(item);
            }

            $('.js-score-critical').html(criticalCount);
        }
    }
}

socket.on('connect', function () {
    $('.js-status').html('Beagle is available.').addClass('status--ready');
});

form.on("submit", function (e) {
    let siteUrl = $("#url").val();

    if (!siteUrl) {
        $('.error').css('display', 'block');
    } else {
        $('.error').css('display', 'none');
        $('body').addClass('is-sending');
        socket.emit('send site', {
            url: siteUrl
        });
    }
    e.preventDefault();
});

socket.on('beagle-result', function (data) {
    console.log(data);

    if (data.errors) {
        errorHandler(data);
    } else {
        let report = new SiteReport(data);
        report.init();
    }
});

$('.js-pass').click(function () {

    let container = $(this).parent().parent().parent();

    if (container.hasClass('show-pass')) {
        container.removeClass('show-pass');
    } else {
        container.removeClass('show-fail').addClass('show-pass');
    }

});

$('.js-fail').click(function () {

    let container = $(this).parent().parent().parent();

    if (container.hasClass('show-fail')) {
        container.removeClass('show-fail');
    } else {
        container.removeClass('show-pass').addClass('show-fail');
    }

});

function errorHandler(data) {
    $('js-data-code').html(data.code);
    const errorContainer = $('.js-errors');

    $.each(data.errors, function (key, value) {
        let error = document.createElement("p");
        error.innerHTML = "<strong>" + value.domain + ":</strong><span>" + value.message + "</span>";
        errorContainer.append(error);
    });

    $('body').addClass('has-error');
    errorDialog.showModal();

    errorClose.addEventListener('click', function () {
        errorDialog.close();
    });
}