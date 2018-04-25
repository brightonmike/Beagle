module.exports = { 
    create: function( lhAuditContainer, lhAudit, veryGood, good, average, poor ) {
        const lhScore = $('.js-score-lh');
        let lhCount = 0;

        $.each(lhAudit, function (key, value) {
            let itemClass = "audit__item";
            let score = '';

            let description = marked(value.description),
                helpText = marked(value.helpText),
                display = value.displayValue;

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

            let item = `<details class='${itemClass}'>
                            <summary class='summary'>${description} (${display})</summary>
                            ${helpText}
                            <div class='audit__score'>${score}</div>
                        </details>`;
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
}