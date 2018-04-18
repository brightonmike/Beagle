import Chart from '../../node_modules/chart.js/dist/chart.js';
const socket = io();
const resultSummary = $('.js-summary');
const form = $('.js-get-report');
const errorDialog = document.getElementById('dialog');
const errorClose = document.getElementById('cancel');

socket.on('connect', function() {
    $('.js-status').html('Beagle is available.').addClass('status--ready');
});

form.on("submit", function(e){
    let siteUrl = $("#url").val();

    if(!siteUrl) {
        $('.error').css('display', 'block');
    } else {
        $('.error').css('display', 'none');
        $('body').addClass('is-sending');
        socket.emit ('send site', { url: siteUrl });
    }
    e.preventDefault();
});

socket.on('beagle-result', function (data) {
    console.log(data);

    if(data.errors) {
        errorHandler(data);
    } else {
        buildReport(data);
    }
});

$('.js-pass').click(function() {

    let container = $(this).parent().parent().parent();

    if(container.hasClass('show-pass')) {
        container.removeClass('show-pass');
    } else {
        container.removeClass('show-fail').addClass('show-pass');
    }

});

$('.js-fail').click(function() {

    let container = $(this).parent().parent().parent();

    if(container.hasClass('show-fail')) {
        container.removeClass('show-fail');
    } else {
        container.removeClass('show-pass').addClass('show-fail');
    }

});

function errorHandler(data){
    $('js-data-code').html(data.code);
    const errorContainer = $('.js-errors');

    $.each( data.errors, function( key, value ) {
        let error = document.createElement("p");
        error.innerHTML = "<strong>" + value.domain + ":</strong><span>" + value.message + "</span>";
        errorContainer.append(error);
    });

    $('body').addClass('has-error');
    errorDialog.showModal();

    errorClose.addEventListener('click', function() {
        errorDialog.close();
    });
}

function buildReport(data){
    $(resultSummary).html(data.site);
    $('body').removeClass('is-sending').addClass('has-report');

    const rankings = {
        type: "high",
        poor: 70,
        average: 80,
        good: 90,
        perfect: 100
    };

    const report = {
        "PS Mobile Score": {
            result: data.report.slice(-1),
            pastResult: data.report.last[4],
            ranking: rankings
        },
        "PS Mobile Usability": {
            result: data.report.mobileusability,
            pastResult: data.report.last[5],
            ranking: rankings
        },
        "PS Desktop Score": {
            result: data.report.desktopscore,
            pastResult: data.report.last[6],
            ranking: rankings
        },
        "LH Performance": {
            result: data.report.perf,
            pastResult: data.report.last[7],
            ranking: rankings
        },
        "LH PWA": {
            result: data.report.pwa,
            pastResult: data.report.last[8],
            ranking: rankings
        },
        "LH a11y": {
            result: data.report.accessibility,
            pastResult: data.report.last[9],
            ranking: rankings
        },
        "LH Best Practice": {
            result: data.report.bestpractice,
            pastResult: data.report.last[10],
            ranking: rankings
        },
        "LH SEO": {
            result: data.report.seo,
            pastResult: data.report.last[11],
            ranking: rankings
        },
    };

    const tr = $('.js-row');
    const audit = $('.js-audit');
    const pa11ycontainer = $('.js-pally');
    const lhAudit = data.report.lhAudit;
    const pa11y = data.report.pa11y;
    let size = 0;
    let sum = 0;


    $.each( lhAudit, function( key, value ) {
        let itemClass = "audit__item";
        let score = '';

        let description = marked(value.description);
        let helpText = marked(value.helpText);

        if(value.scoringMode === "numeric") {
            score = value.score;
            if(value.score < 85) {
                itemClass = "audit__item--fail";
            } else {
                itemClass = "audit__item--pass";
            }
        } else {
            if(value.score === false) {
                score = "Fail";
                itemClass = "audit__item--fail";
            } else {
                score = "Pass";
                itemClass = "audit__item--pass";
            }
        }

        let item = "<details class='" + itemClass + "'><summary class='summary'>" + description + "</summary>" + helpText + "<div class='audit__score'>" + score + "</div></details>";
        audit.append(item);
    });

    $.each( pa11y, function( key, value ) {
        let description = marked(value.context);
        let helpText = marked(value.message);
        let selector = marked(value.selector);

        let item = "<details class='audit__item'><summary class='summary'>" + helpText + "</summary>" + description + "<div><pre><code>" + selector + "</code></pre></div></details>";
        pa11ycontainer.append(item);
    });

    let graphDataNew = [];
    let graphDataOld = [];

    $.each( report, function( key, value ) {
        let cell = document.createElement("td");
        let cellValue = Math.round(parseInt(value.result));
        let pastValue = Math.round(parseInt(value.pastResult));
        let cellStyle = null;

        graphDataNew.push(cellValue);
        graphDataOld.push(pastValue);

        size++;

        const veryGood = getComputedStyle(document.body).getPropertyValue("--verygood");
        const good = getComputedStyle(document.body).getPropertyValue("--good");
        const average = getComputedStyle(document.body).getPropertyValue("--average");
        const poor = getComputedStyle(document.body).getPropertyValue("--poor");

        if(value.ranking.type === "high") {

            sum += cellValue;
            console.log(sum);

            if(cellValue < value.ranking.poor) {
                cellStyle = "color:" + poor + ";";
            } else if (cellValue >= value.ranking.poor && cellValue < value.ranking.average) {
                cellStyle = "color:" + average + ";";
            } else if (cellValue >= value.ranking.average && cellValue < value.ranking.good) {
                cellStyle = "color:" + good + ";";
            } else if (cellValue >= value.ranking.good && cellValue <= value.ranking.perfect) {
                cellStyle = "color:" + veryGood + ";";
            }

        } else {

            if(cellValue <= value.ranking.perfect) {
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

    let ctx = document.getElementById("lh-chart").getContext('2d');
    let polar = document.getElementById("polar-chart").getContext('2d');

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
                display : false
            }]
        },
        title: {
            display: true,
            text: 'Your Scores',
            fontColor: 'rgba(255, 255, 255, 0.8)'
        }
    };

    let myLineChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ["Mobile Score", "Mobile Usability", "Desktop Score", "LH Perf", "LH PWA", "LH A11y", "LH Best Practice", "LH SEO"],
            datasets: [{
                data: graphDataNew,
                label: "Scores",
                borderColor: "#b1447f",
                fill: false
            }, {
                data: graphDataOld,
                label: "Previous Scores",
                borderColor: "#fc8564",
                fill: false
            }]
        },
        options: graphOptions
    });

    let polarChart = new Chart(polar, {
        data: {
            labels: ["Mobile Score", "Mobile Usability", "Desktop Score", "LH Perf", "LH PWA", "LH A11y", "LH Best Practice", "LH SEO"],
            datasets: [{
                data: graphDataNew,
                label: "Scores",
                borderColor: ["#1f253a", "#1b1e29", "#353c58", "#1a1e3a", "#3f4c7f", "#3c4258", "#2b3354", "#242e67"],
                backgroundColor: ["#1f253a", "#1b1e29", "#353c58", "#1a1e3a", "#3f4c7f", "#3c4258", "#2b3354", "#242e67"]
            }]
        },
        type: 'polarArea',
        options: {
            responsive: true,
            maintainAspectRatio: false,
            legend: {
                display: false
            },
            ticks: {
                display: false
            }
        }
    });
}