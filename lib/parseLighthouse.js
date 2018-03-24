// Pulling out the metrics we are interested in
function generateTrackableReport(audit) {
        const reports = [
            'first-meaningful-paint',
            'speed-index-metric',
            'estimated-input-latency',
            'time-to-interactive',
            'total-byte-weight',
            'dom-size'
        ];

        const obj = {
            metadata: audit.metadata,
            score: Math.round(audit.score),
            results: {}
        };

        reports.forEach(report => {
            obj.results[report] = getRequiredAuditMetrics(audit.results.audits[report]);
        });
        return obj;
};

// getting the values we interested in
function getRequiredAuditMetrics(metrics) {
    return {
        score: metrics.score,
        value: metrics.rawValue,
        optimal: metrics.optimalValue
    };
}