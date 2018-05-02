const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const ReportSchema = new Schema(
    {
      title: { type: String, required: true },
      jobId: { type: String, required: true },
      id: { type: String, required: true },
      reportDate: { type: Date, default: Date.now },
      url: { type: String, required: true },
      mobilescore: { type: Number, required: false },
      mobileusability: { type: Number, required: false },
      desktopscore: { type: Number, required: false },
      perf: { type: Number, required: false },
      pwa: { type: Number, required: false },
      accessibility: { type: Number, required: false },
      bestpractice: { type: Number, required: false },
      seo: { type: Number, required: false },
      lhAudit: { type: 'Mixed', required: false },
      pa11y: { type: String, required: false }
    }, 
    { 
      versionKey: false
    }
);

ReportSchema.pre('save', next => {
    now = new Date();
    if(!this.reportDate) {
        this.reportDate = now;
    }
    next();
});

module.exports = mongoose.model('report', ReportSchema);