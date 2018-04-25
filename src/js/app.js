import Chart from '../../node_modules/chart.js/dist/chart.js';
import dummyData from './dummydata';

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
        const { data, siteUrl } = this;
        const resultSummary = $('.js-summary');

        $('body').removeClass('is-sending').addClass('has-report');
        $(resultSummary).html(siteUrl);

        this.createLightHouse();
        this.createPa11y();
        this.keyScores();
        this.criticalFailure();
        this.createCharts();
    }

    // Getter
    get area() {
      return this.calcArea();
    }

    createLightHouse() {
        const { lhAuditContainer, lhAudit, veryGood, good, average, poor } = this;
        const lhScore = $('.js-score-lh');
        let lhCount = 0;

        $.each(lhAudit, function (key, value) {
            let itemClass = "audit__item";
            let score = '';
    
            let description = marked(value.description);
            let helpText = marked(value.helpText);
    
            if (value.scoringMode === "numeric") {
                score = value.score;
                if (value.score < 85) {
                    itemClass = "audit__item--fail";
                    lhCount++;
                } else {
                    itemClass = "audit__item--pass";
                }
            } else {
                if (value.score === false) {
                    score = "Fail";
                    itemClass = "audit__item--fail";
                    lhCount++;
                } else {
                    score = "Pass";
                    itemClass = "audit__item--pass";
                }
            }
    
            let item = "<details class='" + itemClass + "'><summary class='summary'>" + description + "</summary>" + helpText + "<div class='audit__score'>" + score + "</div></details>";
            lhAuditContainer.append(item);
        });

        lhScore.html(lhCount);
    
        if (lhCount < 30 && lhCount > 20) {
            lhScore.css("color", average)
        } else if (lhCount <= 20 && lhCount > 15) {
            lhScore.css("color", good)
        } else if (lhCount <= 15) {
            lhScore.css("color", veryGood)
        }

    }

    createPa11y() {
        const { pa11yAuditContainer, pa11yAudit, veryGood, good, average, poor } = this;
        const pa11yScore = $('.js-score-pally');
        let pa11yCount = 0;

        $.each(pa11yAudit, function (key, value) {
            pa11yCount++;
            let description = marked(value.context);
            let helpText = marked(value.message);
            let selector = marked(value.selector);
    
            let item = "<details class='audit__item--fail'><summary class='summary'>" + helpText + "</summary>" + description + "<div><pre><code>" + selector + "</code></pre></div></details>";
            pa11yAuditContainer.append(item);
        });

        pa11yScore.html(pa11yCount);
        if (pa11yCount < 20 && pa11yCount > 15) {
            pa11yScore.css("color", average)
        } else if (pa11yCount <= 15 && pa11yCount > 10) {
            pa11yScore.css("color", good)
        } else if (pa11yCount <= 10) {
            pa11yScore.css("color", veryGood)
        }
    }

    keyScores() {
        const { newJob, previousJob, rankings, veryGood, good, average, poor } = this;
        const tr = $('.js-row');
        let graphDataNew = [];
        let graphDataOld = [];
        const report = {
            "PS Mobile Score": {
                result: newJob.mobilescore,
                pastResult: previousJob.mobilescore,
                ranking: rankings
            },
            "PS Mobile Usability": {
                result: newJob.mobileusability,
                pastResult: previousJob.mobileusability,
                ranking: rankings
            },
            "PS Desktop Score": {
                result: newJob.desktopscore,
                pastResult: previousJob.desktopscore,
                ranking: rankings
            },
            "LH Performance": {
                result: newJob.perf,
                pastResult: previousJob.perf,
                ranking: rankings
            },
            "LH PWA": {
                result: newJob.pwa,
                pastResult: previousJob.pwa,
                ranking: rankings
            },
            "LH a11y": {
                result: newJob.accessibility,
                pastResult: previousJob.accessibility,
                ranking: rankings
            },
            "LH Best Practice": {
                result: newJob.bestpractice,
                pastResult: previousJob.bestpractice,
                ranking: rankings
            },
            "LH SEO": {
                result: newJob.seo,
                pastResult: previousJob.seo,
                ranking: rankings
            },
        };
    
        $.each(report, function (key, value) {
            let cell = document.createElement("td");
            let cellValue = Math.round(parseInt(value.result));
            let pastValue = Math.round(parseInt(value.pastResult));
            let cellStyle = null;
    
            graphDataNew.push(cellValue);
            graphDataOld.push(pastValue);
    
            if (value.ranking.type === "high") {
    
                if (cellValue < value.ranking.poor) {
                    cellStyle = "color:" + poor + ";";
                } else if (cellValue >= value.ranking.poor && cellValue < value.ranking.average) {
                    cellStyle = "color:" + average + ";";
                } else if (cellValue >= value.ranking.average && cellValue < value.ranking.good) {
                    cellStyle = "color:" + good + ";";
                } else if (cellValue >= value.ranking.good && cellValue <= value.ranking.perfect) {
                    cellStyle = "color:" + veryGood + ";";
                }
    
            } else {
    
                if (cellValue <= value.ranking.perfect) {
                    cellStyle = "color:" + veryGood + ";";
                } else if (csellValue > value.ranking.perfect && cellValue <= value.ranking.good) {
                    cellStyle = "color:" + good + ";";
                } else if (cellValue > value.ranking.good && cellValue <= value.ranking.average) {
                    cellStyle = "color:" + average + ";";
                } else if (cellValue > value.ranking.average) {
                    cellStyle = "color:" + poor + ";";
                }
    
            }
    
            cell.innerHTML = "<h4>" + key + "</h4><span style='" + cellStyle + "'>" + cellValue + "</span><span>" + pastValue + "</span>";
            tr.append(cell);
        });
    }

    criticalFailure() {
        const { lhAudit } = this;
        let criticalFailMobile = false,
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

        if (lhAudit['mobile-friendly']['score'] === false) {
            criticalFailMobile = true;
            criticalArray.push(lhAudit['mobile-friendly']);
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
                let description = marked(criticalArray[i]['description']);
                let helpText = marked(criticalArray[i]['helpText']);
                let score = criticalArray[i]['score'];

                let item = "<details class='audit__item--fail'><summary class='summary'>" + description + "</summary>" + helpText + "<div class='audit__score'>" + score + "</div></details>";
                failContainer.append(item);
            }

            $('.js-score-critical').html(criticalCount);
        }
    }

    createCharts() {
        const { data } = this;
        let perfChartEl = document.getElementById("lh-chart").getContext('2d');

        let graphOptions = {
            responsive: true,
            maintainAspectRatio: false,
            legend: {
                display: true,
                labels: {
                    fontColor: 'rgba(255, 255, 255, 0.4)'
                }
            },
            scales: {
                yAxes: [{
                    display: false,
                    ticks: {
                        beginAtZero: true
                    }
                }]
            },
            title: {
                display: true,
                text: 'Your Scores',
                fontColor: 'rgba(255, 255, 255, 0.8)'
            }
        };
    
        let perfDataArray = new Array();
        for (let i = 0; i < data.job.length; i++) {
            perfDataArray.push(data.job[i].perf);
        }
    
        let pwaDataArray = new Array();
        for (let i = 0; i < data.job.length; i++) {
            pwaDataArray.push(data.job[i].pwa);
        }
    
        let a11yDataArray = new Array();
        for (let i = 0; i < data.job.length; i++) {
            a11yDataArray.push(data.job[i].accessibility);
        }
    
        let perfChart = new Chart(perfChartEl, {
            type: 'line',
            data: {
                labels: ["1", "2", "3", "4", "5"],
                datasets: [{
                    data: perfDataArray,
                    label: "Perf",
                    borderColor: "#b1447f",
                    fill: false
                }, {
                    data: pwaDataArray,
                    label: "PWA",
                    borderColor: "#fc8564",
                    fill: false
                }, {
                    data: a11yDataArray,
                    label: "a11y",
                    borderColor: "#49c0b7",
                    fill: false
                }]
            },
            options: graphOptions
        });
    }
}
  
// const report = new SiteReport(dummyData);
// report.init();


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