const socket = io();
const resultSummary = $('.js-summary');
const form = $('.js-get-report');

form.on("submit", function(e){
    let siteUrl = $("#url").val();

    if(!siteUrl) {
        $('.error').css('display', 'block');
    } else {
        $('.home').addClass('u-hide');
        $('.loading').addClass('u-show');
        socket.emit ('send site', { url: siteUrl });
    }
    e.preventDefault();
});

socket.on('connect', function() {
    form.addClass('active');
});

socket.on('beagle-result', function (data) {
    $(resultSummary).html(data.site);
    $('.js-report').removeClass('u-hide').addClass('u-show');
    $('.loading').removeClass('u-show').addClass('u-hide');

    const tr = $('.js-row');
    const report = data.report.formatted;
    let size = 0;
    let sum = 0;

    $.each( report, function( key, value ) {
        let cell = document.createElement("td");
        let cellValue = Math.round(parseInt(value.result));
        let cellStyle = null;

        size++;

        if(value.ranking.type === "high") {

            sum += cellValue;
            console.log(sum);

            if(cellValue < value.ranking.poor) {
                cellStyle = "color: red;";
            } else if (cellValue >= value.ranking.poor && cellValue < value.ranking.average) {
                cellStyle = "color: orange;";
            } else if (cellValue >= value.ranking.average && cellValue < value.ranking.good) {
                cellStyle = "color: yellow;";
            } else if (cellValue >= value.ranking.good && cellValue <= value.ranking.perfect) {
                cellStyle = "color: green;";
            }

        } else {

            if(cellValue <= value.ranking.perfect) {
                cellStyle = "color: green;";
            } else if (cellValue > value.ranking.perfect && cellValue <= value.ranking.good) {
                cellStyle = "color: yellow;";
            } else if (cellValue > value.ranking.good && cellValue <= value.ranking.average) {
                cellStyle = "color: orange;";
            } else if (cellValue > value.ranking.average) {
                cellStyle = "color: red;";
            }

        }

        cell.innerHTML = "<h4>" + key + "</h4><span style='" + cellStyle + "'>" + cellValue + "</span>";
        tr.append(cell);
    });

    $('.js-score').html(Math.round(sum/size));

});