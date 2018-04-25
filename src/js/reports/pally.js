module.exports = {
    create: function( pa11yAuditContainer, pa11yAudit, veryGood, good, average, poor ) {
        const pa11yScore = $('.js-score-pally');
        let pa11yCount = 0;

        $.each(pa11yAudit, function (key, value) {
            pa11yCount++;
            let description = marked(value.context),
                helpText = marked(value.message),
                selector = marked(value.selector),
                item = `<details class='audit__item--fail'>
                            <summary class='summary'>${helpText}</summary>
                            ${description}
                            <div><pre><code>${selector}</code></pre></div>
                        </details>`;
            
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
}