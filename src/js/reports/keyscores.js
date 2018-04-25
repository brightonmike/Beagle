module.exports = {
    get: function(newJob, previousJob, rankings, veryGood, good, average, poor) {
        const tr = $('.js-row');
        let graphDataNew = [],
            graphDataOld = [];

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
            let cell = document.createElement("td"),
                cellValue = Math.round(parseInt(value.result)),
                pastValue = Math.round(parseInt(value.pastResult)),
                cellStyle = null;
    
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
}