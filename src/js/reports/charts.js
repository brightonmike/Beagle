import Chart from '../../../node_modules/chart.js/dist/chart.js';

module.exports = {
    create: function (data) {
        let perfChartEl = document.getElementById("lh-chart").getContext('2d');

        console.log(data);

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