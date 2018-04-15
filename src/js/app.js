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
    $('body').addClass('has-report');

    const tr = $('.js-row');
    const audit = $('.js-audit');
    const report = data.report.formatted;
    const wptlink = data.report.wptlink;
    const lhAudit = data.report.lhAudit;
    let size = 0;
    let sum = 0;

    $('.js-wpt-link').attr('href', wptlink);

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

    let graphDataNew = [];
    let graphDataOld = [];

    $.each( report, function( key, value ) {
        let cell = document.createElement("td");
        let cellValue = Math.round(parseInt(value.result));
        let pastValue = Math.round(parseInt(value.pastResult));
        let cellStyle = null;

        graphDataNew.push(cellValue);
        graphDataOld.push(pastValue);

        // to be used some how
        let difference = Math.abs(cellValue - pastValue);

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
        options: {
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
        }
    });
}