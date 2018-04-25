/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(1);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _chart = __webpack_require__(2);

var _chart2 = _interopRequireDefault(_chart);

var _dummydata = __webpack_require__(3);

var _dummydata2 = _interopRequireDefault(_dummydata);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var socket = io();
var form = $('.js-get-report');
var errorDialog = document.getElementById('dialog');
var errorClose = document.getElementById('cancel');

var SiteReport = function () {
    function SiteReport(data) {
        _classCallCheck(this, SiteReport);

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

    _createClass(SiteReport, [{
        key: 'init',
        value: function init() {
            var data = this.data,
                siteUrl = this.siteUrl;

            var resultSummary = $('.js-summary');

            $('body').removeClass('is-sending').addClass('has-report');
            $(resultSummary).html(siteUrl);

            this.createLightHouse();
            this.createPa11y();
            this.keyScores();
            this.criticalFailure();
            this.createCharts();
        }

        // Getter

    }, {
        key: 'createLightHouse',
        value: function createLightHouse() {
            var lhAuditContainer = this.lhAuditContainer,
                lhAudit = this.lhAudit,
                veryGood = this.veryGood,
                good = this.good,
                average = this.average,
                poor = this.poor;

            var lhScore = $('.js-score-lh');
            var lhCount = 0;

            $.each(lhAudit, function (key, value) {
                var itemClass = "audit__item";
                var score = '';

                var description = marked(value.description);
                var helpText = marked(value.helpText);

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

                var item = "<details class='" + itemClass + "'><summary class='summary'>" + description + "</summary>" + helpText + "<div class='audit__score'>" + score + "</div></details>";
                lhAuditContainer.append(item);
            });

            lhScore.html(lhCount);

            if (lhCount < 30 && lhCount > 20) {
                lhScore.css("color", average);
            } else if (lhCount <= 20 && lhCount > 15) {
                lhScore.css("color", good);
            } else if (lhCount <= 15) {
                lhScore.css("color", veryGood);
            }
        }
    }, {
        key: 'createPa11y',
        value: function createPa11y() {
            var pa11yAuditContainer = this.pa11yAuditContainer,
                pa11yAudit = this.pa11yAudit,
                veryGood = this.veryGood,
                good = this.good,
                average = this.average,
                poor = this.poor;

            var pa11yScore = $('.js-score-pally');
            var pa11yCount = 0;

            $.each(pa11yAudit, function (key, value) {
                pa11yCount++;
                var description = marked(value.context);
                var helpText = marked(value.message);
                var selector = marked(value.selector);

                var item = "<details class='audit__item--fail'><summary class='summary'>" + helpText + "</summary>" + description + "<div><pre><code>" + selector + "</code></pre></div></details>";
                pa11yAuditContainer.append(item);
            });

            pa11yScore.html(pa11yCount);
            if (pa11yCount < 20 && pa11yCount > 15) {
                pa11yScore.css("color", average);
            } else if (pa11yCount <= 15 && pa11yCount > 10) {
                pa11yScore.css("color", good);
            } else if (pa11yCount <= 10) {
                pa11yScore.css("color", veryGood);
            }
        }
    }, {
        key: 'keyScores',
        value: function keyScores() {
            var newJob = this.newJob,
                previousJob = this.previousJob,
                rankings = this.rankings,
                veryGood = this.veryGood,
                good = this.good,
                average = this.average,
                poor = this.poor;

            var tr = $('.js-row');
            var graphDataNew = [];
            var graphDataOld = [];
            var report = {
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
                }
            };

            $.each(report, function (key, value) {
                var cell = document.createElement("td");
                var cellValue = Math.round(parseInt(value.result));
                var pastValue = Math.round(parseInt(value.pastResult));
                var cellStyle = null;

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
    }, {
        key: 'criticalFailure',
        value: function criticalFailure() {
            var lhAudit = this.lhAudit;

            var criticalFailMobile = false,
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
                var failContainer = $('.js-critical-audit');

                var criticalCount = 0;
                for (var i = 0; i < criticalArray.length; i++) {
                    criticalCount++;
                    var description = marked(criticalArray[i]['description']);
                    var helpText = marked(criticalArray[i]['helpText']);
                    var score = criticalArray[i]['score'];

                    var item = "<details class='audit__item--fail'><summary class='summary'>" + description + "</summary>" + helpText + "<div class='audit__score'>" + score + "</div></details>";
                    failContainer.append(item);
                }

                $('.js-score-critical').html(criticalCount);
            }
        }
    }, {
        key: 'createCharts',
        value: function createCharts() {
            var data = this.data;

            var perfChartEl = document.getElementById("lh-chart").getContext('2d');

            var graphOptions = {
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

            var perfDataArray = new Array();
            for (var i = 0; i < data.job.length; i++) {
                perfDataArray.push(data.job[i].perf);
            }

            var pwaDataArray = new Array();
            for (var _i = 0; _i < data.job.length; _i++) {
                pwaDataArray.push(data.job[_i].pwa);
            }

            var a11yDataArray = new Array();
            for (var _i2 = 0; _i2 < data.job.length; _i2++) {
                a11yDataArray.push(data.job[_i2].accessibility);
            }

            var perfChart = new _chart2.default(perfChartEl, {
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
    }, {
        key: 'area',
        get: function get() {
            return this.calcArea();
        }
    }]);

    return SiteReport;
}();

// const report = new SiteReport(dummyData);
// report.init();


socket.on('connect', function () {
    $('.js-status').html('Beagle is available.').addClass('status--ready');
});

form.on("submit", function (e) {
    var siteUrl = $("#url").val();

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
        var report = new SiteReport(data);
        report.init();
    }
});

$('.js-pass').click(function () {

    var container = $(this).parent().parent().parent();

    if (container.hasClass('show-pass')) {
        container.removeClass('show-pass');
    } else {
        container.removeClass('show-fail').addClass('show-pass');
    }
});

$('.js-fail').click(function () {

    var container = $(this).parent().parent().parent();

    if (container.hasClass('show-fail')) {
        container.removeClass('show-fail');
    } else {
        container.removeClass('show-pass').addClass('show-fail');
    }
});

function errorHandler(data) {
    $('js-data-code').html(data.code);
    var errorContainer = $('.js-errors');

    $.each(data.errors, function (key, value) {
        var error = document.createElement("p");
        error.innerHTML = "<strong>" + value.domain + ":</strong><span>" + value.message + "</span>";
        errorContainer.append(error);
    });

    $('body').addClass('has-error');
    errorDialog.showModal();

    errorClose.addEventListener('click', function () {
        errorDialog.close();
    });
}

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

var require;var require;/*!
 * Chart.js
 * http://chartjs.org/
 * Version: 2.7.2
 *
 * Copyright 2018 Chart.js Contributors
 * Released under the MIT license
 * https://github.com/chartjs/Chart.js/blob/master/LICENSE.md
 */
(function(f){if(true){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Chart = f()}})(function(){var define,module,exports;return (function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return require(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
/* MIT license */
var colorNames = require(6);

module.exports = {
   getRgba: getRgba,
   getHsla: getHsla,
   getRgb: getRgb,
   getHsl: getHsl,
   getHwb: getHwb,
   getAlpha: getAlpha,

   hexString: hexString,
   rgbString: rgbString,
   rgbaString: rgbaString,
   percentString: percentString,
   percentaString: percentaString,
   hslString: hslString,
   hslaString: hslaString,
   hwbString: hwbString,
   keyword: keyword
}

function getRgba(string) {
   if (!string) {
      return;
   }
   var abbr =  /^#([a-fA-F0-9]{3})$/i,
       hex =  /^#([a-fA-F0-9]{6})$/i,
       rgba = /^rgba?\(\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/i,
       per = /^rgba?\(\s*([+-]?[\d\.]+)\%\s*,\s*([+-]?[\d\.]+)\%\s*,\s*([+-]?[\d\.]+)\%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/i,
       keyword = /(\w+)/;

   var rgb = [0, 0, 0],
       a = 1,
       match = string.match(abbr);
   if (match) {
      match = match[1];
      for (var i = 0; i < rgb.length; i++) {
         rgb[i] = parseInt(match[i] + match[i], 16);
      }
   }
   else if (match = string.match(hex)) {
      match = match[1];
      for (var i = 0; i < rgb.length; i++) {
         rgb[i] = parseInt(match.slice(i * 2, i * 2 + 2), 16);
      }
   }
   else if (match = string.match(rgba)) {
      for (var i = 0; i < rgb.length; i++) {
         rgb[i] = parseInt(match[i + 1]);
      }
      a = parseFloat(match[4]);
   }
   else if (match = string.match(per)) {
      for (var i = 0; i < rgb.length; i++) {
         rgb[i] = Math.round(parseFloat(match[i + 1]) * 2.55);
      }
      a = parseFloat(match[4]);
   }
   else if (match = string.match(keyword)) {
      if (match[1] == "transparent") {
         return [0, 0, 0, 0];
      }
      rgb = colorNames[match[1]];
      if (!rgb) {
         return;
      }
   }

   for (var i = 0; i < rgb.length; i++) {
      rgb[i] = scale(rgb[i], 0, 255);
   }
   if (!a && a != 0) {
      a = 1;
   }
   else {
      a = scale(a, 0, 1);
   }
   rgb[3] = a;
   return rgb;
}

function getHsla(string) {
   if (!string) {
      return;
   }
   var hsl = /^hsla?\(\s*([+-]?\d+)(?:deg)?\s*,\s*([+-]?[\d\.]+)%\s*,\s*([+-]?[\d\.]+)%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)/;
   var match = string.match(hsl);
   if (match) {
      var alpha = parseFloat(match[4]);
      var h = scale(parseInt(match[1]), 0, 360),
          s = scale(parseFloat(match[2]), 0, 100),
          l = scale(parseFloat(match[3]), 0, 100),
          a = scale(isNaN(alpha) ? 1 : alpha, 0, 1);
      return [h, s, l, a];
   }
}

function getHwb(string) {
   if (!string) {
      return;
   }
   var hwb = /^hwb\(\s*([+-]?\d+)(?:deg)?\s*,\s*([+-]?[\d\.]+)%\s*,\s*([+-]?[\d\.]+)%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)/;
   var match = string.match(hwb);
   if (match) {
    var alpha = parseFloat(match[4]);
      var h = scale(parseInt(match[1]), 0, 360),
          w = scale(parseFloat(match[2]), 0, 100),
          b = scale(parseFloat(match[3]), 0, 100),
          a = scale(isNaN(alpha) ? 1 : alpha, 0, 1);
      return [h, w, b, a];
   }
}

function getRgb(string) {
   var rgba = getRgba(string);
   return rgba && rgba.slice(0, 3);
}

function getHsl(string) {
  var hsla = getHsla(string);
  return hsla && hsla.slice(0, 3);
}

function getAlpha(string) {
   var vals = getRgba(string);
   if (vals) {
      return vals[3];
   }
   else if (vals = getHsla(string)) {
      return vals[3];
   }
   else if (vals = getHwb(string)) {
      return vals[3];
   }
}

// generators
function hexString(rgb) {
   return "#" + hexDouble(rgb[0]) + hexDouble(rgb[1])
              + hexDouble(rgb[2]);
}

function rgbString(rgba, alpha) {
   if (alpha < 1 || (rgba[3] && rgba[3] < 1)) {
      return rgbaString(rgba, alpha);
   }
   return "rgb(" + rgba[0] + ", " + rgba[1] + ", " + rgba[2] + ")";
}

function rgbaString(rgba, alpha) {
   if (alpha === undefined) {
      alpha = (rgba[3] !== undefined ? rgba[3] : 1);
   }
   return "rgba(" + rgba[0] + ", " + rgba[1] + ", " + rgba[2]
           + ", " + alpha + ")";
}

function percentString(rgba, alpha) {
   if (alpha < 1 || (rgba[3] && rgba[3] < 1)) {
      return percentaString(rgba, alpha);
   }
   var r = Math.round(rgba[0]/255 * 100),
       g = Math.round(rgba[1]/255 * 100),
       b = Math.round(rgba[2]/255 * 100);

   return "rgb(" + r + "%, " + g + "%, " + b + "%)";
}

function percentaString(rgba, alpha) {
   var r = Math.round(rgba[0]/255 * 100),
       g = Math.round(rgba[1]/255 * 100),
       b = Math.round(rgba[2]/255 * 100);
   return "rgba(" + r + "%, " + g + "%, " + b + "%, " + (alpha || rgba[3] || 1) + ")";
}

function hslString(hsla, alpha) {
   if (alpha < 1 || (hsla[3] && hsla[3] < 1)) {
      return hslaString(hsla, alpha);
   }
   return "hsl(" + hsla[0] + ", " + hsla[1] + "%, " + hsla[2] + "%)";
}

function hslaString(hsla, alpha) {
   if (alpha === undefined) {
      alpha = (hsla[3] !== undefined ? hsla[3] : 1);
   }
   return "hsla(" + hsla[0] + ", " + hsla[1] + "%, " + hsla[2] + "%, "
           + alpha + ")";
}

// hwb is a bit different than rgb(a) & hsl(a) since there is no alpha specific syntax
// (hwb have alpha optional & 1 is default value)
function hwbString(hwb, alpha) {
   if (alpha === undefined) {
      alpha = (hwb[3] !== undefined ? hwb[3] : 1);
   }
   return "hwb(" + hwb[0] + ", " + hwb[1] + "%, " + hwb[2] + "%"
           + (alpha !== undefined && alpha !== 1 ? ", " + alpha : "") + ")";
}

function keyword(rgb) {
  return reverseNames[rgb.slice(0, 3)];
}

// helpers
function scale(num, min, max) {
   return Math.min(Math.max(min, num), max);
}

function hexDouble(num) {
  var str = num.toString(16).toUpperCase();
  return (str.length < 2) ? "0" + str : str;
}


//create a list of reverse color names
var reverseNames = {};
for (var name in colorNames) {
   reverseNames[colorNames[name]] = name;
}

},{"6":6}],3:[function(require,module,exports){
/* MIT license */
var convert = require(5);
var string = require(2);

var Color = function (obj) {
	if (obj instanceof Color) {
		return obj;
	}
	if (!(this instanceof Color)) {
		return new Color(obj);
	}

	this.valid = false;
	this.values = {
		rgb: [0, 0, 0],
		hsl: [0, 0, 0],
		hsv: [0, 0, 0],
		hwb: [0, 0, 0],
		cmyk: [0, 0, 0, 0],
		alpha: 1
	};

	// parse Color() argument
	var vals;
	if (typeof obj === 'string') {
		vals = string.getRgba(obj);
		if (vals) {
			this.setValues('rgb', vals);
		} else if (vals = string.getHsla(obj)) {
			this.setValues('hsl', vals);
		} else if (vals = string.getHwb(obj)) {
			this.setValues('hwb', vals);
		}
	} else if (typeof obj === 'object') {
		vals = obj;
		if (vals.r !== undefined || vals.red !== undefined) {
			this.setValues('rgb', vals);
		} else if (vals.l !== undefined || vals.lightness !== undefined) {
			this.setValues('hsl', vals);
		} else if (vals.v !== undefined || vals.value !== undefined) {
			this.setValues('hsv', vals);
		} else if (vals.w !== undefined || vals.whiteness !== undefined) {
			this.setValues('hwb', vals);
		} else if (vals.c !== undefined || vals.cyan !== undefined) {
			this.setValues('cmyk', vals);
		}
	}
};

Color.prototype = {
	isValid: function () {
		return this.valid;
	},
	rgb: function () {
		return this.setSpace('rgb', arguments);
	},
	hsl: function () {
		return this.setSpace('hsl', arguments);
	},
	hsv: function () {
		return this.setSpace('hsv', arguments);
	},
	hwb: function () {
		return this.setSpace('hwb', arguments);
	},
	cmyk: function () {
		return this.setSpace('cmyk', arguments);
	},

	rgbArray: function () {
		return this.values.rgb;
	},
	hslArray: function () {
		return this.values.hsl;
	},
	hsvArray: function () {
		return this.values.hsv;
	},
	hwbArray: function () {
		var values = this.values;
		if (values.alpha !== 1) {
			return values.hwb.concat([values.alpha]);
		}
		return values.hwb;
	},
	cmykArray: function () {
		return this.values.cmyk;
	},
	rgbaArray: function () {
		var values = this.values;
		return values.rgb.concat([values.alpha]);
	},
	hslaArray: function () {
		var values = this.values;
		return values.hsl.concat([values.alpha]);
	},
	alpha: function (val) {
		if (val === undefined) {
			return this.values.alpha;
		}
		this.setValues('alpha', val);
		return this;
	},

	red: function (val) {
		return this.setChannel('rgb', 0, val);
	},
	green: function (val) {
		return this.setChannel('rgb', 1, val);
	},
	blue: function (val) {
		return this.setChannel('rgb', 2, val);
	},
	hue: function (val) {
		if (val) {
			val %= 360;
			val = val < 0 ? 360 + val : val;
		}
		return this.setChannel('hsl', 0, val);
	},
	saturation: function (val) {
		return this.setChannel('hsl', 1, val);
	},
	lightness: function (val) {
		return this.setChannel('hsl', 2, val);
	},
	saturationv: function (val) {
		return this.setChannel('hsv', 1, val);
	},
	whiteness: function (val) {
		return this.setChannel('hwb', 1, val);
	},
	blackness: function (val) {
		return this.setChannel('hwb', 2, val);
	},
	value: function (val) {
		return this.setChannel('hsv', 2, val);
	},
	cyan: function (val) {
		return this.setChannel('cmyk', 0, val);
	},
	magenta: function (val) {
		return this.setChannel('cmyk', 1, val);
	},
	yellow: function (val) {
		return this.setChannel('cmyk', 2, val);
	},
	black: function (val) {
		return this.setChannel('cmyk', 3, val);
	},

	hexString: function () {
		return string.hexString(this.values.rgb);
	},
	rgbString: function () {
		return string.rgbString(this.values.rgb, this.values.alpha);
	},
	rgbaString: function () {
		return string.rgbaString(this.values.rgb, this.values.alpha);
	},
	percentString: function () {
		return string.percentString(this.values.rgb, this.values.alpha);
	},
	hslString: function () {
		return string.hslString(this.values.hsl, this.values.alpha);
	},
	hslaString: function () {
		return string.hslaString(this.values.hsl, this.values.alpha);
	},
	hwbString: function () {
		return string.hwbString(this.values.hwb, this.values.alpha);
	},
	keyword: function () {
		return string.keyword(this.values.rgb, this.values.alpha);
	},

	rgbNumber: function () {
		var rgb = this.values.rgb;
		return (rgb[0] << 16) | (rgb[1] << 8) | rgb[2];
	},

	luminosity: function () {
		// http://www.w3.org/TR/WCAG20/#relativeluminancedef
		var rgb = this.values.rgb;
		var lum = [];
		for (var i = 0; i < rgb.length; i++) {
			var chan = rgb[i] / 255;
			lum[i] = (chan <= 0.03928) ? chan / 12.92 : Math.pow(((chan + 0.055) / 1.055), 2.4);
		}
		return 0.2126 * lum[0] + 0.7152 * lum[1] + 0.0722 * lum[2];
	},

	contrast: function (color2) {
		// http://www.w3.org/TR/WCAG20/#contrast-ratiodef
		var lum1 = this.luminosity();
		var lum2 = color2.luminosity();
		if (lum1 > lum2) {
			return (lum1 + 0.05) / (lum2 + 0.05);
		}
		return (lum2 + 0.05) / (lum1 + 0.05);
	},

	level: function (color2) {
		var contrastRatio = this.contrast(color2);
		if (contrastRatio >= 7.1) {
			return 'AAA';
		}

		return (contrastRatio >= 4.5) ? 'AA' : '';
	},

	dark: function () {
		// YIQ equation from http://24ways.org/2010/calculating-color-contrast
		var rgb = this.values.rgb;
		var yiq = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
		return yiq < 128;
	},

	light: function () {
		return !this.dark();
	},

	negate: function () {
		var rgb = [];
		for (var i = 0; i < 3; i++) {
			rgb[i] = 255 - this.values.rgb[i];
		}
		this.setValues('rgb', rgb);
		return this;
	},

	lighten: function (ratio) {
		var hsl = this.values.hsl;
		hsl[2] += hsl[2] * ratio;
		this.setValues('hsl', hsl);
		return this;
	},

	darken: function (ratio) {
		var hsl = this.values.hsl;
		hsl[2] -= hsl[2] * ratio;
		this.setValues('hsl', hsl);
		return this;
	},

	saturate: function (ratio) {
		var hsl = this.values.hsl;
		hsl[1] += hsl[1] * ratio;
		this.setValues('hsl', hsl);
		return this;
	},

	desaturate: function (ratio) {
		var hsl = this.values.hsl;
		hsl[1] -= hsl[1] * ratio;
		this.setValues('hsl', hsl);
		return this;
	},

	whiten: function (ratio) {
		var hwb = this.values.hwb;
		hwb[1] += hwb[1] * ratio;
		this.setValues('hwb', hwb);
		return this;
	},

	blacken: function (ratio) {
		var hwb = this.values.hwb;
		hwb[2] += hwb[2] * ratio;
		this.setValues('hwb', hwb);
		return this;
	},

	greyscale: function () {
		var rgb = this.values.rgb;
		// http://en.wikipedia.org/wiki/Grayscale#Converting_color_to_grayscale
		var val = rgb[0] * 0.3 + rgb[1] * 0.59 + rgb[2] * 0.11;
		this.setValues('rgb', [val, val, val]);
		return this;
	},

	clearer: function (ratio) {
		var alpha = this.values.alpha;
		this.setValues('alpha', alpha - (alpha * ratio));
		return this;
	},

	opaquer: function (ratio) {
		var alpha = this.values.alpha;
		this.setValues('alpha', alpha + (alpha * ratio));
		return this;
	},

	rotate: function (degrees) {
		var hsl = this.values.hsl;
		var hue = (hsl[0] + degrees) % 360;
		hsl[0] = hue < 0 ? 360 + hue : hue;
		this.setValues('hsl', hsl);
		return this;
	},

	/**
	 * Ported from sass implementation in C
	 * https://github.com/sass/libsass/blob/0e6b4a2850092356aa3ece07c6b249f0221caced/functions.cpp#L209
	 */
	mix: function (mixinColor, weight) {
		var color1 = this;
		var color2 = mixinColor;
		var p = weight === undefined ? 0.5 : weight;

		var w = 2 * p - 1;
		var a = color1.alpha() - color2.alpha();

		var w1 = (((w * a === -1) ? w : (w + a) / (1 + w * a)) + 1) / 2.0;
		var w2 = 1 - w1;

		return this
			.rgb(
				w1 * color1.red() + w2 * color2.red(),
				w1 * color1.green() + w2 * color2.green(),
				w1 * color1.blue() + w2 * color2.blue()
			)
			.alpha(color1.alpha() * p + color2.alpha() * (1 - p));
	},

	toJSON: function () {
		return this.rgb();
	},

	clone: function () {
		// NOTE(SB): using node-clone creates a dependency to Buffer when using browserify,
		// making the final build way to big to embed in Chart.js. So let's do it manually,
		// assuming that values to clone are 1 dimension arrays containing only numbers,
		// except 'alpha' which is a number.
		var result = new Color();
		var source = this.values;
		var target = result.values;
		var value, type;

		for (var prop in source) {
			if (source.hasOwnProperty(prop)) {
				value = source[prop];
				type = ({}).toString.call(value);
				if (type === '[object Array]') {
					target[prop] = value.slice(0);
				} else if (type === '[object Number]') {
					target[prop] = value;
				} else {
					console.error('unexpected color value:', value);
				}
			}
		}

		return result;
	}
};

Color.prototype.spaces = {
	rgb: ['red', 'green', 'blue'],
	hsl: ['hue', 'saturation', 'lightness'],
	hsv: ['hue', 'saturation', 'value'],
	hwb: ['hue', 'whiteness', 'blackness'],
	cmyk: ['cyan', 'magenta', 'yellow', 'black']
};

Color.prototype.maxes = {
	rgb: [255, 255, 255],
	hsl: [360, 100, 100],
	hsv: [360, 100, 100],
	hwb: [360, 100, 100],
	cmyk: [100, 100, 100, 100]
};

Color.prototype.getValues = function (space) {
	var values = this.values;
	var vals = {};

	for (var i = 0; i < space.length; i++) {
		vals[space.charAt(i)] = values[space][i];
	}

	if (values.alpha !== 1) {
		vals.a = values.alpha;
	}

	// {r: 255, g: 255, b: 255, a: 0.4}
	return vals;
};

Color.prototype.setValues = function (space, vals) {
	var values = this.values;
	var spaces = this.spaces;
	var maxes = this.maxes;
	var alpha = 1;
	var i;

	this.valid = true;

	if (space === 'alpha') {
		alpha = vals;
	} else if (vals.length) {
		// [10, 10, 10]
		values[space] = vals.slice(0, space.length);
		alpha = vals[space.length];
	} else if (vals[space.charAt(0)] !== undefined) {
		// {r: 10, g: 10, b: 10}
		for (i = 0; i < space.length; i++) {
			values[space][i] = vals[space.charAt(i)];
		}

		alpha = vals.a;
	} else if (vals[spaces[space][0]] !== undefined) {
		// {red: 10, green: 10, blue: 10}
		var chans = spaces[space];

		for (i = 0; i < space.length; i++) {
			values[space][i] = vals[chans[i]];
		}

		alpha = vals.alpha;
	}

	values.alpha = Math.max(0, Math.min(1, (alpha === undefined ? values.alpha : alpha)));

	if (space === 'alpha') {
		return false;
	}

	var capped;

	// cap values of the space prior converting all values
	for (i = 0; i < space.length; i++) {
		capped = Math.max(0, Math.min(maxes[space][i], values[space][i]));
		values[space][i] = Math.round(capped);
	}

	// convert to all the other color spaces
	for (var sname in spaces) {
		if (sname !== space) {
			values[sname] = convert[space][sname](values[space]);
		}
	}

	return true;
};

Color.prototype.setSpace = function (space, args) {
	var vals = args[0];

	if (vals === undefined) {
		// color.rgb()
		return this.getValues(space);
	}

	// color.rgb(10, 10, 10)
	if (typeof vals === 'number') {
		vals = Array.prototype.slice.call(args);
	}

	this.setValues(space, vals);
	return this;
};

Color.prototype.setChannel = function (space, index, val) {
	var svalues = this.values[space];
	if (val === undefined) {
		// color.red()
		return svalues[index];
	} else if (val === svalues[index]) {
		// color.red(color.red())
		return this;
	}

	// color.red(100)
	svalues[index] = val;
	this.setValues(space, svalues);

	return this;
};

if (typeof window !== 'undefined') {
	window.Color = Color;
}

module.exports = Color;

},{"2":2,"5":5}],4:[function(require,module,exports){
/* MIT license */

module.exports = {
  rgb2hsl: rgb2hsl,
  rgb2hsv: rgb2hsv,
  rgb2hwb: rgb2hwb,
  rgb2cmyk: rgb2cmyk,
  rgb2keyword: rgb2keyword,
  rgb2xyz: rgb2xyz,
  rgb2lab: rgb2lab,
  rgb2lch: rgb2lch,

  hsl2rgb: hsl2rgb,
  hsl2hsv: hsl2hsv,
  hsl2hwb: hsl2hwb,
  hsl2cmyk: hsl2cmyk,
  hsl2keyword: hsl2keyword,

  hsv2rgb: hsv2rgb,
  hsv2hsl: hsv2hsl,
  hsv2hwb: hsv2hwb,
  hsv2cmyk: hsv2cmyk,
  hsv2keyword: hsv2keyword,

  hwb2rgb: hwb2rgb,
  hwb2hsl: hwb2hsl,
  hwb2hsv: hwb2hsv,
  hwb2cmyk: hwb2cmyk,
  hwb2keyword: hwb2keyword,

  cmyk2rgb: cmyk2rgb,
  cmyk2hsl: cmyk2hsl,
  cmyk2hsv: cmyk2hsv,
  cmyk2hwb: cmyk2hwb,
  cmyk2keyword: cmyk2keyword,

  keyword2rgb: keyword2rgb,
  keyword2hsl: keyword2hsl,
  keyword2hsv: keyword2hsv,
  keyword2hwb: keyword2hwb,
  keyword2cmyk: keyword2cmyk,
  keyword2lab: keyword2lab,
  keyword2xyz: keyword2xyz,

  xyz2rgb: xyz2rgb,
  xyz2lab: xyz2lab,
  xyz2lch: xyz2lch,

  lab2xyz: lab2xyz,
  lab2rgb: lab2rgb,
  lab2lch: lab2lch,

  lch2lab: lch2lab,
  lch2xyz: lch2xyz,
  lch2rgb: lch2rgb
}


function rgb2hsl(rgb) {
  var r = rgb[0]/255,
      g = rgb[1]/255,
      b = rgb[2]/255,
      min = Math.min(r, g, b),
      max = Math.max(r, g, b),
      delta = max - min,
      h, s, l;

  if (max == min)
    h = 0;
  else if (r == max)
    h = (g - b) / delta;
  else if (g == max)
    h = 2 + (b - r) / delta;
  else if (b == max)
    h = 4 + (r - g)/ delta;

  h = Math.min(h * 60, 360);

  if (h < 0)
    h += 360;

  l = (min + max) / 2;

  if (max == min)
    s = 0;
  else if (l <= 0.5)
    s = delta / (max + min);
  else
    s = delta / (2 - max - min);

  return [h, s * 100, l * 100];
}

function rgb2hsv(rgb) {
  var r = rgb[0],
      g = rgb[1],
      b = rgb[2],
      min = Math.min(r, g, b),
      max = Math.max(r, g, b),
      delta = max - min,
      h, s, v;

  if (max == 0)
    s = 0;
  else
    s = (delta/max * 1000)/10;

  if (max == min)
    h = 0;
  else if (r == max)
    h = (g - b) / delta;
  else if (g == max)
    h = 2 + (b - r) / delta;
  else if (b == max)
    h = 4 + (r - g) / delta;

  h = Math.min(h * 60, 360);

  if (h < 0)
    h += 360;

  v = ((max / 255) * 1000) / 10;

  return [h, s, v];
}

function rgb2hwb(rgb) {
  var r = rgb[0],
      g = rgb[1],
      b = rgb[2],
      h = rgb2hsl(rgb)[0],
      w = 1/255 * Math.min(r, Math.min(g, b)),
      b = 1 - 1/255 * Math.max(r, Math.max(g, b));

  return [h, w * 100, b * 100];
}

function rgb2cmyk(rgb) {
  var r = rgb[0] / 255,
      g = rgb[1] / 255,
      b = rgb[2] / 255,
      c, m, y, k;

  k = Math.min(1 - r, 1 - g, 1 - b);
  c = (1 - r - k) / (1 - k) || 0;
  m = (1 - g - k) / (1 - k) || 0;
  y = (1 - b - k) / (1 - k) || 0;
  return [c * 100, m * 100, y * 100, k * 100];
}

function rgb2keyword(rgb) {
  return reverseKeywords[JSON.stringify(rgb)];
}

function rgb2xyz(rgb) {
  var r = rgb[0] / 255,
      g = rgb[1] / 255,
      b = rgb[2] / 255;

  // assume sRGB
  r = r > 0.04045 ? Math.pow(((r + 0.055) / 1.055), 2.4) : (r / 12.92);
  g = g > 0.04045 ? Math.pow(((g + 0.055) / 1.055), 2.4) : (g / 12.92);
  b = b > 0.04045 ? Math.pow(((b + 0.055) / 1.055), 2.4) : (b / 12.92);

  var x = (r * 0.4124) + (g * 0.3576) + (b * 0.1805);
  var y = (r * 0.2126) + (g * 0.7152) + (b * 0.0722);
  var z = (r * 0.0193) + (g * 0.1192) + (b * 0.9505);

  return [x * 100, y *100, z * 100];
}

function rgb2lab(rgb) {
  var xyz = rgb2xyz(rgb),
        x = xyz[0],
        y = xyz[1],
        z = xyz[2],
        l, a, b;

  x /= 95.047;
  y /= 100;
  z /= 108.883;

  x = x > 0.008856 ? Math.pow(x, 1/3) : (7.787 * x) + (16 / 116);
  y = y > 0.008856 ? Math.pow(y, 1/3) : (7.787 * y) + (16 / 116);
  z = z > 0.008856 ? Math.pow(z, 1/3) : (7.787 * z) + (16 / 116);

  l = (116 * y) - 16;
  a = 500 * (x - y);
  b = 200 * (y - z);

  return [l, a, b];
}

function rgb2lch(args) {
  return lab2lch(rgb2lab(args));
}

function hsl2rgb(hsl) {
  var h = hsl[0] / 360,
      s = hsl[1] / 100,
      l = hsl[2] / 100,
      t1, t2, t3, rgb, val;

  if (s == 0) {
    val = l * 255;
    return [val, val, val];
  }

  if (l < 0.5)
    t2 = l * (1 + s);
  else
    t2 = l + s - l * s;
  t1 = 2 * l - t2;

  rgb = [0, 0, 0];
  for (var i = 0; i < 3; i++) {
    t3 = h + 1 / 3 * - (i - 1);
    t3 < 0 && t3++;
    t3 > 1 && t3--;

    if (6 * t3 < 1)
      val = t1 + (t2 - t1) * 6 * t3;
    else if (2 * t3 < 1)
      val = t2;
    else if (3 * t3 < 2)
      val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
    else
      val = t1;

    rgb[i] = val * 255;
  }

  return rgb;
}

function hsl2hsv(hsl) {
  var h = hsl[0],
      s = hsl[1] / 100,
      l = hsl[2] / 100,
      sv, v;

  if(l === 0) {
      // no need to do calc on black
      // also avoids divide by 0 error
      return [0, 0, 0];
  }

  l *= 2;
  s *= (l <= 1) ? l : 2 - l;
  v = (l + s) / 2;
  sv = (2 * s) / (l + s);
  return [h, sv * 100, v * 100];
}

function hsl2hwb(args) {
  return rgb2hwb(hsl2rgb(args));
}

function hsl2cmyk(args) {
  return rgb2cmyk(hsl2rgb(args));
}

function hsl2keyword(args) {
  return rgb2keyword(hsl2rgb(args));
}


function hsv2rgb(hsv) {
  var h = hsv[0] / 60,
      s = hsv[1] / 100,
      v = hsv[2] / 100,
      hi = Math.floor(h) % 6;

  var f = h - Math.floor(h),
      p = 255 * v * (1 - s),
      q = 255 * v * (1 - (s * f)),
      t = 255 * v * (1 - (s * (1 - f))),
      v = 255 * v;

  switch(hi) {
    case 0:
      return [v, t, p];
    case 1:
      return [q, v, p];
    case 2:
      return [p, v, t];
    case 3:
      return [p, q, v];
    case 4:
      return [t, p, v];
    case 5:
      return [v, p, q];
  }
}

function hsv2hsl(hsv) {
  var h = hsv[0],
      s = hsv[1] / 100,
      v = hsv[2] / 100,
      sl, l;

  l = (2 - s) * v;
  sl = s * v;
  sl /= (l <= 1) ? l : 2 - l;
  sl = sl || 0;
  l /= 2;
  return [h, sl * 100, l * 100];
}

function hsv2hwb(args) {
  return rgb2hwb(hsv2rgb(args))
}

function hsv2cmyk(args) {
  return rgb2cmyk(hsv2rgb(args));
}

function hsv2keyword(args) {
  return rgb2keyword(hsv2rgb(args));
}

// http://dev.w3.org/csswg/css-color/#hwb-to-rgb
function hwb2rgb(hwb) {
  var h = hwb[0] / 360,
      wh = hwb[1] / 100,
      bl = hwb[2] / 100,
      ratio = wh + bl,
      i, v, f, n;

  // wh + bl cant be > 1
  if (ratio > 1) {
    wh /= ratio;
    bl /= ratio;
  }

  i = Math.floor(6 * h);
  v = 1 - bl;
  f = 6 * h - i;
  if ((i & 0x01) != 0) {
    f = 1 - f;
  }
  n = wh + f * (v - wh);  // linear interpolation

  switch (i) {
    default:
    case 6:
    case 0: r = v; g = n; b = wh; break;
    case 1: r = n; g = v; b = wh; break;
    case 2: r = wh; g = v; b = n; break;
    case 3: r = wh; g = n; b = v; break;
    case 4: r = n; g = wh; b = v; break;
    case 5: r = v; g = wh; b = n; break;
  }

  return [r * 255, g * 255, b * 255];
}

function hwb2hsl(args) {
  return rgb2hsl(hwb2rgb(args));
}

function hwb2hsv(args) {
  return rgb2hsv(hwb2rgb(args));
}

function hwb2cmyk(args) {
  return rgb2cmyk(hwb2rgb(args));
}

function hwb2keyword(args) {
  return rgb2keyword(hwb2rgb(args));
}

function cmyk2rgb(cmyk) {
  var c = cmyk[0] / 100,
      m = cmyk[1] / 100,
      y = cmyk[2] / 100,
      k = cmyk[3] / 100,
      r, g, b;

  r = 1 - Math.min(1, c * (1 - k) + k);
  g = 1 - Math.min(1, m * (1 - k) + k);
  b = 1 - Math.min(1, y * (1 - k) + k);
  return [r * 255, g * 255, b * 255];
}

function cmyk2hsl(args) {
  return rgb2hsl(cmyk2rgb(args));
}

function cmyk2hsv(args) {
  return rgb2hsv(cmyk2rgb(args));
}

function cmyk2hwb(args) {
  return rgb2hwb(cmyk2rgb(args));
}

function cmyk2keyword(args) {
  return rgb2keyword(cmyk2rgb(args));
}


function xyz2rgb(xyz) {
  var x = xyz[0] / 100,
      y = xyz[1] / 100,
      z = xyz[2] / 100,
      r, g, b;

  r = (x * 3.2406) + (y * -1.5372) + (z * -0.4986);
  g = (x * -0.9689) + (y * 1.8758) + (z * 0.0415);
  b = (x * 0.0557) + (y * -0.2040) + (z * 1.0570);

  // assume sRGB
  r = r > 0.0031308 ? ((1.055 * Math.pow(r, 1.0 / 2.4)) - 0.055)
    : r = (r * 12.92);

  g = g > 0.0031308 ? ((1.055 * Math.pow(g, 1.0 / 2.4)) - 0.055)
    : g = (g * 12.92);

  b = b > 0.0031308 ? ((1.055 * Math.pow(b, 1.0 / 2.4)) - 0.055)
    : b = (b * 12.92);

  r = Math.min(Math.max(0, r), 1);
  g = Math.min(Math.max(0, g), 1);
  b = Math.min(Math.max(0, b), 1);

  return [r * 255, g * 255, b * 255];
}

function xyz2lab(xyz) {
  var x = xyz[0],
      y = xyz[1],
      z = xyz[2],
      l, a, b;

  x /= 95.047;
  y /= 100;
  z /= 108.883;

  x = x > 0.008856 ? Math.pow(x, 1/3) : (7.787 * x) + (16 / 116);
  y = y > 0.008856 ? Math.pow(y, 1/3) : (7.787 * y) + (16 / 116);
  z = z > 0.008856 ? Math.pow(z, 1/3) : (7.787 * z) + (16 / 116);

  l = (116 * y) - 16;
  a = 500 * (x - y);
  b = 200 * (y - z);

  return [l, a, b];
}

function xyz2lch(args) {
  return lab2lch(xyz2lab(args));
}

function lab2xyz(lab) {
  var l = lab[0],
      a = lab[1],
      b = lab[2],
      x, y, z, y2;

  if (l <= 8) {
    y = (l * 100) / 903.3;
    y2 = (7.787 * (y / 100)) + (16 / 116);
  } else {
    y = 100 * Math.pow((l + 16) / 116, 3);
    y2 = Math.pow(y / 100, 1/3);
  }

  x = x / 95.047 <= 0.008856 ? x = (95.047 * ((a / 500) + y2 - (16 / 116))) / 7.787 : 95.047 * Math.pow((a / 500) + y2, 3);

  z = z / 108.883 <= 0.008859 ? z = (108.883 * (y2 - (b / 200) - (16 / 116))) / 7.787 : 108.883 * Math.pow(y2 - (b / 200), 3);

  return [x, y, z];
}

function lab2lch(lab) {
  var l = lab[0],
      a = lab[1],
      b = lab[2],
      hr, h, c;

  hr = Math.atan2(b, a);
  h = hr * 360 / 2 / Math.PI;
  if (h < 0) {
    h += 360;
  }
  c = Math.sqrt(a * a + b * b);
  return [l, c, h];
}

function lab2rgb(args) {
  return xyz2rgb(lab2xyz(args));
}

function lch2lab(lch) {
  var l = lch[0],
      c = lch[1],
      h = lch[2],
      a, b, hr;

  hr = h / 360 * 2 * Math.PI;
  a = c * Math.cos(hr);
  b = c * Math.sin(hr);
  return [l, a, b];
}

function lch2xyz(args) {
  return lab2xyz(lch2lab(args));
}

function lch2rgb(args) {
  return lab2rgb(lch2lab(args));
}

function keyword2rgb(keyword) {
  return cssKeywords[keyword];
}

function keyword2hsl(args) {
  return rgb2hsl(keyword2rgb(args));
}

function keyword2hsv(args) {
  return rgb2hsv(keyword2rgb(args));
}

function keyword2hwb(args) {
  return rgb2hwb(keyword2rgb(args));
}

function keyword2cmyk(args) {
  return rgb2cmyk(keyword2rgb(args));
}

function keyword2lab(args) {
  return rgb2lab(keyword2rgb(args));
}

function keyword2xyz(args) {
  return rgb2xyz(keyword2rgb(args));
}

var cssKeywords = {
  aliceblue:  [240,248,255],
  antiquewhite: [250,235,215],
  aqua: [0,255,255],
  aquamarine: [127,255,212],
  azure:  [240,255,255],
  beige:  [245,245,220],
  bisque: [255,228,196],
  black:  [0,0,0],
  blanchedalmond: [255,235,205],
  blue: [0,0,255],
  blueviolet: [138,43,226],
  brown:  [165,42,42],
  burlywood:  [222,184,135],
  cadetblue:  [95,158,160],
  chartreuse: [127,255,0],
  chocolate:  [210,105,30],
  coral:  [255,127,80],
  cornflowerblue: [100,149,237],
  cornsilk: [255,248,220],
  crimson:  [220,20,60],
  cyan: [0,255,255],
  darkblue: [0,0,139],
  darkcyan: [0,139,139],
  darkgoldenrod:  [184,134,11],
  darkgray: [169,169,169],
  darkgreen:  [0,100,0],
  darkgrey: [169,169,169],
  darkkhaki:  [189,183,107],
  darkmagenta:  [139,0,139],
  darkolivegreen: [85,107,47],
  darkorange: [255,140,0],
  darkorchid: [153,50,204],
  darkred:  [139,0,0],
  darksalmon: [233,150,122],
  darkseagreen: [143,188,143],
  darkslateblue:  [72,61,139],
  darkslategray:  [47,79,79],
  darkslategrey:  [47,79,79],
  darkturquoise:  [0,206,209],
  darkviolet: [148,0,211],
  deeppink: [255,20,147],
  deepskyblue:  [0,191,255],
  dimgray:  [105,105,105],
  dimgrey:  [105,105,105],
  dodgerblue: [30,144,255],
  firebrick:  [178,34,34],
  floralwhite:  [255,250,240],
  forestgreen:  [34,139,34],
  fuchsia:  [255,0,255],
  gainsboro:  [220,220,220],
  ghostwhite: [248,248,255],
  gold: [255,215,0],
  goldenrod:  [218,165,32],
  gray: [128,128,128],
  green:  [0,128,0],
  greenyellow:  [173,255,47],
  grey: [128,128,128],
  honeydew: [240,255,240],
  hotpink:  [255,105,180],
  indianred:  [205,92,92],
  indigo: [75,0,130],
  ivory:  [255,255,240],
  khaki:  [240,230,140],
  lavender: [230,230,250],
  lavenderblush:  [255,240,245],
  lawngreen:  [124,252,0],
  lemonchiffon: [255,250,205],
  lightblue:  [173,216,230],
  lightcoral: [240,128,128],
  lightcyan:  [224,255,255],
  lightgoldenrodyellow: [250,250,210],
  lightgray:  [211,211,211],
  lightgreen: [144,238,144],
  lightgrey:  [211,211,211],
  lightpink:  [255,182,193],
  lightsalmon:  [255,160,122],
  lightseagreen:  [32,178,170],
  lightskyblue: [135,206,250],
  lightslategray: [119,136,153],
  lightslategrey: [119,136,153],
  lightsteelblue: [176,196,222],
  lightyellow:  [255,255,224],
  lime: [0,255,0],
  limegreen:  [50,205,50],
  linen:  [250,240,230],
  magenta:  [255,0,255],
  maroon: [128,0,0],
  mediumaquamarine: [102,205,170],
  mediumblue: [0,0,205],
  mediumorchid: [186,85,211],
  mediumpurple: [147,112,219],
  mediumseagreen: [60,179,113],
  mediumslateblue:  [123,104,238],
  mediumspringgreen:  [0,250,154],
  mediumturquoise:  [72,209,204],
  mediumvioletred:  [199,21,133],
  midnightblue: [25,25,112],
  mintcream:  [245,255,250],
  mistyrose:  [255,228,225],
  moccasin: [255,228,181],
  navajowhite:  [255,222,173],
  navy: [0,0,128],
  oldlace:  [253,245,230],
  olive:  [128,128,0],
  olivedrab:  [107,142,35],
  orange: [255,165,0],
  orangered:  [255,69,0],
  orchid: [218,112,214],
  palegoldenrod:  [238,232,170],
  palegreen:  [152,251,152],
  paleturquoise:  [175,238,238],
  palevioletred:  [219,112,147],
  papayawhip: [255,239,213],
  peachpuff:  [255,218,185],
  peru: [205,133,63],
  pink: [255,192,203],
  plum: [221,160,221],
  powderblue: [176,224,230],
  purple: [128,0,128],
  rebeccapurple: [102, 51, 153],
  red:  [255,0,0],
  rosybrown:  [188,143,143],
  royalblue:  [65,105,225],
  saddlebrown:  [139,69,19],
  salmon: [250,128,114],
  sandybrown: [244,164,96],
  seagreen: [46,139,87],
  seashell: [255,245,238],
  sienna: [160,82,45],
  silver: [192,192,192],
  skyblue:  [135,206,235],
  slateblue:  [106,90,205],
  slategray:  [112,128,144],
  slategrey:  [112,128,144],
  snow: [255,250,250],
  springgreen:  [0,255,127],
  steelblue:  [70,130,180],
  tan:  [210,180,140],
  teal: [0,128,128],
  thistle:  [216,191,216],
  tomato: [255,99,71],
  turquoise:  [64,224,208],
  violet: [238,130,238],
  wheat:  [245,222,179],
  white:  [255,255,255],
  whitesmoke: [245,245,245],
  yellow: [255,255,0],
  yellowgreen:  [154,205,50]
};

var reverseKeywords = {};
for (var key in cssKeywords) {
  reverseKeywords[JSON.stringify(cssKeywords[key])] = key;
}

},{}],5:[function(require,module,exports){
var conversions = require(4);

var convert = function() {
   return new Converter();
}

for (var func in conversions) {
  // export Raw versions
  convert[func + "Raw"] =  (function(func) {
    // accept array or plain args
    return function(arg) {
      if (typeof arg == "number")
        arg = Array.prototype.slice.call(arguments);
      return conversions[func](arg);
    }
  })(func);

  var pair = /(\w+)2(\w+)/.exec(func),
      from = pair[1],
      to = pair[2];

  // export rgb2hsl and ["rgb"]["hsl"]
  convert[from] = convert[from] || {};

  convert[from][to] = convert[func] = (function(func) { 
    return function(arg) {
      if (typeof arg == "number")
        arg = Array.prototype.slice.call(arguments);
      
      var val = conversions[func](arg);
      if (typeof val == "string" || val === undefined)
        return val; // keyword

      for (var i = 0; i < val.length; i++)
        val[i] = Math.round(val[i]);
      return val;
    }
  })(func);
}


/* Converter does lazy conversion and caching */
var Converter = function() {
   this.convs = {};
};

/* Either get the values for a space or
  set the values for a space, depending on args */
Converter.prototype.routeSpace = function(space, args) {
   var values = args[0];
   if (values === undefined) {
      // color.rgb()
      return this.getValues(space);
   }
   // color.rgb(10, 10, 10)
   if (typeof values == "number") {
      values = Array.prototype.slice.call(args);        
   }

   return this.setValues(space, values);
};
  
/* Set the values for a space, invalidating cache */
Converter.prototype.setValues = function(space, values) {
   this.space = space;
   this.convs = {};
   this.convs[space] = values;
   return this;
};

/* Get the values for a space. If there's already
  a conversion for the space, fetch it, otherwise
  compute it */
Converter.prototype.getValues = function(space) {
   var vals = this.convs[space];
   if (!vals) {
      var fspace = this.space,
          from = this.convs[fspace];
      vals = convert[fspace][space](from);

      this.convs[space] = vals;
   }
  return vals;
};

["rgb", "hsl", "hsv", "cmyk", "keyword"].forEach(function(space) {
   Converter.prototype[space] = function(vals) {
      return this.routeSpace(space, arguments);
   }
});

module.exports = convert;
},{"4":4}],6:[function(require,module,exports){
'use strict'

module.exports = {
	"aliceblue": [240, 248, 255],
	"antiquewhite": [250, 235, 215],
	"aqua": [0, 255, 255],
	"aquamarine": [127, 255, 212],
	"azure": [240, 255, 255],
	"beige": [245, 245, 220],
	"bisque": [255, 228, 196],
	"black": [0, 0, 0],
	"blanchedalmond": [255, 235, 205],
	"blue": [0, 0, 255],
	"blueviolet": [138, 43, 226],
	"brown": [165, 42, 42],
	"burlywood": [222, 184, 135],
	"cadetblue": [95, 158, 160],
	"chartreuse": [127, 255, 0],
	"chocolate": [210, 105, 30],
	"coral": [255, 127, 80],
	"cornflowerblue": [100, 149, 237],
	"cornsilk": [255, 248, 220],
	"crimson": [220, 20, 60],
	"cyan": [0, 255, 255],
	"darkblue": [0, 0, 139],
	"darkcyan": [0, 139, 139],
	"darkgoldenrod": [184, 134, 11],
	"darkgray": [169, 169, 169],
	"darkgreen": [0, 100, 0],
	"darkgrey": [169, 169, 169],
	"darkkhaki": [189, 183, 107],
	"darkmagenta": [139, 0, 139],
	"darkolivegreen": [85, 107, 47],
	"darkorange": [255, 140, 0],
	"darkorchid": [153, 50, 204],
	"darkred": [139, 0, 0],
	"darksalmon": [233, 150, 122],
	"darkseagreen": [143, 188, 143],
	"darkslateblue": [72, 61, 139],
	"darkslategray": [47, 79, 79],
	"darkslategrey": [47, 79, 79],
	"darkturquoise": [0, 206, 209],
	"darkviolet": [148, 0, 211],
	"deeppink": [255, 20, 147],
	"deepskyblue": [0, 191, 255],
	"dimgray": [105, 105, 105],
	"dimgrey": [105, 105, 105],
	"dodgerblue": [30, 144, 255],
	"firebrick": [178, 34, 34],
	"floralwhite": [255, 250, 240],
	"forestgreen": [34, 139, 34],
	"fuchsia": [255, 0, 255],
	"gainsboro": [220, 220, 220],
	"ghostwhite": [248, 248, 255],
	"gold": [255, 215, 0],
	"goldenrod": [218, 165, 32],
	"gray": [128, 128, 128],
	"green": [0, 128, 0],
	"greenyellow": [173, 255, 47],
	"grey": [128, 128, 128],
	"honeydew": [240, 255, 240],
	"hotpink": [255, 105, 180],
	"indianred": [205, 92, 92],
	"indigo": [75, 0, 130],
	"ivory": [255, 255, 240],
	"khaki": [240, 230, 140],
	"lavender": [230, 230, 250],
	"lavenderblush": [255, 240, 245],
	"lawngreen": [124, 252, 0],
	"lemonchiffon": [255, 250, 205],
	"lightblue": [173, 216, 230],
	"lightcoral": [240, 128, 128],
	"lightcyan": [224, 255, 255],
	"lightgoldenrodyellow": [250, 250, 210],
	"lightgray": [211, 211, 211],
	"lightgreen": [144, 238, 144],
	"lightgrey": [211, 211, 211],
	"lightpink": [255, 182, 193],
	"lightsalmon": [255, 160, 122],
	"lightseagreen": [32, 178, 170],
	"lightskyblue": [135, 206, 250],
	"lightslategray": [119, 136, 153],
	"lightslategrey": [119, 136, 153],
	"lightsteelblue": [176, 196, 222],
	"lightyellow": [255, 255, 224],
	"lime": [0, 255, 0],
	"limegreen": [50, 205, 50],
	"linen": [250, 240, 230],
	"magenta": [255, 0, 255],
	"maroon": [128, 0, 0],
	"mediumaquamarine": [102, 205, 170],
	"mediumblue": [0, 0, 205],
	"mediumorchid": [186, 85, 211],
	"mediumpurple": [147, 112, 219],
	"mediumseagreen": [60, 179, 113],
	"mediumslateblue": [123, 104, 238],
	"mediumspringgreen": [0, 250, 154],
	"mediumturquoise": [72, 209, 204],
	"mediumvioletred": [199, 21, 133],
	"midnightblue": [25, 25, 112],
	"mintcream": [245, 255, 250],
	"mistyrose": [255, 228, 225],
	"moccasin": [255, 228, 181],
	"navajowhite": [255, 222, 173],
	"navy": [0, 0, 128],
	"oldlace": [253, 245, 230],
	"olive": [128, 128, 0],
	"olivedrab": [107, 142, 35],
	"orange": [255, 165, 0],
	"orangered": [255, 69, 0],
	"orchid": [218, 112, 214],
	"palegoldenrod": [238, 232, 170],
	"palegreen": [152, 251, 152],
	"paleturquoise": [175, 238, 238],
	"palevioletred": [219, 112, 147],
	"papayawhip": [255, 239, 213],
	"peachpuff": [255, 218, 185],
	"peru": [205, 133, 63],
	"pink": [255, 192, 203],
	"plum": [221, 160, 221],
	"powderblue": [176, 224, 230],
	"purple": [128, 0, 128],
	"rebeccapurple": [102, 51, 153],
	"red": [255, 0, 0],
	"rosybrown": [188, 143, 143],
	"royalblue": [65, 105, 225],
	"saddlebrown": [139, 69, 19],
	"salmon": [250, 128, 114],
	"sandybrown": [244, 164, 96],
	"seagreen": [46, 139, 87],
	"seashell": [255, 245, 238],
	"sienna": [160, 82, 45],
	"silver": [192, 192, 192],
	"skyblue": [135, 206, 235],
	"slateblue": [106, 90, 205],
	"slategray": [112, 128, 144],
	"slategrey": [112, 128, 144],
	"snow": [255, 250, 250],
	"springgreen": [0, 255, 127],
	"steelblue": [70, 130, 180],
	"tan": [210, 180, 140],
	"teal": [0, 128, 128],
	"thistle": [216, 191, 216],
	"tomato": [255, 99, 71],
	"turquoise": [64, 224, 208],
	"violet": [238, 130, 238],
	"wheat": [245, 222, 179],
	"white": [255, 255, 255],
	"whitesmoke": [245, 245, 245],
	"yellow": [255, 255, 0],
	"yellowgreen": [154, 205, 50]
};

},{}],7:[function(require,module,exports){
/**
 * @namespace Chart
 */
var Chart = require(29)();

Chart.helpers = require(45);

// @todo dispatch these helpers into appropriated helpers/helpers.* file and write unit tests!
require(27)(Chart);

Chart.defaults = require(25);
Chart.Element = require(26);
Chart.elements = require(40);
Chart.Interaction = require(28);
Chart.layouts = require(30);
Chart.platform = require(48);
Chart.plugins = require(31);
Chart.Ticks = require(34);

require(22)(Chart);
require(23)(Chart);
require(24)(Chart);
require(33)(Chart);
require(32)(Chart);
require(35)(Chart);

require(55)(Chart);
require(53)(Chart);
require(54)(Chart);
require(56)(Chart);
require(57)(Chart);
require(58)(Chart);

// Controllers must be loaded after elements
// See Chart.core.datasetController.dataElementType
require(15)(Chart);
require(16)(Chart);
require(17)(Chart);
require(18)(Chart);
require(19)(Chart);
require(20)(Chart);
require(21)(Chart);

require(8)(Chart);
require(9)(Chart);
require(10)(Chart);
require(11)(Chart);
require(12)(Chart);
require(13)(Chart);
require(14)(Chart);

// Loading built-it plugins
var plugins = require(49);
for (var k in plugins) {
	if (plugins.hasOwnProperty(k)) {
		Chart.plugins.register(plugins[k]);
	}
}

Chart.platform.initialize();

module.exports = Chart;
if (typeof window !== 'undefined') {
	window.Chart = Chart;
}

// DEPRECATIONS

/**
 * Provided for backward compatibility, not available anymore
 * @namespace Chart.Legend
 * @deprecated since version 2.1.5
 * @todo remove at version 3
 * @private
 */
Chart.Legend = plugins.legend._element;

/**
 * Provided for backward compatibility, not available anymore
 * @namespace Chart.Title
 * @deprecated since version 2.1.5
 * @todo remove at version 3
 * @private
 */
Chart.Title = plugins.title._element;

/**
 * Provided for backward compatibility, use Chart.plugins instead
 * @namespace Chart.pluginService
 * @deprecated since version 2.1.5
 * @todo remove at version 3
 * @private
 */
Chart.pluginService = Chart.plugins;

/**
 * Provided for backward compatibility, inheriting from Chart.PlugingBase has no
 * effect, instead simply create/register plugins via plain JavaScript objects.
 * @interface Chart.PluginBase
 * @deprecated since version 2.5.0
 * @todo remove at version 3
 * @private
 */
Chart.PluginBase = Chart.Element.extend({});

/**
 * Provided for backward compatibility, use Chart.helpers.canvas instead.
 * @namespace Chart.canvasHelpers
 * @deprecated since version 2.6.0
 * @todo remove at version 3
 * @private
 */
Chart.canvasHelpers = Chart.helpers.canvas;

/**
 * Provided for backward compatibility, use Chart.layouts instead.
 * @namespace Chart.layoutService
 * @deprecated since version 2.8.0
 * @todo remove at version 3
 * @private
 */
Chart.layoutService = Chart.layouts;

},{"10":10,"11":11,"12":12,"13":13,"14":14,"15":15,"16":16,"17":17,"18":18,"19":19,"20":20,"21":21,"22":22,"23":23,"24":24,"25":25,"26":26,"27":27,"28":28,"29":29,"30":30,"31":31,"32":32,"33":33,"34":34,"35":35,"40":40,"45":45,"48":48,"49":49,"53":53,"54":54,"55":55,"56":56,"57":57,"58":58,"8":8,"9":9}],8:[function(require,module,exports){
'use strict';

module.exports = function(Chart) {

	Chart.Bar = function(context, config) {
		config.type = 'bar';

		return new Chart(context, config);
	};

};

},{}],9:[function(require,module,exports){
'use strict';

module.exports = function(Chart) {

	Chart.Bubble = function(context, config) {
		config.type = 'bubble';
		return new Chart(context, config);
	};

};

},{}],10:[function(require,module,exports){
'use strict';

module.exports = function(Chart) {

	Chart.Doughnut = function(context, config) {
		config.type = 'doughnut';

		return new Chart(context, config);
	};

};

},{}],11:[function(require,module,exports){
'use strict';

module.exports = function(Chart) {

	Chart.Line = function(context, config) {
		config.type = 'line';

		return new Chart(context, config);
	};

};

},{}],12:[function(require,module,exports){
'use strict';

module.exports = function(Chart) {

	Chart.PolarArea = function(context, config) {
		config.type = 'polarArea';

		return new Chart(context, config);
	};

};

},{}],13:[function(require,module,exports){
'use strict';

module.exports = function(Chart) {

	Chart.Radar = function(context, config) {
		config.type = 'radar';

		return new Chart(context, config);
	};

};

},{}],14:[function(require,module,exports){
'use strict';

module.exports = function(Chart) {
	Chart.Scatter = function(context, config) {
		config.type = 'scatter';
		return new Chart(context, config);
	};
};

},{}],15:[function(require,module,exports){
'use strict';

var defaults = require(25);
var elements = require(40);
var helpers = require(45);

defaults._set('bar', {
	hover: {
		mode: 'label'
	},

	scales: {
		xAxes: [{
			type: 'category',

			// Specific to Bar Controller
			categoryPercentage: 0.8,
			barPercentage: 0.9,

			// offset settings
			offset: true,

			// grid line settings
			gridLines: {
				offsetGridLines: true
			}
		}],

		yAxes: [{
			type: 'linear'
		}]
	}
});

defaults._set('horizontalBar', {
	hover: {
		mode: 'index',
		axis: 'y'
	},

	scales: {
		xAxes: [{
			type: 'linear',
			position: 'bottom'
		}],

		yAxes: [{
			position: 'left',
			type: 'category',

			// Specific to Horizontal Bar Controller
			categoryPercentage: 0.8,
			barPercentage: 0.9,

			// offset settings
			offset: true,

			// grid line settings
			gridLines: {
				offsetGridLines: true
			}
		}]
	},

	elements: {
		rectangle: {
			borderSkipped: 'left'
		}
	},

	tooltips: {
		callbacks: {
			title: function(item, data) {
				// Pick first xLabel for now
				var title = '';

				if (item.length > 0) {
					if (item[0].yLabel) {
						title = item[0].yLabel;
					} else if (data.labels.length > 0 && item[0].index < data.labels.length) {
						title = data.labels[item[0].index];
					}
				}

				return title;
			},

			label: function(item, data) {
				var datasetLabel = data.datasets[item.datasetIndex].label || '';
				return datasetLabel + ': ' + item.xLabel;
			}
		},
		mode: 'index',
		axis: 'y'
	}
});

/**
 * Computes the "optimal" sample size to maintain bars equally sized while preventing overlap.
 * @private
 */
function computeMinSampleSize(scale, pixels) {
	var min = scale.isHorizontal() ? scale.width : scale.height;
	var ticks = scale.getTicks();
	var prev, curr, i, ilen;

	for (i = 1, ilen = pixels.length; i < ilen; ++i) {
		min = Math.min(min, pixels[i] - pixels[i - 1]);
	}

	for (i = 0, ilen = ticks.length; i < ilen; ++i) {
		curr = scale.getPixelForTick(i);
		min = i > 0 ? Math.min(min, curr - prev) : min;
		prev = curr;
	}

	return min;
}

/**
 * Computes an "ideal" category based on the absolute bar thickness or, if undefined or null,
 * uses the smallest interval (see computeMinSampleSize) that prevents bar overlapping. This
 * mode currently always generates bars equally sized (until we introduce scriptable options?).
 * @private
 */
function computeFitCategoryTraits(index, ruler, options) {
	var thickness = options.barThickness;
	var count = ruler.stackCount;
	var curr = ruler.pixels[index];
	var size, ratio;

	if (helpers.isNullOrUndef(thickness)) {
		size = ruler.min * options.categoryPercentage;
		ratio = options.barPercentage;
	} else {
		// When bar thickness is enforced, category and bar percentages are ignored.
		// Note(SB): we could add support for relative bar thickness (e.g. barThickness: '50%')
		// and deprecate barPercentage since this value is ignored when thickness is absolute.
		size = thickness * count;
		ratio = 1;
	}

	return {
		chunk: size / count,
		ratio: ratio,
		start: curr - (size / 2)
	};
}

/**
 * Computes an "optimal" category that globally arranges bars side by side (no gap when
 * percentage options are 1), based on the previous and following categories. This mode
 * generates bars with different widths when data are not evenly spaced.
 * @private
 */
function computeFlexCategoryTraits(index, ruler, options) {
	var pixels = ruler.pixels;
	var curr = pixels[index];
	var prev = index > 0 ? pixels[index - 1] : null;
	var next = index < pixels.length - 1 ? pixels[index + 1] : null;
	var percent = options.categoryPercentage;
	var start, size;

	if (prev === null) {
		// first data: its size is double based on the next point or,
		// if it's also the last data, we use the scale end extremity.
		prev = curr - (next === null ? ruler.end - curr : next - curr);
	}

	if (next === null) {
		// last data: its size is also double based on the previous point.
		next = curr + curr - prev;
	}

	start = curr - ((curr - prev) / 2) * percent;
	size = ((next - prev) / 2) * percent;

	return {
		chunk: size / ruler.stackCount,
		ratio: options.barPercentage,
		start: start
	};
}

module.exports = function(Chart) {

	Chart.controllers.bar = Chart.DatasetController.extend({

		dataElementType: elements.Rectangle,

		initialize: function() {
			var me = this;
			var meta;

			Chart.DatasetController.prototype.initialize.apply(me, arguments);

			meta = me.getMeta();
			meta.stack = me.getDataset().stack;
			meta.bar = true;
		},

		update: function(reset) {
			var me = this;
			var rects = me.getMeta().data;
			var i, ilen;

			me._ruler = me.getRuler();

			for (i = 0, ilen = rects.length; i < ilen; ++i) {
				me.updateElement(rects[i], i, reset);
			}
		},

		updateElement: function(rectangle, index, reset) {
			var me = this;
			var chart = me.chart;
			var meta = me.getMeta();
			var dataset = me.getDataset();
			var custom = rectangle.custom || {};
			var rectangleOptions = chart.options.elements.rectangle;

			rectangle._xScale = me.getScaleForId(meta.xAxisID);
			rectangle._yScale = me.getScaleForId(meta.yAxisID);
			rectangle._datasetIndex = me.index;
			rectangle._index = index;

			rectangle._model = {
				datasetLabel: dataset.label,
				label: chart.data.labels[index],
				borderSkipped: custom.borderSkipped ? custom.borderSkipped : rectangleOptions.borderSkipped,
				backgroundColor: custom.backgroundColor ? custom.backgroundColor : helpers.valueAtIndexOrDefault(dataset.backgroundColor, index, rectangleOptions.backgroundColor),
				borderColor: custom.borderColor ? custom.borderColor : helpers.valueAtIndexOrDefault(dataset.borderColor, index, rectangleOptions.borderColor),
				borderWidth: custom.borderWidth ? custom.borderWidth : helpers.valueAtIndexOrDefault(dataset.borderWidth, index, rectangleOptions.borderWidth)
			};

			me.updateElementGeometry(rectangle, index, reset);

			rectangle.pivot();
		},

		/**
		 * @private
		 */
		updateElementGeometry: function(rectangle, index, reset) {
			var me = this;
			var model = rectangle._model;
			var vscale = me.getValueScale();
			var base = vscale.getBasePixel();
			var horizontal = vscale.isHorizontal();
			var ruler = me._ruler || me.getRuler();
			var vpixels = me.calculateBarValuePixels(me.index, index);
			var ipixels = me.calculateBarIndexPixels(me.index, index, ruler);

			model.horizontal = horizontal;
			model.base = reset ? base : vpixels.base;
			model.x = horizontal ? reset ? base : vpixels.head : ipixels.center;
			model.y = horizontal ? ipixels.center : reset ? base : vpixels.head;
			model.height = horizontal ? ipixels.size : undefined;
			model.width = horizontal ? undefined : ipixels.size;
		},

		/**
		 * @private
		 */
		getValueScaleId: function() {
			return this.getMeta().yAxisID;
		},

		/**
		 * @private
		 */
		getIndexScaleId: function() {
			return this.getMeta().xAxisID;
		},

		/**
		 * @private
		 */
		getValueScale: function() {
			return this.getScaleForId(this.getValueScaleId());
		},

		/**
		 * @private
		 */
		getIndexScale: function() {
			return this.getScaleForId(this.getIndexScaleId());
		},

		/**
		 * Returns the stacks based on groups and bar visibility.
		 * @param {Number} [last] - The dataset index
		 * @returns {Array} The stack list
		 * @private
		 */
		_getStacks: function(last) {
			var me = this;
			var chart = me.chart;
			var scale = me.getIndexScale();
			var stacked = scale.options.stacked;
			var ilen = last === undefined ? chart.data.datasets.length : last + 1;
			var stacks = [];
			var i, meta;

			for (i = 0; i < ilen; ++i) {
				meta = chart.getDatasetMeta(i);
				if (meta.bar && chart.isDatasetVisible(i) &&
					(stacked === false ||
					(stacked === true && stacks.indexOf(meta.stack) === -1) ||
					(stacked === undefined && (meta.stack === undefined || stacks.indexOf(meta.stack) === -1)))) {
					stacks.push(meta.stack);
				}
			}

			return stacks;
		},

		/**
		 * Returns the effective number of stacks based on groups and bar visibility.
		 * @private
		 */
		getStackCount: function() {
			return this._getStacks().length;
		},

		/**
		 * Returns the stack index for the given dataset based on groups and bar visibility.
		 * @param {Number} [datasetIndex] - The dataset index
		 * @param {String} [name] - The stack name to find
		 * @returns {Number} The stack index
		 * @private
		 */
		getStackIndex: function(datasetIndex, name) {
			var stacks = this._getStacks(datasetIndex);
			var index = (name !== undefined)
				? stacks.indexOf(name)
				: -1; // indexOf returns -1 if element is not present

			return (index === -1)
				? stacks.length - 1
				: index;
		},

		/**
		 * @private
		 */
		getRuler: function() {
			var me = this;
			var scale = me.getIndexScale();
			var stackCount = me.getStackCount();
			var datasetIndex = me.index;
			var isHorizontal = scale.isHorizontal();
			var start = isHorizontal ? scale.left : scale.top;
			var end = start + (isHorizontal ? scale.width : scale.height);
			var pixels = [];
			var i, ilen, min;

			for (i = 0, ilen = me.getMeta().data.length; i < ilen; ++i) {
				pixels.push(scale.getPixelForValue(null, i, datasetIndex));
			}

			min = helpers.isNullOrUndef(scale.options.barThickness)
				? computeMinSampleSize(scale, pixels)
				: -1;

			return {
				min: min,
				pixels: pixels,
				start: start,
				end: end,
				stackCount: stackCount,
				scale: scale
			};
		},

		/**
		 * Note: pixel values are not clamped to the scale area.
		 * @private
		 */
		calculateBarValuePixels: function(datasetIndex, index) {
			var me = this;
			var chart = me.chart;
			var meta = me.getMeta();
			var scale = me.getValueScale();
			var datasets = chart.data.datasets;
			var value = scale.getRightValue(datasets[datasetIndex].data[index]);
			var stacked = scale.options.stacked;
			var stack = meta.stack;
			var start = 0;
			var i, imeta, ivalue, base, head, size;

			if (stacked || (stacked === undefined && stack !== undefined)) {
				for (i = 0; i < datasetIndex; ++i) {
					imeta = chart.getDatasetMeta(i);

					if (imeta.bar &&
						imeta.stack === stack &&
						imeta.controller.getValueScaleId() === scale.id &&
						chart.isDatasetVisible(i)) {

						ivalue = scale.getRightValue(datasets[i].data[index]);
						if ((value < 0 && ivalue < 0) || (value >= 0 && ivalue > 0)) {
							start += ivalue;
						}
					}
				}
			}

			base = scale.getPixelForValue(start);
			head = scale.getPixelForValue(start + value);
			size = (head - base) / 2;

			return {
				size: size,
				base: base,
				head: head,
				center: head + size / 2
			};
		},

		/**
		 * @private
		 */
		calculateBarIndexPixels: function(datasetIndex, index, ruler) {
			var me = this;
			var options = ruler.scale.options;
			var range = options.barThickness === 'flex'
				? computeFlexCategoryTraits(index, ruler, options)
				: computeFitCategoryTraits(index, ruler, options);

			var stackIndex = me.getStackIndex(datasetIndex, me.getMeta().stack);
			var center = range.start + (range.chunk * stackIndex) + (range.chunk / 2);
			var size = Math.min(
				helpers.valueOrDefault(options.maxBarThickness, Infinity),
				range.chunk * range.ratio);

			return {
				base: center - size / 2,
				head: center + size / 2,
				center: center,
				size: size
			};
		},

		draw: function() {
			var me = this;
			var chart = me.chart;
			var scale = me.getValueScale();
			var rects = me.getMeta().data;
			var dataset = me.getDataset();
			var ilen = rects.length;
			var i = 0;

			helpers.canvas.clipArea(chart.ctx, chart.chartArea);

			for (; i < ilen; ++i) {
				if (!isNaN(scale.getRightValue(dataset.data[i]))) {
					rects[i].draw();
				}
			}

			helpers.canvas.unclipArea(chart.ctx);
		},

		setHoverStyle: function(rectangle) {
			var dataset = this.chart.data.datasets[rectangle._datasetIndex];
			var index = rectangle._index;
			var custom = rectangle.custom || {};
			var model = rectangle._model;

			model.backgroundColor = custom.hoverBackgroundColor ? custom.hoverBackgroundColor : helpers.valueAtIndexOrDefault(dataset.hoverBackgroundColor, index, helpers.getHoverColor(model.backgroundColor));
			model.borderColor = custom.hoverBorderColor ? custom.hoverBorderColor : helpers.valueAtIndexOrDefault(dataset.hoverBorderColor, index, helpers.getHoverColor(model.borderColor));
			model.borderWidth = custom.hoverBorderWidth ? custom.hoverBorderWidth : helpers.valueAtIndexOrDefault(dataset.hoverBorderWidth, index, model.borderWidth);
		},

		removeHoverStyle: function(rectangle) {
			var dataset = this.chart.data.datasets[rectangle._datasetIndex];
			var index = rectangle._index;
			var custom = rectangle.custom || {};
			var model = rectangle._model;
			var rectangleElementOptions = this.chart.options.elements.rectangle;

			model.backgroundColor = custom.backgroundColor ? custom.backgroundColor : helpers.valueAtIndexOrDefault(dataset.backgroundColor, index, rectangleElementOptions.backgroundColor);
			model.borderColor = custom.borderColor ? custom.borderColor : helpers.valueAtIndexOrDefault(dataset.borderColor, index, rectangleElementOptions.borderColor);
			model.borderWidth = custom.borderWidth ? custom.borderWidth : helpers.valueAtIndexOrDefault(dataset.borderWidth, index, rectangleElementOptions.borderWidth);
		}
	});

	Chart.controllers.horizontalBar = Chart.controllers.bar.extend({
		/**
		 * @private
		 */
		getValueScaleId: function() {
			return this.getMeta().xAxisID;
		},

		/**
		 * @private
		 */
		getIndexScaleId: function() {
			return this.getMeta().yAxisID;
		}
	});
};

},{"25":25,"40":40,"45":45}],16:[function(require,module,exports){
'use strict';

var defaults = require(25);
var elements = require(40);
var helpers = require(45);

defaults._set('bubble', {
	hover: {
		mode: 'single'
	},

	scales: {
		xAxes: [{
			type: 'linear', // bubble should probably use a linear scale by default
			position: 'bottom',
			id: 'x-axis-0' // need an ID so datasets can reference the scale
		}],
		yAxes: [{
			type: 'linear',
			position: 'left',
			id: 'y-axis-0'
		}]
	},

	tooltips: {
		callbacks: {
			title: function() {
				// Title doesn't make sense for scatter since we format the data as a point
				return '';
			},
			label: function(item, data) {
				var datasetLabel = data.datasets[item.datasetIndex].label || '';
				var dataPoint = data.datasets[item.datasetIndex].data[item.index];
				return datasetLabel + ': (' + item.xLabel + ', ' + item.yLabel + ', ' + dataPoint.r + ')';
			}
		}
	}
});


module.exports = function(Chart) {

	Chart.controllers.bubble = Chart.DatasetController.extend({
		/**
		 * @protected
		 */
		dataElementType: elements.Point,

		/**
		 * @protected
		 */
		update: function(reset) {
			var me = this;
			var meta = me.getMeta();
			var points = meta.data;

			// Update Points
			helpers.each(points, function(point, index) {
				me.updateElement(point, index, reset);
			});
		},

		/**
		 * @protected
		 */
		updateElement: function(point, index, reset) {
			var me = this;
			var meta = me.getMeta();
			var custom = point.custom || {};
			var xScale = me.getScaleForId(meta.xAxisID);
			var yScale = me.getScaleForId(meta.yAxisID);
			var options = me._resolveElementOptions(point, index);
			var data = me.getDataset().data[index];
			var dsIndex = me.index;

			var x = reset ? xScale.getPixelForDecimal(0.5) : xScale.getPixelForValue(typeof data === 'object' ? data : NaN, index, dsIndex);
			var y = reset ? yScale.getBasePixel() : yScale.getPixelForValue(data, index, dsIndex);

			point._xScale = xScale;
			point._yScale = yScale;
			point._options = options;
			point._datasetIndex = dsIndex;
			point._index = index;
			point._model = {
				backgroundColor: options.backgroundColor,
				borderColor: options.borderColor,
				borderWidth: options.borderWidth,
				hitRadius: options.hitRadius,
				pointStyle: options.pointStyle,
				radius: reset ? 0 : options.radius,
				skip: custom.skip || isNaN(x) || isNaN(y),
				x: x,
				y: y,
			};

			point.pivot();
		},

		/**
		 * @protected
		 */
		setHoverStyle: function(point) {
			var model = point._model;
			var options = point._options;

			model.backgroundColor = helpers.valueOrDefault(options.hoverBackgroundColor, helpers.getHoverColor(options.backgroundColor));
			model.borderColor = helpers.valueOrDefault(options.hoverBorderColor, helpers.getHoverColor(options.borderColor));
			model.borderWidth = helpers.valueOrDefault(options.hoverBorderWidth, options.borderWidth);
			model.radius = options.radius + options.hoverRadius;
		},

		/**
		 * @protected
		 */
		removeHoverStyle: function(point) {
			var model = point._model;
			var options = point._options;

			model.backgroundColor = options.backgroundColor;
			model.borderColor = options.borderColor;
			model.borderWidth = options.borderWidth;
			model.radius = options.radius;
		},

		/**
		 * @private
		 */
		_resolveElementOptions: function(point, index) {
			var me = this;
			var chart = me.chart;
			var datasets = chart.data.datasets;
			var dataset = datasets[me.index];
			var custom = point.custom || {};
			var options = chart.options.elements.point;
			var resolve = helpers.options.resolve;
			var data = dataset.data[index];
			var values = {};
			var i, ilen, key;

			// Scriptable options
			var context = {
				chart: chart,
				dataIndex: index,
				dataset: dataset,
				datasetIndex: me.index
			};

			var keys = [
				'backgroundColor',
				'borderColor',
				'borderWidth',
				'hoverBackgroundColor',
				'hoverBorderColor',
				'hoverBorderWidth',
				'hoverRadius',
				'hitRadius',
				'pointStyle'
			];

			for (i = 0, ilen = keys.length; i < ilen; ++i) {
				key = keys[i];
				values[key] = resolve([
					custom[key],
					dataset[key],
					options[key]
				], context, index);
			}

			// Custom radius resolution
			values.radius = resolve([
				custom.radius,
				data ? data.r : undefined,
				dataset.radius,
				options.radius
			], context, index);

			return values;
		}
	});
};

},{"25":25,"40":40,"45":45}],17:[function(require,module,exports){
'use strict';

var defaults = require(25);
var elements = require(40);
var helpers = require(45);

defaults._set('doughnut', {
	animation: {
		// Boolean - Whether we animate the rotation of the Doughnut
		animateRotate: true,
		// Boolean - Whether we animate scaling the Doughnut from the centre
		animateScale: false
	},
	hover: {
		mode: 'single'
	},
	legendCallback: function(chart) {
		var text = [];
		text.push('<ul class="' + chart.id + '-legend">');

		var data = chart.data;
		var datasets = data.datasets;
		var labels = data.labels;

		if (datasets.length) {
			for (var i = 0; i < datasets[0].data.length; ++i) {
				text.push('<li><span style="background-color:' + datasets[0].backgroundColor[i] + '"></span>');
				if (labels[i]) {
					text.push(labels[i]);
				}
				text.push('</li>');
			}
		}

		text.push('</ul>');
		return text.join('');
	},
	legend: {
		labels: {
			generateLabels: function(chart) {
				var data = chart.data;
				if (data.labels.length && data.datasets.length) {
					return data.labels.map(function(label, i) {
						var meta = chart.getDatasetMeta(0);
						var ds = data.datasets[0];
						var arc = meta.data[i];
						var custom = arc && arc.custom || {};
						var valueAtIndexOrDefault = helpers.valueAtIndexOrDefault;
						var arcOpts = chart.options.elements.arc;
						var fill = custom.backgroundColor ? custom.backgroundColor : valueAtIndexOrDefault(ds.backgroundColor, i, arcOpts.backgroundColor);
						var stroke = custom.borderColor ? custom.borderColor : valueAtIndexOrDefault(ds.borderColor, i, arcOpts.borderColor);
						var bw = custom.borderWidth ? custom.borderWidth : valueAtIndexOrDefault(ds.borderWidth, i, arcOpts.borderWidth);

						return {
							text: label,
							fillStyle: fill,
							strokeStyle: stroke,
							lineWidth: bw,
							hidden: isNaN(ds.data[i]) || meta.data[i].hidden,

							// Extra data used for toggling the correct item
							index: i
						};
					});
				}
				return [];
			}
		},

		onClick: function(e, legendItem) {
			var index = legendItem.index;
			var chart = this.chart;
			var i, ilen, meta;

			for (i = 0, ilen = (chart.data.datasets || []).length; i < ilen; ++i) {
				meta = chart.getDatasetMeta(i);
				// toggle visibility of index if exists
				if (meta.data[index]) {
					meta.data[index].hidden = !meta.data[index].hidden;
				}
			}

			chart.update();
		}
	},

	// The percentage of the chart that we cut out of the middle.
	cutoutPercentage: 50,

	// The rotation of the chart, where the first data arc begins.
	rotation: Math.PI * -0.5,

	// The total circumference of the chart.
	circumference: Math.PI * 2.0,

	// Need to override these to give a nice default
	tooltips: {
		callbacks: {
			title: function() {
				return '';
			},
			label: function(tooltipItem, data) {
				var dataLabel = data.labels[tooltipItem.index];
				var value = ': ' + data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];

				if (helpers.isArray(dataLabel)) {
					// show value on first line of multiline label
					// need to clone because we are changing the value
					dataLabel = dataLabel.slice();
					dataLabel[0] += value;
				} else {
					dataLabel += value;
				}

				return dataLabel;
			}
		}
	}
});

defaults._set('pie', helpers.clone(defaults.doughnut));
defaults._set('pie', {
	cutoutPercentage: 0
});

module.exports = function(Chart) {

	Chart.controllers.doughnut = Chart.controllers.pie = Chart.DatasetController.extend({

		dataElementType: elements.Arc,

		linkScales: helpers.noop,

		// Get index of the dataset in relation to the visible datasets. This allows determining the inner and outer radius correctly
		getRingIndex: function(datasetIndex) {
			var ringIndex = 0;

			for (var j = 0; j < datasetIndex; ++j) {
				if (this.chart.isDatasetVisible(j)) {
					++ringIndex;
				}
			}

			return ringIndex;
		},

		update: function(reset) {
			var me = this;
			var chart = me.chart;
			var chartArea = chart.chartArea;
			var opts = chart.options;
			var arcOpts = opts.elements.arc;
			var availableWidth = chartArea.right - chartArea.left - arcOpts.borderWidth;
			var availableHeight = chartArea.bottom - chartArea.top - arcOpts.borderWidth;
			var minSize = Math.min(availableWidth, availableHeight);
			var offset = {x: 0, y: 0};
			var meta = me.getMeta();
			var cutoutPercentage = opts.cutoutPercentage;
			var circumference = opts.circumference;

			// If the chart's circumference isn't a full circle, calculate minSize as a ratio of the width/height of the arc
			if (circumference < Math.PI * 2.0) {
				var startAngle = opts.rotation % (Math.PI * 2.0);
				startAngle += Math.PI * 2.0 * (startAngle >= Math.PI ? -1 : startAngle < -Math.PI ? 1 : 0);
				var endAngle = startAngle + circumference;
				var start = {x: Math.cos(startAngle), y: Math.sin(startAngle)};
				var end = {x: Math.cos(endAngle), y: Math.sin(endAngle)};
				var contains0 = (startAngle <= 0 && endAngle >= 0) || (startAngle <= Math.PI * 2.0 && Math.PI * 2.0 <= endAngle);
				var contains90 = (startAngle <= Math.PI * 0.5 && Math.PI * 0.5 <= endAngle) || (startAngle <= Math.PI * 2.5 && Math.PI * 2.5 <= endAngle);
				var contains180 = (startAngle <= -Math.PI && -Math.PI <= endAngle) || (startAngle <= Math.PI && Math.PI <= endAngle);
				var contains270 = (startAngle <= -Math.PI * 0.5 && -Math.PI * 0.5 <= endAngle) || (startAngle <= Math.PI * 1.5 && Math.PI * 1.5 <= endAngle);
				var cutout = cutoutPercentage / 100.0;
				var min = {x: contains180 ? -1 : Math.min(start.x * (start.x < 0 ? 1 : cutout), end.x * (end.x < 0 ? 1 : cutout)), y: contains270 ? -1 : Math.min(start.y * (start.y < 0 ? 1 : cutout), end.y * (end.y < 0 ? 1 : cutout))};
				var max = {x: contains0 ? 1 : Math.max(start.x * (start.x > 0 ? 1 : cutout), end.x * (end.x > 0 ? 1 : cutout)), y: contains90 ? 1 : Math.max(start.y * (start.y > 0 ? 1 : cutout), end.y * (end.y > 0 ? 1 : cutout))};
				var size = {width: (max.x - min.x) * 0.5, height: (max.y - min.y) * 0.5};
				minSize = Math.min(availableWidth / size.width, availableHeight / size.height);
				offset = {x: (max.x + min.x) * -0.5, y: (max.y + min.y) * -0.5};
			}

			chart.borderWidth = me.getMaxBorderWidth(meta.data);
			chart.outerRadius = Math.max((minSize - chart.borderWidth) / 2, 0);
			chart.innerRadius = Math.max(cutoutPercentage ? (chart.outerRadius / 100) * (cutoutPercentage) : 0, 0);
			chart.radiusLength = (chart.outerRadius - chart.innerRadius) / chart.getVisibleDatasetCount();
			chart.offsetX = offset.x * chart.outerRadius;
			chart.offsetY = offset.y * chart.outerRadius;

			meta.total = me.calculateTotal();

			me.outerRadius = chart.outerRadius - (chart.radiusLength * me.getRingIndex(me.index));
			me.innerRadius = Math.max(me.outerRadius - chart.radiusLength, 0);

			helpers.each(meta.data, function(arc, index) {
				me.updateElement(arc, index, reset);
			});
		},

		updateElement: function(arc, index, reset) {
			var me = this;
			var chart = me.chart;
			var chartArea = chart.chartArea;
			var opts = chart.options;
			var animationOpts = opts.animation;
			var centerX = (chartArea.left + chartArea.right) / 2;
			var centerY = (chartArea.top + chartArea.bottom) / 2;
			var startAngle = opts.rotation; // non reset case handled later
			var endAngle = opts.rotation; // non reset case handled later
			var dataset = me.getDataset();
			var circumference = reset && animationOpts.animateRotate ? 0 : arc.hidden ? 0 : me.calculateCircumference(dataset.data[index]) * (opts.circumference / (2.0 * Math.PI));
			var innerRadius = reset && animationOpts.animateScale ? 0 : me.innerRadius;
			var outerRadius = reset && animationOpts.animateScale ? 0 : me.outerRadius;
			var valueAtIndexOrDefault = helpers.valueAtIndexOrDefault;

			helpers.extend(arc, {
				// Utility
				_datasetIndex: me.index,
				_index: index,

				// Desired view properties
				_model: {
					x: centerX + chart.offsetX,
					y: centerY + chart.offsetY,
					startAngle: startAngle,
					endAngle: endAngle,
					circumference: circumference,
					outerRadius: outerRadius,
					innerRadius: innerRadius,
					label: valueAtIndexOrDefault(dataset.label, index, chart.data.labels[index])
				}
			});

			var model = arc._model;
			// Resets the visual styles
			this.removeHoverStyle(arc);

			// Set correct angles if not resetting
			if (!reset || !animationOpts.animateRotate) {
				if (index === 0) {
					model.startAngle = opts.rotation;
				} else {
					model.startAngle = me.getMeta().data[index - 1]._model.endAngle;
				}

				model.endAngle = model.startAngle + model.circumference;
			}

			arc.pivot();
		},

		removeHoverStyle: function(arc) {
			Chart.DatasetController.prototype.removeHoverStyle.call(this, arc, this.chart.options.elements.arc);
		},

		calculateTotal: function() {
			var dataset = this.getDataset();
			var meta = this.getMeta();
			var total = 0;
			var value;

			helpers.each(meta.data, function(element, index) {
				value = dataset.data[index];
				if (!isNaN(value) && !element.hidden) {
					total += Math.abs(value);
				}
			});

			/* if (total === 0) {
				total = NaN;
			}*/

			return total;
		},

		calculateCircumference: function(value) {
			var total = this.getMeta().total;
			if (total > 0 && !isNaN(value)) {
				return (Math.PI * 2.0) * (Math.abs(value) / total);
			}
			return 0;
		},

		// gets the max border or hover width to properly scale pie charts
		getMaxBorderWidth: function(arcs) {
			var max = 0;
			var index = this.index;
			var length = arcs.length;
			var borderWidth;
			var hoverWidth;

			for (var i = 0; i < length; i++) {
				borderWidth = arcs[i]._model ? arcs[i]._model.borderWidth : 0;
				hoverWidth = arcs[i]._chart ? arcs[i]._chart.config.data.datasets[index].hoverBorderWidth : 0;

				max = borderWidth > max ? borderWidth : max;
				max = hoverWidth > max ? hoverWidth : max;
			}
			return max;
		}
	});
};

},{"25":25,"40":40,"45":45}],18:[function(require,module,exports){
'use strict';

var defaults = require(25);
var elements = require(40);
var helpers = require(45);

defaults._set('line', {
	showLines: true,
	spanGaps: false,

	hover: {
		mode: 'label'
	},

	scales: {
		xAxes: [{
			type: 'category',
			id: 'x-axis-0'
		}],
		yAxes: [{
			type: 'linear',
			id: 'y-axis-0'
		}]
	}
});

module.exports = function(Chart) {

	function lineEnabled(dataset, options) {
		return helpers.valueOrDefault(dataset.showLine, options.showLines);
	}

	Chart.controllers.line = Chart.DatasetController.extend({

		datasetElementType: elements.Line,

		dataElementType: elements.Point,

		update: function(reset) {
			var me = this;
			var meta = me.getMeta();
			var line = meta.dataset;
			var points = meta.data || [];
			var options = me.chart.options;
			var lineElementOptions = options.elements.line;
			var scale = me.getScaleForId(meta.yAxisID);
			var i, ilen, custom;
			var dataset = me.getDataset();
			var showLine = lineEnabled(dataset, options);

			// Update Line
			if (showLine) {
				custom = line.custom || {};

				// Compatibility: If the properties are defined with only the old name, use those values
				if ((dataset.tension !== undefined) && (dataset.lineTension === undefined)) {
					dataset.lineTension = dataset.tension;
				}

				// Utility
				line._scale = scale;
				line._datasetIndex = me.index;
				// Data
				line._children = points;
				// Model
				line._model = {
					// Appearance
					// The default behavior of lines is to break at null values, according
					// to https://github.com/chartjs/Chart.js/issues/2435#issuecomment-216718158
					// This option gives lines the ability to span gaps
					spanGaps: dataset.spanGaps ? dataset.spanGaps : options.spanGaps,
					tension: custom.tension ? custom.tension : helpers.valueOrDefault(dataset.lineTension, lineElementOptions.tension),
					backgroundColor: custom.backgroundColor ? custom.backgroundColor : (dataset.backgroundColor || lineElementOptions.backgroundColor),
					borderWidth: custom.borderWidth ? custom.borderWidth : (dataset.borderWidth || lineElementOptions.borderWidth),
					borderColor: custom.borderColor ? custom.borderColor : (dataset.borderColor || lineElementOptions.borderColor),
					borderCapStyle: custom.borderCapStyle ? custom.borderCapStyle : (dataset.borderCapStyle || lineElementOptions.borderCapStyle),
					borderDash: custom.borderDash ? custom.borderDash : (dataset.borderDash || lineElementOptions.borderDash),
					borderDashOffset: custom.borderDashOffset ? custom.borderDashOffset : (dataset.borderDashOffset || lineElementOptions.borderDashOffset),
					borderJoinStyle: custom.borderJoinStyle ? custom.borderJoinStyle : (dataset.borderJoinStyle || lineElementOptions.borderJoinStyle),
					fill: custom.fill ? custom.fill : (dataset.fill !== undefined ? dataset.fill : lineElementOptions.fill),
					steppedLine: custom.steppedLine ? custom.steppedLine : helpers.valueOrDefault(dataset.steppedLine, lineElementOptions.stepped),
					cubicInterpolationMode: custom.cubicInterpolationMode ? custom.cubicInterpolationMode : helpers.valueOrDefault(dataset.cubicInterpolationMode, lineElementOptions.cubicInterpolationMode),
				};

				line.pivot();
			}

			// Update Points
			for (i = 0, ilen = points.length; i < ilen; ++i) {
				me.updateElement(points[i], i, reset);
			}

			if (showLine && line._model.tension !== 0) {
				me.updateBezierControlPoints();
			}

			// Now pivot the point for animation
			for (i = 0, ilen = points.length; i < ilen; ++i) {
				points[i].pivot();
			}
		},

		getPointBackgroundColor: function(point, index) {
			var backgroundColor = this.chart.options.elements.point.backgroundColor;
			var dataset = this.getDataset();
			var custom = point.custom || {};

			if (custom.backgroundColor) {
				backgroundColor = custom.backgroundColor;
			} else if (dataset.pointBackgroundColor) {
				backgroundColor = helpers.valueAtIndexOrDefault(dataset.pointBackgroundColor, index, backgroundColor);
			} else if (dataset.backgroundColor) {
				backgroundColor = dataset.backgroundColor;
			}

			return backgroundColor;
		},

		getPointBorderColor: function(point, index) {
			var borderColor = this.chart.options.elements.point.borderColor;
			var dataset = this.getDataset();
			var custom = point.custom || {};

			if (custom.borderColor) {
				borderColor = custom.borderColor;
			} else if (dataset.pointBorderColor) {
				borderColor = helpers.valueAtIndexOrDefault(dataset.pointBorderColor, index, borderColor);
			} else if (dataset.borderColor) {
				borderColor = dataset.borderColor;
			}

			return borderColor;
		},

		getPointBorderWidth: function(point, index) {
			var borderWidth = this.chart.options.elements.point.borderWidth;
			var dataset = this.getDataset();
			var custom = point.custom || {};

			if (!isNaN(custom.borderWidth)) {
				borderWidth = custom.borderWidth;
			} else if (!isNaN(dataset.pointBorderWidth) || helpers.isArray(dataset.pointBorderWidth)) {
				borderWidth = helpers.valueAtIndexOrDefault(dataset.pointBorderWidth, index, borderWidth);
			} else if (!isNaN(dataset.borderWidth)) {
				borderWidth = dataset.borderWidth;
			}

			return borderWidth;
		},

		updateElement: function(point, index, reset) {
			var me = this;
			var meta = me.getMeta();
			var custom = point.custom || {};
			var dataset = me.getDataset();
			var datasetIndex = me.index;
			var value = dataset.data[index];
			var yScale = me.getScaleForId(meta.yAxisID);
			var xScale = me.getScaleForId(meta.xAxisID);
			var pointOptions = me.chart.options.elements.point;
			var x, y;

			// Compatibility: If the properties are defined with only the old name, use those values
			if ((dataset.radius !== undefined) && (dataset.pointRadius === undefined)) {
				dataset.pointRadius = dataset.radius;
			}
			if ((dataset.hitRadius !== undefined) && (dataset.pointHitRadius === undefined)) {
				dataset.pointHitRadius = dataset.hitRadius;
			}

			x = xScale.getPixelForValue(typeof value === 'object' ? value : NaN, index, datasetIndex);
			y = reset ? yScale.getBasePixel() : me.calculatePointY(value, index, datasetIndex);

			// Utility
			point._xScale = xScale;
			point._yScale = yScale;
			point._datasetIndex = datasetIndex;
			point._index = index;

			// Desired view properties
			point._model = {
				x: x,
				y: y,
				skip: custom.skip || isNaN(x) || isNaN(y),
				// Appearance
				radius: custom.radius || helpers.valueAtIndexOrDefault(dataset.pointRadius, index, pointOptions.radius),
				pointStyle: custom.pointStyle || helpers.valueAtIndexOrDefault(dataset.pointStyle, index, pointOptions.pointStyle),
				backgroundColor: me.getPointBackgroundColor(point, index),
				borderColor: me.getPointBorderColor(point, index),
				borderWidth: me.getPointBorderWidth(point, index),
				tension: meta.dataset._model ? meta.dataset._model.tension : 0,
				steppedLine: meta.dataset._model ? meta.dataset._model.steppedLine : false,
				// Tooltip
				hitRadius: custom.hitRadius || helpers.valueAtIndexOrDefault(dataset.pointHitRadius, index, pointOptions.hitRadius)
			};
		},

		calculatePointY: function(value, index, datasetIndex) {
			var me = this;
			var chart = me.chart;
			var meta = me.getMeta();
			var yScale = me.getScaleForId(meta.yAxisID);
			var sumPos = 0;
			var sumNeg = 0;
			var i, ds, dsMeta;

			if (yScale.options.stacked) {
				for (i = 0; i < datasetIndex; i++) {
					ds = chart.data.datasets[i];
					dsMeta = chart.getDatasetMeta(i);
					if (dsMeta.type === 'line' && dsMeta.yAxisID === yScale.id && chart.isDatasetVisible(i)) {
						var stackedRightValue = Number(yScale.getRightValue(ds.data[index]));
						if (stackedRightValue < 0) {
							sumNeg += stackedRightValue || 0;
						} else {
							sumPos += stackedRightValue || 0;
						}
					}
				}

				var rightValue = Number(yScale.getRightValue(value));
				if (rightValue < 0) {
					return yScale.getPixelForValue(sumNeg + rightValue);
				}
				return yScale.getPixelForValue(sumPos + rightValue);
			}

			return yScale.getPixelForValue(value);
		},

		updateBezierControlPoints: function() {
			var me = this;
			var meta = me.getMeta();
			var area = me.chart.chartArea;
			var points = (meta.data || []);
			var i, ilen, point, model, controlPoints;

			// Only consider points that are drawn in case the spanGaps option is used
			if (meta.dataset._model.spanGaps) {
				points = points.filter(function(pt) {
					return !pt._model.skip;
				});
			}

			function capControlPoint(pt, min, max) {
				return Math.max(Math.min(pt, max), min);
			}

			if (meta.dataset._model.cubicInterpolationMode === 'monotone') {
				helpers.splineCurveMonotone(points);
			} else {
				for (i = 0, ilen = points.length; i < ilen; ++i) {
					point = points[i];
					model = point._model;
					controlPoints = helpers.splineCurve(
						helpers.previousItem(points, i)._model,
						model,
						helpers.nextItem(points, i)._model,
						meta.dataset._model.tension
					);
					model.controlPointPreviousX = controlPoints.previous.x;
					model.controlPointPreviousY = controlPoints.previous.y;
					model.controlPointNextX = controlPoints.next.x;
					model.controlPointNextY = controlPoints.next.y;
				}
			}

			if (me.chart.options.elements.line.capBezierPoints) {
				for (i = 0, ilen = points.length; i < ilen; ++i) {
					model = points[i]._model;
					model.controlPointPreviousX = capControlPoint(model.controlPointPreviousX, area.left, area.right);
					model.controlPointPreviousY = capControlPoint(model.controlPointPreviousY, area.top, area.bottom);
					model.controlPointNextX = capControlPoint(model.controlPointNextX, area.left, area.right);
					model.controlPointNextY = capControlPoint(model.controlPointNextY, area.top, area.bottom);
				}
			}
		},

		draw: function() {
			var me = this;
			var chart = me.chart;
			var meta = me.getMeta();
			var points = meta.data || [];
			var area = chart.chartArea;
			var ilen = points.length;
			var i = 0;

			helpers.canvas.clipArea(chart.ctx, area);

			if (lineEnabled(me.getDataset(), chart.options)) {
				meta.dataset.draw();
			}

			helpers.canvas.unclipArea(chart.ctx);

			// Draw the points
			for (; i < ilen; ++i) {
				points[i].draw(area);
			}
		},

		setHoverStyle: function(point) {
			// Point
			var dataset = this.chart.data.datasets[point._datasetIndex];
			var index = point._index;
			var custom = point.custom || {};
			var model = point._model;

			model.radius = custom.hoverRadius || helpers.valueAtIndexOrDefault(dataset.pointHoverRadius, index, this.chart.options.elements.point.hoverRadius);
			model.backgroundColor = custom.hoverBackgroundColor || helpers.valueAtIndexOrDefault(dataset.pointHoverBackgroundColor, index, helpers.getHoverColor(model.backgroundColor));
			model.borderColor = custom.hoverBorderColor || helpers.valueAtIndexOrDefault(dataset.pointHoverBorderColor, index, helpers.getHoverColor(model.borderColor));
			model.borderWidth = custom.hoverBorderWidth || helpers.valueAtIndexOrDefault(dataset.pointHoverBorderWidth, index, model.borderWidth);
		},

		removeHoverStyle: function(point) {
			var me = this;
			var dataset = me.chart.data.datasets[point._datasetIndex];
			var index = point._index;
			var custom = point.custom || {};
			var model = point._model;

			// Compatibility: If the properties are defined with only the old name, use those values
			if ((dataset.radius !== undefined) && (dataset.pointRadius === undefined)) {
				dataset.pointRadius = dataset.radius;
			}

			model.radius = custom.radius || helpers.valueAtIndexOrDefault(dataset.pointRadius, index, me.chart.options.elements.point.radius);
			model.backgroundColor = me.getPointBackgroundColor(point, index);
			model.borderColor = me.getPointBorderColor(point, index);
			model.borderWidth = me.getPointBorderWidth(point, index);
		}
	});
};

},{"25":25,"40":40,"45":45}],19:[function(require,module,exports){
'use strict';

var defaults = require(25);
var elements = require(40);
var helpers = require(45);

defaults._set('polarArea', {
	scale: {
		type: 'radialLinear',
		angleLines: {
			display: false
		},
		gridLines: {
			circular: true
		},
		pointLabels: {
			display: false
		},
		ticks: {
			beginAtZero: true
		}
	},

	// Boolean - Whether to animate the rotation of the chart
	animation: {
		animateRotate: true,
		animateScale: true
	},

	startAngle: -0.5 * Math.PI,
	legendCallback: function(chart) {
		var text = [];
		text.push('<ul class="' + chart.id + '-legend">');

		var data = chart.data;
		var datasets = data.datasets;
		var labels = data.labels;

		if (datasets.length) {
			for (var i = 0; i < datasets[0].data.length; ++i) {
				text.push('<li><span style="background-color:' + datasets[0].backgroundColor[i] + '"></span>');
				if (labels[i]) {
					text.push(labels[i]);
				}
				text.push('</li>');
			}
		}

		text.push('</ul>');
		return text.join('');
	},
	legend: {
		labels: {
			generateLabels: function(chart) {
				var data = chart.data;
				if (data.labels.length && data.datasets.length) {
					return data.labels.map(function(label, i) {
						var meta = chart.getDatasetMeta(0);
						var ds = data.datasets[0];
						var arc = meta.data[i];
						var custom = arc.custom || {};
						var valueAtIndexOrDefault = helpers.valueAtIndexOrDefault;
						var arcOpts = chart.options.elements.arc;
						var fill = custom.backgroundColor ? custom.backgroundColor : valueAtIndexOrDefault(ds.backgroundColor, i, arcOpts.backgroundColor);
						var stroke = custom.borderColor ? custom.borderColor : valueAtIndexOrDefault(ds.borderColor, i, arcOpts.borderColor);
						var bw = custom.borderWidth ? custom.borderWidth : valueAtIndexOrDefault(ds.borderWidth, i, arcOpts.borderWidth);

						return {
							text: label,
							fillStyle: fill,
							strokeStyle: stroke,
							lineWidth: bw,
							hidden: isNaN(ds.data[i]) || meta.data[i].hidden,

							// Extra data used for toggling the correct item
							index: i
						};
					});
				}
				return [];
			}
		},

		onClick: function(e, legendItem) {
			var index = legendItem.index;
			var chart = this.chart;
			var i, ilen, meta;

			for (i = 0, ilen = (chart.data.datasets || []).length; i < ilen; ++i) {
				meta = chart.getDatasetMeta(i);
				meta.data[index].hidden = !meta.data[index].hidden;
			}

			chart.update();
		}
	},

	// Need to override these to give a nice default
	tooltips: {
		callbacks: {
			title: function() {
				return '';
			},
			label: function(item, data) {
				return data.labels[item.index] + ': ' + item.yLabel;
			}
		}
	}
});

module.exports = function(Chart) {

	Chart.controllers.polarArea = Chart.DatasetController.extend({

		dataElementType: elements.Arc,

		linkScales: helpers.noop,

		update: function(reset) {
			var me = this;
			var chart = me.chart;
			var chartArea = chart.chartArea;
			var meta = me.getMeta();
			var opts = chart.options;
			var arcOpts = opts.elements.arc;
			var minSize = Math.min(chartArea.right - chartArea.left, chartArea.bottom - chartArea.top);
			chart.outerRadius = Math.max((minSize - arcOpts.borderWidth / 2) / 2, 0);
			chart.innerRadius = Math.max(opts.cutoutPercentage ? (chart.outerRadius / 100) * (opts.cutoutPercentage) : 1, 0);
			chart.radiusLength = (chart.outerRadius - chart.innerRadius) / chart.getVisibleDatasetCount();

			me.outerRadius = chart.outerRadius - (chart.radiusLength * me.index);
			me.innerRadius = me.outerRadius - chart.radiusLength;

			meta.count = me.countVisibleElements();

			helpers.each(meta.data, function(arc, index) {
				me.updateElement(arc, index, reset);
			});
		},

		updateElement: function(arc, index, reset) {
			var me = this;
			var chart = me.chart;
			var dataset = me.getDataset();
			var opts = chart.options;
			var animationOpts = opts.animation;
			var scale = chart.scale;
			var labels = chart.data.labels;

			var circumference = me.calculateCircumference(dataset.data[index]);
			var centerX = scale.xCenter;
			var centerY = scale.yCenter;

			// If there is NaN data before us, we need to calculate the starting angle correctly.
			// We could be way more efficient here, but its unlikely that the polar area chart will have a lot of data
			var visibleCount = 0;
			var meta = me.getMeta();
			for (var i = 0; i < index; ++i) {
				if (!isNaN(dataset.data[i]) && !meta.data[i].hidden) {
					++visibleCount;
				}
			}

			// var negHalfPI = -0.5 * Math.PI;
			var datasetStartAngle = opts.startAngle;
			var distance = arc.hidden ? 0 : scale.getDistanceFromCenterForValue(dataset.data[index]);
			var startAngle = datasetStartAngle + (circumference * visibleCount);
			var endAngle = startAngle + (arc.hidden ? 0 : circumference);

			var resetRadius = animationOpts.animateScale ? 0 : scale.getDistanceFromCenterForValue(dataset.data[index]);

			helpers.extend(arc, {
				// Utility
				_datasetIndex: me.index,
				_index: index,
				_scale: scale,

				// Desired view properties
				_model: {
					x: centerX,
					y: centerY,
					innerRadius: 0,
					outerRadius: reset ? resetRadius : distance,
					startAngle: reset && animationOpts.animateRotate ? datasetStartAngle : startAngle,
					endAngle: reset && animationOpts.animateRotate ? datasetStartAngle : endAngle,
					label: helpers.valueAtIndexOrDefault(labels, index, labels[index])
				}
			});

			// Apply border and fill style
			me.removeHoverStyle(arc);

			arc.pivot();
		},

		removeHoverStyle: function(arc) {
			Chart.DatasetController.prototype.removeHoverStyle.call(this, arc, this.chart.options.elements.arc);
		},

		countVisibleElements: function() {
			var dataset = this.getDataset();
			var meta = this.getMeta();
			var count = 0;

			helpers.each(meta.data, function(element, index) {
				if (!isNaN(dataset.data[index]) && !element.hidden) {
					count++;
				}
			});

			return count;
		},

		calculateCircumference: function(value) {
			var count = this.getMeta().count;
			if (count > 0 && !isNaN(value)) {
				return (2 * Math.PI) / count;
			}
			return 0;
		}
	});
};

},{"25":25,"40":40,"45":45}],20:[function(require,module,exports){
'use strict';

var defaults = require(25);
var elements = require(40);
var helpers = require(45);

defaults._set('radar', {
	scale: {
		type: 'radialLinear'
	},
	elements: {
		line: {
			tension: 0 // no bezier in radar
		}
	}
});

module.exports = function(Chart) {

	Chart.controllers.radar = Chart.DatasetController.extend({

		datasetElementType: elements.Line,

		dataElementType: elements.Point,

		linkScales: helpers.noop,

		update: function(reset) {
			var me = this;
			var meta = me.getMeta();
			var line = meta.dataset;
			var points = meta.data;
			var custom = line.custom || {};
			var dataset = me.getDataset();
			var lineElementOptions = me.chart.options.elements.line;
			var scale = me.chart.scale;

			// Compatibility: If the properties are defined with only the old name, use those values
			if ((dataset.tension !== undefined) && (dataset.lineTension === undefined)) {
				dataset.lineTension = dataset.tension;
			}

			helpers.extend(meta.dataset, {
				// Utility
				_datasetIndex: me.index,
				_scale: scale,
				// Data
				_children: points,
				_loop: true,
				// Model
				_model: {
					// Appearance
					tension: custom.tension ? custom.tension : helpers.valueOrDefault(dataset.lineTension, lineElementOptions.tension),
					backgroundColor: custom.backgroundColor ? custom.backgroundColor : (dataset.backgroundColor || lineElementOptions.backgroundColor),
					borderWidth: custom.borderWidth ? custom.borderWidth : (dataset.borderWidth || lineElementOptions.borderWidth),
					borderColor: custom.borderColor ? custom.borderColor : (dataset.borderColor || lineElementOptions.borderColor),
					fill: custom.fill ? custom.fill : (dataset.fill !== undefined ? dataset.fill : lineElementOptions.fill),
					borderCapStyle: custom.borderCapStyle ? custom.borderCapStyle : (dataset.borderCapStyle || lineElementOptions.borderCapStyle),
					borderDash: custom.borderDash ? custom.borderDash : (dataset.borderDash || lineElementOptions.borderDash),
					borderDashOffset: custom.borderDashOffset ? custom.borderDashOffset : (dataset.borderDashOffset || lineElementOptions.borderDashOffset),
					borderJoinStyle: custom.borderJoinStyle ? custom.borderJoinStyle : (dataset.borderJoinStyle || lineElementOptions.borderJoinStyle),
				}
			});

			meta.dataset.pivot();

			// Update Points
			helpers.each(points, function(point, index) {
				me.updateElement(point, index, reset);
			}, me);

			// Update bezier control points
			me.updateBezierControlPoints();
		},
		updateElement: function(point, index, reset) {
			var me = this;
			var custom = point.custom || {};
			var dataset = me.getDataset();
			var scale = me.chart.scale;
			var pointElementOptions = me.chart.options.elements.point;
			var pointPosition = scale.getPointPositionForValue(index, dataset.data[index]);

			// Compatibility: If the properties are defined with only the old name, use those values
			if ((dataset.radius !== undefined) && (dataset.pointRadius === undefined)) {
				dataset.pointRadius = dataset.radius;
			}
			if ((dataset.hitRadius !== undefined) && (dataset.pointHitRadius === undefined)) {
				dataset.pointHitRadius = dataset.hitRadius;
			}

			helpers.extend(point, {
				// Utility
				_datasetIndex: me.index,
				_index: index,
				_scale: scale,

				// Desired view properties
				_model: {
					x: reset ? scale.xCenter : pointPosition.x, // value not used in dataset scale, but we want a consistent API between scales
					y: reset ? scale.yCenter : pointPosition.y,

					// Appearance
					tension: custom.tension ? custom.tension : helpers.valueOrDefault(dataset.lineTension, me.chart.options.elements.line.tension),
					radius: custom.radius ? custom.radius : helpers.valueAtIndexOrDefault(dataset.pointRadius, index, pointElementOptions.radius),
					backgroundColor: custom.backgroundColor ? custom.backgroundColor : helpers.valueAtIndexOrDefault(dataset.pointBackgroundColor, index, pointElementOptions.backgroundColor),
					borderColor: custom.borderColor ? custom.borderColor : helpers.valueAtIndexOrDefault(dataset.pointBorderColor, index, pointElementOptions.borderColor),
					borderWidth: custom.borderWidth ? custom.borderWidth : helpers.valueAtIndexOrDefault(dataset.pointBorderWidth, index, pointElementOptions.borderWidth),
					pointStyle: custom.pointStyle ? custom.pointStyle : helpers.valueAtIndexOrDefault(dataset.pointStyle, index, pointElementOptions.pointStyle),

					// Tooltip
					hitRadius: custom.hitRadius ? custom.hitRadius : helpers.valueAtIndexOrDefault(dataset.pointHitRadius, index, pointElementOptions.hitRadius)
				}
			});

			point._model.skip = custom.skip ? custom.skip : (isNaN(point._model.x) || isNaN(point._model.y));
		},
		updateBezierControlPoints: function() {
			var chartArea = this.chart.chartArea;
			var meta = this.getMeta();

			helpers.each(meta.data, function(point, index) {
				var model = point._model;
				var controlPoints = helpers.splineCurve(
					helpers.previousItem(meta.data, index, true)._model,
					model,
					helpers.nextItem(meta.data, index, true)._model,
					model.tension
				);

				// Prevent the bezier going outside of the bounds of the graph
				model.controlPointPreviousX = Math.max(Math.min(controlPoints.previous.x, chartArea.right), chartArea.left);
				model.controlPointPreviousY = Math.max(Math.min(controlPoints.previous.y, chartArea.bottom), chartArea.top);

				model.controlPointNextX = Math.max(Math.min(controlPoints.next.x, chartArea.right), chartArea.left);
				model.controlPointNextY = Math.max(Math.min(controlPoints.next.y, chartArea.bottom), chartArea.top);

				// Now pivot the point for animation
				point.pivot();
			});
		},

		setHoverStyle: function(point) {
			// Point
			var dataset = this.chart.data.datasets[point._datasetIndex];
			var custom = point.custom || {};
			var index = point._index;
			var model = point._model;

			model.radius = custom.hoverRadius ? custom.hoverRadius : helpers.valueAtIndexOrDefault(dataset.pointHoverRadius, index, this.chart.options.elements.point.hoverRadius);
			model.backgroundColor = custom.hoverBackgroundColor ? custom.hoverBackgroundColor : helpers.valueAtIndexOrDefault(dataset.pointHoverBackgroundColor, index, helpers.getHoverColor(model.backgroundColor));
			model.borderColor = custom.hoverBorderColor ? custom.hoverBorderColor : helpers.valueAtIndexOrDefault(dataset.pointHoverBorderColor, index, helpers.getHoverColor(model.borderColor));
			model.borderWidth = custom.hoverBorderWidth ? custom.hoverBorderWidth : helpers.valueAtIndexOrDefault(dataset.pointHoverBorderWidth, index, model.borderWidth);
		},

		removeHoverStyle: function(point) {
			var dataset = this.chart.data.datasets[point._datasetIndex];
			var custom = point.custom || {};
			var index = point._index;
			var model = point._model;
			var pointElementOptions = this.chart.options.elements.point;

			model.radius = custom.radius ? custom.radius : helpers.valueAtIndexOrDefault(dataset.pointRadius, index, pointElementOptions.radius);
			model.backgroundColor = custom.backgroundColor ? custom.backgroundColor : helpers.valueAtIndexOrDefault(dataset.pointBackgroundColor, index, pointElementOptions.backgroundColor);
			model.borderColor = custom.borderColor ? custom.borderColor : helpers.valueAtIndexOrDefault(dataset.pointBorderColor, index, pointElementOptions.borderColor);
			model.borderWidth = custom.borderWidth ? custom.borderWidth : helpers.valueAtIndexOrDefault(dataset.pointBorderWidth, index, pointElementOptions.borderWidth);
		}
	});
};

},{"25":25,"40":40,"45":45}],21:[function(require,module,exports){
'use strict';

var defaults = require(25);

defaults._set('scatter', {
	hover: {
		mode: 'single'
	},

	scales: {
		xAxes: [{
			id: 'x-axis-1',    // need an ID so datasets can reference the scale
			type: 'linear',    // scatter should not use a category axis
			position: 'bottom'
		}],
		yAxes: [{
			id: 'y-axis-1',
			type: 'linear',
			position: 'left'
		}]
	},

	showLines: false,

	tooltips: {
		callbacks: {
			title: function() {
				return '';     // doesn't make sense for scatter since data are formatted as a point
			},
			label: function(item) {
				return '(' + item.xLabel + ', ' + item.yLabel + ')';
			}
		}
	}
});

module.exports = function(Chart) {

	// Scatter charts use line controllers
	Chart.controllers.scatter = Chart.controllers.line;

};

},{"25":25}],22:[function(require,module,exports){
/* global window: false */
'use strict';

var defaults = require(25);
var Element = require(26);
var helpers = require(45);

defaults._set('global', {
	animation: {
		duration: 1000,
		easing: 'easeOutQuart',
		onProgress: helpers.noop,
		onComplete: helpers.noop
	}
});

module.exports = function(Chart) {

	Chart.Animation = Element.extend({
		chart: null, // the animation associated chart instance
		currentStep: 0, // the current animation step
		numSteps: 60, // default number of steps
		easing: '', // the easing to use for this animation
		render: null, // render function used by the animation service

		onAnimationProgress: null, // user specified callback to fire on each step of the animation
		onAnimationComplete: null, // user specified callback to fire when the animation finishes
	});

	Chart.animationService = {
		frameDuration: 17,
		animations: [],
		dropFrames: 0,
		request: null,

		/**
		 * @param {Chart} chart - The chart to animate.
		 * @param {Chart.Animation} animation - The animation that we will animate.
		 * @param {Number} duration - The animation duration in ms.
		 * @param {Boolean} lazy - if true, the chart is not marked as animating to enable more responsive interactions
		 */
		addAnimation: function(chart, animation, duration, lazy) {
			var animations = this.animations;
			var i, ilen;

			animation.chart = chart;

			if (!lazy) {
				chart.animating = true;
			}

			for (i = 0, ilen = animations.length; i < ilen; ++i) {
				if (animations[i].chart === chart) {
					animations[i] = animation;
					return;
				}
			}

			animations.push(animation);

			// If there are no animations queued, manually kickstart a digest, for lack of a better word
			if (animations.length === 1) {
				this.requestAnimationFrame();
			}
		},

		cancelAnimation: function(chart) {
			var index = helpers.findIndex(this.animations, function(animation) {
				return animation.chart === chart;
			});

			if (index !== -1) {
				this.animations.splice(index, 1);
				chart.animating = false;
			}
		},

		requestAnimationFrame: function() {
			var me = this;
			if (me.request === null) {
				// Skip animation frame requests until the active one is executed.
				// This can happen when processing mouse events, e.g. 'mousemove'
				// and 'mouseout' events will trigger multiple renders.
				me.request = helpers.requestAnimFrame.call(window, function() {
					me.request = null;
					me.startDigest();
				});
			}
		},

		/**
		 * @private
		 */
		startDigest: function() {
			var me = this;
			var startTime = Date.now();
			var framesToDrop = 0;

			if (me.dropFrames > 1) {
				framesToDrop = Math.floor(me.dropFrames);
				me.dropFrames = me.dropFrames % 1;
			}

			me.advance(1 + framesToDrop);

			var endTime = Date.now();

			me.dropFrames += (endTime - startTime) / me.frameDuration;

			// Do we have more stuff to animate?
			if (me.animations.length > 0) {
				me.requestAnimationFrame();
			}
		},

		/**
		 * @private
		 */
		advance: function(count) {
			var animations = this.animations;
			var animation, chart;
			var i = 0;

			while (i < animations.length) {
				animation = animations[i];
				chart = animation.chart;

				animation.currentStep = (animation.currentStep || 0) + count;
				animation.currentStep = Math.min(animation.currentStep, animation.numSteps);

				helpers.callback(animation.render, [chart, animation], chart);
				helpers.callback(animation.onAnimationProgress, [animation], chart);

				if (animation.currentStep >= animation.numSteps) {
					helpers.callback(animation.onAnimationComplete, [animation], chart);
					chart.animating = false;
					animations.splice(i, 1);
				} else {
					++i;
				}
			}
		}
	};

	/**
	 * Provided for backward compatibility, use Chart.Animation instead
	 * @prop Chart.Animation#animationObject
	 * @deprecated since version 2.6.0
	 * @todo remove at version 3
	 */
	Object.defineProperty(Chart.Animation.prototype, 'animationObject', {
		get: function() {
			return this;
		}
	});

	/**
	 * Provided for backward compatibility, use Chart.Animation#chart instead
	 * @prop Chart.Animation#chartInstance
	 * @deprecated since version 2.6.0
	 * @todo remove at version 3
	 */
	Object.defineProperty(Chart.Animation.prototype, 'chartInstance', {
		get: function() {
			return this.chart;
		},
		set: function(value) {
			this.chart = value;
		}
	});

};

},{"25":25,"26":26,"45":45}],23:[function(require,module,exports){
'use strict';

var defaults = require(25);
var helpers = require(45);
var Interaction = require(28);
var layouts = require(30);
var platform = require(48);
var plugins = require(31);

module.exports = function(Chart) {

	// Create a dictionary of chart types, to allow for extension of existing types
	Chart.types = {};

	// Store a reference to each instance - allowing us to globally resize chart instances on window resize.
	// Destroy method on the chart will remove the instance of the chart from this reference.
	Chart.instances = {};

	// Controllers available for dataset visualization eg. bar, line, slice, etc.
	Chart.controllers = {};

	/**
	 * Initializes the given config with global and chart default values.
	 */
	function initConfig(config) {
		config = config || {};

		// Do NOT use configMerge() for the data object because this method merges arrays
		// and so would change references to labels and datasets, preventing data updates.
		var data = config.data = config.data || {};
		data.datasets = data.datasets || [];
		data.labels = data.labels || [];

		config.options = helpers.configMerge(
			defaults.global,
			defaults[config.type],
			config.options || {});

		return config;
	}

	/**
	 * Updates the config of the chart
	 * @param chart {Chart} chart to update the options for
	 */
	function updateConfig(chart) {
		var newOptions = chart.options;

		helpers.each(chart.scales, function(scale) {
			layouts.removeBox(chart, scale);
		});

		newOptions = helpers.configMerge(
			Chart.defaults.global,
			Chart.defaults[chart.config.type],
			newOptions);

		chart.options = chart.config.options = newOptions;
		chart.ensureScalesHaveIDs();
		chart.buildOrUpdateScales();
		// Tooltip
		chart.tooltip._options = newOptions.tooltips;
		chart.tooltip.initialize();
	}

	function positionIsHorizontal(position) {
		return position === 'top' || position === 'bottom';
	}

	helpers.extend(Chart.prototype, /** @lends Chart */ {
		/**
		 * @private
		 */
		construct: function(item, config) {
			var me = this;

			config = initConfig(config);

			var context = platform.acquireContext(item, config);
			var canvas = context && context.canvas;
			var height = canvas && canvas.height;
			var width = canvas && canvas.width;

			me.id = helpers.uid();
			me.ctx = context;
			me.canvas = canvas;
			me.config = config;
			me.width = width;
			me.height = height;
			me.aspectRatio = height ? width / height : null;
			me.options = config.options;
			me._bufferedRender = false;

			/**
			 * Provided for backward compatibility, Chart and Chart.Controller have been merged,
			 * the "instance" still need to be defined since it might be called from plugins.
			 * @prop Chart#chart
			 * @deprecated since version 2.6.0
			 * @todo remove at version 3
			 * @private
			 */
			me.chart = me;
			me.controller = me; // chart.chart.controller #inception

			// Add the chart instance to the global namespace
			Chart.instances[me.id] = me;

			// Define alias to the config data: `chart.data === chart.config.data`
			Object.defineProperty(me, 'data', {
				get: function() {
					return me.config.data;
				},
				set: function(value) {
					me.config.data = value;
				}
			});

			if (!context || !canvas) {
				// The given item is not a compatible context2d element, let's return before finalizing
				// the chart initialization but after setting basic chart / controller properties that
				// can help to figure out that the chart is not valid (e.g chart.canvas !== null);
				// https://github.com/chartjs/Chart.js/issues/2807
				console.error("Failed to create chart: can't acquire context from the given item");
				return;
			}

			me.initialize();
			me.update();
		},

		/**
		 * @private
		 */
		initialize: function() {
			var me = this;

			// Before init plugin notification
			plugins.notify(me, 'beforeInit');

			helpers.retinaScale(me, me.options.devicePixelRatio);

			me.bindEvents();

			if (me.options.responsive) {
				// Initial resize before chart draws (must be silent to preserve initial animations).
				me.resize(true);
			}

			// Make sure scales have IDs and are built before we build any controllers.
			me.ensureScalesHaveIDs();
			me.buildOrUpdateScales();
			me.initToolTip();

			// After init plugin notification
			plugins.notify(me, 'afterInit');

			return me;
		},

		clear: function() {
			helpers.canvas.clear(this);
			return this;
		},

		stop: function() {
			// Stops any current animation loop occurring
			Chart.animationService.cancelAnimation(this);
			return this;
		},

		resize: function(silent) {
			var me = this;
			var options = me.options;
			var canvas = me.canvas;
			var aspectRatio = (options.maintainAspectRatio && me.aspectRatio) || null;

			// the canvas render width and height will be casted to integers so make sure that
			// the canvas display style uses the same integer values to avoid blurring effect.

			// Set to 0 instead of canvas.size because the size defaults to 300x150 if the element is collased
			var newWidth = Math.max(0, Math.floor(helpers.getMaximumWidth(canvas)));
			var newHeight = Math.max(0, Math.floor(aspectRatio ? newWidth / aspectRatio : helpers.getMaximumHeight(canvas)));

			if (me.width === newWidth && me.height === newHeight) {
				return;
			}

			canvas.width = me.width = newWidth;
			canvas.height = me.height = newHeight;
			canvas.style.width = newWidth + 'px';
			canvas.style.height = newHeight + 'px';

			helpers.retinaScale(me, options.devicePixelRatio);

			if (!silent) {
				// Notify any plugins about the resize
				var newSize = {width: newWidth, height: newHeight};
				plugins.notify(me, 'resize', [newSize]);

				// Notify of resize
				if (me.options.onResize) {
					me.options.onResize(me, newSize);
				}

				me.stop();
				me.update(me.options.responsiveAnimationDuration);
			}
		},

		ensureScalesHaveIDs: function() {
			var options = this.options;
			var scalesOptions = options.scales || {};
			var scaleOptions = options.scale;

			helpers.each(scalesOptions.xAxes, function(xAxisOptions, index) {
				xAxisOptions.id = xAxisOptions.id || ('x-axis-' + index);
			});

			helpers.each(scalesOptions.yAxes, function(yAxisOptions, index) {
				yAxisOptions.id = yAxisOptions.id || ('y-axis-' + index);
			});

			if (scaleOptions) {
				scaleOptions.id = scaleOptions.id || 'scale';
			}
		},

		/**
		 * Builds a map of scale ID to scale object for future lookup.
		 */
		buildOrUpdateScales: function() {
			var me = this;
			var options = me.options;
			var scales = me.scales || {};
			var items = [];
			var updated = Object.keys(scales).reduce(function(obj, id) {
				obj[id] = false;
				return obj;
			}, {});

			if (options.scales) {
				items = items.concat(
					(options.scales.xAxes || []).map(function(xAxisOptions) {
						return {options: xAxisOptions, dtype: 'category', dposition: 'bottom'};
					}),
					(options.scales.yAxes || []).map(function(yAxisOptions) {
						return {options: yAxisOptions, dtype: 'linear', dposition: 'left'};
					})
				);
			}

			if (options.scale) {
				items.push({
					options: options.scale,
					dtype: 'radialLinear',
					isDefault: true,
					dposition: 'chartArea'
				});
			}

			helpers.each(items, function(item) {
				var scaleOptions = item.options;
				var id = scaleOptions.id;
				var scaleType = helpers.valueOrDefault(scaleOptions.type, item.dtype);

				if (positionIsHorizontal(scaleOptions.position) !== positionIsHorizontal(item.dposition)) {
					scaleOptions.position = item.dposition;
				}

				updated[id] = true;
				var scale = null;
				if (id in scales && scales[id].type === scaleType) {
					scale = scales[id];
					scale.options = scaleOptions;
					scale.ctx = me.ctx;
					scale.chart = me;
				} else {
					var scaleClass = Chart.scaleService.getScaleConstructor(scaleType);
					if (!scaleClass) {
						return;
					}
					scale = new scaleClass({
						id: id,
						type: scaleType,
						options: scaleOptions,
						ctx: me.ctx,
						chart: me
					});
					scales[scale.id] = scale;
				}

				scale.mergeTicksOptions();

				// TODO(SB): I think we should be able to remove this custom case (options.scale)
				// and consider it as a regular scale part of the "scales"" map only! This would
				// make the logic easier and remove some useless? custom code.
				if (item.isDefault) {
					me.scale = scale;
				}
			});
			// clear up discarded scales
			helpers.each(updated, function(hasUpdated, id) {
				if (!hasUpdated) {
					delete scales[id];
				}
			});

			me.scales = scales;

			Chart.scaleService.addScalesToLayout(this);
		},

		buildOrUpdateControllers: function() {
			var me = this;
			var types = [];
			var newControllers = [];

			helpers.each(me.data.datasets, function(dataset, datasetIndex) {
				var meta = me.getDatasetMeta(datasetIndex);
				var type = dataset.type || me.config.type;

				if (meta.type && meta.type !== type) {
					me.destroyDatasetMeta(datasetIndex);
					meta = me.getDatasetMeta(datasetIndex);
				}
				meta.type = type;

				types.push(meta.type);

				if (meta.controller) {
					meta.controller.updateIndex(datasetIndex);
					meta.controller.linkScales();
				} else {
					var ControllerClass = Chart.controllers[meta.type];
					if (ControllerClass === undefined) {
						throw new Error('"' + meta.type + '" is not a chart type.');
					}

					meta.controller = new ControllerClass(me, datasetIndex);
					newControllers.push(meta.controller);
				}
			}, me);

			return newControllers;
		},

		/**
		 * Reset the elements of all datasets
		 * @private
		 */
		resetElements: function() {
			var me = this;
			helpers.each(me.data.datasets, function(dataset, datasetIndex) {
				me.getDatasetMeta(datasetIndex).controller.reset();
			}, me);
		},

		/**
		* Resets the chart back to it's state before the initial animation
		*/
		reset: function() {
			this.resetElements();
			this.tooltip.initialize();
		},

		update: function(config) {
			var me = this;

			if (!config || typeof config !== 'object') {
				// backwards compatibility
				config = {
					duration: config,
					lazy: arguments[1]
				};
			}

			updateConfig(me);

			// plugins options references might have change, let's invalidate the cache
			// https://github.com/chartjs/Chart.js/issues/5111#issuecomment-355934167
			plugins._invalidate(me);

			if (plugins.notify(me, 'beforeUpdate') === false) {
				return;
			}

			// In case the entire data object changed
			me.tooltip._data = me.data;

			// Make sure dataset controllers are updated and new controllers are reset
			var newControllers = me.buildOrUpdateControllers();

			// Make sure all dataset controllers have correct meta data counts
			helpers.each(me.data.datasets, function(dataset, datasetIndex) {
				me.getDatasetMeta(datasetIndex).controller.buildOrUpdateElements();
			}, me);

			me.updateLayout();

			// Can only reset the new controllers after the scales have been updated
			if (me.options.animation && me.options.animation.duration) {
				helpers.each(newControllers, function(controller) {
					controller.reset();
				});
			}

			me.updateDatasets();

			// Need to reset tooltip in case it is displayed with elements that are removed
			// after update.
			me.tooltip.initialize();

			// Last active contains items that were previously in the tooltip.
			// When we reset the tooltip, we need to clear it
			me.lastActive = [];

			// Do this before render so that any plugins that need final scale updates can use it
			plugins.notify(me, 'afterUpdate');

			if (me._bufferedRender) {
				me._bufferedRequest = {
					duration: config.duration,
					easing: config.easing,
					lazy: config.lazy
				};
			} else {
				me.render(config);
			}
		},

		/**
		 * Updates the chart layout unless a plugin returns `false` to the `beforeLayout`
		 * hook, in which case, plugins will not be called on `afterLayout`.
		 * @private
		 */
		updateLayout: function() {
			var me = this;

			if (plugins.notify(me, 'beforeLayout') === false) {
				return;
			}

			layouts.update(this, this.width, this.height);

			/**
			 * Provided for backward compatibility, use `afterLayout` instead.
			 * @method IPlugin#afterScaleUpdate
			 * @deprecated since version 2.5.0
			 * @todo remove at version 3
			 * @private
			 */
			plugins.notify(me, 'afterScaleUpdate');
			plugins.notify(me, 'afterLayout');
		},

		/**
		 * Updates all datasets unless a plugin returns `false` to the `beforeDatasetsUpdate`
		 * hook, in which case, plugins will not be called on `afterDatasetsUpdate`.
		 * @private
		 */
		updateDatasets: function() {
			var me = this;

			if (plugins.notify(me, 'beforeDatasetsUpdate') === false) {
				return;
			}

			for (var i = 0, ilen = me.data.datasets.length; i < ilen; ++i) {
				me.updateDataset(i);
			}

			plugins.notify(me, 'afterDatasetsUpdate');
		},

		/**
		 * Updates dataset at index unless a plugin returns `false` to the `beforeDatasetUpdate`
		 * hook, in which case, plugins will not be called on `afterDatasetUpdate`.
		 * @private
		 */
		updateDataset: function(index) {
			var me = this;
			var meta = me.getDatasetMeta(index);
			var args = {
				meta: meta,
				index: index
			};

			if (plugins.notify(me, 'beforeDatasetUpdate', [args]) === false) {
				return;
			}

			meta.controller.update();

			plugins.notify(me, 'afterDatasetUpdate', [args]);
		},

		render: function(config) {
			var me = this;

			if (!config || typeof config !== 'object') {
				// backwards compatibility
				config = {
					duration: config,
					lazy: arguments[1]
				};
			}

			var duration = config.duration;
			var lazy = config.lazy;

			if (plugins.notify(me, 'beforeRender') === false) {
				return;
			}

			var animationOptions = me.options.animation;
			var onComplete = function(animation) {
				plugins.notify(me, 'afterRender');
				helpers.callback(animationOptions && animationOptions.onComplete, [animation], me);
			};

			if (animationOptions && ((typeof duration !== 'undefined' && duration !== 0) || (typeof duration === 'undefined' && animationOptions.duration !== 0))) {
				var animation = new Chart.Animation({
					numSteps: (duration || animationOptions.duration) / 16.66, // 60 fps
					easing: config.easing || animationOptions.easing,

					render: function(chart, animationObject) {
						var easingFunction = helpers.easing.effects[animationObject.easing];
						var currentStep = animationObject.currentStep;
						var stepDecimal = currentStep / animationObject.numSteps;

						chart.draw(easingFunction(stepDecimal), stepDecimal, currentStep);
					},

					onAnimationProgress: animationOptions.onProgress,
					onAnimationComplete: onComplete
				});

				Chart.animationService.addAnimation(me, animation, duration, lazy);
			} else {
				me.draw();

				// See https://github.com/chartjs/Chart.js/issues/3781
				onComplete(new Chart.Animation({numSteps: 0, chart: me}));
			}

			return me;
		},

		draw: function(easingValue) {
			var me = this;

			me.clear();

			if (helpers.isNullOrUndef(easingValue)) {
				easingValue = 1;
			}

			me.transition(easingValue);

			if (plugins.notify(me, 'beforeDraw', [easingValue]) === false) {
				return;
			}

			// Draw all the scales
			helpers.each(me.boxes, function(box) {
				box.draw(me.chartArea);
			}, me);

			if (me.scale) {
				me.scale.draw();
			}

			me.drawDatasets(easingValue);
			me._drawTooltip(easingValue);

			plugins.notify(me, 'afterDraw', [easingValue]);
		},

		/**
		 * @private
		 */
		transition: function(easingValue) {
			var me = this;

			for (var i = 0, ilen = (me.data.datasets || []).length; i < ilen; ++i) {
				if (me.isDatasetVisible(i)) {
					me.getDatasetMeta(i).controller.transition(easingValue);
				}
			}

			me.tooltip.transition(easingValue);
		},

		/**
		 * Draws all datasets unless a plugin returns `false` to the `beforeDatasetsDraw`
		 * hook, in which case, plugins will not be called on `afterDatasetsDraw`.
		 * @private
		 */
		drawDatasets: function(easingValue) {
			var me = this;

			if (plugins.notify(me, 'beforeDatasetsDraw', [easingValue]) === false) {
				return;
			}

			// Draw datasets reversed to support proper line stacking
			for (var i = (me.data.datasets || []).length - 1; i >= 0; --i) {
				if (me.isDatasetVisible(i)) {
					me.drawDataset(i, easingValue);
				}
			}

			plugins.notify(me, 'afterDatasetsDraw', [easingValue]);
		},

		/**
		 * Draws dataset at index unless a plugin returns `false` to the `beforeDatasetDraw`
		 * hook, in which case, plugins will not be called on `afterDatasetDraw`.
		 * @private
		 */
		drawDataset: function(index, easingValue) {
			var me = this;
			var meta = me.getDatasetMeta(index);
			var args = {
				meta: meta,
				index: index,
				easingValue: easingValue
			};

			if (plugins.notify(me, 'beforeDatasetDraw', [args]) === false) {
				return;
			}

			meta.controller.draw(easingValue);

			plugins.notify(me, 'afterDatasetDraw', [args]);
		},

		/**
		 * Draws tooltip unless a plugin returns `false` to the `beforeTooltipDraw`
		 * hook, in which case, plugins will not be called on `afterTooltipDraw`.
		 * @private
		 */
		_drawTooltip: function(easingValue) {
			var me = this;
			var tooltip = me.tooltip;
			var args = {
				tooltip: tooltip,
				easingValue: easingValue
			};

			if (plugins.notify(me, 'beforeTooltipDraw', [args]) === false) {
				return;
			}

			tooltip.draw();

			plugins.notify(me, 'afterTooltipDraw', [args]);
		},

		// Get the single element that was clicked on
		// @return : An object containing the dataset index and element index of the matching element. Also contains the rectangle that was draw
		getElementAtEvent: function(e) {
			return Interaction.modes.single(this, e);
		},

		getElementsAtEvent: function(e) {
			return Interaction.modes.label(this, e, {intersect: true});
		},

		getElementsAtXAxis: function(e) {
			return Interaction.modes['x-axis'](this, e, {intersect: true});
		},

		getElementsAtEventForMode: function(e, mode, options) {
			var method = Interaction.modes[mode];
			if (typeof method === 'function') {
				return method(this, e, options);
			}

			return [];
		},

		getDatasetAtEvent: function(e) {
			return Interaction.modes.dataset(this, e, {intersect: true});
		},

		getDatasetMeta: function(datasetIndex) {
			var me = this;
			var dataset = me.data.datasets[datasetIndex];
			if (!dataset._meta) {
				dataset._meta = {};
			}

			var meta = dataset._meta[me.id];
			if (!meta) {
				meta = dataset._meta[me.id] = {
					type: null,
					data: [],
					dataset: null,
					controller: null,
					hidden: null,			// See isDatasetVisible() comment
					xAxisID: null,
					yAxisID: null
				};
			}

			return meta;
		},

		getVisibleDatasetCount: function() {
			var count = 0;
			for (var i = 0, ilen = this.data.datasets.length; i < ilen; ++i) {
				if (this.isDatasetVisible(i)) {
					count++;
				}
			}
			return count;
		},

		isDatasetVisible: function(datasetIndex) {
			var meta = this.getDatasetMeta(datasetIndex);

			// meta.hidden is a per chart dataset hidden flag override with 3 states: if true or false,
			// the dataset.hidden value is ignored, else if null, the dataset hidden state is returned.
			return typeof meta.hidden === 'boolean' ? !meta.hidden : !this.data.datasets[datasetIndex].hidden;
		},

		generateLegend: function() {
			return this.options.legendCallback(this);
		},

		/**
		 * @private
		 */
		destroyDatasetMeta: function(datasetIndex) {
			var id = this.id;
			var dataset = this.data.datasets[datasetIndex];
			var meta = dataset._meta && dataset._meta[id];

			if (meta) {
				meta.controller.destroy();
				delete dataset._meta[id];
			}
		},

		destroy: function() {
			var me = this;
			var canvas = me.canvas;
			var i, ilen;

			me.stop();

			// dataset controllers need to cleanup associated data
			for (i = 0, ilen = me.data.datasets.length; i < ilen; ++i) {
				me.destroyDatasetMeta(i);
			}

			if (canvas) {
				me.unbindEvents();
				helpers.canvas.clear(me);
				platform.releaseContext(me.ctx);
				me.canvas = null;
				me.ctx = null;
			}

			plugins.notify(me, 'destroy');

			delete Chart.instances[me.id];
		},

		toBase64Image: function() {
			return this.canvas.toDataURL.apply(this.canvas, arguments);
		},

		initToolTip: function() {
			var me = this;
			me.tooltip = new Chart.Tooltip({
				_chart: me,
				_chartInstance: me, // deprecated, backward compatibility
				_data: me.data,
				_options: me.options.tooltips
			}, me);
		},

		/**
		 * @private
		 */
		bindEvents: function() {
			var me = this;
			var listeners = me._listeners = {};
			var listener = function() {
				me.eventHandler.apply(me, arguments);
			};

			helpers.each(me.options.events, function(type) {
				platform.addEventListener(me, type, listener);
				listeners[type] = listener;
			});

			// Elements used to detect size change should not be injected for non responsive charts.
			// See https://github.com/chartjs/Chart.js/issues/2210
			if (me.options.responsive) {
				listener = function() {
					me.resize();
				};

				platform.addEventListener(me, 'resize', listener);
				listeners.resize = listener;
			}
		},

		/**
		 * @private
		 */
		unbindEvents: function() {
			var me = this;
			var listeners = me._listeners;
			if (!listeners) {
				return;
			}

			delete me._listeners;
			helpers.each(listeners, function(listener, type) {
				platform.removeEventListener(me, type, listener);
			});
		},

		updateHoverStyle: function(elements, mode, enabled) {
			var method = enabled ? 'setHoverStyle' : 'removeHoverStyle';
			var element, i, ilen;

			for (i = 0, ilen = elements.length; i < ilen; ++i) {
				element = elements[i];
				if (element) {
					this.getDatasetMeta(element._datasetIndex).controller[method](element);
				}
			}
		},

		/**
		 * @private
		 */
		eventHandler: function(e) {
			var me = this;
			var tooltip = me.tooltip;

			if (plugins.notify(me, 'beforeEvent', [e]) === false) {
				return;
			}

			// Buffer any update calls so that renders do not occur
			me._bufferedRender = true;
			me._bufferedRequest = null;

			var changed = me.handleEvent(e);
			// for smooth tooltip animations issue #4989
			// the tooltip should be the source of change
			// Animation check workaround:
			// tooltip._start will be null when tooltip isn't animating
			if (tooltip) {
				changed = tooltip._start
					? tooltip.handleEvent(e)
					: changed | tooltip.handleEvent(e);
			}

			plugins.notify(me, 'afterEvent', [e]);

			var bufferedRequest = me._bufferedRequest;
			if (bufferedRequest) {
				// If we have an update that was triggered, we need to do a normal render
				me.render(bufferedRequest);
			} else if (changed && !me.animating) {
				// If entering, leaving, or changing elements, animate the change via pivot
				me.stop();

				// We only need to render at this point. Updating will cause scales to be
				// recomputed generating flicker & using more memory than necessary.
				me.render(me.options.hover.animationDuration, true);
			}

			me._bufferedRender = false;
			me._bufferedRequest = null;

			return me;
		},

		/**
		 * Handle an event
		 * @private
		 * @param {IEvent} event the event to handle
		 * @return {Boolean} true if the chart needs to re-render
		 */
		handleEvent: function(e) {
			var me = this;
			var options = me.options || {};
			var hoverOptions = options.hover;
			var changed = false;

			me.lastActive = me.lastActive || [];

			// Find Active Elements for hover and tooltips
			if (e.type === 'mouseout') {
				me.active = [];
			} else {
				me.active = me.getElementsAtEventForMode(e, hoverOptions.mode, hoverOptions);
			}

			// Invoke onHover hook
			// Need to call with native event here to not break backwards compatibility
			helpers.callback(options.onHover || options.hover.onHover, [e.native, me.active], me);

			if (e.type === 'mouseup' || e.type === 'click') {
				if (options.onClick) {
					// Use e.native here for backwards compatibility
					options.onClick.call(me, e.native, me.active);
				}
			}

			// Remove styling for last active (even if it may still be active)
			if (me.lastActive.length) {
				me.updateHoverStyle(me.lastActive, hoverOptions.mode, false);
			}

			// Built in hover styling
			if (me.active.length && hoverOptions.mode) {
				me.updateHoverStyle(me.active, hoverOptions.mode, true);
			}

			changed = !helpers.arrayEquals(me.active, me.lastActive);

			// Remember Last Actives
			me.lastActive = me.active;

			return changed;
		}
	});

	/**
	 * Provided for backward compatibility, use Chart instead.
	 * @class Chart.Controller
	 * @deprecated since version 2.6.0
	 * @todo remove at version 3
	 * @private
	 */
	Chart.Controller = Chart;
};

},{"25":25,"28":28,"30":30,"31":31,"45":45,"48":48}],24:[function(require,module,exports){
'use strict';

var helpers = require(45);

module.exports = function(Chart) {

	var arrayEvents = ['push', 'pop', 'shift', 'splice', 'unshift'];

	/**
	 * Hooks the array methods that add or remove values ('push', pop', 'shift', 'splice',
	 * 'unshift') and notify the listener AFTER the array has been altered. Listeners are
	 * called on the 'onData*' callbacks (e.g. onDataPush, etc.) with same arguments.
	 */
	function listenArrayEvents(array, listener) {
		if (array._chartjs) {
			array._chartjs.listeners.push(listener);
			return;
		}

		Object.defineProperty(array, '_chartjs', {
			configurable: true,
			enumerable: false,
			value: {
				listeners: [listener]
			}
		});

		arrayEvents.forEach(function(key) {
			var method = 'onData' + key.charAt(0).toUpperCase() + key.slice(1);
			var base = array[key];

			Object.defineProperty(array, key, {
				configurable: true,
				enumerable: false,
				value: function() {
					var args = Array.prototype.slice.call(arguments);
					var res = base.apply(this, args);

					helpers.each(array._chartjs.listeners, function(object) {
						if (typeof object[method] === 'function') {
							object[method].apply(object, args);
						}
					});

					return res;
				}
			});
		});
	}

	/**
	 * Removes the given array event listener and cleanup extra attached properties (such as
	 * the _chartjs stub and overridden methods) if array doesn't have any more listeners.
	 */
	function unlistenArrayEvents(array, listener) {
		var stub = array._chartjs;
		if (!stub) {
			return;
		}

		var listeners = stub.listeners;
		var index = listeners.indexOf(listener);
		if (index !== -1) {
			listeners.splice(index, 1);
		}

		if (listeners.length > 0) {
			return;
		}

		arrayEvents.forEach(function(key) {
			delete array[key];
		});

		delete array._chartjs;
	}

	// Base class for all dataset controllers (line, bar, etc)
	Chart.DatasetController = function(chart, datasetIndex) {
		this.initialize(chart, datasetIndex);
	};

	helpers.extend(Chart.DatasetController.prototype, {

		/**
		 * Element type used to generate a meta dataset (e.g. Chart.element.Line).
		 * @type {Chart.core.element}
		 */
		datasetElementType: null,

		/**
		 * Element type used to generate a meta data (e.g. Chart.element.Point).
		 * @type {Chart.core.element}
		 */
		dataElementType: null,

		initialize: function(chart, datasetIndex) {
			var me = this;
			me.chart = chart;
			me.index = datasetIndex;
			me.linkScales();
			me.addElements();
		},

		updateIndex: function(datasetIndex) {
			this.index = datasetIndex;
		},

		linkScales: function() {
			var me = this;
			var meta = me.getMeta();
			var dataset = me.getDataset();

			if (meta.xAxisID === null || !(meta.xAxisID in me.chart.scales)) {
				meta.xAxisID = dataset.xAxisID || me.chart.options.scales.xAxes[0].id;
			}
			if (meta.yAxisID === null || !(meta.yAxisID in me.chart.scales)) {
				meta.yAxisID = dataset.yAxisID || me.chart.options.scales.yAxes[0].id;
			}
		},

		getDataset: function() {
			return this.chart.data.datasets[this.index];
		},

		getMeta: function() {
			return this.chart.getDatasetMeta(this.index);
		},

		getScaleForId: function(scaleID) {
			return this.chart.scales[scaleID];
		},

		reset: function() {
			this.update(true);
		},

		/**
		 * @private
		 */
		destroy: function() {
			if (this._data) {
				unlistenArrayEvents(this._data, this);
			}
		},

		createMetaDataset: function() {
			var me = this;
			var type = me.datasetElementType;
			return type && new type({
				_chart: me.chart,
				_datasetIndex: me.index
			});
		},

		createMetaData: function(index) {
			var me = this;
			var type = me.dataElementType;
			return type && new type({
				_chart: me.chart,
				_datasetIndex: me.index,
				_index: index
			});
		},

		addElements: function() {
			var me = this;
			var meta = me.getMeta();
			var data = me.getDataset().data || [];
			var metaData = meta.data;
			var i, ilen;

			for (i = 0, ilen = data.length; i < ilen; ++i) {
				metaData[i] = metaData[i] || me.createMetaData(i);
			}

			meta.dataset = meta.dataset || me.createMetaDataset();
		},

		addElementAndReset: function(index) {
			var element = this.createMetaData(index);
			this.getMeta().data.splice(index, 0, element);
			this.updateElement(element, index, true);
		},

		buildOrUpdateElements: function() {
			var me = this;
			var dataset = me.getDataset();
			var data = dataset.data || (dataset.data = []);

			// In order to correctly handle data addition/deletion animation (an thus simulate
			// real-time charts), we need to monitor these data modifications and synchronize
			// the internal meta data accordingly.
			if (me._data !== data) {
				if (me._data) {
					// This case happens when the user replaced the data array instance.
					unlistenArrayEvents(me._data, me);
				}

				listenArrayEvents(data, me);
				me._data = data;
			}

			// Re-sync meta data in case the user replaced the data array or if we missed
			// any updates and so make sure that we handle number of datapoints changing.
			me.resyncElements();
		},

		update: helpers.noop,

		transition: function(easingValue) {
			var meta = this.getMeta();
			var elements = meta.data || [];
			var ilen = elements.length;
			var i = 0;

			for (; i < ilen; ++i) {
				elements[i].transition(easingValue);
			}

			if (meta.dataset) {
				meta.dataset.transition(easingValue);
			}
		},

		draw: function() {
			var meta = this.getMeta();
			var elements = meta.data || [];
			var ilen = elements.length;
			var i = 0;

			if (meta.dataset) {
				meta.dataset.draw();
			}

			for (; i < ilen; ++i) {
				elements[i].draw();
			}
		},

		removeHoverStyle: function(element, elementOpts) {
			var dataset = this.chart.data.datasets[element._datasetIndex];
			var index = element._index;
			var custom = element.custom || {};
			var valueOrDefault = helpers.valueAtIndexOrDefault;
			var model = element._model;

			model.backgroundColor = custom.backgroundColor ? custom.backgroundColor : valueOrDefault(dataset.backgroundColor, index, elementOpts.backgroundColor);
			model.borderColor = custom.borderColor ? custom.borderColor : valueOrDefault(dataset.borderColor, index, elementOpts.borderColor);
			model.borderWidth = custom.borderWidth ? custom.borderWidth : valueOrDefault(dataset.borderWidth, index, elementOpts.borderWidth);
		},

		setHoverStyle: function(element) {
			var dataset = this.chart.data.datasets[element._datasetIndex];
			var index = element._index;
			var custom = element.custom || {};
			var valueOrDefault = helpers.valueAtIndexOrDefault;
			var getHoverColor = helpers.getHoverColor;
			var model = element._model;

			model.backgroundColor = custom.hoverBackgroundColor ? custom.hoverBackgroundColor : valueOrDefault(dataset.hoverBackgroundColor, index, getHoverColor(model.backgroundColor));
			model.borderColor = custom.hoverBorderColor ? custom.hoverBorderColor : valueOrDefault(dataset.hoverBorderColor, index, getHoverColor(model.borderColor));
			model.borderWidth = custom.hoverBorderWidth ? custom.hoverBorderWidth : valueOrDefault(dataset.hoverBorderWidth, index, model.borderWidth);
		},

		/**
		 * @private
		 */
		resyncElements: function() {
			var me = this;
			var meta = me.getMeta();
			var data = me.getDataset().data;
			var numMeta = meta.data.length;
			var numData = data.length;

			if (numData < numMeta) {
				meta.data.splice(numData, numMeta - numData);
			} else if (numData > numMeta) {
				me.insertElements(numMeta, numData - numMeta);
			}
		},

		/**
		 * @private
		 */
		insertElements: function(start, count) {
			for (var i = 0; i < count; ++i) {
				this.addElementAndReset(start + i);
			}
		},

		/**
		 * @private
		 */
		onDataPush: function() {
			this.insertElements(this.getDataset().data.length - 1, arguments.length);
		},

		/**
		 * @private
		 */
		onDataPop: function() {
			this.getMeta().data.pop();
		},

		/**
		 * @private
		 */
		onDataShift: function() {
			this.getMeta().data.shift();
		},

		/**
		 * @private
		 */
		onDataSplice: function(start, count) {
			this.getMeta().data.splice(start, count);
			this.insertElements(start, arguments.length - 2);
		},

		/**
		 * @private
		 */
		onDataUnshift: function() {
			this.insertElements(0, arguments.length);
		}
	});

	Chart.DatasetController.extend = helpers.inherits;
};

},{"45":45}],25:[function(require,module,exports){
'use strict';

var helpers = require(45);

module.exports = {
	/**
	 * @private
	 */
	_set: function(scope, values) {
		return helpers.merge(this[scope] || (this[scope] = {}), values);
	}
};

},{"45":45}],26:[function(require,module,exports){
'use strict';

var color = require(3);
var helpers = require(45);

function interpolate(start, view, model, ease) {
	var keys = Object.keys(model);
	var i, ilen, key, actual, origin, target, type, c0, c1;

	for (i = 0, ilen = keys.length; i < ilen; ++i) {
		key = keys[i];

		target = model[key];

		// if a value is added to the model after pivot() has been called, the view
		// doesn't contain it, so let's initialize the view to the target value.
		if (!view.hasOwnProperty(key)) {
			view[key] = target;
		}

		actual = view[key];

		if (actual === target || key[0] === '_') {
			continue;
		}

		if (!start.hasOwnProperty(key)) {
			start[key] = actual;
		}

		origin = start[key];

		type = typeof target;

		if (type === typeof origin) {
			if (type === 'string') {
				c0 = color(origin);
				if (c0.valid) {
					c1 = color(target);
					if (c1.valid) {
						view[key] = c1.mix(c0, ease).rgbString();
						continue;
					}
				}
			} else if (type === 'number' && isFinite(origin) && isFinite(target)) {
				view[key] = origin + (target - origin) * ease;
				continue;
			}
		}

		view[key] = target;
	}
}

var Element = function(configuration) {
	helpers.extend(this, configuration);
	this.initialize.apply(this, arguments);
};

helpers.extend(Element.prototype, {

	initialize: function() {
		this.hidden = false;
	},

	pivot: function() {
		var me = this;
		if (!me._view) {
			me._view = helpers.clone(me._model);
		}
		me._start = {};
		return me;
	},

	transition: function(ease) {
		var me = this;
		var model = me._model;
		var start = me._start;
		var view = me._view;

		// No animation -> No Transition
		if (!model || ease === 1) {
			me._view = model;
			me._start = null;
			return me;
		}

		if (!view) {
			view = me._view = {};
		}

		if (!start) {
			start = me._start = {};
		}

		interpolate(start, view, model, ease);

		return me;
	},

	tooltipPosition: function() {
		return {
			x: this._model.x,
			y: this._model.y
		};
	},

	hasValue: function() {
		return helpers.isNumber(this._model.x) && helpers.isNumber(this._model.y);
	}
});

Element.extend = helpers.inherits;

module.exports = Element;

},{"3":3,"45":45}],27:[function(require,module,exports){
/* global window: false */
/* global document: false */
'use strict';

var color = require(3);
var defaults = require(25);
var helpers = require(45);

module.exports = function(Chart) {

	// -- Basic js utility methods

	helpers.configMerge = function(/* objects ... */) {
		return helpers.merge(helpers.clone(arguments[0]), [].slice.call(arguments, 1), {
			merger: function(key, target, source, options) {
				var tval = target[key] || {};
				var sval = source[key];

				if (key === 'scales') {
					// scale config merging is complex. Add our own function here for that
					target[key] = helpers.scaleMerge(tval, sval);
				} else if (key === 'scale') {
					// used in polar area & radar charts since there is only one scale
					target[key] = helpers.merge(tval, [Chart.scaleService.getScaleDefaults(sval.type), sval]);
				} else {
					helpers._merger(key, target, source, options);
				}
			}
		});
	};

	helpers.scaleMerge = function(/* objects ... */) {
		return helpers.merge(helpers.clone(arguments[0]), [].slice.call(arguments, 1), {
			merger: function(key, target, source, options) {
				if (key === 'xAxes' || key === 'yAxes') {
					var slen = source[key].length;
					var i, type, scale;

					if (!target[key]) {
						target[key] = [];
					}

					for (i = 0; i < slen; ++i) {
						scale = source[key][i];
						type = helpers.valueOrDefault(scale.type, key === 'xAxes' ? 'category' : 'linear');

						if (i >= target[key].length) {
							target[key].push({});
						}

						if (!target[key][i].type || (scale.type && scale.type !== target[key][i].type)) {
							// new/untyped scale or type changed: let's apply the new defaults
							// then merge source scale to correctly overwrite the defaults.
							helpers.merge(target[key][i], [Chart.scaleService.getScaleDefaults(type), scale]);
						} else {
							// scales type are the same
							helpers.merge(target[key][i], scale);
						}
					}
				} else {
					helpers._merger(key, target, source, options);
				}
			}
		});
	};

	helpers.where = function(collection, filterCallback) {
		if (helpers.isArray(collection) && Array.prototype.filter) {
			return collection.filter(filterCallback);
		}
		var filtered = [];

		helpers.each(collection, function(item) {
			if (filterCallback(item)) {
				filtered.push(item);
			}
		});

		return filtered;
	};
	helpers.findIndex = Array.prototype.findIndex ?
		function(array, callback, scope) {
			return array.findIndex(callback, scope);
		} :
		function(array, callback, scope) {
			scope = scope === undefined ? array : scope;
			for (var i = 0, ilen = array.length; i < ilen; ++i) {
				if (callback.call(scope, array[i], i, array)) {
					return i;
				}
			}
			return -1;
		};
	helpers.findNextWhere = function(arrayToSearch, filterCallback, startIndex) {
		// Default to start of the array
		if (helpers.isNullOrUndef(startIndex)) {
			startIndex = -1;
		}
		for (var i = startIndex + 1; i < arrayToSearch.length; i++) {
			var currentItem = arrayToSearch[i];
			if (filterCallback(currentItem)) {
				return currentItem;
			}
		}
	};
	helpers.findPreviousWhere = function(arrayToSearch, filterCallback, startIndex) {
		// Default to end of the array
		if (helpers.isNullOrUndef(startIndex)) {
			startIndex = arrayToSearch.length;
		}
		for (var i = startIndex - 1; i >= 0; i--) {
			var currentItem = arrayToSearch[i];
			if (filterCallback(currentItem)) {
				return currentItem;
			}
		}
	};

	// -- Math methods
	helpers.isNumber = function(n) {
		return !isNaN(parseFloat(n)) && isFinite(n);
	};
	helpers.almostEquals = function(x, y, epsilon) {
		return Math.abs(x - y) < epsilon;
	};
	helpers.almostWhole = function(x, epsilon) {
		var rounded = Math.round(x);
		return (((rounded - epsilon) < x) && ((rounded + epsilon) > x));
	};
	helpers.max = function(array) {
		return array.reduce(function(max, value) {
			if (!isNaN(value)) {
				return Math.max(max, value);
			}
			return max;
		}, Number.NEGATIVE_INFINITY);
	};
	helpers.min = function(array) {
		return array.reduce(function(min, value) {
			if (!isNaN(value)) {
				return Math.min(min, value);
			}
			return min;
		}, Number.POSITIVE_INFINITY);
	};
	helpers.sign = Math.sign ?
		function(x) {
			return Math.sign(x);
		} :
		function(x) {
			x = +x; // convert to a number
			if (x === 0 || isNaN(x)) {
				return x;
			}
			return x > 0 ? 1 : -1;
		};
	helpers.log10 = Math.log10 ?
		function(x) {
			return Math.log10(x);
		} :
		function(x) {
			var exponent = Math.log(x) * Math.LOG10E; // Math.LOG10E = 1 / Math.LN10.
			// Check for whole powers of 10,
			// which due to floating point rounding error should be corrected.
			var powerOf10 = Math.round(exponent);
			var isPowerOf10 = x === Math.pow(10, powerOf10);

			return isPowerOf10 ? powerOf10 : exponent;
		};
	helpers.toRadians = function(degrees) {
		return degrees * (Math.PI / 180);
	};
	helpers.toDegrees = function(radians) {
		return radians * (180 / Math.PI);
	};
	// Gets the angle from vertical upright to the point about a centre.
	helpers.getAngleFromPoint = function(centrePoint, anglePoint) {
		var distanceFromXCenter = anglePoint.x - centrePoint.x;
		var distanceFromYCenter = anglePoint.y - centrePoint.y;
		var radialDistanceFromCenter = Math.sqrt(distanceFromXCenter * distanceFromXCenter + distanceFromYCenter * distanceFromYCenter);

		var angle = Math.atan2(distanceFromYCenter, distanceFromXCenter);

		if (angle < (-0.5 * Math.PI)) {
			angle += 2.0 * Math.PI; // make sure the returned angle is in the range of (-PI/2, 3PI/2]
		}

		return {
			angle: angle,
			distance: radialDistanceFromCenter
		};
	};
	helpers.distanceBetweenPoints = function(pt1, pt2) {
		return Math.sqrt(Math.pow(pt2.x - pt1.x, 2) + Math.pow(pt2.y - pt1.y, 2));
	};
	helpers.aliasPixel = function(pixelWidth) {
		return (pixelWidth % 2 === 0) ? 0 : 0.5;
	};
	helpers.splineCurve = function(firstPoint, middlePoint, afterPoint, t) {
		// Props to Rob Spencer at scaled innovation for his post on splining between points
		// http://scaledinnovation.com/analytics/splines/aboutSplines.html

		// This function must also respect "skipped" points

		var previous = firstPoint.skip ? middlePoint : firstPoint;
		var current = middlePoint;
		var next = afterPoint.skip ? middlePoint : afterPoint;

		var d01 = Math.sqrt(Math.pow(current.x - previous.x, 2) + Math.pow(current.y - previous.y, 2));
		var d12 = Math.sqrt(Math.pow(next.x - current.x, 2) + Math.pow(next.y - current.y, 2));

		var s01 = d01 / (d01 + d12);
		var s12 = d12 / (d01 + d12);

		// If all points are the same, s01 & s02 will be inf
		s01 = isNaN(s01) ? 0 : s01;
		s12 = isNaN(s12) ? 0 : s12;

		var fa = t * s01; // scaling factor for triangle Ta
		var fb = t * s12;

		return {
			previous: {
				x: current.x - fa * (next.x - previous.x),
				y: current.y - fa * (next.y - previous.y)
			},
			next: {
				x: current.x + fb * (next.x - previous.x),
				y: current.y + fb * (next.y - previous.y)
			}
		};
	};
	helpers.EPSILON = Number.EPSILON || 1e-14;
	helpers.splineCurveMonotone = function(points) {
		// This function calculates Bézier control points in a similar way than |splineCurve|,
		// but preserves monotonicity of the provided data and ensures no local extremums are added
		// between the dataset discrete points due to the interpolation.
		// See : https://en.wikipedia.org/wiki/Monotone_cubic_interpolation

		var pointsWithTangents = (points || []).map(function(point) {
			return {
				model: point._model,
				deltaK: 0,
				mK: 0
			};
		});

		// Calculate slopes (deltaK) and initialize tangents (mK)
		var pointsLen = pointsWithTangents.length;
		var i, pointBefore, pointCurrent, pointAfter;
		for (i = 0; i < pointsLen; ++i) {
			pointCurrent = pointsWithTangents[i];
			if (pointCurrent.model.skip) {
				continue;
			}

			pointBefore = i > 0 ? pointsWithTangents[i - 1] : null;
			pointAfter = i < pointsLen - 1 ? pointsWithTangents[i + 1] : null;
			if (pointAfter && !pointAfter.model.skip) {
				var slopeDeltaX = (pointAfter.model.x - pointCurrent.model.x);

				// In the case of two points that appear at the same x pixel, slopeDeltaX is 0
				pointCurrent.deltaK = slopeDeltaX !== 0 ? (pointAfter.model.y - pointCurrent.model.y) / slopeDeltaX : 0;
			}

			if (!pointBefore || pointBefore.model.skip) {
				pointCurrent.mK = pointCurrent.deltaK;
			} else if (!pointAfter || pointAfter.model.skip) {
				pointCurrent.mK = pointBefore.deltaK;
			} else if (this.sign(pointBefore.deltaK) !== this.sign(pointCurrent.deltaK)) {
				pointCurrent.mK = 0;
			} else {
				pointCurrent.mK = (pointBefore.deltaK + pointCurrent.deltaK) / 2;
			}
		}

		// Adjust tangents to ensure monotonic properties
		var alphaK, betaK, tauK, squaredMagnitude;
		for (i = 0; i < pointsLen - 1; ++i) {
			pointCurrent = pointsWithTangents[i];
			pointAfter = pointsWithTangents[i + 1];
			if (pointCurrent.model.skip || pointAfter.model.skip) {
				continue;
			}

			if (helpers.almostEquals(pointCurrent.deltaK, 0, this.EPSILON)) {
				pointCurrent.mK = pointAfter.mK = 0;
				continue;
			}

			alphaK = pointCurrent.mK / pointCurrent.deltaK;
			betaK = pointAfter.mK / pointCurrent.deltaK;
			squaredMagnitude = Math.pow(alphaK, 2) + Math.pow(betaK, 2);
			if (squaredMagnitude <= 9) {
				continue;
			}

			tauK = 3 / Math.sqrt(squaredMagnitude);
			pointCurrent.mK = alphaK * tauK * pointCurrent.deltaK;
			pointAfter.mK = betaK * tauK * pointCurrent.deltaK;
		}

		// Compute control points
		var deltaX;
		for (i = 0; i < pointsLen; ++i) {
			pointCurrent = pointsWithTangents[i];
			if (pointCurrent.model.skip) {
				continue;
			}

			pointBefore = i > 0 ? pointsWithTangents[i - 1] : null;
			pointAfter = i < pointsLen - 1 ? pointsWithTangents[i + 1] : null;
			if (pointBefore && !pointBefore.model.skip) {
				deltaX = (pointCurrent.model.x - pointBefore.model.x) / 3;
				pointCurrent.model.controlPointPreviousX = pointCurrent.model.x - deltaX;
				pointCurrent.model.controlPointPreviousY = pointCurrent.model.y - deltaX * pointCurrent.mK;
			}
			if (pointAfter && !pointAfter.model.skip) {
				deltaX = (pointAfter.model.x - pointCurrent.model.x) / 3;
				pointCurrent.model.controlPointNextX = pointCurrent.model.x + deltaX;
				pointCurrent.model.controlPointNextY = pointCurrent.model.y + deltaX * pointCurrent.mK;
			}
		}
	};
	helpers.nextItem = function(collection, index, loop) {
		if (loop) {
			return index >= collection.length - 1 ? collection[0] : collection[index + 1];
		}
		return index >= collection.length - 1 ? collection[collection.length - 1] : collection[index + 1];
	};
	helpers.previousItem = function(collection, index, loop) {
		if (loop) {
			return index <= 0 ? collection[collection.length - 1] : collection[index - 1];
		}
		return index <= 0 ? collection[0] : collection[index - 1];
	};
	// Implementation of the nice number algorithm used in determining where axis labels will go
	helpers.niceNum = function(range, round) {
		var exponent = Math.floor(helpers.log10(range));
		var fraction = range / Math.pow(10, exponent);
		var niceFraction;

		if (round) {
			if (fraction < 1.5) {
				niceFraction = 1;
			} else if (fraction < 3) {
				niceFraction = 2;
			} else if (fraction < 7) {
				niceFraction = 5;
			} else {
				niceFraction = 10;
			}
		} else if (fraction <= 1.0) {
			niceFraction = 1;
		} else if (fraction <= 2) {
			niceFraction = 2;
		} else if (fraction <= 5) {
			niceFraction = 5;
		} else {
			niceFraction = 10;
		}

		return niceFraction * Math.pow(10, exponent);
	};
	// Request animation polyfill - http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
	helpers.requestAnimFrame = (function() {
		if (typeof window === 'undefined') {
			return function(callback) {
				callback();
			};
		}
		return window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.oRequestAnimationFrame ||
			window.msRequestAnimationFrame ||
			function(callback) {
				return window.setTimeout(callback, 1000 / 60);
			};
	}());
	// -- DOM methods
	helpers.getRelativePosition = function(evt, chart) {
		var mouseX, mouseY;
		var e = evt.originalEvent || evt;
		var canvas = evt.currentTarget || evt.srcElement;
		var boundingRect = canvas.getBoundingClientRect();

		var touches = e.touches;
		if (touches && touches.length > 0) {
			mouseX = touches[0].clientX;
			mouseY = touches[0].clientY;

		} else {
			mouseX = e.clientX;
			mouseY = e.clientY;
		}

		// Scale mouse coordinates into canvas coordinates
		// by following the pattern laid out by 'jerryj' in the comments of
		// http://www.html5canvastutorials.com/advanced/html5-canvas-mouse-coordinates/
		var paddingLeft = parseFloat(helpers.getStyle(canvas, 'padding-left'));
		var paddingTop = parseFloat(helpers.getStyle(canvas, 'padding-top'));
		var paddingRight = parseFloat(helpers.getStyle(canvas, 'padding-right'));
		var paddingBottom = parseFloat(helpers.getStyle(canvas, 'padding-bottom'));
		var width = boundingRect.right - boundingRect.left - paddingLeft - paddingRight;
		var height = boundingRect.bottom - boundingRect.top - paddingTop - paddingBottom;

		// We divide by the current device pixel ratio, because the canvas is scaled up by that amount in each direction. However
		// the backend model is in unscaled coordinates. Since we are going to deal with our model coordinates, we go back here
		mouseX = Math.round((mouseX - boundingRect.left - paddingLeft) / (width) * canvas.width / chart.currentDevicePixelRatio);
		mouseY = Math.round((mouseY - boundingRect.top - paddingTop) / (height) * canvas.height / chart.currentDevicePixelRatio);

		return {
			x: mouseX,
			y: mouseY
		};

	};

	// Private helper function to convert max-width/max-height values that may be percentages into a number
	function parseMaxStyle(styleValue, node, parentProperty) {
		var valueInPixels;
		if (typeof styleValue === 'string') {
			valueInPixels = parseInt(styleValue, 10);

			if (styleValue.indexOf('%') !== -1) {
				// percentage * size in dimension
				valueInPixels = valueInPixels / 100 * node.parentNode[parentProperty];
			}
		} else {
			valueInPixels = styleValue;
		}

		return valueInPixels;
	}

	/**
	 * Returns if the given value contains an effective constraint.
	 * @private
	 */
	function isConstrainedValue(value) {
		return value !== undefined && value !== null && value !== 'none';
	}

	// Private helper to get a constraint dimension
	// @param domNode : the node to check the constraint on
	// @param maxStyle : the style that defines the maximum for the direction we are using (maxWidth / maxHeight)
	// @param percentageProperty : property of parent to use when calculating width as a percentage
	// @see http://www.nathanaeljones.com/blog/2013/reading-max-width-cross-browser
	function getConstraintDimension(domNode, maxStyle, percentageProperty) {
		var view = document.defaultView;
		var parentNode = domNode.parentNode;
		var constrainedNode = view.getComputedStyle(domNode)[maxStyle];
		var constrainedContainer = view.getComputedStyle(parentNode)[maxStyle];
		var hasCNode = isConstrainedValue(constrainedNode);
		var hasCContainer = isConstrainedValue(constrainedContainer);
		var infinity = Number.POSITIVE_INFINITY;

		if (hasCNode || hasCContainer) {
			return Math.min(
				hasCNode ? parseMaxStyle(constrainedNode, domNode, percentageProperty) : infinity,
				hasCContainer ? parseMaxStyle(constrainedContainer, parentNode, percentageProperty) : infinity);
		}

		return 'none';
	}
	// returns Number or undefined if no constraint
	helpers.getConstraintWidth = function(domNode) {
		return getConstraintDimension(domNode, 'max-width', 'clientWidth');
	};
	// returns Number or undefined if no constraint
	helpers.getConstraintHeight = function(domNode) {
		return getConstraintDimension(domNode, 'max-height', 'clientHeight');
	};
	helpers.getMaximumWidth = function(domNode) {
		var container = domNode.parentNode;
		if (!container) {
			return domNode.clientWidth;
		}

		var paddingLeft = parseInt(helpers.getStyle(container, 'padding-left'), 10);
		var paddingRight = parseInt(helpers.getStyle(container, 'padding-right'), 10);
		var w = container.clientWidth - paddingLeft - paddingRight;
		var cw = helpers.getConstraintWidth(domNode);
		return isNaN(cw) ? w : Math.min(w, cw);
	};
	helpers.getMaximumHeight = function(domNode) {
		var container = domNode.parentNode;
		if (!container) {
			return domNode.clientHeight;
		}

		var paddingTop = parseInt(helpers.getStyle(container, 'padding-top'), 10);
		var paddingBottom = parseInt(helpers.getStyle(container, 'padding-bottom'), 10);
		var h = container.clientHeight - paddingTop - paddingBottom;
		var ch = helpers.getConstraintHeight(domNode);
		return isNaN(ch) ? h : Math.min(h, ch);
	};
	helpers.getStyle = function(el, property) {
		return el.currentStyle ?
			el.currentStyle[property] :
			document.defaultView.getComputedStyle(el, null).getPropertyValue(property);
	};
	helpers.retinaScale = function(chart, forceRatio) {
		var pixelRatio = chart.currentDevicePixelRatio = forceRatio || window.devicePixelRatio || 1;
		if (pixelRatio === 1) {
			return;
		}

		var canvas = chart.canvas;
		var height = chart.height;
		var width = chart.width;

		canvas.height = height * pixelRatio;
		canvas.width = width * pixelRatio;
		chart.ctx.scale(pixelRatio, pixelRatio);

		// If no style has been set on the canvas, the render size is used as display size,
		// making the chart visually bigger, so let's enforce it to the "correct" values.
		// See https://github.com/chartjs/Chart.js/issues/3575
		if (!canvas.style.height && !canvas.style.width) {
			canvas.style.height = height + 'px';
			canvas.style.width = width + 'px';
		}
	};
	// -- Canvas methods
	helpers.fontString = function(pixelSize, fontStyle, fontFamily) {
		return fontStyle + ' ' + pixelSize + 'px ' + fontFamily;
	};
	helpers.longestText = function(ctx, font, arrayOfThings, cache) {
		cache = cache || {};
		var data = cache.data = cache.data || {};
		var gc = cache.garbageCollect = cache.garbageCollect || [];

		if (cache.font !== font) {
			data = cache.data = {};
			gc = cache.garbageCollect = [];
			cache.font = font;
		}

		ctx.font = font;
		var longest = 0;
		helpers.each(arrayOfThings, function(thing) {
			// Undefined strings and arrays should not be measured
			if (thing !== undefined && thing !== null && helpers.isArray(thing) !== true) {
				longest = helpers.measureText(ctx, data, gc, longest, thing);
			} else if (helpers.isArray(thing)) {
				// if it is an array lets measure each element
				// to do maybe simplify this function a bit so we can do this more recursively?
				helpers.each(thing, function(nestedThing) {
					// Undefined strings and arrays should not be measured
					if (nestedThing !== undefined && nestedThing !== null && !helpers.isArray(nestedThing)) {
						longest = helpers.measureText(ctx, data, gc, longest, nestedThing);
					}
				});
			}
		});

		var gcLen = gc.length / 2;
		if (gcLen > arrayOfThings.length) {
			for (var i = 0; i < gcLen; i++) {
				delete data[gc[i]];
			}
			gc.splice(0, gcLen);
		}
		return longest;
	};
	helpers.measureText = function(ctx, data, gc, longest, string) {
		var textWidth = data[string];
		if (!textWidth) {
			textWidth = data[string] = ctx.measureText(string).width;
			gc.push(string);
		}
		if (textWidth > longest) {
			longest = textWidth;
		}
		return longest;
	};
	helpers.numberOfLabelLines = function(arrayOfThings) {
		var numberOfLines = 1;
		helpers.each(arrayOfThings, function(thing) {
			if (helpers.isArray(thing)) {
				if (thing.length > numberOfLines) {
					numberOfLines = thing.length;
				}
			}
		});
		return numberOfLines;
	};

	helpers.color = !color ?
		function(value) {
			console.error('Color.js not found!');
			return value;
		} :
		function(value) {
			/* global CanvasGradient */
			if (value instanceof CanvasGradient) {
				value = defaults.global.defaultColor;
			}

			return color(value);
		};

	helpers.getHoverColor = function(colorValue) {
		/* global CanvasPattern */
		return (colorValue instanceof CanvasPattern) ?
			colorValue :
			helpers.color(colorValue).saturate(0.5).darken(0.1).rgbString();
	};
};

},{"25":25,"3":3,"45":45}],28:[function(require,module,exports){
'use strict';

var helpers = require(45);

/**
 * Helper function to get relative position for an event
 * @param {Event|IEvent} event - The event to get the position for
 * @param {Chart} chart - The chart
 * @returns {Point} the event position
 */
function getRelativePosition(e, chart) {
	if (e.native) {
		return {
			x: e.x,
			y: e.y
		};
	}

	return helpers.getRelativePosition(e, chart);
}

/**
 * Helper function to traverse all of the visible elements in the chart
 * @param chart {chart} the chart
 * @param handler {Function} the callback to execute for each visible item
 */
function parseVisibleItems(chart, handler) {
	var datasets = chart.data.datasets;
	var meta, i, j, ilen, jlen;

	for (i = 0, ilen = datasets.length; i < ilen; ++i) {
		if (!chart.isDatasetVisible(i)) {
			continue;
		}

		meta = chart.getDatasetMeta(i);
		for (j = 0, jlen = meta.data.length; j < jlen; ++j) {
			var element = meta.data[j];
			if (!element._view.skip) {
				handler(element);
			}
		}
	}
}

/**
 * Helper function to get the items that intersect the event position
 * @param items {ChartElement[]} elements to filter
 * @param position {Point} the point to be nearest to
 * @return {ChartElement[]} the nearest items
 */
function getIntersectItems(chart, position) {
	var elements = [];

	parseVisibleItems(chart, function(element) {
		if (element.inRange(position.x, position.y)) {
			elements.push(element);
		}
	});

	return elements;
}

/**
 * Helper function to get the items nearest to the event position considering all visible items in teh chart
 * @param chart {Chart} the chart to look at elements from
 * @param position {Point} the point to be nearest to
 * @param intersect {Boolean} if true, only consider items that intersect the position
 * @param distanceMetric {Function} function to provide the distance between points
 * @return {ChartElement[]} the nearest items
 */
function getNearestItems(chart, position, intersect, distanceMetric) {
	var minDistance = Number.POSITIVE_INFINITY;
	var nearestItems = [];

	parseVisibleItems(chart, function(element) {
		if (intersect && !element.inRange(position.x, position.y)) {
			return;
		}

		var center = element.getCenterPoint();
		var distance = distanceMetric(position, center);

		if (distance < minDistance) {
			nearestItems = [element];
			minDistance = distance;
		} else if (distance === minDistance) {
			// Can have multiple items at the same distance in which case we sort by size
			nearestItems.push(element);
		}
	});

	return nearestItems;
}

/**
 * Get a distance metric function for two points based on the
 * axis mode setting
 * @param {String} axis the axis mode. x|y|xy
 */
function getDistanceMetricForAxis(axis) {
	var useX = axis.indexOf('x') !== -1;
	var useY = axis.indexOf('y') !== -1;

	return function(pt1, pt2) {
		var deltaX = useX ? Math.abs(pt1.x - pt2.x) : 0;
		var deltaY = useY ? Math.abs(pt1.y - pt2.y) : 0;
		return Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
	};
}

function indexMode(chart, e, options) {
	var position = getRelativePosition(e, chart);
	// Default axis for index mode is 'x' to match old behaviour
	options.axis = options.axis || 'x';
	var distanceMetric = getDistanceMetricForAxis(options.axis);
	var items = options.intersect ? getIntersectItems(chart, position) : getNearestItems(chart, position, false, distanceMetric);
	var elements = [];

	if (!items.length) {
		return [];
	}

	chart.data.datasets.forEach(function(dataset, datasetIndex) {
		if (chart.isDatasetVisible(datasetIndex)) {
			var meta = chart.getDatasetMeta(datasetIndex);
			var element = meta.data[items[0]._index];

			// don't count items that are skipped (null data)
			if (element && !element._view.skip) {
				elements.push(element);
			}
		}
	});

	return elements;
}

/**
 * @interface IInteractionOptions
 */
/**
 * If true, only consider items that intersect the point
 * @name IInterfaceOptions#boolean
 * @type Boolean
 */

/**
 * Contains interaction related functions
 * @namespace Chart.Interaction
 */
module.exports = {
	// Helper function for different modes
	modes: {
		single: function(chart, e) {
			var position = getRelativePosition(e, chart);
			var elements = [];

			parseVisibleItems(chart, function(element) {
				if (element.inRange(position.x, position.y)) {
					elements.push(element);
					return elements;
				}
			});

			return elements.slice(0, 1);
		},

		/**
		 * @function Chart.Interaction.modes.label
		 * @deprecated since version 2.4.0
		 * @todo remove at version 3
		 * @private
		 */
		label: indexMode,

		/**
		 * Returns items at the same index. If the options.intersect parameter is true, we only return items if we intersect something
		 * If the options.intersect mode is false, we find the nearest item and return the items at the same index as that item
		 * @function Chart.Interaction.modes.index
		 * @since v2.4.0
		 * @param chart {chart} the chart we are returning items from
		 * @param e {Event} the event we are find things at
		 * @param options {IInteractionOptions} options to use during interaction
		 * @return {Chart.Element[]} Array of elements that are under the point. If none are found, an empty array is returned
		 */
		index: indexMode,

		/**
		 * Returns items in the same dataset. If the options.intersect parameter is true, we only return items if we intersect something
		 * If the options.intersect is false, we find the nearest item and return the items in that dataset
		 * @function Chart.Interaction.modes.dataset
		 * @param chart {chart} the chart we are returning items from
		 * @param e {Event} the event we are find things at
		 * @param options {IInteractionOptions} options to use during interaction
		 * @return {Chart.Element[]} Array of elements that are under the point. If none are found, an empty array is returned
		 */
		dataset: function(chart, e, options) {
			var position = getRelativePosition(e, chart);
			options.axis = options.axis || 'xy';
			var distanceMetric = getDistanceMetricForAxis(options.axis);
			var items = options.intersect ? getIntersectItems(chart, position) : getNearestItems(chart, position, false, distanceMetric);

			if (items.length > 0) {
				items = chart.getDatasetMeta(items[0]._datasetIndex).data;
			}

			return items;
		},

		/**
		 * @function Chart.Interaction.modes.x-axis
		 * @deprecated since version 2.4.0. Use index mode and intersect == true
		 * @todo remove at version 3
		 * @private
		 */
		'x-axis': function(chart, e) {
			return indexMode(chart, e, {intersect: false});
		},

		/**
		 * Point mode returns all elements that hit test based on the event position
		 * of the event
		 * @function Chart.Interaction.modes.intersect
		 * @param chart {chart} the chart we are returning items from
		 * @param e {Event} the event we are find things at
		 * @return {Chart.Element[]} Array of elements that are under the point. If none are found, an empty array is returned
		 */
		point: function(chart, e) {
			var position = getRelativePosition(e, chart);
			return getIntersectItems(chart, position);
		},

		/**
		 * nearest mode returns the element closest to the point
		 * @function Chart.Interaction.modes.intersect
		 * @param chart {chart} the chart we are returning items from
		 * @param e {Event} the event we are find things at
		 * @param options {IInteractionOptions} options to use
		 * @return {Chart.Element[]} Array of elements that are under the point. If none are found, an empty array is returned
		 */
		nearest: function(chart, e, options) {
			var position = getRelativePosition(e, chart);
			options.axis = options.axis || 'xy';
			var distanceMetric = getDistanceMetricForAxis(options.axis);
			var nearestItems = getNearestItems(chart, position, options.intersect, distanceMetric);

			// We have multiple items at the same distance from the event. Now sort by smallest
			if (nearestItems.length > 1) {
				nearestItems.sort(function(a, b) {
					var sizeA = a.getArea();
					var sizeB = b.getArea();
					var ret = sizeA - sizeB;

					if (ret === 0) {
						// if equal sort by dataset index
						ret = a._datasetIndex - b._datasetIndex;
					}

					return ret;
				});
			}

			// Return only 1 item
			return nearestItems.slice(0, 1);
		},

		/**
		 * x mode returns the elements that hit-test at the current x coordinate
		 * @function Chart.Interaction.modes.x
		 * @param chart {chart} the chart we are returning items from
		 * @param e {Event} the event we are find things at
		 * @param options {IInteractionOptions} options to use
		 * @return {Chart.Element[]} Array of elements that are under the point. If none are found, an empty array is returned
		 */
		x: function(chart, e, options) {
			var position = getRelativePosition(e, chart);
			var items = [];
			var intersectsItem = false;

			parseVisibleItems(chart, function(element) {
				if (element.inXRange(position.x)) {
					items.push(element);
				}

				if (element.inRange(position.x, position.y)) {
					intersectsItem = true;
				}
			});

			// If we want to trigger on an intersect and we don't have any items
			// that intersect the position, return nothing
			if (options.intersect && !intersectsItem) {
				items = [];
			}
			return items;
		},

		/**
		 * y mode returns the elements that hit-test at the current y coordinate
		 * @function Chart.Interaction.modes.y
		 * @param chart {chart} the chart we are returning items from
		 * @param e {Event} the event we are find things at
		 * @param options {IInteractionOptions} options to use
		 * @return {Chart.Element[]} Array of elements that are under the point. If none are found, an empty array is returned
		 */
		y: function(chart, e, options) {
			var position = getRelativePosition(e, chart);
			var items = [];
			var intersectsItem = false;

			parseVisibleItems(chart, function(element) {
				if (element.inYRange(position.y)) {
					items.push(element);
				}

				if (element.inRange(position.x, position.y)) {
					intersectsItem = true;
				}
			});

			// If we want to trigger on an intersect and we don't have any items
			// that intersect the position, return nothing
			if (options.intersect && !intersectsItem) {
				items = [];
			}
			return items;
		}
	}
};

},{"45":45}],29:[function(require,module,exports){
'use strict';

var defaults = require(25);

defaults._set('global', {
	responsive: true,
	responsiveAnimationDuration: 0,
	maintainAspectRatio: true,
	events: ['mousemove', 'mouseout', 'click', 'touchstart', 'touchmove'],
	hover: {
		onHover: null,
		mode: 'nearest',
		intersect: true,
		animationDuration: 400
	},
	onClick: null,
	defaultColor: 'rgba(0,0,0,0.1)',
	defaultFontColor: '#666',
	defaultFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
	defaultFontSize: 12,
	defaultFontStyle: 'normal',
	showLines: true,

	// Element defaults defined in element extensions
	elements: {},

	// Layout options such as padding
	layout: {
		padding: {
			top: 0,
			right: 0,
			bottom: 0,
			left: 0
		}
	}
});

module.exports = function() {

	// Occupy the global variable of Chart, and create a simple base class
	var Chart = function(item, config) {
		this.construct(item, config);
		return this;
	};

	Chart.Chart = Chart;

	return Chart;
};

},{"25":25}],30:[function(require,module,exports){
'use strict';

var helpers = require(45);

function filterByPosition(array, position) {
	return helpers.where(array, function(v) {
		return v.position === position;
	});
}

function sortByWeight(array, reverse) {
	array.forEach(function(v, i) {
		v._tmpIndex_ = i;
		return v;
	});
	array.sort(function(a, b) {
		var v0 = reverse ? b : a;
		var v1 = reverse ? a : b;
		return v0.weight === v1.weight ?
			v0._tmpIndex_ - v1._tmpIndex_ :
			v0.weight - v1.weight;
	});
	array.forEach(function(v) {
		delete v._tmpIndex_;
	});
}

/**
 * @interface ILayoutItem
 * @prop {String} position - The position of the item in the chart layout. Possible values are
 * 'left', 'top', 'right', 'bottom', and 'chartArea'
 * @prop {Number} weight - The weight used to sort the item. Higher weights are further away from the chart area
 * @prop {Boolean} fullWidth - if true, and the item is horizontal, then push vertical boxes down
 * @prop {Function} isHorizontal - returns true if the layout item is horizontal (ie. top or bottom)
 * @prop {Function} update - Takes two parameters: width and height. Returns size of item
 * @prop {Function} getPadding -  Returns an object with padding on the edges
 * @prop {Number} width - Width of item. Must be valid after update()
 * @prop {Number} height - Height of item. Must be valid after update()
 * @prop {Number} left - Left edge of the item. Set by layout system and cannot be used in update
 * @prop {Number} top - Top edge of the item. Set by layout system and cannot be used in update
 * @prop {Number} right - Right edge of the item. Set by layout system and cannot be used in update
 * @prop {Number} bottom - Bottom edge of the item. Set by layout system and cannot be used in update
 */

// The layout service is very self explanatory.  It's responsible for the layout within a chart.
// Scales, Legends and Plugins all rely on the layout service and can easily register to be placed anywhere they need
// It is this service's responsibility of carrying out that layout.
module.exports = {
	defaults: {},

	/**
	 * Register a box to a chart.
	 * A box is simply a reference to an object that requires layout. eg. Scales, Legend, Title.
	 * @param {Chart} chart - the chart to use
	 * @param {ILayoutItem} item - the item to add to be layed out
	 */
	addBox: function(chart, item) {
		if (!chart.boxes) {
			chart.boxes = [];
		}

		// initialize item with default values
		item.fullWidth = item.fullWidth || false;
		item.position = item.position || 'top';
		item.weight = item.weight || 0;

		chart.boxes.push(item);
	},

	/**
	 * Remove a layoutItem from a chart
	 * @param {Chart} chart - the chart to remove the box from
	 * @param {Object} layoutItem - the item to remove from the layout
	 */
	removeBox: function(chart, layoutItem) {
		var index = chart.boxes ? chart.boxes.indexOf(layoutItem) : -1;
		if (index !== -1) {
			chart.boxes.splice(index, 1);
		}
	},

	/**
	 * Sets (or updates) options on the given `item`.
	 * @param {Chart} chart - the chart in which the item lives (or will be added to)
	 * @param {Object} item - the item to configure with the given options
	 * @param {Object} options - the new item options.
	 */
	configure: function(chart, item, options) {
		var props = ['fullWidth', 'position', 'weight'];
		var ilen = props.length;
		var i = 0;
		var prop;

		for (; i < ilen; ++i) {
			prop = props[i];
			if (options.hasOwnProperty(prop)) {
				item[prop] = options[prop];
			}
		}
	},

	/**
	 * Fits boxes of the given chart into the given size by having each box measure itself
	 * then running a fitting algorithm
	 * @param {Chart} chart - the chart
	 * @param {Number} width - the width to fit into
	 * @param {Number} height - the height to fit into
	 */
	update: function(chart, width, height) {
		if (!chart) {
			return;
		}

		var layoutOptions = chart.options.layout || {};
		var padding = helpers.options.toPadding(layoutOptions.padding);
		var leftPadding = padding.left;
		var rightPadding = padding.right;
		var topPadding = padding.top;
		var bottomPadding = padding.bottom;

		var leftBoxes = filterByPosition(chart.boxes, 'left');
		var rightBoxes = filterByPosition(chart.boxes, 'right');
		var topBoxes = filterByPosition(chart.boxes, 'top');
		var bottomBoxes = filterByPosition(chart.boxes, 'bottom');
		var chartAreaBoxes = filterByPosition(chart.boxes, 'chartArea');

		// Sort boxes by weight. A higher weight is further away from the chart area
		sortByWeight(leftBoxes, true);
		sortByWeight(rightBoxes, false);
		sortByWeight(topBoxes, true);
		sortByWeight(bottomBoxes, false);

		// Essentially we now have any number of boxes on each of the 4 sides.
		// Our canvas looks like the following.
		// The areas L1 and L2 are the left axes. R1 is the right axis, T1 is the top axis and
		// B1 is the bottom axis
		// There are also 4 quadrant-like locations (left to right instead of clockwise) reserved for chart overlays
		// These locations are single-box locations only, when trying to register a chartArea location that is already taken,
		// an error will be thrown.
		//
		// |----------------------------------------------------|
		// |                  T1 (Full Width)                   |
		// |----------------------------------------------------|
		// |    |    |                 T2                  |    |
		// |    |----|-------------------------------------|----|
		// |    |    | C1 |                           | C2 |    |
		// |    |    |----|                           |----|    |
		// |    |    |                                     |    |
		// | L1 | L2 |           ChartArea (C0)            | R1 |
		// |    |    |                                     |    |
		// |    |    |----|                           |----|    |
		// |    |    | C3 |                           | C4 |    |
		// |    |----|-------------------------------------|----|
		// |    |    |                 B1                  |    |
		// |----------------------------------------------------|
		// |                  B2 (Full Width)                   |
		// |----------------------------------------------------|
		//
		// What we do to find the best sizing, we do the following
		// 1. Determine the minimum size of the chart area.
		// 2. Split the remaining width equally between each vertical axis
		// 3. Split the remaining height equally between each horizontal axis
		// 4. Give each layout the maximum size it can be. The layout will return it's minimum size
		// 5. Adjust the sizes of each axis based on it's minimum reported size.
		// 6. Refit each axis
		// 7. Position each axis in the final location
		// 8. Tell the chart the final location of the chart area
		// 9. Tell any axes that overlay the chart area the positions of the chart area

		// Step 1
		var chartWidth = width - leftPadding - rightPadding;
		var chartHeight = height - topPadding - bottomPadding;
		var chartAreaWidth = chartWidth / 2; // min 50%
		var chartAreaHeight = chartHeight / 2; // min 50%

		// Step 2
		var verticalBoxWidth = (width - chartAreaWidth) / (leftBoxes.length + rightBoxes.length);

		// Step 3
		var horizontalBoxHeight = (height - chartAreaHeight) / (topBoxes.length + bottomBoxes.length);

		// Step 4
		var maxChartAreaWidth = chartWidth;
		var maxChartAreaHeight = chartHeight;
		var minBoxSizes = [];

		function getMinimumBoxSize(box) {
			var minSize;
			var isHorizontal = box.isHorizontal();

			if (isHorizontal) {
				minSize = box.update(box.fullWidth ? chartWidth : maxChartAreaWidth, horizontalBoxHeight);
				maxChartAreaHeight -= minSize.height;
			} else {
				minSize = box.update(verticalBoxWidth, maxChartAreaHeight);
				maxChartAreaWidth -= minSize.width;
			}

			minBoxSizes.push({
				horizontal: isHorizontal,
				minSize: minSize,
				box: box,
			});
		}

		helpers.each(leftBoxes.concat(rightBoxes, topBoxes, bottomBoxes), getMinimumBoxSize);

		// If a horizontal box has padding, we move the left boxes over to avoid ugly charts (see issue #2478)
		var maxHorizontalLeftPadding = 0;
		var maxHorizontalRightPadding = 0;
		var maxVerticalTopPadding = 0;
		var maxVerticalBottomPadding = 0;

		helpers.each(topBoxes.concat(bottomBoxes), function(horizontalBox) {
			if (horizontalBox.getPadding) {
				var boxPadding = horizontalBox.getPadding();
				maxHorizontalLeftPadding = Math.max(maxHorizontalLeftPadding, boxPadding.left);
				maxHorizontalRightPadding = Math.max(maxHorizontalRightPadding, boxPadding.right);
			}
		});

		helpers.each(leftBoxes.concat(rightBoxes), function(verticalBox) {
			if (verticalBox.getPadding) {
				var boxPadding = verticalBox.getPadding();
				maxVerticalTopPadding = Math.max(maxVerticalTopPadding, boxPadding.top);
				maxVerticalBottomPadding = Math.max(maxVerticalBottomPadding, boxPadding.bottom);
			}
		});

		// At this point, maxChartAreaHeight and maxChartAreaWidth are the size the chart area could
		// be if the axes are drawn at their minimum sizes.
		// Steps 5 & 6
		var totalLeftBoxesWidth = leftPadding;
		var totalRightBoxesWidth = rightPadding;
		var totalTopBoxesHeight = topPadding;
		var totalBottomBoxesHeight = bottomPadding;

		// Function to fit a box
		function fitBox(box) {
			var minBoxSize = helpers.findNextWhere(minBoxSizes, function(minBox) {
				return minBox.box === box;
			});

			if (minBoxSize) {
				if (box.isHorizontal()) {
					var scaleMargin = {
						left: Math.max(totalLeftBoxesWidth, maxHorizontalLeftPadding),
						right: Math.max(totalRightBoxesWidth, maxHorizontalRightPadding),
						top: 0,
						bottom: 0
					};

					// Don't use min size here because of label rotation. When the labels are rotated, their rotation highly depends
					// on the margin. Sometimes they need to increase in size slightly
					box.update(box.fullWidth ? chartWidth : maxChartAreaWidth, chartHeight / 2, scaleMargin);
				} else {
					box.update(minBoxSize.minSize.width, maxChartAreaHeight);
				}
			}
		}

		// Update, and calculate the left and right margins for the horizontal boxes
		helpers.each(leftBoxes.concat(rightBoxes), fitBox);

		helpers.each(leftBoxes, function(box) {
			totalLeftBoxesWidth += box.width;
		});

		helpers.each(rightBoxes, function(box) {
			totalRightBoxesWidth += box.width;
		});

		// Set the Left and Right margins for the horizontal boxes
		helpers.each(topBoxes.concat(bottomBoxes), fitBox);

		// Figure out how much margin is on the top and bottom of the vertical boxes
		helpers.each(topBoxes, function(box) {
			totalTopBoxesHeight += box.height;
		});

		helpers.each(bottomBoxes, function(box) {
			totalBottomBoxesHeight += box.height;
		});

		function finalFitVerticalBox(box) {
			var minBoxSize = helpers.findNextWhere(minBoxSizes, function(minSize) {
				return minSize.box === box;
			});

			var scaleMargin = {
				left: 0,
				right: 0,
				top: totalTopBoxesHeight,
				bottom: totalBottomBoxesHeight
			};

			if (minBoxSize) {
				box.update(minBoxSize.minSize.width, maxChartAreaHeight, scaleMargin);
			}
		}

		// Let the left layout know the final margin
		helpers.each(leftBoxes.concat(rightBoxes), finalFitVerticalBox);

		// Recalculate because the size of each layout might have changed slightly due to the margins (label rotation for instance)
		totalLeftBoxesWidth = leftPadding;
		totalRightBoxesWidth = rightPadding;
		totalTopBoxesHeight = topPadding;
		totalBottomBoxesHeight = bottomPadding;

		helpers.each(leftBoxes, function(box) {
			totalLeftBoxesWidth += box.width;
		});

		helpers.each(rightBoxes, function(box) {
			totalRightBoxesWidth += box.width;
		});

		helpers.each(topBoxes, function(box) {
			totalTopBoxesHeight += box.height;
		});
		helpers.each(bottomBoxes, function(box) {
			totalBottomBoxesHeight += box.height;
		});

		// We may be adding some padding to account for rotated x axis labels
		var leftPaddingAddition = Math.max(maxHorizontalLeftPadding - totalLeftBoxesWidth, 0);
		totalLeftBoxesWidth += leftPaddingAddition;
		totalRightBoxesWidth += Math.max(maxHorizontalRightPadding - totalRightBoxesWidth, 0);

		var topPaddingAddition = Math.max(maxVerticalTopPadding - totalTopBoxesHeight, 0);
		totalTopBoxesHeight += topPaddingAddition;
		totalBottomBoxesHeight += Math.max(maxVerticalBottomPadding - totalBottomBoxesHeight, 0);

		// Figure out if our chart area changed. This would occur if the dataset layout label rotation
		// changed due to the application of the margins in step 6. Since we can only get bigger, this is safe to do
		// without calling `fit` again
		var newMaxChartAreaHeight = height - totalTopBoxesHeight - totalBottomBoxesHeight;
		var newMaxChartAreaWidth = width - totalLeftBoxesWidth - totalRightBoxesWidth;

		if (newMaxChartAreaWidth !== maxChartAreaWidth || newMaxChartAreaHeight !== maxChartAreaHeight) {
			helpers.each(leftBoxes, function(box) {
				box.height = newMaxChartAreaHeight;
			});

			helpers.each(rightBoxes, function(box) {
				box.height = newMaxChartAreaHeight;
			});

			helpers.each(topBoxes, function(box) {
				if (!box.fullWidth) {
					box.width = newMaxChartAreaWidth;
				}
			});

			helpers.each(bottomBoxes, function(box) {
				if (!box.fullWidth) {
					box.width = newMaxChartAreaWidth;
				}
			});

			maxChartAreaHeight = newMaxChartAreaHeight;
			maxChartAreaWidth = newMaxChartAreaWidth;
		}

		// Step 7 - Position the boxes
		var left = leftPadding + leftPaddingAddition;
		var top = topPadding + topPaddingAddition;

		function placeBox(box) {
			if (box.isHorizontal()) {
				box.left = box.fullWidth ? leftPadding : totalLeftBoxesWidth;
				box.right = box.fullWidth ? width - rightPadding : totalLeftBoxesWidth + maxChartAreaWidth;
				box.top = top;
				box.bottom = top + box.height;

				// Move to next point
				top = box.bottom;

			} else {

				box.left = left;
				box.right = left + box.width;
				box.top = totalTopBoxesHeight;
				box.bottom = totalTopBoxesHeight + maxChartAreaHeight;

				// Move to next point
				left = box.right;
			}
		}

		helpers.each(leftBoxes.concat(topBoxes), placeBox);

		// Account for chart width and height
		left += maxChartAreaWidth;
		top += maxChartAreaHeight;

		helpers.each(rightBoxes, placeBox);
		helpers.each(bottomBoxes, placeBox);

		// Step 8
		chart.chartArea = {
			left: totalLeftBoxesWidth,
			top: totalTopBoxesHeight,
			right: totalLeftBoxesWidth + maxChartAreaWidth,
			bottom: totalTopBoxesHeight + maxChartAreaHeight
		};

		// Step 9
		helpers.each(chartAreaBoxes, function(box) {
			box.left = chart.chartArea.left;
			box.top = chart.chartArea.top;
			box.right = chart.chartArea.right;
			box.bottom = chart.chartArea.bottom;

			box.update(maxChartAreaWidth, maxChartAreaHeight);
		});
	}
};

},{"45":45}],31:[function(require,module,exports){
'use strict';

var defaults = require(25);
var helpers = require(45);

defaults._set('global', {
	plugins: {}
});

/**
 * The plugin service singleton
 * @namespace Chart.plugins
 * @since 2.1.0
 */
module.exports = {
	/**
	 * Globally registered plugins.
	 * @private
	 */
	_plugins: [],

	/**
	 * This identifier is used to invalidate the descriptors cache attached to each chart
	 * when a global plugin is registered or unregistered. In this case, the cache ID is
	 * incremented and descriptors are regenerated during following API calls.
	 * @private
	 */
	_cacheId: 0,

	/**
	 * Registers the given plugin(s) if not already registered.
	 * @param {Array|Object} plugins plugin instance(s).
	 */
	register: function(plugins) {
		var p = this._plugins;
		([]).concat(plugins).forEach(function(plugin) {
			if (p.indexOf(plugin) === -1) {
				p.push(plugin);
			}
		});

		this._cacheId++;
	},

	/**
	 * Unregisters the given plugin(s) only if registered.
	 * @param {Array|Object} plugins plugin instance(s).
	 */
	unregister: function(plugins) {
		var p = this._plugins;
		([]).concat(plugins).forEach(function(plugin) {
			var idx = p.indexOf(plugin);
			if (idx !== -1) {
				p.splice(idx, 1);
			}
		});

		this._cacheId++;
	},

	/**
	 * Remove all registered plugins.
	 * @since 2.1.5
	 */
	clear: function() {
		this._plugins = [];
		this._cacheId++;
	},

	/**
	 * Returns the number of registered plugins?
	 * @returns {Number}
	 * @since 2.1.5
	 */
	count: function() {
		return this._plugins.length;
	},

	/**
	 * Returns all registered plugin instances.
	 * @returns {Array} array of plugin objects.
	 * @since 2.1.5
	 */
	getAll: function() {
		return this._plugins;
	},

	/**
	 * Calls enabled plugins for `chart` on the specified hook and with the given args.
	 * This method immediately returns as soon as a plugin explicitly returns false. The
	 * returned value can be used, for instance, to interrupt the current action.
	 * @param {Object} chart - The chart instance for which plugins should be called.
	 * @param {String} hook - The name of the plugin method to call (e.g. 'beforeUpdate').
	 * @param {Array} [args] - Extra arguments to apply to the hook call.
	 * @returns {Boolean} false if any of the plugins return false, else returns true.
	 */
	notify: function(chart, hook, args) {
		var descriptors = this.descriptors(chart);
		var ilen = descriptors.length;
		var i, descriptor, plugin, params, method;

		for (i = 0; i < ilen; ++i) {
			descriptor = descriptors[i];
			plugin = descriptor.plugin;
			method = plugin[hook];
			if (typeof method === 'function') {
				params = [chart].concat(args || []);
				params.push(descriptor.options);
				if (method.apply(plugin, params) === false) {
					return false;
				}
			}
		}

		return true;
	},

	/**
	 * Returns descriptors of enabled plugins for the given chart.
	 * @returns {Array} [{ plugin, options }]
	 * @private
	 */
	descriptors: function(chart) {
		var cache = chart.$plugins || (chart.$plugins = {});
		if (cache.id === this._cacheId) {
			return cache.descriptors;
		}

		var plugins = [];
		var descriptors = [];
		var config = (chart && chart.config) || {};
		var options = (config.options && config.options.plugins) || {};

		this._plugins.concat(config.plugins || []).forEach(function(plugin) {
			var idx = plugins.indexOf(plugin);
			if (idx !== -1) {
				return;
			}

			var id = plugin.id;
			var opts = options[id];
			if (opts === false) {
				return;
			}

			if (opts === true) {
				opts = helpers.clone(defaults.global.plugins[id]);
			}

			plugins.push(plugin);
			descriptors.push({
				plugin: plugin,
				options: opts || {}
			});
		});

		cache.descriptors = descriptors;
		cache.id = this._cacheId;
		return descriptors;
	},

	/**
	 * Invalidates cache for the given chart: descriptors hold a reference on plugin option,
	 * but in some cases, this reference can be changed by the user when updating options.
	 * https://github.com/chartjs/Chart.js/issues/5111#issuecomment-355934167
	 * @private
	 */
	_invalidate: function(chart) {
		delete chart.$plugins;
	}
};

/**
 * Plugin extension hooks.
 * @interface IPlugin
 * @since 2.1.0
 */
/**
 * @method IPlugin#beforeInit
 * @desc Called before initializing `chart`.
 * @param {Chart.Controller} chart - The chart instance.
 * @param {Object} options - The plugin options.
 */
/**
 * @method IPlugin#afterInit
 * @desc Called after `chart` has been initialized and before the first update.
 * @param {Chart.Controller} chart - The chart instance.
 * @param {Object} options - The plugin options.
 */
/**
 * @method IPlugin#beforeUpdate
 * @desc Called before updating `chart`. If any plugin returns `false`, the update
 * is cancelled (and thus subsequent render(s)) until another `update` is triggered.
 * @param {Chart.Controller} chart - The chart instance.
 * @param {Object} options - The plugin options.
 * @returns {Boolean} `false` to cancel the chart update.
 */
/**
 * @method IPlugin#afterUpdate
 * @desc Called after `chart` has been updated and before rendering. Note that this
 * hook will not be called if the chart update has been previously cancelled.
 * @param {Chart.Controller} chart - The chart instance.
 * @param {Object} options - The plugin options.
 */
/**
 * @method IPlugin#beforeDatasetsUpdate
 * @desc Called before updating the `chart` datasets. If any plugin returns `false`,
 * the datasets update is cancelled until another `update` is triggered.
 * @param {Chart.Controller} chart - The chart instance.
 * @param {Object} options - The plugin options.
 * @returns {Boolean} false to cancel the datasets update.
 * @since version 2.1.5
*/
/**
 * @method IPlugin#afterDatasetsUpdate
 * @desc Called after the `chart` datasets have been updated. Note that this hook
 * will not be called if the datasets update has been previously cancelled.
 * @param {Chart.Controller} chart - The chart instance.
 * @param {Object} options - The plugin options.
 * @since version 2.1.5
 */
/**
 * @method IPlugin#beforeDatasetUpdate
 * @desc Called before updating the `chart` dataset at the given `args.index`. If any plugin
 * returns `false`, the datasets update is cancelled until another `update` is triggered.
 * @param {Chart} chart - The chart instance.
 * @param {Object} args - The call arguments.
 * @param {Number} args.index - The dataset index.
 * @param {Object} args.meta - The dataset metadata.
 * @param {Object} options - The plugin options.
 * @returns {Boolean} `false` to cancel the chart datasets drawing.
 */
/**
 * @method IPlugin#afterDatasetUpdate
 * @desc Called after the `chart` datasets at the given `args.index` has been updated. Note
 * that this hook will not be called if the datasets update has been previously cancelled.
 * @param {Chart} chart - The chart instance.
 * @param {Object} args - The call arguments.
 * @param {Number} args.index - The dataset index.
 * @param {Object} args.meta - The dataset metadata.
 * @param {Object} options - The plugin options.
 */
/**
 * @method IPlugin#beforeLayout
 * @desc Called before laying out `chart`. If any plugin returns `false`,
 * the layout update is cancelled until another `update` is triggered.
 * @param {Chart.Controller} chart - The chart instance.
 * @param {Object} options - The plugin options.
 * @returns {Boolean} `false` to cancel the chart layout.
 */
/**
 * @method IPlugin#afterLayout
 * @desc Called after the `chart` has been layed out. Note that this hook will not
 * be called if the layout update has been previously cancelled.
 * @param {Chart.Controller} chart - The chart instance.
 * @param {Object} options - The plugin options.
 */
/**
 * @method IPlugin#beforeRender
 * @desc Called before rendering `chart`. If any plugin returns `false`,
 * the rendering is cancelled until another `render` is triggered.
 * @param {Chart.Controller} chart - The chart instance.
 * @param {Object} options - The plugin options.
 * @returns {Boolean} `false` to cancel the chart rendering.
 */
/**
 * @method IPlugin#afterRender
 * @desc Called after the `chart` has been fully rendered (and animation completed). Note
 * that this hook will not be called if the rendering has been previously cancelled.
 * @param {Chart.Controller} chart - The chart instance.
 * @param {Object} options - The plugin options.
 */
/**
 * @method IPlugin#beforeDraw
 * @desc Called before drawing `chart` at every animation frame specified by the given
 * easing value. If any plugin returns `false`, the frame drawing is cancelled until
 * another `render` is triggered.
 * @param {Chart.Controller} chart - The chart instance.
 * @param {Number} easingValue - The current animation value, between 0.0 and 1.0.
 * @param {Object} options - The plugin options.
 * @returns {Boolean} `false` to cancel the chart drawing.
 */
/**
 * @method IPlugin#afterDraw
 * @desc Called after the `chart` has been drawn for the specific easing value. Note
 * that this hook will not be called if the drawing has been previously cancelled.
 * @param {Chart.Controller} chart - The chart instance.
 * @param {Number} easingValue - The current animation value, between 0.0 and 1.0.
 * @param {Object} options - The plugin options.
 */
/**
 * @method IPlugin#beforeDatasetsDraw
 * @desc Called before drawing the `chart` datasets. If any plugin returns `false`,
 * the datasets drawing is cancelled until another `render` is triggered.
 * @param {Chart.Controller} chart - The chart instance.
 * @param {Number} easingValue - The current animation value, between 0.0 and 1.0.
 * @param {Object} options - The plugin options.
 * @returns {Boolean} `false` to cancel the chart datasets drawing.
 */
/**
 * @method IPlugin#afterDatasetsDraw
 * @desc Called after the `chart` datasets have been drawn. Note that this hook
 * will not be called if the datasets drawing has been previously cancelled.
 * @param {Chart.Controller} chart - The chart instance.
 * @param {Number} easingValue - The current animation value, between 0.0 and 1.0.
 * @param {Object} options - The plugin options.
 */
/**
 * @method IPlugin#beforeDatasetDraw
 * @desc Called before drawing the `chart` dataset at the given `args.index` (datasets
 * are drawn in the reverse order). If any plugin returns `false`, the datasets drawing
 * is cancelled until another `render` is triggered.
 * @param {Chart} chart - The chart instance.
 * @param {Object} args - The call arguments.
 * @param {Number} args.index - The dataset index.
 * @param {Object} args.meta - The dataset metadata.
 * @param {Number} args.easingValue - The current animation value, between 0.0 and 1.0.
 * @param {Object} options - The plugin options.
 * @returns {Boolean} `false` to cancel the chart datasets drawing.
 */
/**
 * @method IPlugin#afterDatasetDraw
 * @desc Called after the `chart` datasets at the given `args.index` have been drawn
 * (datasets are drawn in the reverse order). Note that this hook will not be called
 * if the datasets drawing has been previously cancelled.
 * @param {Chart} chart - The chart instance.
 * @param {Object} args - The call arguments.
 * @param {Number} args.index - The dataset index.
 * @param {Object} args.meta - The dataset metadata.
 * @param {Number} args.easingValue - The current animation value, between 0.0 and 1.0.
 * @param {Object} options - The plugin options.
 */
/**
 * @method IPlugin#beforeTooltipDraw
 * @desc Called before drawing the `tooltip`. If any plugin returns `false`,
 * the tooltip drawing is cancelled until another `render` is triggered.
 * @param {Chart} chart - The chart instance.
 * @param {Object} args - The call arguments.
 * @param {Object} args.tooltip - The tooltip.
 * @param {Number} args.easingValue - The current animation value, between 0.0 and 1.0.
 * @param {Object} options - The plugin options.
 * @returns {Boolean} `false` to cancel the chart tooltip drawing.
 */
/**
 * @method IPlugin#afterTooltipDraw
 * @desc Called after drawing the `tooltip`. Note that this hook will not
 * be called if the tooltip drawing has been previously cancelled.
 * @param {Chart} chart - The chart instance.
 * @param {Object} args - The call arguments.
 * @param {Object} args.tooltip - The tooltip.
 * @param {Number} args.easingValue - The current animation value, between 0.0 and 1.0.
 * @param {Object} options - The plugin options.
 */
/**
 * @method IPlugin#beforeEvent
 * @desc Called before processing the specified `event`. If any plugin returns `false`,
 * the event will be discarded.
 * @param {Chart.Controller} chart - The chart instance.
 * @param {IEvent} event - The event object.
 * @param {Object} options - The plugin options.
 */
/**
 * @method IPlugin#afterEvent
 * @desc Called after the `event` has been consumed. Note that this hook
 * will not be called if the `event` has been previously discarded.
 * @param {Chart.Controller} chart - The chart instance.
 * @param {IEvent} event - The event object.
 * @param {Object} options - The plugin options.
 */
/**
 * @method IPlugin#resize
 * @desc Called after the chart as been resized.
 * @param {Chart.Controller} chart - The chart instance.
 * @param {Number} size - The new canvas display size (eq. canvas.style width & height).
 * @param {Object} options - The plugin options.
 */
/**
 * @method IPlugin#destroy
 * @desc Called after the chart as been destroyed.
 * @param {Chart.Controller} chart - The chart instance.
 * @param {Object} options - The plugin options.
 */

},{"25":25,"45":45}],32:[function(require,module,exports){
'use strict';

var defaults = require(25);
var Element = require(26);
var helpers = require(45);
var Ticks = require(34);

defaults._set('scale', {
	display: true,
	position: 'left',
	offset: false,

	// grid line settings
	gridLines: {
		display: true,
		color: 'rgba(0, 0, 0, 0.1)',
		lineWidth: 1,
		drawBorder: true,
		drawOnChartArea: true,
		drawTicks: true,
		tickMarkLength: 10,
		zeroLineWidth: 1,
		zeroLineColor: 'rgba(0,0,0,0.25)',
		zeroLineBorderDash: [],
		zeroLineBorderDashOffset: 0.0,
		offsetGridLines: false,
		borderDash: [],
		borderDashOffset: 0.0
	},

	// scale label
	scaleLabel: {
		// display property
		display: false,

		// actual label
		labelString: '',

		// line height
		lineHeight: 1.2,

		// top/bottom padding
		padding: {
			top: 4,
			bottom: 4
		}
	},

	// label settings
	ticks: {
		beginAtZero: false,
		minRotation: 0,
		maxRotation: 50,
		mirror: false,
		padding: 0,
		reverse: false,
		display: true,
		autoSkip: true,
		autoSkipPadding: 0,
		labelOffset: 0,
		// We pass through arrays to be rendered as multiline labels, we convert Others to strings here.
		callback: Ticks.formatters.values,
		minor: {},
		major: {}
	}
});

function labelsFromTicks(ticks) {
	var labels = [];
	var i, ilen;

	for (i = 0, ilen = ticks.length; i < ilen; ++i) {
		labels.push(ticks[i].label);
	}

	return labels;
}

function getLineValue(scale, index, offsetGridLines) {
	var lineValue = scale.getPixelForTick(index);

	if (offsetGridLines) {
		if (index === 0) {
			lineValue -= (scale.getPixelForTick(1) - lineValue) / 2;
		} else {
			lineValue -= (lineValue - scale.getPixelForTick(index - 1)) / 2;
		}
	}
	return lineValue;
}

module.exports = function(Chart) {

	function computeTextSize(context, tick, font) {
		return helpers.isArray(tick) ?
			helpers.longestText(context, font, tick) :
			context.measureText(tick).width;
	}

	function parseFontOptions(options) {
		var valueOrDefault = helpers.valueOrDefault;
		var globalDefaults = defaults.global;
		var size = valueOrDefault(options.fontSize, globalDefaults.defaultFontSize);
		var style = valueOrDefault(options.fontStyle, globalDefaults.defaultFontStyle);
		var family = valueOrDefault(options.fontFamily, globalDefaults.defaultFontFamily);

		return {
			size: size,
			style: style,
			family: family,
			font: helpers.fontString(size, style, family)
		};
	}

	function parseLineHeight(options) {
		return helpers.options.toLineHeight(
			helpers.valueOrDefault(options.lineHeight, 1.2),
			helpers.valueOrDefault(options.fontSize, defaults.global.defaultFontSize));
	}

	Chart.Scale = Element.extend({
		/**
		 * Get the padding needed for the scale
		 * @method getPadding
		 * @private
		 * @returns {Padding} the necessary padding
		 */
		getPadding: function() {
			var me = this;
			return {
				left: me.paddingLeft || 0,
				top: me.paddingTop || 0,
				right: me.paddingRight || 0,
				bottom: me.paddingBottom || 0
			};
		},

		/**
		 * Returns the scale tick objects ({label, major})
		 * @since 2.7
		 */
		getTicks: function() {
			return this._ticks;
		},

		// These methods are ordered by lifecyle. Utilities then follow.
		// Any function defined here is inherited by all scale types.
		// Any function can be extended by the scale type

		mergeTicksOptions: function() {
			var ticks = this.options.ticks;
			if (ticks.minor === false) {
				ticks.minor = {
					display: false
				};
			}
			if (ticks.major === false) {
				ticks.major = {
					display: false
				};
			}
			for (var key in ticks) {
				if (key !== 'major' && key !== 'minor') {
					if (typeof ticks.minor[key] === 'undefined') {
						ticks.minor[key] = ticks[key];
					}
					if (typeof ticks.major[key] === 'undefined') {
						ticks.major[key] = ticks[key];
					}
				}
			}
		},
		beforeUpdate: function() {
			helpers.callback(this.options.beforeUpdate, [this]);
		},
		update: function(maxWidth, maxHeight, margins) {
			var me = this;
			var i, ilen, labels, label, ticks, tick;

			// Update Lifecycle - Probably don't want to ever extend or overwrite this function ;)
			me.beforeUpdate();

			// Absorb the master measurements
			me.maxWidth = maxWidth;
			me.maxHeight = maxHeight;
			me.margins = helpers.extend({
				left: 0,
				right: 0,
				top: 0,
				bottom: 0
			}, margins);
			me.longestTextCache = me.longestTextCache || {};

			// Dimensions
			me.beforeSetDimensions();
			me.setDimensions();
			me.afterSetDimensions();

			// Data min/max
			me.beforeDataLimits();
			me.determineDataLimits();
			me.afterDataLimits();

			// Ticks - `this.ticks` is now DEPRECATED!
			// Internal ticks are now stored as objects in the PRIVATE `this._ticks` member
			// and must not be accessed directly from outside this class. `this.ticks` being
			// around for long time and not marked as private, we can't change its structure
			// without unexpected breaking changes. If you need to access the scale ticks,
			// use scale.getTicks() instead.

			me.beforeBuildTicks();

			// New implementations should return an array of objects but for BACKWARD COMPAT,
			// we still support no return (`this.ticks` internally set by calling this method).
			ticks = me.buildTicks() || [];

			me.afterBuildTicks();

			me.beforeTickToLabelConversion();

			// New implementations should return the formatted tick labels but for BACKWARD
			// COMPAT, we still support no return (`this.ticks` internally changed by calling
			// this method and supposed to contain only string values).
			labels = me.convertTicksToLabels(ticks) || me.ticks;

			me.afterTickToLabelConversion();

			me.ticks = labels;   // BACKWARD COMPATIBILITY

			// IMPORTANT: from this point, we consider that `this.ticks` will NEVER change!

			// BACKWARD COMPAT: synchronize `_ticks` with labels (so potentially `this.ticks`)
			for (i = 0, ilen = labels.length; i < ilen; ++i) {
				label = labels[i];
				tick = ticks[i];
				if (!tick) {
					ticks.push(tick = {
						label: label,
						major: false
					});
				} else {
					tick.label = label;
				}
			}

			me._ticks = ticks;

			// Tick Rotation
			me.beforeCalculateTickRotation();
			me.calculateTickRotation();
			me.afterCalculateTickRotation();
			// Fit
			me.beforeFit();
			me.fit();
			me.afterFit();
			//
			me.afterUpdate();

			return me.minSize;

		},
		afterUpdate: function() {
			helpers.callback(this.options.afterUpdate, [this]);
		},

		//

		beforeSetDimensions: function() {
			helpers.callback(this.options.beforeSetDimensions, [this]);
		},
		setDimensions: function() {
			var me = this;
			// Set the unconstrained dimension before label rotation
			if (me.isHorizontal()) {
				// Reset position before calculating rotation
				me.width = me.maxWidth;
				me.left = 0;
				me.right = me.width;
			} else {
				me.height = me.maxHeight;

				// Reset position before calculating rotation
				me.top = 0;
				me.bottom = me.height;
			}

			// Reset padding
			me.paddingLeft = 0;
			me.paddingTop = 0;
			me.paddingRight = 0;
			me.paddingBottom = 0;
		},
		afterSetDimensions: function() {
			helpers.callback(this.options.afterSetDimensions, [this]);
		},

		// Data limits
		beforeDataLimits: function() {
			helpers.callback(this.options.beforeDataLimits, [this]);
		},
		determineDataLimits: helpers.noop,
		afterDataLimits: function() {
			helpers.callback(this.options.afterDataLimits, [this]);
		},

		//
		beforeBuildTicks: function() {
			helpers.callback(this.options.beforeBuildTicks, [this]);
		},
		buildTicks: helpers.noop,
		afterBuildTicks: function() {
			helpers.callback(this.options.afterBuildTicks, [this]);
		},

		beforeTickToLabelConversion: function() {
			helpers.callback(this.options.beforeTickToLabelConversion, [this]);
		},
		convertTicksToLabels: function() {
			var me = this;
			// Convert ticks to strings
			var tickOpts = me.options.ticks;
			me.ticks = me.ticks.map(tickOpts.userCallback || tickOpts.callback, this);
		},
		afterTickToLabelConversion: function() {
			helpers.callback(this.options.afterTickToLabelConversion, [this]);
		},

		//

		beforeCalculateTickRotation: function() {
			helpers.callback(this.options.beforeCalculateTickRotation, [this]);
		},
		calculateTickRotation: function() {
			var me = this;
			var context = me.ctx;
			var tickOpts = me.options.ticks;
			var labels = labelsFromTicks(me._ticks);

			// Get the width of each grid by calculating the difference
			// between x offsets between 0 and 1.
			var tickFont = parseFontOptions(tickOpts);
			context.font = tickFont.font;

			var labelRotation = tickOpts.minRotation || 0;

			if (labels.length && me.options.display && me.isHorizontal()) {
				var originalLabelWidth = helpers.longestText(context, tickFont.font, labels, me.longestTextCache);
				var labelWidth = originalLabelWidth;
				var cosRotation, sinRotation;

				// Allow 3 pixels x2 padding either side for label readability
				var tickWidth = me.getPixelForTick(1) - me.getPixelForTick(0) - 6;

				// Max label rotation can be set or default to 90 - also act as a loop counter
				while (labelWidth > tickWidth && labelRotation < tickOpts.maxRotation) {
					var angleRadians = helpers.toRadians(labelRotation);
					cosRotation = Math.cos(angleRadians);
					sinRotation = Math.sin(angleRadians);

					if (sinRotation * originalLabelWidth > me.maxHeight) {
						// go back one step
						labelRotation--;
						break;
					}

					labelRotation++;
					labelWidth = cosRotation * originalLabelWidth;
				}
			}

			me.labelRotation = labelRotation;
		},
		afterCalculateTickRotation: function() {
			helpers.callback(this.options.afterCalculateTickRotation, [this]);
		},

		//

		beforeFit: function() {
			helpers.callback(this.options.beforeFit, [this]);
		},
		fit: function() {
			var me = this;
			// Reset
			var minSize = me.minSize = {
				width: 0,
				height: 0
			};

			var labels = labelsFromTicks(me._ticks);

			var opts = me.options;
			var tickOpts = opts.ticks;
			var scaleLabelOpts = opts.scaleLabel;
			var gridLineOpts = opts.gridLines;
			var display = opts.display;
			var isHorizontal = me.isHorizontal();

			var tickFont = parseFontOptions(tickOpts);
			var tickMarkLength = opts.gridLines.tickMarkLength;

			// Width
			if (isHorizontal) {
				// subtract the margins to line up with the chartArea if we are a full width scale
				minSize.width = me.isFullWidth() ? me.maxWidth - me.margins.left - me.margins.right : me.maxWidth;
			} else {
				minSize.width = display && gridLineOpts.drawTicks ? tickMarkLength : 0;
			}

			// height
			if (isHorizontal) {
				minSize.height = display && gridLineOpts.drawTicks ? tickMarkLength : 0;
			} else {
				minSize.height = me.maxHeight; // fill all the height
			}

			// Are we showing a title for the scale?
			if (scaleLabelOpts.display && display) {
				var scaleLabelLineHeight = parseLineHeight(scaleLabelOpts);
				var scaleLabelPadding = helpers.options.toPadding(scaleLabelOpts.padding);
				var deltaHeight = scaleLabelLineHeight + scaleLabelPadding.height;

				if (isHorizontal) {
					minSize.height += deltaHeight;
				} else {
					minSize.width += deltaHeight;
				}
			}

			// Don't bother fitting the ticks if we are not showing them
			if (tickOpts.display && display) {
				var largestTextWidth = helpers.longestText(me.ctx, tickFont.font, labels, me.longestTextCache);
				var tallestLabelHeightInLines = helpers.numberOfLabelLines(labels);
				var lineSpace = tickFont.size * 0.5;
				var tickPadding = me.options.ticks.padding;

				if (isHorizontal) {
					// A horizontal axis is more constrained by the height.
					me.longestLabelWidth = largestTextWidth;

					var angleRadians = helpers.toRadians(me.labelRotation);
					var cosRotation = Math.cos(angleRadians);
					var sinRotation = Math.sin(angleRadians);

					// TODO - improve this calculation
					var labelHeight = (sinRotation * largestTextWidth)
						+ (tickFont.size * tallestLabelHeightInLines)
						+ (lineSpace * (tallestLabelHeightInLines - 1))
						+ lineSpace; // padding

					minSize.height = Math.min(me.maxHeight, minSize.height + labelHeight + tickPadding);

					me.ctx.font = tickFont.font;
					var firstLabelWidth = computeTextSize(me.ctx, labels[0], tickFont.font);
					var lastLabelWidth = computeTextSize(me.ctx, labels[labels.length - 1], tickFont.font);

					// Ensure that our ticks are always inside the canvas. When rotated, ticks are right aligned
					// which means that the right padding is dominated by the font height
					if (me.labelRotation !== 0) {
						me.paddingLeft = opts.position === 'bottom' ? (cosRotation * firstLabelWidth) + 3 : (cosRotation * lineSpace) + 3; // add 3 px to move away from canvas edges
						me.paddingRight = opts.position === 'bottom' ? (cosRotation * lineSpace) + 3 : (cosRotation * lastLabelWidth) + 3;
					} else {
						me.paddingLeft = firstLabelWidth / 2 + 3; // add 3 px to move away from canvas edges
						me.paddingRight = lastLabelWidth / 2 + 3;
					}
				} else {
					// A vertical axis is more constrained by the width. Labels are the
					// dominant factor here, so get that length first and account for padding
					if (tickOpts.mirror) {
						largestTextWidth = 0;
					} else {
						// use lineSpace for consistency with horizontal axis
						// tickPadding is not implemented for horizontal
						largestTextWidth += tickPadding + lineSpace;
					}

					minSize.width = Math.min(me.maxWidth, minSize.width + largestTextWidth);

					me.paddingTop = tickFont.size / 2;
					me.paddingBottom = tickFont.size / 2;
				}
			}

			me.handleMargins();

			me.width = minSize.width;
			me.height = minSize.height;
		},

		/**
		 * Handle margins and padding interactions
		 * @private
		 */
		handleMargins: function() {
			var me = this;
			if (me.margins) {
				me.paddingLeft = Math.max(me.paddingLeft - me.margins.left, 0);
				me.paddingTop = Math.max(me.paddingTop - me.margins.top, 0);
				me.paddingRight = Math.max(me.paddingRight - me.margins.right, 0);
				me.paddingBottom = Math.max(me.paddingBottom - me.margins.bottom, 0);
			}
		},

		afterFit: function() {
			helpers.callback(this.options.afterFit, [this]);
		},

		// Shared Methods
		isHorizontal: function() {
			return this.options.position === 'top' || this.options.position === 'bottom';
		},
		isFullWidth: function() {
			return (this.options.fullWidth);
		},

		// Get the correct value. NaN bad inputs, If the value type is object get the x or y based on whether we are horizontal or not
		getRightValue: function(rawValue) {
			// Null and undefined values first
			if (helpers.isNullOrUndef(rawValue)) {
				return NaN;
			}
			// isNaN(object) returns true, so make sure NaN is checking for a number; Discard Infinite values
			if (typeof rawValue === 'number' && !isFinite(rawValue)) {
				return NaN;
			}
			// If it is in fact an object, dive in one more level
			if (rawValue) {
				if (this.isHorizontal()) {
					if (rawValue.x !== undefined) {
						return this.getRightValue(rawValue.x);
					}
				} else if (rawValue.y !== undefined) {
					return this.getRightValue(rawValue.y);
				}
			}

			// Value is good, return it
			return rawValue;
		},

		/**
		 * Used to get the value to display in the tooltip for the data at the given index
		 * @param index
		 * @param datasetIndex
		 */
		getLabelForIndex: helpers.noop,

		/**
		 * Returns the location of the given data point. Value can either be an index or a numerical value
		 * The coordinate (0, 0) is at the upper-left corner of the canvas
		 * @param value
		 * @param index
		 * @param datasetIndex
		 */
		getPixelForValue: helpers.noop,

		/**
		 * Used to get the data value from a given pixel. This is the inverse of getPixelForValue
		 * The coordinate (0, 0) is at the upper-left corner of the canvas
		 * @param pixel
		 */
		getValueForPixel: helpers.noop,

		/**
		 * Returns the location of the tick at the given index
		 * The coordinate (0, 0) is at the upper-left corner of the canvas
		 */
		getPixelForTick: function(index) {
			var me = this;
			var offset = me.options.offset;
			if (me.isHorizontal()) {
				var innerWidth = me.width - (me.paddingLeft + me.paddingRight);
				var tickWidth = innerWidth / Math.max((me._ticks.length - (offset ? 0 : 1)), 1);
				var pixel = (tickWidth * index) + me.paddingLeft;

				if (offset) {
					pixel += tickWidth / 2;
				}

				var finalVal = me.left + Math.round(pixel);
				finalVal += me.isFullWidth() ? me.margins.left : 0;
				return finalVal;
			}
			var innerHeight = me.height - (me.paddingTop + me.paddingBottom);
			return me.top + (index * (innerHeight / (me._ticks.length - 1)));
		},

		/**
		 * Utility for getting the pixel location of a percentage of scale
		 * The coordinate (0, 0) is at the upper-left corner of the canvas
		 */
		getPixelForDecimal: function(decimal) {
			var me = this;
			if (me.isHorizontal()) {
				var innerWidth = me.width - (me.paddingLeft + me.paddingRight);
				var valueOffset = (innerWidth * decimal) + me.paddingLeft;

				var finalVal = me.left + Math.round(valueOffset);
				finalVal += me.isFullWidth() ? me.margins.left : 0;
				return finalVal;
			}
			return me.top + (decimal * me.height);
		},

		/**
		 * Returns the pixel for the minimum chart value
		 * The coordinate (0, 0) is at the upper-left corner of the canvas
		 */
		getBasePixel: function() {
			return this.getPixelForValue(this.getBaseValue());
		},

		getBaseValue: function() {
			var me = this;
			var min = me.min;
			var max = me.max;

			return me.beginAtZero ? 0 :
				min < 0 && max < 0 ? max :
				min > 0 && max > 0 ? min :
				0;
		},

		/**
		 * Returns a subset of ticks to be plotted to avoid overlapping labels.
		 * @private
		 */
		_autoSkip: function(ticks) {
			var skipRatio;
			var me = this;
			var isHorizontal = me.isHorizontal();
			var optionTicks = me.options.ticks.minor;
			var tickCount = ticks.length;
			var labelRotationRadians = helpers.toRadians(me.labelRotation);
			var cosRotation = Math.cos(labelRotationRadians);
			var longestRotatedLabel = me.longestLabelWidth * cosRotation;
			var result = [];
			var i, tick, shouldSkip;

			// figure out the maximum number of gridlines to show
			var maxTicks;
			if (optionTicks.maxTicksLimit) {
				maxTicks = optionTicks.maxTicksLimit;
			}

			if (isHorizontal) {
				skipRatio = false;

				if ((longestRotatedLabel + optionTicks.autoSkipPadding) * tickCount > (me.width - (me.paddingLeft + me.paddingRight))) {
					skipRatio = 1 + Math.floor(((longestRotatedLabel + optionTicks.autoSkipPadding) * tickCount) / (me.width - (me.paddingLeft + me.paddingRight)));
				}

				// if they defined a max number of optionTicks,
				// increase skipRatio until that number is met
				if (maxTicks && tickCount > maxTicks) {
					skipRatio = Math.max(skipRatio, Math.floor(tickCount / maxTicks));
				}
			}

			for (i = 0; i < tickCount; i++) {
				tick = ticks[i];

				// Since we always show the last tick,we need may need to hide the last shown one before
				shouldSkip = (skipRatio > 1 && i % skipRatio > 0) || (i % skipRatio === 0 && i + skipRatio >= tickCount);
				if (shouldSkip && i !== tickCount - 1) {
					// leave tick in place but make sure it's not displayed (#4635)
					delete tick.label;
				}
				result.push(tick);
			}
			return result;
		},

		// Actually draw the scale on the canvas
		// @param {rectangle} chartArea : the area of the chart to draw full grid lines on
		draw: function(chartArea) {
			var me = this;
			var options = me.options;
			if (!options.display) {
				return;
			}

			var context = me.ctx;
			var globalDefaults = defaults.global;
			var optionTicks = options.ticks.minor;
			var optionMajorTicks = options.ticks.major || optionTicks;
			var gridLines = options.gridLines;
			var scaleLabel = options.scaleLabel;

			var isRotated = me.labelRotation !== 0;
			var isHorizontal = me.isHorizontal();

			var ticks = optionTicks.autoSkip ? me._autoSkip(me.getTicks()) : me.getTicks();
			var tickFontColor = helpers.valueOrDefault(optionTicks.fontColor, globalDefaults.defaultFontColor);
			var tickFont = parseFontOptions(optionTicks);
			var majorTickFontColor = helpers.valueOrDefault(optionMajorTicks.fontColor, globalDefaults.defaultFontColor);
			var majorTickFont = parseFontOptions(optionMajorTicks);

			var tl = gridLines.drawTicks ? gridLines.tickMarkLength : 0;

			var scaleLabelFontColor = helpers.valueOrDefault(scaleLabel.fontColor, globalDefaults.defaultFontColor);
			var scaleLabelFont = parseFontOptions(scaleLabel);
			var scaleLabelPadding = helpers.options.toPadding(scaleLabel.padding);
			var labelRotationRadians = helpers.toRadians(me.labelRotation);

			var itemsToDraw = [];

			var axisWidth = me.options.gridLines.lineWidth;
			var xTickStart = options.position === 'right' ? me.right : me.right - axisWidth - tl;
			var xTickEnd = options.position === 'right' ? me.right + tl : me.right;
			var yTickStart = options.position === 'bottom' ? me.top + axisWidth : me.bottom - tl - axisWidth;
			var yTickEnd = options.position === 'bottom' ? me.top + axisWidth + tl : me.bottom + axisWidth;

			helpers.each(ticks, function(tick, index) {
				// autoskipper skipped this tick (#4635)
				if (helpers.isNullOrUndef(tick.label)) {
					return;
				}

				var label = tick.label;
				var lineWidth, lineColor, borderDash, borderDashOffset;
				if (index === me.zeroLineIndex && options.offset === gridLines.offsetGridLines) {
					// Draw the first index specially
					lineWidth = gridLines.zeroLineWidth;
					lineColor = gridLines.zeroLineColor;
					borderDash = gridLines.zeroLineBorderDash;
					borderDashOffset = gridLines.zeroLineBorderDashOffset;
				} else {
					lineWidth = helpers.valueAtIndexOrDefault(gridLines.lineWidth, index);
					lineColor = helpers.valueAtIndexOrDefault(gridLines.color, index);
					borderDash = helpers.valueOrDefault(gridLines.borderDash, globalDefaults.borderDash);
					borderDashOffset = helpers.valueOrDefault(gridLines.borderDashOffset, globalDefaults.borderDashOffset);
				}

				// Common properties
				var tx1, ty1, tx2, ty2, x1, y1, x2, y2, labelX, labelY;
				var textAlign = 'middle';
				var textBaseline = 'middle';
				var tickPadding = optionTicks.padding;

				if (isHorizontal) {
					var labelYOffset = tl + tickPadding;

					if (options.position === 'bottom') {
						// bottom
						textBaseline = !isRotated ? 'top' : 'middle';
						textAlign = !isRotated ? 'center' : 'right';
						labelY = me.top + labelYOffset;
					} else {
						// top
						textBaseline = !isRotated ? 'bottom' : 'middle';
						textAlign = !isRotated ? 'center' : 'left';
						labelY = me.bottom - labelYOffset;
					}

					var xLineValue = getLineValue(me, index, gridLines.offsetGridLines && ticks.length > 1);
					if (xLineValue < me.left) {
						lineColor = 'rgba(0,0,0,0)';
					}
					xLineValue += helpers.aliasPixel(lineWidth);

					labelX = me.getPixelForTick(index) + optionTicks.labelOffset; // x values for optionTicks (need to consider offsetLabel option)

					tx1 = tx2 = x1 = x2 = xLineValue;
					ty1 = yTickStart;
					ty2 = yTickEnd;
					y1 = chartArea.top;
					y2 = chartArea.bottom + axisWidth;
				} else {
					var isLeft = options.position === 'left';
					var labelXOffset;

					if (optionTicks.mirror) {
						textAlign = isLeft ? 'left' : 'right';
						labelXOffset = tickPadding;
					} else {
						textAlign = isLeft ? 'right' : 'left';
						labelXOffset = tl + tickPadding;
					}

					labelX = isLeft ? me.right - labelXOffset : me.left + labelXOffset;

					var yLineValue = getLineValue(me, index, gridLines.offsetGridLines && ticks.length > 1);
					if (yLineValue < me.top) {
						lineColor = 'rgba(0,0,0,0)';
					}
					yLineValue += helpers.aliasPixel(lineWidth);

					labelY = me.getPixelForTick(index) + optionTicks.labelOffset;

					tx1 = xTickStart;
					tx2 = xTickEnd;
					x1 = chartArea.left;
					x2 = chartArea.right + axisWidth;
					ty1 = ty2 = y1 = y2 = yLineValue;
				}

				itemsToDraw.push({
					tx1: tx1,
					ty1: ty1,
					tx2: tx2,
					ty2: ty2,
					x1: x1,
					y1: y1,
					x2: x2,
					y2: y2,
					labelX: labelX,
					labelY: labelY,
					glWidth: lineWidth,
					glColor: lineColor,
					glBorderDash: borderDash,
					glBorderDashOffset: borderDashOffset,
					rotation: -1 * labelRotationRadians,
					label: label,
					major: tick.major,
					textBaseline: textBaseline,
					textAlign: textAlign
				});
			});

			// Draw all of the tick labels, tick marks, and grid lines at the correct places
			helpers.each(itemsToDraw, function(itemToDraw) {
				if (gridLines.display) {
					context.save();
					context.lineWidth = itemToDraw.glWidth;
					context.strokeStyle = itemToDraw.glColor;
					if (context.setLineDash) {
						context.setLineDash(itemToDraw.glBorderDash);
						context.lineDashOffset = itemToDraw.glBorderDashOffset;
					}

					context.beginPath();

					if (gridLines.drawTicks) {
						context.moveTo(itemToDraw.tx1, itemToDraw.ty1);
						context.lineTo(itemToDraw.tx2, itemToDraw.ty2);
					}

					if (gridLines.drawOnChartArea) {
						context.moveTo(itemToDraw.x1, itemToDraw.y1);
						context.lineTo(itemToDraw.x2, itemToDraw.y2);
					}

					context.stroke();
					context.restore();
				}

				if (optionTicks.display) {
					// Make sure we draw text in the correct color and font
					context.save();
					context.translate(itemToDraw.labelX, itemToDraw.labelY);
					context.rotate(itemToDraw.rotation);
					context.font = itemToDraw.major ? majorTickFont.font : tickFont.font;
					context.fillStyle = itemToDraw.major ? majorTickFontColor : tickFontColor;
					context.textBaseline = itemToDraw.textBaseline;
					context.textAlign = itemToDraw.textAlign;

					var label = itemToDraw.label;
					if (helpers.isArray(label)) {
						var lineCount = label.length;
						var lineHeight = tickFont.size * 1.5;
						var y = me.isHorizontal() ? 0 : -lineHeight * (lineCount - 1) / 2;

						for (var i = 0; i < lineCount; ++i) {
							// We just make sure the multiline element is a string here..
							context.fillText('' + label[i], 0, y);
							// apply same lineSpacing as calculated @ L#320
							y += lineHeight;
						}
					} else {
						context.fillText(label, 0, 0);
					}
					context.restore();
				}
			});

			if (scaleLabel.display) {
				// Draw the scale label
				var scaleLabelX;
				var scaleLabelY;
				var rotation = 0;
				var halfLineHeight = parseLineHeight(scaleLabel) / 2;

				if (isHorizontal) {
					scaleLabelX = me.left + ((me.right - me.left) / 2); // midpoint of the width
					scaleLabelY = options.position === 'bottom'
						? me.bottom - halfLineHeight - scaleLabelPadding.bottom
						: me.top + halfLineHeight + scaleLabelPadding.top;
				} else {
					var isLeft = options.position === 'left';
					scaleLabelX = isLeft
						? me.left + halfLineHeight + scaleLabelPadding.top
						: me.right - halfLineHeight - scaleLabelPadding.top;
					scaleLabelY = me.top + ((me.bottom - me.top) / 2);
					rotation = isLeft ? -0.5 * Math.PI : 0.5 * Math.PI;
				}

				context.save();
				context.translate(scaleLabelX, scaleLabelY);
				context.rotate(rotation);
				context.textAlign = 'center';
				context.textBaseline = 'middle';
				context.fillStyle = scaleLabelFontColor; // render in correct colour
				context.font = scaleLabelFont.font;
				context.fillText(scaleLabel.labelString, 0, 0);
				context.restore();
			}

			if (gridLines.drawBorder) {
				// Draw the line at the edge of the axis
				context.lineWidth = helpers.valueAtIndexOrDefault(gridLines.lineWidth, 0);
				context.strokeStyle = helpers.valueAtIndexOrDefault(gridLines.color, 0);
				var x1 = me.left;
				var x2 = me.right + axisWidth;
				var y1 = me.top;
				var y2 = me.bottom + axisWidth;

				var aliasPixel = helpers.aliasPixel(context.lineWidth);
				if (isHorizontal) {
					y1 = y2 = options.position === 'top' ? me.bottom : me.top;
					y1 += aliasPixel;
					y2 += aliasPixel;
				} else {
					x1 = x2 = options.position === 'left' ? me.right : me.left;
					x1 += aliasPixel;
					x2 += aliasPixel;
				}

				context.beginPath();
				context.moveTo(x1, y1);
				context.lineTo(x2, y2);
				context.stroke();
			}
		}
	});
};

},{"25":25,"26":26,"34":34,"45":45}],33:[function(require,module,exports){
'use strict';

var defaults = require(25);
var helpers = require(45);
var layouts = require(30);

module.exports = function(Chart) {

	Chart.scaleService = {
		// Scale registration object. Extensions can register new scale types (such as log or DB scales) and then
		// use the new chart options to grab the correct scale
		constructors: {},
		// Use a registration function so that we can move to an ES6 map when we no longer need to support
		// old browsers

		// Scale config defaults
		defaults: {},
		registerScaleType: function(type, scaleConstructor, scaleDefaults) {
			this.constructors[type] = scaleConstructor;
			this.defaults[type] = helpers.clone(scaleDefaults);
		},
		getScaleConstructor: function(type) {
			return this.constructors.hasOwnProperty(type) ? this.constructors[type] : undefined;
		},
		getScaleDefaults: function(type) {
			// Return the scale defaults merged with the global settings so that we always use the latest ones
			return this.defaults.hasOwnProperty(type) ? helpers.merge({}, [defaults.scale, this.defaults[type]]) : {};
		},
		updateScaleDefaults: function(type, additions) {
			var me = this;
			if (me.defaults.hasOwnProperty(type)) {
				me.defaults[type] = helpers.extend(me.defaults[type], additions);
			}
		},
		addScalesToLayout: function(chart) {
			// Adds each scale to the chart.boxes array to be sized accordingly
			helpers.each(chart.scales, function(scale) {
				// Set ILayoutItem parameters for backwards compatibility
				scale.fullWidth = scale.options.fullWidth;
				scale.position = scale.options.position;
				scale.weight = scale.options.weight;
				layouts.addBox(chart, scale);
			});
		}
	};
};

},{"25":25,"30":30,"45":45}],34:[function(require,module,exports){
'use strict';

var helpers = require(45);

/**
 * Namespace to hold static tick generation functions
 * @namespace Chart.Ticks
 */
module.exports = {
	/**
	 * Namespace to hold formatters for different types of ticks
	 * @namespace Chart.Ticks.formatters
	 */
	formatters: {
		/**
		 * Formatter for value labels
		 * @method Chart.Ticks.formatters.values
		 * @param value the value to display
		 * @return {String|Array} the label to display
		 */
		values: function(value) {
			return helpers.isArray(value) ? value : '' + value;
		},

		/**
		 * Formatter for linear numeric ticks
		 * @method Chart.Ticks.formatters.linear
		 * @param tickValue {Number} the value to be formatted
		 * @param index {Number} the position of the tickValue parameter in the ticks array
		 * @param ticks {Array<Number>} the list of ticks being converted
		 * @return {String} string representation of the tickValue parameter
		 */
		linear: function(tickValue, index, ticks) {
			// If we have lots of ticks, don't use the ones
			var delta = ticks.length > 3 ? ticks[2] - ticks[1] : ticks[1] - ticks[0];

			// If we have a number like 2.5 as the delta, figure out how many decimal places we need
			if (Math.abs(delta) > 1) {
				if (tickValue !== Math.floor(tickValue)) {
					// not an integer
					delta = tickValue - Math.floor(tickValue);
				}
			}

			var logDelta = helpers.log10(Math.abs(delta));
			var tickString = '';

			if (tickValue !== 0) {
				var numDecimal = -1 * Math.floor(logDelta);
				numDecimal = Math.max(Math.min(numDecimal, 20), 0); // toFixed has a max of 20 decimal places
				tickString = tickValue.toFixed(numDecimal);
			} else {
				tickString = '0'; // never show decimal places for 0
			}

			return tickString;
		},

		logarithmic: function(tickValue, index, ticks) {
			var remain = tickValue / (Math.pow(10, Math.floor(helpers.log10(tickValue))));

			if (tickValue === 0) {
				return '0';
			} else if (remain === 1 || remain === 2 || remain === 5 || index === 0 || index === ticks.length - 1) {
				return tickValue.toExponential();
			}
			return '';
		}
	}
};

},{"45":45}],35:[function(require,module,exports){
'use strict';

var defaults = require(25);
var Element = require(26);
var helpers = require(45);

defaults._set('global', {
	tooltips: {
		enabled: true,
		custom: null,
		mode: 'nearest',
		position: 'average',
		intersect: true,
		backgroundColor: 'rgba(0,0,0,0.8)',
		titleFontStyle: 'bold',
		titleSpacing: 2,
		titleMarginBottom: 6,
		titleFontColor: '#fff',
		titleAlign: 'left',
		bodySpacing: 2,
		bodyFontColor: '#fff',
		bodyAlign: 'left',
		footerFontStyle: 'bold',
		footerSpacing: 2,
		footerMarginTop: 6,
		footerFontColor: '#fff',
		footerAlign: 'left',
		yPadding: 6,
		xPadding: 6,
		caretPadding: 2,
		caretSize: 5,
		cornerRadius: 6,
		multiKeyBackground: '#fff',
		displayColors: true,
		borderColor: 'rgba(0,0,0,0)',
		borderWidth: 0,
		callbacks: {
			// Args are: (tooltipItems, data)
			beforeTitle: helpers.noop,
			title: function(tooltipItems, data) {
				// Pick first xLabel for now
				var title = '';
				var labels = data.labels;
				var labelCount = labels ? labels.length : 0;

				if (tooltipItems.length > 0) {
					var item = tooltipItems[0];

					if (item.xLabel) {
						title = item.xLabel;
					} else if (labelCount > 0 && item.index < labelCount) {
						title = labels[item.index];
					}
				}

				return title;
			},
			afterTitle: helpers.noop,

			// Args are: (tooltipItems, data)
			beforeBody: helpers.noop,

			// Args are: (tooltipItem, data)
			beforeLabel: helpers.noop,
			label: function(tooltipItem, data) {
				var label = data.datasets[tooltipItem.datasetIndex].label || '';

				if (label) {
					label += ': ';
				}
				label += tooltipItem.yLabel;
				return label;
			},
			labelColor: function(tooltipItem, chart) {
				var meta = chart.getDatasetMeta(tooltipItem.datasetIndex);
				var activeElement = meta.data[tooltipItem.index];
				var view = activeElement._view;
				return {
					borderColor: view.borderColor,
					backgroundColor: view.backgroundColor
				};
			},
			labelTextColor: function() {
				return this._options.bodyFontColor;
			},
			afterLabel: helpers.noop,

			// Args are: (tooltipItems, data)
			afterBody: helpers.noop,

			// Args are: (tooltipItems, data)
			beforeFooter: helpers.noop,
			footer: helpers.noop,
			afterFooter: helpers.noop
		}
	}
});

module.exports = function(Chart) {

	/**
 	 * Helper method to merge the opacity into a color
 	 */
	function mergeOpacity(colorString, opacity) {
		var color = helpers.color(colorString);
		return color.alpha(opacity * color.alpha()).rgbaString();
	}

	// Helper to push or concat based on if the 2nd parameter is an array or not
	function pushOrConcat(base, toPush) {
		if (toPush) {
			if (helpers.isArray(toPush)) {
				// base = base.concat(toPush);
				Array.prototype.push.apply(base, toPush);
			} else {
				base.push(toPush);
			}
		}

		return base;
	}

	// Private helper to create a tooltip item model
	// @param element : the chart element (point, arc, bar) to create the tooltip item for
	// @return : new tooltip item
	function createTooltipItem(element) {
		var xScale = element._xScale;
		var yScale = element._yScale || element._scale; // handle radar || polarArea charts
		var index = element._index;
		var datasetIndex = element._datasetIndex;

		return {
			xLabel: xScale ? xScale.getLabelForIndex(index, datasetIndex) : '',
			yLabel: yScale ? yScale.getLabelForIndex(index, datasetIndex) : '',
			index: index,
			datasetIndex: datasetIndex,
			x: element._model.x,
			y: element._model.y
		};
	}

	/**
	 * Helper to get the reset model for the tooltip
	 * @param tooltipOpts {Object} the tooltip options
	 */
	function getBaseModel(tooltipOpts) {
		var globalDefaults = defaults.global;
		var valueOrDefault = helpers.valueOrDefault;

		return {
			// Positioning
			xPadding: tooltipOpts.xPadding,
			yPadding: tooltipOpts.yPadding,
			xAlign: tooltipOpts.xAlign,
			yAlign: tooltipOpts.yAlign,

			// Body
			bodyFontColor: tooltipOpts.bodyFontColor,
			_bodyFontFamily: valueOrDefault(tooltipOpts.bodyFontFamily, globalDefaults.defaultFontFamily),
			_bodyFontStyle: valueOrDefault(tooltipOpts.bodyFontStyle, globalDefaults.defaultFontStyle),
			_bodyAlign: tooltipOpts.bodyAlign,
			bodyFontSize: valueOrDefault(tooltipOpts.bodyFontSize, globalDefaults.defaultFontSize),
			bodySpacing: tooltipOpts.bodySpacing,

			// Title
			titleFontColor: tooltipOpts.titleFontColor,
			_titleFontFamily: valueOrDefault(tooltipOpts.titleFontFamily, globalDefaults.defaultFontFamily),
			_titleFontStyle: valueOrDefault(tooltipOpts.titleFontStyle, globalDefaults.defaultFontStyle),
			titleFontSize: valueOrDefault(tooltipOpts.titleFontSize, globalDefaults.defaultFontSize),
			_titleAlign: tooltipOpts.titleAlign,
			titleSpacing: tooltipOpts.titleSpacing,
			titleMarginBottom: tooltipOpts.titleMarginBottom,

			// Footer
			footerFontColor: tooltipOpts.footerFontColor,
			_footerFontFamily: valueOrDefault(tooltipOpts.footerFontFamily, globalDefaults.defaultFontFamily),
			_footerFontStyle: valueOrDefault(tooltipOpts.footerFontStyle, globalDefaults.defaultFontStyle),
			footerFontSize: valueOrDefault(tooltipOpts.footerFontSize, globalDefaults.defaultFontSize),
			_footerAlign: tooltipOpts.footerAlign,
			footerSpacing: tooltipOpts.footerSpacing,
			footerMarginTop: tooltipOpts.footerMarginTop,

			// Appearance
			caretSize: tooltipOpts.caretSize,
			cornerRadius: tooltipOpts.cornerRadius,
			backgroundColor: tooltipOpts.backgroundColor,
			opacity: 0,
			legendColorBackground: tooltipOpts.multiKeyBackground,
			displayColors: tooltipOpts.displayColors,
			borderColor: tooltipOpts.borderColor,
			borderWidth: tooltipOpts.borderWidth
		};
	}

	/**
	 * Get the size of the tooltip
	 */
	function getTooltipSize(tooltip, model) {
		var ctx = tooltip._chart.ctx;

		var height = model.yPadding * 2; // Tooltip Padding
		var width = 0;

		// Count of all lines in the body
		var body = model.body;
		var combinedBodyLength = body.reduce(function(count, bodyItem) {
			return count + bodyItem.before.length + bodyItem.lines.length + bodyItem.after.length;
		}, 0);
		combinedBodyLength += model.beforeBody.length + model.afterBody.length;

		var titleLineCount = model.title.length;
		var footerLineCount = model.footer.length;
		var titleFontSize = model.titleFontSize;
		var bodyFontSize = model.bodyFontSize;
		var footerFontSize = model.footerFontSize;

		height += titleLineCount * titleFontSize; // Title Lines
		height += titleLineCount ? (titleLineCount - 1) * model.titleSpacing : 0; // Title Line Spacing
		height += titleLineCount ? model.titleMarginBottom : 0; // Title's bottom Margin
		height += combinedBodyLength * bodyFontSize; // Body Lines
		height += combinedBodyLength ? (combinedBodyLength - 1) * model.bodySpacing : 0; // Body Line Spacing
		height += footerLineCount ? model.footerMarginTop : 0; // Footer Margin
		height += footerLineCount * (footerFontSize); // Footer Lines
		height += footerLineCount ? (footerLineCount - 1) * model.footerSpacing : 0; // Footer Line Spacing

		// Title width
		var widthPadding = 0;
		var maxLineWidth = function(line) {
			width = Math.max(width, ctx.measureText(line).width + widthPadding);
		};

		ctx.font = helpers.fontString(titleFontSize, model._titleFontStyle, model._titleFontFamily);
		helpers.each(model.title, maxLineWidth);

		// Body width
		ctx.font = helpers.fontString(bodyFontSize, model._bodyFontStyle, model._bodyFontFamily);
		helpers.each(model.beforeBody.concat(model.afterBody), maxLineWidth);

		// Body lines may include some extra width due to the color box
		widthPadding = model.displayColors ? (bodyFontSize + 2) : 0;
		helpers.each(body, function(bodyItem) {
			helpers.each(bodyItem.before, maxLineWidth);
			helpers.each(bodyItem.lines, maxLineWidth);
			helpers.each(bodyItem.after, maxLineWidth);
		});

		// Reset back to 0
		widthPadding = 0;

		// Footer width
		ctx.font = helpers.fontString(footerFontSize, model._footerFontStyle, model._footerFontFamily);
		helpers.each(model.footer, maxLineWidth);

		// Add padding
		width += 2 * model.xPadding;

		return {
			width: width,
			height: height
		};
	}

	/**
	 * Helper to get the alignment of a tooltip given the size
	 */
	function determineAlignment(tooltip, size) {
		var model = tooltip._model;
		var chart = tooltip._chart;
		var chartArea = tooltip._chart.chartArea;
		var xAlign = 'center';
		var yAlign = 'center';

		if (model.y < size.height) {
			yAlign = 'top';
		} else if (model.y > (chart.height - size.height)) {
			yAlign = 'bottom';
		}

		var lf, rf; // functions to determine left, right alignment
		var olf, orf; // functions to determine if left/right alignment causes tooltip to go outside chart
		var yf; // function to get the y alignment if the tooltip goes outside of the left or right edges
		var midX = (chartArea.left + chartArea.right) / 2;
		var midY = (chartArea.top + chartArea.bottom) / 2;

		if (yAlign === 'center') {
			lf = function(x) {
				return x <= midX;
			};
			rf = function(x) {
				return x > midX;
			};
		} else {
			lf = function(x) {
				return x <= (size.width / 2);
			};
			rf = function(x) {
				return x >= (chart.width - (size.width / 2));
			};
		}

		olf = function(x) {
			return x + size.width + model.caretSize + model.caretPadding > chart.width;
		};
		orf = function(x) {
			return x - size.width - model.caretSize - model.caretPadding < 0;
		};
		yf = function(y) {
			return y <= midY ? 'top' : 'bottom';
		};

		if (lf(model.x)) {
			xAlign = 'left';

			// Is tooltip too wide and goes over the right side of the chart.?
			if (olf(model.x)) {
				xAlign = 'center';
				yAlign = yf(model.y);
			}
		} else if (rf(model.x)) {
			xAlign = 'right';

			// Is tooltip too wide and goes outside left edge of canvas?
			if (orf(model.x)) {
				xAlign = 'center';
				yAlign = yf(model.y);
			}
		}

		var opts = tooltip._options;
		return {
			xAlign: opts.xAlign ? opts.xAlign : xAlign,
			yAlign: opts.yAlign ? opts.yAlign : yAlign
		};
	}

	/**
	 * @Helper to get the location a tooltip needs to be placed at given the initial position (via the vm) and the size and alignment
	 */
	function getBackgroundPoint(vm, size, alignment, chart) {
		// Background Position
		var x = vm.x;
		var y = vm.y;

		var caretSize = vm.caretSize;
		var caretPadding = vm.caretPadding;
		var cornerRadius = vm.cornerRadius;
		var xAlign = alignment.xAlign;
		var yAlign = alignment.yAlign;
		var paddingAndSize = caretSize + caretPadding;
		var radiusAndPadding = cornerRadius + caretPadding;

		if (xAlign === 'right') {
			x -= size.width;
		} else if (xAlign === 'center') {
			x -= (size.width / 2);
			if (x + size.width > chart.width) {
				x = chart.width - size.width;
			}
			if (x < 0) {
				x = 0;
			}
		}

		if (yAlign === 'top') {
			y += paddingAndSize;
		} else if (yAlign === 'bottom') {
			y -= size.height + paddingAndSize;
		} else {
			y -= (size.height / 2);
		}

		if (yAlign === 'center') {
			if (xAlign === 'left') {
				x += paddingAndSize;
			} else if (xAlign === 'right') {
				x -= paddingAndSize;
			}
		} else if (xAlign === 'left') {
			x -= radiusAndPadding;
		} else if (xAlign === 'right') {
			x += radiusAndPadding;
		}

		return {
			x: x,
			y: y
		};
	}

	Chart.Tooltip = Element.extend({
		initialize: function() {
			this._model = getBaseModel(this._options);
			this._lastActive = [];
		},

		// Get the title
		// Args are: (tooltipItem, data)
		getTitle: function() {
			var me = this;
			var opts = me._options;
			var callbacks = opts.callbacks;

			var beforeTitle = callbacks.beforeTitle.apply(me, arguments);
			var title = callbacks.title.apply(me, arguments);
			var afterTitle = callbacks.afterTitle.apply(me, arguments);

			var lines = [];
			lines = pushOrConcat(lines, beforeTitle);
			lines = pushOrConcat(lines, title);
			lines = pushOrConcat(lines, afterTitle);

			return lines;
		},

		// Args are: (tooltipItem, data)
		getBeforeBody: function() {
			var lines = this._options.callbacks.beforeBody.apply(this, arguments);
			return helpers.isArray(lines) ? lines : lines !== undefined ? [lines] : [];
		},

		// Args are: (tooltipItem, data)
		getBody: function(tooltipItems, data) {
			var me = this;
			var callbacks = me._options.callbacks;
			var bodyItems = [];

			helpers.each(tooltipItems, function(tooltipItem) {
				var bodyItem = {
					before: [],
					lines: [],
					after: []
				};
				pushOrConcat(bodyItem.before, callbacks.beforeLabel.call(me, tooltipItem, data));
				pushOrConcat(bodyItem.lines, callbacks.label.call(me, tooltipItem, data));
				pushOrConcat(bodyItem.after, callbacks.afterLabel.call(me, tooltipItem, data));

				bodyItems.push(bodyItem);
			});

			return bodyItems;
		},

		// Args are: (tooltipItem, data)
		getAfterBody: function() {
			var lines = this._options.callbacks.afterBody.apply(this, arguments);
			return helpers.isArray(lines) ? lines : lines !== undefined ? [lines] : [];
		},

		// Get the footer and beforeFooter and afterFooter lines
		// Args are: (tooltipItem, data)
		getFooter: function() {
			var me = this;
			var callbacks = me._options.callbacks;

			var beforeFooter = callbacks.beforeFooter.apply(me, arguments);
			var footer = callbacks.footer.apply(me, arguments);
			var afterFooter = callbacks.afterFooter.apply(me, arguments);

			var lines = [];
			lines = pushOrConcat(lines, beforeFooter);
			lines = pushOrConcat(lines, footer);
			lines = pushOrConcat(lines, afterFooter);

			return lines;
		},

		update: function(changed) {
			var me = this;
			var opts = me._options;

			// Need to regenerate the model because its faster than using extend and it is necessary due to the optimization in Chart.Element.transition
			// that does _view = _model if ease === 1. This causes the 2nd tooltip update to set properties in both the view and model at the same time
			// which breaks any animations.
			var existingModel = me._model;
			var model = me._model = getBaseModel(opts);
			var active = me._active;

			var data = me._data;

			// In the case where active.length === 0 we need to keep these at existing values for good animations
			var alignment = {
				xAlign: existingModel.xAlign,
				yAlign: existingModel.yAlign
			};
			var backgroundPoint = {
				x: existingModel.x,
				y: existingModel.y
			};
			var tooltipSize = {
				width: existingModel.width,
				height: existingModel.height
			};
			var tooltipPosition = {
				x: existingModel.caretX,
				y: existingModel.caretY
			};

			var i, len;

			if (active.length) {
				model.opacity = 1;

				var labelColors = [];
				var labelTextColors = [];
				tooltipPosition = Chart.Tooltip.positioners[opts.position].call(me, active, me._eventPosition);

				var tooltipItems = [];
				for (i = 0, len = active.length; i < len; ++i) {
					tooltipItems.push(createTooltipItem(active[i]));
				}

				// If the user provided a filter function, use it to modify the tooltip items
				if (opts.filter) {
					tooltipItems = tooltipItems.filter(function(a) {
						return opts.filter(a, data);
					});
				}

				// If the user provided a sorting function, use it to modify the tooltip items
				if (opts.itemSort) {
					tooltipItems = tooltipItems.sort(function(a, b) {
						return opts.itemSort(a, b, data);
					});
				}

				// Determine colors for boxes
				helpers.each(tooltipItems, function(tooltipItem) {
					labelColors.push(opts.callbacks.labelColor.call(me, tooltipItem, me._chart));
					labelTextColors.push(opts.callbacks.labelTextColor.call(me, tooltipItem, me._chart));
				});


				// Build the Text Lines
				model.title = me.getTitle(tooltipItems, data);
				model.beforeBody = me.getBeforeBody(tooltipItems, data);
				model.body = me.getBody(tooltipItems, data);
				model.afterBody = me.getAfterBody(tooltipItems, data);
				model.footer = me.getFooter(tooltipItems, data);

				// Initial positioning and colors
				model.x = Math.round(tooltipPosition.x);
				model.y = Math.round(tooltipPosition.y);
				model.caretPadding = opts.caretPadding;
				model.labelColors = labelColors;
				model.labelTextColors = labelTextColors;

				// data points
				model.dataPoints = tooltipItems;

				// We need to determine alignment of the tooltip
				tooltipSize = getTooltipSize(this, model);
				alignment = determineAlignment(this, tooltipSize);
				// Final Size and Position
				backgroundPoint = getBackgroundPoint(model, tooltipSize, alignment, me._chart);
			} else {
				model.opacity = 0;
			}

			model.xAlign = alignment.xAlign;
			model.yAlign = alignment.yAlign;
			model.x = backgroundPoint.x;
			model.y = backgroundPoint.y;
			model.width = tooltipSize.width;
			model.height = tooltipSize.height;

			// Point where the caret on the tooltip points to
			model.caretX = tooltipPosition.x;
			model.caretY = tooltipPosition.y;

			me._model = model;

			if (changed && opts.custom) {
				opts.custom.call(me, model);
			}

			return me;
		},
		drawCaret: function(tooltipPoint, size) {
			var ctx = this._chart.ctx;
			var vm = this._view;
			var caretPosition = this.getCaretPosition(tooltipPoint, size, vm);

			ctx.lineTo(caretPosition.x1, caretPosition.y1);
			ctx.lineTo(caretPosition.x2, caretPosition.y2);
			ctx.lineTo(caretPosition.x3, caretPosition.y3);
		},
		getCaretPosition: function(tooltipPoint, size, vm) {
			var x1, x2, x3, y1, y2, y3;
			var caretSize = vm.caretSize;
			var cornerRadius = vm.cornerRadius;
			var xAlign = vm.xAlign;
			var yAlign = vm.yAlign;
			var ptX = tooltipPoint.x;
			var ptY = tooltipPoint.y;
			var width = size.width;
			var height = size.height;

			if (yAlign === 'center') {
				y2 = ptY + (height / 2);

				if (xAlign === 'left') {
					x1 = ptX;
					x2 = x1 - caretSize;
					x3 = x1;

					y1 = y2 + caretSize;
					y3 = y2 - caretSize;
				} else {
					x1 = ptX + width;
					x2 = x1 + caretSize;
					x3 = x1;

					y1 = y2 - caretSize;
					y3 = y2 + caretSize;
				}
			} else {
				if (xAlign === 'left') {
					x2 = ptX + cornerRadius + (caretSize);
					x1 = x2 - caretSize;
					x3 = x2 + caretSize;
				} else if (xAlign === 'right') {
					x2 = ptX + width - cornerRadius - caretSize;
					x1 = x2 - caretSize;
					x3 = x2 + caretSize;
				} else {
					x2 = vm.caretX;
					x1 = x2 - caretSize;
					x3 = x2 + caretSize;
				}
				if (yAlign === 'top') {
					y1 = ptY;
					y2 = y1 - caretSize;
					y3 = y1;
				} else {
					y1 = ptY + height;
					y2 = y1 + caretSize;
					y3 = y1;
					// invert drawing order
					var tmp = x3;
					x3 = x1;
					x1 = tmp;
				}
			}
			return {x1: x1, x2: x2, x3: x3, y1: y1, y2: y2, y3: y3};
		},
		drawTitle: function(pt, vm, ctx, opacity) {
			var title = vm.title;

			if (title.length) {
				ctx.textAlign = vm._titleAlign;
				ctx.textBaseline = 'top';

				var titleFontSize = vm.titleFontSize;
				var titleSpacing = vm.titleSpacing;

				ctx.fillStyle = mergeOpacity(vm.titleFontColor, opacity);
				ctx.font = helpers.fontString(titleFontSize, vm._titleFontStyle, vm._titleFontFamily);

				var i, len;
				for (i = 0, len = title.length; i < len; ++i) {
					ctx.fillText(title[i], pt.x, pt.y);
					pt.y += titleFontSize + titleSpacing; // Line Height and spacing

					if (i + 1 === title.length) {
						pt.y += vm.titleMarginBottom - titleSpacing; // If Last, add margin, remove spacing
					}
				}
			}
		},
		drawBody: function(pt, vm, ctx, opacity) {
			var bodyFontSize = vm.bodyFontSize;
			var bodySpacing = vm.bodySpacing;
			var body = vm.body;

			ctx.textAlign = vm._bodyAlign;
			ctx.textBaseline = 'top';
			ctx.font = helpers.fontString(bodyFontSize, vm._bodyFontStyle, vm._bodyFontFamily);

			// Before Body
			var xLinePadding = 0;
			var fillLineOfText = function(line) {
				ctx.fillText(line, pt.x + xLinePadding, pt.y);
				pt.y += bodyFontSize + bodySpacing;
			};

			// Before body lines
			ctx.fillStyle = mergeOpacity(vm.bodyFontColor, opacity);
			helpers.each(vm.beforeBody, fillLineOfText);

			var drawColorBoxes = vm.displayColors;
			xLinePadding = drawColorBoxes ? (bodyFontSize + 2) : 0;

			// Draw body lines now
			helpers.each(body, function(bodyItem, i) {
				var textColor = mergeOpacity(vm.labelTextColors[i], opacity);
				ctx.fillStyle = textColor;
				helpers.each(bodyItem.before, fillLineOfText);

				helpers.each(bodyItem.lines, function(line) {
					// Draw Legend-like boxes if needed
					if (drawColorBoxes) {
						// Fill a white rect so that colours merge nicely if the opacity is < 1
						ctx.fillStyle = mergeOpacity(vm.legendColorBackground, opacity);
						ctx.fillRect(pt.x, pt.y, bodyFontSize, bodyFontSize);

						// Border
						ctx.lineWidth = 1;
						ctx.strokeStyle = mergeOpacity(vm.labelColors[i].borderColor, opacity);
						ctx.strokeRect(pt.x, pt.y, bodyFontSize, bodyFontSize);

						// Inner square
						ctx.fillStyle = mergeOpacity(vm.labelColors[i].backgroundColor, opacity);
						ctx.fillRect(pt.x + 1, pt.y + 1, bodyFontSize - 2, bodyFontSize - 2);
						ctx.fillStyle = textColor;
					}

					fillLineOfText(line);
				});

				helpers.each(bodyItem.after, fillLineOfText);
			});

			// Reset back to 0 for after body
			xLinePadding = 0;

			// After body lines
			helpers.each(vm.afterBody, fillLineOfText);
			pt.y -= bodySpacing; // Remove last body spacing
		},
		drawFooter: function(pt, vm, ctx, opacity) {
			var footer = vm.footer;

			if (footer.length) {
				pt.y += vm.footerMarginTop;

				ctx.textAlign = vm._footerAlign;
				ctx.textBaseline = 'top';

				ctx.fillStyle = mergeOpacity(vm.footerFontColor, opacity);
				ctx.font = helpers.fontString(vm.footerFontSize, vm._footerFontStyle, vm._footerFontFamily);

				helpers.each(footer, function(line) {
					ctx.fillText(line, pt.x, pt.y);
					pt.y += vm.footerFontSize + vm.footerSpacing;
				});
			}
		},
		drawBackground: function(pt, vm, ctx, tooltipSize, opacity) {
			ctx.fillStyle = mergeOpacity(vm.backgroundColor, opacity);
			ctx.strokeStyle = mergeOpacity(vm.borderColor, opacity);
			ctx.lineWidth = vm.borderWidth;
			var xAlign = vm.xAlign;
			var yAlign = vm.yAlign;
			var x = pt.x;
			var y = pt.y;
			var width = tooltipSize.width;
			var height = tooltipSize.height;
			var radius = vm.cornerRadius;

			ctx.beginPath();
			ctx.moveTo(x + radius, y);
			if (yAlign === 'top') {
				this.drawCaret(pt, tooltipSize);
			}
			ctx.lineTo(x + width - radius, y);
			ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
			if (yAlign === 'center' && xAlign === 'right') {
				this.drawCaret(pt, tooltipSize);
			}
			ctx.lineTo(x + width, y + height - radius);
			ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
			if (yAlign === 'bottom') {
				this.drawCaret(pt, tooltipSize);
			}
			ctx.lineTo(x + radius, y + height);
			ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
			if (yAlign === 'center' && xAlign === 'left') {
				this.drawCaret(pt, tooltipSize);
			}
			ctx.lineTo(x, y + radius);
			ctx.quadraticCurveTo(x, y, x + radius, y);
			ctx.closePath();

			ctx.fill();

			if (vm.borderWidth > 0) {
				ctx.stroke();
			}
		},
		draw: function() {
			var ctx = this._chart.ctx;
			var vm = this._view;

			if (vm.opacity === 0) {
				return;
			}

			var tooltipSize = {
				width: vm.width,
				height: vm.height
			};
			var pt = {
				x: vm.x,
				y: vm.y
			};

			// IE11/Edge does not like very small opacities, so snap to 0
			var opacity = Math.abs(vm.opacity < 1e-3) ? 0 : vm.opacity;

			// Truthy/falsey value for empty tooltip
			var hasTooltipContent = vm.title.length || vm.beforeBody.length || vm.body.length || vm.afterBody.length || vm.footer.length;

			if (this._options.enabled && hasTooltipContent) {
				// Draw Background
				this.drawBackground(pt, vm, ctx, tooltipSize, opacity);

				// Draw Title, Body, and Footer
				pt.x += vm.xPadding;
				pt.y += vm.yPadding;

				// Titles
				this.drawTitle(pt, vm, ctx, opacity);

				// Body
				this.drawBody(pt, vm, ctx, opacity);

				// Footer
				this.drawFooter(pt, vm, ctx, opacity);
			}
		},

		/**
		 * Handle an event
		 * @private
		 * @param {IEvent} event - The event to handle
		 * @returns {Boolean} true if the tooltip changed
		 */
		handleEvent: function(e) {
			var me = this;
			var options = me._options;
			var changed = false;

			me._lastActive = me._lastActive || [];

			// Find Active Elements for tooltips
			if (e.type === 'mouseout') {
				me._active = [];
			} else {
				me._active = me._chart.getElementsAtEventForMode(e, options.mode, options);
			}

			// Remember Last Actives
			changed = !helpers.arrayEquals(me._active, me._lastActive);

			// Only handle target event on tooltip change
			if (changed) {
				me._lastActive = me._active;

				if (options.enabled || options.custom) {
					me._eventPosition = {
						x: e.x,
						y: e.y
					};

					me.update(true);
					me.pivot();
				}
			}

			return changed;
		}
	});

	/**
	 * @namespace Chart.Tooltip.positioners
	 */
	Chart.Tooltip.positioners = {
		/**
		 * Average mode places the tooltip at the average position of the elements shown
		 * @function Chart.Tooltip.positioners.average
		 * @param elements {ChartElement[]} the elements being displayed in the tooltip
		 * @returns {Point} tooltip position
		 */
		average: function(elements) {
			if (!elements.length) {
				return false;
			}

			var i, len;
			var x = 0;
			var y = 0;
			var count = 0;

			for (i = 0, len = elements.length; i < len; ++i) {
				var el = elements[i];
				if (el && el.hasValue()) {
					var pos = el.tooltipPosition();
					x += pos.x;
					y += pos.y;
					++count;
				}
			}

			return {
				x: Math.round(x / count),
				y: Math.round(y / count)
			};
		},

		/**
		 * Gets the tooltip position nearest of the item nearest to the event position
		 * @function Chart.Tooltip.positioners.nearest
		 * @param elements {Chart.Element[]} the tooltip elements
		 * @param eventPosition {Point} the position of the event in canvas coordinates
		 * @returns {Point} the tooltip position
		 */
		nearest: function(elements, eventPosition) {
			var x = eventPosition.x;
			var y = eventPosition.y;
			var minDistance = Number.POSITIVE_INFINITY;
			var i, len, nearestElement;

			for (i = 0, len = elements.length; i < len; ++i) {
				var el = elements[i];
				if (el && el.hasValue()) {
					var center = el.getCenterPoint();
					var d = helpers.distanceBetweenPoints(eventPosition, center);

					if (d < minDistance) {
						minDistance = d;
						nearestElement = el;
					}
				}
			}

			if (nearestElement) {
				var tp = nearestElement.tooltipPosition();
				x = tp.x;
				y = tp.y;
			}

			return {
				x: x,
				y: y
			};
		}
	};
};

},{"25":25,"26":26,"45":45}],36:[function(require,module,exports){
'use strict';

var defaults = require(25);
var Element = require(26);
var helpers = require(45);

defaults._set('global', {
	elements: {
		arc: {
			backgroundColor: defaults.global.defaultColor,
			borderColor: '#fff',
			borderWidth: 2
		}
	}
});

module.exports = Element.extend({
	inLabelRange: function(mouseX) {
		var vm = this._view;

		if (vm) {
			return (Math.pow(mouseX - vm.x, 2) < Math.pow(vm.radius + vm.hoverRadius, 2));
		}
		return false;
	},

	inRange: function(chartX, chartY) {
		var vm = this._view;

		if (vm) {
			var pointRelativePosition = helpers.getAngleFromPoint(vm, {x: chartX, y: chartY});
			var	angle = pointRelativePosition.angle;
			var distance = pointRelativePosition.distance;

			// Sanitise angle range
			var startAngle = vm.startAngle;
			var endAngle = vm.endAngle;
			while (endAngle < startAngle) {
				endAngle += 2.0 * Math.PI;
			}
			while (angle > endAngle) {
				angle -= 2.0 * Math.PI;
			}
			while (angle < startAngle) {
				angle += 2.0 * Math.PI;
			}

			// Check if within the range of the open/close angle
			var betweenAngles = (angle >= startAngle && angle <= endAngle);
			var withinRadius = (distance >= vm.innerRadius && distance <= vm.outerRadius);

			return (betweenAngles && withinRadius);
		}
		return false;
	},

	getCenterPoint: function() {
		var vm = this._view;
		var halfAngle = (vm.startAngle + vm.endAngle) / 2;
		var halfRadius = (vm.innerRadius + vm.outerRadius) / 2;
		return {
			x: vm.x + Math.cos(halfAngle) * halfRadius,
			y: vm.y + Math.sin(halfAngle) * halfRadius
		};
	},

	getArea: function() {
		var vm = this._view;
		return Math.PI * ((vm.endAngle - vm.startAngle) / (2 * Math.PI)) * (Math.pow(vm.outerRadius, 2) - Math.pow(vm.innerRadius, 2));
	},

	tooltipPosition: function() {
		var vm = this._view;
		var centreAngle = vm.startAngle + ((vm.endAngle - vm.startAngle) / 2);
		var rangeFromCentre = (vm.outerRadius - vm.innerRadius) / 2 + vm.innerRadius;

		return {
			x: vm.x + (Math.cos(centreAngle) * rangeFromCentre),
			y: vm.y + (Math.sin(centreAngle) * rangeFromCentre)
		};
	},

	draw: function() {
		var ctx = this._chart.ctx;
		var vm = this._view;
		var sA = vm.startAngle;
		var eA = vm.endAngle;

		ctx.beginPath();

		ctx.arc(vm.x, vm.y, vm.outerRadius, sA, eA);
		ctx.arc(vm.x, vm.y, vm.innerRadius, eA, sA, true);

		ctx.closePath();
		ctx.strokeStyle = vm.borderColor;
		ctx.lineWidth = vm.borderWidth;

		ctx.fillStyle = vm.backgroundColor;

		ctx.fill();
		ctx.lineJoin = 'bevel';

		if (vm.borderWidth) {
			ctx.stroke();
		}
	}
});

},{"25":25,"26":26,"45":45}],37:[function(require,module,exports){
'use strict';

var defaults = require(25);
var Element = require(26);
var helpers = require(45);

var globalDefaults = defaults.global;

defaults._set('global', {
	elements: {
		line: {
			tension: 0.4,
			backgroundColor: globalDefaults.defaultColor,
			borderWidth: 3,
			borderColor: globalDefaults.defaultColor,
			borderCapStyle: 'butt',
			borderDash: [],
			borderDashOffset: 0.0,
			borderJoinStyle: 'miter',
			capBezierPoints: true,
			fill: true, // do we fill in the area between the line and its base axis
		}
	}
});

module.exports = Element.extend({
	draw: function() {
		var me = this;
		var vm = me._view;
		var ctx = me._chart.ctx;
		var spanGaps = vm.spanGaps;
		var points = me._children.slice(); // clone array
		var globalOptionLineElements = globalDefaults.elements.line;
		var lastDrawnIndex = -1;
		var index, current, previous, currentVM;

		// If we are looping, adding the first point again
		if (me._loop && points.length) {
			points.push(points[0]);
		}

		ctx.save();

		// Stroke Line Options
		ctx.lineCap = vm.borderCapStyle || globalOptionLineElements.borderCapStyle;

		// IE 9 and 10 do not support line dash
		if (ctx.setLineDash) {
			ctx.setLineDash(vm.borderDash || globalOptionLineElements.borderDash);
		}

		ctx.lineDashOffset = vm.borderDashOffset || globalOptionLineElements.borderDashOffset;
		ctx.lineJoin = vm.borderJoinStyle || globalOptionLineElements.borderJoinStyle;
		ctx.lineWidth = vm.borderWidth || globalOptionLineElements.borderWidth;
		ctx.strokeStyle = vm.borderColor || globalDefaults.defaultColor;

		// Stroke Line
		ctx.beginPath();
		lastDrawnIndex = -1;

		for (index = 0; index < points.length; ++index) {
			current = points[index];
			previous = helpers.previousItem(points, index);
			currentVM = current._view;

			// First point moves to it's starting position no matter what
			if (index === 0) {
				if (!currentVM.skip) {
					ctx.moveTo(currentVM.x, currentVM.y);
					lastDrawnIndex = index;
				}
			} else {
				previous = lastDrawnIndex === -1 ? previous : points[lastDrawnIndex];

				if (!currentVM.skip) {
					if ((lastDrawnIndex !== (index - 1) && !spanGaps) || lastDrawnIndex === -1) {
						// There was a gap and this is the first point after the gap
						ctx.moveTo(currentVM.x, currentVM.y);
					} else {
						// Line to next point
						helpers.canvas.lineTo(ctx, previous._view, current._view);
					}
					lastDrawnIndex = index;
				}
			}
		}

		ctx.stroke();
		ctx.restore();
	}
});

},{"25":25,"26":26,"45":45}],38:[function(require,module,exports){
'use strict';

var defaults = require(25);
var Element = require(26);
var helpers = require(45);

var defaultColor = defaults.global.defaultColor;

defaults._set('global', {
	elements: {
		point: {
			radius: 3,
			pointStyle: 'circle',
			backgroundColor: defaultColor,
			borderColor: defaultColor,
			borderWidth: 1,
			// Hover
			hitRadius: 1,
			hoverRadius: 4,
			hoverBorderWidth: 1
		}
	}
});

function xRange(mouseX) {
	var vm = this._view;
	return vm ? (Math.abs(mouseX - vm.x) < vm.radius + vm.hitRadius) : false;
}

function yRange(mouseY) {
	var vm = this._view;
	return vm ? (Math.abs(mouseY - vm.y) < vm.radius + vm.hitRadius) : false;
}

module.exports = Element.extend({
	inRange: function(mouseX, mouseY) {
		var vm = this._view;
		return vm ? ((Math.pow(mouseX - vm.x, 2) + Math.pow(mouseY - vm.y, 2)) < Math.pow(vm.hitRadius + vm.radius, 2)) : false;
	},

	inLabelRange: xRange,
	inXRange: xRange,
	inYRange: yRange,

	getCenterPoint: function() {
		var vm = this._view;
		return {
			x: vm.x,
			y: vm.y
		};
	},

	getArea: function() {
		return Math.PI * Math.pow(this._view.radius, 2);
	},

	tooltipPosition: function() {
		var vm = this._view;
		return {
			x: vm.x,
			y: vm.y,
			padding: vm.radius + vm.borderWidth
		};
	},

	draw: function(chartArea) {
		var vm = this._view;
		var model = this._model;
		var ctx = this._chart.ctx;
		var pointStyle = vm.pointStyle;
		var radius = vm.radius;
		var x = vm.x;
		var y = vm.y;
		var color = helpers.color;
		var errMargin = 1.01; // 1.01 is margin for Accumulated error. (Especially Edge, IE.)
		var ratio = 0;

		if (vm.skip) {
			return;
		}

		ctx.strokeStyle = vm.borderColor || defaultColor;
		ctx.lineWidth = helpers.valueOrDefault(vm.borderWidth, defaults.global.elements.point.borderWidth);
		ctx.fillStyle = vm.backgroundColor || defaultColor;

		// Cliping for Points.
		// going out from inner charArea?
		if ((chartArea !== undefined) && ((model.x < chartArea.left) || (chartArea.right * errMargin < model.x) || (model.y < chartArea.top) || (chartArea.bottom * errMargin < model.y))) {
			// Point fade out
			if (model.x < chartArea.left) {
				ratio = (x - model.x) / (chartArea.left - model.x);
			} else if (chartArea.right * errMargin < model.x) {
				ratio = (model.x - x) / (model.x - chartArea.right);
			} else if (model.y < chartArea.top) {
				ratio = (y - model.y) / (chartArea.top - model.y);
			} else if (chartArea.bottom * errMargin < model.y) {
				ratio = (model.y - y) / (model.y - chartArea.bottom);
			}
			ratio = Math.round(ratio * 100) / 100;
			ctx.strokeStyle = color(ctx.strokeStyle).alpha(ratio).rgbString();
			ctx.fillStyle = color(ctx.fillStyle).alpha(ratio).rgbString();
		}

		helpers.canvas.drawPoint(ctx, pointStyle, radius, x, y);
	}
});

},{"25":25,"26":26,"45":45}],39:[function(require,module,exports){
'use strict';

var defaults = require(25);
var Element = require(26);

defaults._set('global', {
	elements: {
		rectangle: {
			backgroundColor: defaults.global.defaultColor,
			borderColor: defaults.global.defaultColor,
			borderSkipped: 'bottom',
			borderWidth: 0
		}
	}
});

function isVertical(bar) {
	return bar._view.width !== undefined;
}

/**
 * Helper function to get the bounds of the bar regardless of the orientation
 * @param bar {Chart.Element.Rectangle} the bar
 * @return {Bounds} bounds of the bar
 * @private
 */
function getBarBounds(bar) {
	var vm = bar._view;
	var x1, x2, y1, y2;

	if (isVertical(bar)) {
		// vertical
		var halfWidth = vm.width / 2;
		x1 = vm.x - halfWidth;
		x2 = vm.x + halfWidth;
		y1 = Math.min(vm.y, vm.base);
		y2 = Math.max(vm.y, vm.base);
	} else {
		// horizontal bar
		var halfHeight = vm.height / 2;
		x1 = Math.min(vm.x, vm.base);
		x2 = Math.max(vm.x, vm.base);
		y1 = vm.y - halfHeight;
		y2 = vm.y + halfHeight;
	}

	return {
		left: x1,
		top: y1,
		right: x2,
		bottom: y2
	};
}

module.exports = Element.extend({
	draw: function() {
		var ctx = this._chart.ctx;
		var vm = this._view;
		var left, right, top, bottom, signX, signY, borderSkipped;
		var borderWidth = vm.borderWidth;

		if (!vm.horizontal) {
			// bar
			left = vm.x - vm.width / 2;
			right = vm.x + vm.width / 2;
			top = vm.y;
			bottom = vm.base;
			signX = 1;
			signY = bottom > top ? 1 : -1;
			borderSkipped = vm.borderSkipped || 'bottom';
		} else {
			// horizontal bar
			left = vm.base;
			right = vm.x;
			top = vm.y - vm.height / 2;
			bottom = vm.y + vm.height / 2;
			signX = right > left ? 1 : -1;
			signY = 1;
			borderSkipped = vm.borderSkipped || 'left';
		}

		// Canvas doesn't allow us to stroke inside the width so we can
		// adjust the sizes to fit if we're setting a stroke on the line
		if (borderWidth) {
			// borderWidth shold be less than bar width and bar height.
			var barSize = Math.min(Math.abs(left - right), Math.abs(top - bottom));
			borderWidth = borderWidth > barSize ? barSize : borderWidth;
			var halfStroke = borderWidth / 2;
			// Adjust borderWidth when bar top position is near vm.base(zero).
			var borderLeft = left + (borderSkipped !== 'left' ? halfStroke * signX : 0);
			var borderRight = right + (borderSkipped !== 'right' ? -halfStroke * signX : 0);
			var borderTop = top + (borderSkipped !== 'top' ? halfStroke * signY : 0);
			var borderBottom = bottom + (borderSkipped !== 'bottom' ? -halfStroke * signY : 0);
			// not become a vertical line?
			if (borderLeft !== borderRight) {
				top = borderTop;
				bottom = borderBottom;
			}
			// not become a horizontal line?
			if (borderTop !== borderBottom) {
				left = borderLeft;
				right = borderRight;
			}
		}

		ctx.beginPath();
		ctx.fillStyle = vm.backgroundColor;
		ctx.strokeStyle = vm.borderColor;
		ctx.lineWidth = borderWidth;

		// Corner points, from bottom-left to bottom-right clockwise
		// | 1 2 |
		// | 0 3 |
		var corners = [
			[left, bottom],
			[left, top],
			[right, top],
			[right, bottom]
		];

		// Find first (starting) corner with fallback to 'bottom'
		var borders = ['bottom', 'left', 'top', 'right'];
		var startCorner = borders.indexOf(borderSkipped, 0);
		if (startCorner === -1) {
			startCorner = 0;
		}

		function cornerAt(index) {
			return corners[(startCorner + index) % 4];
		}

		// Draw rectangle from 'startCorner'
		var corner = cornerAt(0);
		ctx.moveTo(corner[0], corner[1]);

		for (var i = 1; i < 4; i++) {
			corner = cornerAt(i);
			ctx.lineTo(corner[0], corner[1]);
		}

		ctx.fill();
		if (borderWidth) {
			ctx.stroke();
		}
	},

	height: function() {
		var vm = this._view;
		return vm.base - vm.y;
	},

	inRange: function(mouseX, mouseY) {
		var inRange = false;

		if (this._view) {
			var bounds = getBarBounds(this);
			inRange = mouseX >= bounds.left && mouseX <= bounds.right && mouseY >= bounds.top && mouseY <= bounds.bottom;
		}

		return inRange;
	},

	inLabelRange: function(mouseX, mouseY) {
		var me = this;
		if (!me._view) {
			return false;
		}

		var inRange = false;
		var bounds = getBarBounds(me);

		if (isVertical(me)) {
			inRange = mouseX >= bounds.left && mouseX <= bounds.right;
		} else {
			inRange = mouseY >= bounds.top && mouseY <= bounds.bottom;
		}

		return inRange;
	},

	inXRange: function(mouseX) {
		var bounds = getBarBounds(this);
		return mouseX >= bounds.left && mouseX <= bounds.right;
	},

	inYRange: function(mouseY) {
		var bounds = getBarBounds(this);
		return mouseY >= bounds.top && mouseY <= bounds.bottom;
	},

	getCenterPoint: function() {
		var vm = this._view;
		var x, y;
		if (isVertical(this)) {
			x = vm.x;
			y = (vm.y + vm.base) / 2;
		} else {
			x = (vm.x + vm.base) / 2;
			y = vm.y;
		}

		return {x: x, y: y};
	},

	getArea: function() {
		var vm = this._view;
		return vm.width * Math.abs(vm.y - vm.base);
	},

	tooltipPosition: function() {
		var vm = this._view;
		return {
			x: vm.x,
			y: vm.y
		};
	}
});

},{"25":25,"26":26}],40:[function(require,module,exports){
'use strict';

module.exports = {};
module.exports.Arc = require(36);
module.exports.Line = require(37);
module.exports.Point = require(38);
module.exports.Rectangle = require(39);

},{"36":36,"37":37,"38":38,"39":39}],41:[function(require,module,exports){
'use strict';

var helpers = require(42);

/**
 * @namespace Chart.helpers.canvas
 */
var exports = module.exports = {
	/**
	 * Clears the entire canvas associated to the given `chart`.
	 * @param {Chart} chart - The chart for which to clear the canvas.
	 */
	clear: function(chart) {
		chart.ctx.clearRect(0, 0, chart.width, chart.height);
	},

	/**
	 * Creates a "path" for a rectangle with rounded corners at position (x, y) with a
	 * given size (width, height) and the same `radius` for all corners.
	 * @param {CanvasRenderingContext2D} ctx - The canvas 2D Context.
	 * @param {Number} x - The x axis of the coordinate for the rectangle starting point.
	 * @param {Number} y - The y axis of the coordinate for the rectangle starting point.
	 * @param {Number} width - The rectangle's width.
	 * @param {Number} height - The rectangle's height.
	 * @param {Number} radius - The rounded amount (in pixels) for the four corners.
	 * @todo handle `radius` as top-left, top-right, bottom-right, bottom-left array/object?
	 */
	roundedRect: function(ctx, x, y, width, height, radius) {
		if (radius) {
			var rx = Math.min(radius, width / 2);
			var ry = Math.min(radius, height / 2);

			ctx.moveTo(x + rx, y);
			ctx.lineTo(x + width - rx, y);
			ctx.quadraticCurveTo(x + width, y, x + width, y + ry);
			ctx.lineTo(x + width, y + height - ry);
			ctx.quadraticCurveTo(x + width, y + height, x + width - rx, y + height);
			ctx.lineTo(x + rx, y + height);
			ctx.quadraticCurveTo(x, y + height, x, y + height - ry);
			ctx.lineTo(x, y + ry);
			ctx.quadraticCurveTo(x, y, x + rx, y);
		} else {
			ctx.rect(x, y, width, height);
		}
	},

	drawPoint: function(ctx, style, radius, x, y) {
		var type, edgeLength, xOffset, yOffset, height, size;

		if (style && typeof style === 'object') {
			type = style.toString();
			if (type === '[object HTMLImageElement]' || type === '[object HTMLCanvasElement]') {
				ctx.drawImage(style, x - style.width / 2, y - style.height / 2, style.width, style.height);
				return;
			}
		}

		if (isNaN(radius) || radius <= 0) {
			return;
		}

		switch (style) {
		// Default includes circle
		default:
			ctx.beginPath();
			ctx.arc(x, y, radius, 0, Math.PI * 2);
			ctx.closePath();
			ctx.fill();
			break;
		case 'triangle':
			ctx.beginPath();
			edgeLength = 3 * radius / Math.sqrt(3);
			height = edgeLength * Math.sqrt(3) / 2;
			ctx.moveTo(x - edgeLength / 2, y + height / 3);
			ctx.lineTo(x + edgeLength / 2, y + height / 3);
			ctx.lineTo(x, y - 2 * height / 3);
			ctx.closePath();
			ctx.fill();
			break;
		case 'rect':
			size = 1 / Math.SQRT2 * radius;
			ctx.beginPath();
			ctx.fillRect(x - size, y - size, 2 * size, 2 * size);
			ctx.strokeRect(x - size, y - size, 2 * size, 2 * size);
			break;
		case 'rectRounded':
			var offset = radius / Math.SQRT2;
			var leftX = x - offset;
			var topY = y - offset;
			var sideSize = Math.SQRT2 * radius;
			ctx.beginPath();
			this.roundedRect(ctx, leftX, topY, sideSize, sideSize, radius / 2);
			ctx.closePath();
			ctx.fill();
			break;
		case 'rectRot':
			size = 1 / Math.SQRT2 * radius;
			ctx.beginPath();
			ctx.moveTo(x - size, y);
			ctx.lineTo(x, y + size);
			ctx.lineTo(x + size, y);
			ctx.lineTo(x, y - size);
			ctx.closePath();
			ctx.fill();
			break;
		case 'cross':
			ctx.beginPath();
			ctx.moveTo(x, y + radius);
			ctx.lineTo(x, y - radius);
			ctx.moveTo(x - radius, y);
			ctx.lineTo(x + radius, y);
			ctx.closePath();
			break;
		case 'crossRot':
			ctx.beginPath();
			xOffset = Math.cos(Math.PI / 4) * radius;
			yOffset = Math.sin(Math.PI / 4) * radius;
			ctx.moveTo(x - xOffset, y - yOffset);
			ctx.lineTo(x + xOffset, y + yOffset);
			ctx.moveTo(x - xOffset, y + yOffset);
			ctx.lineTo(x + xOffset, y - yOffset);
			ctx.closePath();
			break;
		case 'star':
			ctx.beginPath();
			ctx.moveTo(x, y + radius);
			ctx.lineTo(x, y - radius);
			ctx.moveTo(x - radius, y);
			ctx.lineTo(x + radius, y);
			xOffset = Math.cos(Math.PI / 4) * radius;
			yOffset = Math.sin(Math.PI / 4) * radius;
			ctx.moveTo(x - xOffset, y - yOffset);
			ctx.lineTo(x + xOffset, y + yOffset);
			ctx.moveTo(x - xOffset, y + yOffset);
			ctx.lineTo(x + xOffset, y - yOffset);
			ctx.closePath();
			break;
		case 'line':
			ctx.beginPath();
			ctx.moveTo(x - radius, y);
			ctx.lineTo(x + radius, y);
			ctx.closePath();
			break;
		case 'dash':
			ctx.beginPath();
			ctx.moveTo(x, y);
			ctx.lineTo(x + radius, y);
			ctx.closePath();
			break;
		}

		ctx.stroke();
	},

	clipArea: function(ctx, area) {
		ctx.save();
		ctx.beginPath();
		ctx.rect(area.left, area.top, area.right - area.left, area.bottom - area.top);
		ctx.clip();
	},

	unclipArea: function(ctx) {
		ctx.restore();
	},

	lineTo: function(ctx, previous, target, flip) {
		if (target.steppedLine) {
			if ((target.steppedLine === 'after' && !flip) || (target.steppedLine !== 'after' && flip)) {
				ctx.lineTo(previous.x, target.y);
			} else {
				ctx.lineTo(target.x, previous.y);
			}
			ctx.lineTo(target.x, target.y);
			return;
		}

		if (!target.tension) {
			ctx.lineTo(target.x, target.y);
			return;
		}

		ctx.bezierCurveTo(
			flip ? previous.controlPointPreviousX : previous.controlPointNextX,
			flip ? previous.controlPointPreviousY : previous.controlPointNextY,
			flip ? target.controlPointNextX : target.controlPointPreviousX,
			flip ? target.controlPointNextY : target.controlPointPreviousY,
			target.x,
			target.y);
	}
};

// DEPRECATIONS

/**
 * Provided for backward compatibility, use Chart.helpers.canvas.clear instead.
 * @namespace Chart.helpers.clear
 * @deprecated since version 2.7.0
 * @todo remove at version 3
 * @private
 */
helpers.clear = exports.clear;

/**
 * Provided for backward compatibility, use Chart.helpers.canvas.roundedRect instead.
 * @namespace Chart.helpers.drawRoundedRectangle
 * @deprecated since version 2.7.0
 * @todo remove at version 3
 * @private
 */
helpers.drawRoundedRectangle = function(ctx) {
	ctx.beginPath();
	exports.roundedRect.apply(exports, arguments);
	ctx.closePath();
};

},{"42":42}],42:[function(require,module,exports){
'use strict';

/**
 * @namespace Chart.helpers
 */
var helpers = {
	/**
	 * An empty function that can be used, for example, for optional callback.
	 */
	noop: function() {},

	/**
	 * Returns a unique id, sequentially generated from a global variable.
	 * @returns {Number}
	 * @function
	 */
	uid: (function() {
		var id = 0;
		return function() {
			return id++;
		};
	}()),

	/**
	 * Returns true if `value` is neither null nor undefined, else returns false.
	 * @param {*} value - The value to test.
	 * @returns {Boolean}
	 * @since 2.7.0
	 */
	isNullOrUndef: function(value) {
		return value === null || typeof value === 'undefined';
	},

	/**
	 * Returns true if `value` is an array, else returns false.
	 * @param {*} value - The value to test.
	 * @returns {Boolean}
	 * @function
	 */
	isArray: Array.isArray ? Array.isArray : function(value) {
		return Object.prototype.toString.call(value) === '[object Array]';
	},

	/**
	 * Returns true if `value` is an object (excluding null), else returns false.
	 * @param {*} value - The value to test.
	 * @returns {Boolean}
	 * @since 2.7.0
	 */
	isObject: function(value) {
		return value !== null && Object.prototype.toString.call(value) === '[object Object]';
	},

	/**
	 * Returns `value` if defined, else returns `defaultValue`.
	 * @param {*} value - The value to return if defined.
	 * @param {*} defaultValue - The value to return if `value` is undefined.
	 * @returns {*}
	 */
	valueOrDefault: function(value, defaultValue) {
		return typeof value === 'undefined' ? defaultValue : value;
	},

	/**
	 * Returns value at the given `index` in array if defined, else returns `defaultValue`.
	 * @param {Array} value - The array to lookup for value at `index`.
	 * @param {Number} index - The index in `value` to lookup for value.
	 * @param {*} defaultValue - The value to return if `value[index]` is undefined.
	 * @returns {*}
	 */
	valueAtIndexOrDefault: function(value, index, defaultValue) {
		return helpers.valueOrDefault(helpers.isArray(value) ? value[index] : value, defaultValue);
	},

	/**
	 * Calls `fn` with the given `args` in the scope defined by `thisArg` and returns the
	 * value returned by `fn`. If `fn` is not a function, this method returns undefined.
	 * @param {Function} fn - The function to call.
	 * @param {Array|undefined|null} args - The arguments with which `fn` should be called.
	 * @param {Object} [thisArg] - The value of `this` provided for the call to `fn`.
	 * @returns {*}
	 */
	callback: function(fn, args, thisArg) {
		if (fn && typeof fn.call === 'function') {
			return fn.apply(thisArg, args);
		}
	},

	/**
	 * Note(SB) for performance sake, this method should only be used when loopable type
	 * is unknown or in none intensive code (not called often and small loopable). Else
	 * it's preferable to use a regular for() loop and save extra function calls.
	 * @param {Object|Array} loopable - The object or array to be iterated.
	 * @param {Function} fn - The function to call for each item.
	 * @param {Object} [thisArg] - The value of `this` provided for the call to `fn`.
	 * @param {Boolean} [reverse] - If true, iterates backward on the loopable.
	 */
	each: function(loopable, fn, thisArg, reverse) {
		var i, len, keys;
		if (helpers.isArray(loopable)) {
			len = loopable.length;
			if (reverse) {
				for (i = len - 1; i >= 0; i--) {
					fn.call(thisArg, loopable[i], i);
				}
			} else {
				for (i = 0; i < len; i++) {
					fn.call(thisArg, loopable[i], i);
				}
			}
		} else if (helpers.isObject(loopable)) {
			keys = Object.keys(loopable);
			len = keys.length;
			for (i = 0; i < len; i++) {
				fn.call(thisArg, loopable[keys[i]], keys[i]);
			}
		}
	},

	/**
	 * Returns true if the `a0` and `a1` arrays have the same content, else returns false.
	 * @see http://stackoverflow.com/a/14853974
	 * @param {Array} a0 - The array to compare
	 * @param {Array} a1 - The array to compare
	 * @returns {Boolean}
	 */
	arrayEquals: function(a0, a1) {
		var i, ilen, v0, v1;

		if (!a0 || !a1 || a0.length !== a1.length) {
			return false;
		}

		for (i = 0, ilen = a0.length; i < ilen; ++i) {
			v0 = a0[i];
			v1 = a1[i];

			if (v0 instanceof Array && v1 instanceof Array) {
				if (!helpers.arrayEquals(v0, v1)) {
					return false;
				}
			} else if (v0 !== v1) {
				// NOTE: two different object instances will never be equal: {x:20} != {x:20}
				return false;
			}
		}

		return true;
	},

	/**
	 * Returns a deep copy of `source` without keeping references on objects and arrays.
	 * @param {*} source - The value to clone.
	 * @returns {*}
	 */
	clone: function(source) {
		if (helpers.isArray(source)) {
			return source.map(helpers.clone);
		}

		if (helpers.isObject(source)) {
			var target = {};
			var keys = Object.keys(source);
			var klen = keys.length;
			var k = 0;

			for (; k < klen; ++k) {
				target[keys[k]] = helpers.clone(source[keys[k]]);
			}

			return target;
		}

		return source;
	},

	/**
	 * The default merger when Chart.helpers.merge is called without merger option.
	 * Note(SB): this method is also used by configMerge and scaleMerge as fallback.
	 * @private
	 */
	_merger: function(key, target, source, options) {
		var tval = target[key];
		var sval = source[key];

		if (helpers.isObject(tval) && helpers.isObject(sval)) {
			helpers.merge(tval, sval, options);
		} else {
			target[key] = helpers.clone(sval);
		}
	},

	/**
	 * Merges source[key] in target[key] only if target[key] is undefined.
	 * @private
	 */
	_mergerIf: function(key, target, source) {
		var tval = target[key];
		var sval = source[key];

		if (helpers.isObject(tval) && helpers.isObject(sval)) {
			helpers.mergeIf(tval, sval);
		} else if (!target.hasOwnProperty(key)) {
			target[key] = helpers.clone(sval);
		}
	},

	/**
	 * Recursively deep copies `source` properties into `target` with the given `options`.
	 * IMPORTANT: `target` is not cloned and will be updated with `source` properties.
	 * @param {Object} target - The target object in which all sources are merged into.
	 * @param {Object|Array(Object)} source - Object(s) to merge into `target`.
	 * @param {Object} [options] - Merging options:
	 * @param {Function} [options.merger] - The merge method (key, target, source, options)
	 * @returns {Object} The `target` object.
	 */
	merge: function(target, source, options) {
		var sources = helpers.isArray(source) ? source : [source];
		var ilen = sources.length;
		var merge, i, keys, klen, k;

		if (!helpers.isObject(target)) {
			return target;
		}

		options = options || {};
		merge = options.merger || helpers._merger;

		for (i = 0; i < ilen; ++i) {
			source = sources[i];
			if (!helpers.isObject(source)) {
				continue;
			}

			keys = Object.keys(source);
			for (k = 0, klen = keys.length; k < klen; ++k) {
				merge(keys[k], target, source, options);
			}
		}

		return target;
	},

	/**
	 * Recursively deep copies `source` properties into `target` *only* if not defined in target.
	 * IMPORTANT: `target` is not cloned and will be updated with `source` properties.
	 * @param {Object} target - The target object in which all sources are merged into.
	 * @param {Object|Array(Object)} source - Object(s) to merge into `target`.
	 * @returns {Object} The `target` object.
	 */
	mergeIf: function(target, source) {
		return helpers.merge(target, source, {merger: helpers._mergerIf});
	},

	/**
	 * Applies the contents of two or more objects together into the first object.
	 * @param {Object} target - The target object in which all objects are merged into.
	 * @param {Object} arg1 - Object containing additional properties to merge in target.
	 * @param {Object} argN - Additional objects containing properties to merge in target.
	 * @returns {Object} The `target` object.
	 */
	extend: function(target) {
		var setFn = function(value, key) {
			target[key] = value;
		};
		for (var i = 1, ilen = arguments.length; i < ilen; ++i) {
			helpers.each(arguments[i], setFn);
		}
		return target;
	},

	/**
	 * Basic javascript inheritance based on the model created in Backbone.js
	 */
	inherits: function(extensions) {
		var me = this;
		var ChartElement = (extensions && extensions.hasOwnProperty('constructor')) ? extensions.constructor : function() {
			return me.apply(this, arguments);
		};

		var Surrogate = function() {
			this.constructor = ChartElement;
		};

		Surrogate.prototype = me.prototype;
		ChartElement.prototype = new Surrogate();
		ChartElement.extend = helpers.inherits;

		if (extensions) {
			helpers.extend(ChartElement.prototype, extensions);
		}

		ChartElement.__super__ = me.prototype;
		return ChartElement;
	}
};

module.exports = helpers;

// DEPRECATIONS

/**
 * Provided for backward compatibility, use Chart.helpers.callback instead.
 * @function Chart.helpers.callCallback
 * @deprecated since version 2.6.0
 * @todo remove at version 3
 * @private
 */
helpers.callCallback = helpers.callback;

/**
 * Provided for backward compatibility, use Array.prototype.indexOf instead.
 * Array.prototype.indexOf compatibility: Chrome, Opera, Safari, FF1.5+, IE9+
 * @function Chart.helpers.indexOf
 * @deprecated since version 2.7.0
 * @todo remove at version 3
 * @private
 */
helpers.indexOf = function(array, item, fromIndex) {
	return Array.prototype.indexOf.call(array, item, fromIndex);
};

/**
 * Provided for backward compatibility, use Chart.helpers.valueOrDefault instead.
 * @function Chart.helpers.getValueOrDefault
 * @deprecated since version 2.7.0
 * @todo remove at version 3
 * @private
 */
helpers.getValueOrDefault = helpers.valueOrDefault;

/**
 * Provided for backward compatibility, use Chart.helpers.valueAtIndexOrDefault instead.
 * @function Chart.helpers.getValueAtIndexOrDefault
 * @deprecated since version 2.7.0
 * @todo remove at version 3
 * @private
 */
helpers.getValueAtIndexOrDefault = helpers.valueAtIndexOrDefault;

},{}],43:[function(require,module,exports){
'use strict';

var helpers = require(42);

/**
 * Easing functions adapted from Robert Penner's easing equations.
 * @namespace Chart.helpers.easingEffects
 * @see http://www.robertpenner.com/easing/
 */
var effects = {
	linear: function(t) {
		return t;
	},

	easeInQuad: function(t) {
		return t * t;
	},

	easeOutQuad: function(t) {
		return -t * (t - 2);
	},

	easeInOutQuad: function(t) {
		if ((t /= 0.5) < 1) {
			return 0.5 * t * t;
		}
		return -0.5 * ((--t) * (t - 2) - 1);
	},

	easeInCubic: function(t) {
		return t * t * t;
	},

	easeOutCubic: function(t) {
		return (t = t - 1) * t * t + 1;
	},

	easeInOutCubic: function(t) {
		if ((t /= 0.5) < 1) {
			return 0.5 * t * t * t;
		}
		return 0.5 * ((t -= 2) * t * t + 2);
	},

	easeInQuart: function(t) {
		return t * t * t * t;
	},

	easeOutQuart: function(t) {
		return -((t = t - 1) * t * t * t - 1);
	},

	easeInOutQuart: function(t) {
		if ((t /= 0.5) < 1) {
			return 0.5 * t * t * t * t;
		}
		return -0.5 * ((t -= 2) * t * t * t - 2);
	},

	easeInQuint: function(t) {
		return t * t * t * t * t;
	},

	easeOutQuint: function(t) {
		return (t = t - 1) * t * t * t * t + 1;
	},

	easeInOutQuint: function(t) {
		if ((t /= 0.5) < 1) {
			return 0.5 * t * t * t * t * t;
		}
		return 0.5 * ((t -= 2) * t * t * t * t + 2);
	},

	easeInSine: function(t) {
		return -Math.cos(t * (Math.PI / 2)) + 1;
	},

	easeOutSine: function(t) {
		return Math.sin(t * (Math.PI / 2));
	},

	easeInOutSine: function(t) {
		return -0.5 * (Math.cos(Math.PI * t) - 1);
	},

	easeInExpo: function(t) {
		return (t === 0) ? 0 : Math.pow(2, 10 * (t - 1));
	},

	easeOutExpo: function(t) {
		return (t === 1) ? 1 : -Math.pow(2, -10 * t) + 1;
	},

	easeInOutExpo: function(t) {
		if (t === 0) {
			return 0;
		}
		if (t === 1) {
			return 1;
		}
		if ((t /= 0.5) < 1) {
			return 0.5 * Math.pow(2, 10 * (t - 1));
		}
		return 0.5 * (-Math.pow(2, -10 * --t) + 2);
	},

	easeInCirc: function(t) {
		if (t >= 1) {
			return t;
		}
		return -(Math.sqrt(1 - t * t) - 1);
	},

	easeOutCirc: function(t) {
		return Math.sqrt(1 - (t = t - 1) * t);
	},

	easeInOutCirc: function(t) {
		if ((t /= 0.5) < 1) {
			return -0.5 * (Math.sqrt(1 - t * t) - 1);
		}
		return 0.5 * (Math.sqrt(1 - (t -= 2) * t) + 1);
	},

	easeInElastic: function(t) {
		var s = 1.70158;
		var p = 0;
		var a = 1;
		if (t === 0) {
			return 0;
		}
		if (t === 1) {
			return 1;
		}
		if (!p) {
			p = 0.3;
		}
		if (a < 1) {
			a = 1;
			s = p / 4;
		} else {
			s = p / (2 * Math.PI) * Math.asin(1 / a);
		}
		return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - s) * (2 * Math.PI) / p));
	},

	easeOutElastic: function(t) {
		var s = 1.70158;
		var p = 0;
		var a = 1;
		if (t === 0) {
			return 0;
		}
		if (t === 1) {
			return 1;
		}
		if (!p) {
			p = 0.3;
		}
		if (a < 1) {
			a = 1;
			s = p / 4;
		} else {
			s = p / (2 * Math.PI) * Math.asin(1 / a);
		}
		return a * Math.pow(2, -10 * t) * Math.sin((t - s) * (2 * Math.PI) / p) + 1;
	},

	easeInOutElastic: function(t) {
		var s = 1.70158;
		var p = 0;
		var a = 1;
		if (t === 0) {
			return 0;
		}
		if ((t /= 0.5) === 2) {
			return 1;
		}
		if (!p) {
			p = 0.45;
		}
		if (a < 1) {
			a = 1;
			s = p / 4;
		} else {
			s = p / (2 * Math.PI) * Math.asin(1 / a);
		}
		if (t < 1) {
			return -0.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - s) * (2 * Math.PI) / p));
		}
		return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t - s) * (2 * Math.PI) / p) * 0.5 + 1;
	},
	easeInBack: function(t) {
		var s = 1.70158;
		return t * t * ((s + 1) * t - s);
	},

	easeOutBack: function(t) {
		var s = 1.70158;
		return (t = t - 1) * t * ((s + 1) * t + s) + 1;
	},

	easeInOutBack: function(t) {
		var s = 1.70158;
		if ((t /= 0.5) < 1) {
			return 0.5 * (t * t * (((s *= (1.525)) + 1) * t - s));
		}
		return 0.5 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2);
	},

	easeInBounce: function(t) {
		return 1 - effects.easeOutBounce(1 - t);
	},

	easeOutBounce: function(t) {
		if (t < (1 / 2.75)) {
			return 7.5625 * t * t;
		}
		if (t < (2 / 2.75)) {
			return 7.5625 * (t -= (1.5 / 2.75)) * t + 0.75;
		}
		if (t < (2.5 / 2.75)) {
			return 7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375;
		}
		return 7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375;
	},

	easeInOutBounce: function(t) {
		if (t < 0.5) {
			return effects.easeInBounce(t * 2) * 0.5;
		}
		return effects.easeOutBounce(t * 2 - 1) * 0.5 + 0.5;
	}
};

module.exports = {
	effects: effects
};

// DEPRECATIONS

/**
 * Provided for backward compatibility, use Chart.helpers.easing.effects instead.
 * @function Chart.helpers.easingEffects
 * @deprecated since version 2.7.0
 * @todo remove at version 3
 * @private
 */
helpers.easingEffects = effects;

},{"42":42}],44:[function(require,module,exports){
'use strict';

var helpers = require(42);

/**
 * @alias Chart.helpers.options
 * @namespace
 */
module.exports = {
	/**
	 * Converts the given line height `value` in pixels for a specific font `size`.
	 * @param {Number|String} value - The lineHeight to parse (eg. 1.6, '14px', '75%', '1.6em').
	 * @param {Number} size - The font size (in pixels) used to resolve relative `value`.
	 * @returns {Number} The effective line height in pixels (size * 1.2 if value is invalid).
	 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/line-height
	 * @since 2.7.0
	 */
	toLineHeight: function(value, size) {
		var matches = ('' + value).match(/^(normal|(\d+(?:\.\d+)?)(px|em|%)?)$/);
		if (!matches || matches[1] === 'normal') {
			return size * 1.2;
		}

		value = +matches[2];

		switch (matches[3]) {
		case 'px':
			return value;
		case '%':
			value /= 100;
			break;
		default:
			break;
		}

		return size * value;
	},

	/**
	 * Converts the given value into a padding object with pre-computed width/height.
	 * @param {Number|Object} value - If a number, set the value to all TRBL component,
	 *  else, if and object, use defined properties and sets undefined ones to 0.
	 * @returns {Object} The padding values (top, right, bottom, left, width, height)
	 * @since 2.7.0
	 */
	toPadding: function(value) {
		var t, r, b, l;

		if (helpers.isObject(value)) {
			t = +value.top || 0;
			r = +value.right || 0;
			b = +value.bottom || 0;
			l = +value.left || 0;
		} else {
			t = r = b = l = +value || 0;
		}

		return {
			top: t,
			right: r,
			bottom: b,
			left: l,
			height: t + b,
			width: l + r
		};
	},

	/**
	 * Evaluates the given `inputs` sequentially and returns the first defined value.
	 * @param {Array[]} inputs - An array of values, falling back to the last value.
	 * @param {Object} [context] - If defined and the current value is a function, the value
	 * is called with `context` as first argument and the result becomes the new input.
	 * @param {Number} [index] - If defined and the current value is an array, the value
	 * at `index` become the new input.
	 * @since 2.7.0
	 */
	resolve: function(inputs, context, index) {
		var i, ilen, value;

		for (i = 0, ilen = inputs.length; i < ilen; ++i) {
			value = inputs[i];
			if (value === undefined) {
				continue;
			}
			if (context !== undefined && typeof value === 'function') {
				value = value(context);
			}
			if (index !== undefined && helpers.isArray(value)) {
				value = value[index];
			}
			if (value !== undefined) {
				return value;
			}
		}
	}
};

},{"42":42}],45:[function(require,module,exports){
'use strict';

module.exports = require(42);
module.exports.easing = require(43);
module.exports.canvas = require(41);
module.exports.options = require(44);

},{"41":41,"42":42,"43":43,"44":44}],46:[function(require,module,exports){
/**
 * Platform fallback implementation (minimal).
 * @see https://github.com/chartjs/Chart.js/pull/4591#issuecomment-319575939
 */

module.exports = {
	acquireContext: function(item) {
		if (item && item.canvas) {
			// Support for any object associated to a canvas (including a context2d)
			item = item.canvas;
		}

		return item && item.getContext('2d') || null;
	}
};

},{}],47:[function(require,module,exports){
/**
 * Chart.Platform implementation for targeting a web browser
 */

'use strict';

var helpers = require(45);

var EXPANDO_KEY = '$chartjs';
var CSS_PREFIX = 'chartjs-';
var CSS_RENDER_MONITOR = CSS_PREFIX + 'render-monitor';
var CSS_RENDER_ANIMATION = CSS_PREFIX + 'render-animation';
var ANIMATION_START_EVENTS = ['animationstart', 'webkitAnimationStart'];

/**
 * DOM event types -> Chart.js event types.
 * Note: only events with different types are mapped.
 * @see https://developer.mozilla.org/en-US/docs/Web/Events
 */
var EVENT_TYPES = {
	touchstart: 'mousedown',
	touchmove: 'mousemove',
	touchend: 'mouseup',
	pointerenter: 'mouseenter',
	pointerdown: 'mousedown',
	pointermove: 'mousemove',
	pointerup: 'mouseup',
	pointerleave: 'mouseout',
	pointerout: 'mouseout'
};

/**
 * The "used" size is the final value of a dimension property after all calculations have
 * been performed. This method uses the computed style of `element` but returns undefined
 * if the computed style is not expressed in pixels. That can happen in some cases where
 * `element` has a size relative to its parent and this last one is not yet displayed,
 * for example because of `display: none` on a parent node.
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/used_value
 * @returns {Number} Size in pixels or undefined if unknown.
 */
function readUsedSize(element, property) {
	var value = helpers.getStyle(element, property);
	var matches = value && value.match(/^(\d+)(\.\d+)?px$/);
	return matches ? Number(matches[1]) : undefined;
}

/**
 * Initializes the canvas style and render size without modifying the canvas display size,
 * since responsiveness is handled by the controller.resize() method. The config is used
 * to determine the aspect ratio to apply in case no explicit height has been specified.
 */
function initCanvas(canvas, config) {
	var style = canvas.style;

	// NOTE(SB) canvas.getAttribute('width') !== canvas.width: in the first case it
	// returns null or '' if no explicit value has been set to the canvas attribute.
	var renderHeight = canvas.getAttribute('height');
	var renderWidth = canvas.getAttribute('width');

	// Chart.js modifies some canvas values that we want to restore on destroy
	canvas[EXPANDO_KEY] = {
		initial: {
			height: renderHeight,
			width: renderWidth,
			style: {
				display: style.display,
				height: style.height,
				width: style.width
			}
		}
	};

	// Force canvas to display as block to avoid extra space caused by inline
	// elements, which would interfere with the responsive resize process.
	// https://github.com/chartjs/Chart.js/issues/2538
	style.display = style.display || 'block';

	if (renderWidth === null || renderWidth === '') {
		var displayWidth = readUsedSize(canvas, 'width');
		if (displayWidth !== undefined) {
			canvas.width = displayWidth;
		}
	}

	if (renderHeight === null || renderHeight === '') {
		if (canvas.style.height === '') {
			// If no explicit render height and style height, let's apply the aspect ratio,
			// which one can be specified by the user but also by charts as default option
			// (i.e. options.aspectRatio). If not specified, use canvas aspect ratio of 2.
			canvas.height = canvas.width / (config.options.aspectRatio || 2);
		} else {
			var displayHeight = readUsedSize(canvas, 'height');
			if (displayWidth !== undefined) {
				canvas.height = displayHeight;
			}
		}
	}

	return canvas;
}

/**
 * Detects support for options object argument in addEventListener.
 * https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Safely_detecting_option_support
 * @private
 */
var supportsEventListenerOptions = (function() {
	var supports = false;
	try {
		var options = Object.defineProperty({}, 'passive', {
			get: function() {
				supports = true;
			}
		});
		window.addEventListener('e', null, options);
	} catch (e) {
		// continue regardless of error
	}
	return supports;
}());

// Default passive to true as expected by Chrome for 'touchstart' and 'touchend' events.
// https://github.com/chartjs/Chart.js/issues/4287
var eventListenerOptions = supportsEventListenerOptions ? {passive: true} : false;

function addEventListener(node, type, listener) {
	node.addEventListener(type, listener, eventListenerOptions);
}

function removeEventListener(node, type, listener) {
	node.removeEventListener(type, listener, eventListenerOptions);
}

function createEvent(type, chart, x, y, nativeEvent) {
	return {
		type: type,
		chart: chart,
		native: nativeEvent || null,
		x: x !== undefined ? x : null,
		y: y !== undefined ? y : null,
	};
}

function fromNativeEvent(event, chart) {
	var type = EVENT_TYPES[event.type] || event.type;
	var pos = helpers.getRelativePosition(event, chart);
	return createEvent(type, chart, pos.x, pos.y, event);
}

function throttled(fn, thisArg) {
	var ticking = false;
	var args = [];

	return function() {
		args = Array.prototype.slice.call(arguments);
		thisArg = thisArg || this;

		if (!ticking) {
			ticking = true;
			helpers.requestAnimFrame.call(window, function() {
				ticking = false;
				fn.apply(thisArg, args);
			});
		}
	};
}

// Implementation based on https://github.com/marcj/css-element-queries
function createResizer(handler) {
	var resizer = document.createElement('div');
	var cls = CSS_PREFIX + 'size-monitor';
	var maxSize = 1000000;
	var style =
		'position:absolute;' +
		'left:0;' +
		'top:0;' +
		'right:0;' +
		'bottom:0;' +
		'overflow:hidden;' +
		'pointer-events:none;' +
		'visibility:hidden;' +
		'z-index:-1;';

	resizer.style.cssText = style;
	resizer.className = cls;
	resizer.innerHTML =
		'<div class="' + cls + '-expand" style="' + style + '">' +
			'<div style="' +
				'position:absolute;' +
				'width:' + maxSize + 'px;' +
				'height:' + maxSize + 'px;' +
				'left:0;' +
				'top:0">' +
			'</div>' +
		'</div>' +
		'<div class="' + cls + '-shrink" style="' + style + '">' +
			'<div style="' +
				'position:absolute;' +
				'width:200%;' +
				'height:200%;' +
				'left:0; ' +
				'top:0">' +
			'</div>' +
		'</div>';

	var expand = resizer.childNodes[0];
	var shrink = resizer.childNodes[1];

	resizer._reset = function() {
		expand.scrollLeft = maxSize;
		expand.scrollTop = maxSize;
		shrink.scrollLeft = maxSize;
		shrink.scrollTop = maxSize;
	};
	var onScroll = function() {
		resizer._reset();
		handler();
	};

	addEventListener(expand, 'scroll', onScroll.bind(expand, 'expand'));
	addEventListener(shrink, 'scroll', onScroll.bind(shrink, 'shrink'));

	return resizer;
}

// https://davidwalsh.name/detect-node-insertion
function watchForRender(node, handler) {
	var expando = node[EXPANDO_KEY] || (node[EXPANDO_KEY] = {});
	var proxy = expando.renderProxy = function(e) {
		if (e.animationName === CSS_RENDER_ANIMATION) {
			handler();
		}
	};

	helpers.each(ANIMATION_START_EVENTS, function(type) {
		addEventListener(node, type, proxy);
	});

	// #4737: Chrome might skip the CSS animation when the CSS_RENDER_MONITOR class
	// is removed then added back immediately (same animation frame?). Accessing the
	// `offsetParent` property will force a reflow and re-evaluate the CSS animation.
	// https://gist.github.com/paulirish/5d52fb081b3570c81e3a#box-metrics
	// https://github.com/chartjs/Chart.js/issues/4737
	expando.reflow = !!node.offsetParent;

	node.classList.add(CSS_RENDER_MONITOR);
}

function unwatchForRender(node) {
	var expando = node[EXPANDO_KEY] || {};
	var proxy = expando.renderProxy;

	if (proxy) {
		helpers.each(ANIMATION_START_EVENTS, function(type) {
			removeEventListener(node, type, proxy);
		});

		delete expando.renderProxy;
	}

	node.classList.remove(CSS_RENDER_MONITOR);
}

function addResizeListener(node, listener, chart) {
	var expando = node[EXPANDO_KEY] || (node[EXPANDO_KEY] = {});

	// Let's keep track of this added resizer and thus avoid DOM query when removing it.
	var resizer = expando.resizer = createResizer(throttled(function() {
		if (expando.resizer) {
			return listener(createEvent('resize', chart));
		}
	}));

	// The resizer needs to be attached to the node parent, so we first need to be
	// sure that `node` is attached to the DOM before injecting the resizer element.
	watchForRender(node, function() {
		if (expando.resizer) {
			var container = node.parentNode;
			if (container && container !== resizer.parentNode) {
				container.insertBefore(resizer, container.firstChild);
			}

			// The container size might have changed, let's reset the resizer state.
			resizer._reset();
		}
	});
}

function removeResizeListener(node) {
	var expando = node[EXPANDO_KEY] || {};
	var resizer = expando.resizer;

	delete expando.resizer;
	unwatchForRender(node);

	if (resizer && resizer.parentNode) {
		resizer.parentNode.removeChild(resizer);
	}
}

function injectCSS(platform, css) {
	// http://stackoverflow.com/q/3922139
	var style = platform._style || document.createElement('style');
	if (!platform._style) {
		platform._style = style;
		css = '/* Chart.js */\n' + css;
		style.setAttribute('type', 'text/css');
		document.getElementsByTagName('head')[0].appendChild(style);
	}

	style.appendChild(document.createTextNode(css));
}

module.exports = {
	/**
	 * This property holds whether this platform is enabled for the current environment.
	 * Currently used by platform.js to select the proper implementation.
	 * @private
	 */
	_enabled: typeof window !== 'undefined' && typeof document !== 'undefined',

	initialize: function() {
		var keyframes = 'from{opacity:0.99}to{opacity:1}';

		injectCSS(this,
			// DOM rendering detection
			// https://davidwalsh.name/detect-node-insertion
			'@-webkit-keyframes ' + CSS_RENDER_ANIMATION + '{' + keyframes + '}' +
			'@keyframes ' + CSS_RENDER_ANIMATION + '{' + keyframes + '}' +
			'.' + CSS_RENDER_MONITOR + '{' +
				'-webkit-animation:' + CSS_RENDER_ANIMATION + ' 0.001s;' +
				'animation:' + CSS_RENDER_ANIMATION + ' 0.001s;' +
			'}'
		);
	},

	acquireContext: function(item, config) {
		if (typeof item === 'string') {
			item = document.getElementById(item);
		} else if (item.length) {
			// Support for array based queries (such as jQuery)
			item = item[0];
		}

		if (item && item.canvas) {
			// Support for any object associated to a canvas (including a context2d)
			item = item.canvas;
		}

		// To prevent canvas fingerprinting, some add-ons undefine the getContext
		// method, for example: https://github.com/kkapsner/CanvasBlocker
		// https://github.com/chartjs/Chart.js/issues/2807
		var context = item && item.getContext && item.getContext('2d');

		// `instanceof HTMLCanvasElement/CanvasRenderingContext2D` fails when the item is
		// inside an iframe or when running in a protected environment. We could guess the
		// types from their toString() value but let's keep things flexible and assume it's
		// a sufficient condition if the item has a context2D which has item as `canvas`.
		// https://github.com/chartjs/Chart.js/issues/3887
		// https://github.com/chartjs/Chart.js/issues/4102
		// https://github.com/chartjs/Chart.js/issues/4152
		if (context && context.canvas === item) {
			initCanvas(item, config);
			return context;
		}

		return null;
	},

	releaseContext: function(context) {
		var canvas = context.canvas;
		if (!canvas[EXPANDO_KEY]) {
			return;
		}

		var initial = canvas[EXPANDO_KEY].initial;
		['height', 'width'].forEach(function(prop) {
			var value = initial[prop];
			if (helpers.isNullOrUndef(value)) {
				canvas.removeAttribute(prop);
			} else {
				canvas.setAttribute(prop, value);
			}
		});

		helpers.each(initial.style || {}, function(value, key) {
			canvas.style[key] = value;
		});

		// The canvas render size might have been changed (and thus the state stack discarded),
		// we can't use save() and restore() to restore the initial state. So make sure that at
		// least the canvas context is reset to the default state by setting the canvas width.
		// https://www.w3.org/TR/2011/WD-html5-20110525/the-canvas-element.html
		canvas.width = canvas.width;

		delete canvas[EXPANDO_KEY];
	},

	addEventListener: function(chart, type, listener) {
		var canvas = chart.canvas;
		if (type === 'resize') {
			// Note: the resize event is not supported on all browsers.
			addResizeListener(canvas, listener, chart);
			return;
		}

		var expando = listener[EXPANDO_KEY] || (listener[EXPANDO_KEY] = {});
		var proxies = expando.proxies || (expando.proxies = {});
		var proxy = proxies[chart.id + '_' + type] = function(event) {
			listener(fromNativeEvent(event, chart));
		};

		addEventListener(canvas, type, proxy);
	},

	removeEventListener: function(chart, type, listener) {
		var canvas = chart.canvas;
		if (type === 'resize') {
			// Note: the resize event is not supported on all browsers.
			removeResizeListener(canvas, listener);
			return;
		}

		var expando = listener[EXPANDO_KEY] || {};
		var proxies = expando.proxies || {};
		var proxy = proxies[chart.id + '_' + type];
		if (!proxy) {
			return;
		}

		removeEventListener(canvas, type, proxy);
	}
};

// DEPRECATIONS

/**
 * Provided for backward compatibility, use EventTarget.addEventListener instead.
 * EventTarget.addEventListener compatibility: Chrome, Opera 7, Safari, FF1.5+, IE9+
 * @see https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
 * @function Chart.helpers.addEvent
 * @deprecated since version 2.7.0
 * @todo remove at version 3
 * @private
 */
helpers.addEvent = addEventListener;

/**
 * Provided for backward compatibility, use EventTarget.removeEventListener instead.
 * EventTarget.removeEventListener compatibility: Chrome, Opera 7, Safari, FF1.5+, IE9+
 * @see https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener
 * @function Chart.helpers.removeEvent
 * @deprecated since version 2.7.0
 * @todo remove at version 3
 * @private
 */
helpers.removeEvent = removeEventListener;

},{"45":45}],48:[function(require,module,exports){
'use strict';

var helpers = require(45);
var basic = require(46);
var dom = require(47);

// @TODO Make possible to select another platform at build time.
var implementation = dom._enabled ? dom : basic;

/**
 * @namespace Chart.platform
 * @see https://chartjs.gitbooks.io/proposals/content/Platform.html
 * @since 2.4.0
 */
module.exports = helpers.extend({
	/**
	 * @since 2.7.0
	 */
	initialize: function() {},

	/**
	 * Called at chart construction time, returns a context2d instance implementing
	 * the [W3C Canvas 2D Context API standard]{@link https://www.w3.org/TR/2dcontext/}.
	 * @param {*} item - The native item from which to acquire context (platform specific)
	 * @param {Object} options - The chart options
	 * @returns {CanvasRenderingContext2D} context2d instance
	 */
	acquireContext: function() {},

	/**
	 * Called at chart destruction time, releases any resources associated to the context
	 * previously returned by the acquireContext() method.
	 * @param {CanvasRenderingContext2D} context - The context2d instance
	 * @returns {Boolean} true if the method succeeded, else false
	 */
	releaseContext: function() {},

	/**
	 * Registers the specified listener on the given chart.
	 * @param {Chart} chart - Chart from which to listen for event
	 * @param {String} type - The ({@link IEvent}) type to listen for
	 * @param {Function} listener - Receives a notification (an object that implements
	 * the {@link IEvent} interface) when an event of the specified type occurs.
	 */
	addEventListener: function() {},

	/**
	 * Removes the specified listener previously registered with addEventListener.
	 * @param {Chart} chart -Chart from which to remove the listener
	 * @param {String} type - The ({@link IEvent}) type to remove
	 * @param {Function} listener - The listener function to remove from the event target.
	 */
	removeEventListener: function() {}

}, implementation);

/**
 * @interface IPlatform
 * Allows abstracting platform dependencies away from the chart
 * @borrows Chart.platform.acquireContext as acquireContext
 * @borrows Chart.platform.releaseContext as releaseContext
 * @borrows Chart.platform.addEventListener as addEventListener
 * @borrows Chart.platform.removeEventListener as removeEventListener
 */

/**
 * @interface IEvent
 * @prop {String} type - The event type name, possible values are:
 * 'contextmenu', 'mouseenter', 'mousedown', 'mousemove', 'mouseup', 'mouseout',
 * 'click', 'dblclick', 'keydown', 'keypress', 'keyup' and 'resize'
 * @prop {*} native - The original native event (null for emulated events, e.g. 'resize')
 * @prop {Number} x - The mouse x position, relative to the canvas (null for incompatible events)
 * @prop {Number} y - The mouse y position, relative to the canvas (null for incompatible events)
 */

},{"45":45,"46":46,"47":47}],49:[function(require,module,exports){
'use strict';

module.exports = {};
module.exports.filler = require(50);
module.exports.legend = require(51);
module.exports.title = require(52);

},{"50":50,"51":51,"52":52}],50:[function(require,module,exports){
/**
 * Plugin based on discussion from the following Chart.js issues:
 * @see https://github.com/chartjs/Chart.js/issues/2380#issuecomment-279961569
 * @see https://github.com/chartjs/Chart.js/issues/2440#issuecomment-256461897
 */

'use strict';

var defaults = require(25);
var elements = require(40);
var helpers = require(45);

defaults._set('global', {
	plugins: {
		filler: {
			propagate: true
		}
	}
});

var mappers = {
	dataset: function(source) {
		var index = source.fill;
		var chart = source.chart;
		var meta = chart.getDatasetMeta(index);
		var visible = meta && chart.isDatasetVisible(index);
		var points = (visible && meta.dataset._children) || [];
		var length = points.length || 0;

		return !length ? null : function(point, i) {
			return (i < length && points[i]._view) || null;
		};
	},

	boundary: function(source) {
		var boundary = source.boundary;
		var x = boundary ? boundary.x : null;
		var y = boundary ? boundary.y : null;

		return function(point) {
			return {
				x: x === null ? point.x : x,
				y: y === null ? point.y : y,
			};
		};
	}
};

// @todo if (fill[0] === '#')
function decodeFill(el, index, count) {
	var model = el._model || {};
	var fill = model.fill;
	var target;

	if (fill === undefined) {
		fill = !!model.backgroundColor;
	}

	if (fill === false || fill === null) {
		return false;
	}

	if (fill === true) {
		return 'origin';
	}

	target = parseFloat(fill, 10);
	if (isFinite(target) && Math.floor(target) === target) {
		if (fill[0] === '-' || fill[0] === '+') {
			target = index + target;
		}

		if (target === index || target < 0 || target >= count) {
			return false;
		}

		return target;
	}

	switch (fill) {
	// compatibility
	case 'bottom':
		return 'start';
	case 'top':
		return 'end';
	case 'zero':
		return 'origin';
	// supported boundaries
	case 'origin':
	case 'start':
	case 'end':
		return fill;
	// invalid fill values
	default:
		return false;
	}
}

function computeBoundary(source) {
	var model = source.el._model || {};
	var scale = source.el._scale || {};
	var fill = source.fill;
	var target = null;
	var horizontal;

	if (isFinite(fill)) {
		return null;
	}

	// Backward compatibility: until v3, we still need to support boundary values set on
	// the model (scaleTop, scaleBottom and scaleZero) because some external plugins and
	// controllers might still use it (e.g. the Smith chart).

	if (fill === 'start') {
		target = model.scaleBottom === undefined ? scale.bottom : model.scaleBottom;
	} else if (fill === 'end') {
		target = model.scaleTop === undefined ? scale.top : model.scaleTop;
	} else if (model.scaleZero !== undefined) {
		target = model.scaleZero;
	} else if (scale.getBasePosition) {
		target = scale.getBasePosition();
	} else if (scale.getBasePixel) {
		target = scale.getBasePixel();
	}

	if (target !== undefined && target !== null) {
		if (target.x !== undefined && target.y !== undefined) {
			return target;
		}

		if (typeof target === 'number' && isFinite(target)) {
			horizontal = scale.isHorizontal();
			return {
				x: horizontal ? target : null,
				y: horizontal ? null : target
			};
		}
	}

	return null;
}

function resolveTarget(sources, index, propagate) {
	var source = sources[index];
	var fill = source.fill;
	var visited = [index];
	var target;

	if (!propagate) {
		return fill;
	}

	while (fill !== false && visited.indexOf(fill) === -1) {
		if (!isFinite(fill)) {
			return fill;
		}

		target = sources[fill];
		if (!target) {
			return false;
		}

		if (target.visible) {
			return fill;
		}

		visited.push(fill);
		fill = target.fill;
	}

	return false;
}

function createMapper(source) {
	var fill = source.fill;
	var type = 'dataset';

	if (fill === false) {
		return null;
	}

	if (!isFinite(fill)) {
		type = 'boundary';
	}

	return mappers[type](source);
}

function isDrawable(point) {
	return point && !point.skip;
}

function drawArea(ctx, curve0, curve1, len0, len1) {
	var i;

	if (!len0 || !len1) {
		return;
	}

	// building first area curve (normal)
	ctx.moveTo(curve0[0].x, curve0[0].y);
	for (i = 1; i < len0; ++i) {
		helpers.canvas.lineTo(ctx, curve0[i - 1], curve0[i]);
	}

	// joining the two area curves
	ctx.lineTo(curve1[len1 - 1].x, curve1[len1 - 1].y);

	// building opposite area curve (reverse)
	for (i = len1 - 1; i > 0; --i) {
		helpers.canvas.lineTo(ctx, curve1[i], curve1[i - 1], true);
	}
}

function doFill(ctx, points, mapper, view, color, loop) {
	var count = points.length;
	var span = view.spanGaps;
	var curve0 = [];
	var curve1 = [];
	var len0 = 0;
	var len1 = 0;
	var i, ilen, index, p0, p1, d0, d1;

	ctx.beginPath();

	for (i = 0, ilen = (count + !!loop); i < ilen; ++i) {
		index = i % count;
		p0 = points[index]._view;
		p1 = mapper(p0, index, view);
		d0 = isDrawable(p0);
		d1 = isDrawable(p1);

		if (d0 && d1) {
			len0 = curve0.push(p0);
			len1 = curve1.push(p1);
		} else if (len0 && len1) {
			if (!span) {
				drawArea(ctx, curve0, curve1, len0, len1);
				len0 = len1 = 0;
				curve0 = [];
				curve1 = [];
			} else {
				if (d0) {
					curve0.push(p0);
				}
				if (d1) {
					curve1.push(p1);
				}
			}
		}
	}

	drawArea(ctx, curve0, curve1, len0, len1);

	ctx.closePath();
	ctx.fillStyle = color;
	ctx.fill();
}

module.exports = {
	id: 'filler',

	afterDatasetsUpdate: function(chart, options) {
		var count = (chart.data.datasets || []).length;
		var propagate = options.propagate;
		var sources = [];
		var meta, i, el, source;

		for (i = 0; i < count; ++i) {
			meta = chart.getDatasetMeta(i);
			el = meta.dataset;
			source = null;

			if (el && el._model && el instanceof elements.Line) {
				source = {
					visible: chart.isDatasetVisible(i),
					fill: decodeFill(el, i, count),
					chart: chart,
					el: el
				};
			}

			meta.$filler = source;
			sources.push(source);
		}

		for (i = 0; i < count; ++i) {
			source = sources[i];
			if (!source) {
				continue;
			}

			source.fill = resolveTarget(sources, i, propagate);
			source.boundary = computeBoundary(source);
			source.mapper = createMapper(source);
		}
	},

	beforeDatasetDraw: function(chart, args) {
		var meta = args.meta.$filler;
		if (!meta) {
			return;
		}

		var ctx = chart.ctx;
		var el = meta.el;
		var view = el._view;
		var points = el._children || [];
		var mapper = meta.mapper;
		var color = view.backgroundColor || defaults.global.defaultColor;

		if (mapper && color && points.length) {
			helpers.canvas.clipArea(ctx, chart.chartArea);
			doFill(ctx, points, mapper, view, color, el._loop);
			helpers.canvas.unclipArea(ctx);
		}
	}
};

},{"25":25,"40":40,"45":45}],51:[function(require,module,exports){
'use strict';

var defaults = require(25);
var Element = require(26);
var helpers = require(45);
var layouts = require(30);

var noop = helpers.noop;

defaults._set('global', {
	legend: {
		display: true,
		position: 'top',
		fullWidth: true,
		reverse: false,
		weight: 1000,

		// a callback that will handle
		onClick: function(e, legendItem) {
			var index = legendItem.datasetIndex;
			var ci = this.chart;
			var meta = ci.getDatasetMeta(index);

			// See controller.isDatasetVisible comment
			meta.hidden = meta.hidden === null ? !ci.data.datasets[index].hidden : null;

			// We hid a dataset ... rerender the chart
			ci.update();
		},

		onHover: null,

		labels: {
			boxWidth: 40,
			padding: 10,
			// Generates labels shown in the legend
			// Valid properties to return:
			// text : text to display
			// fillStyle : fill of coloured box
			// strokeStyle: stroke of coloured box
			// hidden : if this legend item refers to a hidden item
			// lineCap : cap style for line
			// lineDash
			// lineDashOffset :
			// lineJoin :
			// lineWidth :
			generateLabels: function(chart) {
				var data = chart.data;
				return helpers.isArray(data.datasets) ? data.datasets.map(function(dataset, i) {
					return {
						text: dataset.label,
						fillStyle: (!helpers.isArray(dataset.backgroundColor) ? dataset.backgroundColor : dataset.backgroundColor[0]),
						hidden: !chart.isDatasetVisible(i),
						lineCap: dataset.borderCapStyle,
						lineDash: dataset.borderDash,
						lineDashOffset: dataset.borderDashOffset,
						lineJoin: dataset.borderJoinStyle,
						lineWidth: dataset.borderWidth,
						strokeStyle: dataset.borderColor,
						pointStyle: dataset.pointStyle,

						// Below is extra data used for toggling the datasets
						datasetIndex: i
					};
				}, this) : [];
			}
		}
	},

	legendCallback: function(chart) {
		var text = [];
		text.push('<ul class="' + chart.id + '-legend">');
		for (var i = 0; i < chart.data.datasets.length; i++) {
			text.push('<li><span style="background-color:' + chart.data.datasets[i].backgroundColor + '"></span>');
			if (chart.data.datasets[i].label) {
				text.push(chart.data.datasets[i].label);
			}
			text.push('</li>');
		}
		text.push('</ul>');
		return text.join('');
	}
});

/**
 * Helper function to get the box width based on the usePointStyle option
 * @param labelopts {Object} the label options on the legend
 * @param fontSize {Number} the label font size
 * @return {Number} width of the color box area
 */
function getBoxWidth(labelOpts, fontSize) {
	return labelOpts.usePointStyle ?
		fontSize * Math.SQRT2 :
		labelOpts.boxWidth;
}

/**
 * IMPORTANT: this class is exposed publicly as Chart.Legend, backward compatibility required!
 */
var Legend = Element.extend({

	initialize: function(config) {
		helpers.extend(this, config);

		// Contains hit boxes for each dataset (in dataset order)
		this.legendHitBoxes = [];

		// Are we in doughnut mode which has a different data type
		this.doughnutMode = false;
	},

	// These methods are ordered by lifecycle. Utilities then follow.
	// Any function defined here is inherited by all legend types.
	// Any function can be extended by the legend type

	beforeUpdate: noop,
	update: function(maxWidth, maxHeight, margins) {
		var me = this;

		// Update Lifecycle - Probably don't want to ever extend or overwrite this function ;)
		me.beforeUpdate();

		// Absorb the master measurements
		me.maxWidth = maxWidth;
		me.maxHeight = maxHeight;
		me.margins = margins;

		// Dimensions
		me.beforeSetDimensions();
		me.setDimensions();
		me.afterSetDimensions();
		// Labels
		me.beforeBuildLabels();
		me.buildLabels();
		me.afterBuildLabels();

		// Fit
		me.beforeFit();
		me.fit();
		me.afterFit();
		//
		me.afterUpdate();

		return me.minSize;
	},
	afterUpdate: noop,

	//

	beforeSetDimensions: noop,
	setDimensions: function() {
		var me = this;
		// Set the unconstrained dimension before label rotation
		if (me.isHorizontal()) {
			// Reset position before calculating rotation
			me.width = me.maxWidth;
			me.left = 0;
			me.right = me.width;
		} else {
			me.height = me.maxHeight;

			// Reset position before calculating rotation
			me.top = 0;
			me.bottom = me.height;
		}

		// Reset padding
		me.paddingLeft = 0;
		me.paddingTop = 0;
		me.paddingRight = 0;
		me.paddingBottom = 0;

		// Reset minSize
		me.minSize = {
			width: 0,
			height: 0
		};
	},
	afterSetDimensions: noop,

	//

	beforeBuildLabels: noop,
	buildLabels: function() {
		var me = this;
		var labelOpts = me.options.labels || {};
		var legendItems = helpers.callback(labelOpts.generateLabels, [me.chart], me) || [];

		if (labelOpts.filter) {
			legendItems = legendItems.filter(function(item) {
				return labelOpts.filter(item, me.chart.data);
			});
		}

		if (me.options.reverse) {
			legendItems.reverse();
		}

		me.legendItems = legendItems;
	},
	afterBuildLabels: noop,

	//

	beforeFit: noop,
	fit: function() {
		var me = this;
		var opts = me.options;
		var labelOpts = opts.labels;
		var display = opts.display;

		var ctx = me.ctx;

		var globalDefault = defaults.global;
		var valueOrDefault = helpers.valueOrDefault;
		var fontSize = valueOrDefault(labelOpts.fontSize, globalDefault.defaultFontSize);
		var fontStyle = valueOrDefault(labelOpts.fontStyle, globalDefault.defaultFontStyle);
		var fontFamily = valueOrDefault(labelOpts.fontFamily, globalDefault.defaultFontFamily);
		var labelFont = helpers.fontString(fontSize, fontStyle, fontFamily);

		// Reset hit boxes
		var hitboxes = me.legendHitBoxes = [];

		var minSize = me.minSize;
		var isHorizontal = me.isHorizontal();

		if (isHorizontal) {
			minSize.width = me.maxWidth; // fill all the width
			minSize.height = display ? 10 : 0;
		} else {
			minSize.width = display ? 10 : 0;
			minSize.height = me.maxHeight; // fill all the height
		}

		// Increase sizes here
		if (display) {
			ctx.font = labelFont;

			if (isHorizontal) {
				// Labels

				// Width of each line of legend boxes. Labels wrap onto multiple lines when there are too many to fit on one
				var lineWidths = me.lineWidths = [0];
				var totalHeight = me.legendItems.length ? fontSize + (labelOpts.padding) : 0;

				ctx.textAlign = 'left';
				ctx.textBaseline = 'top';

				helpers.each(me.legendItems, function(legendItem, i) {
					var boxWidth = getBoxWidth(labelOpts, fontSize);
					var width = boxWidth + (fontSize / 2) + ctx.measureText(legendItem.text).width;

					if (lineWidths[lineWidths.length - 1] + width + labelOpts.padding >= me.width) {
						totalHeight += fontSize + (labelOpts.padding);
						lineWidths[lineWidths.length] = me.left;
					}

					// Store the hitbox width and height here. Final position will be updated in `draw`
					hitboxes[i] = {
						left: 0,
						top: 0,
						width: width,
						height: fontSize
					};

					lineWidths[lineWidths.length - 1] += width + labelOpts.padding;
				});

				minSize.height += totalHeight;

			} else {
				var vPadding = labelOpts.padding;
				var columnWidths = me.columnWidths = [];
				var totalWidth = labelOpts.padding;
				var currentColWidth = 0;
				var currentColHeight = 0;
				var itemHeight = fontSize + vPadding;

				helpers.each(me.legendItems, function(legendItem, i) {
					var boxWidth = getBoxWidth(labelOpts, fontSize);
					var itemWidth = boxWidth + (fontSize / 2) + ctx.measureText(legendItem.text).width;

					// If too tall, go to new column
					if (currentColHeight + itemHeight > minSize.height) {
						totalWidth += currentColWidth + labelOpts.padding;
						columnWidths.push(currentColWidth); // previous column width

						currentColWidth = 0;
						currentColHeight = 0;
					}

					// Get max width
					currentColWidth = Math.max(currentColWidth, itemWidth);
					currentColHeight += itemHeight;

					// Store the hitbox width and height here. Final position will be updated in `draw`
					hitboxes[i] = {
						left: 0,
						top: 0,
						width: itemWidth,
						height: fontSize
					};
				});

				totalWidth += currentColWidth;
				columnWidths.push(currentColWidth);
				minSize.width += totalWidth;
			}
		}

		me.width = minSize.width;
		me.height = minSize.height;
	},
	afterFit: noop,

	// Shared Methods
	isHorizontal: function() {
		return this.options.position === 'top' || this.options.position === 'bottom';
	},

	// Actually draw the legend on the canvas
	draw: function() {
		var me = this;
		var opts = me.options;
		var labelOpts = opts.labels;
		var globalDefault = defaults.global;
		var lineDefault = globalDefault.elements.line;
		var legendWidth = me.width;
		var lineWidths = me.lineWidths;

		if (opts.display) {
			var ctx = me.ctx;
			var valueOrDefault = helpers.valueOrDefault;
			var fontColor = valueOrDefault(labelOpts.fontColor, globalDefault.defaultFontColor);
			var fontSize = valueOrDefault(labelOpts.fontSize, globalDefault.defaultFontSize);
			var fontStyle = valueOrDefault(labelOpts.fontStyle, globalDefault.defaultFontStyle);
			var fontFamily = valueOrDefault(labelOpts.fontFamily, globalDefault.defaultFontFamily);
			var labelFont = helpers.fontString(fontSize, fontStyle, fontFamily);
			var cursor;

			// Canvas setup
			ctx.textAlign = 'left';
			ctx.textBaseline = 'middle';
			ctx.lineWidth = 0.5;
			ctx.strokeStyle = fontColor; // for strikethrough effect
			ctx.fillStyle = fontColor; // render in correct colour
			ctx.font = labelFont;

			var boxWidth = getBoxWidth(labelOpts, fontSize);
			var hitboxes = me.legendHitBoxes;

			// current position
			var drawLegendBox = function(x, y, legendItem) {
				if (isNaN(boxWidth) || boxWidth <= 0) {
					return;
				}

				// Set the ctx for the box
				ctx.save();

				ctx.fillStyle = valueOrDefault(legendItem.fillStyle, globalDefault.defaultColor);
				ctx.lineCap = valueOrDefault(legendItem.lineCap, lineDefault.borderCapStyle);
				ctx.lineDashOffset = valueOrDefault(legendItem.lineDashOffset, lineDefault.borderDashOffset);
				ctx.lineJoin = valueOrDefault(legendItem.lineJoin, lineDefault.borderJoinStyle);
				ctx.lineWidth = valueOrDefault(legendItem.lineWidth, lineDefault.borderWidth);
				ctx.strokeStyle = valueOrDefault(legendItem.strokeStyle, globalDefault.defaultColor);
				var isLineWidthZero = (valueOrDefault(legendItem.lineWidth, lineDefault.borderWidth) === 0);

				if (ctx.setLineDash) {
					// IE 9 and 10 do not support line dash
					ctx.setLineDash(valueOrDefault(legendItem.lineDash, lineDefault.borderDash));
				}

				if (opts.labels && opts.labels.usePointStyle) {
					// Recalculate x and y for drawPoint() because its expecting
					// x and y to be center of figure (instead of top left)
					var radius = fontSize * Math.SQRT2 / 2;
					var offSet = radius / Math.SQRT2;
					var centerX = x + offSet;
					var centerY = y + offSet;

					// Draw pointStyle as legend symbol
					helpers.canvas.drawPoint(ctx, legendItem.pointStyle, radius, centerX, centerY);
				} else {
					// Draw box as legend symbol
					if (!isLineWidthZero) {
						ctx.strokeRect(x, y, boxWidth, fontSize);
					}
					ctx.fillRect(x, y, boxWidth, fontSize);
				}

				ctx.restore();
			};
			var fillText = function(x, y, legendItem, textWidth) {
				var halfFontSize = fontSize / 2;
				var xLeft = boxWidth + halfFontSize + x;
				var yMiddle = y + halfFontSize;

				ctx.fillText(legendItem.text, xLeft, yMiddle);

				if (legendItem.hidden) {
					// Strikethrough the text if hidden
					ctx.beginPath();
					ctx.lineWidth = 2;
					ctx.moveTo(xLeft, yMiddle);
					ctx.lineTo(xLeft + textWidth, yMiddle);
					ctx.stroke();
				}
			};

			// Horizontal
			var isHorizontal = me.isHorizontal();
			if (isHorizontal) {
				cursor = {
					x: me.left + ((legendWidth - lineWidths[0]) / 2),
					y: me.top + labelOpts.padding,
					line: 0
				};
			} else {
				cursor = {
					x: me.left + labelOpts.padding,
					y: me.top + labelOpts.padding,
					line: 0
				};
			}

			var itemHeight = fontSize + labelOpts.padding;
			helpers.each(me.legendItems, function(legendItem, i) {
				var textWidth = ctx.measureText(legendItem.text).width;
				var width = boxWidth + (fontSize / 2) + textWidth;
				var x = cursor.x;
				var y = cursor.y;

				if (isHorizontal) {
					if (x + width >= legendWidth) {
						y = cursor.y += itemHeight;
						cursor.line++;
						x = cursor.x = me.left + ((legendWidth - lineWidths[cursor.line]) / 2);
					}
				} else if (y + itemHeight > me.bottom) {
					x = cursor.x = x + me.columnWidths[cursor.line] + labelOpts.padding;
					y = cursor.y = me.top + labelOpts.padding;
					cursor.line++;
				}

				drawLegendBox(x, y, legendItem);

				hitboxes[i].left = x;
				hitboxes[i].top = y;

				// Fill the actual label
				fillText(x, y, legendItem, textWidth);

				if (isHorizontal) {
					cursor.x += width + (labelOpts.padding);
				} else {
					cursor.y += itemHeight;
				}

			});
		}
	},

	/**
	 * Handle an event
	 * @private
	 * @param {IEvent} event - The event to handle
	 * @return {Boolean} true if a change occured
	 */
	handleEvent: function(e) {
		var me = this;
		var opts = me.options;
		var type = e.type === 'mouseup' ? 'click' : e.type;
		var changed = false;

		if (type === 'mousemove') {
			if (!opts.onHover) {
				return;
			}
		} else if (type === 'click') {
			if (!opts.onClick) {
				return;
			}
		} else {
			return;
		}

		// Chart event already has relative position in it
		var x = e.x;
		var y = e.y;

		if (x >= me.left && x <= me.right && y >= me.top && y <= me.bottom) {
			// See if we are touching one of the dataset boxes
			var lh = me.legendHitBoxes;
			for (var i = 0; i < lh.length; ++i) {
				var hitBox = lh[i];

				if (x >= hitBox.left && x <= hitBox.left + hitBox.width && y >= hitBox.top && y <= hitBox.top + hitBox.height) {
					// Touching an element
					if (type === 'click') {
						// use e.native for backwards compatibility
						opts.onClick.call(me, e.native, me.legendItems[i]);
						changed = true;
						break;
					} else if (type === 'mousemove') {
						// use e.native for backwards compatibility
						opts.onHover.call(me, e.native, me.legendItems[i]);
						changed = true;
						break;
					}
				}
			}
		}

		return changed;
	}
});

function createNewLegendAndAttach(chart, legendOpts) {
	var legend = new Legend({
		ctx: chart.ctx,
		options: legendOpts,
		chart: chart
	});

	layouts.configure(chart, legend, legendOpts);
	layouts.addBox(chart, legend);
	chart.legend = legend;
}

module.exports = {
	id: 'legend',

	/**
	 * Backward compatibility: since 2.1.5, the legend is registered as a plugin, making
	 * Chart.Legend obsolete. To avoid a breaking change, we export the Legend as part of
	 * the plugin, which one will be re-exposed in the chart.js file.
	 * https://github.com/chartjs/Chart.js/pull/2640
	 * @private
	 */
	_element: Legend,

	beforeInit: function(chart) {
		var legendOpts = chart.options.legend;

		if (legendOpts) {
			createNewLegendAndAttach(chart, legendOpts);
		}
	},

	beforeUpdate: function(chart) {
		var legendOpts = chart.options.legend;
		var legend = chart.legend;

		if (legendOpts) {
			helpers.mergeIf(legendOpts, defaults.global.legend);

			if (legend) {
				layouts.configure(chart, legend, legendOpts);
				legend.options = legendOpts;
			} else {
				createNewLegendAndAttach(chart, legendOpts);
			}
		} else if (legend) {
			layouts.removeBox(chart, legend);
			delete chart.legend;
		}
	},

	afterEvent: function(chart, e) {
		var legend = chart.legend;
		if (legend) {
			legend.handleEvent(e);
		}
	}
};

},{"25":25,"26":26,"30":30,"45":45}],52:[function(require,module,exports){
'use strict';

var defaults = require(25);
var Element = require(26);
var helpers = require(45);
var layouts = require(30);

var noop = helpers.noop;

defaults._set('global', {
	title: {
		display: false,
		fontStyle: 'bold',
		fullWidth: true,
		lineHeight: 1.2,
		padding: 10,
		position: 'top',
		text: '',
		weight: 2000         // by default greater than legend (1000) to be above
	}
});

/**
 * IMPORTANT: this class is exposed publicly as Chart.Legend, backward compatibility required!
 */
var Title = Element.extend({
	initialize: function(config) {
		var me = this;
		helpers.extend(me, config);

		// Contains hit boxes for each dataset (in dataset order)
		me.legendHitBoxes = [];
	},

	// These methods are ordered by lifecycle. Utilities then follow.

	beforeUpdate: noop,
	update: function(maxWidth, maxHeight, margins) {
		var me = this;

		// Update Lifecycle - Probably don't want to ever extend or overwrite this function ;)
		me.beforeUpdate();

		// Absorb the master measurements
		me.maxWidth = maxWidth;
		me.maxHeight = maxHeight;
		me.margins = margins;

		// Dimensions
		me.beforeSetDimensions();
		me.setDimensions();
		me.afterSetDimensions();
		// Labels
		me.beforeBuildLabels();
		me.buildLabels();
		me.afterBuildLabels();

		// Fit
		me.beforeFit();
		me.fit();
		me.afterFit();
		//
		me.afterUpdate();

		return me.minSize;

	},
	afterUpdate: noop,

	//

	beforeSetDimensions: noop,
	setDimensions: function() {
		var me = this;
		// Set the unconstrained dimension before label rotation
		if (me.isHorizontal()) {
			// Reset position before calculating rotation
			me.width = me.maxWidth;
			me.left = 0;
			me.right = me.width;
		} else {
			me.height = me.maxHeight;

			// Reset position before calculating rotation
			me.top = 0;
			me.bottom = me.height;
		}

		// Reset padding
		me.paddingLeft = 0;
		me.paddingTop = 0;
		me.paddingRight = 0;
		me.paddingBottom = 0;

		// Reset minSize
		me.minSize = {
			width: 0,
			height: 0
		};
	},
	afterSetDimensions: noop,

	//

	beforeBuildLabels: noop,
	buildLabels: noop,
	afterBuildLabels: noop,

	//

	beforeFit: noop,
	fit: function() {
		var me = this;
		var valueOrDefault = helpers.valueOrDefault;
		var opts = me.options;
		var display = opts.display;
		var fontSize = valueOrDefault(opts.fontSize, defaults.global.defaultFontSize);
		var minSize = me.minSize;
		var lineCount = helpers.isArray(opts.text) ? opts.text.length : 1;
		var lineHeight = helpers.options.toLineHeight(opts.lineHeight, fontSize);
		var textSize = display ? (lineCount * lineHeight) + (opts.padding * 2) : 0;

		if (me.isHorizontal()) {
			minSize.width = me.maxWidth; // fill all the width
			minSize.height = textSize;
		} else {
			minSize.width = textSize;
			minSize.height = me.maxHeight; // fill all the height
		}

		me.width = minSize.width;
		me.height = minSize.height;

	},
	afterFit: noop,

	// Shared Methods
	isHorizontal: function() {
		var pos = this.options.position;
		return pos === 'top' || pos === 'bottom';
	},

	// Actually draw the title block on the canvas
	draw: function() {
		var me = this;
		var ctx = me.ctx;
		var valueOrDefault = helpers.valueOrDefault;
		var opts = me.options;
		var globalDefaults = defaults.global;

		if (opts.display) {
			var fontSize = valueOrDefault(opts.fontSize, globalDefaults.defaultFontSize);
			var fontStyle = valueOrDefault(opts.fontStyle, globalDefaults.defaultFontStyle);
			var fontFamily = valueOrDefault(opts.fontFamily, globalDefaults.defaultFontFamily);
			var titleFont = helpers.fontString(fontSize, fontStyle, fontFamily);
			var lineHeight = helpers.options.toLineHeight(opts.lineHeight, fontSize);
			var offset = lineHeight / 2 + opts.padding;
			var rotation = 0;
			var top = me.top;
			var left = me.left;
			var bottom = me.bottom;
			var right = me.right;
			var maxWidth, titleX, titleY;

			ctx.fillStyle = valueOrDefault(opts.fontColor, globalDefaults.defaultFontColor); // render in correct colour
			ctx.font = titleFont;

			// Horizontal
			if (me.isHorizontal()) {
				titleX = left + ((right - left) / 2); // midpoint of the width
				titleY = top + offset;
				maxWidth = right - left;
			} else {
				titleX = opts.position === 'left' ? left + offset : right - offset;
				titleY = top + ((bottom - top) / 2);
				maxWidth = bottom - top;
				rotation = Math.PI * (opts.position === 'left' ? -0.5 : 0.5);
			}

			ctx.save();
			ctx.translate(titleX, titleY);
			ctx.rotate(rotation);
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';

			var text = opts.text;
			if (helpers.isArray(text)) {
				var y = 0;
				for (var i = 0; i < text.length; ++i) {
					ctx.fillText(text[i], 0, y, maxWidth);
					y += lineHeight;
				}
			} else {
				ctx.fillText(text, 0, 0, maxWidth);
			}

			ctx.restore();
		}
	}
});

function createNewTitleBlockAndAttach(chart, titleOpts) {
	var title = new Title({
		ctx: chart.ctx,
		options: titleOpts,
		chart: chart
	});

	layouts.configure(chart, title, titleOpts);
	layouts.addBox(chart, title);
	chart.titleBlock = title;
}

module.exports = {
	id: 'title',

	/**
	 * Backward compatibility: since 2.1.5, the title is registered as a plugin, making
	 * Chart.Title obsolete. To avoid a breaking change, we export the Title as part of
	 * the plugin, which one will be re-exposed in the chart.js file.
	 * https://github.com/chartjs/Chart.js/pull/2640
	 * @private
	 */
	_element: Title,

	beforeInit: function(chart) {
		var titleOpts = chart.options.title;

		if (titleOpts) {
			createNewTitleBlockAndAttach(chart, titleOpts);
		}
	},

	beforeUpdate: function(chart) {
		var titleOpts = chart.options.title;
		var titleBlock = chart.titleBlock;

		if (titleOpts) {
			helpers.mergeIf(titleOpts, defaults.global.title);

			if (titleBlock) {
				layouts.configure(chart, titleBlock, titleOpts);
				titleBlock.options = titleOpts;
			} else {
				createNewTitleBlockAndAttach(chart, titleOpts);
			}
		} else if (titleBlock) {
			layouts.removeBox(chart, titleBlock);
			delete chart.titleBlock;
		}
	}
};

},{"25":25,"26":26,"30":30,"45":45}],53:[function(require,module,exports){
'use strict';

module.exports = function(Chart) {

	// Default config for a category scale
	var defaultConfig = {
		position: 'bottom'
	};

	var DatasetScale = Chart.Scale.extend({
		/**
		* Internal function to get the correct labels. If data.xLabels or data.yLabels are defined, use those
		* else fall back to data.labels
		* @private
		*/
		getLabels: function() {
			var data = this.chart.data;
			return this.options.labels || (this.isHorizontal() ? data.xLabels : data.yLabels) || data.labels;
		},

		determineDataLimits: function() {
			var me = this;
			var labels = me.getLabels();
			me.minIndex = 0;
			me.maxIndex = labels.length - 1;
			var findIndex;

			if (me.options.ticks.min !== undefined) {
				// user specified min value
				findIndex = labels.indexOf(me.options.ticks.min);
				me.minIndex = findIndex !== -1 ? findIndex : me.minIndex;
			}

			if (me.options.ticks.max !== undefined) {
				// user specified max value
				findIndex = labels.indexOf(me.options.ticks.max);
				me.maxIndex = findIndex !== -1 ? findIndex : me.maxIndex;
			}

			me.min = labels[me.minIndex];
			me.max = labels[me.maxIndex];
		},

		buildTicks: function() {
			var me = this;
			var labels = me.getLabels();
			// If we are viewing some subset of labels, slice the original array
			me.ticks = (me.minIndex === 0 && me.maxIndex === labels.length - 1) ? labels : labels.slice(me.minIndex, me.maxIndex + 1);
		},

		getLabelForIndex: function(index, datasetIndex) {
			var me = this;
			var data = me.chart.data;
			var isHorizontal = me.isHorizontal();

			if (data.yLabels && !isHorizontal) {
				return me.getRightValue(data.datasets[datasetIndex].data[index]);
			}
			return me.ticks[index - me.minIndex];
		},

		// Used to get data value locations.  Value can either be an index or a numerical value
		getPixelForValue: function(value, index) {
			var me = this;
			var offset = me.options.offset;
			// 1 is added because we need the length but we have the indexes
			var offsetAmt = Math.max((me.maxIndex + 1 - me.minIndex - (offset ? 0 : 1)), 1);

			// If value is a data object, then index is the index in the data array,
			// not the index of the scale. We need to change that.
			var valueCategory;
			if (value !== undefined && value !== null) {
				valueCategory = me.isHorizontal() ? value.x : value.y;
			}
			if (valueCategory !== undefined || (value !== undefined && isNaN(index))) {
				var labels = me.getLabels();
				value = valueCategory || value;
				var idx = labels.indexOf(value);
				index = idx !== -1 ? idx : index;
			}

			if (me.isHorizontal()) {
				var valueWidth = me.width / offsetAmt;
				var widthOffset = (valueWidth * (index - me.minIndex));

				if (offset) {
					widthOffset += (valueWidth / 2);
				}

				return me.left + Math.round(widthOffset);
			}
			var valueHeight = me.height / offsetAmt;
			var heightOffset = (valueHeight * (index - me.minIndex));

			if (offset) {
				heightOffset += (valueHeight / 2);
			}

			return me.top + Math.round(heightOffset);
		},
		getPixelForTick: function(index) {
			return this.getPixelForValue(this.ticks[index], index + this.minIndex, null);
		},
		getValueForPixel: function(pixel) {
			var me = this;
			var offset = me.options.offset;
			var value;
			var offsetAmt = Math.max((me._ticks.length - (offset ? 0 : 1)), 1);
			var horz = me.isHorizontal();
			var valueDimension = (horz ? me.width : me.height) / offsetAmt;

			pixel -= horz ? me.left : me.top;

			if (offset) {
				pixel -= (valueDimension / 2);
			}

			if (pixel <= 0) {
				value = 0;
			} else {
				value = Math.round(pixel / valueDimension);
			}

			return value + me.minIndex;
		},
		getBasePixel: function() {
			return this.bottom;
		}
	});

	Chart.scaleService.registerScaleType('category', DatasetScale, defaultConfig);

};

},{}],54:[function(require,module,exports){
'use strict';

var defaults = require(25);
var helpers = require(45);
var Ticks = require(34);

module.exports = function(Chart) {

	var defaultConfig = {
		position: 'left',
		ticks: {
			callback: Ticks.formatters.linear
		}
	};

	var LinearScale = Chart.LinearScaleBase.extend({

		determineDataLimits: function() {
			var me = this;
			var opts = me.options;
			var chart = me.chart;
			var data = chart.data;
			var datasets = data.datasets;
			var isHorizontal = me.isHorizontal();
			var DEFAULT_MIN = 0;
			var DEFAULT_MAX = 1;

			function IDMatches(meta) {
				return isHorizontal ? meta.xAxisID === me.id : meta.yAxisID === me.id;
			}

			// First Calculate the range
			me.min = null;
			me.max = null;

			var hasStacks = opts.stacked;
			if (hasStacks === undefined) {
				helpers.each(datasets, function(dataset, datasetIndex) {
					if (hasStacks) {
						return;
					}

					var meta = chart.getDatasetMeta(datasetIndex);
					if (chart.isDatasetVisible(datasetIndex) && IDMatches(meta) &&
						meta.stack !== undefined) {
						hasStacks = true;
					}
				});
			}

			if (opts.stacked || hasStacks) {
				var valuesPerStack = {};

				helpers.each(datasets, function(dataset, datasetIndex) {
					var meta = chart.getDatasetMeta(datasetIndex);
					var key = [
						meta.type,
						// we have a separate stack for stack=undefined datasets when the opts.stacked is undefined
						((opts.stacked === undefined && meta.stack === undefined) ? datasetIndex : ''),
						meta.stack
					].join('.');

					if (valuesPerStack[key] === undefined) {
						valuesPerStack[key] = {
							positiveValues: [],
							negativeValues: []
						};
					}

					// Store these per type
					var positiveValues = valuesPerStack[key].positiveValues;
					var negativeValues = valuesPerStack[key].negativeValues;

					if (chart.isDatasetVisible(datasetIndex) && IDMatches(meta)) {
						helpers.each(dataset.data, function(rawValue, index) {
							var value = +me.getRightValue(rawValue);
							if (isNaN(value) || meta.data[index].hidden) {
								return;
							}

							positiveValues[index] = positiveValues[index] || 0;
							negativeValues[index] = negativeValues[index] || 0;

							if (opts.relativePoints) {
								positiveValues[index] = 100;
							} else if (value < 0) {
								negativeValues[index] += value;
							} else {
								positiveValues[index] += value;
							}
						});
					}
				});

				helpers.each(valuesPerStack, function(valuesForType) {
					var values = valuesForType.positiveValues.concat(valuesForType.negativeValues);
					var minVal = helpers.min(values);
					var maxVal = helpers.max(values);
					me.min = me.min === null ? minVal : Math.min(me.min, minVal);
					me.max = me.max === null ? maxVal : Math.max(me.max, maxVal);
				});

			} else {
				helpers.each(datasets, function(dataset, datasetIndex) {
					var meta = chart.getDatasetMeta(datasetIndex);
					if (chart.isDatasetVisible(datasetIndex) && IDMatches(meta)) {
						helpers.each(dataset.data, function(rawValue, index) {
							var value = +me.getRightValue(rawValue);
							if (isNaN(value) || meta.data[index].hidden) {
								return;
							}

							if (me.min === null) {
								me.min = value;
							} else if (value < me.min) {
								me.min = value;
							}

							if (me.max === null) {
								me.max = value;
							} else if (value > me.max) {
								me.max = value;
							}
						});
					}
				});
			}

			me.min = isFinite(me.min) && !isNaN(me.min) ? me.min : DEFAULT_MIN;
			me.max = isFinite(me.max) && !isNaN(me.max) ? me.max : DEFAULT_MAX;

			// Common base implementation to handle ticks.min, ticks.max, ticks.beginAtZero
			this.handleTickRangeOptions();
		},
		getTickLimit: function() {
			var maxTicks;
			var me = this;
			var tickOpts = me.options.ticks;

			if (me.isHorizontal()) {
				maxTicks = Math.min(tickOpts.maxTicksLimit ? tickOpts.maxTicksLimit : 11, Math.ceil(me.width / 50));
			} else {
				// The factor of 2 used to scale the font size has been experimentally determined.
				var tickFontSize = helpers.valueOrDefault(tickOpts.fontSize, defaults.global.defaultFontSize);
				maxTicks = Math.min(tickOpts.maxTicksLimit ? tickOpts.maxTicksLimit : 11, Math.ceil(me.height / (2 * tickFontSize)));
			}

			return maxTicks;
		},
		// Called after the ticks are built. We need
		handleDirectionalChanges: function() {
			if (!this.isHorizontal()) {
				// We are in a vertical orientation. The top value is the highest. So reverse the array
				this.ticks.reverse();
			}
		},
		getLabelForIndex: function(index, datasetIndex) {
			return +this.getRightValue(this.chart.data.datasets[datasetIndex].data[index]);
		},
		// Utils
		getPixelForValue: function(value) {
			// This must be called after fit has been run so that
			// this.left, this.top, this.right, and this.bottom have been defined
			var me = this;
			var start = me.start;

			var rightValue = +me.getRightValue(value);
			var pixel;
			var range = me.end - start;

			if (me.isHorizontal()) {
				pixel = me.left + (me.width / range * (rightValue - start));
			} else {
				pixel = me.bottom - (me.height / range * (rightValue - start));
			}
			return pixel;
		},
		getValueForPixel: function(pixel) {
			var me = this;
			var isHorizontal = me.isHorizontal();
			var innerDimension = isHorizontal ? me.width : me.height;
			var offset = (isHorizontal ? pixel - me.left : me.bottom - pixel) / innerDimension;
			return me.start + ((me.end - me.start) * offset);
		},
		getPixelForTick: function(index) {
			return this.getPixelForValue(this.ticksAsNumbers[index]);
		}
	});
	Chart.scaleService.registerScaleType('linear', LinearScale, defaultConfig);

};

},{"25":25,"34":34,"45":45}],55:[function(require,module,exports){
'use strict';

var helpers = require(45);

/**
 * Generate a set of linear ticks
 * @param generationOptions the options used to generate the ticks
 * @param dataRange the range of the data
 * @returns {Array<Number>} array of tick values
 */
function generateTicks(generationOptions, dataRange) {
	var ticks = [];
	// To get a "nice" value for the tick spacing, we will use the appropriately named
	// "nice number" algorithm. See http://stackoverflow.com/questions/8506881/nice-label-algorithm-for-charts-with-minimum-ticks
	// for details.

	var spacing;
	if (generationOptions.stepSize && generationOptions.stepSize > 0) {
		spacing = generationOptions.stepSize;
	} else {
		var niceRange = helpers.niceNum(dataRange.max - dataRange.min, false);
		spacing = helpers.niceNum(niceRange / (generationOptions.maxTicks - 1), true);
	}
	var niceMin = Math.floor(dataRange.min / spacing) * spacing;
	var niceMax = Math.ceil(dataRange.max / spacing) * spacing;

	// If min, max and stepSize is set and they make an evenly spaced scale use it.
	if (generationOptions.min && generationOptions.max && generationOptions.stepSize) {
		// If very close to our whole number, use it.
		if (helpers.almostWhole((generationOptions.max - generationOptions.min) / generationOptions.stepSize, spacing / 1000)) {
			niceMin = generationOptions.min;
			niceMax = generationOptions.max;
		}
	}

	var numSpaces = (niceMax - niceMin) / spacing;
	// If very close to our rounded value, use it.
	if (helpers.almostEquals(numSpaces, Math.round(numSpaces), spacing / 1000)) {
		numSpaces = Math.round(numSpaces);
	} else {
		numSpaces = Math.ceil(numSpaces);
	}

	var precision = 1;
	if (spacing < 1) {
		precision = Math.pow(10, spacing.toString().length - 2);
		niceMin = Math.round(niceMin * precision) / precision;
		niceMax = Math.round(niceMax * precision) / precision;
	}
	ticks.push(generationOptions.min !== undefined ? generationOptions.min : niceMin);
	for (var j = 1; j < numSpaces; ++j) {
		ticks.push(Math.round((niceMin + j * spacing) * precision) / precision);
	}
	ticks.push(generationOptions.max !== undefined ? generationOptions.max : niceMax);

	return ticks;
}


module.exports = function(Chart) {

	var noop = helpers.noop;

	Chart.LinearScaleBase = Chart.Scale.extend({
		getRightValue: function(value) {
			if (typeof value === 'string') {
				return +value;
			}
			return Chart.Scale.prototype.getRightValue.call(this, value);
		},

		handleTickRangeOptions: function() {
			var me = this;
			var opts = me.options;
			var tickOpts = opts.ticks;

			// If we are forcing it to begin at 0, but 0 will already be rendered on the chart,
			// do nothing since that would make the chart weird. If the user really wants a weird chart
			// axis, they can manually override it
			if (tickOpts.beginAtZero) {
				var minSign = helpers.sign(me.min);
				var maxSign = helpers.sign(me.max);

				if (minSign < 0 && maxSign < 0) {
					// move the top up to 0
					me.max = 0;
				} else if (minSign > 0 && maxSign > 0) {
					// move the bottom down to 0
					me.min = 0;
				}
			}

			var setMin = tickOpts.min !== undefined || tickOpts.suggestedMin !== undefined;
			var setMax = tickOpts.max !== undefined || tickOpts.suggestedMax !== undefined;

			if (tickOpts.min !== undefined) {
				me.min = tickOpts.min;
			} else if (tickOpts.suggestedMin !== undefined) {
				if (me.min === null) {
					me.min = tickOpts.suggestedMin;
				} else {
					me.min = Math.min(me.min, tickOpts.suggestedMin);
				}
			}

			if (tickOpts.max !== undefined) {
				me.max = tickOpts.max;
			} else if (tickOpts.suggestedMax !== undefined) {
				if (me.max === null) {
					me.max = tickOpts.suggestedMax;
				} else {
					me.max = Math.max(me.max, tickOpts.suggestedMax);
				}
			}

			if (setMin !== setMax) {
				// We set the min or the max but not both.
				// So ensure that our range is good
				// Inverted or 0 length range can happen when
				// ticks.min is set, and no datasets are visible
				if (me.min >= me.max) {
					if (setMin) {
						me.max = me.min + 1;
					} else {
						me.min = me.max - 1;
					}
				}
			}

			if (me.min === me.max) {
				me.max++;

				if (!tickOpts.beginAtZero) {
					me.min--;
				}
			}
		},
		getTickLimit: noop,
		handleDirectionalChanges: noop,

		buildTicks: function() {
			var me = this;
			var opts = me.options;
			var tickOpts = opts.ticks;

			// Figure out what the max number of ticks we can support it is based on the size of
			// the axis area. For now, we say that the minimum tick spacing in pixels must be 50
			// We also limit the maximum number of ticks to 11 which gives a nice 10 squares on
			// the graph. Make sure we always have at least 2 ticks
			var maxTicks = me.getTickLimit();
			maxTicks = Math.max(2, maxTicks);

			var numericGeneratorOptions = {
				maxTicks: maxTicks,
				min: tickOpts.min,
				max: tickOpts.max,
				stepSize: helpers.valueOrDefault(tickOpts.fixedStepSize, tickOpts.stepSize)
			};
			var ticks = me.ticks = generateTicks(numericGeneratorOptions, me);

			me.handleDirectionalChanges();

			// At this point, we need to update our max and min given the tick values since we have expanded the
			// range of the scale
			me.max = helpers.max(ticks);
			me.min = helpers.min(ticks);

			if (tickOpts.reverse) {
				ticks.reverse();

				me.start = me.max;
				me.end = me.min;
			} else {
				me.start = me.min;
				me.end = me.max;
			}
		},
		convertTicksToLabels: function() {
			var me = this;
			me.ticksAsNumbers = me.ticks.slice();
			me.zeroLineIndex = me.ticks.indexOf(0);

			Chart.Scale.prototype.convertTicksToLabels.call(me);
		}
	});
};

},{"45":45}],56:[function(require,module,exports){
'use strict';

var helpers = require(45);
var Ticks = require(34);

/**
 * Generate a set of logarithmic ticks
 * @param generationOptions the options used to generate the ticks
 * @param dataRange the range of the data
 * @returns {Array<Number>} array of tick values
 */
function generateTicks(generationOptions, dataRange) {
	var ticks = [];
	var valueOrDefault = helpers.valueOrDefault;

	// Figure out what the max number of ticks we can support it is based on the size of
	// the axis area. For now, we say that the minimum tick spacing in pixels must be 50
	// We also limit the maximum number of ticks to 11 which gives a nice 10 squares on
	// the graph
	var tickVal = valueOrDefault(generationOptions.min, Math.pow(10, Math.floor(helpers.log10(dataRange.min))));

	var endExp = Math.floor(helpers.log10(dataRange.max));
	var endSignificand = Math.ceil(dataRange.max / Math.pow(10, endExp));
	var exp, significand;

	if (tickVal === 0) {
		exp = Math.floor(helpers.log10(dataRange.minNotZero));
		significand = Math.floor(dataRange.minNotZero / Math.pow(10, exp));

		ticks.push(tickVal);
		tickVal = significand * Math.pow(10, exp);
	} else {
		exp = Math.floor(helpers.log10(tickVal));
		significand = Math.floor(tickVal / Math.pow(10, exp));
	}
	var precision = exp < 0 ? Math.pow(10, Math.abs(exp)) : 1;

	do {
		ticks.push(tickVal);

		++significand;
		if (significand === 10) {
			significand = 1;
			++exp;
			precision = exp >= 0 ? 1 : precision;
		}

		tickVal = Math.round(significand * Math.pow(10, exp) * precision) / precision;
	} while (exp < endExp || (exp === endExp && significand < endSignificand));

	var lastTick = valueOrDefault(generationOptions.max, tickVal);
	ticks.push(lastTick);

	return ticks;
}


module.exports = function(Chart) {

	var defaultConfig = {
		position: 'left',

		// label settings
		ticks: {
			callback: Ticks.formatters.logarithmic
		}
	};

	var LogarithmicScale = Chart.Scale.extend({
		determineDataLimits: function() {
			var me = this;
			var opts = me.options;
			var chart = me.chart;
			var data = chart.data;
			var datasets = data.datasets;
			var isHorizontal = me.isHorizontal();
			function IDMatches(meta) {
				return isHorizontal ? meta.xAxisID === me.id : meta.yAxisID === me.id;
			}

			// Calculate Range
			me.min = null;
			me.max = null;
			me.minNotZero = null;

			var hasStacks = opts.stacked;
			if (hasStacks === undefined) {
				helpers.each(datasets, function(dataset, datasetIndex) {
					if (hasStacks) {
						return;
					}

					var meta = chart.getDatasetMeta(datasetIndex);
					if (chart.isDatasetVisible(datasetIndex) && IDMatches(meta) &&
						meta.stack !== undefined) {
						hasStacks = true;
					}
				});
			}

			if (opts.stacked || hasStacks) {
				var valuesPerStack = {};

				helpers.each(datasets, function(dataset, datasetIndex) {
					var meta = chart.getDatasetMeta(datasetIndex);
					var key = [
						meta.type,
						// we have a separate stack for stack=undefined datasets when the opts.stacked is undefined
						((opts.stacked === undefined && meta.stack === undefined) ? datasetIndex : ''),
						meta.stack
					].join('.');

					if (chart.isDatasetVisible(datasetIndex) && IDMatches(meta)) {
						if (valuesPerStack[key] === undefined) {
							valuesPerStack[key] = [];
						}

						helpers.each(dataset.data, function(rawValue, index) {
							var values = valuesPerStack[key];
							var value = +me.getRightValue(rawValue);
							// invalid, hidden and negative values are ignored
							if (isNaN(value) || meta.data[index].hidden || value < 0) {
								return;
							}
							values[index] = values[index] || 0;
							values[index] += value;
						});
					}
				});

				helpers.each(valuesPerStack, function(valuesForType) {
					if (valuesForType.length > 0) {
						var minVal = helpers.min(valuesForType);
						var maxVal = helpers.max(valuesForType);
						me.min = me.min === null ? minVal : Math.min(me.min, minVal);
						me.max = me.max === null ? maxVal : Math.max(me.max, maxVal);
					}
				});

			} else {
				helpers.each(datasets, function(dataset, datasetIndex) {
					var meta = chart.getDatasetMeta(datasetIndex);
					if (chart.isDatasetVisible(datasetIndex) && IDMatches(meta)) {
						helpers.each(dataset.data, function(rawValue, index) {
							var value = +me.getRightValue(rawValue);
							// invalid, hidden and negative values are ignored
							if (isNaN(value) || meta.data[index].hidden || value < 0) {
								return;
							}

							if (me.min === null) {
								me.min = value;
							} else if (value < me.min) {
								me.min = value;
							}

							if (me.max === null) {
								me.max = value;
							} else if (value > me.max) {
								me.max = value;
							}

							if (value !== 0 && (me.minNotZero === null || value < me.minNotZero)) {
								me.minNotZero = value;
							}
						});
					}
				});
			}

			// Common base implementation to handle ticks.min, ticks.max
			this.handleTickRangeOptions();
		},
		handleTickRangeOptions: function() {
			var me = this;
			var opts = me.options;
			var tickOpts = opts.ticks;
			var valueOrDefault = helpers.valueOrDefault;
			var DEFAULT_MIN = 1;
			var DEFAULT_MAX = 10;

			me.min = valueOrDefault(tickOpts.min, me.min);
			me.max = valueOrDefault(tickOpts.max, me.max);

			if (me.min === me.max) {
				if (me.min !== 0 && me.min !== null) {
					me.min = Math.pow(10, Math.floor(helpers.log10(me.min)) - 1);
					me.max = Math.pow(10, Math.floor(helpers.log10(me.max)) + 1);
				} else {
					me.min = DEFAULT_MIN;
					me.max = DEFAULT_MAX;
				}
			}
			if (me.min === null) {
				me.min = Math.pow(10, Math.floor(helpers.log10(me.max)) - 1);
			}
			if (me.max === null) {
				me.max = me.min !== 0
					? Math.pow(10, Math.floor(helpers.log10(me.min)) + 1)
					: DEFAULT_MAX;
			}
			if (me.minNotZero === null) {
				if (me.min > 0) {
					me.minNotZero = me.min;
				} else if (me.max < 1) {
					me.minNotZero = Math.pow(10, Math.floor(helpers.log10(me.max)));
				} else {
					me.minNotZero = DEFAULT_MIN;
				}
			}
		},
		buildTicks: function() {
			var me = this;
			var opts = me.options;
			var tickOpts = opts.ticks;
			var reverse = !me.isHorizontal();

			var generationOptions = {
				min: tickOpts.min,
				max: tickOpts.max
			};
			var ticks = me.ticks = generateTicks(generationOptions, me);

			// At this point, we need to update our max and min given the tick values since we have expanded the
			// range of the scale
			me.max = helpers.max(ticks);
			me.min = helpers.min(ticks);

			if (tickOpts.reverse) {
				reverse = !reverse;
				me.start = me.max;
				me.end = me.min;
			} else {
				me.start = me.min;
				me.end = me.max;
			}
			if (reverse) {
				ticks.reverse();
			}
		},
		convertTicksToLabels: function() {
			this.tickValues = this.ticks.slice();

			Chart.Scale.prototype.convertTicksToLabels.call(this);
		},
		// Get the correct tooltip label
		getLabelForIndex: function(index, datasetIndex) {
			return +this.getRightValue(this.chart.data.datasets[datasetIndex].data[index]);
		},
		getPixelForTick: function(index) {
			return this.getPixelForValue(this.tickValues[index]);
		},
		/**
		 * Returns the value of the first tick.
		 * @param {Number} value - The minimum not zero value.
		 * @return {Number} The first tick value.
		 * @private
		 */
		_getFirstTickValue: function(value) {
			var exp = Math.floor(helpers.log10(value));
			var significand = Math.floor(value / Math.pow(10, exp));

			return significand * Math.pow(10, exp);
		},
		getPixelForValue: function(value) {
			var me = this;
			var reverse = me.options.ticks.reverse;
			var log10 = helpers.log10;
			var firstTickValue = me._getFirstTickValue(me.minNotZero);
			var offset = 0;
			var innerDimension, pixel, start, end, sign;

			value = +me.getRightValue(value);
			if (reverse) {
				start = me.end;
				end = me.start;
				sign = -1;
			} else {
				start = me.start;
				end = me.end;
				sign = 1;
			}
			if (me.isHorizontal()) {
				innerDimension = me.width;
				pixel = reverse ? me.right : me.left;
			} else {
				innerDimension = me.height;
				sign *= -1; // invert, since the upper-left corner of the canvas is at pixel (0, 0)
				pixel = reverse ? me.top : me.bottom;
			}
			if (value !== start) {
				if (start === 0) { // include zero tick
					offset = helpers.getValueOrDefault(
						me.options.ticks.fontSize,
						Chart.defaults.global.defaultFontSize
					);
					innerDimension -= offset;
					start = firstTickValue;
				}
				if (value !== 0) {
					offset += innerDimension / (log10(end) - log10(start)) * (log10(value) - log10(start));
				}
				pixel += sign * offset;
			}
			return pixel;
		},
		getValueForPixel: function(pixel) {
			var me = this;
			var reverse = me.options.ticks.reverse;
			var log10 = helpers.log10;
			var firstTickValue = me._getFirstTickValue(me.minNotZero);
			var innerDimension, start, end, value;

			if (reverse) {
				start = me.end;
				end = me.start;
			} else {
				start = me.start;
				end = me.end;
			}
			if (me.isHorizontal()) {
				innerDimension = me.width;
				value = reverse ? me.right - pixel : pixel - me.left;
			} else {
				innerDimension = me.height;
				value = reverse ? pixel - me.top : me.bottom - pixel;
			}
			if (value !== start) {
				if (start === 0) { // include zero tick
					var offset = helpers.getValueOrDefault(
						me.options.ticks.fontSize,
						Chart.defaults.global.defaultFontSize
					);
					value -= offset;
					innerDimension -= offset;
					start = firstTickValue;
				}
				value *= log10(end) - log10(start);
				value /= innerDimension;
				value = Math.pow(10, log10(start) + value);
			}
			return value;
		}
	});
	Chart.scaleService.registerScaleType('logarithmic', LogarithmicScale, defaultConfig);

};

},{"34":34,"45":45}],57:[function(require,module,exports){
'use strict';

var defaults = require(25);
var helpers = require(45);
var Ticks = require(34);

module.exports = function(Chart) {

	var globalDefaults = defaults.global;

	var defaultConfig = {
		display: true,

		// Boolean - Whether to animate scaling the chart from the centre
		animate: true,
		position: 'chartArea',

		angleLines: {
			display: true,
			color: 'rgba(0, 0, 0, 0.1)',
			lineWidth: 1
		},

		gridLines: {
			circular: false
		},

		// label settings
		ticks: {
			// Boolean - Show a backdrop to the scale label
			showLabelBackdrop: true,

			// String - The colour of the label backdrop
			backdropColor: 'rgba(255,255,255,0.75)',

			// Number - The backdrop padding above & below the label in pixels
			backdropPaddingY: 2,

			// Number - The backdrop padding to the side of the label in pixels
			backdropPaddingX: 2,

			callback: Ticks.formatters.linear
		},

		pointLabels: {
			// Boolean - if true, show point labels
			display: true,

			// Number - Point label font size in pixels
			fontSize: 10,

			// Function - Used to convert point labels
			callback: function(label) {
				return label;
			}
		}
	};

	function getValueCount(scale) {
		var opts = scale.options;
		return opts.angleLines.display || opts.pointLabels.display ? scale.chart.data.labels.length : 0;
	}

	function getPointLabelFontOptions(scale) {
		var pointLabelOptions = scale.options.pointLabels;
		var fontSize = helpers.valueOrDefault(pointLabelOptions.fontSize, globalDefaults.defaultFontSize);
		var fontStyle = helpers.valueOrDefault(pointLabelOptions.fontStyle, globalDefaults.defaultFontStyle);
		var fontFamily = helpers.valueOrDefault(pointLabelOptions.fontFamily, globalDefaults.defaultFontFamily);
		var font = helpers.fontString(fontSize, fontStyle, fontFamily);

		return {
			size: fontSize,
			style: fontStyle,
			family: fontFamily,
			font: font
		};
	}

	function measureLabelSize(ctx, fontSize, label) {
		if (helpers.isArray(label)) {
			return {
				w: helpers.longestText(ctx, ctx.font, label),
				h: (label.length * fontSize) + ((label.length - 1) * 1.5 * fontSize)
			};
		}

		return {
			w: ctx.measureText(label).width,
			h: fontSize
		};
	}

	function determineLimits(angle, pos, size, min, max) {
		if (angle === min || angle === max) {
			return {
				start: pos - (size / 2),
				end: pos + (size / 2)
			};
		} else if (angle < min || angle > max) {
			return {
				start: pos - size - 5,
				end: pos
			};
		}

		return {
			start: pos,
			end: pos + size + 5
		};
	}

	/**
	 * Helper function to fit a radial linear scale with point labels
	 */
	function fitWithPointLabels(scale) {
		/*
		 * Right, this is really confusing and there is a lot of maths going on here
		 * The gist of the problem is here: https://gist.github.com/nnnick/696cc9c55f4b0beb8fe9
		 *
		 * Reaction: https://dl.dropboxusercontent.com/u/34601363/toomuchscience.gif
		 *
		 * Solution:
		 *
		 * We assume the radius of the polygon is half the size of the canvas at first
		 * at each index we check if the text overlaps.
		 *
		 * Where it does, we store that angle and that index.
		 *
		 * After finding the largest index and angle we calculate how much we need to remove
		 * from the shape radius to move the point inwards by that x.
		 *
		 * We average the left and right distances to get the maximum shape radius that can fit in the box
		 * along with labels.
		 *
		 * Once we have that, we can find the centre point for the chart, by taking the x text protrusion
		 * on each side, removing that from the size, halving it and adding the left x protrusion width.
		 *
		 * This will mean we have a shape fitted to the canvas, as large as it can be with the labels
		 * and position it in the most space efficient manner
		 *
		 * https://dl.dropboxusercontent.com/u/34601363/yeahscience.gif
		 */

		var plFont = getPointLabelFontOptions(scale);

		// Get maximum radius of the polygon. Either half the height (minus the text width) or half the width.
		// Use this to calculate the offset + change. - Make sure L/R protrusion is at least 0 to stop issues with centre points
		var largestPossibleRadius = Math.min(scale.height / 2, scale.width / 2);
		var furthestLimits = {
			r: scale.width,
			l: 0,
			t: scale.height,
			b: 0
		};
		var furthestAngles = {};
		var i, textSize, pointPosition;

		scale.ctx.font = plFont.font;
		scale._pointLabelSizes = [];

		var valueCount = getValueCount(scale);
		for (i = 0; i < valueCount; i++) {
			pointPosition = scale.getPointPosition(i, largestPossibleRadius);
			textSize = measureLabelSize(scale.ctx, plFont.size, scale.pointLabels[i] || '');
			scale._pointLabelSizes[i] = textSize;

			// Add quarter circle to make degree 0 mean top of circle
			var angleRadians = scale.getIndexAngle(i);
			var angle = helpers.toDegrees(angleRadians) % 360;
			var hLimits = determineLimits(angle, pointPosition.x, textSize.w, 0, 180);
			var vLimits = determineLimits(angle, pointPosition.y, textSize.h, 90, 270);

			if (hLimits.start < furthestLimits.l) {
				furthestLimits.l = hLimits.start;
				furthestAngles.l = angleRadians;
			}

			if (hLimits.end > furthestLimits.r) {
				furthestLimits.r = hLimits.end;
				furthestAngles.r = angleRadians;
			}

			if (vLimits.start < furthestLimits.t) {
				furthestLimits.t = vLimits.start;
				furthestAngles.t = angleRadians;
			}

			if (vLimits.end > furthestLimits.b) {
				furthestLimits.b = vLimits.end;
				furthestAngles.b = angleRadians;
			}
		}

		scale.setReductions(largestPossibleRadius, furthestLimits, furthestAngles);
	}

	/**
	 * Helper function to fit a radial linear scale with no point labels
	 */
	function fit(scale) {
		var largestPossibleRadius = Math.min(scale.height / 2, scale.width / 2);
		scale.drawingArea = Math.round(largestPossibleRadius);
		scale.setCenterPoint(0, 0, 0, 0);
	}

	function getTextAlignForAngle(angle) {
		if (angle === 0 || angle === 180) {
			return 'center';
		} else if (angle < 180) {
			return 'left';
		}

		return 'right';
	}

	function fillText(ctx, text, position, fontSize) {
		if (helpers.isArray(text)) {
			var y = position.y;
			var spacing = 1.5 * fontSize;

			for (var i = 0; i < text.length; ++i) {
				ctx.fillText(text[i], position.x, y);
				y += spacing;
			}
		} else {
			ctx.fillText(text, position.x, position.y);
		}
	}

	function adjustPointPositionForLabelHeight(angle, textSize, position) {
		if (angle === 90 || angle === 270) {
			position.y -= (textSize.h / 2);
		} else if (angle > 270 || angle < 90) {
			position.y -= textSize.h;
		}
	}

	function drawPointLabels(scale) {
		var ctx = scale.ctx;
		var opts = scale.options;
		var angleLineOpts = opts.angleLines;
		var pointLabelOpts = opts.pointLabels;

		ctx.lineWidth = angleLineOpts.lineWidth;
		ctx.strokeStyle = angleLineOpts.color;

		var outerDistance = scale.getDistanceFromCenterForValue(opts.ticks.reverse ? scale.min : scale.max);

		// Point Label Font
		var plFont = getPointLabelFontOptions(scale);

		ctx.textBaseline = 'top';

		for (var i = getValueCount(scale) - 1; i >= 0; i--) {
			if (angleLineOpts.display) {
				var outerPosition = scale.getPointPosition(i, outerDistance);
				ctx.beginPath();
				ctx.moveTo(scale.xCenter, scale.yCenter);
				ctx.lineTo(outerPosition.x, outerPosition.y);
				ctx.stroke();
				ctx.closePath();
			}

			if (pointLabelOpts.display) {
				// Extra 3px out for some label spacing
				var pointLabelPosition = scale.getPointPosition(i, outerDistance + 5);

				// Keep this in loop since we may support array properties here
				var pointLabelFontColor = helpers.valueAtIndexOrDefault(pointLabelOpts.fontColor, i, globalDefaults.defaultFontColor);
				ctx.font = plFont.font;
				ctx.fillStyle = pointLabelFontColor;

				var angleRadians = scale.getIndexAngle(i);
				var angle = helpers.toDegrees(angleRadians);
				ctx.textAlign = getTextAlignForAngle(angle);
				adjustPointPositionForLabelHeight(angle, scale._pointLabelSizes[i], pointLabelPosition);
				fillText(ctx, scale.pointLabels[i] || '', pointLabelPosition, plFont.size);
			}
		}
	}

	function drawRadiusLine(scale, gridLineOpts, radius, index) {
		var ctx = scale.ctx;
		ctx.strokeStyle = helpers.valueAtIndexOrDefault(gridLineOpts.color, index - 1);
		ctx.lineWidth = helpers.valueAtIndexOrDefault(gridLineOpts.lineWidth, index - 1);

		if (scale.options.gridLines.circular) {
			// Draw circular arcs between the points
			ctx.beginPath();
			ctx.arc(scale.xCenter, scale.yCenter, radius, 0, Math.PI * 2);
			ctx.closePath();
			ctx.stroke();
		} else {
			// Draw straight lines connecting each index
			var valueCount = getValueCount(scale);

			if (valueCount === 0) {
				return;
			}

			ctx.beginPath();
			var pointPosition = scale.getPointPosition(0, radius);
			ctx.moveTo(pointPosition.x, pointPosition.y);

			for (var i = 1; i < valueCount; i++) {
				pointPosition = scale.getPointPosition(i, radius);
				ctx.lineTo(pointPosition.x, pointPosition.y);
			}

			ctx.closePath();
			ctx.stroke();
		}
	}

	function numberOrZero(param) {
		return helpers.isNumber(param) ? param : 0;
	}

	var LinearRadialScale = Chart.LinearScaleBase.extend({
		setDimensions: function() {
			var me = this;
			var opts = me.options;
			var tickOpts = opts.ticks;
			// Set the unconstrained dimension before label rotation
			me.width = me.maxWidth;
			me.height = me.maxHeight;
			me.xCenter = Math.round(me.width / 2);
			me.yCenter = Math.round(me.height / 2);

			var minSize = helpers.min([me.height, me.width]);
			var tickFontSize = helpers.valueOrDefault(tickOpts.fontSize, globalDefaults.defaultFontSize);
			me.drawingArea = opts.display ? (minSize / 2) - (tickFontSize / 2 + tickOpts.backdropPaddingY) : (minSize / 2);
		},
		determineDataLimits: function() {
			var me = this;
			var chart = me.chart;
			var min = Number.POSITIVE_INFINITY;
			var max = Number.NEGATIVE_INFINITY;

			helpers.each(chart.data.datasets, function(dataset, datasetIndex) {
				if (chart.isDatasetVisible(datasetIndex)) {
					var meta = chart.getDatasetMeta(datasetIndex);

					helpers.each(dataset.data, function(rawValue, index) {
						var value = +me.getRightValue(rawValue);
						if (isNaN(value) || meta.data[index].hidden) {
							return;
						}

						min = Math.min(value, min);
						max = Math.max(value, max);
					});
				}
			});

			me.min = (min === Number.POSITIVE_INFINITY ? 0 : min);
			me.max = (max === Number.NEGATIVE_INFINITY ? 0 : max);

			// Common base implementation to handle ticks.min, ticks.max, ticks.beginAtZero
			me.handleTickRangeOptions();
		},
		getTickLimit: function() {
			var tickOpts = this.options.ticks;
			var tickFontSize = helpers.valueOrDefault(tickOpts.fontSize, globalDefaults.defaultFontSize);
			return Math.min(tickOpts.maxTicksLimit ? tickOpts.maxTicksLimit : 11, Math.ceil(this.drawingArea / (1.5 * tickFontSize)));
		},
		convertTicksToLabels: function() {
			var me = this;

			Chart.LinearScaleBase.prototype.convertTicksToLabels.call(me);

			// Point labels
			me.pointLabels = me.chart.data.labels.map(me.options.pointLabels.callback, me);
		},
		getLabelForIndex: function(index, datasetIndex) {
			return +this.getRightValue(this.chart.data.datasets[datasetIndex].data[index]);
		},
		fit: function() {
			if (this.options.pointLabels.display) {
				fitWithPointLabels(this);
			} else {
				fit(this);
			}
		},
		/**
		 * Set radius reductions and determine new radius and center point
		 * @private
		 */
		setReductions: function(largestPossibleRadius, furthestLimits, furthestAngles) {
			var me = this;
			var radiusReductionLeft = furthestLimits.l / Math.sin(furthestAngles.l);
			var radiusReductionRight = Math.max(furthestLimits.r - me.width, 0) / Math.sin(furthestAngles.r);
			var radiusReductionTop = -furthestLimits.t / Math.cos(furthestAngles.t);
			var radiusReductionBottom = -Math.max(furthestLimits.b - me.height, 0) / Math.cos(furthestAngles.b);

			radiusReductionLeft = numberOrZero(radiusReductionLeft);
			radiusReductionRight = numberOrZero(radiusReductionRight);
			radiusReductionTop = numberOrZero(radiusReductionTop);
			radiusReductionBottom = numberOrZero(radiusReductionBottom);

			me.drawingArea = Math.min(
				Math.round(largestPossibleRadius - (radiusReductionLeft + radiusReductionRight) / 2),
				Math.round(largestPossibleRadius - (radiusReductionTop + radiusReductionBottom) / 2));
			me.setCenterPoint(radiusReductionLeft, radiusReductionRight, radiusReductionTop, radiusReductionBottom);
		},
		setCenterPoint: function(leftMovement, rightMovement, topMovement, bottomMovement) {
			var me = this;
			var maxRight = me.width - rightMovement - me.drawingArea;
			var maxLeft = leftMovement + me.drawingArea;
			var maxTop = topMovement + me.drawingArea;
			var maxBottom = me.height - bottomMovement - me.drawingArea;

			me.xCenter = Math.round(((maxLeft + maxRight) / 2) + me.left);
			me.yCenter = Math.round(((maxTop + maxBottom) / 2) + me.top);
		},

		getIndexAngle: function(index) {
			var angleMultiplier = (Math.PI * 2) / getValueCount(this);
			var startAngle = this.chart.options && this.chart.options.startAngle ?
				this.chart.options.startAngle :
				0;

			var startAngleRadians = startAngle * Math.PI * 2 / 360;

			// Start from the top instead of right, so remove a quarter of the circle
			return index * angleMultiplier + startAngleRadians;
		},
		getDistanceFromCenterForValue: function(value) {
			var me = this;

			if (value === null) {
				return 0; // null always in center
			}

			// Take into account half font size + the yPadding of the top value
			var scalingFactor = me.drawingArea / (me.max - me.min);
			if (me.options.ticks.reverse) {
				return (me.max - value) * scalingFactor;
			}
			return (value - me.min) * scalingFactor;
		},
		getPointPosition: function(index, distanceFromCenter) {
			var me = this;
			var thisAngle = me.getIndexAngle(index) - (Math.PI / 2);
			return {
				x: Math.round(Math.cos(thisAngle) * distanceFromCenter) + me.xCenter,
				y: Math.round(Math.sin(thisAngle) * distanceFromCenter) + me.yCenter
			};
		},
		getPointPositionForValue: function(index, value) {
			return this.getPointPosition(index, this.getDistanceFromCenterForValue(value));
		},

		getBasePosition: function() {
			var me = this;
			var min = me.min;
			var max = me.max;

			return me.getPointPositionForValue(0,
				me.beginAtZero ? 0 :
				min < 0 && max < 0 ? max :
				min > 0 && max > 0 ? min :
				0);
		},

		draw: function() {
			var me = this;
			var opts = me.options;
			var gridLineOpts = opts.gridLines;
			var tickOpts = opts.ticks;
			var valueOrDefault = helpers.valueOrDefault;

			if (opts.display) {
				var ctx = me.ctx;
				var startAngle = this.getIndexAngle(0);

				// Tick Font
				var tickFontSize = valueOrDefault(tickOpts.fontSize, globalDefaults.defaultFontSize);
				var tickFontStyle = valueOrDefault(tickOpts.fontStyle, globalDefaults.defaultFontStyle);
				var tickFontFamily = valueOrDefault(tickOpts.fontFamily, globalDefaults.defaultFontFamily);
				var tickLabelFont = helpers.fontString(tickFontSize, tickFontStyle, tickFontFamily);

				helpers.each(me.ticks, function(label, index) {
					// Don't draw a centre value (if it is minimum)
					if (index > 0 || tickOpts.reverse) {
						var yCenterOffset = me.getDistanceFromCenterForValue(me.ticksAsNumbers[index]);

						// Draw circular lines around the scale
						if (gridLineOpts.display && index !== 0) {
							drawRadiusLine(me, gridLineOpts, yCenterOffset, index);
						}

						if (tickOpts.display) {
							var tickFontColor = valueOrDefault(tickOpts.fontColor, globalDefaults.defaultFontColor);
							ctx.font = tickLabelFont;

							ctx.save();
							ctx.translate(me.xCenter, me.yCenter);
							ctx.rotate(startAngle);

							if (tickOpts.showLabelBackdrop) {
								var labelWidth = ctx.measureText(label).width;
								ctx.fillStyle = tickOpts.backdropColor;
								ctx.fillRect(
									-labelWidth / 2 - tickOpts.backdropPaddingX,
									-yCenterOffset - tickFontSize / 2 - tickOpts.backdropPaddingY,
									labelWidth + tickOpts.backdropPaddingX * 2,
									tickFontSize + tickOpts.backdropPaddingY * 2
								);
							}

							ctx.textAlign = 'center';
							ctx.textBaseline = 'middle';
							ctx.fillStyle = tickFontColor;
							ctx.fillText(label, 0, -yCenterOffset);
							ctx.restore();
						}
					}
				});

				if (opts.angleLines.display || opts.pointLabels.display) {
					drawPointLabels(me);
				}
			}
		}
	});
	Chart.scaleService.registerScaleType('radialLinear', LinearRadialScale, defaultConfig);

};

},{"25":25,"34":34,"45":45}],58:[function(require,module,exports){
/* global window: false */
'use strict';

var moment = require(1);
moment = typeof moment === 'function' ? moment : window.moment;

var defaults = require(25);
var helpers = require(45);

// Integer constants are from the ES6 spec.
var MIN_INTEGER = Number.MIN_SAFE_INTEGER || -9007199254740991;
var MAX_INTEGER = Number.MAX_SAFE_INTEGER || 9007199254740991;

var INTERVALS = {
	millisecond: {
		common: true,
		size: 1,
		steps: [1, 2, 5, 10, 20, 50, 100, 250, 500]
	},
	second: {
		common: true,
		size: 1000,
		steps: [1, 2, 5, 10, 30]
	},
	minute: {
		common: true,
		size: 60000,
		steps: [1, 2, 5, 10, 30]
	},
	hour: {
		common: true,
		size: 3600000,
		steps: [1, 2, 3, 6, 12]
	},
	day: {
		common: true,
		size: 86400000,
		steps: [1, 2, 5]
	},
	week: {
		common: false,
		size: 604800000,
		steps: [1, 2, 3, 4]
	},
	month: {
		common: true,
		size: 2.628e9,
		steps: [1, 2, 3]
	},
	quarter: {
		common: false,
		size: 7.884e9,
		steps: [1, 2, 3, 4]
	},
	year: {
		common: true,
		size: 3.154e10
	}
};

var UNITS = Object.keys(INTERVALS);

function sorter(a, b) {
	return a - b;
}

function arrayUnique(items) {
	var hash = {};
	var out = [];
	var i, ilen, item;

	for (i = 0, ilen = items.length; i < ilen; ++i) {
		item = items[i];
		if (!hash[item]) {
			hash[item] = true;
			out.push(item);
		}
	}

	return out;
}

/**
 * Returns an array of {time, pos} objects used to interpolate a specific `time` or position
 * (`pos`) on the scale, by searching entries before and after the requested value. `pos` is
 * a decimal between 0 and 1: 0 being the start of the scale (left or top) and 1 the other
 * extremity (left + width or top + height). Note that it would be more optimized to directly
 * store pre-computed pixels, but the scale dimensions are not guaranteed at the time we need
 * to create the lookup table. The table ALWAYS contains at least two items: min and max.
 *
 * @param {Number[]} timestamps - timestamps sorted from lowest to highest.
 * @param {String} distribution - If 'linear', timestamps will be spread linearly along the min
 * and max range, so basically, the table will contains only two items: {min, 0} and {max, 1}.
 * If 'series', timestamps will be positioned at the same distance from each other. In this
 * case, only timestamps that break the time linearity are registered, meaning that in the
 * best case, all timestamps are linear, the table contains only min and max.
 */
function buildLookupTable(timestamps, min, max, distribution) {
	if (distribution === 'linear' || !timestamps.length) {
		return [
			{time: min, pos: 0},
			{time: max, pos: 1}
		];
	}

	var table = [];
	var items = [min];
	var i, ilen, prev, curr, next;

	for (i = 0, ilen = timestamps.length; i < ilen; ++i) {
		curr = timestamps[i];
		if (curr > min && curr < max) {
			items.push(curr);
		}
	}

	items.push(max);

	for (i = 0, ilen = items.length; i < ilen; ++i) {
		next = items[i + 1];
		prev = items[i - 1];
		curr = items[i];

		// only add points that breaks the scale linearity
		if (prev === undefined || next === undefined || Math.round((next + prev) / 2) !== curr) {
			table.push({time: curr, pos: i / (ilen - 1)});
		}
	}

	return table;
}

// @see adapted from http://www.anujgakhar.com/2014/03/01/binary-search-in-javascript/
function lookup(table, key, value) {
	var lo = 0;
	var hi = table.length - 1;
	var mid, i0, i1;

	while (lo >= 0 && lo <= hi) {
		mid = (lo + hi) >> 1;
		i0 = table[mid - 1] || null;
		i1 = table[mid];

		if (!i0) {
			// given value is outside table (before first item)
			return {lo: null, hi: i1};
		} else if (i1[key] < value) {
			lo = mid + 1;
		} else if (i0[key] > value) {
			hi = mid - 1;
		} else {
			return {lo: i0, hi: i1};
		}
	}

	// given value is outside table (after last item)
	return {lo: i1, hi: null};
}

/**
 * Linearly interpolates the given source `value` using the table items `skey` values and
 * returns the associated `tkey` value. For example, interpolate(table, 'time', 42, 'pos')
 * returns the position for a timestamp equal to 42. If value is out of bounds, values at
 * index [0, 1] or [n - 1, n] are used for the interpolation.
 */
function interpolate(table, skey, sval, tkey) {
	var range = lookup(table, skey, sval);

	// Note: the lookup table ALWAYS contains at least 2 items (min and max)
	var prev = !range.lo ? table[0] : !range.hi ? table[table.length - 2] : range.lo;
	var next = !range.lo ? table[1] : !range.hi ? table[table.length - 1] : range.hi;

	var span = next[skey] - prev[skey];
	var ratio = span ? (sval - prev[skey]) / span : 0;
	var offset = (next[tkey] - prev[tkey]) * ratio;

	return prev[tkey] + offset;
}

/**
 * Convert the given value to a moment object using the given time options.
 * @see http://momentjs.com/docs/#/parsing/
 */
function momentify(value, options) {
	var parser = options.parser;
	var format = options.parser || options.format;

	if (typeof parser === 'function') {
		return parser(value);
	}

	if (typeof value === 'string' && typeof format === 'string') {
		return moment(value, format);
	}

	if (!(value instanceof moment)) {
		value = moment(value);
	}

	if (value.isValid()) {
		return value;
	}

	// Labels are in an incompatible moment format and no `parser` has been provided.
	// The user might still use the deprecated `format` option to convert his inputs.
	if (typeof format === 'function') {
		return format(value);
	}

	return value;
}

function parse(input, scale) {
	if (helpers.isNullOrUndef(input)) {
		return null;
	}

	var options = scale.options.time;
	var value = momentify(scale.getRightValue(input), options);
	if (!value.isValid()) {
		return null;
	}

	if (options.round) {
		value.startOf(options.round);
	}

	return value.valueOf();
}

/**
 * Returns the number of unit to skip to be able to display up to `capacity` number of ticks
 * in `unit` for the given `min` / `max` range and respecting the interval steps constraints.
 */
function determineStepSize(min, max, unit, capacity) {
	var range = max - min;
	var interval = INTERVALS[unit];
	var milliseconds = interval.size;
	var steps = interval.steps;
	var i, ilen, factor;

	if (!steps) {
		return Math.ceil(range / (capacity * milliseconds));
	}

	for (i = 0, ilen = steps.length; i < ilen; ++i) {
		factor = steps[i];
		if (Math.ceil(range / (milliseconds * factor)) <= capacity) {
			break;
		}
	}

	return factor;
}

/**
 * Figures out what unit results in an appropriate number of auto-generated ticks
 */
function determineUnitForAutoTicks(minUnit, min, max, capacity) {
	var ilen = UNITS.length;
	var i, interval, factor;

	for (i = UNITS.indexOf(minUnit); i < ilen - 1; ++i) {
		interval = INTERVALS[UNITS[i]];
		factor = interval.steps ? interval.steps[interval.steps.length - 1] : MAX_INTEGER;

		if (interval.common && Math.ceil((max - min) / (factor * interval.size)) <= capacity) {
			return UNITS[i];
		}
	}

	return UNITS[ilen - 1];
}

/**
 * Figures out what unit to format a set of ticks with
 */
function determineUnitForFormatting(ticks, minUnit, min, max) {
	var duration = moment.duration(moment(max).diff(moment(min)));
	var ilen = UNITS.length;
	var i, unit;

	for (i = ilen - 1; i >= UNITS.indexOf(minUnit); i--) {
		unit = UNITS[i];
		if (INTERVALS[unit].common && duration.as(unit) >= ticks.length) {
			return unit;
		}
	}

	return UNITS[minUnit ? UNITS.indexOf(minUnit) : 0];
}

function determineMajorUnit(unit) {
	for (var i = UNITS.indexOf(unit) + 1, ilen = UNITS.length; i < ilen; ++i) {
		if (INTERVALS[UNITS[i]].common) {
			return UNITS[i];
		}
	}
}

/**
 * Generates a maximum of `capacity` timestamps between min and max, rounded to the
 * `minor` unit, aligned on the `major` unit and using the given scale time `options`.
 * Important: this method can return ticks outside the min and max range, it's the
 * responsibility of the calling code to clamp values if needed.
 */
function generate(min, max, capacity, options) {
	var timeOpts = options.time;
	var minor = timeOpts.unit || determineUnitForAutoTicks(timeOpts.minUnit, min, max, capacity);
	var major = determineMajorUnit(minor);
	var stepSize = helpers.valueOrDefault(timeOpts.stepSize, timeOpts.unitStepSize);
	var weekday = minor === 'week' ? timeOpts.isoWeekday : false;
	var majorTicksEnabled = options.ticks.major.enabled;
	var interval = INTERVALS[minor];
	var first = moment(min);
	var last = moment(max);
	var ticks = [];
	var time;

	if (!stepSize) {
		stepSize = determineStepSize(min, max, minor, capacity);
	}

	// For 'week' unit, handle the first day of week option
	if (weekday) {
		first = first.isoWeekday(weekday);
		last = last.isoWeekday(weekday);
	}

	// Align first/last ticks on unit
	first = first.startOf(weekday ? 'day' : minor);
	last = last.startOf(weekday ? 'day' : minor);

	// Make sure that the last tick include max
	if (last < max) {
		last.add(1, minor);
	}

	time = moment(first);

	if (majorTicksEnabled && major && !weekday && !timeOpts.round) {
		// Align the first tick on the previous `minor` unit aligned on the `major` unit:
		// we first aligned time on the previous `major` unit then add the number of full
		// stepSize there is between first and the previous major time.
		time.startOf(major);
		time.add(~~((first - time) / (interval.size * stepSize)) * stepSize, minor);
	}

	for (; time < last; time.add(stepSize, minor)) {
		ticks.push(+time);
	}

	ticks.push(+time);

	return ticks;
}

/**
 * Returns the right and left offsets from edges in the form of {left, right}.
 * Offsets are added when the `offset` option is true.
 */
function computeOffsets(table, ticks, min, max, options) {
	var left = 0;
	var right = 0;
	var upper, lower;

	if (options.offset && ticks.length) {
		if (!options.time.min) {
			upper = ticks.length > 1 ? ticks[1] : max;
			lower = ticks[0];
			left = (
				interpolate(table, 'time', upper, 'pos') -
				interpolate(table, 'time', lower, 'pos')
			) / 2;
		}
		if (!options.time.max) {
			upper = ticks[ticks.length - 1];
			lower = ticks.length > 1 ? ticks[ticks.length - 2] : min;
			right = (
				interpolate(table, 'time', upper, 'pos') -
				interpolate(table, 'time', lower, 'pos')
			) / 2;
		}
	}

	return {left: left, right: right};
}

function ticksFromTimestamps(values, majorUnit) {
	var ticks = [];
	var i, ilen, value, major;

	for (i = 0, ilen = values.length; i < ilen; ++i) {
		value = values[i];
		major = majorUnit ? value === +moment(value).startOf(majorUnit) : false;

		ticks.push({
			value: value,
			major: major
		});
	}

	return ticks;
}

function determineLabelFormat(data, timeOpts) {
	var i, momentDate, hasTime;
	var ilen = data.length;

	// find the label with the most parts (milliseconds, minutes, etc.)
	// format all labels with the same level of detail as the most specific label
	for (i = 0; i < ilen; i++) {
		momentDate = momentify(data[i], timeOpts);
		if (momentDate.millisecond() !== 0) {
			return 'MMM D, YYYY h:mm:ss.SSS a';
		}
		if (momentDate.second() !== 0 || momentDate.minute() !== 0 || momentDate.hour() !== 0) {
			hasTime = true;
		}
	}
	if (hasTime) {
		return 'MMM D, YYYY h:mm:ss a';
	}
	return 'MMM D, YYYY';
}

module.exports = function(Chart) {

	var defaultConfig = {
		position: 'bottom',

		/**
		 * Data distribution along the scale:
		 * - 'linear': data are spread according to their time (distances can vary),
		 * - 'series': data are spread at the same distance from each other.
		 * @see https://github.com/chartjs/Chart.js/pull/4507
		 * @since 2.7.0
		 */
		distribution: 'linear',

		/**
		 * Scale boundary strategy (bypassed by min/max time options)
		 * - `data`: make sure data are fully visible, ticks outside are removed
		 * - `ticks`: make sure ticks are fully visible, data outside are truncated
		 * @see https://github.com/chartjs/Chart.js/pull/4556
		 * @since 2.7.0
		 */
		bounds: 'data',

		time: {
			parser: false, // false == a pattern string from http://momentjs.com/docs/#/parsing/string-format/ or a custom callback that converts its argument to a moment
			format: false, // DEPRECATED false == date objects, moment object, callback or a pattern string from http://momentjs.com/docs/#/parsing/string-format/
			unit: false, // false == automatic or override with week, month, year, etc.
			round: false, // none, or override with week, month, year, etc.
			displayFormat: false, // DEPRECATED
			isoWeekday: false, // override week start day - see http://momentjs.com/docs/#/get-set/iso-weekday/
			minUnit: 'millisecond',

			// defaults to unit's corresponding unitFormat below or override using pattern string from http://momentjs.com/docs/#/displaying/format/
			displayFormats: {
				millisecond: 'h:mm:ss.SSS a', // 11:20:01.123 AM,
				second: 'h:mm:ss a', // 11:20:01 AM
				minute: 'h:mm a', // 11:20 AM
				hour: 'hA', // 5PM
				day: 'MMM D', // Sep 4
				week: 'll', // Week 46, or maybe "[W]WW - YYYY" ?
				month: 'MMM YYYY', // Sept 2015
				quarter: '[Q]Q - YYYY', // Q3
				year: 'YYYY' // 2015
			},
		},
		ticks: {
			autoSkip: false,

			/**
			 * Ticks generation input values:
			 * - 'auto': generates "optimal" ticks based on scale size and time options.
			 * - 'data': generates ticks from data (including labels from data {t|x|y} objects).
			 * - 'labels': generates ticks from user given `data.labels` values ONLY.
			 * @see https://github.com/chartjs/Chart.js/pull/4507
			 * @since 2.7.0
			 */
			source: 'auto',

			major: {
				enabled: false
			}
		}
	};

	var TimeScale = Chart.Scale.extend({
		initialize: function() {
			if (!moment) {
				throw new Error('Chart.js - Moment.js could not be found! You must include it before Chart.js to use the time scale. Download at https://momentjs.com');
			}

			this.mergeTicksOptions();

			Chart.Scale.prototype.initialize.call(this);
		},

		update: function() {
			var me = this;
			var options = me.options;

			// DEPRECATIONS: output a message only one time per update
			if (options.time && options.time.format) {
				console.warn('options.time.format is deprecated and replaced by options.time.parser.');
			}

			return Chart.Scale.prototype.update.apply(me, arguments);
		},

		/**
		 * Allows data to be referenced via 't' attribute
		 */
		getRightValue: function(rawValue) {
			if (rawValue && rawValue.t !== undefined) {
				rawValue = rawValue.t;
			}
			return Chart.Scale.prototype.getRightValue.call(this, rawValue);
		},

		determineDataLimits: function() {
			var me = this;
			var chart = me.chart;
			var timeOpts = me.options.time;
			var unit = timeOpts.unit || 'day';
			var min = MAX_INTEGER;
			var max = MIN_INTEGER;
			var timestamps = [];
			var datasets = [];
			var labels = [];
			var i, j, ilen, jlen, data, timestamp;

			// Convert labels to timestamps
			for (i = 0, ilen = chart.data.labels.length; i < ilen; ++i) {
				labels.push(parse(chart.data.labels[i], me));
			}

			// Convert data to timestamps
			for (i = 0, ilen = (chart.data.datasets || []).length; i < ilen; ++i) {
				if (chart.isDatasetVisible(i)) {
					data = chart.data.datasets[i].data;

					// Let's consider that all data have the same format.
					if (helpers.isObject(data[0])) {
						datasets[i] = [];

						for (j = 0, jlen = data.length; j < jlen; ++j) {
							timestamp = parse(data[j], me);
							timestamps.push(timestamp);
							datasets[i][j] = timestamp;
						}
					} else {
						timestamps.push.apply(timestamps, labels);
						datasets[i] = labels.slice(0);
					}
				} else {
					datasets[i] = [];
				}
			}

			if (labels.length) {
				// Sort labels **after** data have been converted
				labels = arrayUnique(labels).sort(sorter);
				min = Math.min(min, labels[0]);
				max = Math.max(max, labels[labels.length - 1]);
			}

			if (timestamps.length) {
				timestamps = arrayUnique(timestamps).sort(sorter);
				min = Math.min(min, timestamps[0]);
				max = Math.max(max, timestamps[timestamps.length - 1]);
			}

			min = parse(timeOpts.min, me) || min;
			max = parse(timeOpts.max, me) || max;

			// In case there is no valid min/max, set limits based on unit time option
			min = min === MAX_INTEGER ? +moment().startOf(unit) : min;
			max = max === MIN_INTEGER ? +moment().endOf(unit) + 1 : max;

			// Make sure that max is strictly higher than min (required by the lookup table)
			me.min = Math.min(min, max);
			me.max = Math.max(min + 1, max);

			// PRIVATE
			me._horizontal = me.isHorizontal();
			me._table = [];
			me._timestamps = {
				data: timestamps,
				datasets: datasets,
				labels: labels
			};
		},

		buildTicks: function() {
			var me = this;
			var min = me.min;
			var max = me.max;
			var options = me.options;
			var timeOpts = options.time;
			var timestamps = [];
			var ticks = [];
			var i, ilen, timestamp;

			switch (options.ticks.source) {
			case 'data':
				timestamps = me._timestamps.data;
				break;
			case 'labels':
				timestamps = me._timestamps.labels;
				break;
			case 'auto':
			default:
				timestamps = generate(min, max, me.getLabelCapacity(min), options);
			}

			if (options.bounds === 'ticks' && timestamps.length) {
				min = timestamps[0];
				max = timestamps[timestamps.length - 1];
			}

			// Enforce limits with user min/max options
			min = parse(timeOpts.min, me) || min;
			max = parse(timeOpts.max, me) || max;

			// Remove ticks outside the min/max range
			for (i = 0, ilen = timestamps.length; i < ilen; ++i) {
				timestamp = timestamps[i];
				if (timestamp >= min && timestamp <= max) {
					ticks.push(timestamp);
				}
			}

			me.min = min;
			me.max = max;

			// PRIVATE
			me._unit = timeOpts.unit || determineUnitForFormatting(ticks, timeOpts.minUnit, me.min, me.max);
			me._majorUnit = determineMajorUnit(me._unit);
			me._table = buildLookupTable(me._timestamps.data, min, max, options.distribution);
			me._offsets = computeOffsets(me._table, ticks, min, max, options);
			me._labelFormat = determineLabelFormat(me._timestamps.data, timeOpts);

			return ticksFromTimestamps(ticks, me._majorUnit);
		},

		getLabelForIndex: function(index, datasetIndex) {
			var me = this;
			var data = me.chart.data;
			var timeOpts = me.options.time;
			var label = data.labels && index < data.labels.length ? data.labels[index] : '';
			var value = data.datasets[datasetIndex].data[index];

			if (helpers.isObject(value)) {
				label = me.getRightValue(value);
			}
			if (timeOpts.tooltipFormat) {
				return momentify(label, timeOpts).format(timeOpts.tooltipFormat);
			}
			if (typeof label === 'string') {
				return label;
			}

			return momentify(label, timeOpts).format(me._labelFormat);
		},

		/**
		 * Function to format an individual tick mark
		 * @private
		 */
		tickFormatFunction: function(tick, index, ticks, formatOverride) {
			var me = this;
			var options = me.options;
			var time = tick.valueOf();
			var formats = options.time.displayFormats;
			var minorFormat = formats[me._unit];
			var majorUnit = me._majorUnit;
			var majorFormat = formats[majorUnit];
			var majorTime = tick.clone().startOf(majorUnit).valueOf();
			var majorTickOpts = options.ticks.major;
			var major = majorTickOpts.enabled && majorUnit && majorFormat && time === majorTime;
			var label = tick.format(formatOverride ? formatOverride : major ? majorFormat : minorFormat);
			var tickOpts = major ? majorTickOpts : options.ticks.minor;
			var formatter = helpers.valueOrDefault(tickOpts.callback, tickOpts.userCallback);

			return formatter ? formatter(label, index, ticks) : label;
		},

		convertTicksToLabels: function(ticks) {
			var labels = [];
			var i, ilen;

			for (i = 0, ilen = ticks.length; i < ilen; ++i) {
				labels.push(this.tickFormatFunction(moment(ticks[i].value), i, ticks));
			}

			return labels;
		},

		/**
		 * @private
		 */
		getPixelForOffset: function(time) {
			var me = this;
			var size = me._horizontal ? me.width : me.height;
			var start = me._horizontal ? me.left : me.top;
			var pos = interpolate(me._table, 'time', time, 'pos');

			return start + size * (me._offsets.left + pos) / (me._offsets.left + 1 + me._offsets.right);
		},

		getPixelForValue: function(value, index, datasetIndex) {
			var me = this;
			var time = null;

			if (index !== undefined && datasetIndex !== undefined) {
				time = me._timestamps.datasets[datasetIndex][index];
			}

			if (time === null) {
				time = parse(value, me);
			}

			if (time !== null) {
				return me.getPixelForOffset(time);
			}
		},

		getPixelForTick: function(index) {
			var ticks = this.getTicks();
			return index >= 0 && index < ticks.length ?
				this.getPixelForOffset(ticks[index].value) :
				null;
		},

		getValueForPixel: function(pixel) {
			var me = this;
			var size = me._horizontal ? me.width : me.height;
			var start = me._horizontal ? me.left : me.top;
			var pos = (size ? (pixel - start) / size : 0) * (me._offsets.left + 1 + me._offsets.left) - me._offsets.right;
			var time = interpolate(me._table, 'pos', pos, 'time');

			return moment(time);
		},

		/**
		 * Crude approximation of what the label width might be
		 * @private
		 */
		getLabelWidth: function(label) {
			var me = this;
			var ticksOpts = me.options.ticks;
			var tickLabelWidth = me.ctx.measureText(label).width;
			var angle = helpers.toRadians(ticksOpts.maxRotation);
			var cosRotation = Math.cos(angle);
			var sinRotation = Math.sin(angle);
			var tickFontSize = helpers.valueOrDefault(ticksOpts.fontSize, defaults.global.defaultFontSize);

			return (tickLabelWidth * cosRotation) + (tickFontSize * sinRotation);
		},

		/**
		 * @private
		 */
		getLabelCapacity: function(exampleTime) {
			var me = this;

			var formatOverride = me.options.time.displayFormats.millisecond;	// Pick the longest format for guestimation

			var exampleLabel = me.tickFormatFunction(moment(exampleTime), 0, [], formatOverride);
			var tickLabelWidth = me.getLabelWidth(exampleLabel);
			var innerWidth = me.isHorizontal() ? me.width : me.height;

			var capacity = Math.floor(innerWidth / tickLabelWidth);
			return capacity > 0 ? capacity : 1;
		}
	});

	Chart.scaleService.registerScaleType('time', TimeScale, defaultConfig);
};

},{"1":1,"25":25,"45":45}]},{},[7])(7)
});

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = {"response":{"spreadsheetId":"1m05kcOsCGnZwAqlz-r34h4dRp7OJndMBJCHYTkRuK2A","tableRange":"Sheet1!A1:R21","updates":{"spreadsheetId":"1m05kcOsCGnZwAqlz-r34h4dRp7OJndMBJCHYTkRuK2A","updatedRange":"Sheet1!A22:L22","updatedRows":1,"updatedColumns":12,"updatedCells":12}},"job":[{"jobId":"202","id":"","reportDate":"","url":"https://www.gro-store.com/","mobilescore":"45","mobileusability":"99","desktopscore":"47","perf":"10","pwa":"45.45454545","accessibility":"60.19417476","bestpractice":"68.75","seo":"100"},{"jobId":"211","id":"045de190-3328-11e8-81d8-3529e0859098","reportDate":"1522310759977","url":"https://www.gro-store.com/","mobilescore":"45","mobileusability":"99","desktopscore":"47","perf":"12.94117647","pwa":"45.45454545","accessibility":"60.19417476","bestpractice":"68.75","seo":"100"},{"jobId":"261","id":"103af7f0-425a-11e8-9749-c548e0df114c","reportDate":"1523981522159","url":"https://www.gro-store.com/","mobilescore":"49","mobileusability":"99","desktopscore":"52","perf":"6.352941176","pwa":"45.45454545","accessibility":"60.19417476","bestpractice":"68.75","seo":"100"},{"jobId":"262","id":"de163f90-425a-11e8-9749-c548e0df114c","reportDate":"1523981867529","url":"https://www.gro-store.com/","mobilescore":"49","mobileusability":"99","desktopscore":"52","perf":"14.88235294","pwa":"45.45454545","accessibility":"60.19417476","bestpractice":"68.75","seo":"100"},{"jobId":"26","id":"71b8e6b0-46b8-11e8-8995-63e64e5db850","reportDate":"1524461863066","url":"https://www.gro-store.com/","mobilescore":"48","mobileusability":"98","desktopscore":"50","perf":"7.058823529","pwa":"90.90909091","accessibility":"87.37864078","bestpractice":"68.75","seo":"100"},{"jobId":30,"id":"aedf3100-47dc-11e8-b4a9-afab7ead94d1","reportDate":1524587378703,"url":"https://www.gro-store.com/","mobilescore":48,"mobileusability":98,"desktopscore":49,"perf":25.176470588235293,"pwa":90.9090909090909,"accessibility":87.37864077669903,"bestpractice":68.75,"seo":100,"lhAudit":{"is-on-https":{"score":true,"displayValue":"","rawValue":true,"extendedInfo":{"value":[]},"scoringMode":"binary","name":"is-on-https","description":"Uses HTTPS","helpText":"All sites should be protected with HTTPS, even ones that don't handle sensitive data. HTTPS prevents intruders from tampering with or passively listening in on the communications between your app and your users, and is a prerequisite for HTTP/2 and many new web platform APIs. [Learn more](https://developers.google.com/web/tools/lighthouse/audits/https).","details":{"type":"list","header":{"type":"text","text":"Insecure URLs:"},"items":[]}},"redirects-http":{"score":true,"displayValue":"","rawValue":true,"scoringMode":"binary","name":"redirects-http","description":"Redirects HTTP traffic to HTTPS","helpText":"If you've already set up HTTPS, make sure that you redirect all HTTP traffic to HTTPS. [Learn more](https://developers.google.com/web/tools/lighthouse/audits/http-redirects-to-https)."},"service-worker":{"score":true,"displayValue":"","rawValue":true,"scoringMode":"binary","name":"service-worker","description":"Registers a service worker","helpText":"The service worker is the technology that enables your app to use many Progressive Web App features, such as offline, add to homescreen, and push notifications. [Learn more](https://developers.google.com/web/tools/lighthouse/audits/registered-service-worker)."},"works-offline":{"score":true,"displayValue":"","rawValue":true,"scoringMode":"binary","name":"works-offline","description":"Responds with a 200 when offline","helpText":"If you're building a Progressive Web App, consider using a service worker so that your app can work offline. [Learn more](https://developers.google.com/web/tools/lighthouse/audits/http-200-when-offline)."},"viewport":{"score":true,"displayValue":"","rawValue":true,"debugString":"","scoringMode":"binary","name":"viewport","description":"Has a `<meta name=\"viewport\">` tag with `width` or `initial-scale`","helpText":"Add a viewport meta tag to optimize your app for mobile screens. [Learn more](https://developers.google.com/web/tools/lighthouse/audits/has-viewport-meta-tag)."},"without-javascript":{"score":true,"displayValue":"","rawValue":true,"scoringMode":"binary","name":"without-javascript","description":"Contains some content when JavaScript is not available","helpText":"Your app should display some content when JavaScript is disabled, even if it's just a warning to the user that JavaScript is required to use the app. [Learn more](https://developers.google.com/web/tools/lighthouse/audits/no-js)."},"first-meaningful-paint":{"score":54,"displayValue":"3,780 ms","rawValue":3779.8,"extendedInfo":{"value":{"timestamps":{"navStart":5572941675473,"fCP":5572944410177,"fMP":5572945455286,"onLoad":5572953090833,"endOfTrace":5572962003948},"timings":{"navStart":0,"fCP":2734.704,"fMP":3779.813,"onLoad":11415.36,"endOfTrace":20328.475},"fmpFellBack":false}},"scoringMode":"numeric","name":"first-meaningful-paint","description":"First meaningful paint","helpText":"First meaningful paint measures when the primary content of a page is visible. [Learn more](https://developers.google.com/web/tools/lighthouse/audits/first-meaningful-paint)."},"load-fast-enough-for-pwa":{"score":false,"displayValue":"","rawValue":false,"debugString":"First Interactive was at 15,730 ms. More details in the \"Performance\" section.","extendedInfo":{"value":{"areLatenciesAll3G":false,"firstRequestLatencies":[{"url":"https://www.gro-store.com/","latency":"566.09"},{"url":"https://fonts.googleapis.com/css?family=Muli:300,300i,400,400i","latency":"655.24"},{"url":"https://connect.nosto.com/include/gro-uk-magento2","latency":"571.63"},{"url":"https://cdn.bronto.com/popup/delivery.js","latency":"571.68"},{"url":"https://p.bm23.com/bta.js","latency":"570.02"},{"url":"https://fonts.gstatic.com/s/muli/v11/7Auwp_0qiz-afTLGLQjUwkQ.woff2","latency":"583.29"},{"url":"https://staticw2.yotpo.com/INNN2oWNqTDW3UgadN2pKPYnIMdqgHgCGdRgUe1e/widget.js","latency":"636.78"},{"url":"https://p.yotpo.com/i?e=pv&page=Gro%20Store%20%7CGro%20baby%20clothes%20%26%20toys%20%7C%20Gro%20bags%2C%20Gro%20clocks%2C%20Gro%20eggs%2C%20Baby%20Bedding%20and%20Swaddles&se_va=INNN2oWNqTDW3UgadN2pKPYnIMdqgHgCGdRgUe1e&dtm=1524587388879&tid=855414&vp=412x732&ds=412x11707&vid=1&duid=d6b439d3a6689028&p=web&tv=js-0.13.2&fp=2162865479&aid=onsite_v2&lang=en-US&cs=UTF-8&tz=Etc%2FUTC&res=412x732&cd=24&cookie=1&url=https%3A%2F%2Fwww.gro-store.com%2F","latency":"0.02"},{"url":"https://nosto-merchant-assets.s3.amazonaws.com/gro-eur-magento2/5a55fe4a60b2c62ce44a09e1/1515593773588","latency":"0.04"},{"url":"https://www.google-analytics.com/analytics.js","latency":"0.05"}],"isFast":false,"timeToFirstInteractive":15727.824}},"scoringMode":"binary","name":"load-fast-enough-for-pwa","description":"Page load is not fast enough on 3G","helpText":"A fast page load over a 3G network ensures a good mobile user experience. [Learn more](https://developers.google.com/web/tools/lighthouse/audits/fast-3g)."},"speed-index-metric":{"score":18,"displayValue":"10,448","rawValue":10448,"extendedInfo":{"value":{"timings":{"firstVisualChange":9949,"visuallyReady":10828.395000457764,"visuallyComplete":13782,"perceptualSpeedIndex":10447.921917704802},"timestamps":{"firstVisualChange":5572951624473,"visuallyReady":5572952503868,"visuallyComplete":5572955457473,"perceptualSpeedIndex":5572952123394.918},"frames":[{"timestamp":5572941675.473,"progress":0},{"timestamp":5572941679.204,"progress":0},{"timestamp":5572941694.124,"progress":0},{"timestamp":5572941712.549,"progress":0},{"timestamp":5572941727.957,"progress":0},{"timestamp":5572941743.276,"progress":0},{"timestamp":5572941761.974,"progress":0},{"timestamp":5572941779.45,"progress":0},{"timestamp":5572941792.031,"progress":0},{"timestamp":5572941809.497,"progress":0},{"timestamp":5572941825.434,"progress":0},{"timestamp":5572941849.632,"progress":0},{"timestamp":5572941867.321,"progress":0},{"timestamp":5572941875.034,"progress":0},{"timestamp":5572941893.733,"progress":0},{"timestamp":5572941908.972,"progress":0},{"timestamp":5572941925.361,"progress":0},{"timestamp":5572941942.216,"progress":0},{"timestamp":5572941958.453,"progress":0},{"timestamp":5572941975.249,"progress":0},{"timestamp":5572941994.117,"progress":0},{"timestamp":5572942009.023,"progress":0},{"timestamp":5572942026.824,"progress":0},{"timestamp":5572942042.809,"progress":0},{"timestamp":5572942059.251,"progress":0},{"timestamp":5572942076.937,"progress":0},{"timestamp":5572942091.995,"progress":0},{"timestamp":5572942108.898,"progress":0},{"timestamp":5572942125.787,"progress":0},{"timestamp":5572942144.592,"progress":0},{"timestamp":5572942160.956,"progress":0},{"timestamp":5572942176.271,"progress":0},{"timestamp":5572944410.427,"progress":0},{"timestamp":5572944439.224,"progress":0},{"timestamp":5572944455.858,"progress":0},{"timestamp":5572944472.573,"progress":0},{"timestamp":5572944493.968,"progress":0},{"timestamp":5572944507.129,"progress":0},{"timestamp":5572944515.066,"progress":0},{"timestamp":5572944551.347,"progress":0},{"timestamp":5572944558.344,"progress":0},{"timestamp":5572944572.125,"progress":0},{"timestamp":5572944594.816,"progress":0},{"timestamp":5572944619.888,"progress":0},{"timestamp":5572944630.491,"progress":0},{"timestamp":5572944638.522,"progress":0},{"timestamp":5572944655.548,"progress":0},{"timestamp":5572944672.301,"progress":0},{"timestamp":5572944696.033,"progress":0},{"timestamp":5572944702.009,"progress":0},{"timestamp":5572944725.358,"progress":0},{"timestamp":5572944745.13,"progress":0},{"timestamp":5572944753.212,"progress":0},{"timestamp":5572944772.833,"progress":0},{"timestamp":5572944788.949,"progress":0},{"timestamp":5572944806.264,"progress":0},{"timestamp":5572944822.056,"progress":0},{"timestamp":5572944839.346,"progress":0},{"timestamp":5572944855.907,"progress":0},{"timestamp":5572944875.648,"progress":0},{"timestamp":5572944906.401,"progress":0},{"timestamp":5572944922.391,"progress":0},{"timestamp":5572944939.533,"progress":0},{"timestamp":5572944956.282,"progress":0},{"timestamp":5572944972.218,"progress":0},{"timestamp":5572944989.29,"progress":0},{"timestamp":5572945005.907,"progress":0},{"timestamp":5572945015.825,"progress":0},{"timestamp":5572945039.859,"progress":0},{"timestamp":5572945056.427,"progress":0},{"timestamp":5572945072.974,"progress":0},{"timestamp":5572945090.939,"progress":0},{"timestamp":5572945106.057,"progress":0},{"timestamp":5572945122.709,"progress":0},{"timestamp":5572945138.932,"progress":0},{"timestamp":5572945155.948,"progress":0},{"timestamp":5572945172.208,"progress":0},{"timestamp":5572945189.094,"progress":0},{"timestamp":5572945205.937,"progress":0},{"timestamp":5572945232.125,"progress":0},{"timestamp":5572945240.298,"progress":0},{"timestamp":5572945256.034,"progress":0},{"timestamp":5572945272.366,"progress":0},{"timestamp":5572945289.417,"progress":0},{"timestamp":5572945305.782,"progress":0},{"timestamp":5572945322.18,"progress":0},{"timestamp":5572945338.67,"progress":0},{"timestamp":5572945356.24,"progress":0},{"timestamp":5572945372.915,"progress":0},{"timestamp":5572945389.415,"progress":0},{"timestamp":5572945405.873,"progress":0},{"timestamp":5572945422.441,"progress":0},{"timestamp":5572945441.98,"progress":0},{"timestamp":5572945455.241,"progress":0},{"timestamp":5572945474.802,"progress":0},{"timestamp":5572945489.7,"progress":0},{"timestamp":5572945508.047,"progress":0},{"timestamp":5572945522.95,"progress":0},{"timestamp":5572945540.185,"progress":0},{"timestamp":5572945559.989,"progress":0},{"timestamp":5572945573.456,"progress":0},{"timestamp":5572945597.797,"progress":0},{"timestamp":5572945608.545,"progress":0},{"timestamp":5572945622.78,"progress":0},{"timestamp":5572946409.65,"progress":0},{"timestamp":5572946448.544,"progress":0},{"timestamp":5572946457.42,"progress":0},{"timestamp":5572946470.476,"progress":0},{"timestamp":5572946487.089,"progress":0},{"timestamp":5572946505.34,"progress":0},{"timestamp":5572946521.599,"progress":0},{"timestamp":5572946537.986,"progress":0},{"timestamp":5572946555.278,"progress":0},{"timestamp":5572946572.977,"progress":0},{"timestamp":5572946585.901,"progress":0},{"timestamp":5572946610.624,"progress":0},{"timestamp":5572946633.124,"progress":0},{"timestamp":5572946646.134,"progress":0},{"timestamp":5572951089.586,"progress":0},{"timestamp":5572951107.355,"progress":0},{"timestamp":5572951125.622,"progress":0},{"timestamp":5572951140.491,"progress":0},{"timestamp":5572951157.447,"progress":0},{"timestamp":5572951173.424,"progress":0},{"timestamp":5572951189.179,"progress":0},{"timestamp":5572951206.186,"progress":0},{"timestamp":5572951222.167,"progress":0},{"timestamp":5572951242.929,"progress":0},{"timestamp":5572951256.854,"progress":0},{"timestamp":5572951272.357,"progress":0},{"timestamp":5572951290.485,"progress":0},{"timestamp":5572951307.079,"progress":0},{"timestamp":5572951322.39,"progress":0},{"timestamp":5572951339.357,"progress":0},{"timestamp":5572951354.99,"progress":0},{"timestamp":5572951371.796,"progress":0},{"timestamp":5572951388.446,"progress":0},{"timestamp":5572951405.047,"progress":0},{"timestamp":5572951421.544,"progress":0},{"timestamp":5572951439.132,"progress":0},{"timestamp":5572951455.712,"progress":0},{"timestamp":5572951471.478,"progress":0},{"timestamp":5572951488.757,"progress":0},{"timestamp":5572951506.029,"progress":0},{"timestamp":5572951522.626,"progress":0},{"timestamp":5572951538.918,"progress":0},{"timestamp":5572951554.742,"progress":0},{"timestamp":5572951572.177,"progress":0},{"timestamp":5572951592.896,"progress":0},{"timestamp":5572951625.003,"progress":36.52472608214809},{"timestamp":5572951641.952,"progress":36.90285287787505},{"timestamp":5572951658.393,"progress":36.90285287787505},{"timestamp":5572951672.963,"progress":36.90285287787505},{"timestamp":5572951691.193,"progress":36.90285287787505},{"timestamp":5572951708.656,"progress":36.90285287787505},{"timestamp":5572951728.319,"progress":41.285863672806656},{"timestamp":5572951740.875,"progress":41.285863672806656},{"timestamp":5572951757.926,"progress":41.285863672806656},{"timestamp":5572951771.291,"progress":41.285863672806656},{"timestamp":5572951795.856,"progress":44.84109991822731},{"timestamp":5572951805.977,"progress":44.84109991822731},{"timestamp":5572951821.434,"progress":44.84109991822731},{"timestamp":5572951837.338,"progress":44.84109991822731},{"timestamp":5572951855.844,"progress":48.05333039833225},{"timestamp":5572951870.579,"progress":48.05333039833225},{"timestamp":5572951887.411,"progress":48.05333039833225},{"timestamp":5572951904.036,"progress":48.05333039833225},{"timestamp":5572951922.054,"progress":52.242344551905184},{"timestamp":5572951937.327,"progress":52.242344551905184},{"timestamp":5572951954.24,"progress":54.869996341171394},{"timestamp":5572951972.557,"progress":54.869996341171394},{"timestamp":5572951988.761,"progress":54.869996341171394},{"timestamp":5572952004.275,"progress":57.85865600049591},{"timestamp":5572952028.5,"progress":57.85865600049591},{"timestamp":5572952043.269,"progress":57.85865600049591},{"timestamp":5572952058.428,"progress":57.85865600049591},{"timestamp":5572952071.971,"progress":62.64393260529574},{"timestamp":5572952093.011,"progress":62.64393260529574},{"timestamp":5572952105.516,"progress":64.77910883760647},{"timestamp":5572952123.754,"progress":64.77910883760647},{"timestamp":5572952140.015,"progress":67.6307616418825},{"timestamp":5572952155.789,"progress":67.6307616418825},{"timestamp":5572952183.894,"progress":70.17436328960277},{"timestamp":5572952214.046,"progress":70.17436328960277},{"timestamp":5572952230.594,"progress":73.60626786623996},{"timestamp":5572952242.809,"progress":73.60626786623996},{"timestamp":5572952259.312,"progress":75.66652584564252},{"timestamp":5572952285.71,"progress":77.52545240888229},{"timestamp":5572952320.21,"progress":77.52545240888229},{"timestamp":5572952341.714,"progress":81.06514609531925},{"timestamp":5572952434.962,"progress":81.06514609531925},{"timestamp":5572952463.845,"progress":84.00487404721018},{"timestamp":5572952483.736,"progress":84.00487404721018},{"timestamp":5572952503.868,"progress":87.49309818439815},{"timestamp":5572952525.926,"progress":87.49309818439815},{"timestamp":5572952559.439,"progress":91.30203453451776},{"timestamp":5572952587.223,"progress":91.30203453451776},{"timestamp":5572952620.686,"progress":91.30203453451776},{"timestamp":5572952632.92,"progress":94.9723876187682},{"timestamp":5572953136.313,"progress":94.9723876187682},{"timestamp":5572953149.525,"progress":94.9723876187682},{"timestamp":5572953217.829,"progress":94.9723876187682},{"timestamp":5572953250.671,"progress":94.9723876187682},{"timestamp":5572953280.6,"progress":94.9723876187682},{"timestamp":5572953332.93,"progress":94.9723876187682},{"timestamp":5572953368.039,"progress":94.9723876187682},{"timestamp":5572953451.043,"progress":94.9723876187682},{"timestamp":5572953484.984,"progress":94.75480889267818},{"timestamp":5572953494.373,"progress":94.75480889267818},{"timestamp":5572953510.927,"progress":94.75480889267818},{"timestamp":5572953522.493,"progress":94.75480889267818},{"timestamp":5572953608.085,"progress":94.75480889267818},{"timestamp":5572953648.14,"progress":94.75480889267818},{"timestamp":5572953680.736,"progress":94.75480889267818},{"timestamp":5572953701.921,"progress":94.75480889267818},{"timestamp":5572953743.077,"progress":94.75480889267818},{"timestamp":5572953769.058,"progress":94.75480889267818},{"timestamp":5572953794.332,"progress":94.75480889267818},{"timestamp":5572953816.567,"progress":94.75480889267818},{"timestamp":5572953850.181,"progress":94.75480889267818},{"timestamp":5572953868.272,"progress":94.75480889267818},{"timestamp":5572953884.335,"progress":94.75480889267818},{"timestamp":5572953899.614,"progress":94.75480889267818},{"timestamp":5572953916.671,"progress":94.75480889267818},{"timestamp":5572953934.274,"progress":94.75480889267818},{"timestamp":5572953949.688,"progress":94.75480889267818},{"timestamp":5572953966.328,"progress":94.75480889267818},{"timestamp":5572953984.657,"progress":94.75480889267818},{"timestamp":5572954000.678,"progress":94.75480889267818},{"timestamp":5572954018.159,"progress":94.75480889267818},{"timestamp":5572954038.72,"progress":94.75480889267818},{"timestamp":5572954050.846,"progress":94.75480889267818},{"timestamp":5572954066.227,"progress":94.75480889267818},{"timestamp":5572954091.878,"progress":94.75480889267818},{"timestamp":5572954101.294,"progress":94.75480889267818},{"timestamp":5572954117.414,"progress":94.75480889267818},{"timestamp":5572954150.65,"progress":94.75480889267818},{"timestamp":5572954167.694,"progress":94.75480889267818},{"timestamp":5572954185.112,"progress":94.75480889267818},{"timestamp":5572954200.773,"progress":94.75480889267818},{"timestamp":5572954217.461,"progress":94.75480889267818},{"timestamp":5572954233.984,"progress":93.22726447120901},{"timestamp":5572954252.73,"progress":93.22726447120901},{"timestamp":5572954267.345,"progress":93.22726447120901},{"timestamp":5572954285.411,"progress":93.22726447120901},{"timestamp":5572954301.081,"progress":93.22726447120901},{"timestamp":5572954317.798,"progress":93.22726447120901},{"timestamp":5572954332.259,"progress":93.22726447120901},{"timestamp":5572954351.723,"progress":93.22726447120901},{"timestamp":5572954369.135,"progress":94.82436851694906},{"timestamp":5572954384.919,"progress":94.82436851694906},{"timestamp":5572954401.57,"progress":94.82436851694906},{"timestamp":5572954420.334,"progress":94.82436851694906},{"timestamp":5572954438.484,"progress":94.83126727061547},{"timestamp":5572954472.017,"progress":94.83126727061547},{"timestamp":5572954488.537,"progress":94.83126727061547},{"timestamp":5572954522.567,"progress":94.83126727061547},{"timestamp":5572955151.646,"progress":94.83126727061547},{"timestamp":5572955159.185,"progress":98.28134495661274},{"timestamp":5572955173.698,"progress":98.28134495661274},{"timestamp":5572955192.853,"progress":98.28134495661274},{"timestamp":5572955205.692,"progress":98.28134495661274},{"timestamp":5572955222.119,"progress":98.28134495661274},{"timestamp":5572955240.874,"progress":98.28134495661274},{"timestamp":5572955255.689,"progress":98.28134495661274},{"timestamp":5572955271.966,"progress":98.28134495661274},{"timestamp":5572955278.238,"progress":98.28134495661274},{"timestamp":5572955305.217,"progress":98.28134495661274},{"timestamp":5572955322.017,"progress":98.28134495661274},{"timestamp":5572955339.669,"progress":98.28134495661274},{"timestamp":5572955355.262,"progress":98.28134495661274},{"timestamp":5572955372.074,"progress":98.28134495661274},{"timestamp":5572955388.707,"progress":98.28134495661274},{"timestamp":5572955405.297,"progress":98.28134495661274},{"timestamp":5572955422.068,"progress":98.28134495661274},{"timestamp":5572955429.985,"progress":98.28134495661274},{"timestamp":5572955457.721,"progress":100}]}},"scoringMode":"numeric","name":"speed-index-metric","description":"Perceptual Speed Index","helpText":"Speed Index shows how quickly the contents of a page are visibly populated. [Learn more](https://developers.google.com/web/tools/lighthouse/audits/speed-index)."},"screenshot-thumbnails":{"score":100,"displayValue":"true","rawValue":true,"scoringMode":"binary","informative":true,"name":"screenshot-thumbnails","description":"Screenshot Thumbnails","helpText":"This is what the load of your site looked like.","details":{"type":"filmstrip","scale":15727.824,"items":[{"timing":1573,"timestamp":5572943248255.399,"data":"/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRQBAwQEBQQFCQUFCRQNCw0UFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFP/AABEIANUAeAMBEQACEQEDEQH/xAGiAAABBQEBAQEBAQAAAAAAAAAAAQIDBAUGBwgJCgsQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+gEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoLEQACAQIEBAMEBwUEBAABAncAAQIDEQQFITEGEkFRB2FxEyIygQgUQpGhscEJIzNS8BVictEKFiQ04SXxFxgZGiYnKCkqNTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqCg4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2dri4+Tl5ufo6ery8/T19vf4+fr/2gAMAwEAAhEDEQA/AP1ToAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgD//Z"},{"timing":3146,"timestamp":5572944821037.8,"data":"/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRQBAwQEBQQFCQUFCRQNCw0UFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFP/AABEIANUAeAMBEQACEQEDEQH/xAGiAAABBQEBAQEBAQAAAAAAAAAAAQIDBAUGBwgJCgsQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+gEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoLEQACAQIEBAMEBwUEBAABAncAAQIDEQQFITEGEkFRB2FxEyIygQgUQpGhscEJIzNS8BVictEKFiQ04SXxFxgZGiYnKCkqNTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqCg4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2dri4+Tl5ufo6ery8/T19vf4+fr/2gAMAwEAAhEDEQA/APsLwD4C8M3fgXw5PP4d0meeXTbaR5JbGJmZjEpJJK5JJNfDYfD0nSj7vbouz8z82wmEoOhT/dx+FdF2Xkb3/CuvCf8A0K+i/wDgvi/+Jrq+rUf5fwX+Z2fU6H/PuP3L/IP+FdeE/wDoV9F/8F8X/wATR9Wo/wAv4L/MPqdD/n3H7l/kH/CuvCf/AEK+i/8Agvi/+Jo+rUf5fwX+YfU6H/PuP3L/ACD/AIV14T/6FfRf/BfF/wDE0fVqP8v4L/MPqdD/AJ9x+5f5FXU/B/gbRbRrrUND8PWNspAaa5s4I0BPA5KgVUcJTm7Rhd+iJlhcPBXlCP3L/IzGtfhciyM0HhBVjCly0dqNoYAqTxwCCCD3yMVr/Z9nb2T/APASPYYTflj9y/yL1x4Y8A2gYzaN4cTbtLA2cGVDEAEjbwORz6c9KhYOD+x+C/zKeGwy+xH7l1+Q9/CfgOMTF9G8NoIX8uUta248t+flbjg8Hg+ho+pw/k/Bf5h9Ww38kfuX+Q+38GeCLxisGheHpypKkRWcDYI6g4Xr7VLwtKO8PwQ1hcPLaEfuX+RZ/wCFdeE/+hX0X/wXxf8AxNT9Wo/y/gv8yvqdD/n3H7l/kH/CuvCf/Qr6L/4L4v8A4mj6tR/l/Bf5h9Tof8+4/cv8g/4V14T/AOhX0X/wXxf/ABNH1aj/AC/gv8w+p0P+fcfuX+RHH4C8HyyskfhrRJDG22TZYQnYcAgH5euGBx6Eeoynh6XSP4L/ADNoYDDuzcUu3ur/ACKeo+A/Ckug3c6eFtJt5Ps7ttawhDxttJwcDqD3H4VUaFK/wr7vMl4KjF6wXTZLv6Iv/Dr/AJJ74X/7BVr/AOilpYb+DH5fkzPB/wACn/hX5I6Guo7QoAKACgDm/HFlqNxaadd6VD5+oWF2LiNflIXMUkZO1mQPxJjbvTrnccbW6sPOEW1N2TXn38jmrwlJJxW3+VjnvDPwrutA8O2MUepR2+rwTR3ayeR5sMUgs1tnXbuXf8ocq3y4JHBAIbqrY1yk+q06tPRt/qY0sLaK6PXzOh0zwUuk2ttZwXjiztoreKNCvzOIjHhnIOCxEQGQB17gADkeIlKTm1rv9+huqEYqyeliWz8JR211ZTNcGUWRVYUKAfIFcANj7zZfO7HboMkkdeWtkRHDRVrsn0Dw6NCMv+kNcbkSJS5YlUTdtHzMefmPTA9AKzqVPaWNadNU7mxWRsFAAKAKEjT6fPcOtrLerM6uBD5alTtCkEMV4+UHOSeSOABU7G7kpxV3a2hFqUBi0TVHcbZZopJHAbIB8vbxn2Ufjk96pLVfL8yJWbVnt/mUvh1/yT3wv/2CrX/0UtcuG/gx+X5M87B/wKf+Ffkjoa6jtCgAoAKACgAoAKACgAoAKACgAoAKAIby2F7Zz25baJY2TPpkYoW69V+Y1/X3mJ8Ov+Se+F/+wVa/+ilrlw38GPy/JnDg/wCBT/wr8kdDXUdoUAFABQAUAFABQAUAFABQAUAFABQAo60Ldeq/Ma/r7znfh1/yT3wv/wBgq1/9FLXLhv4Mfl+TOHB/wKf+Ffkjoa6jtCgAoAKACgAoAKACgAoAKACgAoAKAFHWhbr1X5jX9fec78Ov+Se+F/8AsFWv/opa5cN/Bj8vyZw4P+BT/wAK/JHQ11HaFABQAUAFABQAUAFABQAUAFABQAUAKOtC3XqvzGv6+8534df8k98L/wDYKtf/AEUtcuG/gx+X5M4cH/Ap/wCFfkjoa6jtCgAoAKACgAoAKACgAoAKACgAoAKAFHWhbr1X5jX9fec78Ov+Se+F/wDsFWv/AKKWuXDfwY/L8mcOD/gU/wDCvyR0NdR2hQAUAFABQAUAFABQAUAFABQAUAFACjrQt16r8xr+vvOd+HX/ACT3wv8A9gq1/wDRS1y4b+DH5fkzhwf8Cn/hX5I6Guo7QoAKACgAoAKACgAoAKACgAoAKACgBR1oW69V+Y1/X3nO/Dr/AJJ74X/7BVr/AOilrlw38GPy/JnDg/4FP/CvyR0NdR2hQAUAFABQAUAFABQAUAFABQAUAFACjrQt16r8xr+vvOd+HX/JPfC//YKtf/RS1y4b+DH5fkzhwf8AAp/4V+SOhrqO0KACgAoAKACgAoAKACgAoAKACgAoAUdaFuvVfmNf195zvw6/5J74X/7BVr/6KWuXDfwY/L8mcOD/AIFP/CvyR0NdR2hQAUAFABQAUAFABQAUAFABQAUAFACjrQt16r8xr+vvOd+HX/JPfC//AGCrX/0UtcuG/gx+X5M4cH/Ap/4V+SOhrqO0KACgAoAKACgAoAKACgAoAKACgAoAUdaFuvVfmNf195zvw6/5J74X/wCwVa/+ilrlw38GPy/JnDg/4FP/AAr8kdDXUdoUAFABQAUAFABQAUAFABQAUAFABQAo60Ldeq/Ma/r7znfh1/yT3wv/ANgq1/8ARS1y4b+DH5fkzhwf8Cn/AIV+SOhrqO0KACgAoAoat4g0vQEifVNTs9NWUkIbu4SIMR1xuIz1FJtLc2pUK1dtUYOXormb/wALG8Jf9DTov/gwi/8Aiqnmj3Oj6hjf+fE//AWH/CxvCX/Q06L/AODCL/4qjmj3D6hjf+fE/wDwFh/wsbwl/wBDTov/AIMIv/iqOaPcPqGN/wCfE/8AwFl7SfFGja9K8WmavYajKi7mS0uUlKj1IUnAppp7GNTDV6NvbU3G/dNGnVHOFABQAUAKOtC3XqvzGv6+8534df8AJPfC/wD2CrX/ANFLXLhv4Mfl+TOHB/wKf+Ffkjoa6jtCgAoAKAPn39rb/j18Mf71z/7Srlr7I+74Tv8AWKtv5V+f/DHzjmuM/TLPsGaAs+wZNAWfY9r/AGU8/wDCdap/2DW/9Gx11UN2fB8Vq1Gn6v8AQ+pa7D8zQUDCgAoAUdaFuvVfmNf195zvw6/5J74X/wCwVa/+ilrlw38GPy/JnDg/4FP/AAr8kdDXUdoUAFABQByPxD+GGkfEy3sotVlu4fsjM0b2kiq3zYyDuVhj5R2zx165iUFNanq5fmVbLZudJJ3VndP9GjiP+GVfCX/P/rX/AH/i/wDjVZexie9/rVi/5I/j/wDJB/wyr4S/5/8AWv8Av/F/8ao9jEP9asX/ACR/H/5IP+GVfCX/AEENa/7/AMX/AMao9jEP9asX/JH8f/kjqvh78G9C+G2oXN7ps19cXE8XklruVW2rkEgBVXqQOuen1zpCChseRmGb1syjGNWKVu1/Lu32O7rQ8MKACgAoAUdaFuvVfmNf195zvw6/5J74X/7BVr/6KWuXDfwY/L8mcOD/AIFP/CvyR0NdR2hQAUAFABQAUAFABQAUAFABQAUAFACjrQt16r8xr+vvOd+HX/JPfC//AGCrX/0UtcuG/gx+X5M4cH/Ap/4V+SOhrqO0KACgAoAKACgAoAKACgAoAKACgAoAUdaFuvVfmNf195zvw6/5J74X/wCwVa/+ilrlw38GPy/JnDg/4FP/AAr8kdDXUdoUAFABQAUAFABQAUAFABQAUAFABQAo60Ldeq/Ma/r7znfh1/yT3wv/ANgq1/8ARS1y4b+DH5fkzhwf8Cn/AIV+SOhrqO0KACgAoAKACgAoAKACgAoAKACgAoAUdaFuvVfmNf195zvw6/5J74X/AOwVa/8Aopa5cN/Bj8vyZw4P+BT/AMK/JHQ11HaFABQAUAFABQAUAFABQAUAFABQAUAKOtC3XqvzGv6+8534df8AJPfC/wD2CrX/ANFLXLhv4Mfl+TOHB/wKf+Ffkjoa6jtCgAoAKACgAoAKACgAoAKACgAoAKAFHWhbr1X5jX9fec78Ov8Aknvhf/sFWv8A6KWuXDfwY/L8mcOD/gU/8K/JHQ11HaFABQAUAFABQAUAFABQAUAFABQAUAKOtC3XqvzGv6+8534df8k98L/9gq1/9FLXLhv4Mfl+TOHB/wACn/hX5I6Guo7QoAKACgAoAKACgAoAKACgAoAKACgBR1oW69V+Y1/X3nO/Dr/knvhf/sFWv/opa5cN/Bj8vyZw4P8AgU/8K/JHQ11HaFABQAUAFABQAUAFABQAUAFABQAUAKOtC3XqvzGv6+8534df8k98L/8AYKtf/RS1y4b+DH5fkzhwf8Cn/hX5I6Guo7QoAKACgAoAKACgAoAKACgAoAKACgBR1oW69V+Y1/X3n//Z"},{"timing":4718,"timestamp":5572946393820.2,"data":"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"},{"timing":6291,"timestamp":5572947966602.6,"data":"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"},{"timing":7864,"timestamp":5572949539384.999,"data":"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"},{"timing":9437,"timestamp":5572951112167.399,"data":"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"},{"timing":11009,"timestamp":5572952684949.8,"data":"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"},{"timing":12582,"timestamp":5572954257732.199,"data":"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"},{"timing":14155,"timestamp":5572955830514.6,"data":"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"},{"timing":15728,"timestamp":5572957403297,"data":"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"}]}},"estimated-input-latency":{"score":0,"displayValue":"335 ms","rawValue":334.7,"extendedInfo":{"value":[{"percentile":0.5,"time":22.65368636363633},{"percentile":0.75,"time":105.58507142857127},{"percentile":0.9,"time":334.72011428571386},{"percentile":0.99,"time":716.0876899999994},{"percentile":1,"time":825.2909999999993}]},"scoringMode":"numeric","name":"estimated-input-latency","description":"Estimated Input Latency","helpText":"The score above is an estimate of how long your app takes to respond to user input, in milliseconds. There is a 90% probability that a user encounters this amount of latency, or less. 10% of the time a user can expect additional latency. If your latency is higher than 50 ms, users may perceive your app as laggy. [Learn more](https://developers.google.com/web/tools/lighthouse/audits/estimated-input-latency)."},"errors-in-console":{"score":true,"displayValue":"","rawValue":0,"scoringMode":"binary","name":"errors-in-console","description":"No browser errors logged to the console","helpText":"Errors logged to the console indicate unresolved problems. They can come from network request failures and other browser concerns.","details":{"type":"table","header":"View Details","itemHeaders":[{"type":"text","itemType":"url","text":"URL"},{"type":"text","itemType":"code","text":"Description"}],"items":[]}},"time-to-first-byte":{"score":true,"displayValue":"570 ms","rawValue":566.087,"debugString":"","extendedInfo":{"value":{"wastedMs":-33.91300000000001}},"scoringMode":"binary","informative":true,"name":"time-to-first-byte","description":"Keep server response times low (TTFB)","helpText":"Time To First Byte identifies the time at which your server sends a response. [Learn more](https://developers.google.com/web/tools/chrome-devtools/network-performance/issues)."},"first-interactive":{"score":28,"displayValue":"15,730 ms","rawValue":15727.824,"extendedInfo":{"value":{"timeInMs":15727.824,"timestamp":5572957403297}},"scoringMode":"numeric","name":"first-interactive","description":"First Interactive (beta)","helpText":"First Interactive marks the time at which the page is minimally interactive. [Learn more](https://developers.google.com/web/tools/lighthouse/audits/first-interactive)."},"consistently-interactive":{"score":null,"displayValue":"","rawValue":null,"error":true,"debugString":"Your page took too long to load. Please follow the opportunities in the report to reduce your page load time, and then try re-running Lighthouse. (NO_TTI_CPU_IDLE_PERIOD)","scoringMode":"numeric","name":"consistently-interactive","description":"Consistently Interactive (beta)","helpText":"Consistently Interactive marks the time at which the page is fully interactive. [Learn more](https://developers.google.com/web/tools/lighthouse/audits/consistently-interactive)."},"user-timings":{"score":true,"displayValue":"0","rawValue":true,"extendedInfo":{"value":[]},"scoringMode":"binary","informative":true,"name":"user-timings","description":"User Timing marks and measures","helpText":"Consider instrumenting your app with the User Timing API to create custom, real-world measurements of key user experiences. [Learn more](https://developers.google.com/web/tools/lighthouse/audits/user-timing).","details":{"type":"table","header":"View Details","itemHeaders":[{"type":"text","itemType":"text","text":"Name"},{"type":"text","itemType":"text","text":"Type"},{"type":"text","itemType":"text","text":"Time"}],"items":[]}},"critical-request-chains":{"score":false,"displayValue":"12","rawValue":false,"extendedInfo":{"value":{"chains":{"D37A6228DF01ED95595A7BB5509658B1":{"request":{"url":"https://www.gro-store.com/","startTime":5572941.677642,"endTime":5572942.59458,"responseReceivedTime":5572942.45782,"transferSize":26148},"children":{"123.2":{"request":{"url":"https://www.gro-store.com/static/version1524047115/_cache/merged/12a02713855ed25d85717a28b9d29ba6.min.css","startTime":5572942.633267,"endTime":5572943.547947,"responseReceivedTime":5572943.197583,"transferSize":10511},"children":{}},"123.3":{"request":{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/css/styles.min.css","startTime":5572942.634148,"endTime":5572943.926141,"responseReceivedTime":5572943.205242,"transferSize":63853},"children":{}},"123.4":{"request":{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/requirejs/require.js","startTime":5572942.634584,"endTime":5572943.692947,"responseReceivedTime":5572943.220788,"transferSize":20628},"children":{}},"123.5":{"request":{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/mage/requirejs/mixins.js","startTime":5572942.635069,"endTime":5572943.316694,"responseReceivedTime":5572943.229433999,"transferSize":2472},"children":{}},"123.6":{"request":{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/requirejs-config.js","startTime":5572942.63523,"endTime":5572943.484045,"responseReceivedTime":5572943.237009,"transferSize":5424},"children":{}},"123.10":{"request":{"url":"https://fonts.googleapis.com/css?family=Muli:300,300i,400,400i","startTime":5572942.636888,"endTime":5572943.327482,"responseReceivedTime":5572943.324919,"transferSize":977},"children":{}},"123.16":{"request":{"url":"https://cdn.bronto.com/popup/delivery.js","startTime":5572943.693215,"endTime":5572944.487855,"responseReceivedTime":5572944.293028001,"transferSize":4554},"children":{}},"123.17":{"request":{"url":"https://p.bm23.com/bta.js","startTime":5572944.16718,"endTime":5572944.769166,"responseReceivedTime":5572944.7551029995,"transferSize":1394},"children":{}},"123.65":{"request":{"url":"https://fonts.gstatic.com/s/muli/v11/7Auwp_0qiz-afTLGLQjUwkQ.woff2","startTime":5572944.275052,"endTime":5572945.121916,"responseReceivedTime":5572944.898225,"transferSize":11634},"children":{}},"123.62":{"request":{"url":"https://fonts.gstatic.com/s/muli/v11/7Au_p_0qiz-adZnkOCX2z24PMFk.woff2","startTime":5572944.292698,"endTime":5572945.129664,"responseReceivedTime":5572944.905855999,"transferSize":11345},"children":{}},"123.52":{"request":{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/fonts/gro-theme/gro-theme.woff","startTime":5572944.292865,"endTime":5572945.893025,"responseReceivedTime":5572944.866134,"transferSize":32416},"children":{}},"123.335":{"request":{"url":"https://fonts.googleapis.com/css?family=Open+Sans","startTime":5572950.399836,"endTime":5572951.121837,"responseReceivedTime":5572950.415812,"transferSize":0},"children":{}}}}},"longestChain":{"duration":9444.195000454783,"length":2,"transferSize":0}}},"scoringMode":"binary","informative":true,"name":"critical-request-chains","description":"Critical Request Chains","helpText":"The Critical Request Chains below show you what resources are issued with a high priority. Consider reducing the length of chains, reducing the download size of resources, or deferring the download of unnecessary resources to improve page load. [Learn more](https://developers.google.com/web/tools/lighthouse/audits/critical-request-chains).","details":{"type":"criticalrequestchain","header":{"type":"text","text":"View critical network waterfall:"},"chains":{"D37A6228DF01ED95595A7BB5509658B1":{"request":{"url":"https://www.gro-store.com/","startTime":5572941.677642,"endTime":5572942.59458,"responseReceivedTime":5572942.45782,"transferSize":26148},"children":{"123.2":{"request":{"url":"https://www.gro-store.com/static/version1524047115/_cache/merged/12a02713855ed25d85717a28b9d29ba6.min.css","startTime":5572942.633267,"endTime":5572943.547947,"responseReceivedTime":5572943.197583,"transferSize":10511},"children":{}},"123.3":{"request":{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/css/styles.min.css","startTime":5572942.634148,"endTime":5572943.926141,"responseReceivedTime":5572943.205242,"transferSize":63853},"children":{}},"123.4":{"request":{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/requirejs/require.js","startTime":5572942.634584,"endTime":5572943.692947,"responseReceivedTime":5572943.220788,"transferSize":20628},"children":{}},"123.5":{"request":{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/mage/requirejs/mixins.js","startTime":5572942.635069,"endTime":5572943.316694,"responseReceivedTime":5572943.229433999,"transferSize":2472},"children":{}},"123.6":{"request":{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/requirejs-config.js","startTime":5572942.63523,"endTime":5572943.484045,"responseReceivedTime":5572943.237009,"transferSize":5424},"children":{}},"123.10":{"request":{"url":"https://fonts.googleapis.com/css?family=Muli:300,300i,400,400i","startTime":5572942.636888,"endTime":5572943.327482,"responseReceivedTime":5572943.324919,"transferSize":977},"children":{}},"123.16":{"request":{"url":"https://cdn.bronto.com/popup/delivery.js","startTime":5572943.693215,"endTime":5572944.487855,"responseReceivedTime":5572944.293028001,"transferSize":4554},"children":{}},"123.17":{"request":{"url":"https://p.bm23.com/bta.js","startTime":5572944.16718,"endTime":5572944.769166,"responseReceivedTime":5572944.7551029995,"transferSize":1394},"children":{}},"123.65":{"request":{"url":"https://fonts.gstatic.com/s/muli/v11/7Auwp_0qiz-afTLGLQjUwkQ.woff2","startTime":5572944.275052,"endTime":5572945.121916,"responseReceivedTime":5572944.898225,"transferSize":11634},"children":{}},"123.62":{"request":{"url":"https://fonts.gstatic.com/s/muli/v11/7Au_p_0qiz-adZnkOCX2z24PMFk.woff2","startTime":5572944.292698,"endTime":5572945.129664,"responseReceivedTime":5572944.905855999,"transferSize":11345},"children":{}},"123.52":{"request":{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/fonts/gro-theme/gro-theme.woff","startTime":5572944.292865,"endTime":5572945.893025,"responseReceivedTime":5572944.866134,"transferSize":32416},"children":{}},"123.335":{"request":{"url":"https://fonts.googleapis.com/css?family=Open+Sans","startTime":5572950.399836,"endTime":5572951.121837,"responseReceivedTime":5572950.415812,"transferSize":0},"children":{}}}}},"longestChain":{"duration":9444.195000454783,"length":2,"transferSize":0}}},"redirects":{"score":100,"displayValue":"0 ms","rawValue":0,"extendedInfo":{"value":{"wastedMs":0}},"scoringMode":"binary","name":"redirects","description":"Avoids page redirects","helpText":"Redirects introduce additional delays before the page can be loaded. [Learn more](https://developers.google.com/speed/docs/insights/AvoidRedirects).","details":{"type":"table","header":"View Details","itemHeaders":[{"type":"text","itemType":"text","text":"Redirected URL"},{"type":"text","itemType":"text","text":"Time for Redirect"}],"items":[]}},"webapp-install-banner":{"score":true,"displayValue":"","rawValue":true,"extendedInfo":{"value":{"warnings":[],"failures":[],"manifestValues":{"isParseFailure":false,"allChecks":[{"id":"hasStartUrl","failureText":"Manifest does not contain a `start_url`","passing":true},{"id":"hasIconsAtLeast192px","failureText":"Manifest does not have icons at least 192px","passing":true},{"id":"hasIconsAtLeast512px","failureText":"Manifest does not have icons at least 512px","passing":true},{"id":"hasPWADisplayValue","failureText":"Manifest's `display` value is not one of: minimal-ui | fullscreen | standalone","passing":true},{"id":"hasBackgroundColor","failureText":"Manifest does not have `background_color`","passing":true},{"id":"hasThemeColor","failureText":"Manifest does not have `theme_color`","passing":true},{"id":"hasShortName","failureText":"Manifest does not have `short_name`","passing":true},{"id":"shortNameLength","failureText":"Manifest `short_name` will be truncated when displayed on the homescreen","passing":true},{"id":"hasName","failureText":"Manifest does not have `name`","passing":true}]}}},"scoringMode":"binary","name":"webapp-install-banner","description":"User can be prompted to Install the Web App","helpText":"Browsers can proactively prompt users to add your app to their homescreen, which can lead to higher engagement. [Learn more](https://developers.google.com/web/tools/lighthouse/audits/install-prompt)."},"splash-screen":{"score":true,"displayValue":"","rawValue":true,"extendedInfo":{"value":{"failures":[],"manifestValues":{"isParseFailure":false,"allChecks":[{"id":"hasStartUrl","failureText":"Manifest does not contain a `start_url`","passing":true},{"id":"hasIconsAtLeast192px","failureText":"Manifest does not have icons at least 192px","passing":true},{"id":"hasIconsAtLeast512px","failureText":"Manifest does not have icons at least 512px","passing":true},{"id":"hasPWADisplayValue","failureText":"Manifest's `display` value is not one of: minimal-ui | fullscreen | standalone","passing":true},{"id":"hasBackgroundColor","failureText":"Manifest does not have `background_color`","passing":true},{"id":"hasThemeColor","failureText":"Manifest does not have `theme_color`","passing":true},{"id":"hasShortName","failureText":"Manifest does not have `short_name`","passing":true},{"id":"shortNameLength","failureText":"Manifest `short_name` will be truncated when displayed on the homescreen","passing":true},{"id":"hasName","failureText":"Manifest does not have `name`","passing":true}]}}},"scoringMode":"binary","name":"splash-screen","description":"Configured for a custom splash screen","helpText":"A themed splash screen ensures a high-quality experience when users launch your app from their homescreens. [Learn more](https://developers.google.com/web/tools/lighthouse/audits/custom-splash-screen)."},"themed-omnibox":{"score":true,"displayValue":"","rawValue":true,"extendedInfo":{"value":{"failures":[],"manifestValues":{"isParseFailure":false,"allChecks":[{"id":"hasStartUrl","failureText":"Manifest does not contain a `start_url`","passing":true},{"id":"hasIconsAtLeast192px","failureText":"Manifest does not have icons at least 192px","passing":true},{"id":"hasIconsAtLeast512px","failureText":"Manifest does not have icons at least 512px","passing":true},{"id":"hasPWADisplayValue","failureText":"Manifest's `display` value is not one of: minimal-ui | fullscreen | standalone","passing":true},{"id":"hasBackgroundColor","failureText":"Manifest does not have `background_color`","passing":true},{"id":"hasThemeColor","failureText":"Manifest does not have `theme_color`","passing":true},{"id":"hasShortName","failureText":"Manifest does not have `short_name`","passing":true},{"id":"shortNameLength","failureText":"Manifest `short_name` will be truncated when displayed on the homescreen","passing":true},{"id":"hasName","failureText":"Manifest does not have `name`","passing":true}]},"themeColor":"#ffffff"}},"scoringMode":"binary","name":"themed-omnibox","description":"Address bar matches brand colors","helpText":"The browser address bar can be themed to match your site. [Learn more](https://developers.google.com/web/tools/lighthouse/audits/address-bar)."},"manifest-short-name-length":{"score":true,"displayValue":"","rawValue":true,"scoringMode":"binary","name":"manifest-short-name-length","description":"Manifest's `short_name` won't be truncated when displayed on homescreen","helpText":"Make your app's `short_name` fewer than 12 characters to ensure that it's not truncated on homescreens. [Learn more](https://developers.google.com/web/tools/lighthouse/audits/manifest-short_name-is-not-truncated)."},"content-width":{"score":true,"displayValue":"","rawValue":true,"debugString":"","scoringMode":"binary","name":"content-width","description":"Content is sized correctly for the viewport","helpText":"If the width of your app's content doesn't match the width of the viewport, your app might not be optimized for mobile screens. [Learn more](https://developers.google.com/web/tools/lighthouse/audits/content-sized-correctly-for-viewport)."},"image-aspect-ratio":{"score":false,"displayValue":"","rawValue":false,"scoringMode":"binary","name":"image-aspect-ratio","description":"Displays images with incorrect aspect ratio","helpText":"Image display dimensions should match natural aspect ratio.","details":{"type":"table","header":"View Details","itemHeaders":[{"type":"text","itemType":"thumbnail","text":""},{"type":"text","itemType":"url","text":"URL"},{"type":"text","itemType":"text","text":"Aspect Ratio (Displayed)"},{"type":"text","itemType":"text","text":"Aspect Ratio (Actual)"}],"items":[[{"type":"thumbnail","url":"data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==","mimeType":"image/gif"},{"type":"url","text":"data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw=="},{"type":"text","text":"387 x 480\n        (0.81)"},{"type":"text","text":"1 x 1\n        (1.00)"}]]}},"deprecations":{"score":true,"displayValue":"","rawValue":true,"extendedInfo":{"value":[]},"scoringMode":"binary","name":"deprecations","description":"Avoids deprecated APIs","helpText":"Deprecated APIs will eventually be removed from the browser. [Learn more](https://www.chromestatus.com/features#deprecated).","details":{"type":"table","header":"View Details","itemHeaders":[{"type":"text","itemType":"code","text":"Deprecation / Warning"},{"type":"text","itemType":"url","text":"URL"},{"type":"text","itemType":"text","text":"Line"}],"items":[]}},"mainthread-work-breakdown":{"score":false,"displayValue":"6,340 ms","rawValue":6337.2539920806885,"extendedInfo":{"value":{"Evaluate Script":1893.7790050506592,"Recalculate Style":1003.1329965591431,"Compile Script":957.1619958877563,"Layout":826.0839996337891,"DOM GC":278.29199981689453,"XHR Ready State Change":260.6349983215332,"Update Layer Tree":244.46999645233154,"Parse Stylesheet":224.8430004119873,"Parse HTML":166.1140022277832,"Major GC":142.97300148010254,"Minor GC":133.15799713134766,"Paint":88.06700325012207,"Composite Layers":72.54199886322021,"Run Microtasks":45.8539981842041,"XHR Load":0.14799880981445312}},"scoringMode":"binary","informative":true,"name":"mainthread-work-breakdown","description":"Main thread work breakdown","helpText":"Consider reducing the time spent parsing, compiling and executing JS.You may find delivering smaller JS payloads helps with this.","details":{"type":"table","header":"View Details","itemHeaders":[{"type":"text","itemType":"text","text":"Category"},{"type":"text","itemType":"text","text":"Work"},{"type":"text","itemType":"text","text":"Time spent"}],"items":[[{"type":"text","text":"Script Evaluation"},{"type":"text","text":"Evaluate Script"},{"type":"text","text":"1,894 ms"}],[{"type":"text","text":"Script Evaluation"},{"type":"text","text":"XHR Ready State Change"},{"type":"text","text":"261 ms"}],[{"type":"text","text":"Script Evaluation"},{"type":"text","text":"Run Microtasks"},{"type":"text","text":"46 ms"}],[{"type":"text","text":"Script Evaluation"},{"type":"text","text":"XHR Load"},{"type":"text","text":"0 ms"}],[{"type":"text","text":"Style & Layout"},{"type":"text","text":"Recalculate Style"},{"type":"text","text":"1,003 ms"}],[{"type":"text","text":"Style & Layout"},{"type":"text","text":"Layout"},{"type":"text","text":"826 ms"}],[{"type":"text","text":"Script Parsing & Compile"},{"type":"text","text":"Compile Script"},{"type":"text","text":"957 ms"}],[{"type":"text","text":"Garbage collection"},{"type":"text","text":"DOM GC"},{"type":"text","text":"278 ms"}],[{"type":"text","text":"Garbage collection"},{"type":"text","text":"Major GC"},{"type":"text","text":"143 ms"}],[{"type":"text","text":"Garbage collection"},{"type":"text","text":"Minor GC"},{"type":"text","text":"133 ms"}],[{"type":"text","text":"Parsing HTML & CSS"},{"type":"text","text":"Parse Stylesheet"},{"type":"text","text":"225 ms"}],[{"type":"text","text":"Parsing HTML & CSS"},{"type":"text","text":"Parse HTML"},{"type":"text","text":"166 ms"}],[{"type":"text","text":"Compositing"},{"type":"text","text":"Update Layer Tree"},{"type":"text","text":"244 ms"}],[{"type":"text","text":"Compositing"},{"type":"text","text":"Composite Layers"},{"type":"text","text":"73 ms"}],[{"type":"text","text":"Paint"},{"type":"text","text":"Paint"},{"type":"text","text":"88 ms"}]]}},"bootup-time":{"score":false,"displayValue":"4,180 ms","rawValue":4184.648995399475,"extendedInfo":{"value":{"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/jquery.js":{"Style & Layout":512.3880004882812,"Script Evaluation":272.1110019683838,"Script Parsing & Compile":0.6739997863769531},"https://www.google-analytics.com/plugins/ua/ec.js":{"Script Evaluation":501.8380002975464,"Script Parsing & Compile":1.9879999160766602},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Algolia_AlgoliaSearch/internals/algoliaBundle.min.js":{"Script Parsing & Compile":217.16599941253662,"Style & Layout":240.98199939727783,"Script Evaluation":0.14700031280517578},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/jquery/jquery-ui.js":{"Script Evaluation":193.97700023651123,"Script Parsing & Compile":127.31999969482422,"Style & Layout":33.42599868774414},"https://staticw2.yotpo.com/INNN2oWNqTDW3UgadN2pKPYnIMdqgHgCGdRgUe1e/widget.js":{"Script Evaluation":116.5989990234375,"Script Parsing & Compile":106.96500015258789,"Style & Layout":0.17399978637695312},"https://connect.nosto.com/public/javascripts/jquery-1.7.1.min.js":{"Script Evaluation":104.74599647521973,"Script Parsing & Compile":66.20900058746338,"Style & Layout":47.05099964141846},"https://www.gro-store.com/":{"Parsing HTML & CSS":161.24100017547607,"Script Evaluation":27.91200065612793,"Script Parsing & Compile":4.291999816894531},"https://connect.nosto.com/include/gro-uk-magento2":{"Script Evaluation":147.22600173950195,"Style & Layout":30.438997268676758,"Script Parsing & Compile":2.689000129699707},"https://connect.nosto.com/ev1?c=null&m=gro-uk-magento2&data=%7B%22ev%22%3A%5B%5D%2C%22el%22%3A%5B%22frontpage-nosto-1%22%2C%22frontpage-nosto-2%22%2C%22frontpage-nosto-3%22%2C%22frontpage-nosto-4%22%5D%2C%22cats%22%3A%5B%5D%2C%22tags%22%3A%5B%5D%2C%22fields%22%3A%5B%5D%2C%22oc%22%3Afalse%2C%22ptp%22%3A%22front%22%7D&cb=cb3970":{"Script Evaluation":141.06100177764893,"Script Parsing & Compile":1.601999282836914},"https://www.google-analytics.com/analytics.js":{"Script Evaluation":125.03700065612793,"Script Parsing & Compile":10.14699935913086,"Style & Layout":0.09599971771240234},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Checkout/template/minicart/content.html":{"Script Evaluation":77.677001953125},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/knockoutjs/knockout.js":{"Script Parsing & Compile":51.18100070953369,"Style & Layout":6.797000885009766,"Script Evaluation":3.3779993057250977},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/requirejs/require.js":{"Style & Layout":47.61199951171875,"Script Evaluation":7.867000579833984,"Script Parsing & Compile":0.5319995880126953},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Gene_AjaxLogin/template/ajax-login.html":{"Script Evaluation":55.39200019836426},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/requirejs-config.js":{"Script Evaluation":30.909000396728516,"Script Parsing & Compile":13.605999946594238},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/moment.js":{"Script Parsing & Compile":34.42500019073486,"Script Evaluation":5.943999290466309},"https://connect.nosto.com/ev1/push?m=gro-uk-magento2&c=5adf5b7960b22111780429b6":{"Script Evaluation":23.196998596191406},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/mage/bootstrap.js":{"Script Evaluation":18.520000457763672,"Script Parsing & Compile":0.5710000991821289},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/jquery/jquery-migrate.js":{"Script Evaluation":13.33899974822998,"Script Parsing & Compile":5.421999931335449},"https://www.gro-store.com/banner/ajax/load/?sections=&_=1524587388698":{"Script Evaluation":18.16599941253662},"https://connect.nosto.com/public/javascripts/clipboard.min.js":{"Script Evaluation":11.675000190734863,"Script Parsing & Compile":5.984000205993652},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Gene_AjaxLogin/template/ajax-login-messages.html":{"Script Evaluation":17.445999145507812},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/underscore.js":{"Script Parsing & Compile":10.63800048828125,"Script Evaluation":6.710999488830566},"https://www.gro-store.com/customer/section/load/?sections=cart&update_section_id=false&_=1524587388700":{"Script Evaluation":16.98200035095215},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/mage/requirejs/mixins.js":{"Script Evaluation":14.829999923706055,"Script Parsing & Compile":2.0789995193481445},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/templates/collection.html":{"Script Evaluation":16.887999534606934},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/logger/console-logger.js":{"Script Parsing & Compile":8.937999725341797,"Script Evaluation":6.72499942779541},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/templates/block-loader.html":{"Script Evaluation":15.012001037597656},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/jquery/jquery-ui-timepicker-addon.js":{"Script Parsing & Compile":12.801000595092773,"Script Evaluation":1.2459993362426758},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/knockout/bindings/optgroup.js":{"Script Parsing & Compile":8.145999908447266,"Script Evaluation":1.5669994354248047},"https://cdn.bronto.com/popup/polyfills.js":{"Script Parsing & Compile":5.651000022888184,"Script Evaluation":3.857998847961426,"Style & Layout":0.06500053405761719},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/jquery/jquery.mobile.custom.js":{"Script Parsing & Compile":9.227999687194824,"Script Evaluation":0.22299957275390625},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/knockout/bindings/tooltip.js":{"Script Parsing & Compile":7.64900016784668,"Script Evaluation":1.625},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/form/form.js":{"Script Parsing & Compile":5.027000427246094,"Script Evaluation":2.721999168395996},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/MutationObserver.js":{"Script Parsing & Compile":5.421999931335449,"Script Evaluation":2.219000816345215},"https://cdn.bronto.com/popup/delivery.js":{"Script Parsing & Compile":7.043000221252441,"Script Evaluation":0.22299957275390625},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/mage/utils/compare.js":{"Script Parsing & Compile":6.003000259399414,"Script Evaluation":0.6700000762939453},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/knockoutjs/knockout-es5.js":{"Script Parsing & Compile":6.136000633239746,"Script Evaluation":0.3859996795654297},"https://www.gro-store.com/customer/section/load/?sections=cart&update_section_id=false&_=1524587388699":{"Script Evaluation":6.11299991607666},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/core/element/element.js":{"Script Parsing & Compile":4.857000350952148,"Script Evaluation":1.040999412536621},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/modal/modal.js":{"Script Evaluation":3.1190004348754883,"Script Parsing & Compile":2.727999687194824},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/js-translation.json":{"Script Evaluation":5.775998115539551},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/view/utils/dom-observer.js":{"Script Parsing & Compile":5.201999664306641,"Script Evaluation":0.28800106048583984},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/mage/validation.js":{"Script Evaluation":3.7740001678466797,"Script Parsing & Compile":1.7049999237060547},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/view/utils/async.js":{"Script Parsing & Compile":3.5310001373291016,"Script Evaluation":1.920999526977539},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/knockout/bindings/bootstrap.js":{"Script Evaluation":4.095999717712402,"Script Parsing & Compile":1.2470006942749023},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/knockout/template/renderer.js":{"Script Parsing & Compile":4.10099983215332,"Script Evaluation":1.2249994277954102},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/jquery/jquery.storageapi.min.js":{"Script Parsing & Compile":5.1449995040893555,"Script Evaluation":0.13200092315673828},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/knockout/extender/bound-nodes.js":{"Script Evaluation":3.2799997329711914,"Script Parsing & Compile":1.7139997482299805},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/knockout/bindings/i18n.js":{"Script Parsing & Compile":4.4850006103515625,"Script Evaluation":0.4549989700317383},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/mage/utils/objects.js":{"Script Parsing & Compile":4.189000129699707,"Script Evaluation":0.6459999084472656},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/mage/cookies.js":{"Script Parsing & Compile":4.319000244140625,"Script Evaluation":0.4389991760253906},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/templates/modal/modal-popup.html":{"Script Evaluation":4.718999862670898},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/mage/validation/validation.js":{"Script Parsing & Compile":3.685000419616699,"Script Evaluation":0.9509992599487305},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/view/utils/bindings.js":{"Script Parsing & Compile":3.9700002670288086,"Script Evaluation":0.6450004577636719},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Customer/js/customer-data.js":{"Script Evaluation":3.447999954223633,"Script Parsing & Compile":1.0909996032714844},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Banner/js/model/banner.js":{"Script Parsing & Compile":3.385000228881836,"Script Evaluation":1.060999870300293},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Nosto_Tagging/js/recobuy.js":{"Script Parsing & Compile":3.2819995880126953,"Script Evaluation":1.1390008926391602},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/mage/translate-inline.js":{"Script Parsing & Compile":2.8650007247924805,"Script Evaluation":1.4709997177124023},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/core/renderer/layout.js":{"Script Parsing & Compile":4.005999565124512,"Script Evaluation":0.30700016021728516},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Search/form-mini.js":{"Script Parsing & Compile":3.928999900817871,"Script Evaluation":0.35200023651123047},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/mage/calendar.js":{"Script Parsing & Compile":3.3239994049072266,"Script Evaluation":0.8170003890991211},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/mage/dropdown.js":{"Script Parsing & Compile":2.7810001373291016,"Script Evaluation":1.2980003356933594},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/knockout/bindings/collapsible.js":{"Script Parsing & Compile":2.9230003356933594,"Script Evaluation":1.037999153137207},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/block-loader.js":{"Script Parsing & Compile":3.1969995498657227,"Script Evaluation":0.7290000915527344},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_PageCache/js/page-cache.js":{"Script Evaluation":3.2899999618530273,"Script Parsing & Compile":0.6110000610351562},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/knockout/template/engine.js":{"Script Parsing & Compile":2.202000617980957,"Script Evaluation":1.6369991302490234},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/mage/smart-keyboard-handler.js":{"Script Evaluation":2.7699995040893555,"Script Parsing & Compile":1.067000389099121},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/knockout/bindings/bind-html.js":{"Script Parsing & Compile":2.1939992904663086,"Script Evaluation":1.6380014419555664},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Gene_Lazyload/js/lazyload.js":{"Script Parsing & Compile":3.1309995651245117,"Script Evaluation":0.6590003967285156},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/knockout/bindings/scope.js":{"Script Evaluation":3.444000244140625,"Script Parsing & Compile":0.3340005874633789},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/mage/requirejs/text.js":{"Script Parsing & Compile":2.6630001068115234,"Script Evaluation":1.059000015258789},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Checkout/js/view/minicart.js":{"Script Parsing & Compile":2.268000602722168,"Script Evaluation":1.4489994049072266},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/mage/loader.js":{"Script Parsing & Compile":2.0669994354248047,"Script Evaluation":1.5960006713867188},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Checkout/js/sidebar.js":{"Script Parsing & Compile":2.6009998321533203,"Script Evaluation":1.0400009155273438},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/core/element/links.js":{"Script Parsing & Compile":2.9990005493164062,"Script Evaluation":0.5799989700317383},"https://connect.nosto.com/overlay/discount-modal/show?callback=jQuery1710670616150176853_1524587387798&account=gro-uk-magento2&c=5adf5b7960b22111780429b6&campaignId=10%25+Off+2+Items&cartSize=0&cartTotal=0&preview=false&_=1524587389052":{"Script Parsing & Compile":3.4170007705688477,"Script Evaluation":0.1419992446899414},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/core/storage/local.js":{"Script Evaluation":2.0240001678466797,"Script Parsing & Compile":1.4700002670288086},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/mage/tabs.js":{"Script Parsing & Compile":2.158999443054199,"Script Evaluation":1.260000228881836},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/mage/utils/wrapper.js":{"Script Evaluation":3.1439990997314453,"Script Parsing & Compile":0.2330007553100586},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Theme/js/view/messages.js":{"Script Parsing & Compile":1.751999855041504,"Script Evaluation":1.5959997177124023},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/modal/alert.js":{"Script Evaluation":3.1819992065429688,"Script Parsing & Compile":0.1620006561279297},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/knockout/template/observable_source.js":{"Script Evaluation":3.1619997024536133,"Script Parsing & Compile":0.10300064086914062},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_GoogleTagManager/js/google-analytics-universal.js":{"Script Parsing & Compile":3.118000030517578,"Script Evaluation":0.12799930572509766},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/knockout/bindings/outer_click.js":{"Script Parsing & Compile":1.7869997024536133,"Script Evaluation":1.4189996719360352},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/mage/utils/misc.js":{"Script Parsing & Compile":2.6259994506835938,"Script Evaluation":0.5720005035400391},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/knockout/bindings/fadeVisible.js":{"Script Evaluation":1.8940010070800781,"Script Parsing & Compile":1.2769994735717773},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/mage/apply/main.js":{"Script Parsing & Compile":1.7859992980957031,"Script Evaluation":1.3620014190673828},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/knockout/extender/observable_array.js":{"Script Parsing & Compile":1.9069995880126953,"Script Evaluation":1.1720008850097656},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/matchMedia.js":{"Script Parsing & Compile":1.8439998626708984,"Script Evaluation":1.2300004959106445},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_GoogleTagManager/js/google-analytics-universal-cart.js":{"Script Parsing & Compile":1.9429998397827148,"Script Evaluation":1.1210002899169922},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/js/responsive.js":{"Script Parsing & Compile":1.9130001068115234,"Script Evaluation":1.0329999923706055},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/mage/decorate.js":{"Script Evaluation":1.6490001678466797,"Script Parsing & Compile":1.2639999389648438},"https://p.bm23.com/bta.js":{"Script Parsing & Compile":2.243999481201172,"Script Evaluation":0.6450004577636719},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Bronto_Cart/js/fiddle.js":{"Script Parsing & Compile":1.4829998016357422,"Script Evaluation":1.4020004272460938},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/requirejs/domReady.js":{"Script Evaluation":1.476999282836914,"Script Parsing & Compile":1.391000747680664},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/core/class.js":{"Script Parsing & Compile":1.7259998321533203,"Script Evaluation":1.0749998092651367},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/templates/modal/modal-slide.html":{"Script Evaluation":2.726999282836914},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Bronto_Cart/js/capture.js":{"Script Parsing & Compile":2.6190004348754883,"Script Evaluation":0.10499954223632812},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Gene_AjaxLogin/js/action/login.js":{"Script Parsing & Compile":2.488999366760254,"Script Evaluation":0.2110004425048828},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Gene_Darwin/js/catalog-add-to-cart.js":{"Script Evaluation":1.5229997634887695,"Script Parsing & Compile":1.1070003509521484},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Gene_AjaxLogin/js/ajax-login.js":{"Script Evaluation":1.5499992370605469,"Script Parsing & Compile":1.0300006866455078},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/mage/utils/template.js":{"Script Evaluation":1.5520009994506836,"Script Parsing & Compile":1.0199995040893555},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/knockout/bindings/datepicker.js":{"Script Parsing & Compile":1.440999984741211,"Script Evaluation":1.0699996948242188},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Customer/js/invalidation-processor.js":{"Script Evaluation":2.128000259399414,"Script Parsing & Compile":0.20599937438964844},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/mage/mage.js":{"Script Parsing & Compile":1.3460006713867188,"Script Evaluation":0.9519996643066406},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/mage/storage.js":{"Script Parsing & Compile":2.0550003051757812,"Script Evaluation":0.1400003433227539},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Gene_AjaxLogin/js/model/ajax-login-messages.js":{"Script Parsing & Compile":1.9710006713867188,"Script Evaluation":0.14799880981445312},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/logger/message-pool.js":{"Script Parsing & Compile":1.2589998245239258,"Script Evaluation":0.7589998245239258},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/mage/ie-class-fixer.js":{"Script Evaluation":1.0729990005493164,"Script Parsing & Compile":0.9300003051757812},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Gene_Darwin/js/normalise-heights.js":{"Script Parsing & Compile":1.2840003967285156,"Script Evaluation":0.6999998092651367},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/knockout/bindings/autoselect.js":{"Script Evaluation":0.9700002670288086,"Script Parsing & Compile":0.9689998626708984},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Nosto_Tagging/js/nostojs.js":{"Script Evaluation":1.7200002670288086,"Script Parsing & Compile":0.20999908447265625},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Algolia_AlgoliaSearch/internals/common.js":{"Script Parsing & Compile":1.444000244140625,"Script Evaluation":0.46000003814697266},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/core/app.js":{"Script Evaluation":1.215001106262207,"Script Parsing & Compile":0.6819992065429688},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/mage/apply/scripts.js":{"Script Evaluation":1.1739988327026367,"Script Parsing & Compile":0.7210006713867188},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/mage/dropdowns.js":{"Script Parsing & Compile":1.7510004043579102,"Script Evaluation":0.09199905395507812},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_GoogleAnalytics/js/google-analytics.js":{"Script Evaluation":1.1929998397827148,"Script Parsing & Compile":0.5920000076293945},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Catalog/js/product/storage/ids-storage-compare.js":{"Script Parsing & Compile":1.6500005722045898,"Script Evaluation":0.1289997100830078},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/jquery/jquery.cookie.js":{"Script Parsing & Compile":1.0349998474121094,"Script Evaluation":0.712000846862793},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/logger/levels-pool.js":{"Script Evaluation":0.9070005416870117,"Script Parsing & Compile":0.7959995269775391},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Catalog/js/product/storage/data-storage.js":{"Script Parsing & Compile":1.4300003051757812,"Script Evaluation":0.18999958038330078},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Bronto_Connector/js/client.js":{"Script Parsing & Compile":0.9700002670288086,"Script Evaluation":0.6149997711181641},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/knockout/bootstrap.js":{"Script Evaluation":1.0069999694824219,"Script Parsing & Compile":0.555999755859375},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/mage/url.js":{"Script Parsing & Compile":1.4720001220703125,"Script Evaluation":0.08699989318847656},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/core/renderer/types.js":{"Script Evaluation":0.8690004348754883,"Script Parsing & Compile":0.6869993209838867},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Nosto_Tagging/js/view/customer-tagging.js":{"Script Parsing & Compile":0.9809999465942383,"Script Evaluation":0.5450000762939453},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/mage/utils/arrays.js":{"Script Parsing & Compile":1.3970003128051758,"Script Evaluation":0.1269998550415039},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/key-codes.js":{"Script Evaluation":1.3250007629394531,"Script Parsing & Compile":0.15399932861328125},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Nosto_Tagging/js/view/cart-tagging.js":{"Script Parsing & Compile":1.2559995651245117,"Script Evaluation":0.2110004425048828},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Bronto_Connector/js/fiddleAbstract.js":{"Script Parsing & Compile":1.3199996948242188,"Script Evaluation":0.14400100708007812},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_GoogleTagManager/js/google-tag-manager-cart.js":{"Script Parsing & Compile":1.0819997787475586,"Script Evaluation":0.3660001754760742},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/logger/logger-utils.js":{"Script Parsing & Compile":1.380000114440918,"Script Evaluation":0.06099987030029297},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Catalog/js/storage-manager.js":{"Script Parsing & Compile":0.9019994735717773,"Script Evaluation":0.5310001373291016},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/mage/collapsible.js":{"Script Parsing & Compile":1.190999984741211,"Script Evaluation":0.21599960327148438},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/spinner.js":{"Script Parsing & Compile":1.2379999160766602,"Script Evaluation":0.1080007553100586},"https://connect.nosto.com/public/javascripts/behav-popup.min.js":{"Script Parsing & Compile":1.1719999313354492,"Script Evaluation":0.1680002212524414},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Bronto_Connector/js/brontoStorage.js":{"Script Parsing & Compile":1.253000259399414,"Script Evaluation":0.07900047302246094},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Catalog/js/product/storage/ids-storage.js":{"Script Parsing & Compile":0.7209997177124023,"Script Evaluation":0.5880002975463867},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/mage/requirejs/resolver.js":{"Script Parsing & Compile":1.1649999618530273,"Script Evaluation":0.07600021362304688},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/mage/dataPost.js":{"Script Evaluation":0.8790006637573242,"Script Parsing & Compile":0.3139991760253906},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/form/adapter.js":{"Script Evaluation":0.6089992523193359,"Script Parsing & Compile":0.5650005340576172},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Tax/js/view/checkout/minicart/subtotal/totals.js":{"Script Evaluation":1.0200004577636719,"Script Parsing & Compile":0.14400005340576172},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Gene_BlueFoot/js/resource/jquery/slick/slick.js":{"Script Parsing & Compile":0.9870004653930664,"Script Evaluation":0.0989999771118164},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/mage/translate.js":{"Script Parsing & Compile":0.912999153137207,"Script Evaluation":0.15000057220458984},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/mage/utils/main.js":{"Script Parsing & Compile":0.7569999694824219,"Script Evaluation":0.24399948120117188},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/knockoutjs/knockout-repeat.js":{"Script Parsing & Compile":0.7910003662109375,"Script Evaluation":0.2049999237060547},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/mage/redirect-url.js":{"Script Evaluation":0.6189994812011719,"Script Parsing & Compile":0.37200069427490234},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/model/messageList.js":{"Script Parsing & Compile":0.9210004806518555,"Script Evaluation":0.06399917602539062},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/registry/registry.js":{"Script Parsing & Compile":0.814000129699707,"Script Evaluation":0.15000057220458984},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/core/collection.js":{"Script Parsing & Compile":0.6079998016357422,"Script Evaluation":0.23600006103515625},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Algolia_AlgoliaSearch/instantsearch.js":{"Script Parsing & Compile":0.6529998779296875,"Script Evaluation":0.17799949645996094},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/knockout/bindings/resizable.js":{"Script Parsing & Compile":0.430999755859375,"Script Evaluation":0.3990001678466797},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/mage/template.js":{"Script Evaluation":0.5139989852905273,"Script Parsing & Compile":0.30300045013427734},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Catalog/js/catalog-add-to-cart.js":{"Script Parsing & Compile":0.5629997253417969,"Script Evaluation":0.22500038146972656},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/knockout/bindings/range.js":{"Script Parsing & Compile":0.4930000305175781,"Script Evaluation":0.2670001983642578},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Bss_ProductStockAlert/js/bss_config.js":{"Script Parsing & Compile":0.6440000534057617,"Script Evaluation":0.1120004653930664},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Gene_Darwin/js/menu.js":{"Script Parsing & Compile":0.4649991989135742,"Script Evaluation":0.20200061798095703},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/logger/logger.js":{"Script Parsing & Compile":0.49499988555908203,"Script Evaluation":0.1510000228881836},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/knockoutjs/knockout-fast-foreach.js":{"Script Parsing & Compile":0.5659999847412109,"Script Evaluation":0.07700061798095703},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Msrp/js/view/checkout/minicart/subtotal/totals.js":{"Script Parsing & Compile":0.5319995880126953,"Script Evaluation":0.09399986267089844},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Catalog/js/product/storage/storage-service.js":{"Script Parsing & Compile":0.32400035858154297,"Script Evaluation":0.2869997024536133},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/es6-collections.js":{"Script Parsing & Compile":0.5060005187988281,"Script Evaluation":0.10399913787841797},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_MultipleWishlist/js/view/multiple-wishlist.js":{"Script Parsing & Compile":0.3129997253417969,"Script Evaluation":0.23099994659423828},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/modal/confirm.js":{"Script Evaluation":0.2980003356933594,"Script Parsing & Compile":0.24499988555908203},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/knockout/bindings/staticChecked.js":{"Script Parsing & Compile":0.3529996871948242,"Script Evaluation":0.18500041961669922},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/mage/utils/strings.js":{"Script Parsing & Compile":0.3319997787475586,"Script Evaluation":0.1979999542236328},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/FormData.js":{"Script Parsing & Compile":0.38500022888183594,"Script Evaluation":0.1379995346069336},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/knockout/bindings/mage-init.js":{"Script Evaluation":0.3409996032714844,"Script Parsing & Compile":0.1789999008178711},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Gene_Darwin/js/sidebar.js":{"Script Parsing & Compile":0.4230003356933594,"Script Evaluation":0.09499931335449219},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Gene_Darwin/js/scroll-to.js":{"Script Parsing & Compile":0.34999942779541016,"Script Evaluation":0.14800071716308594},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Bronto_Order/js/view/bta.js":{"Script Parsing & Compile":0.3100004196166992,"Script Evaluation":0.16899967193603516},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/view/messages.js":{"Script Parsing & Compile":0.2540006637573242,"Script Evaluation":0.2239990234375},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Gene_Darwin/js/scroll-events.js":{"Script Parsing & Compile":0.3250007629394531,"Script Evaluation":0.14299869537353516},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/js/theme.js":{"Script Evaluation":0.2870006561279297,"Script Parsing & Compile":0.17299938201904297},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/knockout/bindings/after-render.js":{"Script Parsing & Compile":0.2329998016357422,"Script Evaluation":0.2180004119873047},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Algolia_AlgoliaSearch/autocomplete.js":{"Script Parsing & Compile":0.23699951171875,"Script Evaluation":0.14500045776367188},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/knockout/template/loader.js":{"Script Parsing & Compile":0.2760000228881836,"Script Evaluation":0.0969991683959961},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/templates/modal/modal-custom.html":{"Script Evaluation":0.3709993362426758},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Catalog/js/product/query-builder.js":{"Script Parsing & Compile":0.24399948120117188,"Script Evaluation":0.12400054931640625},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/knockout/bindings/keyboard.js":{"Script Parsing & Compile":0.20099925994873047,"Script Evaluation":0.15900135040283203},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/core/events.js":{"Script Parsing & Compile":0.25800037384033203,"Script Evaluation":0.10099983215332031},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Gene_AjaxLogin/js/model/full-screen-loader.js":{"Script Parsing & Compile":0.18799972534179688,"Script Evaluation":0.17000102996826172},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Gene_Darwin/js/side-menu.js":{"Script Parsing & Compile":0.23000049591064453,"Script Evaluation":0.125},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Customer/js/section-config.js":{"Script Parsing & Compile":0.2579994201660156,"Script Evaluation":0.0950002670288086},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/knockout/bindings/simple-checked.js":{"Script Parsing & Compile":0.21000003814697266,"Script Evaluation":0.1359996795654297},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/logger/console-output-handler.js":{"Script Parsing & Compile":0.22799968719482422,"Script Evaluation":0.10000038146972656},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/logger/formatter.js":{"Script Parsing & Compile":0.17599964141845703,"Script Evaluation":0.1470012664794922},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/templates/tooltip/tooltip.html":{"Script Evaluation":0.3170003890991211},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/jquery/jquery.metadata.js":{"Script Parsing & Compile":0.2349996566772461,"Script Evaluation":0.07400035858154297},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Customer/js/model/authentication-popup.js":{"Script Parsing & Compile":0.14499950408935547,"Script Evaluation":0.12800025939941406},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/mage/common.js":{"Script Parsing & Compile":0.13899993896484375,"Script Evaluation":0.1270008087158203},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/jquery/jquery.validate.js":{"Script Parsing & Compile":0.14999961853027344,"Script Evaluation":0.10400104522705078},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/model/messages.js":{"Script Parsing & Compile":0.15799999237060547,"Script Evaluation":0.0950002670288086},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/logger/entry.js":{"Script Parsing & Compile":0.1529998779296875,"Script Evaluation":0.0839996337890625},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Gene_AjaxLogin/js/view/ajax-login-messages.js":{"Script Evaluation":0.12100028991699219,"Script Parsing & Compile":0.1139993667602539},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Gene_Darwin/js/accordion.js":{"Script Parsing & Compile":0.15400028228759766,"Script Evaluation":0.06599998474121094},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/logger/entry-factory.js":{"Script Parsing & Compile":0.11499977111816406,"Script Evaluation":0.07900047302246094},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Customer/js/invalidation-rules/website-rule.js":{"Script Parsing & Compile":0.0970001220703125,"Script Evaluation":0.0710000991821289},"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Catalog/js/view/image.js":{"Script Parsing & Compile":0.09300041198730469,"Script Evaluation":0.06999969482421875},"https://www.gro-store.com/serviceworker.js":{"Parsing HTML & CSS":0.0410003662109375}}},"scoringMode":"binary","name":"bootup-time","description":"JavaScript boot-up time is too high","helpText":"Consider reducing the time spent parsing, compiling, and executing JS. You may find delivering smaller JS payloads helps with this. [Learn more](https://developers.google.com/web/lighthouse/audits/bootup).","details":{"type":"table","header":"View Details","itemHeaders":[{"type":"text","itemType":"url","text":"URL"},{"type":"text","itemType":"text","text":"Script Evaluation"},{"type":"text","itemType":"text","text":"Script Parsing & Compile"}],"items":[[{"type":"url","text":"https://www.google-analytics.com/plugins/ua/ec.js"},{"type":"text","text":"502 ms"},{"type":"text","text":"2 ms"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/jquery/jquery-ui.js"},{"type":"text","text":"194 ms"},{"type":"text","text":"127 ms"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/jquery.js"},{"type":"text","text":"272 ms"},{"type":"text","text":"1 ms"}],[{"type":"url","text":"https://staticw2.yotpo.com/INNN2oWNqTDW3UgadN2pKPYnIMdqgHgCGdRgUe1e/widget.js"},{"type":"text","text":"117 ms"},{"type":"text","text":"107 ms"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Algolia_AlgoliaSearch/internals/algoliaBundle.min.js"},{"type":"text","text":"0 ms"},{"type":"text","text":"217 ms"}],[{"type":"url","text":"https://connect.nosto.com/public/javascripts/jquery-1.7.1.min.js"},{"type":"text","text":"105 ms"},{"type":"text","text":"66 ms"}],[{"type":"url","text":"https://connect.nosto.com/include/gro-uk-magento2"},{"type":"text","text":"147 ms"},{"type":"text","text":"3 ms"}],[{"type":"url","text":"https://connect.nosto.com/ev1?c=null&m=gro-uk-magento2&data=%7B%22ev%22%3A%5B%5D%2C%22el%22%3A%5B%22frontpage-nosto-1%22%2C%22frontpage-nosto-2%22%2C%22frontpage-nosto-3%22%2C%22frontpage-nosto-4%22%5D%2C%22cats%22%3A%5B%5D%2C%22tags%22%3A%5B%5D%2C%22fields%22%3A%5B%5D%2C%22oc%22%3Afalse%2C%22ptp%22%3A%22front%22%7D&cb=cb3970"},{"type":"text","text":"141 ms"},{"type":"text","text":"2 ms"}],[{"type":"url","text":"https://www.google-analytics.com/analytics.js"},{"type":"text","text":"125 ms"},{"type":"text","text":"10 ms"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Checkout/template/minicart/content.html"},{"type":"text","text":"78 ms"},{"type":"text","text":"0 ms"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Gene_AjaxLogin/template/ajax-login.html"},{"type":"text","text":"55 ms"},{"type":"text","text":"0 ms"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/knockoutjs/knockout.js"},{"type":"text","text":"3 ms"},{"type":"text","text":"51 ms"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/requirejs-config.js"},{"type":"text","text":"31 ms"},{"type":"text","text":"14 ms"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/moment.js"},{"type":"text","text":"6 ms"},{"type":"text","text":"34 ms"}],[{"type":"url","text":"https://www.gro-store.com/"},{"type":"text","text":"28 ms"},{"type":"text","text":"4 ms"}],[{"type":"url","text":"https://connect.nosto.com/ev1/push?m=gro-uk-magento2&c=5adf5b7960b22111780429b6"},{"type":"text","text":"23 ms"},{"type":"text","text":"0 ms"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/mage/bootstrap.js"},{"type":"text","text":"19 ms"},{"type":"text","text":"1 ms"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/jquery/jquery-migrate.js"},{"type":"text","text":"13 ms"},{"type":"text","text":"5 ms"}],[{"type":"url","text":"https://www.gro-store.com/banner/ajax/load/?sections=&_=1524587388698"},{"type":"text","text":"18 ms"},{"type":"text","text":"0 ms"}],[{"type":"url","text":"https://connect.nosto.com/public/javascripts/clipboard.min.js"},{"type":"text","text":"12 ms"},{"type":"text","text":"6 ms"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Gene_AjaxLogin/template/ajax-login-messages.html"},{"type":"text","text":"17 ms"},{"type":"text","text":"0 ms"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/underscore.js"},{"type":"text","text":"7 ms"},{"type":"text","text":"11 ms"}],[{"type":"url","text":"https://www.gro-store.com/customer/section/load/?sections=cart&update_section_id=false&_=1524587388700"},{"type":"text","text":"17 ms"},{"type":"text","text":"0 ms"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/mage/requirejs/mixins.js"},{"type":"text","text":"15 ms"},{"type":"text","text":"2 ms"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/templates/collection.html"},{"type":"text","text":"17 ms"},{"type":"text","text":"0 ms"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/logger/console-logger.js"},{"type":"text","text":"7 ms"},{"type":"text","text":"9 ms"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/templates/block-loader.html"},{"type":"text","text":"15 ms"},{"type":"text","text":"0 ms"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/jquery/jquery-ui-timepicker-addon.js"},{"type":"text","text":"1 ms"},{"type":"text","text":"13 ms"}]]}},"uses-rel-preload":{"score":100,"displayValue":"0 ms","rawValue":0,"extendedInfo":{"value":[]},"scoringMode":"numeric","informative":true,"name":"uses-rel-preload","description":"Preload key requests","helpText":"Consider using <link rel=preload> to prioritize fetching late-discovered resources sooner [Learn more](https://developers.google.com/web/updates/2016/03/link-rel-preload).","details":{"type":"table","header":"View Details","itemHeaders":[{"type":"text","itemType":"url","text":"URL"},{"type":"text","itemType":"text","text":"Potential Savings"}],"items":[]}},"font-display":{"score":true,"displayValue":"","rawValue":true,"scoringMode":"binary","name":"font-display","description":"All text remains visible during webfont loads","helpText":"Leverage the font-display CSS feature to ensure text is user-visible while webfonts are loading. [Learn more](https://developers.google.com/web/updates/2016/02/font-display).","details":{"type":"table","header":"View Details","itemHeaders":[{"type":"text","itemType":"url","text":"Font URL"},{"type":"text","itemType":"text","text":"Font download time"}],"items":[]}},"network-requests":{"score":100,"displayValue":"232","rawValue":232,"extendedInfo":{"value":[{"url":"https://www.gro-store.com/","startTime":0,"endTime":916.9380003586411,"transferSize":26148,"statusCode":200,"mimeType":"text/html","resourceType":"document"},{"url":"https://www.gro-store.com/static/version1524047115/_cache/merged/12a02713855ed25d85717a28b9d29ba6.min.css","startTime":955.6250004097819,"endTime":1870.304999873042,"transferSize":10511,"statusCode":200,"mimeType":"text/css","resourceType":"stylesheet"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/css/styles.min.css","startTime":956.5059999004006,"endTime":2248.4990004450083,"transferSize":63853,"statusCode":200,"mimeType":"text/css","resourceType":"stylesheet"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/requirejs/require.js","startTime":956.942000426352,"endTime":2015.3050003573298,"transferSize":20628,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/mage/requirejs/mixins.js","startTime":957.4269996955991,"endTime":1639.0519998967648,"transferSize":2472,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/requirejs-config.js","startTime":957.5880002230406,"endTime":1806.402999907732,"transferSize":5424,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Algolia_AlgoliaSearch/internals/common.js","startTime":958.1089997664094,"endTime":1877.8800005093217,"transferSize":6249,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Algolia_AlgoliaSearch/instantsearch.js","startTime":958.2599997520447,"endTime":1839.614000171423,"transferSize":4593,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Algolia_AlgoliaSearch/autocomplete.js","startTime":959.0790001675487,"endTime":1695.0120003893971,"transferSize":1918,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://fonts.googleapis.com/css?family=Muli:300,300i,400,400i","startTime":959.2460002750158,"endTime":1649.8400000855327,"transferSize":977,"statusCode":200,"mimeType":"text/css","resourceType":"stylesheet"},{"url":"https://connect.nosto.com/include/gro-uk-magento2","startTime":2489.649999886751,"endTime":3276.7430003732443,"transferSize":24411,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/images/logo.svg","startTime":964.3390001729131,"endTime":1774.996000342071,"transferSize":3683,"statusCode":200,"mimeType":"image/svg+xml","resourceType":"image"},{"url":"https://cdn.bronto.com/popup/delivery.js","startTime":2015.573000535369,"endTime":2810.213000513613,"transferSize":4554,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://p.bm23.com/bta.js","startTime":2489.5379999652505,"endTime":3091.5240002796054,"transferSize":1394,"statusCode":200,"mimeType":"text/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/media/catalog/product/cache/ee7abdbfbd940b078bbadf1f032bf15b/b/e/beachball_pink_-_lightweave_grobag1_1.jpg","startTime":964.7730002179742,"endTime":1846.3530000299215,"transferSize":5070,"statusCode":200,"mimeType":"image/jpeg","resourceType":"image"},{"url":"https://www.gro-store.com/media/catalog/product/cache/ee7abdbfbd940b078bbadf1f032bf15b/h/a/have_a_giraffe_groswaddle_hip_healthy5.jpg","startTime":976.1650003492832,"endTime":1790.5540000647306,"transferSize":4311,"statusCode":200,"mimeType":"image/jpeg","resourceType":"image"},{"url":"data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==","startTime":2530.6599996984005,"endTime":2530.736000277102,"transferSize":0,"statusCode":200,"mimeType":"image/gif","resourceType":"image"},{"url":"https://fonts.gstatic.com/s/muli/v11/7Auwp_0qiz-afTLGLQjUwkQ.woff2","startTime":2597.4099999293685,"endTime":3444.273999892175,"transferSize":11634,"statusCode":200,"mimeType":"font/woff2","resourceType":"font"},{"url":"https://fonts.gstatic.com/s/muli/v11/7Au_p_0qiz-adZnkOCX2z24PMFk.woff2","startTime":2615.0559997186065,"endTime":3452.0220002159476,"transferSize":11345,"statusCode":200,"mimeType":"font/woff2","resourceType":"font"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/fonts/gro-theme/gro-theme.woff","startTime":2615.2229998260736,"endTime":4215.382999740541,"transferSize":32416,"statusCode":200,"mimeType":"application/font-woff","resourceType":"font"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/jquery.js","startTime":2786.8950003758073,"endTime":6198.750999756157,"transferSize":89107,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/jquery/jquery.mobile.custom.js","startTime":2801.637999713421,"endTime":3641.4409996941686,"transferSize":7281,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/mage/dataPost.js","startTime":2802.689000032842,"endTime":3522.339000366628,"transferSize":1122,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/mage/bootstrap.js","startTime":2803.1609999015927,"endTime":3524.0740003064275,"transferSize":554,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/mage/translate-inline.js","startTime":2833.073999732733,"endTime":3541.660999879241,"transferSize":2157,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/js/responsive.js","startTime":2834.936000406742,"endTime":3543.422999791801,"transferSize":939,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/js/theme.js","startTime":2835.607999935746,"endTime":3542.5840001553297,"transferSize":651,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/mage/translate.js","startTime":2837.99699973315,"endTime":3544.232999905944,"transferSize":873,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://staticw2.yotpo.com/INNN2oWNqTDW3UgadN2pKPYnIMdqgHgCGdRgUe1e/widget.js","startTime":2842.7379997447133,"endTime":6139.233999885619,"transferSize":83278,"statusCode":200,"mimeType":"text/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/jquery/jquery.cookie.js","startTime":2909.341000020504,"endTime":3822.786000557244,"transferSize":1186,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/media/gene-cms/l/i/liquorice_sticks_mobile_image_1.jpg","startTime":2918.8149999827147,"endTime":5246.81800045073,"transferSize":47180,"statusCode":200,"mimeType":"image/jpeg","resourceType":"image"},{"url":"https://www.gro-store.com/media/gene-cms/g/r/grobags-big-hero.jpg","startTime":2932.725000195205,"endTime":6391.378000378609,"transferSize":105494,"statusCode":200,"mimeType":"image/jpeg","resourceType":"image"},{"url":"https://www.gro-store.com/media/gene-cms/s/c/screen_shot_2017-07-31_at_17.17.21-1_3.png","startTime":3043.3250004425645,"endTime":3860.346999950707,"transferSize":2623,"statusCode":200,"mimeType":"image/png","resourceType":"image"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Nosto_Tagging/js/recobuy.js","startTime":3084.32300016284,"endTime":3863.3840000256896,"transferSize":1747,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/images/Gene_Darwin/payment_sprite@2x.png","startTime":3116.453000344336,"endTime":3999.708999879658,"transferSize":6576,"statusCode":200,"mimeType":"image/png","resourceType":"image"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/images/Magento_Theme/footer-bg.png","startTime":3117.3649998381734,"endTime":3889.349000528455,"transferSize":3051,"statusCode":200,"mimeType":"image/png","resourceType":"image"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/images/icons/down-arrow@2x.png","startTime":3235.613999888301,"endTime":3909.88100040704,"transferSize":500,"statusCode":200,"mimeType":"image/png","resourceType":"image"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/images/loader-1.gif","startTime":3246.383000165224,"endTime":4738.126999698579,"transferSize":21292,"statusCode":200,"mimeType":"image/gif","resourceType":"image"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Algolia_AlgoliaSearch/internals/algoliaBundle.min.js","startTime":3347.071999683976,"endTime":6790.107999928296,"transferSize":164400,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://connect.nosto.com/ev1?c=null&m=gro-uk-magento2&data=%7B%22ev%22%3A%5B%5D%2C%22el%22%3A%5B%22frontpage-nosto-1%22%2C%22frontpage-nosto-2%22%2C%22frontpage-nosto-3%22%2C%22frontpage-nosto-4%22%5D%2C%22cats%22%3A%5B%5D%2C%22tags%22%3A%5B%5D%2C%22fields%22%3A%5B%5D%2C%22oc%22%3Afalse%2C%22ptp%22%3A%22front%22%7D&cb=cb3970","startTime":3507.228000089526,"endTime":4139.711000025272,"transferSize":1340,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/mage/template.js","startTime":3773.0010002851486,"endTime":4712.086000479758,"transferSize":1114,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/modal/confirm.js","startTime":3773.5670004040003,"endTime":4720.239999704063,"transferSize":1021,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/mage/apply/main.js","startTime":3802.667999640107,"endTime":4731.023999862373,"transferSize":1314,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/knockout/bootstrap.js","startTime":3803.465999662876,"endTime":4733.630999922752,"transferSize":602,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/mage/smart-keyboard-handler.js","startTime":3815.1829997077584,"endTime":4736.898999661207,"transferSize":1131,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/mage/mage.js","startTime":3815.841999836266,"endTime":4739.85099978745,"transferSize":1292,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/mage/ie-class-fixer.js","startTime":3816.755000501871,"endTime":4746.028999798,"transferSize":734,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/requirejs/domReady.js","startTime":3817.5809998065233,"endTime":4745.194000191987,"transferSize":1782,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/mage/tabs.js","startTime":3837.0479997247458,"endTime":4746.880000457168,"transferSize":2449,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Gene_Darwin/js/catalog-add-to-cart.js","startTime":3903.082000091672,"endTime":4751.006999984384,"transferSize":1159,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Nosto_Tagging/js/nostojs.js","startTime":3904.8659997060895,"endTime":4755.029000341892,"transferSize":1281,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/matchMedia.js","startTime":3909.17900018394,"endTime":4759.109999984503,"transferSize":1860,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://connect.nosto.com/public/javascripts/jquery-1.7.1.min.js","startTime":4270.577999763191,"endTime":5824.787000194192,"transferSize":33588,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://connect.nosto.com/ev1/push?m=gro-uk-magento2&c=5adf5b7960b22111780429b6","startTime":4345.390000380576,"endTime":4385.428000241518,"transferSize":0,"statusCode":200,"mimeType":"application/json","resourceType":"xhr"},{"url":"https://www.gro-store.com/media/catalog/product/b/e/beside_the_sea_grobag4.jpg","startTime":4348.7600004300475,"endTime":4743.630000390112,"transferSize":0,"statusCode":200,"mimeType":"image/jpeg","resourceType":"image"},{"url":"https://www.gro-store.com/media/catalog/product/b/e/beachball_blue_-_lightweave_grobag1.jpg","startTime":4348.865000531077,"endTime":4744.4719998165965,"transferSize":0,"statusCode":200,"mimeType":"image/jpeg","resourceType":"image"},{"url":"https://www.gro-store.com/media/catalog/product/b/e/beachball_pink_-_lightweave_grobag1_1.jpg","startTime":4348.977000452578,"endTime":4757.706999778748,"transferSize":0,"statusCode":200,"mimeType":"image/jpeg","resourceType":"image"},{"url":"https://connect.nosto.com/overlay/discount-modal/increaseStat?account=gro-uk-magento2&s=triggered&campaignId=Welcome%20New%20Customers%20New&rand=42892","startTime":4350.170999765396,"endTime":4724.329000338912,"transferSize":0,"statusCode":200,"mimeType":"image/gif","resourceType":"image"},{"url":"https://connect.nosto.com/overlay/discount-modal/increaseStat?account=gro-uk-magento2&s=triggered&campaignId=10%25%20Off%202%20Items&rand=05208","startTime":4350.294999778271,"endTime":4716.087999753654,"transferSize":0,"statusCode":200,"mimeType":"image/gif","resourceType":"image"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/underscore.js","startTime":4763.954000547528,"endTime":4925.480999983847,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/modal/modal.js","startTime":4767.192999832332,"endTime":4931.671000085771,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/knockoutjs/knockout.js","startTime":4789.974000304937,"endTime":4934.390000067651,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/knockoutjs/knockout-es5.js","startTime":4795.107999816537,"endTime":4935.194999910891,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/mage/collapsible.js","startTime":4837.607000023127,"endTime":4992.808000184596,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Catalog/js/catalog-add-to-cart.js","startTime":4846.162999980152,"endTime":5006.733000278473,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/mage/apply/scripts.js","startTime":4909.947000443935,"endTime":5029.0250005200505,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/knockout/template/engine.js","startTime":4915.022999979556,"endTime":5141.21999964118,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/knockout/bindings/bootstrap.js","startTime":4921.074000187218,"endTime":5144.0220000222325,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/knockout/extender/observable_array.js","startTime":4924.518000334501,"endTime":5147.795000113547,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/knockout/extender/bound-nodes.js","startTime":4924.662000499666,"endTime":5149.834000505507,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/mage/requirejs/text.js","startTime":4983.548000454903,"endTime":5152.47100032866,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/key-codes.js","startTime":4987.924000248313,"endTime":5153.4940004348755,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/knockoutjs/knockout-repeat.js","startTime":5242.5690004602075,"endTime":5488.548000343144,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/knockoutjs/knockout-fast-foreach.js","startTime":5245.675999671221,"endTime":5492.80000012368,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/mage/utils/wrapper.js","startTime":5282.820000313222,"endTime":5502.921000123024,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/core/events.js","startTime":5285.2960005402565,"endTime":5514.533000066876,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/es6-collections.js","startTime":5286.261999979615,"endTime":5519.9260003864765,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/templates/modal/modal-popup.html","startTime":5314.17900044471,"endTime":5526.6859997063875,"transferSize":0,"statusCode":200,"mimeType":"text/html","resourceType":"xhr"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/templates/modal/modal-slide.html","startTime":5316.825999878347,"endTime":5536.964000202715,"transferSize":0,"statusCode":200,"mimeType":"text/html","resourceType":"xhr"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/templates/modal/modal-custom.html","startTime":5322.350000031292,"endTime":5545.947999693453,"transferSize":0,"statusCode":200,"mimeType":"text/html","resourceType":"xhr"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/knockout/template/observable_source.js","startTime":5346.590000204742,"endTime":5548.105999827385,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/knockout/template/renderer.js","startTime":5358.6280001327395,"endTime":5549.052000045776,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/logger/console-logger.js","startTime":5362.761000171304,"endTime":5553.150000050664,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/knockout/bindings/resizable.js","startTime":5371.764000505209,"endTime":5561.522000469267,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/knockout/bindings/i18n.js","startTime":5387.476000003517,"endTime":5641.316999681294,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/knockout/bindings/scope.js","startTime":5392.974999733269,"endTime":5648.428000509739,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/knockout/bindings/range.js","startTime":5398.017999716103,"endTime":5661.768999882042,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/knockout/bindings/mage-init.js","startTime":5400.725000537932,"endTime":5666.143000125885,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/knockout/bindings/keyboard.js","startTime":5420.378999784589,"endTime":5680.929999798536,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/knockout/bindings/optgroup.js","startTime":5420.517000369728,"endTime":5672.121999785304,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/knockout/bindings/after-render.js","startTime":5420.6860000267625,"endTime":5686.1119996756315,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/knockout/bindings/autoselect.js","startTime":5420.808000490069,"endTime":5675.3439996391535,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/knockout/bindings/datepicker.js","startTime":5420.943000353873,"endTime":5688.648999668658,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/knockout/bindings/outer_click.js","startTime":5450.445000082254,"endTime":5856.4029997214675,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/knockout/bindings/fadeVisible.js","startTime":5457.682000473142,"endTime":5855.351000092924,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/knockout/bindings/collapsible.js","startTime":5458.088000304997,"endTime":5857.200000435114,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/knockout/bindings/staticChecked.js","startTime":5469.0680000931025,"endTime":5863.448000513017,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/knockout/bindings/simple-checked.js","startTime":5475.197000429034,"endTime":5867.356999777257,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/knockout/bindings/bind-html.js","startTime":5494.099999777973,"endTime":5858.184999786317,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/knockout/bindings/tooltip.js","startTime":5494.388000108302,"endTime":5862.281000241637,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/core/class.js","startTime":5582.98599999398,"endTime":5872.143999673426,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/core/storage/local.js","startTime":5650.767000392079,"endTime":5898.912999778986,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/view/utils/async.js","startTime":5650.888999924064,"endTime":5875.605000182986,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/registry/registry.js","startTime":5650.992999784648,"endTime":5909.88100040704,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/knockout/template/loader.js","startTime":5697.464999742806,"endTime":6019.755000248551,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/logger/logger.js","startTime":5704.593000002205,"endTime":6021.80500049144,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/logger/entry-factory.js","startTime":5708.813999779522,"endTime":6026.673000305891,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/logger/console-output-handler.js","startTime":5726.123000495136,"endTime":6027.672000229359,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/logger/formatter.js","startTime":5773.703999817371,"endTime":6048.245999962091,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/logger/message-pool.js","startTime":5773.92499987036,"endTime":6047.2100004553795,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/logger/levels-pool.js","startTime":5774.098000489175,"endTime":6049.118000082672,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/logger/logger-utils.js","startTime":5774.2870002985,"endTime":6050.045999698341,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/mage/utils/main.js","startTime":5786.686999723315,"endTime":6054.894000291824,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/mage/calendar.js","startTime":5844.4849997758865,"endTime":6058.993000537157,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/moment.js","startTime":5935.957999899983,"endTime":6115.8950002864,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/templates/tooltip/tooltip.html","startTime":5976.644000038505,"endTime":6379.2240004986525,"transferSize":0,"statusCode":200,"mimeType":"text/html","resourceType":"xhr"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/view/utils/dom-observer.js","startTime":6068.243999965489,"endTime":6425.224999897182,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/view/utils/bindings.js","startTime":6073.0339996516705,"endTime":6430.474000051618,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/mage/utils/template.js","startTime":6084.127999842167,"endTime":6441.802999936044,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/jquery/jquery-ui-timepicker-addon.js","startTime":6113.138000480831,"endTime":6452.5309996679425,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://connect.nosto.com/public/javascripts/behav-popup.min.js","startTime":6248.139000497758,"endTime":7327.418999746442,"transferSize":2973,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/logger/entry.js","startTime":6305.933999828994,"endTime":6625.280000269413,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/mage/utils/arrays.js","startTime":6396.816999651492,"endTime":7254.139999859035,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/mage/utils/compare.js","startTime":6410.073000006378,"endTime":7257.526000030339,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/mage/utils/misc.js","startTime":6410.524000413716,"endTime":7259.140999987721,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/mage/utils/objects.js","startTime":6412.577000446618,"endTime":7263.991000130773,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/mage/utils/strings.js","startTime":6436.13800033927,"endTime":7266.77200011909,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://staticw2.yotpo.com/INNN2oWNqTDW3UgadN2pKPYnIMdqgHgCGdRgUe1e/widget.css?widget_version=2018-04-23_10-18-12","startTime":6895.561000332236,"endTime":7329.762999899685,"transferSize":0,"statusCode":200,"mimeType":"text/css","resourceType":"stylesheet"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/jquery/jquery-migrate.js","startTime":7190.969999879599,"endTime":7490.194000303745,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/mage/common.js","startTime":7193.207999691367,"endTime":7493.754000402987,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Gene_BlueFoot/js/resource/jquery/slick/slick.js","startTime":7193.55299975723,"endTime":7496.190999634564,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/jquery/jquery.storageapi.min.js","startTime":7202.61299982667,"endTime":7505.218000151217,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/jquery/jquery-ui.js","startTime":7202.93700043112,"endTime":7506.315999664366,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/FormData.js","startTime":7308.323999866843,"endTime":7544.582000002265,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/MutationObserver.js","startTime":7313.404000364244,"endTime":7547.923999838531,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://p.yotpo.com/i?e=pv&page=Gro%20Store%20%7CGro%20baby%20clothes%20%26%20toys%20%7C%20Gro%20bags%2C%20Gro%20clocks%2C%20Gro%20eggs%2C%20Baby%20Bedding%20and%20Swaddles&se_va=INNN2oWNqTDW3UgadN2pKPYnIMdqgHgCGdRgUe1e&dtm=1524587388879&tid=855414&vp=412x732&ds=412x11707&vid=1&duid=d6b439d3a6689028&p=web&tv=js-0.13.2&fp=2162865479&aid=onsite_v2&lang=en-US&cs=UTF-8&tz=Etc%2FUTC&res=412x732&cd=24&cookie=1&url=https%3A%2F%2Fwww.gro-store.com%2F","startTime":7433.091999962926,"endTime":7552.383000031114,"transferSize":0,"statusCode":200,"mimeType":"image/gif","resourceType":"image"},{"url":"https://connect.nosto.com/overlay/discount-modal/show?callback=jQuery1710670616150176853_1524587387798&account=gro-uk-magento2&c=5adf5b7960b22111780429b6&campaignId=10%25+Off+2+Items&cartSize=0&cartTotal=0&preview=false&_=1524587389052","startTime":7531.538000330329,"endTime":8503.829999826849,"transferSize":3464,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/js-translation.json","startTime":8446.531999856234,"endTime":9409.428000450134,"transferSize":0,"statusCode":200,"mimeType":"application/json","resourceType":"xhr"},{"url":"https://connect.nosto.com/public/javascripts/clipboard.min.js","startTime":8570.86000032723,"endTime":9417.700000107288,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://nosto-merchant-assets.s3.amazonaws.com/gro-eur-magento2/5a55fe4a60b2c62ce44a09e1/1515593773588","startTime":8594.767999835312,"endTime":9418.703000061214,"transferSize":0,"statusCode":200,"mimeType":"image/jpeg","resourceType":"image"},{"url":"https://connect.nosto.com/overlay/discount-modal/increaseStat?account=gro-uk-magento2&s=shown&campaignId=10%25%20Off%202%20Items&rand=98975","startTime":8711.337000131607,"endTime":9440.081000328064,"transferSize":0,"statusCode":200,"mimeType":"image/gif","resourceType":"image"},{"url":"https://fonts.googleapis.com/css?family=Open+Sans","startTime":8722.194000147283,"endTime":9444.195000454783,"transferSize":0,"statusCode":200,"mimeType":"text/css","resourceType":"stylesheet"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Algolia_AlgoliaSearch/images/search-by-algolia.svg","startTime":9853.187999688089,"endTime":10469.21700052917,"transferSize":0,"statusCode":200,"mimeType":"image/svg+xml","resourceType":"image"},{"url":"https://cdn.bronto.com/popup/polyfills.js","startTime":10737.932000309229,"endTime":11458.084000274539,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/mage/loader.js","startTime":11481.658999808133,"endTime":11660.019000060856,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_PageCache/js/page-cache.js","startTime":11487.971999682486,"endTime":11669.429000467062,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Gene_Darwin/js/scroll-events.js","startTime":11490.17299991101,"endTime":11682.045999914408,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Gene_Darwin/js/scroll-to.js","startTime":11496.117999777198,"endTime":11685.027999803424,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Gene_Darwin/js/sidebar.js","startTime":11496.290000155568,"endTime":11687.983999960124,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Gene_Darwin/js/menu.js","startTime":11496.49399984628,"endTime":11746.30399979651,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/core/app.js","startTime":11502.65400018543,"endTime":11749.746000394225,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/mage/dropdowns.js","startTime":11506.09999988228,"endTime":11755.487999878824,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/mage/redirect-url.js","startTime":11514.130000025034,"endTime":11756.923000328243,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/mage/validation/validation.js","startTime":11561.553999781609,"endTime":11757.856000214815,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Search/form-mini.js","startTime":11567.201999947429,"endTime":11782.761000096798,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/mage/dropdown.js","startTime":11609.709000214934,"endTime":12021.778999827802,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Gene_Darwin/js/side-menu.js","startTime":11609.790000133216,"endTime":12037.100000306964,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/mage/cookies.js","startTime":11609.865000471473,"endTime":12049.630000256002,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_GoogleAnalytics/js/google-analytics.js","startTime":11609.96299982071,"endTime":12061.793999746442,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_GoogleTagManager/js/google-tag-manager-cart.js","startTime":11610.043000429869,"endTime":12081.333000212908,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Customer/js/section-config.js","startTime":11610.117999836802,"endTime":12086.335999891162,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Customer/js/customer-data.js","startTime":11610.194000415504,"endTime":12087.52700034529,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Customer/js/invalidation-processor.js","startTime":11610.29199976474,"endTime":12088.534999638796,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Banner/js/model/banner.js","startTime":11630.202000029385,"endTime":12110.344000160694,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Bronto_Cart/js/capture.js","startTime":11630.653000436723,"endTime":12089.708999730647,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Gene_Darwin/js/accordion.js","startTime":11630.800999701023,"endTime":12090.552000328898,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Bss_ProductStockAlert/js/bss_config.js","startTime":11633.175000548363,"endTime":12142.992000095546,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Gene_Lazyload/js/lazyload.js","startTime":11637.788999825716,"endTime":12170.056999661028,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/block-loader.js","startTime":11637.92600017041,"endTime":12175.447000190616,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Gene_Darwin/js/normalise-heights.js","startTime":11855.438999831676,"endTime":12181.239999830723,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/mage/validation.js","startTime":11931.363999843597,"endTime":12508.53000022471,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/core/renderer/types.js","startTime":12020.115000195801,"endTime":12514.547999948263,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/core/renderer/layout.js","startTime":12021.437000483274,"endTime":12523.865000344813,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.google-analytics.com/analytics.js","startTime":12302.161999978125,"endTime":12628.64900007844,"transferSize":0,"statusCode":200,"mimeType":"text/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_GoogleTagManager/js/google-analytics-universal.js","startTime":12316.27199985087,"endTime":12653.509000316262,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_GoogleTagManager/js/google-analytics-universal-cart.js","startTime":12318.969000130892,"endTime":12656.398000195622,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/mage/storage.js","startTime":12355.177000164986,"endTime":12657.545000314713,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/core/element/element.js","startTime":12367.4649996683,"endTime":12661.57800052315,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/templates/block-loader.html","startTime":12680.173999629915,"endTime":12995.55900041014,"transferSize":0,"statusCode":200,"mimeType":"text/html","resourceType":"xhr"},{"url":"https://www.google-analytics.com/plugins/ua/ec.js","startTime":12725.19600018859,"endTime":12991.146000102162,"transferSize":0,"statusCode":200,"mimeType":"text/javascript","resourceType":"script"},{"url":"https://www.google-analytics.com/r/collect?v=1&_v=j67&a=1182259743&t=pageview&_s=1&dl=https%3A%2F%2Fwww.gro-store.com%2F&ul=en-us&de=UTF-8&dt=Gro%20Store%20%7CGro%20baby%20clothes%20%26%20toys%20%7C%20Gro%20bags%2C%20Gro%20clocks%2C%20Gro%20eggs%2C%20Baby%20Bedding%20and%20Swaddles&sd=24-bit&sr=412x732&vp=412x732&je=0&_u=IEBAAEAL~&jid=151478573&gjid=928304679&cid=2093642018.1524587394&tid=UA-227085-4&_gid=904962033.1524587394&_r=1&z=2068605714","startTime":12820.671000517905,"endTime":13570.810000412166,"transferSize":0,"statusCode":200,"mimeType":"image/gif","resourceType":"image"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/mage/url.js","startTime":12842.803999781609,"endTime":13545.781000517309,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Checkout/js/view/minicart.js","startTime":12850.089000537992,"endTime":13548.012999817729,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Nosto_Tagging/js/view/cart-tagging.js","startTime":12854.197000153363,"endTime":13553.681000135839,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Nosto_Tagging/js/view/customer-tagging.js","startTime":12856.909000314772,"endTime":13554.794000461698,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Bronto_Cart/js/fiddle.js","startTime":12860.867000184953,"endTime":13555.668000131845,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Bronto_Order/js/view/bta.js","startTime":12862.537999637425,"endTime":13556.611999869347,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/core/collection.js","startTime":12877.842999994755,"endTime":13557.42199998349,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Tax/js/view/checkout/minicart/subtotal/totals.js","startTime":12898.748000152409,"endTime":13558.30099992454,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Msrp/js/view/checkout/minicart/subtotal/totals.js","startTime":12904.17299978435,"endTime":13563.749000430107,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/jquery/jquery.validate.js","startTime":12920.772000215948,"endTime":13567.49500054866,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Catalog/js/view/image.js","startTime":12923.448000103235,"endTime":13568.451000377536,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Theme/js/view/messages.js","startTime":12929.169000126421,"endTime":13753.372999839485,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Gene_AjaxLogin/js/ajax-login.js","startTime":13473.683999851346,"endTime":13758.53700004518,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/media/gene-cms/s/p/spring_leaves_grobag.jpg","startTime":13473.837000317872,"endTime":13844.264999963343,"transferSize":0,"statusCode":200,"mimeType":"image/jpeg","resourceType":"image"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Gene_AjaxLogin/js/view/ajax-login-messages.js","startTime":13473.974999971688,"endTime":13845.591000281274,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Catalog/js/storage-manager.js","startTime":13474.11600034684,"endTime":13844.953000545502,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_MultipleWishlist/js/view/multiple-wishlist.js","startTime":13474.25299976021,"endTime":13849.803999997675,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/images/loader-1.gif","startTime":13474.403000436723,"endTime":13738.28800022602,"transferSize":0,"statusCode":200,"mimeType":"image/gif","resourceType":"image"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/core/element/links.js","startTime":13475.893000140786,"endTime":13901.089999824762,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.google-analytics.com/collect?v=1&_v=j67&a=1182259743&t=pageview&_s=2&dl=https%3A%2F%2Fwww.gro-store.com%2F&ul=en-us&de=UTF-8&dt=Gro%20Store%20%7CGro%20baby%20clothes%20%26%20toys%20%7C%20Gro%20bags%2C%20Gro%20clocks%2C%20Gro%20eggs%2C%20Baby%20Bedding%20and%20Swaddles&sd=24-bit&sr=412x732&vp=412x732&je=0&_u=aGBAAEAL~&jid=&gjid=&cid=2093642018.1524587394&tid=UA-227085-4&_gid=904962033.1524587394&z=527977684","startTime":13540.93400016427,"endTime":13692.176000215113,"transferSize":0,"statusCode":200,"mimeType":"image/gif","resourceType":"image"},{"url":"https://www.gro-store.com/banner/ajax/load/?sections=&_=1524587388698","startTime":13653.386000543833,"endTime":13905.818999744952,"transferSize":0,"statusCode":200,"mimeType":"application/json","resourceType":"xhr"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Checkout/js/sidebar.js","startTime":13690.890000201762,"endTime":13897.986999712884,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Bronto_Connector/js/fiddleAbstract.js","startTime":13713.932000100613,"endTime":13898.50699994713,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Bronto_Connector/js/client.js","startTime":13716.25000052154,"endTime":13898.943999782205,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Bronto_Connector/js/brontoStorage.js","startTime":13719.685999676585,"endTime":13899.32500012219,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/jquery/jquery.metadata.js","startTime":13735.074000433087,"endTime":13900.828000158072,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/form/form.js","startTime":13812.64500040561,"endTime":14123.947000131011,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Gene_AjaxLogin/js/action/login.js","startTime":13815.449999645352,"endTime":14129.045000299811,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Gene_AjaxLogin/js/model/ajax-login-messages.js","startTime":13822.81699962914,"endTime":14134.588000364602,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Gene_AjaxLogin/js/model/full-screen-loader.js","startTime":13830.70100005716,"endTime":14169.53600011766,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Catalog/js/product/storage/storage-service.js","startTime":13863.446000032127,"endTime":14173.403000459075,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/view/messages.js","startTime":13863.734000362456,"endTime":14178.780999965966,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Customer/js/model/authentication-popup.js","startTime":13942.592999897897,"endTime":14181.208000518382,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/modal/alert.js","startTime":13943.93299985677,"endTime":14185.828000307083,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/mage/decorate.js","startTime":13945.218999870121,"endTime":14189.04700037092,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/spinner.js","startTime":14147.424000315368,"endTime":14329.010999761522,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/mage/requirejs/resolver.js","startTime":14148.431000299752,"endTime":14332.457999698818,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/model/messageList.js","startTime":14161.14000044763,"endTime":14336.395000107586,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/model/messages.js","startTime":14166.941000148654,"endTime":14340.90100042522,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Customer/js/invalidation-rules/website-rule.js","startTime":14197.425999678671,"endTime":14346.20700031519,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Catalog/js/product/storage/ids-storage.js","startTime":14264.736000448465,"endTime":14409.397999756038,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Catalog/js/product/storage/data-storage.js","startTime":14267.273000441492,"endTime":14412.123000249267,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Catalog/js/product/storage/ids-storage-compare.js","startTime":14268.535000272095,"endTime":14414.19699974358,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/customer/section/load/?sections=cart&update_section_id=false&_=1524587388699","startTime":14301.590000279248,"endTime":14950.295000337064,"transferSize":0,"statusCode":200,"mimeType":"application/json","resourceType":"xhr"},{"url":"https://www.gro-store.com/customer/section/load/?sections=cart&update_section_id=false&_=1524587388700","startTime":14310.920000076294,"endTime":14928.829000331461,"transferSize":0,"statusCode":200,"mimeType":"application/json","resourceType":"xhr"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/form/adapter.js","startTime":14323.0090001598,"endTime":14452.89700012654,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Checkout/template/minicart/content.html","startTime":14420.374000445008,"endTime":14514.07799962908,"transferSize":0,"statusCode":200,"mimeType":"text/html","resourceType":"xhr"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Catalog/js/product/query-builder.js","startTime":14445.743000134826,"endTime":14613.780000247061,"transferSize":0,"statusCode":200,"mimeType":"application/javascript","resourceType":"script"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Gene_AjaxLogin/template/ajax-login.html","startTime":14506.589000113308,"endTime":14626.896999776363,"transferSize":0,"statusCode":200,"mimeType":"text/html","resourceType":"xhr"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/templates/collection.html","startTime":14695.617999881506,"endTime":14836.563999764621,"transferSize":0,"statusCode":200,"mimeType":"text/html","resourceType":"xhr"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Gene_AjaxLogin/template/ajax-login-messages.html","startTime":14811.243999749422,"endTime":14905.496000312269,"transferSize":0,"statusCode":200,"mimeType":"text/html","resourceType":"xhr"}]},"scoringMode":"binary","informative":true,"name":"network-requests","description":"Network Requests","helpText":"Lists the network requests that were made during page load.","details":{"type":"table","header":"View Details","itemHeaders":[{"type":"text","itemType":"url","text":"URL"},{"type":"text","itemType":"ms","text":"Start Time"},{"type":"text","itemType":"ms","text":"End Time"},{"type":"text","itemType":"bytes","text":"Transfer Size"},{"type":"text","itemType":"text","text":"Status Code"},{"type":"text","itemType":"text","text":"MIME Type"},{"type":"text","itemType":"text","text":"Resource Type"}],"items":[[{"type":"url","text":"https://www.gro-store.com/"},{"type":"ms","text":0},{"type":"ms","text":916.9380003586411},{"type":"bytes","text":26148},{"type":"text","text":200},{"type":"text","text":"text/html"},{"type":"text","text":"document"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/_cache/merged/12a02713855ed25d85717a28b9d29ba6.min.css"},{"type":"ms","text":955.6250004097819},{"type":"ms","text":1870.304999873042},{"type":"bytes","text":10511},{"type":"text","text":200},{"type":"text","text":"text/css"},{"type":"text","text":"stylesheet"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/css/styles.min.css"},{"type":"ms","text":956.5059999004006},{"type":"ms","text":2248.4990004450083},{"type":"bytes","text":63853},{"type":"text","text":200},{"type":"text","text":"text/css"},{"type":"text","text":"stylesheet"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/requirejs/require.js"},{"type":"ms","text":956.942000426352},{"type":"ms","text":2015.3050003573298},{"type":"bytes","text":20628},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/mage/requirejs/mixins.js"},{"type":"ms","text":957.4269996955991},{"type":"ms","text":1639.0519998967648},{"type":"bytes","text":2472},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/requirejs-config.js"},{"type":"ms","text":957.5880002230406},{"type":"ms","text":1806.402999907732},{"type":"bytes","text":5424},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Algolia_AlgoliaSearch/internals/common.js"},{"type":"ms","text":958.1089997664094},{"type":"ms","text":1877.8800005093217},{"type":"bytes","text":6249},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Algolia_AlgoliaSearch/instantsearch.js"},{"type":"ms","text":958.2599997520447},{"type":"ms","text":1839.614000171423},{"type":"bytes","text":4593},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Algolia_AlgoliaSearch/autocomplete.js"},{"type":"ms","text":959.0790001675487},{"type":"ms","text":1695.0120003893971},{"type":"bytes","text":1918},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://fonts.googleapis.com/css?family=Muli:300,300i,400,400i"},{"type":"ms","text":959.2460002750158},{"type":"ms","text":1649.8400000855327},{"type":"bytes","text":977},{"type":"text","text":200},{"type":"text","text":"text/css"},{"type":"text","text":"stylesheet"}],[{"type":"url","text":"https://connect.nosto.com/include/gro-uk-magento2"},{"type":"ms","text":2489.649999886751},{"type":"ms","text":3276.7430003732443},{"type":"bytes","text":24411},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/images/logo.svg"},{"type":"ms","text":964.3390001729131},{"type":"ms","text":1774.996000342071},{"type":"bytes","text":3683},{"type":"text","text":200},{"type":"text","text":"image/svg+xml"},{"type":"text","text":"image"}],[{"type":"url","text":"https://cdn.bronto.com/popup/delivery.js"},{"type":"ms","text":2015.573000535369},{"type":"ms","text":2810.213000513613},{"type":"bytes","text":4554},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://p.bm23.com/bta.js"},{"type":"ms","text":2489.5379999652505},{"type":"ms","text":3091.5240002796054},{"type":"bytes","text":1394},{"type":"text","text":200},{"type":"text","text":"text/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/media/catalog/product/cache/ee7abdbfbd940b078bbadf1f032bf15b/b/e/beachball_pink_-_lightweave_grobag1_1.jpg"},{"type":"ms","text":964.7730002179742},{"type":"ms","text":1846.3530000299215},{"type":"bytes","text":5070},{"type":"text","text":200},{"type":"text","text":"image/jpeg"},{"type":"text","text":"image"}],[{"type":"url","text":"https://www.gro-store.com/media/catalog/product/cache/ee7abdbfbd940b078bbadf1f032bf15b/h/a/have_a_giraffe_groswaddle_hip_healthy5.jpg"},{"type":"ms","text":976.1650003492832},{"type":"ms","text":1790.5540000647306},{"type":"bytes","text":4311},{"type":"text","text":200},{"type":"text","text":"image/jpeg"},{"type":"text","text":"image"}],[{"type":"url","text":"data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw=="},{"type":"ms","text":2530.6599996984005},{"type":"ms","text":2530.736000277102},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"image/gif"},{"type":"text","text":"image"}],[{"type":"url","text":"https://fonts.gstatic.com/s/muli/v11/7Auwp_0qiz-afTLGLQjUwkQ.woff2"},{"type":"ms","text":2597.4099999293685},{"type":"ms","text":3444.273999892175},{"type":"bytes","text":11634},{"type":"text","text":200},{"type":"text","text":"font/woff2"},{"type":"text","text":"font"}],[{"type":"url","text":"https://fonts.gstatic.com/s/muli/v11/7Au_p_0qiz-adZnkOCX2z24PMFk.woff2"},{"type":"ms","text":2615.0559997186065},{"type":"ms","text":3452.0220002159476},{"type":"bytes","text":11345},{"type":"text","text":200},{"type":"text","text":"font/woff2"},{"type":"text","text":"font"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/fonts/gro-theme/gro-theme.woff"},{"type":"ms","text":2615.2229998260736},{"type":"ms","text":4215.382999740541},{"type":"bytes","text":32416},{"type":"text","text":200},{"type":"text","text":"application/font-woff"},{"type":"text","text":"font"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/jquery.js"},{"type":"ms","text":2786.8950003758073},{"type":"ms","text":6198.750999756157},{"type":"bytes","text":89107},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/jquery/jquery.mobile.custom.js"},{"type":"ms","text":2801.637999713421},{"type":"ms","text":3641.4409996941686},{"type":"bytes","text":7281},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/mage/dataPost.js"},{"type":"ms","text":2802.689000032842},{"type":"ms","text":3522.339000366628},{"type":"bytes","text":1122},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/mage/bootstrap.js"},{"type":"ms","text":2803.1609999015927},{"type":"ms","text":3524.0740003064275},{"type":"bytes","text":554},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/mage/translate-inline.js"},{"type":"ms","text":2833.073999732733},{"type":"ms","text":3541.660999879241},{"type":"bytes","text":2157},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/js/responsive.js"},{"type":"ms","text":2834.936000406742},{"type":"ms","text":3543.422999791801},{"type":"bytes","text":939},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/js/theme.js"},{"type":"ms","text":2835.607999935746},{"type":"ms","text":3542.5840001553297},{"type":"bytes","text":651},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/mage/translate.js"},{"type":"ms","text":2837.99699973315},{"type":"ms","text":3544.232999905944},{"type":"bytes","text":873},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://staticw2.yotpo.com/INNN2oWNqTDW3UgadN2pKPYnIMdqgHgCGdRgUe1e/widget.js"},{"type":"ms","text":2842.7379997447133},{"type":"ms","text":6139.233999885619},{"type":"bytes","text":83278},{"type":"text","text":200},{"type":"text","text":"text/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/jquery/jquery.cookie.js"},{"type":"ms","text":2909.341000020504},{"type":"ms","text":3822.786000557244},{"type":"bytes","text":1186},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/media/gene-cms/l/i/liquorice_sticks_mobile_image_1.jpg"},{"type":"ms","text":2918.8149999827147},{"type":"ms","text":5246.81800045073},{"type":"bytes","text":47180},{"type":"text","text":200},{"type":"text","text":"image/jpeg"},{"type":"text","text":"image"}],[{"type":"url","text":"https://www.gro-store.com/media/gene-cms/g/r/grobags-big-hero.jpg"},{"type":"ms","text":2932.725000195205},{"type":"ms","text":6391.378000378609},{"type":"bytes","text":105494},{"type":"text","text":200},{"type":"text","text":"image/jpeg"},{"type":"text","text":"image"}],[{"type":"url","text":"https://www.gro-store.com/media/gene-cms/s/c/screen_shot_2017-07-31_at_17.17.21-1_3.png"},{"type":"ms","text":3043.3250004425645},{"type":"ms","text":3860.346999950707},{"type":"bytes","text":2623},{"type":"text","text":200},{"type":"text","text":"image/png"},{"type":"text","text":"image"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Nosto_Tagging/js/recobuy.js"},{"type":"ms","text":3084.32300016284},{"type":"ms","text":3863.3840000256896},{"type":"bytes","text":1747},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/images/Gene_Darwin/payment_sprite@2x.png"},{"type":"ms","text":3116.453000344336},{"type":"ms","text":3999.708999879658},{"type":"bytes","text":6576},{"type":"text","text":200},{"type":"text","text":"image/png"},{"type":"text","text":"image"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/images/Magento_Theme/footer-bg.png"},{"type":"ms","text":3117.3649998381734},{"type":"ms","text":3889.349000528455},{"type":"bytes","text":3051},{"type":"text","text":200},{"type":"text","text":"image/png"},{"type":"text","text":"image"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/images/icons/down-arrow@2x.png"},{"type":"ms","text":3235.613999888301},{"type":"ms","text":3909.88100040704},{"type":"bytes","text":500},{"type":"text","text":200},{"type":"text","text":"image/png"},{"type":"text","text":"image"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/images/loader-1.gif"},{"type":"ms","text":3246.383000165224},{"type":"ms","text":4738.126999698579},{"type":"bytes","text":21292},{"type":"text","text":200},{"type":"text","text":"image/gif"},{"type":"text","text":"image"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Algolia_AlgoliaSearch/internals/algoliaBundle.min.js"},{"type":"ms","text":3347.071999683976},{"type":"ms","text":6790.107999928296},{"type":"bytes","text":164400},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://connect.nosto.com/ev1?c=null&m=gro-uk-magento2&data=%7B%22ev%22%3A%5B%5D%2C%22el%22%3A%5B%22frontpage-nosto-1%22%2C%22frontpage-nosto-2%22%2C%22frontpage-nosto-3%22%2C%22frontpage-nosto-4%22%5D%2C%22cats%22%3A%5B%5D%2C%22tags%22%3A%5B%5D%2C%22fields%22%3A%5B%5D%2C%22oc%22%3Afalse%2C%22ptp%22%3A%22front%22%7D&cb=cb3970"},{"type":"ms","text":3507.228000089526},{"type":"ms","text":4139.711000025272},{"type":"bytes","text":1340},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/mage/template.js"},{"type":"ms","text":3773.0010002851486},{"type":"ms","text":4712.086000479758},{"type":"bytes","text":1114},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/modal/confirm.js"},{"type":"ms","text":3773.5670004040003},{"type":"ms","text":4720.239999704063},{"type":"bytes","text":1021},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/mage/apply/main.js"},{"type":"ms","text":3802.667999640107},{"type":"ms","text":4731.023999862373},{"type":"bytes","text":1314},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/knockout/bootstrap.js"},{"type":"ms","text":3803.465999662876},{"type":"ms","text":4733.630999922752},{"type":"bytes","text":602},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/mage/smart-keyboard-handler.js"},{"type":"ms","text":3815.1829997077584},{"type":"ms","text":4736.898999661207},{"type":"bytes","text":1131},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/mage/mage.js"},{"type":"ms","text":3815.841999836266},{"type":"ms","text":4739.85099978745},{"type":"bytes","text":1292},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/mage/ie-class-fixer.js"},{"type":"ms","text":3816.755000501871},{"type":"ms","text":4746.028999798},{"type":"bytes","text":734},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/requirejs/domReady.js"},{"type":"ms","text":3817.5809998065233},{"type":"ms","text":4745.194000191987},{"type":"bytes","text":1782},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/mage/tabs.js"},{"type":"ms","text":3837.0479997247458},{"type":"ms","text":4746.880000457168},{"type":"bytes","text":2449},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Gene_Darwin/js/catalog-add-to-cart.js"},{"type":"ms","text":3903.082000091672},{"type":"ms","text":4751.006999984384},{"type":"bytes","text":1159},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Nosto_Tagging/js/nostojs.js"},{"type":"ms","text":3904.8659997060895},{"type":"ms","text":4755.029000341892},{"type":"bytes","text":1281},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/matchMedia.js"},{"type":"ms","text":3909.17900018394},{"type":"ms","text":4759.109999984503},{"type":"bytes","text":1860},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://connect.nosto.com/public/javascripts/jquery-1.7.1.min.js"},{"type":"ms","text":4270.577999763191},{"type":"ms","text":5824.787000194192},{"type":"bytes","text":33588},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://connect.nosto.com/ev1/push?m=gro-uk-magento2&c=5adf5b7960b22111780429b6"},{"type":"ms","text":4345.390000380576},{"type":"ms","text":4385.428000241518},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/json"},{"type":"text","text":"xhr"}],[{"type":"url","text":"https://www.gro-store.com/media/catalog/product/b/e/beside_the_sea_grobag4.jpg"},{"type":"ms","text":4348.7600004300475},{"type":"ms","text":4743.630000390112},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"image/jpeg"},{"type":"text","text":"image"}],[{"type":"url","text":"https://www.gro-store.com/media/catalog/product/b/e/beachball_blue_-_lightweave_grobag1.jpg"},{"type":"ms","text":4348.865000531077},{"type":"ms","text":4744.4719998165965},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"image/jpeg"},{"type":"text","text":"image"}],[{"type":"url","text":"https://www.gro-store.com/media/catalog/product/b/e/beachball_pink_-_lightweave_grobag1_1.jpg"},{"type":"ms","text":4348.977000452578},{"type":"ms","text":4757.706999778748},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"image/jpeg"},{"type":"text","text":"image"}],[{"type":"url","text":"https://connect.nosto.com/overlay/discount-modal/increaseStat?account=gro-uk-magento2&s=triggered&campaignId=Welcome%20New%20Customers%20New&rand=42892"},{"type":"ms","text":4350.170999765396},{"type":"ms","text":4724.329000338912},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"image/gif"},{"type":"text","text":"image"}],[{"type":"url","text":"https://connect.nosto.com/overlay/discount-modal/increaseStat?account=gro-uk-magento2&s=triggered&campaignId=10%25%20Off%202%20Items&rand=05208"},{"type":"ms","text":4350.294999778271},{"type":"ms","text":4716.087999753654},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"image/gif"},{"type":"text","text":"image"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/underscore.js"},{"type":"ms","text":4763.954000547528},{"type":"ms","text":4925.480999983847},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/modal/modal.js"},{"type":"ms","text":4767.192999832332},{"type":"ms","text":4931.671000085771},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/knockoutjs/knockout.js"},{"type":"ms","text":4789.974000304937},{"type":"ms","text":4934.390000067651},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/knockoutjs/knockout-es5.js"},{"type":"ms","text":4795.107999816537},{"type":"ms","text":4935.194999910891},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/mage/collapsible.js"},{"type":"ms","text":4837.607000023127},{"type":"ms","text":4992.808000184596},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Catalog/js/catalog-add-to-cart.js"},{"type":"ms","text":4846.162999980152},{"type":"ms","text":5006.733000278473},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/mage/apply/scripts.js"},{"type":"ms","text":4909.947000443935},{"type":"ms","text":5029.0250005200505},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/knockout/template/engine.js"},{"type":"ms","text":4915.022999979556},{"type":"ms","text":5141.21999964118},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/knockout/bindings/bootstrap.js"},{"type":"ms","text":4921.074000187218},{"type":"ms","text":5144.0220000222325},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/knockout/extender/observable_array.js"},{"type":"ms","text":4924.518000334501},{"type":"ms","text":5147.795000113547},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/knockout/extender/bound-nodes.js"},{"type":"ms","text":4924.662000499666},{"type":"ms","text":5149.834000505507},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/mage/requirejs/text.js"},{"type":"ms","text":4983.548000454903},{"type":"ms","text":5152.47100032866},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/key-codes.js"},{"type":"ms","text":4987.924000248313},{"type":"ms","text":5153.4940004348755},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/knockoutjs/knockout-repeat.js"},{"type":"ms","text":5242.5690004602075},{"type":"ms","text":5488.548000343144},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/knockoutjs/knockout-fast-foreach.js"},{"type":"ms","text":5245.675999671221},{"type":"ms","text":5492.80000012368},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/mage/utils/wrapper.js"},{"type":"ms","text":5282.820000313222},{"type":"ms","text":5502.921000123024},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/core/events.js"},{"type":"ms","text":5285.2960005402565},{"type":"ms","text":5514.533000066876},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/es6-collections.js"},{"type":"ms","text":5286.261999979615},{"type":"ms","text":5519.9260003864765},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/templates/modal/modal-popup.html"},{"type":"ms","text":5314.17900044471},{"type":"ms","text":5526.6859997063875},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"text/html"},{"type":"text","text":"xhr"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/templates/modal/modal-slide.html"},{"type":"ms","text":5316.825999878347},{"type":"ms","text":5536.964000202715},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"text/html"},{"type":"text","text":"xhr"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/templates/modal/modal-custom.html"},{"type":"ms","text":5322.350000031292},{"type":"ms","text":5545.947999693453},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"text/html"},{"type":"text","text":"xhr"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/knockout/template/observable_source.js"},{"type":"ms","text":5346.590000204742},{"type":"ms","text":5548.105999827385},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/knockout/template/renderer.js"},{"type":"ms","text":5358.6280001327395},{"type":"ms","text":5549.052000045776},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/logger/console-logger.js"},{"type":"ms","text":5362.761000171304},{"type":"ms","text":5553.150000050664},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/knockout/bindings/resizable.js"},{"type":"ms","text":5371.764000505209},{"type":"ms","text":5561.522000469267},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/knockout/bindings/i18n.js"},{"type":"ms","text":5387.476000003517},{"type":"ms","text":5641.316999681294},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/knockout/bindings/scope.js"},{"type":"ms","text":5392.974999733269},{"type":"ms","text":5648.428000509739},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/knockout/bindings/range.js"},{"type":"ms","text":5398.017999716103},{"type":"ms","text":5661.768999882042},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/knockout/bindings/mage-init.js"},{"type":"ms","text":5400.725000537932},{"type":"ms","text":5666.143000125885},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/knockout/bindings/keyboard.js"},{"type":"ms","text":5420.378999784589},{"type":"ms","text":5680.929999798536},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/knockout/bindings/optgroup.js"},{"type":"ms","text":5420.517000369728},{"type":"ms","text":5672.121999785304},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/knockout/bindings/after-render.js"},{"type":"ms","text":5420.6860000267625},{"type":"ms","text":5686.1119996756315},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/knockout/bindings/autoselect.js"},{"type":"ms","text":5420.808000490069},{"type":"ms","text":5675.3439996391535},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/knockout/bindings/datepicker.js"},{"type":"ms","text":5420.943000353873},{"type":"ms","text":5688.648999668658},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/knockout/bindings/outer_click.js"},{"type":"ms","text":5450.445000082254},{"type":"ms","text":5856.4029997214675},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/knockout/bindings/fadeVisible.js"},{"type":"ms","text":5457.682000473142},{"type":"ms","text":5855.351000092924},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/knockout/bindings/collapsible.js"},{"type":"ms","text":5458.088000304997},{"type":"ms","text":5857.200000435114},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/knockout/bindings/staticChecked.js"},{"type":"ms","text":5469.0680000931025},{"type":"ms","text":5863.448000513017},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/knockout/bindings/simple-checked.js"},{"type":"ms","text":5475.197000429034},{"type":"ms","text":5867.356999777257},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/knockout/bindings/bind-html.js"},{"type":"ms","text":5494.099999777973},{"type":"ms","text":5858.184999786317},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/knockout/bindings/tooltip.js"},{"type":"ms","text":5494.388000108302},{"type":"ms","text":5862.281000241637},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/core/class.js"},{"type":"ms","text":5582.98599999398},{"type":"ms","text":5872.143999673426},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/core/storage/local.js"},{"type":"ms","text":5650.767000392079},{"type":"ms","text":5898.912999778986},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/view/utils/async.js"},{"type":"ms","text":5650.888999924064},{"type":"ms","text":5875.605000182986},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/registry/registry.js"},{"type":"ms","text":5650.992999784648},{"type":"ms","text":5909.88100040704},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/knockout/template/loader.js"},{"type":"ms","text":5697.464999742806},{"type":"ms","text":6019.755000248551},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/logger/logger.js"},{"type":"ms","text":5704.593000002205},{"type":"ms","text":6021.80500049144},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/logger/entry-factory.js"},{"type":"ms","text":5708.813999779522},{"type":"ms","text":6026.673000305891},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/logger/console-output-handler.js"},{"type":"ms","text":5726.123000495136},{"type":"ms","text":6027.672000229359},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/logger/formatter.js"},{"type":"ms","text":5773.703999817371},{"type":"ms","text":6048.245999962091},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/logger/message-pool.js"},{"type":"ms","text":5773.92499987036},{"type":"ms","text":6047.2100004553795},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/logger/levels-pool.js"},{"type":"ms","text":5774.098000489175},{"type":"ms","text":6049.118000082672},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/logger/logger-utils.js"},{"type":"ms","text":5774.2870002985},{"type":"ms","text":6050.045999698341},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/mage/utils/main.js"},{"type":"ms","text":5786.686999723315},{"type":"ms","text":6054.894000291824},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/mage/calendar.js"},{"type":"ms","text":5844.4849997758865},{"type":"ms","text":6058.993000537157},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/moment.js"},{"type":"ms","text":5935.957999899983},{"type":"ms","text":6115.8950002864},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/templates/tooltip/tooltip.html"},{"type":"ms","text":5976.644000038505},{"type":"ms","text":6379.2240004986525},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"text/html"},{"type":"text","text":"xhr"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/view/utils/dom-observer.js"},{"type":"ms","text":6068.243999965489},{"type":"ms","text":6425.224999897182},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/view/utils/bindings.js"},{"type":"ms","text":6073.0339996516705},{"type":"ms","text":6430.474000051618},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/mage/utils/template.js"},{"type":"ms","text":6084.127999842167},{"type":"ms","text":6441.802999936044},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/jquery/jquery-ui-timepicker-addon.js"},{"type":"ms","text":6113.138000480831},{"type":"ms","text":6452.5309996679425},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://connect.nosto.com/public/javascripts/behav-popup.min.js"},{"type":"ms","text":6248.139000497758},{"type":"ms","text":7327.418999746442},{"type":"bytes","text":2973},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/logger/entry.js"},{"type":"ms","text":6305.933999828994},{"type":"ms","text":6625.280000269413},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/mage/utils/arrays.js"},{"type":"ms","text":6396.816999651492},{"type":"ms","text":7254.139999859035},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/mage/utils/compare.js"},{"type":"ms","text":6410.073000006378},{"type":"ms","text":7257.526000030339},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/mage/utils/misc.js"},{"type":"ms","text":6410.524000413716},{"type":"ms","text":7259.140999987721},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/mage/utils/objects.js"},{"type":"ms","text":6412.577000446618},{"type":"ms","text":7263.991000130773},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/mage/utils/strings.js"},{"type":"ms","text":6436.13800033927},{"type":"ms","text":7266.77200011909},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://staticw2.yotpo.com/INNN2oWNqTDW3UgadN2pKPYnIMdqgHgCGdRgUe1e/widget.css?widget_version=2018-04-23_10-18-12"},{"type":"ms","text":6895.561000332236},{"type":"ms","text":7329.762999899685},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"text/css"},{"type":"text","text":"stylesheet"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/jquery/jquery-migrate.js"},{"type":"ms","text":7190.969999879599},{"type":"ms","text":7490.194000303745},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/mage/common.js"},{"type":"ms","text":7193.207999691367},{"type":"ms","text":7493.754000402987},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Gene_BlueFoot/js/resource/jquery/slick/slick.js"},{"type":"ms","text":7193.55299975723},{"type":"ms","text":7496.190999634564},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/jquery/jquery.storageapi.min.js"},{"type":"ms","text":7202.61299982667},{"type":"ms","text":7505.218000151217},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/jquery/jquery-ui.js"},{"type":"ms","text":7202.93700043112},{"type":"ms","text":7506.315999664366},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/FormData.js"},{"type":"ms","text":7308.323999866843},{"type":"ms","text":7544.582000002265},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/MutationObserver.js"},{"type":"ms","text":7313.404000364244},{"type":"ms","text":7547.923999838531},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://p.yotpo.com/i?e=pv&page=Gro%20Store%20%7CGro%20baby%20clothes%20%26%20toys%20%7C%20Gro%20bags%2C%20Gro%20clocks%2C%20Gro%20eggs%2C%20Baby%20Bedding%20and%20Swaddles&se_va=INNN2oWNqTDW3UgadN2pKPYnIMdqgHgCGdRgUe1e&dtm=1524587388879&tid=855414&vp=412x732&ds=412x11707&vid=1&duid=d6b439d3a6689028&p=web&tv=js-0.13.2&fp=2162865479&aid=onsite_v2&lang=en-US&cs=UTF-8&tz=Etc%2FUTC&res=412x732&cd=24&cookie=1&url=https%3A%2F%2Fwww.gro-store.com%2F"},{"type":"ms","text":7433.091999962926},{"type":"ms","text":7552.383000031114},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"image/gif"},{"type":"text","text":"image"}],[{"type":"url","text":"https://connect.nosto.com/overlay/discount-modal/show?callback=jQuery1710670616150176853_1524587387798&account=gro-uk-magento2&c=5adf5b7960b22111780429b6&campaignId=10%25+Off+2+Items&cartSize=0&cartTotal=0&preview=false&_=1524587389052"},{"type":"ms","text":7531.538000330329},{"type":"ms","text":8503.829999826849},{"type":"bytes","text":3464},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/js-translation.json"},{"type":"ms","text":8446.531999856234},{"type":"ms","text":9409.428000450134},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/json"},{"type":"text","text":"xhr"}],[{"type":"url","text":"https://connect.nosto.com/public/javascripts/clipboard.min.js"},{"type":"ms","text":8570.86000032723},{"type":"ms","text":9417.700000107288},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://nosto-merchant-assets.s3.amazonaws.com/gro-eur-magento2/5a55fe4a60b2c62ce44a09e1/1515593773588"},{"type":"ms","text":8594.767999835312},{"type":"ms","text":9418.703000061214},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"image/jpeg"},{"type":"text","text":"image"}],[{"type":"url","text":"https://connect.nosto.com/overlay/discount-modal/increaseStat?account=gro-uk-magento2&s=shown&campaignId=10%25%20Off%202%20Items&rand=98975"},{"type":"ms","text":8711.337000131607},{"type":"ms","text":9440.081000328064},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"image/gif"},{"type":"text","text":"image"}],[{"type":"url","text":"https://fonts.googleapis.com/css?family=Open+Sans"},{"type":"ms","text":8722.194000147283},{"type":"ms","text":9444.195000454783},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"text/css"},{"type":"text","text":"stylesheet"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Algolia_AlgoliaSearch/images/search-by-algolia.svg"},{"type":"ms","text":9853.187999688089},{"type":"ms","text":10469.21700052917},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"image/svg+xml"},{"type":"text","text":"image"}],[{"type":"url","text":"https://cdn.bronto.com/popup/polyfills.js"},{"type":"ms","text":10737.932000309229},{"type":"ms","text":11458.084000274539},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/mage/loader.js"},{"type":"ms","text":11481.658999808133},{"type":"ms","text":11660.019000060856},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_PageCache/js/page-cache.js"},{"type":"ms","text":11487.971999682486},{"type":"ms","text":11669.429000467062},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Gene_Darwin/js/scroll-events.js"},{"type":"ms","text":11490.17299991101},{"type":"ms","text":11682.045999914408},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Gene_Darwin/js/scroll-to.js"},{"type":"ms","text":11496.117999777198},{"type":"ms","text":11685.027999803424},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Gene_Darwin/js/sidebar.js"},{"type":"ms","text":11496.290000155568},{"type":"ms","text":11687.983999960124},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Gene_Darwin/js/menu.js"},{"type":"ms","text":11496.49399984628},{"type":"ms","text":11746.30399979651},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/core/app.js"},{"type":"ms","text":11502.65400018543},{"type":"ms","text":11749.746000394225},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/mage/dropdowns.js"},{"type":"ms","text":11506.09999988228},{"type":"ms","text":11755.487999878824},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/mage/redirect-url.js"},{"type":"ms","text":11514.130000025034},{"type":"ms","text":11756.923000328243},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/mage/validation/validation.js"},{"type":"ms","text":11561.553999781609},{"type":"ms","text":11757.856000214815},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Search/form-mini.js"},{"type":"ms","text":11567.201999947429},{"type":"ms","text":11782.761000096798},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/mage/dropdown.js"},{"type":"ms","text":11609.709000214934},{"type":"ms","text":12021.778999827802},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Gene_Darwin/js/side-menu.js"},{"type":"ms","text":11609.790000133216},{"type":"ms","text":12037.100000306964},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/mage/cookies.js"},{"type":"ms","text":11609.865000471473},{"type":"ms","text":12049.630000256002},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_GoogleAnalytics/js/google-analytics.js"},{"type":"ms","text":11609.96299982071},{"type":"ms","text":12061.793999746442},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_GoogleTagManager/js/google-tag-manager-cart.js"},{"type":"ms","text":11610.043000429869},{"type":"ms","text":12081.333000212908},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Customer/js/section-config.js"},{"type":"ms","text":11610.117999836802},{"type":"ms","text":12086.335999891162},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Customer/js/customer-data.js"},{"type":"ms","text":11610.194000415504},{"type":"ms","text":12087.52700034529},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Customer/js/invalidation-processor.js"},{"type":"ms","text":11610.29199976474},{"type":"ms","text":12088.534999638796},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Banner/js/model/banner.js"},{"type":"ms","text":11630.202000029385},{"type":"ms","text":12110.344000160694},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Bronto_Cart/js/capture.js"},{"type":"ms","text":11630.653000436723},{"type":"ms","text":12089.708999730647},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Gene_Darwin/js/accordion.js"},{"type":"ms","text":11630.800999701023},{"type":"ms","text":12090.552000328898},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Bss_ProductStockAlert/js/bss_config.js"},{"type":"ms","text":11633.175000548363},{"type":"ms","text":12142.992000095546},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Gene_Lazyload/js/lazyload.js"},{"type":"ms","text":11637.788999825716},{"type":"ms","text":12170.056999661028},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/block-loader.js"},{"type":"ms","text":11637.92600017041},{"type":"ms","text":12175.447000190616},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Gene_Darwin/js/normalise-heights.js"},{"type":"ms","text":11855.438999831676},{"type":"ms","text":12181.239999830723},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/mage/validation.js"},{"type":"ms","text":11931.363999843597},{"type":"ms","text":12508.53000022471},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/core/renderer/types.js"},{"type":"ms","text":12020.115000195801},{"type":"ms","text":12514.547999948263},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/core/renderer/layout.js"},{"type":"ms","text":12021.437000483274},{"type":"ms","text":12523.865000344813},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.google-analytics.com/analytics.js"},{"type":"ms","text":12302.161999978125},{"type":"ms","text":12628.64900007844},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"text/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_GoogleTagManager/js/google-analytics-universal.js"},{"type":"ms","text":12316.27199985087},{"type":"ms","text":12653.509000316262},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_GoogleTagManager/js/google-analytics-universal-cart.js"},{"type":"ms","text":12318.969000130892},{"type":"ms","text":12656.398000195622},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/mage/storage.js"},{"type":"ms","text":12355.177000164986},{"type":"ms","text":12657.545000314713},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/core/element/element.js"},{"type":"ms","text":12367.4649996683},{"type":"ms","text":12661.57800052315},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/templates/block-loader.html"},{"type":"ms","text":12680.173999629915},{"type":"ms","text":12995.55900041014},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"text/html"},{"type":"text","text":"xhr"}],[{"type":"url","text":"https://www.google-analytics.com/plugins/ua/ec.js"},{"type":"ms","text":12725.19600018859},{"type":"ms","text":12991.146000102162},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"text/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.google-analytics.com/r/collect?v=1&_v=j67&a=1182259743&t=pageview&_s=1&dl=https%3A%2F%2Fwww.gro-store.com%2F&ul=en-us&de=UTF-8&dt=Gro%20Store%20%7CGro%20baby%20clothes%20%26%20toys%20%7C%20Gro%20bags%2C%20Gro%20clocks%2C%20Gro%20eggs%2C%20Baby%20Bedding%20and%20Swaddles&sd=24-bit&sr=412x732&vp=412x732&je=0&_u=IEBAAEAL~&jid=151478573&gjid=928304679&cid=2093642018.1524587394&tid=UA-227085-4&_gid=904962033.1524587394&_r=1&z=2068605714"},{"type":"ms","text":12820.671000517905},{"type":"ms","text":13570.810000412166},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"image/gif"},{"type":"text","text":"image"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/mage/url.js"},{"type":"ms","text":12842.803999781609},{"type":"ms","text":13545.781000517309},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Checkout/js/view/minicart.js"},{"type":"ms","text":12850.089000537992},{"type":"ms","text":13548.012999817729},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Nosto_Tagging/js/view/cart-tagging.js"},{"type":"ms","text":12854.197000153363},{"type":"ms","text":13553.681000135839},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Nosto_Tagging/js/view/customer-tagging.js"},{"type":"ms","text":12856.909000314772},{"type":"ms","text":13554.794000461698},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Bronto_Cart/js/fiddle.js"},{"type":"ms","text":12860.867000184953},{"type":"ms","text":13555.668000131845},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Bronto_Order/js/view/bta.js"},{"type":"ms","text":12862.537999637425},{"type":"ms","text":13556.611999869347},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/core/collection.js"},{"type":"ms","text":12877.842999994755},{"type":"ms","text":13557.42199998349},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Tax/js/view/checkout/minicart/subtotal/totals.js"},{"type":"ms","text":12898.748000152409},{"type":"ms","text":13558.30099992454},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Msrp/js/view/checkout/minicart/subtotal/totals.js"},{"type":"ms","text":12904.17299978435},{"type":"ms","text":13563.749000430107},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/jquery/jquery.validate.js"},{"type":"ms","text":12920.772000215948},{"type":"ms","text":13567.49500054866},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Catalog/js/view/image.js"},{"type":"ms","text":12923.448000103235},{"type":"ms","text":13568.451000377536},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Theme/js/view/messages.js"},{"type":"ms","text":12929.169000126421},{"type":"ms","text":13753.372999839485},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Gene_AjaxLogin/js/ajax-login.js"},{"type":"ms","text":13473.683999851346},{"type":"ms","text":13758.53700004518},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/media/gene-cms/s/p/spring_leaves_grobag.jpg"},{"type":"ms","text":13473.837000317872},{"type":"ms","text":13844.264999963343},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"image/jpeg"},{"type":"text","text":"image"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Gene_AjaxLogin/js/view/ajax-login-messages.js"},{"type":"ms","text":13473.974999971688},{"type":"ms","text":13845.591000281274},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Catalog/js/storage-manager.js"},{"type":"ms","text":13474.11600034684},{"type":"ms","text":13844.953000545502},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_MultipleWishlist/js/view/multiple-wishlist.js"},{"type":"ms","text":13474.25299976021},{"type":"ms","text":13849.803999997675},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/images/loader-1.gif"},{"type":"ms","text":13474.403000436723},{"type":"ms","text":13738.28800022602},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"image/gif"},{"type":"text","text":"image"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/core/element/links.js"},{"type":"ms","text":13475.893000140786},{"type":"ms","text":13901.089999824762},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.google-analytics.com/collect?v=1&_v=j67&a=1182259743&t=pageview&_s=2&dl=https%3A%2F%2Fwww.gro-store.com%2F&ul=en-us&de=UTF-8&dt=Gro%20Store%20%7CGro%20baby%20clothes%20%26%20toys%20%7C%20Gro%20bags%2C%20Gro%20clocks%2C%20Gro%20eggs%2C%20Baby%20Bedding%20and%20Swaddles&sd=24-bit&sr=412x732&vp=412x732&je=0&_u=aGBAAEAL~&jid=&gjid=&cid=2093642018.1524587394&tid=UA-227085-4&_gid=904962033.1524587394&z=527977684"},{"type":"ms","text":13540.93400016427},{"type":"ms","text":13692.176000215113},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"image/gif"},{"type":"text","text":"image"}],[{"type":"url","text":"https://www.gro-store.com/banner/ajax/load/?sections=&_=1524587388698"},{"type":"ms","text":13653.386000543833},{"type":"ms","text":13905.818999744952},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/json"},{"type":"text","text":"xhr"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Checkout/js/sidebar.js"},{"type":"ms","text":13690.890000201762},{"type":"ms","text":13897.986999712884},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Bronto_Connector/js/fiddleAbstract.js"},{"type":"ms","text":13713.932000100613},{"type":"ms","text":13898.50699994713},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Bronto_Connector/js/client.js"},{"type":"ms","text":13716.25000052154},{"type":"ms","text":13898.943999782205},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Bronto_Connector/js/brontoStorage.js"},{"type":"ms","text":13719.685999676585},{"type":"ms","text":13899.32500012219},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/jquery/jquery.metadata.js"},{"type":"ms","text":13735.074000433087},{"type":"ms","text":13900.828000158072},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/form/form.js"},{"type":"ms","text":13812.64500040561},{"type":"ms","text":14123.947000131011},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Gene_AjaxLogin/js/action/login.js"},{"type":"ms","text":13815.449999645352},{"type":"ms","text":14129.045000299811},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Gene_AjaxLogin/js/model/ajax-login-messages.js"},{"type":"ms","text":13822.81699962914},{"type":"ms","text":14134.588000364602},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Gene_AjaxLogin/js/model/full-screen-loader.js"},{"type":"ms","text":13830.70100005716},{"type":"ms","text":14169.53600011766},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Catalog/js/product/storage/storage-service.js"},{"type":"ms","text":13863.446000032127},{"type":"ms","text":14173.403000459075},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/view/messages.js"},{"type":"ms","text":13863.734000362456},{"type":"ms","text":14178.780999965966},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Customer/js/model/authentication-popup.js"},{"type":"ms","text":13942.592999897897},{"type":"ms","text":14181.208000518382},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/modal/alert.js"},{"type":"ms","text":13943.93299985677},{"type":"ms","text":14185.828000307083},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/mage/decorate.js"},{"type":"ms","text":13945.218999870121},{"type":"ms","text":14189.04700037092},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/lib/spinner.js"},{"type":"ms","text":14147.424000315368},{"type":"ms","text":14329.010999761522},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/mage/requirejs/resolver.js"},{"type":"ms","text":14148.431000299752},{"type":"ms","text":14332.457999698818},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/model/messageList.js"},{"type":"ms","text":14161.14000044763},{"type":"ms","text":14336.395000107586},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/model/messages.js"},{"type":"ms","text":14166.941000148654},{"type":"ms","text":14340.90100042522},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Customer/js/invalidation-rules/website-rule.js"},{"type":"ms","text":14197.425999678671},{"type":"ms","text":14346.20700031519},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Catalog/js/product/storage/ids-storage.js"},{"type":"ms","text":14264.736000448465},{"type":"ms","text":14409.397999756038},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Catalog/js/product/storage/data-storage.js"},{"type":"ms","text":14267.273000441492},{"type":"ms","text":14412.123000249267},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Catalog/js/product/storage/ids-storage-compare.js"},{"type":"ms","text":14268.535000272095},{"type":"ms","text":14414.19699974358},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/customer/section/load/?sections=cart&update_section_id=false&_=1524587388699"},{"type":"ms","text":14301.590000279248},{"type":"ms","text":14950.295000337064},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/json"},{"type":"text","text":"xhr"}],[{"type":"url","text":"https://www.gro-store.com/customer/section/load/?sections=cart&update_section_id=false&_=1524587388700"},{"type":"ms","text":14310.920000076294},{"type":"ms","text":14928.829000331461},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/json"},{"type":"text","text":"xhr"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/js/form/adapter.js"},{"type":"ms","text":14323.0090001598},{"type":"ms","text":14452.89700012654},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Checkout/template/minicart/content.html"},{"type":"ms","text":14420.374000445008},{"type":"ms","text":14514.07799962908},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"text/html"},{"type":"text","text":"xhr"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Catalog/js/product/query-builder.js"},{"type":"ms","text":14445.743000134826},{"type":"ms","text":14613.780000247061},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"application/javascript"},{"type":"text","text":"script"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Gene_AjaxLogin/template/ajax-login.html"},{"type":"ms","text":14506.589000113308},{"type":"ms","text":14626.896999776363},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"text/html"},{"type":"text","text":"xhr"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Magento_Ui/templates/collection.html"},{"type":"ms","text":14695.617999881506},{"type":"ms","text":14836.563999764621},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"text/html"},{"type":"text","text":"xhr"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Gene_AjaxLogin/template/ajax-login-messages.html"},{"type":"ms","text":14811.243999749422},{"type":"ms","text":14905.496000312269},{"type":"bytes","text":0},{"type":"text","text":200},{"type":"text","text":"text/html"},{"type":"text","text":"xhr"}]]}},"pwa-cross-browser":{"score":false,"displayValue":"","rawValue":false,"scoringMode":"binary","informative":true,"manual":true,"name":"pwa-cross-browser","description":"Site works cross-browser","helpText":"To reach the most number of users, sites should work across every major browser. [Learn more](https://developers.google.com/web/progressive-web-apps/checklist#site-works-cross-browser)."},"pwa-page-transitions":{"score":false,"displayValue":"","rawValue":false,"scoringMode":"binary","informative":true,"manual":true,"name":"pwa-page-transitions","description":"Page transitions don't feel like they block on the network","helpText":"Transitions should feel snappy as you tap around, even on a slow network, a key to perceived performance. [Learn more](https://developers.google.com/web/progressive-web-apps/checklist#page-transitions-dont-feel-like-they-block-on-the-network)."},"pwa-each-page-has-url":{"score":false,"displayValue":"","rawValue":false,"scoringMode":"binary","informative":true,"manual":true,"name":"pwa-each-page-has-url","description":"Each page has a URL","helpText":"Ensure individual pages are deep linkable via the URLs and that URLs are unique for the purpose of shareability on social media. [Learn more](https://developers.google.com/web/progressive-web-apps/checklist#each-page-has-a-url)."},"accesskeys":{"score":false,"displayValue":"","rawValue":false,"scoringMode":"binary","informative":true,"notApplicable":true,"name":"accesskeys","description":"`[accesskey]` values are not unique","helpText":"Access keys let users quickly focus a part of the page. For proper navigation, each access key must be unique. [Learn more](https://dequeuniversity.com/rules/axe/2.2/accesskeys?application=lighthouse)."},"aria-allowed-attr":{"score":true,"displayValue":"","rawValue":true,"extendedInfo":{},"scoringMode":"binary","name":"aria-allowed-attr","description":"`[aria-*]` attributes match their roles","helpText":"Each ARIA `role` supports a specific subset of `aria-*` attributes. Mismatching these invalidates the `aria-*` attributes. [Learn more](https://dequeuniversity.com/rules/axe/2.2/aria-allowed-attr?application=lighthouse).","details":{"type":"list","header":{"type":"text","text":"View failing elements"},"items":[]}},"aria-required-attr":{"score":true,"displayValue":"","rawValue":true,"extendedInfo":{},"scoringMode":"binary","name":"aria-required-attr","description":"`[role]`s have all required `[aria-*]` attributes","helpText":"Some ARIA roles have required attributes that describe the state of the element to screen readers. [Learn more](https://dequeuniversity.com/rules/axe/2.2/aria-required-attr?application=lighthouse).","details":{"type":"list","header":{"type":"text","text":"View failing elements"},"items":[]}},"aria-required-children":{"score":true,"displayValue":"","rawValue":true,"extendedInfo":{},"scoringMode":"binary","name":"aria-required-children","description":"Elements with `[role]` that require specific children `[role]`s, are present","helpText":"Some ARIA parent roles must contain specific child roles to perform their intended accessibility functions. [Learn more](https://dequeuniversity.com/rules/axe/2.2/aria-required-children?application=lighthouse).","details":{"type":"list","header":{"type":"text","text":"View failing elements"},"items":[]}},"aria-required-parent":{"score":true,"displayValue":"","rawValue":true,"extendedInfo":{},"scoringMode":"binary","name":"aria-required-parent","description":"`[role]`s are contained by their required parent element","helpText":"Some ARIA child roles must be contained by specific parent roles to properly perform their intended accessibility functions. [Learn more](https://dequeuniversity.com/rules/axe/2.2/aria-required-parent?application=lighthouse).","details":{"type":"list","header":{"type":"text","text":"View failing elements"},"items":[]}},"aria-roles":{"score":true,"displayValue":"","rawValue":true,"extendedInfo":{},"scoringMode":"binary","name":"aria-roles","description":"`[role]` values are valid","helpText":"ARIA roles must have valid values in order to perform their intended accessibility functions. [Learn more](https://dequeuniversity.com/rules/axe/2.2/aria-roles?application=lighthouse).","details":{"type":"list","header":{"type":"text","text":"View failing elements"},"items":[]}},"aria-valid-attr-value":{"score":false,"displayValue":"","rawValue":false,"extendedInfo":{"value":{"id":"aria-valid-attr-value","impact":"critical","tags":["cat.aria","wcag2a","wcag131","wcag411","wcag412"],"description":"Ensures all ARIA attributes have valid values","help":"ARIA attributes must conform to valid values","helpUrl":"https://dequeuniversity.com/rules/axe/3.0/aria-valid-attr-value?application=axeAPI","nodes":[{"impact":"critical","html":"<div class=\"item product product-item single-product slick-slide slick-current slick-active\" tabindex=\"-1\" role=\"option\" aria-describedby=\"slick-slide00\" style=\"width: 184px;\" data-slick-index=\"0\" aria-hidden=\"false\">","target":[".slick-current"],"failureSummary":"Fix all of the following:\n  Invalid ARIA attribute value: aria-describedby=\"slick-slide00\"","path":"1,HTML,1,BODY,7,DIV,0,DIV,1,MAIN,2,DIV,0,DIV,11,DIV,0,DIV,0,DIV,2,DIV,0,DIV,0,DIV,0,DIV,2,DIV","snippet":"<div class=\"item product product-item single-product slick-slide slick-current slick-active\" tabindex=\"-1\" role=\"option\" aria-describedby=\"slick-slide00\" style=\"width: 184px;\" data-slick-index=\"0\" aria-hidden=\"false\">"},{"impact":"critical","html":"<div class=\"item product product-item single-product slick-slide slick-active\" tabindex=\"-1\" role=\"option\" aria-describedby=\"slick-slide01\" style=\"width: 184px;\" data-slick-index=\"1\" aria-hidden=\"false\">","target":["div[data-slick-index=\"\\31 \"]"],"failureSummary":"Fix all of the following:\n  Invalid ARIA attribute value: aria-describedby=\"slick-slide01\"","path":"1,HTML,1,BODY,7,DIV,0,DIV,1,MAIN,2,DIV,0,DIV,11,DIV,0,DIV,0,DIV,2,DIV,0,DIV,0,DIV,0,DIV,3,DIV","snippet":"<div class=\"item product product-item single-product slick-slide slick-active\" tabindex=\"-1\" role=\"option\" aria-describedby=\"slick-slide01\" style=\"width: 184px;\" data-slick-index=\"1\" aria-hidden=\"false\">"}]}},"scoringMode":"binary","name":"aria-valid-attr-value","description":"`[aria-*]` attributes do not have valid values","helpText":"Assistive technologies, like screen readers, can't interpret ARIA attributes with invalid values. [Learn more](https://dequeuniversity.com/rules/axe/2.2/aria-valid-attr-value?application=lighthouse).","details":{"type":"list","header":{"type":"text","text":"View failing elements"},"items":[{"type":"node","selector":".slick-current","path":"1,HTML,1,BODY,7,DIV,0,DIV,1,MAIN,2,DIV,0,DIV,11,DIV,0,DIV,0,DIV,2,DIV,0,DIV,0,DIV,0,DIV,2,DIV","snippet":"<div class=\"item product product-item single-product slick-slide slick-current slick-active\" tabindex=\"-1\" role=\"option\" aria-describedby=\"slick-slide00\" style=\"width: 184px;\" data-slick-index=\"0\" aria-hidden=\"false\">"},{"type":"node","selector":"div[data-slick-index=\"\\31 \"]","path":"1,HTML,1,BODY,7,DIV,0,DIV,1,MAIN,2,DIV,0,DIV,11,DIV,0,DIV,0,DIV,2,DIV,0,DIV,0,DIV,0,DIV,3,DIV","snippet":"<div class=\"item product product-item single-product slick-slide slick-active\" tabindex=\"-1\" role=\"option\" aria-describedby=\"slick-slide01\" style=\"width: 184px;\" data-slick-index=\"1\" aria-hidden=\"false\">"}]}},"aria-valid-attr":{"score":true,"displayValue":"","rawValue":true,"extendedInfo":{},"scoringMode":"binary","name":"aria-valid-attr","description":"`[aria-*]` attributes are valid and not misspelled","helpText":"Assistive technologies, like screen readers, can't interpret ARIA attributes with invalid names. [Learn more](https://dequeuniversity.com/rules/axe/2.2/aria-valid-attr?application=lighthouse).","details":{"type":"list","header":{"type":"text","text":"View failing elements"},"items":[]}},"audio-caption":{"score":false,"displayValue":"","rawValue":false,"scoringMode":"binary","informative":true,"notApplicable":true,"name":"audio-caption","description":"`<audio>` elements are missing a `<track>` element with `[kind=\"captions\"]`.","helpText":"Captions make audio elements usable for deaf or hearing-impaired users, providing critical information such as who is talking, what they're saying, and other non-speech information. [Learn more](https://dequeuniversity.com/rules/axe/2.2/audio-caption?application=lighthouse)."},"button-name":{"score":true,"displayValue":"","rawValue":true,"extendedInfo":{},"scoringMode":"binary","name":"button-name","description":"Buttons have an accessible name","helpText":"When a button doesn't have an accessible name, screen readers announce it as \"button\", making it unusable for users who rely on screen readers. [Learn more](https://dequeuniversity.com/rules/axe/2.2/button-name?application=lighthouse).","details":{"type":"list","header":{"type":"text","text":"View failing elements"},"items":[]}},"bypass":{"score":true,"displayValue":"","rawValue":true,"extendedInfo":{},"scoringMode":"binary","name":"bypass","description":"The page contains a heading, skip link, or landmark region","helpText":"Adding ways to bypass repetitive content lets keyboard users navigate the page more efficiently. [Learn more](https://dequeuniversity.com/rules/axe/2.2/bypass?application=lighthouse).","details":{"type":"list","header":{"type":"text","text":"View failing elements"},"items":[]}},"color-contrast":{"score":false,"displayValue":"","rawValue":false,"extendedInfo":{"value":{"id":"color-contrast","impact":"serious","tags":["cat.color","wcag2aa","wcag143"],"description":"Ensures the contrast between foreground and background colors meets WCAG 2 AA contrast ratio thresholds","help":"Elements must have sufficient color contrast","helpUrl":"https://dequeuniversity.com/rules/axe/3.0/color-contrast?application=axeAPI","nodes":[{"impact":"serious","html":"<span>Shop Now</span>","target":[".bluefoot-advanced-slide__button > .button[type=\"button\"] > span > span"],"failureSummary":"Fix any of the following:\n  Element has insufficient color contrast of 3.9 (foreground color: #ffffff, background color: #d6556b, font size: 10.5pt, font weight: normal). Expected contrast ratio of 4.5:1","path":"1,HTML,1,BODY,7,DIV,0,DIV,1,MAIN,2,DIV,0,DIV,6,DIV,0,DIV,0,DIV,1,DIV,0,DIV,1,DIV,0,DIV,1,DIV,1,DIV,0,BUTTON,0,SPAN,0,SPAN","snippet":"<span>"},{"impact":"serious","html":"<span>Shop Now</span>","target":[":root > span > span"],"failureSummary":"Fix any of the following:\n  Element has insufficient color contrast of 3.9 (foreground color: #ffffff, background color: #d6556b, font size: 10.5pt, font weight: normal). Expected contrast ratio of 4.5:1","path":"1,HTML,1,BODY,7,DIV,0,DIV,1,MAIN,2,DIV,0,DIV,9,DIV,0,DIV,1,DIV,0,DIV,2,A,0,SPAN,0,SPAN","snippet":"<span>"},{"impact":"serious","html":"<span class=\"action primary\">Shop Now</span>","target":["#bluefoot-driver-1230 > .ratio[href$=\"new-born.html\"] > .bluefoot-driver-text > .bluefoot-driver-button.content-item > .primary.action"],"failureSummary":"Fix any of the following:\n  Element has insufficient color contrast of 3.9 (foreground color: #ffffff, background color: #d6556b, font size: 10.5pt, font weight: normal). Expected contrast ratio of 4.5:1","path":"1,HTML,1,BODY,7,DIV,0,DIV,1,MAIN,2,DIV,0,DIV,10,DIV,0,DIV,1,DIV,0,A,1,SPAN,1,SPAN,0,SPAN","snippet":"<span class=\"action primary\">"},{"impact":"serious","html":"<span class=\"action primary\">Shop Now</span>","target":["#bluefoot-driver-1231 > .ratio[href$=\"baby.html\"] > .bluefoot-driver-text > .bluefoot-driver-button.content-item > .primary.action"],"failureSummary":"Fix any of the following:\n  Element has insufficient color contrast of 3.9 (foreground color: #ffffff, background color: #d6556b, font size: 10.5pt, font weight: normal). Expected contrast ratio of 4.5:1","path":"1,HTML,1,BODY,7,DIV,0,DIV,1,MAIN,2,DIV,0,DIV,10,DIV,1,DIV,1,DIV,0,A,1,SPAN,1,SPAN,0,SPAN","snippet":"<span class=\"action primary\">"},{"impact":"serious","html":"<span class=\"action primary\">Shop Now</span>","target":["#bluefoot-driver-1232 > .ratio[href$=\"toddler.html\"] > .bluefoot-driver-text > .bluefoot-driver-button.content-item > .primary.action"],"failureSummary":"Fix any of the following:\n  Element has insufficient color contrast of 3.9 (foreground color: #ffffff, background color: #d6556b, font size: 10.5pt, font weight: normal). Expected contrast ratio of 4.5:1","path":"1,HTML,1,BODY,7,DIV,0,DIV,1,MAIN,2,DIV,0,DIV,10,DIV,2,DIV,1,DIV,0,A,1,SPAN,1,SPAN,0,SPAN","snippet":"<span class=\"action primary\">"},{"impact":"serious","html":"<span>Shop All</span>","target":[".advanced-product-list__content > a[href$=\"grobag.html\"] > span > span"],"failureSummary":"Fix any of the following:\n  Element has insufficient color contrast of 3.9 (foreground color: #ffffff, background color: #d6556b, font size: 10.5pt, font weight: normal). Expected contrast ratio of 4.5:1","path":"1,HTML,1,BODY,7,DIV,0,DIV,1,MAIN,2,DIV,0,DIV,11,DIV,0,DIV,0,DIV,1,DIV,0,DIV,2,A,0,SPAN,0,SPAN","snippet":"<span>"},{"impact":"serious","html":"<span class=\"price-label from\">From</span>","target":[".slick-current > .advanced-product-item__inner > .bluefoot-normalise-heights.product-item-info[data-container=\"product-grid\"] > .details.product-item-details.product > .price-box[data-product-id=\"\\35 32\"][data-role=\"priceBox\"] > .configurable-product__price > .from.price-label"],"failureSummary":"Fix any of the following:\n  Element has insufficient color contrast of 3.11 (foreground color: #929292, background color: #ffffff, font size: 13.5pt, font weight: normal). Expected contrast ratio of 4.5:1","path":"1,HTML,1,BODY,7,DIV,0,DIV,1,MAIN,2,DIV,0,DIV,11,DIV,0,DIV,0,DIV,2,DIV,0,DIV,0,DIV,0,DIV,2,DIV,0,DIV,0,DIV,1,DIV,1,DIV,0,DIV,0,SPAN","snippet":"<span class=\"price-label from\">"},{"impact":"serious","html":"<span class=\"price\">£34.99</span>","target":["#product-price-532 > .price"],"failureSummary":"Fix any of the following:\n  Element has insufficient color contrast of 3.11 (foreground color: #929292, background color: #ffffff, font size: 13.5pt, font weight: normal). Expected contrast ratio of 4.5:1","path":"1,HTML,1,BODY,7,DIV,0,DIV,1,MAIN,2,DIV,0,DIV,11,DIV,0,DIV,0,DIV,2,DIV,0,DIV,0,DIV,0,DIV,2,DIV,0,DIV,0,DIV,1,DIV,1,DIV,0,DIV,1,SPAN,0,SPAN,0,SPAN","snippet":"<span class=\"price\">"},{"impact":"serious","html":"<span>Buy <span class=\"mobile-hidden\">Now</span></span>","target":[".slick-current > .advanced-product-item__inner > .product-item-actions.actions.product > .actions-primary > .tocart[title=\"Buy\\ Now\"][type=\"button\"] > span"],"failureSummary":"Fix any of the following:\n  Element has insufficient color contrast of 3.9 (foreground color: #ffffff, background color: #d6556b, font size: 10.5pt, font weight: normal). Expected contrast ratio of 4.5:1","path":"1,HTML,1,BODY,7,DIV,0,DIV,1,MAIN,2,DIV,0,DIV,11,DIV,0,DIV,0,DIV,2,DIV,0,DIV,0,DIV,0,DIV,2,DIV,0,DIV,1,DIV,0,DIV,0,BUTTON,0,SPAN","snippet":"<span>"},{"impact":"serious","html":"<span class=\"price-label from\">From</span>","target":["div[data-slick-index=\"\\31 \"] > .advanced-product-item__inner > .bluefoot-normalise-heights.product-item-info[data-container=\"product-grid\"] > .details.product-item-details.product > .price-box[data-product-id=\"\\35 68\"][data-role=\"priceBox\"] > .configurable-product__price > .from.price-label"],"failureSummary":"Fix any of the following:\n  Element has insufficient color contrast of 3.11 (foreground color: #929292, background color: #ffffff, font size: 13.5pt, font weight: normal). Expected contrast ratio of 4.5:1","path":"1,HTML,1,BODY,7,DIV,0,DIV,1,MAIN,2,DIV,0,DIV,11,DIV,0,DIV,0,DIV,2,DIV,0,DIV,0,DIV,0,DIV,3,DIV,0,DIV,0,DIV,1,DIV,1,DIV,0,DIV,0,SPAN","snippet":"<span class=\"price-label from\">"},{"impact":"serious","html":"<span class=\"price\">£29.99</span>","target":["#product-price-568 > .price"],"failureSummary":"Fix any of the following:\n  Element has insufficient color contrast of 3.11 (foreground color: #929292, background color: #ffffff, font size: 13.5pt, font weight: normal). Expected contrast ratio of 4.5:1","path":"1,HTML,1,BODY,7,DIV,0,DIV,1,MAIN,2,DIV,0,DIV,11,DIV,0,DIV,0,DIV,2,DIV,0,DIV,0,DIV,0,DIV,3,DIV,0,DIV,0,DIV,1,DIV,1,DIV,0,DIV,1,SPAN,0,SPAN,0,SPAN","snippet":"<span class=\"price\">"},{"impact":"serious","html":"<span>Buy <span class=\"mobile-hidden\">Now</span></span>","target":["div[data-slick-index=\"\\31 \"] > .advanced-product-item__inner > .product-item-actions.actions.product > .actions-primary > .tocart[title=\"Buy\\ Now\"][type=\"button\"] > span"],"failureSummary":"Fix any of the following:\n  Element has insufficient color contrast of 3.9 (foreground color: #ffffff, background color: #d6556b, font size: 10.5pt, font weight: normal). Expected contrast ratio of 4.5:1","path":"1,HTML,1,BODY,7,DIV,0,DIV,1,MAIN,2,DIV,0,DIV,11,DIV,0,DIV,0,DIV,2,DIV,0,DIV,0,DIV,0,DIV,3,DIV,0,DIV,1,DIV,0,DIV,0,BUTTON,0,SPAN","snippet":"<span>"},{"impact":"serious","html":"<span class=\"price-label from\">From</span>","target":["div[data-product-id=\"\\35 72\"] > .configurable-product__price > .from.price-label"],"failureSummary":"Fix any of the following:\n  Element has insufficient color contrast of 3.11 (foreground color: #929292, background color: #ffffff, font size: 13.5pt, font weight: normal). Expected contrast ratio of 4.5:1","path":"1,HTML,1,BODY,7,DIV,0,DIV,1,MAIN,2,DIV,0,DIV,11,DIV,0,DIV,0,DIV,2,DIV,0,DIV,0,DIV,0,DIV,4,DIV,0,DIV,0,DIV,1,DIV,1,DIV,0,DIV,0,SPAN","snippet":"<span class=\"price-label from\">"},{"impact":"serious","html":"<span class=\"price\">£29.99</span>","target":["#product-price-572 > .price"],"failureSummary":"Fix any of the following:\n  Element has insufficient color contrast of 3.11 (foreground color: #929292, background color: #ffffff, font size: 13.5pt, font weight: normal). Expected contrast ratio of 4.5:1","path":"1,HTML,1,BODY,7,DIV,0,DIV,1,MAIN,2,DIV,0,DIV,11,DIV,0,DIV,0,DIV,2,DIV,0,DIV,0,DIV,0,DIV,4,DIV,0,DIV,0,DIV,1,DIV,1,DIV,0,DIV,1,SPAN,0,SPAN,0,SPAN","snippet":"<span class=\"price\">"},{"impact":"serious","html":"<span>Buy <span class=\"mobile-hidden\">Now</span></span>","target":["div[aria-describedby=\"slick-slide02\"] > .advanced-product-item__inner > .product-item-actions.actions.product > .actions-primary > .tocart[title=\"Buy\\ Now\"][type=\"button\"] > span"],"failureSummary":"Fix any of the following:\n  Element has insufficient color contrast of 3.9 (foreground color: #ffffff, background color: #d6556b, font size: 10.5pt, font weight: normal). Expected contrast ratio of 4.5:1","path":"1,HTML,1,BODY,7,DIV,0,DIV,1,MAIN,2,DIV,0,DIV,11,DIV,0,DIV,0,DIV,2,DIV,0,DIV,0,DIV,0,DIV,4,DIV,0,DIV,1,DIV,0,DIV,0,BUTTON,0,SPAN","snippet":"<span>"},{"impact":"serious","html":"<span class=\"price-label\">Now</span>","target":[".bluefoot-normalise-heights.product-item-info[data-container=\"product-grid\"] > .details.product-item-details.product > .price-box[data-product-id=\"\\34 55\"][data-role=\"priceBox\"] > .special-price > .price-container.tax.weee > .price-label"],"failureSummary":"Fix any of the following:\n  Element has insufficient color contrast of 3.24 (foreground color: #da6f6b, background color: #ffffff, font size: 13.5pt, font weight: normal). Expected contrast ratio of 4.5:1","path":"1,HTML,1,BODY,7,DIV,0,DIV,1,MAIN,2,DIV,0,DIV,11,DIV,0,DIV,0,DIV,2,DIV,0,DIV,0,DIV,0,DIV,5,DIV,0,DIV,0,DIV,1,DIV,1,DIV,0,SPAN,0,SPAN,0,SPAN","snippet":"<span class=\"price-label\">"},{"impact":"serious","html":"<span class=\"price\">£25.19</span>","target":[".bluefoot-normalise-heights.product-item-info[data-container=\"product-grid\"] > .details.product-item-details.product > .price-box[data-product-id=\"\\34 55\"][data-role=\"priceBox\"] > .special-price > .price-container.tax.weee > span[data-price-amount=\"\\32 5\\.19\"][content=\"\\32 5\\.19\"][data-price-type=\"finalPrice\"] > .price"],"failureSummary":"Fix any of the following:\n  Element has insufficient color contrast of 3.24 (foreground color: #da6f6b, background color: #ffffff, font size: 13.5pt, font weight: normal). Expected contrast ratio of 4.5:1","path":"1,HTML,1,BODY,7,DIV,0,DIV,1,MAIN,2,DIV,0,DIV,11,DIV,0,DIV,0,DIV,2,DIV,0,DIV,0,DIV,0,DIV,5,DIV,0,DIV,0,DIV,1,DIV,1,DIV,0,SPAN,0,SPAN,1,SPAN,0,SPAN","snippet":"<span class=\"price\">"},{"impact":"serious","html":"<span class=\"price-label\">Was</span>","target":[".bluefoot-normalise-heights.product-item-info[data-container=\"product-grid\"] > .details.product-item-details.product > .price-box[data-product-id=\"\\34 55\"][data-role=\"priceBox\"] > .sly-old-price.old-price > .price-container.tax.weee > .price-label"],"failureSummary":"Fix any of the following:\n  Element has insufficient color contrast of 3.11 (foreground color: #929292, background color: #ffffff, font size: 10.8pt, font weight: normal). Expected contrast ratio of 4.5:1","path":"1,HTML,1,BODY,7,DIV,0,DIV,1,MAIN,2,DIV,0,DIV,11,DIV,0,DIV,0,DIV,2,DIV,0,DIV,0,DIV,0,DIV,5,DIV,0,DIV,0,DIV,1,DIV,1,DIV,1,SPAN,0,SPAN,0,SPAN","snippet":"<span class=\"price-label\">"},{"impact":"serious","html":"<span class=\"price\">£35.99</span>","target":[".bluefoot-normalise-heights.product-item-info[data-container=\"product-grid\"] > .details.product-item-details.product > .price-box[data-product-id=\"\\34 55\"][data-role=\"priceBox\"] > .sly-old-price.old-price > .price-container.tax.weee > span[data-price-amount=\"\\33 5\\.99\"][content=\"\\33 5\\.99\"][data-price-type=\"oldPrice\"] > .price"],"failureSummary":"Fix any of the following:\n  Element has insufficient color contrast of 3.11 (foreground color: #929292, background color: #ffffff, font size: 10.8pt, font weight: normal). Expected contrast ratio of 4.5:1","path":"1,HTML,1,BODY,7,DIV,0,DIV,1,MAIN,2,DIV,0,DIV,11,DIV,0,DIV,0,DIV,2,DIV,0,DIV,0,DIV,0,DIV,5,DIV,0,DIV,0,DIV,1,DIV,1,DIV,1,SPAN,0,SPAN,1,SPAN,0,SPAN","snippet":"<span class=\"price\">"},{"impact":"serious","html":"<span>Buy <span class=\"mobile-hidden\">Now</span></span>","target":["div[aria-describedby=\"slick-slide03\"] > .advanced-product-item__inner > .product-item-actions.actions.product > .actions-primary > .tocart[title=\"Buy\\ Now\"][type=\"button\"] > span"],"failureSummary":"Fix any of the following:\n  Element has insufficient color contrast of 3.9 (foreground color: #ffffff, background color: #d6556b, font size: 10.5pt, font weight: normal). Expected contrast ratio of 4.5:1","path":"1,HTML,1,BODY,7,DIV,0,DIV,1,MAIN,2,DIV,0,DIV,11,DIV,0,DIV,0,DIV,2,DIV,0,DIV,0,DIV,0,DIV,5,DIV,0,DIV,1,DIV,0,DIV,0,BUTTON,0,SPAN","snippet":"<span>"},{"impact":"serious","html":"<span class=\"price-label\">Now</span>","target":["div[data-slick-index=\"\\34 \"] > .advanced-product-item__inner > .bluefoot-normalise-heights.product-item-info[data-container=\"product-grid\"] > .details.product-item-details.product > .price-box[data-product-id=\"\\34 63\"][data-role=\"priceBox\"] > .special-price > .price-container.tax.weee > .price-label"],"failureSummary":"Fix any of the following:\n  Element has insufficient color contrast of 3.24 (foreground color: #da6f6b, background color: #ffffff, font size: 13.5pt, font weight: normal). Expected contrast ratio of 4.5:1","path":"1,HTML,1,BODY,7,DIV,0,DIV,1,MAIN,2,DIV,0,DIV,11,DIV,0,DIV,0,DIV,2,DIV,0,DIV,0,DIV,0,DIV,6,DIV,0,DIV,0,DIV,1,DIV,1,DIV,0,SPAN,0,SPAN,0,SPAN","snippet":"<span class=\"price-label\">"},{"impact":"serious","html":"<span class=\"price\">£20.99</span>","target":["#product-price-463 > .price"],"failureSummary":"Fix any of the following:\n  Element has insufficient color contrast of 3.24 (foreground color: #da6f6b, background color: #ffffff, font size: 13.5pt, font weight: normal). Expected contrast ratio of 4.5:1","path":"1,HTML,1,BODY,7,DIV,0,DIV,1,MAIN,2,DIV,0,DIV,11,DIV,0,DIV,0,DIV,2,DIV,0,DIV,0,DIV,0,DIV,6,DIV,0,DIV,0,DIV,1,DIV,1,DIV,0,SPAN,0,SPAN,1,SPAN,0,SPAN","snippet":"<span class=\"price\">"},{"impact":"serious","html":"<span class=\"price-label\">Was</span>","target":["div[data-slick-index=\"\\34 \"] > .advanced-product-item__inner > .bluefoot-normalise-heights.product-item-info[data-container=\"product-grid\"] > .details.product-item-details.product > .price-box[data-product-id=\"\\34 63\"][data-role=\"priceBox\"] > .sly-old-price.old-price > .price-container.tax.weee > .price-label"],"failureSummary":"Fix any of the following:\n  Element has insufficient color contrast of 3.11 (foreground color: #929292, background color: #ffffff, font size: 10.8pt, font weight: normal). Expected contrast ratio of 4.5:1","path":"1,HTML,1,BODY,7,DIV,0,DIV,1,MAIN,2,DIV,0,DIV,11,DIV,0,DIV,0,DIV,2,DIV,0,DIV,0,DIV,0,DIV,6,DIV,0,DIV,0,DIV,1,DIV,1,DIV,1,SPAN,0,SPAN,0,SPAN","snippet":"<span class=\"price-label\">"},{"impact":"serious","html":"<span class=\"price\">£29.99</span>","target":["#old-price-463 > .price"],"failureSummary":"Fix any of the following:\n  Element has insufficient color contrast of 3.11 (foreground color: #929292, background color: #ffffff, font size: 10.8pt, font weight: normal). Expected contrast ratio of 4.5:1","path":"1,HTML,1,BODY,7,DIV,0,DIV,1,MAIN,2,DIV,0,DIV,11,DIV,0,DIV,0,DIV,2,DIV,0,DIV,0,DIV,0,DIV,6,DIV,0,DIV,0,DIV,1,DIV,1,DIV,1,SPAN,0,SPAN,1,SPAN,0,SPAN","snippet":"<span class=\"price\">"},{"impact":"serious","html":"<span>Buy <span class=\"mobile-hidden\">Now</span></span>","target":["div[data-slick-index=\"\\34 \"] > .advanced-product-item__inner > .product-item-actions.actions.product > .actions-primary > .tocart[title=\"Buy\\ Now\"][type=\"button\"] > span"],"failureSummary":"Fix any of the following:\n  Element has insufficient color contrast of 3.9 (foreground color: #ffffff, background color: #d6556b, font size: 10.5pt, font weight: normal). Expected contrast ratio of 4.5:1","path":"1,HTML,1,BODY,7,DIV,0,DIV,1,MAIN,2,DIV,0,DIV,11,DIV,0,DIV,0,DIV,2,DIV,0,DIV,0,DIV,0,DIV,6,DIV,0,DIV,1,DIV,0,DIV,0,BUTTON,0,SPAN","snippet":"<span>"},{"impact":"serious","html":"<span class=\"price-label from\">From</span>","target":["div[data-slick-index=\"\\35 \"] > .advanced-product-item__inner > .bluefoot-normalise-heights.product-item-info[data-container=\"product-grid\"] > .details.product-item-details.product > .price-box[data-product-id=\"\\34 62\"][data-role=\"priceBox\"] > .configurable-product__price > .from.price-label"],"failureSummary":"Fix any of the following:\n  Element has insufficient color contrast of 3.11 (foreground color: #929292, background color: #ffffff, font size: 13.5pt, font weight: normal). Expected contrast ratio of 4.5:1","path":"1,HTML,1,BODY,7,DIV,0,DIV,1,MAIN,2,DIV,0,DIV,11,DIV,0,DIV,0,DIV,2,DIV,0,DIV,0,DIV,0,DIV,7,DIV,0,DIV,0,DIV,1,DIV,1,DIV,0,DIV,0,SPAN","snippet":"<span class=\"price-label from\">"},{"impact":"serious","html":"<span class=\"price\">£35.00</span>","target":["#product-price-462 > .price"],"failureSummary":"Fix any of the following:\n  Element has insufficient color contrast of 3.11 (foreground color: #929292, background color: #ffffff, font size: 13.5pt, font weight: normal). Expected contrast ratio of 4.5:1","path":"1,HTML,1,BODY,7,DIV,0,DIV,1,MAIN,2,DIV,0,DIV,11,DIV,0,DIV,0,DIV,2,DIV,0,DIV,0,DIV,0,DIV,7,DIV,0,DIV,0,DIV,1,DIV,1,DIV,0,DIV,1,SPAN,0,SPAN,0,SPAN","snippet":"<span class=\"price\">"},{"impact":"serious","html":"<span>Buy <span class=\"mobile-hidden\">Now</span></span>","target":["div[data-slick-index=\"\\35 \"] > .advanced-product-item__inner > .product-item-actions.actions.product > .actions-primary > .tocart[title=\"Buy\\ Now\"][type=\"button\"] > span"],"failureSummary":"Fix any of the following:\n  Element has insufficient color contrast of 3.9 (foreground color: #ffffff, background color: #d6556b, font size: 10.5pt, font weight: normal). Expected contrast ratio of 4.5:1","path":"1,HTML,1,BODY,7,DIV,0,DIV,1,MAIN,2,DIV,0,DIV,11,DIV,0,DIV,0,DIV,2,DIV,0,DIV,0,DIV,0,DIV,7,DIV,0,DIV,1,DIV,0,DIV,0,BUTTON,0,SPAN","snippet":"<span>"},{"impact":"serious","html":"<span class=\"price-label from\">From</span>","target":["div[data-slick-index=\"\\36 \"] > .advanced-product-item__inner > .bluefoot-normalise-heights.product-item-info[data-container=\"product-grid\"] > .details.product-item-details.product > .price-box[data-product-id=\"\\35 32\"][data-role=\"priceBox\"] > .configurable-product__price > .from.price-label"],"failureSummary":"Fix any of the following:\n  Element has insufficient color contrast of 3.11 (foreground color: #929292, background color: #ffffff, font size: 13.5pt, font weight: normal). Expected contrast ratio of 4.5:1","path":"1,HTML,1,BODY,7,DIV,0,DIV,1,MAIN,2,DIV,0,DIV,11,DIV,0,DIV,0,DIV,2,DIV,0,DIV,0,DIV,0,DIV,8,DIV,0,DIV,0,DIV,1,DIV,1,DIV,0,DIV,0,SPAN","snippet":"<span class=\"price-label from\">"},{"impact":"serious","html":"<span class=\"price\">£34.99</span>","target":["div[data-slick-index=\"\\36 \"] > .advanced-product-item__inner > .bluefoot-normalise-heights.product-item-info[data-container=\"product-grid\"] > .details.product-item-details.product > .price-box[data-product-id=\"\\35 32\"][data-role=\"priceBox\"] > .configurable-product__price > .price-container.tax.weee > span[data-price-amount=\"\\33 4\\.99\"][content=\"\\33 4\\.99\"][data-price-type=\"finalPrice\"] > .price"],"failureSummary":"Fix any of the following:\n  Element has insufficient color contrast of 3.11 (foreground color: #929292, background color: #ffffff, font size: 13.5pt, font weight: normal). Expected contrast ratio of 4.5:1","path":"1,HTML,1,BODY,7,DIV,0,DIV,1,MAIN,2,DIV,0,DIV,11,DIV,0,DIV,0,DIV,2,DIV,0,DIV,0,DIV,0,DIV,8,DIV,0,DIV,0,DIV,1,DIV,1,DIV,0,DIV,1,SPAN,0,SPAN,0,SPAN","snippet":"<span class=\"price\">"},{"impact":"serious","html":"<span>Buy <span class=\"mobile-hidden\">Now</span></span>","target":["div[data-slick-index=\"\\36 \"] > .advanced-product-item__inner > .product-item-actions.actions.product > .actions-primary > .tocart[title=\"Buy\\ Now\"][type=\"button\"] > span"],"failureSummary":"Fix any of the following:\n  Element has insufficient color contrast of 3.9 (foreground color: #ffffff, background color: #d6556b, font size: 10.5pt, font weight: normal). Expected contrast ratio of 4.5:1","path":"1,HTML,1,BODY,7,DIV,0,DIV,1,MAIN,2,DIV,0,DIV,11,DIV,0,DIV,0,DIV,2,DIV,0,DIV,0,DIV,0,DIV,8,DIV,0,DIV,1,DIV,0,DIV,0,BUTTON,0,SPAN","snippet":"<span>"},{"impact":"serious","html":"<span class=\"price-label from\">From</span>","target":["div[data-slick-index=\"\\37 \"] > .advanced-product-item__inner > .bluefoot-normalise-heights.product-item-info[data-container=\"product-grid\"] > .details.product-item-details.product > .price-box[data-product-id=\"\\35 68\"][data-role=\"priceBox\"] > .configurable-product__price > .from.price-label"],"failureSummary":"Fix any of the following:\n  Element has insufficient color contrast of 3.11 (foreground color: #929292, background color: #ffffff, font size: 13.5pt, font weight: normal). Expected contrast ratio of 4.5:1","path":"1,HTML,1,BODY,7,DIV,0,DIV,1,MAIN,2,DIV,0,DIV,11,DIV,0,DIV,0,DIV,2,DIV,0,DIV,0,DIV,0,DIV,9,DIV,0,DIV,0,DIV,1,DIV,1,DIV,0,DIV,0,SPAN","snippet":"<span class=\"price-label from\">"},{"impact":"serious","html":"<span class=\"price\">£29.99</span>","target":["div[data-slick-index=\"\\37 \"] > .advanced-product-item__inner > .bluefoot-normalise-heights.product-item-info[data-container=\"product-grid\"] > .details.product-item-details.product > .price-box[data-product-id=\"\\35 68\"][data-role=\"priceBox\"] > .configurable-product__price > .price-container.tax.weee > span[data-price-amount=\"\\32 9\\.99\"][content=\"\\32 9\\.99\"][data-price-type=\"finalPrice\"] > .price"],"failureSummary":"Fix any of the following:\n  Element has insufficient color contrast of 3.11 (foreground color: #929292, background color: #ffffff, font size: 13.5pt, font weight: normal). Expected contrast ratio of 4.5:1","path":"1,HTML,1,BODY,7,DIV,0,DIV,1,MAIN,2,DIV,0,DIV,11,DIV,0,DIV,0,DIV,2,DIV,0,DIV,0,DIV,0,DIV,9,DIV,0,DIV,0,DIV,1,DIV,1,DIV,0,DIV,1,SPAN,0,SPAN,0,SPAN","snippet":"<span class=\"price\">"},{"impact":"serious","html":"<span>Buy <span class=\"mobile-hidden\">Now</span></span>","target":["div[data-slick-index=\"\\37 \"] > .advanced-product-item__inner > .product-item-actions.actions.product > .actions-primary > .tocart[title=\"Buy\\ Now\"][type=\"button\"] > span"],"failureSummary":"Fix any of the following:\n  Element has insufficient color contrast of 3.9 (foreground color: #ffffff, background color: #d6556b, font size: 10.5pt, font weight: normal). Expected contrast ratio of 4.5:1","path":"1,HTML,1,BODY,7,DIV,0,DIV,1,MAIN,2,DIV,0,DIV,11,DIV,0,DIV,0,DIV,2,DIV,0,DIV,0,DIV,0,DIV,9,DIV,0,DIV,1,DIV,0,DIV,0,BUTTON,0,SPAN","snippet":"<span>"},{"impact":"serious","html":"<span class=\"nosto-newprice price\">£23.50</span>","target":[".nosto-newprice"],"failureSummary":"Fix any of the following:\n  Element has insufficient color contrast of 3.11 (foreground color: #929292, background color: #ffffff, font size: 13.5pt, font weight: normal). Expected contrast ratio of 4.5:1","path":"1,HTML,1,BODY,7,DIV,0,DIV,1,MAIN,2,DIV,0,DIV,16,DIV,0,DIV,0,DIV,0,DIV,1,DIV,0,DIV,0,DIV,0,DIV,1,DIV,1,DIV,0,SPAN","snippet":"<span class=\"nosto-newprice price\">"},{"impact":"serious","html":"<span>Buy <span class=\"mobile-hidden\">Now</span></span>","target":[".single-product.item.product-item:nth-child(1) > .product-item__inner > .product-item-actions.actions.product > .nosto-btn.button.primary > span"],"failureSummary":"Fix any of the following:\n  Element has insufficient color contrast of 3.9 (foreground color: #ffffff, background color: #d6556b, font size: 10.5pt, font weight: normal). Expected contrast ratio of 4.5:1","path":"1,HTML,1,BODY,7,DIV,0,DIV,1,MAIN,2,DIV,0,DIV,16,DIV,0,DIV,0,DIV,0,DIV,1,DIV,0,DIV,0,DIV,0,DIV,2,DIV,0,A,0,SPAN","snippet":"<span>"},{"impact":"serious","html":"<span class=\"old-price\">\n                                            £29.99\n                                        </span>","target":[".single-product.item.product-item:nth-child(2) > .product-item__inner > .details.product-item-details.full-width > .price-box.price-final_price[data-role=\"priceBox\"] > .old-price"],"failureSummary":"Fix any of the following:\n  Element has insufficient color contrast of 3.11 (foreground color: #929292, background color: #ffffff, font size: 13.5pt, font weight: normal). Expected contrast ratio of 4.5:1","path":"1,HTML,1,BODY,7,DIV,0,DIV,1,MAIN,2,DIV,0,DIV,16,DIV,0,DIV,0,DIV,0,DIV,1,DIV,0,DIV,1,DIV,0,DIV,1,DIV,1,DIV,0,SPAN","snippet":"<span class=\"old-price\">"},{"impact":"serious","html":"<span class=\"special-price\">\n                                            £20.99\n                                        </span>","target":[".single-product.item.product-item:nth-child(2) > .product-item__inner > .details.product-item-details.full-width > .price-box.price-final_price[data-role=\"priceBox\"] > .special-price"],"failureSummary":"Fix any of the following:\n  Element has insufficient color contrast of 3.24 (foreground color: #da6f6b, background color: #ffffff, font size: 13.5pt, font weight: normal). Expected contrast ratio of 4.5:1","path":"1,HTML,1,BODY,7,DIV,0,DIV,1,MAIN,2,DIV,0,DIV,16,DIV,0,DIV,0,DIV,0,DIV,1,DIV,0,DIV,1,DIV,0,DIV,1,DIV,1,DIV,1,SPAN","snippet":"<span class=\"special-price\">"},{"impact":"serious","html":"<span>Buy <span class=\"mobile-hidden\">Now</span></span>","target":[".single-product.item.product-item:nth-child(2) > .product-item__inner > .product-item-actions.actions.product > .nosto-btn.button.primary > span"],"failureSummary":"Fix any of the following:\n  Element has insufficient color contrast of 3.9 (foreground color: #ffffff, background color: #d6556b, font size: 10.5pt, font weight: normal). Expected contrast ratio of 4.5:1","path":"1,HTML,1,BODY,7,DIV,0,DIV,1,MAIN,2,DIV,0,DIV,16,DIV,0,DIV,0,DIV,0,DIV,1,DIV,0,DIV,1,DIV,0,DIV,2,DIV,0,A,0,SPAN","snippet":"<span>"},{"impact":"serious","html":"<span class=\"old-price\">\n                                            £32.99\n                                        </span>","target":[".single-product.item.product-item:nth-child(3) > .product-item__inner > .details.product-item-details.full-width > .price-box.price-final_price[data-role=\"priceBox\"] > .old-price"],"failureSummary":"Fix any of the following:\n  Element has insufficient color contrast of 3.11 (foreground color: #929292, background color: #ffffff, font size: 13.5pt, font weight: normal). Expected contrast ratio of 4.5:1","path":"1,HTML,1,BODY,7,DIV,0,DIV,1,MAIN,2,DIV,0,DIV,16,DIV,0,DIV,0,DIV,0,DIV,1,DIV,0,DIV,2,DIV,0,DIV,1,DIV,1,DIV,0,SPAN","snippet":"<span class=\"old-price\">"},{"impact":"serious","html":"<span class=\"special-price\">\n                                            £23.09\n                                        </span>","target":[".single-product.item.product-item:nth-child(3) > .product-item__inner > .details.product-item-details.full-width > .price-box.price-final_price[data-role=\"priceBox\"] > .special-price"],"failureSummary":"Fix any of the following:\n  Element has insufficient color contrast of 3.24 (foreground color: #da6f6b, background color: #ffffff, font size: 13.5pt, font weight: normal). Expected contrast ratio of 4.5:1","path":"1,HTML,1,BODY,7,DIV,0,DIV,1,MAIN,2,DIV,0,DIV,16,DIV,0,DIV,0,DIV,0,DIV,1,DIV,0,DIV,2,DIV,0,DIV,1,DIV,1,DIV,1,SPAN","snippet":"<span class=\"special-price\">"},{"impact":"serious","html":"<span>Buy <span class=\"mobile-hidden\">Now</span></span>","target":[".single-product.item.product-item:nth-child(3) > .product-item__inner > .product-item-actions.actions.product > .nosto-btn.button.primary > span"],"failureSummary":"Fix any of the following:\n  Element has insufficient color contrast of 3.9 (foreground color: #ffffff, background color: #d6556b, font size: 10.5pt, font weight: normal). Expected contrast ratio of 4.5:1","path":"1,HTML,1,BODY,7,DIV,0,DIV,1,MAIN,2,DIV,0,DIV,16,DIV,0,DIV,0,DIV,0,DIV,1,DIV,0,DIV,2,DIV,0,DIV,2,DIV,0,A,0,SPAN","snippet":"<span>"}]}},"scoringMode":"binary","name":"color-contrast","description":"Background and foreground colors do not have a sufficient contrast ratio.","helpText":"Low-contrast text is difficult or impossible for many users to read. [Learn more](https://dequeuniversity.com/rules/axe/2.2/color-contrast?application=lighthouse).","details":{"type":"list","header":{"type":"text","text":"View failing elements"},"items":[{"type":"node","selector":".bluefoot-advanced-slide__button > .button[type=\"button\"] > span > span","path":"1,HTML,1,BODY,7,DIV,0,DIV,1,MAIN,2,DIV,0,DIV,6,DIV,0,DIV,0,DIV,1,DIV,0,DIV,1,DIV,0,DIV,1,DIV,1,DIV,0,BUTTON,0,SPAN,0,SPAN","snippet":"<span>"},{"type":"node","selector":":root > span > span","path":"1,HTML,1,BODY,7,DIV,0,DIV,1,MAIN,2,DIV,0,DIV,9,DIV,0,DIV,1,DIV,0,DIV,2,A,0,SPAN,0,SPAN","snippet":"<span>"},{"type":"node","selector":"#bluefoot-driver-1230 > .ratio[href$=\"new-born.html\"] > .bluefoot-driver-text > .bluefoot-driver-button.content-item > .primary.action","path":"1,HTML,1,BODY,7,DIV,0,DIV,1,MAIN,2,DIV,0,DIV,10,DIV,0,DIV,1,DIV,0,A,1,SPAN,1,SPAN,0,SPAN","snippet":"<span class=\"action primary\">"},{"type":"node","selector":"#bluefoot-driver-1231 > .ratio[href$=\"baby.html\"] > .bluefoot-driver-text > .bluefoot-driver-button.content-item > .primary.action","path":"1,HTML,1,BODY,7,DIV,0,DIV,1,MAIN,2,DIV,0,DIV,10,DIV,1,DIV,1,DIV,0,A,1,SPAN,1,SPAN,0,SPAN","snippet":"<span class=\"action primary\">"},{"type":"node","selector":"#bluefoot-driver-1232 > .ratio[href$=\"toddler.html\"] > .bluefoot-driver-text > .bluefoot-driver-button.content-item > .primary.action","path":"1,HTML,1,BODY,7,DIV,0,DIV,1,MAIN,2,DIV,0,DIV,10,DIV,2,DIV,1,DIV,0,A,1,SPAN,1,SPAN,0,SPAN","snippet":"<span class=\"action primary\">"},{"type":"node","selector":".advanced-product-list__content > a[href$=\"grobag.html\"] > span > span","path":"1,HTML,1,BODY,7,DIV,0,DIV,1,MAIN,2,DIV,0,DIV,11,DIV,0,DIV,0,DIV,1,DIV,0,DIV,2,A,0,SPAN,0,SPAN","snippet":"<span>"},{"type":"node","selector":".slick-current > .advanced-product-item__inner > .bluefoot-normalise-heights.product-item-info[data-container=\"product-grid\"] > .details.product-item-details.product > .price-box[data-product-id=\"\\35 32\"][data-role=\"priceBox\"] > .configurable-product__price > .from.price-label","path":"1,HTML,1,BODY,7,DIV,0,DIV,1,MAIN,2,DIV,0,DIV,11,DIV,0,DIV,0,DIV,2,DIV,0,DIV,0,DIV,0,DIV,2,DIV,0,DIV,0,DIV,1,DIV,1,DIV,0,DIV,0,SPAN","snippet":"<span class=\"price-label from\">"},{"type":"node","selector":"#product-price-532 > .price","path":"1,HTML,1,BODY,7,DIV,0,DIV,1,MAIN,2,DIV,0,DIV,11,DIV,0,DIV,0,DIV,2,DIV,0,DIV,0,DIV,0,DIV,2,DIV,0,DIV,0,DIV,1,DIV,1,DIV,0,DIV,1,SPAN,0,SPAN,0,SPAN","snippet":"<span class=\"price\">"},{"type":"node","selector":".slick-current > .advanced-product-item__inner > .product-item-actions.actions.product > .actions-primary > .tocart[title=\"Buy\\ Now\"][type=\"button\"] > span","path":"1,HTML,1,BODY,7,DIV,0,DIV,1,MAIN,2,DIV,0,DIV,11,DIV,0,DIV,0,DIV,2,DIV,0,DIV,0,DIV,0,DIV,2,DIV,0,DIV,1,DIV,0,DIV,0,BUTTON,0,SPAN","snippet":"<span>"},{"type":"node","selector":"div[data-slick-index=\"\\31 \"] > .advanced-product-item__inner > .bluefoot-normalise-heights.product-item-info[data-container=\"product-grid\"] > .details.product-item-details.product > .price-box[data-product-id=\"\\35 68\"][data-role=\"priceBox\"] > .configurable-product__price > .from.price-label","path":"1,HTML,1,BODY,7,DIV,0,DIV,1,MAIN,2,DIV,0,DIV,11,DIV,0,DIV,0,DIV,2,DIV,0,DIV,0,DIV,0,DIV,3,DIV,0,DIV,0,DIV,1,DIV,1,DIV,0,DIV,0,SPAN","snippet":"<span class=\"price-label from\">"},{"type":"node","selector":"#product-price-568 > .price","path":"1,HTML,1,BODY,7,DIV,0,DIV,1,MAIN,2,DIV,0,DIV,11,DIV,0,DIV,0,DIV,2,DIV,0,DIV,0,DIV,0,DIV,3,DIV,0,DIV,0,DIV,1,DIV,1,DIV,0,DIV,1,SPAN,0,SPAN,0,SPAN","snippet":"<span class=\"price\">"},{"type":"node","selector":"div[data-slick-index=\"\\31 \"] > .advanced-product-item__inner > .product-item-actions.actions.product > .actions-primary > .tocart[title=\"Buy\\ Now\"][type=\"button\"] > span","path":"1,HTML,1,BODY,7,DIV,0,DIV,1,MAIN,2,DIV,0,DIV,11,DIV,0,DIV,0,DIV,2,DIV,0,DIV,0,DIV,0,DIV,3,DIV,0,DIV,1,DIV,0,DIV,0,BUTTON,0,SPAN","snippet":"<span>"},{"type":"node","selector":"div[data-product-id=\"\\35 72\"] > .configurable-product__price > .from.price-label","path":"1,HTML,1,BODY,7,DIV,0,DIV,1,MAIN,2,DIV,0,DIV,11,DIV,0,DIV,0,DIV,2,DIV,0,DIV,0,DIV,0,DIV,4,DIV,0,DIV,0,DIV,1,DIV,1,DIV,0,DIV,0,SPAN","snippet":"<span class=\"price-label from\">"},{"type":"node","selector":"#product-price-572 > .price","path":"1,HTML,1,BODY,7,DIV,0,DIV,1,MAIN,2,DIV,0,DIV,11,DIV,0,DIV,0,DIV,2,DIV,0,DIV,0,DIV,0,DIV,4,DIV,0,DIV,0,DIV,1,DIV,1,DIV,0,DIV,1,SPAN,0,SPAN,0,SPAN","snippet":"<span class=\"price\">"},{"type":"node","selector":"div[aria-describedby=\"slick-slide02\"] > .advanced-product-item__inner > .product-item-actions.actions.product > .actions-primary > .tocart[title=\"Buy\\ Now\"][type=\"button\"] > span","path":"1,HTML,1,BODY,7,DIV,0,DIV,1,MAIN,2,DIV,0,DIV,11,DIV,0,DIV,0,DIV,2,DIV,0,DIV,0,DIV,0,DIV,4,DIV,0,DIV,1,DIV,0,DIV,0,BUTTON,0,SPAN","snippet":"<span>"},{"type":"node","selector":".bluefoot-normalise-heights.product-item-info[data-container=\"product-grid\"] > .details.product-item-details.product > .price-box[data-product-id=\"\\34 55\"][data-role=\"priceBox\"] > .special-price > .price-container.tax.weee > .price-label","path":"1,HTML,1,BODY,7,DIV,0,DIV,1,MAIN,2,DIV,0,DIV,11,DIV,0,DIV,0,DIV,2,DIV,0,DIV,0,DIV,0,DIV,5,DIV,0,DIV,0,DIV,1,DIV,1,DIV,0,SPAN,0,SPAN,0,SPAN","snippet":"<span class=\"price-label\">"},{"type":"node","selector":".bluefoot-normalise-heights.product-item-info[data-container=\"product-grid\"] > .details.product-item-details.product > .price-box[data-product-id=\"\\34 55\"][data-role=\"priceBox\"] > .special-price > .price-container.tax.weee > span[data-price-amount=\"\\32 5\\.19\"][content=\"\\32 5\\.19\"][data-price-type=\"finalPrice\"] > .price","path":"1,HTML,1,BODY,7,DIV,0,DIV,1,MAIN,2,DIV,0,DIV,11,DIV,0,DIV,0,DIV,2,DIV,0,DIV,0,DIV,0,DIV,5,DIV,0,DIV,0,DIV,1,DIV,1,DIV,0,SPAN,0,SPAN,1,SPAN,0,SPAN","snippet":"<span class=\"price\">"},{"type":"node","selector":".bluefoot-normalise-heights.product-item-info[data-container=\"product-grid\"] > .details.product-item-details.product > .price-box[data-product-id=\"\\34 55\"][data-role=\"priceBox\"] > .sly-old-price.old-price > .price-container.tax.weee > .price-label","path":"1,HTML,1,BODY,7,DIV,0,DIV,1,MAIN,2,DIV,0,DIV,11,DIV,0,DIV,0,DIV,2,DIV,0,DIV,0,DIV,0,DIV,5,DIV,0,DIV,0,DIV,1,DIV,1,DIV,1,SPAN,0,SPAN,0,SPAN","snippet":"<span class=\"price-label\">"},{"type":"node","selector":".bluefoot-normalise-heights.product-item-info[data-container=\"product-grid\"] > .details.product-item-details.product > .price-box[data-product-id=\"\\34 55\"][data-role=\"priceBox\"] > .sly-old-price.old-price > .price-container.tax.weee > span[data-price-amount=\"\\33 5\\.99\"][content=\"\\33 5\\.99\"][data-price-type=\"oldPrice\"] > .price","path":"1,HTML,1,BODY,7,DIV,0,DIV,1,MAIN,2,DIV,0,DIV,11,DIV,0,DIV,0,DIV,2,DIV,0,DIV,0,DIV,0,DIV,5,DIV,0,DIV,0,DIV,1,DIV,1,DIV,1,SPAN,0,SPAN,1,SPAN,0,SPAN","snippet":"<span class=\"price\">"},{"type":"node","selector":"div[aria-describedby=\"slick-slide03\"] > .advanced-product-item__inner > .product-item-actions.actions.product > .actions-primary > .tocart[title=\"Buy\\ Now\"][type=\"button\"] > span","path":"1,HTML,1,BODY,7,DIV,0,DIV,1,MAIN,2,DIV,0,DIV,11,DIV,0,DIV,0,DIV,2,DIV,0,DIV,0,DIV,0,DIV,5,DIV,0,DIV,1,DIV,0,DIV,0,BUTTON,0,SPAN","snippet":"<span>"},{"type":"node","selector":"div[data-slick-index=\"\\34 \"] > .advanced-product-item__inner > .bluefoot-normalise-heights.product-item-info[data-container=\"product-grid\"] > .details.product-item-details.product > .price-box[data-product-id=\"\\34 63\"][data-role=\"priceBox\"] > .special-price > .price-container.tax.weee > .price-label","path":"1,HTML,1,BODY,7,DIV,0,DIV,1,MAIN,2,DIV,0,DIV,11,DIV,0,DIV,0,DIV,2,DIV,0,DIV,0,DIV,0,DIV,6,DIV,0,DIV,0,DIV,1,DIV,1,DIV,0,SPAN,0,SPAN,0,SPAN","snippet":"<span class=\"price-label\">"},{"type":"node","selector":"#product-price-463 > .price","path":"1,HTML,1,BODY,7,DIV,0,DIV,1,MAIN,2,DIV,0,DIV,11,DIV,0,DIV,0,DIV,2,DIV,0,DIV,0,DIV,0,DIV,6,DIV,0,DIV,0,DIV,1,DIV,1,DIV,0,SPAN,0,SPAN,1,SPAN,0,SPAN","snippet":"<span class=\"price\">"},{"type":"node","selector":"div[data-slick-index=\"\\34 \"] > .advanced-product-item__inner > .bluefoot-normalise-heights.product-item-info[data-container=\"product-grid\"] > .details.product-item-details.product > .price-box[data-product-id=\"\\34 63\"][data-role=\"priceBox\"] > .sly-old-price.old-price > .price-container.tax.weee > .price-label","path":"1,HTML,1,BODY,7,DIV,0,DIV,1,MAIN,2,DIV,0,DIV,11,DIV,0,DIV,0,DIV,2,DIV,0,DIV,0,DIV,0,DIV,6,DIV,0,DIV,0,DIV,1,DIV,1,DIV,1,SPAN,0,SPAN,0,SPAN","snippet":"<span class=\"price-label\">"},{"type":"node","selector":"#old-price-463 > .price","path":"1,HTML,1,BODY,7,DIV,0,DIV,1,MAIN,2,DIV,0,DIV,11,DIV,0,DIV,0,DIV,2,DIV,0,DIV,0,DIV,0,DIV,6,DIV,0,DIV,0,DIV,1,DIV,1,DIV,1,SPAN,0,SPAN,1,SPAN,0,SPAN","snippet":"<span class=\"price\">"},{"type":"node","selector":"div[data-slick-index=\"\\34 \"] > .advanced-product-item__inner > .product-item-actions.actions.product > .actions-primary > .tocart[title=\"Buy\\ Now\"][type=\"button\"] > span","path":"1,HTML,1,BODY,7,DIV,0,DIV,1,MAIN,2,DIV,0,DIV,11,DIV,0,DIV,0,DIV,2,DIV,0,DIV,0,DIV,0,DIV,6,DIV,0,DIV,1,DIV,0,DIV,0,BUTTON,0,SPAN","snippet":"<span>"},{"type":"node","selector":"div[data-slick-index=\"\\35 \"] > .advanced-product-item__inner > .bluefoot-normalise-heights.product-item-info[data-container=\"product-grid\"] > .details.product-item-details.product > .price-box[data-product-id=\"\\34 62\"][data-role=\"priceBox\"] > .configurable-product__price > .from.price-label","path":"1,HTML,1,BODY,7,DIV,0,DIV,1,MAIN,2,DIV,0,DIV,11,DIV,0,DIV,0,DIV,2,DIV,0,DIV,0,DIV,0,DIV,7,DIV,0,DIV,0,DIV,1,DIV,1,DIV,0,DIV,0,SPAN","snippet":"<span class=\"price-label from\">"},{"type":"node","selector":"#product-price-462 > .price","path":"1,HTML,1,BODY,7,DIV,0,DIV,1,MAIN,2,DIV,0,DIV,11,DIV,0,DIV,0,DIV,2,DIV,0,DIV,0,DIV,0,DIV,7,DIV,0,DIV,0,DIV,1,DIV,1,DIV,0,DIV,1,SPAN,0,SPAN,0,SPAN","snippet":"<span class=\"price\">"},{"type":"node","selector":"div[data-slick-index=\"\\35 \"] > .advanced-product-item__inner > .product-item-actions.actions.product > .actions-primary > .tocart[title=\"Buy\\ Now\"][type=\"button\"] > span","path":"1,HTML,1,BODY,7,DIV,0,DIV,1,MAIN,2,DIV,0,DIV,11,DIV,0,DIV,0,DIV,2,DIV,0,DIV,0,DIV,0,DIV,7,DIV,0,DIV,1,DIV,0,DIV,0,BUTTON,0,SPAN","snippet":"<span>"},{"type":"node","selector":"div[data-slick-index=\"\\36 \"] > .advanced-product-item__inner > .bluefoot-normalise-heights.product-item-info[data-container=\"product-grid\"] > .details.product-item-details.product > .price-box[data-product-id=\"\\35 32\"][data-role=\"priceBox\"] > .configurable-product__price > .from.price-label","path":"1,HTML,1,BODY,7,DIV,0,DIV,1,MAIN,2,DIV,0,DIV,11,DIV,0,DIV,0,DIV,2,DIV,0,DIV,0,DIV,0,DIV,8,DIV,0,DIV,0,DIV,1,DIV,1,DIV,0,DIV,0,SPAN","snippet":"<span class=\"price-label from\">"},{"type":"node","selector":"div[data-slick-index=\"\\36 \"] > .advanced-product-item__inner > .bluefoot-normalise-heights.product-item-info[data-container=\"product-grid\"] > .details.product-item-details.product > .price-box[data-product-id=\"\\35 32\"][data-role=\"priceBox\"] > .configurable-product__price > .price-container.tax.weee > span[data-price-amount=\"\\33 4\\.99\"][content=\"\\33 4\\.99\"][data-price-type=\"finalPrice\"] > .price","path":"1,HTML,1,BODY,7,DIV,0,DIV,1,MAIN,2,DIV,0,DIV,11,DIV,0,DIV,0,DIV,2,DIV,0,DIV,0,DIV,0,DIV,8,DIV,0,DIV,0,DIV,1,DIV,1,DIV,0,DIV,1,SPAN,0,SPAN,0,SPAN","snippet":"<span class=\"price\">"},{"type":"node","selector":"div[data-slick-index=\"\\36 \"] > .advanced-product-item__inner > .product-item-actions.actions.product > .actions-primary > .tocart[title=\"Buy\\ Now\"][type=\"button\"] > span","path":"1,HTML,1,BODY,7,DIV,0,DIV,1,MAIN,2,DIV,0,DIV,11,DIV,0,DIV,0,DIV,2,DIV,0,DIV,0,DIV,0,DIV,8,DIV,0,DIV,1,DIV,0,DIV,0,BUTTON,0,SPAN","snippet":"<span>"},{"type":"node","selector":"div[data-slick-index=\"\\37 \"] > .advanced-product-item__inner > .bluefoot-normalise-heights.product-item-info[data-container=\"product-grid\"] > .details.product-item-details.product > .price-box[data-product-id=\"\\35 68\"][data-role=\"priceBox\"] > .configurable-product__price > .from.price-label","path":"1,HTML,1,BODY,7,DIV,0,DIV,1,MAIN,2,DIV,0,DIV,11,DIV,0,DIV,0,DIV,2,DIV,0,DIV,0,DIV,0,DIV,9,DIV,0,DIV,0,DIV,1,DIV,1,DIV,0,DIV,0,SPAN","snippet":"<span class=\"price-label from\">"},{"type":"node","selector":"div[data-slick-index=\"\\37 \"] > .advanced-product-item__inner > .bluefoot-normalise-heights.product-item-info[data-container=\"product-grid\"] > .details.product-item-details.product > .price-box[data-product-id=\"\\35 68\"][data-role=\"priceBox\"] > .configurable-product__price > .price-container.tax.weee > span[data-price-amount=\"\\32 9\\.99\"][content=\"\\32 9\\.99\"][data-price-type=\"finalPrice\"] > .price","path":"1,HTML,1,BODY,7,DIV,0,DIV,1,MAIN,2,DIV,0,DIV,11,DIV,0,DIV,0,DIV,2,DIV,0,DIV,0,DIV,0,DIV,9,DIV,0,DIV,0,DIV,1,DIV,1,DIV,0,DIV,1,SPAN,0,SPAN,0,SPAN","snippet":"<span class=\"price\">"},{"type":"node","selector":"div[data-slick-index=\"\\37 \"] > .advanced-product-item__inner > .product-item-actions.actions.product > .actions-primary > .tocart[title=\"Buy\\ Now\"][type=\"button\"] > span","path":"1,HTML,1,BODY,7,DIV,0,DIV,1,MAIN,2,DIV,0,DIV,11,DIV,0,DIV,0,DIV,2,DIV,0,DIV,0,DIV,0,DIV,9,DIV,0,DIV,1,DIV,0,DIV,0,BUTTON,0,SPAN","snippet":"<span>"},{"type":"node","selector":".nosto-newprice","path":"1,HTML,1,BODY,7,DIV,0,DIV,1,MAIN,2,DIV,0,DIV,16,DIV,0,DIV,0,DIV,0,DIV,1,DIV,0,DIV,0,DIV,0,DIV,1,DIV,1,DIV,0,SPAN","snippet":"<span class=\"nosto-newprice price\">"},{"type":"node","selector":".single-product.item.product-item:nth-child(1) > .product-item__inner > .product-item-actions.actions.product > .nosto-btn.button.primary > span","path":"1,HTML,1,BODY,7,DIV,0,DIV,1,MAIN,2,DIV,0,DIV,16,DIV,0,DIV,0,DIV,0,DIV,1,DIV,0,DIV,0,DIV,0,DIV,2,DIV,0,A,0,SPAN","snippet":"<span>"},{"type":"node","selector":".single-product.item.product-item:nth-child(2) > .product-item__inner > .details.product-item-details.full-width > .price-box.price-final_price[data-role=\"priceBox\"] > .old-price","path":"1,HTML,1,BODY,7,DIV,0,DIV,1,MAIN,2,DIV,0,DIV,16,DIV,0,DIV,0,DIV,0,DIV,1,DIV,0,DIV,1,DIV,0,DIV,1,DIV,1,DIV,0,SPAN","snippet":"<span class=\"old-price\">"},{"type":"node","selector":".single-product.item.product-item:nth-child(2) > .product-item__inner > .details.product-item-details.full-width > .price-box.price-final_price[data-role=\"priceBox\"] > .special-price","path":"1,HTML,1,BODY,7,DIV,0,DIV,1,MAIN,2,DIV,0,DIV,16,DIV,0,DIV,0,DIV,0,DIV,1,DIV,0,DIV,1,DIV,0,DIV,1,DIV,1,DIV,1,SPAN","snippet":"<span class=\"special-price\">"},{"type":"node","selector":".single-product.item.product-item:nth-child(2) > .product-item__inner > .product-item-actions.actions.product > .nosto-btn.button.primary > span","path":"1,HTML,1,BODY,7,DIV,0,DIV,1,MAIN,2,DIV,0,DIV,16,DIV,0,DIV,0,DIV,0,DIV,1,DIV,0,DIV,1,DIV,0,DIV,2,DIV,0,A,0,SPAN","snippet":"<span>"},{"type":"node","selector":".single-product.item.product-item:nth-child(3) > .product-item__inner > .details.product-item-details.full-width > .price-box.price-final_price[data-role=\"priceBox\"] > .old-price","path":"1,HTML,1,BODY,7,DIV,0,DIV,1,MAIN,2,DIV,0,DIV,16,DIV,0,DIV,0,DIV,0,DIV,1,DIV,0,DIV,2,DIV,0,DIV,1,DIV,1,DIV,0,SPAN","snippet":"<span class=\"old-price\">"},{"type":"node","selector":".single-product.item.product-item:nth-child(3) > .product-item__inner > .details.product-item-details.full-width > .price-box.price-final_price[data-role=\"priceBox\"] > .special-price","path":"1,HTML,1,BODY,7,DIV,0,DIV,1,MAIN,2,DIV,0,DIV,16,DIV,0,DIV,0,DIV,0,DIV,1,DIV,0,DIV,2,DIV,0,DIV,1,DIV,1,DIV,1,SPAN","snippet":"<span class=\"special-price\">"},{"type":"node","selector":".single-product.item.product-item:nth-child(3) > .product-item__inner > .product-item-actions.actions.product > .nosto-btn.button.primary > span","path":"1,HTML,1,BODY,7,DIV,0,DIV,1,MAIN,2,DIV,0,DIV,16,DIV,0,DIV,0,DIV,0,DIV,1,DIV,0,DIV,2,DIV,0,DIV,2,DIV,0,A,0,SPAN","snippet":"<span>"}]}},"definition-list":{"score":false,"displayValue":"","rawValue":false,"scoringMode":"binary","informative":true,"notApplicable":true,"name":"definition-list","description":"`<dl>`'s do not contain only properly-ordered `<dt>` and `<dd>` groups, `<script>` or `<template>` elements.","helpText":"When definition lists are not properly marked up, screen readers may produce confusing or inaccurate output. [Learn more](https://dequeuniversity.com/rules/axe/2.2/definition-list?application=lighthouse)."},"dlitem":{"score":false,"displayValue":"","rawValue":false,"scoringMode":"binary","informative":true,"notApplicable":true,"name":"dlitem","description":"Definition list items are not wrapped in `<dl>` elements","helpText":"Definition list items (`<dt>` and `<dd>`) must be wrapped in a parent `<dl>` element to ensure that screen readers can properly announce them. [Learn more](https://dequeuniversity.com/rules/axe/2.2/dlitem?application=lighthouse)."},"document-title":{"score":true,"displayValue":"","rawValue":true,"extendedInfo":{},"scoringMode":"binary","name":"document-title","description":"Document has a `<title>` element","helpText":"The title gives screen reader users an overview of the page, and search engine users rely on it heavily to determine if a page is relevant to their search. [Learn more](https://developers.google.com/web/tools/lighthouse/audits/title).","details":{"type":"list","header":{"type":"text","text":"View failing elements"},"items":[]}},"duplicate-id":{"score":false,"displayValue":"","rawValue":false,"extendedInfo":{"value":{"id":"duplicate-id","impact":"moderate","tags":["cat.parsing","wcag2a","wcag411"],"description":"Ensures every id attribute value is unique","help":"id attribute value must be unique","helpUrl":"https://dequeuniversity.com/rules/axe/3.0/duplicate-id?application=axeAPI","nodes":[{"impact":"moderate","html":"<div id=\"bluefoot-driver-477\" class=\"bluefoot-driver bluefoot-advanced-driver bluefoot-entity\">","target":[".navigation > ul > .nav-1.parent.first > .childmenu.dropdown > .wrapper > .cms-extra-content.normalise-heights-container.level0 > .bluefoot-row.bluefoot-structural > .col-4.col.bluefoot-structural:nth-child(1) > .bluefoot-driver.bluefoot-advanced-driver.bluefoot-entity"],"failureSummary":"Fix any of the following:\n  Document has multiple elements with the same id attribute: bluefoot-driver-477","path":"1,HTML,1,BODY,7,DIV,0,DIV,0,HEADER,0,DIV,0,DIV,2,DIV,0,NAV,0,UL,1,LI,1,DIV,0,DIV,1,DIV,0,DIV,0,DIV,1,DIV","snippet":"<div id=\"bluefoot-driver-477\" class=\"bluefoot-driver bluefoot-advanced-driver bluefoot-entity\">"},{"impact":"moderate","html":"<div id=\"bluefoot-driver-478\" class=\"bluefoot-driver bluefoot-advanced-driver bluefoot-entity\">","target":[".navigation > ul > .nav-1.parent.first > .childmenu.dropdown > .wrapper > .cms-extra-content.normalise-heights-container.level0 > .bluefoot-row.bluefoot-structural > .col-4.col.bluefoot-structural:nth-child(2) > .bluefoot-driver.bluefoot-advanced-driver.bluefoot-entity"],"failureSummary":"Fix any of the following:\n  Document has multiple elements with the same id attribute: bluefoot-driver-478","path":"1,HTML,1,BODY,7,DIV,0,DIV,0,HEADER,0,DIV,0,DIV,2,DIV,0,NAV,0,UL,1,LI,1,DIV,0,DIV,1,DIV,0,DIV,1,DIV,1,DIV","snippet":"<div id=\"bluefoot-driver-478\" class=\"bluefoot-driver bluefoot-advanced-driver bluefoot-entity\">"},{"impact":"moderate","html":"<div id=\"bluefoot-driver-479\" class=\"bluefoot-driver bluefoot-advanced-driver bluefoot-entity\">","target":[".navigation > ul > .nav-1.parent.first > .childmenu.dropdown > .wrapper > .cms-extra-content.normalise-heights-container.level0 > .bluefoot-row.bluefoot-structural > .col-4.col.bluefoot-structural:nth-child(3) > .bluefoot-driver.bluefoot-advanced-driver.bluefoot-entity"],"failureSummary":"Fix any of the following:\n  Document has multiple elements with the same id attribute: bluefoot-driver-479","path":"1,HTML,1,BODY,7,DIV,0,DIV,0,HEADER,0,DIV,0,DIV,2,DIV,0,NAV,0,UL,1,LI,1,DIV,0,DIV,1,DIV,0,DIV,2,DIV,1,DIV","snippet":"<div id=\"bluefoot-driver-479\" class=\"bluefoot-driver bluefoot-advanced-driver bluefoot-entity\">"},{"impact":"moderate","html":"<div id=\"bluefoot-driver-24\" class=\"bluefoot-driver bluefoot-advanced-driver bluefoot-entity\">","target":[".navigation > ul > .nav-2.parent.level-top > .childmenu.dropdown > .wrapper > .cms-extra-content.normalise-heights-container.level0 > .bluefoot-row.bluefoot-structural > .col-4.col.bluefoot-structural:nth-child(1) > .bluefoot-driver.bluefoot-advanced-driver.bluefoot-entity"],"failureSummary":"Fix any of the following:\n  Document has multiple elements with the same id attribute: bluefoot-driver-24","path":"1,HTML,1,BODY,7,DIV,0,DIV,0,HEADER,0,DIV,0,DIV,2,DIV,0,NAV,0,UL,3,LI,1,DIV,0,DIV,1,DIV,0,DIV,0,DIV,1,DIV","snippet":"<div id=\"bluefoot-driver-24\" class=\"bluefoot-driver bluefoot-advanced-driver bluefoot-entity\">"},{"impact":"moderate","html":"<div id=\"bluefoot-driver-26\" class=\"bluefoot-driver bluefoot-advanced-driver bluefoot-entity\">","target":[".navigation > ul > .nav-2.parent.level-top > .childmenu.dropdown > .wrapper > .cms-extra-content.normalise-heights-container.level0 > .bluefoot-row.bluefoot-structural > .col-4.col.bluefoot-structural:nth-child(2) > .bluefoot-driver.bluefoot-advanced-driver.bluefoot-entity"],"failureSummary":"Fix any of the following:\n  Document has multiple elements with the same id attribute: bluefoot-driver-26","path":"1,HTML,1,BODY,7,DIV,0,DIV,0,HEADER,0,DIV,0,DIV,2,DIV,0,NAV,0,UL,3,LI,1,DIV,0,DIV,1,DIV,0,DIV,1,DIV,1,DIV","snippet":"<div id=\"bluefoot-driver-26\" class=\"bluefoot-driver bluefoot-advanced-driver bluefoot-entity\">"},{"impact":"moderate","html":"<div id=\"bluefoot-driver-25\" class=\"bluefoot-driver bluefoot-advanced-driver bluefoot-entity\">","target":[".navigation > ul > .nav-2.parent.level-top > .childmenu.dropdown > .wrapper > .cms-extra-content.normalise-heights-container.level0 > .bluefoot-row.bluefoot-structural > .col-4.col.bluefoot-structural:nth-child(3) > .bluefoot-driver.bluefoot-advanced-driver.bluefoot-entity"],"failureSummary":"Fix any of the following:\n  Document has multiple elements with the same id attribute: bluefoot-driver-25","path":"1,HTML,1,BODY,7,DIV,0,DIV,0,HEADER,0,DIV,0,DIV,2,DIV,0,NAV,0,UL,3,LI,1,DIV,0,DIV,1,DIV,0,DIV,2,DIV,1,DIV","snippet":"<div id=\"bluefoot-driver-25\" class=\"bluefoot-driver bluefoot-advanced-driver bluefoot-entity\">"},{"impact":"moderate","html":"<div id=\"bluefoot-driver-30\" class=\"bluefoot-driver bluefoot-advanced-driver bluefoot-entity\">","target":[".navigation > ul > .nav-3.parent.level-top > .childmenu.dropdown > .wrapper > .cms-extra-content.normalise-heights-container.level0 > .bluefoot-row.bluefoot-structural > .col-4.col.bluefoot-structural:nth-child(1) > .bluefoot-driver.bluefoot-advanced-driver.bluefoot-entity"],"failureSummary":"Fix any of the following:\n  Document has multiple elements with the same id attribute: bluefoot-driver-30","path":"1,HTML,1,BODY,7,DIV,0,DIV,0,HEADER,0,DIV,0,DIV,2,DIV,0,NAV,0,UL,4,LI,1,DIV,0,DIV,1,DIV,0,DIV,0,DIV,1,DIV","snippet":"<div id=\"bluefoot-driver-30\" class=\"bluefoot-driver bluefoot-advanced-driver bluefoot-entity\">"},{"impact":"moderate","html":"<div id=\"bluefoot-driver-31\" class=\"bluefoot-driver bluefoot-advanced-driver bluefoot-entity\">","target":[".navigation > ul > .nav-3.parent.level-top > .childmenu.dropdown > .wrapper > .cms-extra-content.normalise-heights-container.level0 > .bluefoot-row.bluefoot-structural > .col-4.col.bluefoot-structural:nth-child(2) > .bluefoot-driver.bluefoot-advanced-driver.bluefoot-entity"],"failureSummary":"Fix any of the following:\n  Document has multiple elements with the same id attribute: bluefoot-driver-31","path":"1,HTML,1,BODY,7,DIV,0,DIV,0,HEADER,0,DIV,0,DIV,2,DIV,0,NAV,0,UL,4,LI,1,DIV,0,DIV,1,DIV,0,DIV,1,DIV,1,DIV","snippet":"<div id=\"bluefoot-driver-31\" class=\"bluefoot-driver bluefoot-advanced-driver bluefoot-entity\">"},{"impact":"moderate","html":"<div id=\"bluefoot-driver-32\" class=\"bluefoot-driver bluefoot-advanced-driver bluefoot-entity\">","target":[".navigation > ul > .nav-3.parent.level-top > .childmenu.dropdown > .wrapper > .cms-extra-content.normalise-heights-container.level0 > .bluefoot-row.bluefoot-structural > .col-4.col.bluefoot-structural:nth-child(3) > .bluefoot-driver.bluefoot-advanced-driver.bluefoot-entity"],"failureSummary":"Fix any of the following:\n  Document has multiple elements with the same id attribute: bluefoot-driver-32","path":"1,HTML,1,BODY,7,DIV,0,DIV,0,HEADER,0,DIV,0,DIV,2,DIV,0,NAV,0,UL,4,LI,1,DIV,0,DIV,1,DIV,0,DIV,2,DIV,1,DIV","snippet":"<div id=\"bluefoot-driver-32\" class=\"bluefoot-driver bluefoot-advanced-driver bluefoot-entity\">"},{"impact":"moderate","html":"<div id=\"bluefoot-driver-905\" class=\"bluefoot-driver bluefoot-advanced-driver bluefoot-entity\">","target":[".navigation > ul > .nav-4.parent.level-top > .childmenu.dropdown > .wrapper > .cms-extra-content.normalise-heights-container.level0 > .bluefoot-row.bluefoot-structural > .col-4.col.bluefoot-structural:nth-child(1) > .bluefoot-driver.bluefoot-advanced-driver.bluefoot-entity"],"failureSummary":"Fix any of the following:\n  Document has multiple elements with the same id attribute: bluefoot-driver-905","path":"1,HTML,1,BODY,7,DIV,0,DIV,0,HEADER,0,DIV,0,DIV,2,DIV,0,NAV,0,UL,5,LI,1,DIV,0,DIV,1,DIV,0,DIV,0,DIV,1,DIV","snippet":"<div id=\"bluefoot-driver-905\" class=\"bluefoot-driver bluefoot-advanced-driver bluefoot-entity\">"},{"impact":"moderate","html":"<div id=\"bluefoot-driver-906\" class=\"bluefoot-driver bluefoot-advanced-driver bluefoot-entity\">","target":[".navigation > ul > .nav-4.parent.level-top > .childmenu.dropdown > .wrapper > .cms-extra-content.normalise-heights-container.level0 > .bluefoot-row.bluefoot-structural > .col-4.col.bluefoot-structural:nth-child(2) > .bluefoot-driver.bluefoot-advanced-driver.bluefoot-entity"],"failureSummary":"Fix any of the following:\n  Document has multiple elements with the same id attribute: bluefoot-driver-906","path":"1,HTML,1,BODY,7,DIV,0,DIV,0,HEADER,0,DIV,0,DIV,2,DIV,0,NAV,0,UL,5,LI,1,DIV,0,DIV,1,DIV,0,DIV,1,DIV,1,DIV","snippet":"<div id=\"bluefoot-driver-906\" class=\"bluefoot-driver bluefoot-advanced-driver bluefoot-entity\">"},{"impact":"moderate","html":"<div id=\"bluefoot-driver-907\" class=\"bluefoot-driver bluefoot-advanced-driver bluefoot-entity\">","target":[".navigation > ul > .nav-4.parent.level-top > .childmenu.dropdown > .wrapper > .cms-extra-content.normalise-heights-container.level0 > .bluefoot-row.bluefoot-structural > .col-4.col.bluefoot-structural:nth-child(3) > .bluefoot-driver.bluefoot-advanced-driver.bluefoot-entity"],"failureSummary":"Fix any of the following:\n  Document has multiple elements with the same id attribute: bluefoot-driver-907","path":"1,HTML,1,BODY,7,DIV,0,DIV,0,HEADER,0,DIV,0,DIV,2,DIV,0,NAV,0,UL,5,LI,1,DIV,0,DIV,1,DIV,0,DIV,2,DIV,1,DIV","snippet":"<div id=\"bluefoot-driver-907\" class=\"bluefoot-driver bluefoot-advanced-driver bluefoot-entity\">"},{"impact":"moderate","html":"<div id=\"bluefoot-driver-451\" class=\"bluefoot-driver bluefoot-advanced-driver bluefoot-entity\">","target":[".navigation > ul > .nav-5.parent.level-top > .childmenu.dropdown > .wrapper > .cms-extra-content.normalise-heights-container.level0 > .bluefoot-row.bluefoot-structural > .col-4.col.bluefoot-structural:nth-child(1) > .bluefoot-driver.bluefoot-advanced-driver.bluefoot-entity"],"failureSummary":"Fix any of the following:\n  Document has multiple elements with the same id attribute: bluefoot-driver-451","path":"1,HTML,1,BODY,7,DIV,0,DIV,0,HEADER,0,DIV,0,DIV,2,DIV,0,NAV,0,UL,6,LI,1,DIV,0,DIV,1,DIV,0,DIV,0,DIV,1,DIV","snippet":"<div id=\"bluefoot-driver-451\" class=\"bluefoot-driver bluefoot-advanced-driver bluefoot-entity\">"},{"impact":"moderate","html":"<div id=\"bluefoot-driver-452\" class=\"bluefoot-driver bluefoot-advanced-driver bluefoot-entity\">","target":[".navigation > ul > .nav-5.parent.level-top > .childmenu.dropdown > .wrapper > .cms-extra-content.normalise-heights-container.level0 > .bluefoot-row.bluefoot-structural > .col-4.col.bluefoot-structural:nth-child(2) > .bluefoot-driver.bluefoot-advanced-driver.bluefoot-entity"],"failureSummary":"Fix any of the following:\n  Document has multiple elements with the same id attribute: bluefoot-driver-452","path":"1,HTML,1,BODY,7,DIV,0,DIV,0,HEADER,0,DIV,0,DIV,2,DIV,0,NAV,0,UL,6,LI,1,DIV,0,DIV,1,DIV,0,DIV,1,DIV,1,DIV","snippet":"<div id=\"bluefoot-driver-452\" class=\"bluefoot-driver bluefoot-advanced-driver bluefoot-entity\">"},{"impact":"moderate","html":"<div id=\"bluefoot-driver-453\" class=\"bluefoot-driver bluefoot-advanced-driver bluefoot-entity\">","target":[".navigation > ul > .nav-5.parent.level-top > .childmenu.dropdown > .wrapper > .cms-extra-content.normalise-heights-container.level0 > .bluefoot-row.bluefoot-structural > .col-4.col.bluefoot-structural:nth-child(3) > .bluefoot-driver.bluefoot-advanced-driver.bluefoot-entity"],"failureSummary":"Fix any of the following:\n  Document has multiple elements with the same id attribute: bluefoot-driver-453","path":"1,HTML,1,BODY,7,DIV,0,DIV,0,HEADER,0,DIV,0,DIV,2,DIV,0,NAV,0,UL,6,LI,1,DIV,0,DIV,1,DIV,0,DIV,2,DIV,1,DIV","snippet":"<div id=\"bluefoot-driver-453\" class=\"bluefoot-driver bluefoot-advanced-driver bluefoot-entity\">"},{"impact":"moderate","html":"<div id=\"bluefoot-driver-2137\" class=\"bluefoot-driver bluefoot-advanced-driver bluefoot-entity\">","target":[".navigation > ul > .nav-6.parent.last > .childmenu.dropdown > .wrapper > .cms-extra-content.normalise-heights-container.level0 > .bluefoot-row.bluefoot-structural > .bluefoot-wrapper > .col-4.col.bluefoot-structural:nth-child(1) > .bluefoot-driver.bluefoot-advanced-driver.bluefoot-entity"],"failureSummary":"Fix any of the following:\n  Document has multiple elements with the same id attribute: bluefoot-driver-2137","path":"1,HTML,1,BODY,7,DIV,0,DIV,0,HEADER,0,DIV,0,DIV,2,DIV,0,NAV,0,UL,7,LI,1,DIV,0,DIV,1,DIV,0,DIV,0,DIV,0,DIV,1,DIV","snippet":"<div id=\"bluefoot-driver-2137\" class=\"bluefoot-driver bluefoot-advanced-driver bluefoot-entity\">"},{"impact":"moderate","html":"<div id=\"bluefoot-driver-2138\" class=\"bluefoot-driver bluefoot-advanced-driver bluefoot-entity\">","target":[".navigation > ul > .nav-6.parent.last > .childmenu.dropdown > .wrapper > .cms-extra-content.normalise-heights-container.level0 > .bluefoot-row.bluefoot-structural > .bluefoot-wrapper > .col-4.col.bluefoot-structural:nth-child(2) > .bluefoot-driver.bluefoot-advanced-driver.bluefoot-entity"],"failureSummary":"Fix any of the following:\n  Document has multiple elements with the same id attribute: bluefoot-driver-2138","path":"1,HTML,1,BODY,7,DIV,0,DIV,0,HEADER,0,DIV,0,DIV,2,DIV,0,NAV,0,UL,7,LI,1,DIV,0,DIV,1,DIV,0,DIV,0,DIV,1,DIV,1,DIV","snippet":"<div id=\"bluefoot-driver-2138\" class=\"bluefoot-driver bluefoot-advanced-driver bluefoot-entity\">"},{"impact":"moderate","html":"<div id=\"bluefoot-driver-2139\" class=\"bluefoot-driver bluefoot-advanced-driver bluefoot-entity\">","target":[".navigation > ul > .nav-6.parent.last > .childmenu.dropdown > .wrapper > .cms-extra-content.normalise-heights-container.level0 > .bluefoot-row.bluefoot-structural > .bluefoot-wrapper > .col-4.col.bluefoot-structural:nth-child(3) > .bluefoot-driver.bluefoot-advanced-driver.bluefoot-entity"],"failureSummary":"Fix any of the following:\n  Document has multiple elements with the same id attribute: bluefoot-driver-2139","path":"1,HTML,1,BODY,7,DIV,0,DIV,0,HEADER,0,DIV,0,DIV,2,DIV,0,NAV,0,UL,7,LI,1,DIV,0,DIV,1,DIV,0,DIV,0,DIV,2,DIV,1,DIV","snippet":"<div id=\"bluefoot-driver-2139\" class=\"bluefoot-driver bluefoot-advanced-driver bluefoot-entity\">"},{"impact":"moderate","html":"<span id=\"product-price-455\" data-price-amount=\"25.19\" data-price-type=\"finalPrice\" class=\"price-wrapper \" content=\"25.19\">\n        <span class=\"price\">£25.19</span>    </span>","target":[".bluefoot-normalise-heights.product-item-info[data-container=\"product-grid\"] > .details.product-item-details.product > .price-box[data-product-id=\"\\34 55\"][data-role=\"priceBox\"] > .special-price > .price-container.tax.weee > span[data-price-amount=\"\\32 5\\.19\"][content=\"\\32 5\\.19\"][data-price-type=\"finalPrice\"]"],"failureSummary":"Fix any of the following:\n  Document has multiple elements with the same id attribute: product-price-455","path":"1,HTML,1,BODY,7,DIV,0,DIV,1,MAIN,2,DIV,0,DIV,11,DIV,0,DIV,0,DIV,2,DIV,0,DIV,0,DIV,0,DIV,5,DIV,0,DIV,0,DIV,1,DIV,1,DIV,0,SPAN,0,SPAN,1,SPAN","snippet":"<span id=\"product-price-455\" data-price-amount=\"25.19\" data-price-type=\"finalPrice\" class=\"price-wrapper \" content=\"25.19\">"},{"impact":"moderate","html":"<span id=\"old-price-455\" data-price-amount=\"35.99\" data-price-type=\"oldPrice\" class=\"price-wrapper \" content=\"35.99\">\n        <span class=\"price\">£35.99</span>    </span>","target":[".bluefoot-normalise-heights.product-item-info[data-container=\"product-grid\"] > .details.product-item-details.product > .price-box[data-product-id=\"\\34 55\"][data-role=\"priceBox\"] > .sly-old-price.old-price > .price-container.tax.weee > span[data-price-amount=\"\\33 5\\.99\"][content=\"\\33 5\\.99\"][data-price-type=\"oldPrice\"]"],"failureSummary":"Fix any of the following:\n  Document has multiple elements with the same id attribute: old-price-455","path":"1,HTML,1,BODY,7,DIV,0,DIV,1,MAIN,2,DIV,0,DIV,11,DIV,0,DIV,0,DIV,2,DIV,0,DIV,0,DIV,0,DIV,5,DIV,0,DIV,0,DIV,1,DIV,1,DIV,1,SPAN,0,SPAN,1,SPAN","snippet":"<span id=\"old-price-455\" data-price-amount=\"35.99\" data-price-type=\"oldPrice\" class=\"price-wrapper \" content=\"35.99\">"}]}},"scoringMode":"binary","name":"duplicate-id","description":"`[id]` attributes on the page are not unique","helpText":"The value of an id attribute must be unique to prevent other instances from being overlooked by assistive technologies. [Learn more](https://dequeuniversity.com/rules/axe/2.2/duplicate-id?application=lighthouse).","details":{"type":"list","header":{"type":"text","text":"View failing elements"},"items":[{"type":"node","selector":".navigation > ul > .nav-1.parent.first > .childmenu.dropdown > .wrapper > .cms-extra-content.normalise-heights-container.level0 > .bluefoot-row.bluefoot-structural > .col-4.col.bluefoot-structural:nth-child(1) > .bluefoot-driver.bluefoot-advanced-driver.bluefoot-entity","path":"1,HTML,1,BODY,7,DIV,0,DIV,0,HEADER,0,DIV,0,DIV,2,DIV,0,NAV,0,UL,1,LI,1,DIV,0,DIV,1,DIV,0,DIV,0,DIV,1,DIV","snippet":"<div id=\"bluefoot-driver-477\" class=\"bluefoot-driver bluefoot-advanced-driver bluefoot-entity\">"},{"type":"node","selector":".navigation > ul > .nav-1.parent.first > .childmenu.dropdown > .wrapper > .cms-extra-content.normalise-heights-container.level0 > .bluefoot-row.bluefoot-structural > .col-4.col.bluefoot-structural:nth-child(2) > .bluefoot-driver.bluefoot-advanced-driver.bluefoot-entity","path":"1,HTML,1,BODY,7,DIV,0,DIV,0,HEADER,0,DIV,0,DIV,2,DIV,0,NAV,0,UL,1,LI,1,DIV,0,DIV,1,DIV,0,DIV,1,DIV,1,DIV","snippet":"<div id=\"bluefoot-driver-478\" class=\"bluefoot-driver bluefoot-advanced-driver bluefoot-entity\">"},{"type":"node","selector":".navigation > ul > .nav-1.parent.first > .childmenu.dropdown > .wrapper > .cms-extra-content.normalise-heights-container.level0 > .bluefoot-row.bluefoot-structural > .col-4.col.bluefoot-structural:nth-child(3) > .bluefoot-driver.bluefoot-advanced-driver.bluefoot-entity","path":"1,HTML,1,BODY,7,DIV,0,DIV,0,HEADER,0,DIV,0,DIV,2,DIV,0,NAV,0,UL,1,LI,1,DIV,0,DIV,1,DIV,0,DIV,2,DIV,1,DIV","snippet":"<div id=\"bluefoot-driver-479\" class=\"bluefoot-driver bluefoot-advanced-driver bluefoot-entity\">"},{"type":"node","selector":".navigation > ul > .nav-2.parent.level-top > .childmenu.dropdown > .wrapper > .cms-extra-content.normalise-heights-container.level0 > .bluefoot-row.bluefoot-structural > .col-4.col.bluefoot-structural:nth-child(1) > .bluefoot-driver.bluefoot-advanced-driver.bluefoot-entity","path":"1,HTML,1,BODY,7,DIV,0,DIV,0,HEADER,0,DIV,0,DIV,2,DIV,0,NAV,0,UL,3,LI,1,DIV,0,DIV,1,DIV,0,DIV,0,DIV,1,DIV","snippet":"<div id=\"bluefoot-driver-24\" class=\"bluefoot-driver bluefoot-advanced-driver bluefoot-entity\">"},{"type":"node","selector":".navigation > ul > .nav-2.parent.level-top > .childmenu.dropdown > .wrapper > .cms-extra-content.normalise-heights-container.level0 > .bluefoot-row.bluefoot-structural > .col-4.col.bluefoot-structural:nth-child(2) > .bluefoot-driver.bluefoot-advanced-driver.bluefoot-entity","path":"1,HTML,1,BODY,7,DIV,0,DIV,0,HEADER,0,DIV,0,DIV,2,DIV,0,NAV,0,UL,3,LI,1,DIV,0,DIV,1,DIV,0,DIV,1,DIV,1,DIV","snippet":"<div id=\"bluefoot-driver-26\" class=\"bluefoot-driver bluefoot-advanced-driver bluefoot-entity\">"},{"type":"node","selector":".navigation > ul > .nav-2.parent.level-top > .childmenu.dropdown > .wrapper > .cms-extra-content.normalise-heights-container.level0 > .bluefoot-row.bluefoot-structural > .col-4.col.bluefoot-structural:nth-child(3) > .bluefoot-driver.bluefoot-advanced-driver.bluefoot-entity","path":"1,HTML,1,BODY,7,DIV,0,DIV,0,HEADER,0,DIV,0,DIV,2,DIV,0,NAV,0,UL,3,LI,1,DIV,0,DIV,1,DIV,0,DIV,2,DIV,1,DIV","snippet":"<div id=\"bluefoot-driver-25\" class=\"bluefoot-driver bluefoot-advanced-driver bluefoot-entity\">"},{"type":"node","selector":".navigation > ul > .nav-3.parent.level-top > .childmenu.dropdown > .wrapper > .cms-extra-content.normalise-heights-container.level0 > .bluefoot-row.bluefoot-structural > .col-4.col.bluefoot-structural:nth-child(1) > .bluefoot-driver.bluefoot-advanced-driver.bluefoot-entity","path":"1,HTML,1,BODY,7,DIV,0,DIV,0,HEADER,0,DIV,0,DIV,2,DIV,0,NAV,0,UL,4,LI,1,DIV,0,DIV,1,DIV,0,DIV,0,DIV,1,DIV","snippet":"<div id=\"bluefoot-driver-30\" class=\"bluefoot-driver bluefoot-advanced-driver bluefoot-entity\">"},{"type":"node","selector":".navigation > ul > .nav-3.parent.level-top > .childmenu.dropdown > .wrapper > .cms-extra-content.normalise-heights-container.level0 > .bluefoot-row.bluefoot-structural > .col-4.col.bluefoot-structural:nth-child(2) > .bluefoot-driver.bluefoot-advanced-driver.bluefoot-entity","path":"1,HTML,1,BODY,7,DIV,0,DIV,0,HEADER,0,DIV,0,DIV,2,DIV,0,NAV,0,UL,4,LI,1,DIV,0,DIV,1,DIV,0,DIV,1,DIV,1,DIV","snippet":"<div id=\"bluefoot-driver-31\" class=\"bluefoot-driver bluefoot-advanced-driver bluefoot-entity\">"},{"type":"node","selector":".navigation > ul > .nav-3.parent.level-top > .childmenu.dropdown > .wrapper > .cms-extra-content.normalise-heights-container.level0 > .bluefoot-row.bluefoot-structural > .col-4.col.bluefoot-structural:nth-child(3) > .bluefoot-driver.bluefoot-advanced-driver.bluefoot-entity","path":"1,HTML,1,BODY,7,DIV,0,DIV,0,HEADER,0,DIV,0,DIV,2,DIV,0,NAV,0,UL,4,LI,1,DIV,0,DIV,1,DIV,0,DIV,2,DIV,1,DIV","snippet":"<div id=\"bluefoot-driver-32\" class=\"bluefoot-driver bluefoot-advanced-driver bluefoot-entity\">"},{"type":"node","selector":".navigation > ul > .nav-4.parent.level-top > .childmenu.dropdown > .wrapper > .cms-extra-content.normalise-heights-container.level0 > .bluefoot-row.bluefoot-structural > .col-4.col.bluefoot-structural:nth-child(1) > .bluefoot-driver.bluefoot-advanced-driver.bluefoot-entity","path":"1,HTML,1,BODY,7,DIV,0,DIV,0,HEADER,0,DIV,0,DIV,2,DIV,0,NAV,0,UL,5,LI,1,DIV,0,DIV,1,DIV,0,DIV,0,DIV,1,DIV","snippet":"<div id=\"bluefoot-driver-905\" class=\"bluefoot-driver bluefoot-advanced-driver bluefoot-entity\">"},{"type":"node","selector":".navigation > ul > .nav-4.parent.level-top > .childmenu.dropdown > .wrapper > .cms-extra-content.normalise-heights-container.level0 > .bluefoot-row.bluefoot-structural > .col-4.col.bluefoot-structural:nth-child(2) > .bluefoot-driver.bluefoot-advanced-driver.bluefoot-entity","path":"1,HTML,1,BODY,7,DIV,0,DIV,0,HEADER,0,DIV,0,DIV,2,DIV,0,NAV,0,UL,5,LI,1,DIV,0,DIV,1,DIV,0,DIV,1,DIV,1,DIV","snippet":"<div id=\"bluefoot-driver-906\" class=\"bluefoot-driver bluefoot-advanced-driver bluefoot-entity\">"},{"type":"node","selector":".navigation > ul > .nav-4.parent.level-top > .childmenu.dropdown > .wrapper > .cms-extra-content.normalise-heights-container.level0 > .bluefoot-row.bluefoot-structural > .col-4.col.bluefoot-structural:nth-child(3) > .bluefoot-driver.bluefoot-advanced-driver.bluefoot-entity","path":"1,HTML,1,BODY,7,DIV,0,DIV,0,HEADER,0,DIV,0,DIV,2,DIV,0,NAV,0,UL,5,LI,1,DIV,0,DIV,1,DIV,0,DIV,2,DIV,1,DIV","snippet":"<div id=\"bluefoot-driver-907\" class=\"bluefoot-driver bluefoot-advanced-driver bluefoot-entity\">"},{"type":"node","selector":".navigation > ul > .nav-5.parent.level-top > .childmenu.dropdown > .wrapper > .cms-extra-content.normalise-heights-container.level0 > .bluefoot-row.bluefoot-structural > .col-4.col.bluefoot-structural:nth-child(1) > .bluefoot-driver.bluefoot-advanced-driver.bluefoot-entity","path":"1,HTML,1,BODY,7,DIV,0,DIV,0,HEADER,0,DIV,0,DIV,2,DIV,0,NAV,0,UL,6,LI,1,DIV,0,DIV,1,DIV,0,DIV,0,DIV,1,DIV","snippet":"<div id=\"bluefoot-driver-451\" class=\"bluefoot-driver bluefoot-advanced-driver bluefoot-entity\">"},{"type":"node","selector":".navigation > ul > .nav-5.parent.level-top > .childmenu.dropdown > .wrapper > .cms-extra-content.normalise-heights-container.level0 > .bluefoot-row.bluefoot-structural > .col-4.col.bluefoot-structural:nth-child(2) > .bluefoot-driver.bluefoot-advanced-driver.bluefoot-entity","path":"1,HTML,1,BODY,7,DIV,0,DIV,0,HEADER,0,DIV,0,DIV,2,DIV,0,NAV,0,UL,6,LI,1,DIV,0,DIV,1,DIV,0,DIV,1,DIV,1,DIV","snippet":"<div id=\"bluefoot-driver-452\" class=\"bluefoot-driver bluefoot-advanced-driver bluefoot-entity\">"},{"type":"node","selector":".navigation > ul > .nav-5.parent.level-top > .childmenu.dropdown > .wrapper > .cms-extra-content.normalise-heights-container.level0 > .bluefoot-row.bluefoot-structural > .col-4.col.bluefoot-structural:nth-child(3) > .bluefoot-driver.bluefoot-advanced-driver.bluefoot-entity","path":"1,HTML,1,BODY,7,DIV,0,DIV,0,HEADER,0,DIV,0,DIV,2,DIV,0,NAV,0,UL,6,LI,1,DIV,0,DIV,1,DIV,0,DIV,2,DIV,1,DIV","snippet":"<div id=\"bluefoot-driver-453\" class=\"bluefoot-driver bluefoot-advanced-driver bluefoot-entity\">"},{"type":"node","selector":".navigation > ul > .nav-6.parent.last > .childmenu.dropdown > .wrapper > .cms-extra-content.normalise-heights-container.level0 > .bluefoot-row.bluefoot-structural > .bluefoot-wrapper > .col-4.col.bluefoot-structural:nth-child(1) > .bluefoot-driver.bluefoot-advanced-driver.bluefoot-entity","path":"1,HTML,1,BODY,7,DIV,0,DIV,0,HEADER,0,DIV,0,DIV,2,DIV,0,NAV,0,UL,7,LI,1,DIV,0,DIV,1,DIV,0,DIV,0,DIV,0,DIV,1,DIV","snippet":"<div id=\"bluefoot-driver-2137\" class=\"bluefoot-driver bluefoot-advanced-driver bluefoot-entity\">"},{"type":"node","selector":".navigation > ul > .nav-6.parent.last > .childmenu.dropdown > .wrapper > .cms-extra-content.normalise-heights-container.level0 > .bluefoot-row.bluefoot-structural > .bluefoot-wrapper > .col-4.col.bluefoot-structural:nth-child(2) > .bluefoot-driver.bluefoot-advanced-driver.bluefoot-entity","path":"1,HTML,1,BODY,7,DIV,0,DIV,0,HEADER,0,DIV,0,DIV,2,DIV,0,NAV,0,UL,7,LI,1,DIV,0,DIV,1,DIV,0,DIV,0,DIV,1,DIV,1,DIV","snippet":"<div id=\"bluefoot-driver-2138\" class=\"bluefoot-driver bluefoot-advanced-driver bluefoot-entity\">"},{"type":"node","selector":".navigation > ul > .nav-6.parent.last > .childmenu.dropdown > .wrapper > .cms-extra-content.normalise-heights-container.level0 > .bluefoot-row.bluefoot-structural > .bluefoot-wrapper > .col-4.col.bluefoot-structural:nth-child(3) > .bluefoot-driver.bluefoot-advanced-driver.bluefoot-entity","path":"1,HTML,1,BODY,7,DIV,0,DIV,0,HEADER,0,DIV,0,DIV,2,DIV,0,NAV,0,UL,7,LI,1,DIV,0,DIV,1,DIV,0,DIV,0,DIV,2,DIV,1,DIV","snippet":"<div id=\"bluefoot-driver-2139\" class=\"bluefoot-driver bluefoot-advanced-driver bluefoot-entity\">"},{"type":"node","selector":".bluefoot-normalise-heights.product-item-info[data-container=\"product-grid\"] > .details.product-item-details.product > .price-box[data-product-id=\"\\34 55\"][data-role=\"priceBox\"] > .special-price > .price-container.tax.weee > span[data-price-amount=\"\\32 5\\.19\"][content=\"\\32 5\\.19\"][data-price-type=\"finalPrice\"]","path":"1,HTML,1,BODY,7,DIV,0,DIV,1,MAIN,2,DIV,0,DIV,11,DIV,0,DIV,0,DIV,2,DIV,0,DIV,0,DIV,0,DIV,5,DIV,0,DIV,0,DIV,1,DIV,1,DIV,0,SPAN,0,SPAN,1,SPAN","snippet":"<span id=\"product-price-455\" data-price-amount=\"25.19\" data-price-type=\"finalPrice\" class=\"price-wrapper \" content=\"25.19\">"},{"type":"node","selector":".bluefoot-normalise-heights.product-item-info[data-container=\"product-grid\"] > .details.product-item-details.product > .price-box[data-product-id=\"\\34 55\"][data-role=\"priceBox\"] > .sly-old-price.old-price > .price-container.tax.weee > span[data-price-amount=\"\\33 5\\.99\"][content=\"\\33 5\\.99\"][data-price-type=\"oldPrice\"]","path":"1,HTML,1,BODY,7,DIV,0,DIV,1,MAIN,2,DIV,0,DIV,11,DIV,0,DIV,0,DIV,2,DIV,0,DIV,0,DIV,0,DIV,5,DIV,0,DIV,0,DIV,1,DIV,1,DIV,1,SPAN,0,SPAN,1,SPAN","snippet":"<span id=\"old-price-455\" data-price-amount=\"35.99\" data-price-type=\"oldPrice\" class=\"price-wrapper \" content=\"35.99\">"}]}},"frame-title":{"score":false,"displayValue":"","rawValue":false,"scoringMode":"binary","informative":true,"notApplicable":true,"name":"frame-title","description":"`<frame>` or `<iframe>` elements do not have a title","helpText":"Screen reader users rely on frame titles to describe the contents of frames. [Learn more](https://dequeuniversity.com/rules/axe/2.2/frame-title?application=lighthouse)."},"html-has-lang":{"score":true,"displayValue":"","rawValue":true,"extendedInfo":{},"scoringMode":"binary","name":"html-has-lang","description":"`<html>` element has a `[lang]` attribute","helpText":"If a page doesn't specify a lang attribute, a screen reader assumes that the page is in the default language that the user chose when setting up the screen reader. If the page isn't actually in the default language, then the screen reader might not announce the page's text correctly. [Learn more](https://dequeuniversity.com/rules/axe/2.2/html-lang?application=lighthouse).","details":{"type":"list","header":{"type":"text","text":"View failing elements"},"items":[]}},"html-lang-valid":{"score":true,"displayValue":"","rawValue":true,"extendedInfo":{},"scoringMode":"binary","name":"html-lang-valid","description":"`<html>` element has a valid value for its `[lang]` attribute","helpText":"Specifying a valid [BCP 47 language](https://www.w3.org/International/questions/qa-choosing-language-tags#question) helps screen readers announce text properly. [Learn more](https://dequeuniversity.com/rules/axe/2.2/valid-lang?application=lighthouse).","details":{"type":"list","header":{"type":"text","text":"View failing elements"},"items":[]}},"image-alt":{"score":true,"displayValue":"","rawValue":true,"extendedInfo":{},"scoringMode":"binary","name":"image-alt","description":"Image elements have `[alt]` attributes","helpText":"Informative elements should aim for short, descriptive alternate text. Decorative elements can be ignored with an empty alt attribute.[Learn more](https://dequeuniversity.com/rules/axe/2.2/image-alt?application=lighthouse).","details":{"type":"list","header":{"type":"text","text":"View failing elements"},"items":[]}},"input-image-alt":{"score":false,"displayValue":"","rawValue":false,"scoringMode":"binary","informative":true,"notApplicable":true,"name":"input-image-alt","description":"`<input type=\"image\">` elements do not have `[alt]` text","helpText":"When an image is being used as an `<input>` button, providing alternative text can help screen reader users understand the purpose of the button. [Learn more](https://dequeuniversity.com/rules/axe/2.2/input-image-alt?application=lighthouse)."},"label":{"score":true,"displayValue":"","rawValue":true,"extendedInfo":{},"scoringMode":"binary","name":"label","description":"Form elements have associated labels","helpText":"Labels ensure that form controls are announced properly by assistive technologies, like screen readers. [Learn more](https://dequeuniversity.com/rules/axe/2.2/label?application=lighthouse).","details":{"type":"list","header":{"type":"text","text":"View failing elements"},"items":[]}},"layout-table":{"score":false,"displayValue":"","rawValue":false,"scoringMode":"binary","informative":true,"notApplicable":true,"name":"layout-table","description":"Presentational `<table>` elements do not avoid using `<th>`, `<caption>` or the `[summary]` attribute.","helpText":"A table being used for layout purposes should not include data elements, such as the th or caption elements or the summary attribute, because this can create a confusing experience for screen reader users. [Learn more](https://dequeuniversity.com/rules/axe/2.2/layout-table?application=lighthouse)."},"link-name":{"score":true,"displayValue":"","rawValue":true,"extendedInfo":{},"scoringMode":"binary","name":"link-name","description":"Links have a discernible name","helpText":"Link text (and alternate text for images, when used as links) that is discernible, unique, and focusable improves the navigation experience for screen reader users. [Learn more](https://dequeuniversity.com/rules/axe/2.2/link-name?application=lighthouse).","details":{"type":"list","header":{"type":"text","text":"View failing elements"},"items":[]}},"list":{"score":true,"displayValue":"","rawValue":true,"extendedInfo":{},"scoringMode":"binary","name":"list","description":"Lists contain only `<li>` elements and script supporting elements (`<script>` and `<template>`).","helpText":"Screen readers have a specific way of announcing lists. Ensuring proper list structure aids screen reader output. [Learn more](https://dequeuniversity.com/rules/axe/2.2/list?application=lighthouse).","details":{"type":"list","header":{"type":"text","text":"View failing elements"},"items":[]}},"listitem":{"score":true,"displayValue":"","rawValue":true,"extendedInfo":{},"scoringMode":"binary","name":"listitem","description":"List items (`<li>`) are contained within `<ul>` or `<ol>` parent elements","helpText":"Screen readers require list items (`<li>`) to be contained within a parent `<ul>` or `<ol>` to be announced properly. [Learn more](https://dequeuniversity.com/rules/axe/2.2/listitem?application=lighthouse).","details":{"type":"list","header":{"type":"text","text":"View failing elements"},"items":[]}},"meta-refresh":{"score":false,"displayValue":"","rawValue":false,"scoringMode":"binary","informative":true,"notApplicable":true,"name":"meta-refresh","description":"The document uses `<meta http-equiv=\"refresh\">`","helpText":"Users do not expect a page to refresh automatically, and doing so will move focus back to the top of the page. This may create a frustrating or confusing experience. [Learn more](https://dequeuniversity.com/rules/axe/2.2/meta-refresh?application=lighthouse)."},"meta-viewport":{"score":true,"displayValue":"","rawValue":true,"extendedInfo":{},"scoringMode":"binary","name":"meta-viewport","description":"`[user-scalable=\"no\"]` is not used in the `<meta name=\"viewport\">` element and the `[maximum-scale]` attribute is not less than 5.","helpText":"Disabling zooming is problematic for users with low vision who rely on screen magnification to properly see the contents of a web page. [Learn more](https://dequeuniversity.com/rules/axe/2.2/meta-viewport?application=lighthouse).","details":{"type":"list","header":{"type":"text","text":"View failing elements"},"items":[]}},"object-alt":{"score":false,"displayValue":"","rawValue":false,"scoringMode":"binary","informative":true,"notApplicable":true,"name":"object-alt","description":"`<object>` elements do not have `[alt]` text","helpText":"Screen readers cannot translate non-text content. Adding alt text to `<object>` elements helps screen readers convey meaning to users. [Learn more](https://dequeuniversity.com/rules/axe/2.2/object-alt?application=lighthouse)."},"tabindex":{"score":true,"displayValue":"","rawValue":true,"extendedInfo":{},"scoringMode":"binary","name":"tabindex","description":"No element has a `[tabindex]` value greater than 0","helpText":"A value greater than 0 implies an explicit navigation ordering. Although technically valid, this often creates frustrating experiences for users who rely on assistive technologies. [Learn more](https://dequeuniversity.com/rules/axe/2.2/tabindex?application=lighthouse).","details":{"type":"list","header":{"type":"text","text":"View failing elements"},"items":[]}},"td-headers-attr":{"score":false,"displayValue":"","rawValue":false,"scoringMode":"binary","informative":true,"notApplicable":true,"name":"td-headers-attr","description":"Cells in a `<table>` element that use the `[headers]` attribute refers to other cells of that same table.","helpText":"Screen readers have features to make navigating tables easier. Ensuring `<td>` cells using the `[headers]` attribute only refer to other cells in the same table may improve the experience for screen reader users. [Learn more](https://dequeuniversity.com/rules/axe/2.2/td-headers-attr?application=lighthouse)."},"th-has-data-cells":{"score":false,"displayValue":"","rawValue":false,"scoringMode":"binary","informative":true,"notApplicable":true,"name":"th-has-data-cells","description":"`<th>` elements and elements with `[role=\"columnheader\"/\"rowheader\"]` do not have data cells they describe.","helpText":"Screen readers have features to make navigating tables easier. Ensuring table headers always refer to some set of cells may improve the experience for screen reader users. [Learn more](https://dequeuniversity.com/rules/axe/2.2/th-has-data-cells?application=lighthouse)."},"valid-lang":{"score":false,"displayValue":"","rawValue":false,"scoringMode":"binary","informative":true,"notApplicable":true,"name":"valid-lang","description":"`[lang]` attributes do not have a valid value","helpText":"Specifying a valid [BCP 47 language](https://www.w3.org/International/questions/qa-choosing-language-tags#question) on elements helps ensure that text is pronounced correctly by a screen reader. [Learn more](https://dequeuniversity.com/rules/axe/2.2/valid-lang?application=lighthouse)."},"video-caption":{"score":false,"displayValue":"","rawValue":false,"scoringMode":"binary","informative":true,"notApplicable":true,"name":"video-caption","description":"`<video>` elements do not contain a `<track>` element with `[kind=\"captions\"]`.","helpText":"When a video provides a caption it is easier for deaf and hearing impaired users to access its information. [Learn more](https://dequeuniversity.com/rules/axe/2.2/video-caption?application=lighthouse)."},"video-description":{"score":false,"displayValue":"","rawValue":false,"scoringMode":"binary","informative":true,"notApplicable":true,"name":"video-description","description":"`<video>` elements do not contain a `<track>` element with `[kind=\"description\"]`.","helpText":"Audio descriptions provide relevant information for videos that dialogue cannot, such as facial expressions and scenes. [Learn more](https://dequeuniversity.com/rules/axe/2.2/video-description?application=lighthouse)."},"custom-controls-labels":{"score":false,"displayValue":"","rawValue":false,"scoringMode":"binary","informative":true,"manual":true,"name":"custom-controls-labels","description":"Custom controls have associated labels","helpText":"Custom interactive controls have associated labels, provided by aria-label or aria-labelledby. [Learn more](https://developers.google.com/web/fundamentals/accessibility/how-to-review#try_it_with_a_screen_reader)."},"custom-controls-roles":{"score":false,"displayValue":"","rawValue":false,"scoringMode":"binary","informative":true,"manual":true,"name":"custom-controls-roles","description":"Custom controls have ARIA roles","helpText":"Custom interactive controls have appropriate ARIA roles. [Learn more](https://developers.google.com/web/fundamentals/accessibility/how-to-review#try_it_with_a_screen_reader)."},"focus-traps":{"score":false,"displayValue":"","rawValue":false,"scoringMode":"binary","informative":true,"manual":true,"name":"focus-traps","description":"User focus is not accidentally trapped in a region","helpText":"A user can tab into and out of any control or region without accidentally trapping their focus. [Learn more](https://developers.google.com/web/fundamentals/accessibility/how-to-review#start_with_the_keyboard)."},"focusable-controls":{"score":false,"displayValue":"","rawValue":false,"scoringMode":"binary","informative":true,"manual":true,"name":"focusable-controls","description":"Interactive controls are keyboard focusable","helpText":"Custom interactive controls are keyboard focusable and display a focus indicator. [Learn more](https://developers.google.com/web/fundamentals/accessibility/how-to-review#start_with_the_keyboard)."},"heading-levels":{"score":false,"displayValue":"","rawValue":false,"scoringMode":"binary","informative":true,"manual":true,"name":"heading-levels","description":"Headings don't skip levels","helpText":"Headings are used to create an outline for the page and heading levels are not skipped. [Learn more](https://developers.google.com/web/fundamentals/accessibility/how-to-review#take_advantage_of_headings_and_landmarks)."},"logical-tab-order":{"score":false,"displayValue":"","rawValue":false,"scoringMode":"binary","informative":true,"manual":true,"name":"logical-tab-order","description":"The page has a logical tab order","helpText":"Tabbing through the page follows the visual layout. Users cannot focus elements that are offscreen. [Learn more](https://developers.google.com/web/fundamentals/accessibility/how-to-review#start_with_the_keyboard)."},"managed-focus":{"score":false,"displayValue":"","rawValue":false,"scoringMode":"binary","informative":true,"manual":true,"name":"managed-focus","description":"The user's focus is directed to new content added to the page","helpText":"If new content, such as a dialog, is added to the page, the user's focus is directed to it. [Learn more](https://developers.google.com/web/fundamentals/accessibility/how-to-review#start_with_the_keyboard)."},"offscreen-content-hidden":{"score":false,"displayValue":"","rawValue":false,"scoringMode":"binary","informative":true,"manual":true,"name":"offscreen-content-hidden","description":"Offscreen content is hidden from assistive technology","helpText":"Offscreen content is hidden with display: none or aria-hidden=true. [Learn more](https://developers.google.com/web/fundamentals/accessibility/how-to-review#try_it_with_a_screen_reader)."},"use-landmarks":{"score":false,"displayValue":"","rawValue":false,"scoringMode":"binary","informative":true,"manual":true,"name":"use-landmarks","description":"HTML5 landmark elements are used to improve navigation","helpText":"Landmark elements (<main>, <nav>, etc.) are used to improve the keyboard navigation of the page for assistive technology. [Learn more](https://developers.google.com/web/fundamentals/accessibility/how-to-review#take_advantage_of_headings_and_landmarks)."},"visual-order-follows-dom":{"score":false,"displayValue":"","rawValue":false,"scoringMode":"binary","informative":true,"manual":true,"name":"visual-order-follows-dom","description":"Visual order on the page follows DOM order","helpText":"DOM order matches the visual order, improving navigation for assistive technology. [Learn more](https://developers.google.com/web/fundamentals/accessibility/how-to-review#try_it_with_a_screen_reader)."},"uses-long-cache-ttl":{"score":89,"displayValue":"18 assets found","rawValue":126483.63777777777,"extendedInfo":{"value":{"results":[{"url":"https://cdn.bronto.com/popup/delivery.js","cacheControl":null,"cacheLifetimeInSeconds":0,"cacheLifetimeDisplay":"None","cacheHitProbability":0,"totalKb":"4 KB","totalBytes":4554,"wastedBytes":4554},{"url":"https://p.bm23.com/bta.js","cacheControl":null,"cacheLifetimeInSeconds":0,"cacheLifetimeDisplay":"None","cacheHitProbability":0,"totalKb":"1 KB","totalBytes":1394,"wastedBytes":1394},{"url":"https://p.yotpo.com/i?e=pv&page=Gro%20Store%20%7CGro%20baby%20clothes%20%26%20toys%20%7C%20Gro%20bags%2C%20Gro%20clocks%2C%20Gro%20eggs%2C%20Baby%20Bedding%20and%20Swaddles&se_va=INNN2oWNqTDW3UgadN2pKPYnIMdqgHgCGdRgUe1e&dtm=1524587388879&tid=855414&vp=412x732&ds=412x11707&vid=1&duid=d6b439d3a6689028&p=web&tv=js-0.13.2&fp=2162865479&aid=onsite_v2&lang=en-US&cs=UTF-8&tz=Etc%2FUTC&res=412x732&cd=24&cookie=1&url=https%3A%2F%2Fwww.gro-store.com%2F","cacheControl":null,"cacheLifetimeInSeconds":0,"cacheLifetimeDisplay":"None","cacheHitProbability":0,"totalKb":"0 KB","totalBytes":0,"wastedBytes":0},{"url":"https://nosto-merchant-assets.s3.amazonaws.com/gro-eur-magento2/5a55fe4a60b2c62ce44a09e1/1515593773588","cacheControl":null,"cacheLifetimeInSeconds":0,"cacheLifetimeDisplay":"None","cacheHitProbability":0,"totalKb":"0 KB","totalBytes":0,"wastedBytes":0},{"url":"https://cdn.bronto.com/popup/polyfills.js","cacheControl":null,"cacheLifetimeInSeconds":0,"cacheLifetimeDisplay":"None","cacheHitProbability":0,"totalKb":"0 KB","totalBytes":0,"wastedBytes":0},{"url":"https://connect.nosto.com/include/gro-uk-magento2","cacheControl":{"max-age":600,"public":true},"cacheLifetimeInSeconds":600,"cacheLifetimeDisplay":"10 m","cacheHitProbability":0.08333333333333333,"totalKb":"24 KB","totalBytes":24411,"wastedBytes":22376.75},{"url":"https://staticw2.yotpo.com/INNN2oWNqTDW3UgadN2pKPYnIMdqgHgCGdRgUe1e/widget.js","cacheControl":{"public":true,"max-age":2944},"cacheLifetimeInSeconds":2944,"cacheLifetimeDisplay":"49 m 4 s","cacheHitProbability":0.17722222222222223,"totalKb":"81 KB","totalBytes":83278,"wastedBytes":68519.28777777778},{"url":"https://staticw2.yotpo.com/INNN2oWNqTDW3UgadN2pKPYnIMdqgHgCGdRgUe1e/widget.css?widget_version=2018-04-23_10-18-12","cacheControl":{"public":true,"max-age":2992},"cacheLifetimeInSeconds":2992,"cacheLifetimeDisplay":"49 m 52 s","cacheHitProbability":0.1788888888888889,"totalKb":"0 KB","totalBytes":0,"wastedBytes":0},{"url":"https://connect.nosto.com/public/javascripts/jquery-1.7.1.min.js","cacheControl":{"max-age":3600},"cacheLifetimeInSeconds":3600,"cacheLifetimeDisplay":"1 h","cacheHitProbability":0.2,"totalKb":"33 KB","totalBytes":33588,"wastedBytes":26870.4},{"url":"https://connect.nosto.com/public/javascripts/behav-popup.min.js","cacheControl":{"max-age":3600},"cacheLifetimeInSeconds":3600,"cacheLifetimeDisplay":"1 h","cacheHitProbability":0.2,"totalKb":"3 KB","totalBytes":2973,"wastedBytes":2378.4},{"url":"https://connect.nosto.com/overlay/discount-modal/increaseStat?account=gro-uk-magento2&s=triggered&campaignId=10%25%20Off%202%20Items&rand=05208","cacheControl":{"max-age":3600},"cacheLifetimeInSeconds":3600,"cacheLifetimeDisplay":"1 h","cacheHitProbability":0.2,"totalKb":"0 KB","totalBytes":0,"wastedBytes":0},{"url":"https://connect.nosto.com/public/javascripts/clipboard.min.js","cacheControl":{"max-age":3600},"cacheLifetimeInSeconds":3600,"cacheLifetimeDisplay":"1 h","cacheHitProbability":0.2,"totalKb":"0 KB","totalBytes":0,"wastedBytes":0},{"url":"https://www.google-analytics.com/plugins/ua/ec.js","cacheControl":{"public":true,"max-age":3600},"cacheLifetimeInSeconds":3600,"cacheLifetimeDisplay":"1 h","cacheHitProbability":0.2,"totalKb":"0 KB","totalBytes":0,"wastedBytes":0},{"url":"https://connect.nosto.com/overlay/discount-modal/increaseStat?account=gro-uk-magento2&s=shown&campaignId=10%25%20Off%202%20Items&rand=98975","cacheControl":{"max-age":3600},"cacheLifetimeInSeconds":3600,"cacheLifetimeDisplay":"1 h","cacheHitProbability":0.2,"totalKb":"0 KB","totalBytes":0,"wastedBytes":0},{"url":"https://connect.nosto.com/overlay/discount-modal/increaseStat?account=gro-uk-magento2&s=triggered&campaignId=Welcome%20New%20Customers%20New&rand=42892","cacheControl":{"max-age":3600},"cacheLifetimeInSeconds":3600,"cacheLifetimeDisplay":"1 h","cacheHitProbability":0.2,"totalKb":"0 KB","totalBytes":0,"wastedBytes":0},{"url":"https://www.google-analytics.com/analytics.js","cacheControl":{"public":true,"max-age":7200},"cacheLifetimeInSeconds":7200,"cacheLifetimeDisplay":"2 h","cacheHitProbability":0.25,"totalKb":"0 KB","totalBytes":0,"wastedBytes":0},{"url":"https://fonts.googleapis.com/css?family=Muli:300,300i,400,400i","cacheControl":{"private":true,"max-age":86400,"stale-while-revalidate":"604800"},"cacheLifetimeInSeconds":86400,"cacheLifetimeDisplay":"1 d","cacheHitProbability":0.6,"totalKb":"1 KB","totalBytes":977,"wastedBytes":390.8},{"url":"https://fonts.googleapis.com/css?family=Open+Sans","cacheControl":{"private":true,"max-age":86400},"cacheLifetimeInSeconds":86400,"cacheLifetimeDisplay":"1 d","cacheHitProbability":0.6,"totalKb":"0 KB","totalBytes":0,"wastedBytes":0}],"queryStringCount":7}},"scoringMode":"numeric","name":"uses-long-cache-ttl","description":"Uses inefficient cache policy on static assets","helpText":"A long cache lifetime can speed up repeat visits to your page. [Learn more](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/http-caching#cache-control).","details":{"type":"table","header":"View Details","itemHeaders":[{"type":"text","itemType":"url","text":"URL"},{"type":"text","itemType":"text","text":"Cache TTL"},{"type":"text","itemType":"text","text":"Size (KB)"}],"items":[[{"type":"url","text":"https://cdn.bronto.com/popup/delivery.js"},{"type":"text","text":"None"},{"type":"text","text":"4 KB"}],[{"type":"url","text":"https://p.bm23.com/bta.js"},{"type":"text","text":"None"},{"type":"text","text":"1 KB"}],[{"type":"url","text":"https://p.yotpo.com/i?e=pv&page=Gro%20Store%20%7CGro%20baby%20clothes%20%26%20toys%20%7C%20Gro%20bags%2C%20Gro%20clocks%2C%20Gro%20eggs%2C%20Baby%20Bedding%20and%20Swaddles&se_va=INNN2oWNqTDW3UgadN2pKPYnIMdqgHgCGdRgUe1e&dtm=1524587388879&tid=855414&vp=412x732&ds=412x11707&vid=1&duid=d6b439d3a6689028&p=web&tv=js-0.13.2&fp=2162865479&aid=onsite_v2&lang=en-US&cs=UTF-8&tz=Etc%2FUTC&res=412x732&cd=24&cookie=1&url=https%3A%2F%2Fwww.gro-store.com%2F"},{"type":"text","text":"None"},{"type":"text","text":"0 KB"}],[{"type":"url","text":"https://nosto-merchant-assets.s3.amazonaws.com/gro-eur-magento2/5a55fe4a60b2c62ce44a09e1/1515593773588"},{"type":"text","text":"None"},{"type":"text","text":"0 KB"}],[{"type":"url","text":"https://cdn.bronto.com/popup/polyfills.js"},{"type":"text","text":"None"},{"type":"text","text":"0 KB"}],[{"type":"url","text":"https://connect.nosto.com/include/gro-uk-magento2"},{"type":"text","text":"10 m"},{"type":"text","text":"24 KB"}],[{"type":"url","text":"https://staticw2.yotpo.com/INNN2oWNqTDW3UgadN2pKPYnIMdqgHgCGdRgUe1e/widget.js"},{"type":"text","text":"49 m 4 s"},{"type":"text","text":"81 KB"}],[{"type":"url","text":"https://staticw2.yotpo.com/INNN2oWNqTDW3UgadN2pKPYnIMdqgHgCGdRgUe1e/widget.css?widget_version=2018-04-23_10-18-12"},{"type":"text","text":"49 m 52 s"},{"type":"text","text":"0 KB"}],[{"type":"url","text":"https://connect.nosto.com/public/javascripts/jquery-1.7.1.min.js"},{"type":"text","text":"1 h"},{"type":"text","text":"33 KB"}],[{"type":"url","text":"https://connect.nosto.com/public/javascripts/behav-popup.min.js"},{"type":"text","text":"1 h"},{"type":"text","text":"3 KB"}],[{"type":"url","text":"https://connect.nosto.com/overlay/discount-modal/increaseStat?account=gro-uk-magento2&s=triggered&campaignId=10%25%20Off%202%20Items&rand=05208"},{"type":"text","text":"1 h"},{"type":"text","text":"0 KB"}],[{"type":"url","text":"https://connect.nosto.com/public/javascripts/clipboard.min.js"},{"type":"text","text":"1 h"},{"type":"text","text":"0 KB"}],[{"type":"url","text":"https://www.google-analytics.com/plugins/ua/ec.js"},{"type":"text","text":"1 h"},{"type":"text","text":"0 KB"}],[{"type":"url","text":"https://connect.nosto.com/overlay/discount-modal/increaseStat?account=gro-uk-magento2&s=shown&campaignId=10%25%20Off%202%20Items&rand=98975"},{"type":"text","text":"1 h"},{"type":"text","text":"0 KB"}],[{"type":"url","text":"https://connect.nosto.com/overlay/discount-modal/increaseStat?account=gro-uk-magento2&s=triggered&campaignId=Welcome%20New%20Customers%20New&rand=42892"},{"type":"text","text":"1 h"},{"type":"text","text":"0 KB"}],[{"type":"url","text":"https://www.google-analytics.com/analytics.js"},{"type":"text","text":"2 h"},{"type":"text","text":"0 KB"}],[{"type":"url","text":"https://fonts.googleapis.com/css?family=Muli:300,300i,400,400i"},{"type":"text","text":"1 d"},{"type":"text","text":"1 KB"}],[{"type":"url","text":"https://fonts.googleapis.com/css?family=Open+Sans"},{"type":"text","text":"1 d"},{"type":"text","text":"0 KB"}]]}},"total-byte-weight":{"score":100,"displayValue":"Total size was 819 KB","rawValue":838706,"extendedInfo":{"value":{"results":[{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Algolia_AlgoliaSearch/internals/algoliaBundle.min.js","totalBytes":164400,"totalKb":"161 KB","totalMs":"1,110 ms"},{"url":"https://www.gro-store.com/media/gene-cms/g/r/grobags-big-hero.jpg","totalBytes":105494,"totalKb":"103 KB","totalMs":"710 ms"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/jquery.js","totalBytes":89107,"totalKb":"87 KB","totalMs":"600 ms"},{"url":"https://staticw2.yotpo.com/INNN2oWNqTDW3UgadN2pKPYnIMdqgHgCGdRgUe1e/widget.js","totalBytes":83278,"totalKb":"81 KB","totalMs":"560 ms"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/css/styles.min.css","totalBytes":63853,"totalKb":"62 KB","totalMs":"430 ms"},{"url":"https://www.gro-store.com/media/gene-cms/l/i/liquorice_sticks_mobile_image_1.jpg","totalBytes":47180,"totalKb":"46 KB","totalMs":"320 ms"},{"url":"https://connect.nosto.com/public/javascripts/jquery-1.7.1.min.js","totalBytes":33588,"totalKb":"33 KB","totalMs":"230 ms"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/fonts/gro-theme/gro-theme.woff","totalBytes":32416,"totalKb":"32 KB","totalMs":"220 ms"},{"url":"https://www.gro-store.com/","totalBytes":26148,"totalKb":"26 KB","totalMs":"180 ms"},{"url":"https://connect.nosto.com/include/gro-uk-magento2","totalBytes":24411,"totalKb":"24 KB","totalMs":"170 ms"}],"totalCompletedRequests":231}},"scoringMode":"numeric","name":"total-byte-weight","description":"Avoids enormous network payloads","helpText":"Large network payloads cost users real money and are highly correlated with long load times. [Learn more](https://developers.google.com/web/tools/lighthouse/audits/network-payloads).","details":{"type":"table","header":"View Details","itemHeaders":[{"type":"text","itemType":"url","text":"URL"},{"type":"text","itemType":"text","text":"Total Size"},{"type":"text","itemType":"text","text":"Transfer Time"}],"items":[[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Algolia_AlgoliaSearch/internals/algoliaBundle.min.js"},{"type":"text","text":"161 KB"},{"type":"text","text":"1,110 ms"}],[{"type":"url","text":"https://www.gro-store.com/media/gene-cms/g/r/grobags-big-hero.jpg"},{"type":"text","text":"103 KB"},{"type":"text","text":"710 ms"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/jquery.js"},{"type":"text","text":"87 KB"},{"type":"text","text":"600 ms"}],[{"type":"url","text":"https://staticw2.yotpo.com/INNN2oWNqTDW3UgadN2pKPYnIMdqgHgCGdRgUe1e/widget.js"},{"type":"text","text":"81 KB"},{"type":"text","text":"560 ms"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/css/styles.min.css"},{"type":"text","text":"62 KB"},{"type":"text","text":"430 ms"}],[{"type":"url","text":"https://www.gro-store.com/media/gene-cms/l/i/liquorice_sticks_mobile_image_1.jpg"},{"type":"text","text":"46 KB"},{"type":"text","text":"320 ms"}],[{"type":"url","text":"https://connect.nosto.com/public/javascripts/jquery-1.7.1.min.js"},{"type":"text","text":"33 KB"},{"type":"text","text":"230 ms"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/fonts/gro-theme/gro-theme.woff"},{"type":"text","text":"32 KB"},{"type":"text","text":"220 ms"}],[{"type":"url","text":"https://www.gro-store.com/"},{"type":"text","text":"26 KB"},{"type":"text","text":"180 ms"}],[{"type":"url","text":"https://connect.nosto.com/include/gro-uk-magento2"},{"type":"text","text":"24 KB"},{"type":"text","text":"170 ms"}]]}},"offscreen-images":{"score":0,"displayValue":"Potential savings of 403 KB (~2,800 ms)","rawValue":2800,"extendedInfo":{"value":{"wastedMs":2800,"wastedKb":403,"results":[{"url":"https://www.gro-store.com/media/catalog/product/b/e/beachball_blue_-_lightweave_grobag1.jpg","preview":{"type":"thumbnail","url":"https://www.gro-store.com/media/catalog/product/b/e/beachball_blue_-_lightweave_grobag1.jpg","mimeType":"image/jpeg"},"requestStartTime":5572946.026507,"totalBytes":107728,"wastedBytes":107728,"wastedPercent":100,"wastedKb":"105 KB","wastedMs":"730 ms","totalKb":"105 KB","totalMs":"730 ms","potentialSavings":"105 KB (100%)"},{"url":"https://www.gro-store.com/media/gene-cms/g/r/grobags-big-hero.jpg","preview":{"type":"thumbnail","url":"https://www.gro-store.com/media/gene-cms/g/r/grobags-big-hero.jpg","mimeType":"image/jpeg"},"requestStartTime":5572944.610367,"totalBytes":105158,"wastedBytes":105158,"wastedPercent":100,"wastedKb":"103 KB","wastedMs":"710 ms","totalKb":"103 KB","totalMs":"710 ms","potentialSavings":"103 KB (100%)"},{"url":"https://www.gro-store.com/media/catalog/product/b/e/beachball_pink_-_lightweave_grobag1_1.jpg","preview":{"type":"thumbnail","url":"https://www.gro-store.com/media/catalog/product/b/e/beachball_pink_-_lightweave_grobag1_1.jpg","mimeType":"image/jpeg"},"requestStartTime":5572946.026619,"totalBytes":95736,"wastedBytes":95736,"wastedPercent":100,"wastedKb":"93 KB","wastedMs":"650 ms","totalKb":"93 KB","totalMs":"650 ms","potentialSavings":"93 KB (100%)"},{"url":"https://www.gro-store.com/media/catalog/product/b/e/beside_the_sea_grobag4.jpg","preview":{"type":"thumbnail","url":"https://www.gro-store.com/media/catalog/product/b/e/beside_the_sea_grobag4.jpg","mimeType":"image/jpeg"},"requestStartTime":5572946.026402,"totalBytes":93336,"wastedBytes":93336,"wastedPercent":100,"wastedKb":"91 KB","wastedMs":"630 ms","totalKb":"91 KB","totalMs":"630 ms","potentialSavings":"91 KB (100%)"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Algolia_AlgoliaSearch/images/search-by-algolia.svg","preview":{"type":"thumbnail","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Algolia_AlgoliaSearch/images/search-by-algolia.svg","mimeType":"image/svg+xml"},"requestStartTime":5572951.53083,"totalBytes":8625,"wastedBytes":8625,"wastedPercent":100,"wastedKb":"8 KB","wastedMs":"60 ms","totalKb":"8 KB","totalMs":"60 ms","potentialSavings":"8 KB (100%)"},{"url":"https://www.gro-store.com/media/gene-cms/s/c/screen_shot_2017-07-31_at_17.17.21-1_3.png","preview":{"type":"thumbnail","url":"https://www.gro-store.com/media/gene-cms/s/c/screen_shot_2017-07-31_at_17.17.21-1_3.png","mimeType":"image/png"},"requestStartTime":5572944.720967,"totalBytes":2399,"wastedBytes":2399,"wastedPercent":100,"wastedKb":"2 KB","wastedMs":"20 ms","totalKb":"2 KB","totalMs":"20 ms","potentialSavings":"2 KB (100%)"}]}},"scoringMode":"binary","informative":true,"name":"offscreen-images","description":"Offscreen images","helpText":"Consider lazy-loading offscreen and hidden images to improve page load speed and time to interactive. [Learn more](https://developers.google.com/web/tools/lighthouse/audits/offscreen-images).","details":{"type":"table","header":"View Details","itemHeaders":[{"type":"text","itemType":"thumbnail","text":""},{"type":"text","itemType":"url","text":"URL"},{"type":"text","itemType":"text","text":"Original"},{"type":"text","itemType":"text","text":"Potential Savings"}],"items":[[{"type":"thumbnail","url":"https://www.gro-store.com/media/catalog/product/b/e/beachball_blue_-_lightweave_grobag1.jpg","mimeType":"image/jpeg"},{"type":"url","text":"https://www.gro-store.com/media/catalog/product/b/e/beachball_blue_-_lightweave_grobag1.jpg"},{"type":"text","text":"105 KB"},{"type":"text","text":"105 KB (100%)"}],[{"type":"thumbnail","url":"https://www.gro-store.com/media/gene-cms/g/r/grobags-big-hero.jpg","mimeType":"image/jpeg"},{"type":"url","text":"https://www.gro-store.com/media/gene-cms/g/r/grobags-big-hero.jpg"},{"type":"text","text":"103 KB"},{"type":"text","text":"103 KB (100%)"}],[{"type":"thumbnail","url":"https://www.gro-store.com/media/catalog/product/b/e/beachball_pink_-_lightweave_grobag1_1.jpg","mimeType":"image/jpeg"},{"type":"url","text":"https://www.gro-store.com/media/catalog/product/b/e/beachball_pink_-_lightweave_grobag1_1.jpg"},{"type":"text","text":"93 KB"},{"type":"text","text":"93 KB (100%)"}],[{"type":"thumbnail","url":"https://www.gro-store.com/media/catalog/product/b/e/beside_the_sea_grobag4.jpg","mimeType":"image/jpeg"},{"type":"url","text":"https://www.gro-store.com/media/catalog/product/b/e/beside_the_sea_grobag4.jpg"},{"type":"text","text":"91 KB"},{"type":"text","text":"91 KB (100%)"}],[{"type":"thumbnail","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Algolia_AlgoliaSearch/images/search-by-algolia.svg","mimeType":"image/svg+xml"},{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Algolia_AlgoliaSearch/images/search-by-algolia.svg"},{"type":"text","text":"8 KB"},{"type":"text","text":"8 KB (100%)"}],[{"type":"thumbnail","url":"https://www.gro-store.com/media/gene-cms/s/c/screen_shot_2017-07-31_at_17.17.21-1_3.png","mimeType":"image/png"},{"type":"url","text":"https://www.gro-store.com/media/gene-cms/s/c/screen_shot_2017-07-31_at_17.17.21-1_3.png"},{"type":"text","text":"2 KB"},{"type":"text","text":"2 KB (100%)"}]]}},"unminified-css":{"score":100,"displayValue":"","rawValue":0,"extendedInfo":{"value":{"wastedMs":0,"wastedKb":0,"results":[]}},"scoringMode":"binary","informative":true,"name":"unminified-css","description":"Minify CSS","helpText":"Minifying CSS files can reduce network payload sizes. [Learn more](https://developers.google.com/speed/docs/insights/MinifyResources).","details":{"type":"table","header":"View Details","itemHeaders":[{"type":"text","itemType":"url","text":"URL"},{"type":"text","itemType":"text","text":"Original"},{"type":"text","itemType":"text","text":"Potential Savings"}],"items":[]}},"unminified-javascript":{"score":65,"displayValue":"Potential savings of 64 KB (~450 ms)","rawValue":450,"extendedInfo":{"value":{"wastedMs":450,"wastedKb":64,"results":[{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/jquery.js","totalBytes":89107,"wastedBytes":45291,"wastedPercent":50.82806127784168,"wastedKb":"44 KB","wastedMs":"310 ms","totalKb":"87 KB","totalMs":"600 ms","potentialSavings":"44 KB (51%)"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/requirejs/require.js","totalBytes":20628,"wastedBytes":14419,"wastedPercent":69.89856982240651,"wastedKb":"14 KB","wastedMs":"100 ms","totalKb":"20 KB","totalMs":"140 ms","potentialSavings":"14 KB (70%)"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/jquery/jquery.mobile.custom.js","totalBytes":7281,"wastedBytes":3387,"wastedPercent":46.51461745801369,"wastedKb":"3 KB","wastedMs":"20 ms","totalKb":"7 KB","totalMs":"50 ms","potentialSavings":"3 KB (47%)"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/requirejs-config.js","totalBytes":5424,"wastedBytes":2599,"wastedPercent":47.924730770704784,"wastedKb":"3 KB","wastedMs":"20 ms","totalKb":"5 KB","totalMs":"40 ms","potentialSavings":"3 KB (48%)"}]}},"scoringMode":"binary","informative":true,"name":"unminified-javascript","description":"Minify JavaScript","helpText":"Minifying JavaScript files can reduce payload sizes and script parse time. [Learn more](https://developers.google.com/speed/docs/insights/MinifyResources).","details":{"type":"table","header":"View Details","itemHeaders":[{"type":"text","itemType":"url","text":"URL"},{"type":"text","itemType":"text","text":"Original"},{"type":"text","itemType":"text","text":"Potential Savings"}],"items":[[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/jquery.js"},{"type":"text","text":"87 KB"},{"type":"text","text":"44 KB (51%)"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/requirejs/require.js"},{"type":"text","text":"20 KB"},{"type":"text","text":"14 KB (70%)"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/jquery/jquery.mobile.custom.js"},{"type":"text","text":"7 KB"},{"type":"text","text":"3 KB (47%)"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/requirejs-config.js"},{"type":"text","text":"5 KB"},{"type":"text","text":"3 KB (48%)"}]]}},"unused-css-rules":{"score":65,"displayValue":"Potential savings of 65 KB (~450 ms)","rawValue":450,"extendedInfo":{"value":{"wastedMs":450,"wastedKb":65,"results":[{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/css/styles.min.css","wastedBytes":56751,"wastedPercent":88.87791447150035,"totalBytes":63853,"wastedKb":"55 KB","wastedMs":"380 ms","totalKb":"62 KB","totalMs":"430 ms","potentialSavings":"55 KB (89%)"},{"url":"https://www.gro-store.com/static/version1524047115/_cache/merged/12a02713855ed25d85717a28b9d29ba6.min.css","wastedBytes":9429,"wastedPercent":89.7030311174246,"totalBytes":10511,"wastedKb":"9 KB","wastedMs":"60 ms","totalKb":"10 KB","totalMs":"70 ms","potentialSavings":"9 KB (90%)"}]}},"scoringMode":"binary","informative":true,"name":"unused-css-rules","description":"Unused CSS rules","helpText":"Remove unused rules from stylesheets to reduce unnecessary bytes consumed by network activity. [Learn more](https://developers.google.com/speed/docs/insights/OptimizeCSSDelivery)","details":{"type":"table","header":"View Details","itemHeaders":[{"type":"text","itemType":"url","text":"URL"},{"type":"text","itemType":"text","text":"Original"},{"type":"text","itemType":"text","text":"Potential Savings"}],"items":[[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/css/styles.min.css"},{"type":"text","text":"62 KB"},{"type":"text","text":"55 KB (89%)"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/_cache/merged/12a02713855ed25d85717a28b9d29ba6.min.css"},{"type":"text","text":"10 KB"},{"type":"text","text":"9 KB (90%)"}]]}},"uses-webp-images":{"score":0,"displayValue":"Potential savings of 163 KB (~1,130 ms)","rawValue":1130,"extendedInfo":{"value":{"wastedMs":1130,"wastedKb":163,"results":[{"url":"https://www.gro-store.com/media/gene-cms/g/r/grobags-big-hero.jpg","fromProtocol":true,"isCrossOrigin":false,"preview":{"url":"https://www.gro-store.com/media/gene-cms/g/r/grobags-big-hero.jpg","mimeType":"image/jpeg","type":"thumbnail"},"totalBytes":105158,"wastedBytes":37042,"wastedKb":"36 KB","wastedMs":"250 ms","totalKb":"103 KB","totalMs":"710 ms","potentialSavings":"36 KB (35%)"},{"url":"https://www.gro-store.com/media/gene-cms/s/p/spring_leaves_grobag.jpg","fromProtocol":true,"isCrossOrigin":false,"preview":{"url":"https://www.gro-store.com/media/gene-cms/s/p/spring_leaves_grobag.jpg","mimeType":"image/jpeg","type":"thumbnail"},"totalBytes":86412,"wastedBytes":33354,"wastedKb":"33 KB","wastedMs":"230 ms","totalKb":"84 KB","totalMs":"590 ms","potentialSavings":"33 KB (39%)"},{"url":"https://www.gro-store.com/media/catalog/product/b/e/beachball_blue_-_lightweave_grobag1.jpg","fromProtocol":true,"isCrossOrigin":false,"preview":{"url":"https://www.gro-store.com/media/catalog/product/b/e/beachball_blue_-_lightweave_grobag1.jpg","mimeType":"image/jpeg","type":"thumbnail"},"totalBytes":107728,"wastedBytes":21634,"wastedKb":"21 KB","wastedMs":"150 ms","totalKb":"105 KB","totalMs":"730 ms","potentialSavings":"21 KB (20%)"},{"url":"https://www.gro-store.com/media/catalog/product/b/e/beside_the_sea_grobag4.jpg","fromProtocol":true,"isCrossOrigin":false,"preview":{"url":"https://www.gro-store.com/media/catalog/product/b/e/beside_the_sea_grobag4.jpg","mimeType":"image/jpeg","type":"thumbnail"},"totalBytes":93336,"wastedBytes":20684,"wastedKb":"20 KB","wastedMs":"140 ms","totalKb":"91 KB","totalMs":"630 ms","potentialSavings":"20 KB (22%)"},{"url":"https://www.gro-store.com/media/gene-cms/l/i/liquorice_sticks_mobile_image_1.jpg","fromProtocol":true,"isCrossOrigin":false,"preview":{"url":"https://www.gro-store.com/media/gene-cms/l/i/liquorice_sticks_mobile_image_1.jpg","mimeType":"image/jpeg","type":"thumbnail"},"totalBytes":46909,"wastedBytes":19101,"wastedKb":"19 KB","wastedMs":"130 ms","totalKb":"46 KB","totalMs":"320 ms","potentialSavings":"19 KB (41%)"},{"url":"https://www.gro-store.com/media/catalog/product/b/e/beachball_pink_-_lightweave_grobag1_1.jpg","fromProtocol":true,"isCrossOrigin":false,"preview":{"url":"https://www.gro-store.com/media/catalog/product/b/e/beachball_pink_-_lightweave_grobag1_1.jpg","mimeType":"image/jpeg","type":"thumbnail"},"totalBytes":95736,"wastedBytes":18176,"wastedKb":"18 KB","wastedMs":"120 ms","totalKb":"93 KB","totalMs":"650 ms","potentialSavings":"18 KB (19%)"},{"url":"https://nosto-merchant-assets.s3.amazonaws.com/gro-eur-magento2/5a55fe4a60b2c62ce44a09e1/1515593773588","fromProtocol":true,"isCrossOrigin":true,"preview":{"url":"https://nosto-merchant-assets.s3.amazonaws.com/gro-eur-magento2/5a55fe4a60b2c62ce44a09e1/1515593773588","mimeType":"image/jpeg","type":"thumbnail"},"totalBytes":47147,"wastedBytes":16959,"wastedKb":"17 KB","wastedMs":"110 ms","totalKb":"46 KB","totalMs":"320 ms","potentialSavings":"17 KB (36%)"}]}},"scoringMode":"binary","informative":true,"name":"uses-webp-images","description":"Serve images in next-gen formats","helpText":"Image formats like JPEG 2000, JPEG XR, and WebP often provide better compression than PNG or JPEG, which means faster downloads and less data consumption. [Learn more](https://developers.google.com/web/tools/lighthouse/audits/webp).","details":{"type":"table","header":"View Details","itemHeaders":[{"type":"text","itemType":"thumbnail","text":""},{"type":"text","itemType":"url","text":"URL"},{"type":"text","itemType":"text","text":"Original"},{"type":"text","itemType":"text","text":"Potential Savings"}],"items":[[{"url":"https://www.gro-store.com/media/gene-cms/g/r/grobags-big-hero.jpg","mimeType":"image/jpeg","type":"thumbnail"},{"type":"url","text":"https://www.gro-store.com/media/gene-cms/g/r/grobags-big-hero.jpg"},{"type":"text","text":"103 KB"},{"type":"text","text":"36 KB (35%)"}],[{"url":"https://www.gro-store.com/media/gene-cms/s/p/spring_leaves_grobag.jpg","mimeType":"image/jpeg","type":"thumbnail"},{"type":"url","text":"https://www.gro-store.com/media/gene-cms/s/p/spring_leaves_grobag.jpg"},{"type":"text","text":"84 KB"},{"type":"text","text":"33 KB (39%)"}],[{"url":"https://www.gro-store.com/media/catalog/product/b/e/beachball_blue_-_lightweave_grobag1.jpg","mimeType":"image/jpeg","type":"thumbnail"},{"type":"url","text":"https://www.gro-store.com/media/catalog/product/b/e/beachball_blue_-_lightweave_grobag1.jpg"},{"type":"text","text":"105 KB"},{"type":"text","text":"21 KB (20%)"}],[{"url":"https://www.gro-store.com/media/catalog/product/b/e/beside_the_sea_grobag4.jpg","mimeType":"image/jpeg","type":"thumbnail"},{"type":"url","text":"https://www.gro-store.com/media/catalog/product/b/e/beside_the_sea_grobag4.jpg"},{"type":"text","text":"91 KB"},{"type":"text","text":"20 KB (22%)"}],[{"url":"https://www.gro-store.com/media/gene-cms/l/i/liquorice_sticks_mobile_image_1.jpg","mimeType":"image/jpeg","type":"thumbnail"},{"type":"url","text":"https://www.gro-store.com/media/gene-cms/l/i/liquorice_sticks_mobile_image_1.jpg"},{"type":"text","text":"46 KB"},{"type":"text","text":"19 KB (41%)"}],[{"url":"https://www.gro-store.com/media/catalog/product/b/e/beachball_pink_-_lightweave_grobag1_1.jpg","mimeType":"image/jpeg","type":"thumbnail"},{"type":"url","text":"https://www.gro-store.com/media/catalog/product/b/e/beachball_pink_-_lightweave_grobag1_1.jpg"},{"type":"text","text":"93 KB"},{"type":"text","text":"18 KB (19%)"}],[{"url":"https://nosto-merchant-assets.s3.amazonaws.com/gro-eur-magento2/5a55fe4a60b2c62ce44a09e1/1515593773588","mimeType":"image/jpeg","type":"thumbnail"},{"type":"url","text":"https://nosto-merchant-assets.s3.amazonaws.com/gro-eur-magento2/5a55fe4a60b2c62ce44a09e1/1515593773588"},{"type":"text","text":"46 KB"},{"type":"text","text":"17 KB (36%)"}]]}},"uses-optimized-images":{"score":100,"displayValue":"","rawValue":0,"extendedInfo":{"value":{"wastedMs":0,"wastedKb":0,"results":[]}},"scoringMode":"binary","informative":true,"name":"uses-optimized-images","description":"Optimize images","helpText":"Optimized images load faster and consume less cellular data. [Learn more](https://developers.google.com/web/tools/lighthouse/audits/optimize-images).","details":{"type":"table","header":"View Details","itemHeaders":[{"type":"text","itemType":"thumbnail","text":""},{"type":"text","itemType":"url","text":"URL"},{"type":"text","itemType":"text","text":"Original"},{"type":"text","itemType":"text","text":"Potential Savings"}],"items":[]}},"uses-request-compression":{"score":100,"displayValue":"","rawValue":0,"extendedInfo":{"value":{"wastedMs":0,"wastedKb":0,"results":[]}},"scoringMode":"binary","informative":true,"name":"uses-request-compression","description":"Enable text compression","helpText":"Text-based responses should be served with compression (gzip, deflate or brotli) to minimize total network bytes. [Learn more](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/optimize-encoding-and-transfer).","details":{"type":"table","header":"View Details","itemHeaders":[{"type":"text","itemType":"url","text":"Uncompressed resource URL"},{"type":"text","itemType":"text","text":"Original"},{"type":"text","itemType":"text","text":"GZIP Savings"}],"items":[]}},"uses-responsive-images":{"score":0,"displayValue":"Potential savings of 158 KB (~1,100 ms)","rawValue":1100,"extendedInfo":{"value":{"wastedMs":1100,"wastedKb":158,"results":[{"url":"https://www.gro-store.com/media/catalog/product/b/e/beachball_blue_-_lightweave_grobag1.jpg","preview":{"type":"thumbnail","url":"https://www.gro-store.com/media/catalog/product/b/e/beachball_blue_-_lightweave_grobag1.jpg","mimeType":"image/jpeg"},"totalBytes":107728,"wastedBytes":43856,"wastedPercent":40.71,"isWasteful":true,"wastedKb":"43 KB","wastedMs":"300 ms","totalKb":"105 KB","totalMs":"730 ms","potentialSavings":"43 KB (41%)"},{"url":"https://www.gro-store.com/media/gene-cms/s/p/spring_leaves_grobag.jpg","preview":{"type":"thumbnail","url":"https://www.gro-store.com/media/gene-cms/s/p/spring_leaves_grobag.jpg","mimeType":"image/jpeg"},"totalBytes":86412,"wastedBytes":40892,"wastedPercent":47.32241586538461,"isWasteful":true,"wastedKb":"40 KB","wastedMs":"280 ms","totalKb":"84 KB","totalMs":"590 ms","potentialSavings":"40 KB (47%)"},{"url":"https://www.gro-store.com/media/catalog/product/b/e/beachball_pink_-_lightweave_grobag1_1.jpg","preview":{"type":"thumbnail","url":"https://www.gro-store.com/media/catalog/product/b/e/beachball_pink_-_lightweave_grobag1_1.jpg","mimeType":"image/jpeg"},"totalBytes":95736,"wastedBytes":38974,"wastedPercent":40.71,"isWasteful":true,"wastedKb":"38 KB","wastedMs":"260 ms","totalKb":"93 KB","totalMs":"650 ms","potentialSavings":"38 KB (41%)"},{"url":"https://www.gro-store.com/media/catalog/product/b/e/beside_the_sea_grobag4.jpg","preview":{"type":"thumbnail","url":"https://www.gro-store.com/media/catalog/product/b/e/beside_the_sea_grobag4.jpg","mimeType":"image/jpeg"},"totalBytes":93336,"wastedBytes":37997,"wastedPercent":40.71,"isWasteful":true,"wastedKb":"37 KB","wastedMs":"260 ms","totalKb":"91 KB","totalMs":"630 ms","potentialSavings":"37 KB (41%)"}]}},"scoringMode":"binary","informative":true,"name":"uses-responsive-images","description":"Properly size images","helpText":"Serve images that are appropriately-sized to save cellular data and improve load time. [Learn more](https://developers.google.com/web/tools/lighthouse/audits/oversized-images).","details":{"type":"table","header":"View Details","itemHeaders":[{"type":"text","itemType":"thumbnail","text":""},{"type":"text","itemType":"url","text":"URL"},{"type":"text","itemType":"text","text":"Original"},{"type":"text","itemType":"text","text":"Potential Savings"}],"items":[[{"type":"thumbnail","url":"https://www.gro-store.com/media/catalog/product/b/e/beachball_blue_-_lightweave_grobag1.jpg","mimeType":"image/jpeg"},{"type":"url","text":"https://www.gro-store.com/media/catalog/product/b/e/beachball_blue_-_lightweave_grobag1.jpg"},{"type":"text","text":"105 KB"},{"type":"text","text":"43 KB (41%)"}],[{"type":"thumbnail","url":"https://www.gro-store.com/media/gene-cms/s/p/spring_leaves_grobag.jpg","mimeType":"image/jpeg"},{"type":"url","text":"https://www.gro-store.com/media/gene-cms/s/p/spring_leaves_grobag.jpg"},{"type":"text","text":"84 KB"},{"type":"text","text":"40 KB (47%)"}],[{"type":"thumbnail","url":"https://www.gro-store.com/media/catalog/product/b/e/beachball_pink_-_lightweave_grobag1_1.jpg","mimeType":"image/jpeg"},{"type":"url","text":"https://www.gro-store.com/media/catalog/product/b/e/beachball_pink_-_lightweave_grobag1_1.jpg"},{"type":"text","text":"93 KB"},{"type":"text","text":"38 KB (41%)"}],[{"type":"thumbnail","url":"https://www.gro-store.com/media/catalog/product/b/e/beside_the_sea_grobag4.jpg","mimeType":"image/jpeg"},{"type":"url","text":"https://www.gro-store.com/media/catalog/product/b/e/beside_the_sea_grobag4.jpg"},{"type":"text","text":"91 KB"},{"type":"text","text":"37 KB (41%)"}]]}},"appcache-manifest":{"score":true,"displayValue":"","rawValue":true,"debugString":"","scoringMode":"binary","name":"appcache-manifest","description":"Avoids Application Cache","helpText":"Application Cache is deprecated. [Learn more](https://developers.google.com/web/tools/lighthouse/audits/appcache)."},"dom-size":{"score":100,"displayValue":"1,651 nodes","rawValue":1651,"extendedInfo":{"value":[{"title":"Total DOM Nodes","value":"1,651","target":"< 1,500 nodes"},{"title":"DOM Depth","value":"23","snippet":"html >\n  body.cms-home.cms-index-index.page-layout-1column._active-back-to-top.footer-scrolled.sticky-header >\n    div.darwin-page-wrapper >\n      div.page-wrapper >\n        main#maincontent.page-main >\n          div.columns >\n            div.column.main >\n              div.bluefoot-row.bluefoot-structural >\n                div.col.bluefoot-structural.col-12 >\n                  div#advanced-product-list-6.products.bluefoot-product-list.advanced-product-list.grid.products-grid.bluefoot-entity >\n                    div.advanced-product-list__bottom.bluefoot-full-width >\n                      div.products.list.items.product-items.advanced-product-list__items.slick-initialized.slick-slider >\n                        div.slick-list.draggable >\n                          div.slick-track >\n                            div.item.product.product-item.single-product.slick-slide.slick-cloned >\n                              div.advanced-product-item__inner >\n                                div.product-item-info.bluefoot-normalise-heights >\n                                  div.product.details.product-item-details >\n                                    div.price-box.price-final_price >\n                                      span.special-price >\n                                        span.price-container.price-final_price.tax.weee >\n                                          span.price-wrapper >\n                                            span.price","target":"< 32"},{"title":"Maximum Children","value":"205","snippet":"Element with most children:\nhead","target":"< 60 nodes"}]},"scoringMode":"numeric","name":"dom-size","description":"Avoids an excessive DOM size","helpText":"Browser engineers recommend pages contain fewer than ~1,500 DOM nodes. The sweet spot is a tree depth < 32 elements and fewer than 60 children/parent element. A large DOM can increase memory usage, cause longer [style calculations](https://developers.google.com/web/fundamentals/performance/rendering/reduce-the-scope-and-complexity-of-style-calculations), and produce costly [layout reflows](https://developers.google.com/speed/articles/reflow). [Learn more](https://developers.google.com/web/fundamentals/performance/rendering/).","details":{"type":"cards","header":{"type":"text","text":"View details"},"items":[{"title":"Total DOM Nodes","value":"1,651","target":"< 1,500 nodes"},{"title":"DOM Depth","value":"23","snippet":"html >\n  body.cms-home.cms-index-index.page-layout-1column._active-back-to-top.footer-scrolled.sticky-header >\n    div.darwin-page-wrapper >\n      div.page-wrapper >\n        main#maincontent.page-main >\n          div.columns >\n            div.column.main >\n              div.bluefoot-row.bluefoot-structural >\n                div.col.bluefoot-structural.col-12 >\n                  div#advanced-product-list-6.products.bluefoot-product-list.advanced-product-list.grid.products-grid.bluefoot-entity >\n                    div.advanced-product-list__bottom.bluefoot-full-width >\n                      div.products.list.items.product-items.advanced-product-list__items.slick-initialized.slick-slider >\n                        div.slick-list.draggable >\n                          div.slick-track >\n                            div.item.product.product-item.single-product.slick-slide.slick-cloned >\n                              div.advanced-product-item__inner >\n                                div.product-item-info.bluefoot-normalise-heights >\n                                  div.product.details.product-item-details >\n                                    div.price-box.price-final_price >\n                                      span.special-price >\n                                        span.price-container.price-final_price.tax.weee >\n                                          span.price-wrapper >\n                                            span.price","target":"< 32"},{"title":"Maximum Children","value":"205","snippet":"Element with most children:\nhead","target":"< 60 nodes"}]}},"external-anchors-use-rel-noopener":{"score":false,"displayValue":"","rawValue":false,"extendedInfo":{"value":[{"href":"https://www.algolia.com/?utm_source=magento&utm_medium=link&utm_campaign=magento_autocompletion_menu","target":"_blank","rel":"","url":"<a href=\"https://www.algolia.com/?utm_source=magento&utm_medium=link&utm_campaign=magento_autocompletion_menu\" target=\"_blank\">"}]},"scoringMode":"binary","name":"external-anchors-use-rel-noopener","description":"Does not open external anchors using `rel=\"noopener\"`","helpText":"Open new tabs using `rel=\"noopener\"` to improve performance and prevent security vulnerabilities. [Learn more](https://developers.google.com/web/tools/lighthouse/audits/noopener).","details":{"type":"table","header":"View Details","itemHeaders":[{"type":"text","itemType":"url","text":"URL"},{"type":"text","itemType":"text","text":"Target"},{"type":"text","itemType":"text","text":"Rel"}],"items":[[{"type":"url","text":"https://www.algolia.com/?utm_source=magento&utm_medium=link&utm_campaign=magento_autocompletion_menu"},{"type":"text","text":"_blank"},{"type":"text","text":""}]]}},"geolocation-on-start":{"score":true,"displayValue":"","rawValue":true,"extendedInfo":{"value":[]},"scoringMode":"binary","name":"geolocation-on-start","description":"Avoids requesting the geolocation permission on page load","helpText":"Users are mistrustful of or confused by sites that request their location without context. Consider tying the request to user gestures instead. [Learn more](https://developers.google.com/web/tools/lighthouse/audits/geolocation-on-load).","details":{"type":"table","header":"View Details","itemHeaders":[{"type":"text","itemType":"url","text":"URL"},{"type":"text","itemType":"text","text":"Location"}],"items":[]}},"link-blocking-first-paint":{"score":0,"displayValue":"3 resources delayed first paint by 1,293 ms","rawValue":1293,"extendedInfo":{"value":{"wastedMs":"1,293 ms","results":[{"url":"https://www.gro-store.com/static/version1524047115/_cache/merged/12a02713855ed25d85717a28b9d29ba6.min.css","totalKb":"10.26 KB","totalMs":"915 ms"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/css/styles.min.css","totalKb":"62.36 KB","totalMs":"1,293 ms"},{"url":"https://fonts.googleapis.com/css?family=Muli:300,300i,400,400i","totalKb":"0.95 KB","totalMs":"694 ms"}]}},"scoringMode":"binary","informative":true,"name":"link-blocking-first-paint","description":"Reduce render-blocking stylesheets","helpText":"External stylesheets are blocking the first paint of your page. Consider delivering critical CSS via `<style>` tags and deferring non-critical styles. [Learn more](https://developers.google.com/web/tools/lighthouse/audits/blocking-resources).","details":{"type":"table","header":"View Details","itemHeaders":[{"type":"text","itemType":"url","text":"URL"},{"type":"text","itemType":"text","text":"Size (KB)"},{"type":"text","itemType":"text","text":"Delayed Paint By (ms)"}],"items":[[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/_cache/merged/12a02713855ed25d85717a28b9d29ba6.min.css"},{"type":"text","text":"10.26 KB"},{"type":"text","text":"915 ms"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/css/styles.min.css"},{"type":"text","text":"62.36 KB"},{"type":"text","text":"1,293 ms"}],[{"type":"url","text":"https://fonts.googleapis.com/css?family=Muli:300,300i,400,400i"},{"type":"text","text":"0.95 KB"},{"type":"text","text":"694 ms"}]]}},"no-document-write":{"score":false,"displayValue":"","rawValue":false,"extendedInfo":{"value":[{"label":"line: 3","source":"violation","level":"verbose","text":"Avoid using document.write().","timestamp":1524587384938.43,"url":"https://connect.nosto.com/include/gro-uk-magento2","lineNumber":3,"stackTrace":{"callFrames":[{"functionName":"d","scriptId":"45","url":"https://connect.nosto.com/include/gro-uk-magento2","lineNumber":3,"columnNumber":10548},{"functionName":"d","scriptId":"45","url":"https://connect.nosto.com/include/gro-uk-magento2","lineNumber":3,"columnNumber":10820},{"functionName":"d","scriptId":"45","url":"https://connect.nosto.com/include/gro-uk-magento2","lineNumber":4,"columnNumber":3804},{"functionName":"g","scriptId":"45","url":"https://connect.nosto.com/include/gro-uk-magento2","lineNumber":3,"columnNumber":12797},{"functionName":"20../api.js","scriptId":"45","url":"https://connect.nosto.com/include/gro-uk-magento2","lineNumber":3,"columnNumber":13003},{"functionName":"e","scriptId":"45","url":"https://connect.nosto.com/include/gro-uk-magento2","lineNumber":2,"columnNumber":219},{"functionName":"a","scriptId":"45","url":"https://connect.nosto.com/include/gro-uk-magento2","lineNumber":2,"columnNumber":386},{"functionName":"","scriptId":"45","url":"https://connect.nosto.com/include/gro-uk-magento2","lineNumber":2,"columnNumber":403}]}}]},"scoringMode":"binary","name":"no-document-write","description":"Uses `document.write()`","helpText":"For users on slow connections, external scripts dynamically injected via `document.write()` can delay page load by tens of seconds. [Learn more](https://developers.google.com/web/tools/lighthouse/audits/document-write).","details":{"type":"table","header":"View Details","itemHeaders":[{"type":"text","itemType":"url","text":"URL"},{"type":"text","itemType":"text","text":"Location"}],"items":[[{"type":"url","text":"https://connect.nosto.com/include/gro-uk-magento2"},{"type":"text","text":"line: 3"}]]}},"no-mutation-events":{"score":true,"displayValue":"","rawValue":true,"extendedInfo":{"value":{"results":[]}},"scoringMode":"binary","name":"no-mutation-events","description":"Avoids Mutation Events in its own scripts","helpText":"Mutation Events are deprecated and harm performance. Consider using Mutation Observers instead. [Learn more](https://developers.google.com/web/tools/lighthouse/audits/mutation-events).","details":{"type":"table","header":"View Details","itemHeaders":[{"type":"text","itemType":"url","text":"URL"},{"type":"text","itemType":"code","text":"Event"},{"type":"text","itemType":"text","text":"Line"},{"type":"text","itemType":"text","text":"Col"},{"type":"text","itemType":"code","text":"Snippet"}],"items":[]}},"no-vulnerable-libraries":{"score":false,"displayValue":"2 vulnerabilities detected.","rawValue":false,"extendedInfo":{"jsLibs":[{"name":"jQuery","version":"1.12.4","npmPkgName":"jquery","pkgLink":"https://snyk.io/vuln/npm:jquery?lh@1.12.4","vulns":[{"severity":"medium","numericSeverity":2,"library":"jQuery@1.12.4","url":"https://snyk.io/vuln/npm:jquery:20150627"}],"vulnCount":1,"highestSeverity":"Medium","detectedLib":{"text":"jQuery@1.12.4","url":"https://snyk.io/vuln/npm:jquery?lh@1.12.4","type":"link"}},{"name":"jQuery UI","version":"1.10.4","npmPkgName":"jquery-ui","pkgLink":"https://snyk.io/vuln/npm:jquery-ui?lh@1.10.4","vulns":[{"severity":"high","numericSeverity":3,"library":"jQuery UI@1.10.4","url":"https://snyk.io/vuln/npm:jquery-ui:20160721"}],"vulnCount":1,"highestSeverity":"High","detectedLib":{"text":"jQuery UI@1.10.4","url":"https://snyk.io/vuln/npm:jquery-ui?lh@1.10.4","type":"link"}},{"name":"Underscore","version":"1.8.2","npmPkgName":"underscore","vulns":[]},{"name":"RequireJS","version":"2.1.11","npmPkgName":"requirejs","vulns":[]},{"name":"jQuery Mobile","version":null,"npmPkgName":"jquery-mobile","pkgLink":"https://snyk.io/vuln/npm:jquery-mobile?lh@null","vulns":[]}],"vulnerabilities":[{"name":"jQuery","version":"1.12.4","npmPkgName":"jquery","pkgLink":"https://snyk.io/vuln/npm:jquery?lh@1.12.4","vulns":[{"severity":"medium","numericSeverity":2,"library":"jQuery@1.12.4","url":"https://snyk.io/vuln/npm:jquery:20150627"}],"vulnCount":1,"highestSeverity":"Medium","detectedLib":{"text":"jQuery@1.12.4","url":"https://snyk.io/vuln/npm:jquery?lh@1.12.4","type":"link"}},{"name":"jQuery UI","version":"1.10.4","npmPkgName":"jquery-ui","pkgLink":"https://snyk.io/vuln/npm:jquery-ui?lh@1.10.4","vulns":[{"severity":"high","numericSeverity":3,"library":"jQuery UI@1.10.4","url":"https://snyk.io/vuln/npm:jquery-ui:20160721"}],"vulnCount":1,"highestSeverity":"High","detectedLib":{"text":"jQuery UI@1.10.4","url":"https://snyk.io/vuln/npm:jquery-ui?lh@1.10.4","type":"link"}}]},"scoringMode":"binary","name":"no-vulnerable-libraries","description":"Includes front-end JavaScript libraries with known security vulnerabilities","helpText":"Some third-party scripts may contain known security vulnerabilities  that are easily identified and exploited by attackers.","details":{"type":"table","header":"View Details","itemHeaders":[{"type":"text","itemType":"link","text":"Library Version"},{"type":"text","itemType":"text","text":"Vulnerability Count"},{"type":"text","itemType":"text","text":"Highest Severity"}],"items":[[{"text":"jQuery@1.12.4","url":"https://snyk.io/vuln/npm:jquery?lh@1.12.4","type":"link"},{"type":"text","text":1},{"type":"text","text":"Medium"}],[{"text":"jQuery UI@1.10.4","url":"https://snyk.io/vuln/npm:jquery-ui?lh@1.10.4","type":"link"},{"type":"text","text":1},{"type":"text","text":"High"}]]}},"no-websql":{"score":true,"displayValue":"","rawValue":true,"debugString":"","scoringMode":"binary","name":"no-websql","description":"Avoids WebSQL DB","helpText":"Web SQL is deprecated. Consider using IndexedDB instead. [Learn more](https://developers.google.com/web/tools/lighthouse/audits/web-sql)."},"notification-on-start":{"score":true,"displayValue":"","rawValue":true,"extendedInfo":{"value":[]},"scoringMode":"binary","name":"notification-on-start","description":"Avoids requesting the notification permission on page load","helpText":"Users are mistrustful of or confused by sites that request to send notifications without context. Consider tying the request to user gestures instead. [Learn more](https://developers.google.com/web/tools/lighthouse/audits/notifications-on-load).","details":{"type":"table","header":"View Details","itemHeaders":[{"type":"text","itemType":"url","text":"URL"},{"type":"text","itemType":"text","text":"Location"}],"items":[]}},"password-inputs-can-be-pasted-into":{"score":true,"displayValue":"","rawValue":true,"extendedInfo":{"value":[]},"scoringMode":"binary","name":"password-inputs-can-be-pasted-into","description":"Allows users to paste into password fields","helpText":"Preventing password pasting undermines good security policy. [Learn more](https://www.ncsc.gov.uk/blog-post/let-them-paste-passwords)","details":{"type":"list","header":{"type":"text","text":"Password inputs that prevent pasting into"},"items":[]}},"script-blocking-first-paint":{"score":0,"displayValue":"3 resources delayed first paint by 1,058 ms","rawValue":1058,"extendedInfo":{"value":{"wastedMs":"1,058 ms","results":[{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/requirejs/require.js","totalKb":"20.14 KB","totalMs":"1,058 ms"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/mage/requirejs/mixins.js","totalKb":"2.41 KB","totalMs":"682 ms"},{"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/requirejs-config.js","totalKb":"5.3 KB","totalMs":"849 ms"}]}},"scoringMode":"binary","informative":true,"name":"script-blocking-first-paint","description":"Reduce render-blocking scripts","helpText":"Script elements are blocking the first paint of your page. Consider inlining critical scripts and deferring non-critical ones. [Learn more](https://developers.google.com/web/tools/lighthouse/audits/blocking-resources).","details":{"type":"table","header":"View Details","itemHeaders":[{"type":"text","itemType":"url","text":"URL"},{"type":"text","itemType":"text","text":"Size (KB)"},{"type":"text","itemType":"text","text":"Delayed Paint By (ms)"}],"items":[[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/requirejs/require.js"},{"type":"text","text":"20.14 KB"},{"type":"text","text":"1,058 ms"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/mage/requirejs/mixins.js"},{"type":"text","text":"2.41 KB"},{"type":"text","text":"682 ms"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/requirejs-config.js"},{"type":"text","text":"5.3 KB"},{"type":"text","text":"849 ms"}]]}},"uses-http2":{"score":true,"displayValue":"","rawValue":true,"extendedInfo":{"value":{"results":[]}},"scoringMode":"binary","name":"uses-http2","description":"Uses HTTP/2 for its own resources","helpText":"HTTP/2 offers many benefits over HTTP/1.1, including binary headers, multiplexing, and server push. [Learn more](https://developers.google.com/web/tools/lighthouse/audits/http2).","details":{"type":"table","header":"View Details","itemHeaders":[{"type":"text","itemType":"url","text":"URL"},{"type":"text","itemType":"text","text":"Protocol"}],"items":[]}},"uses-passive-event-listeners":{"score":false,"displayValue":"","rawValue":false,"extendedInfo":{"value":[{"label":"line: 4931","source":"violation","level":"verbose","text":"Added non-passive event listener to a scroll-blocking 'touchstart' event. Consider marking event handler as 'passive' to make the page more responsive. See https://www.chromestatus.com/feature/5745543795965952","timestamp":1524587389545.62,"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/jquery.js","lineNumber":4931,"stackTrace":{"callFrames":[{"functionName":"add","scriptId":"131","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/jquery.js","lineNumber":4931,"columnNumber":12},{"functionName":"jQuery.event.add","scriptId":"140","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/jquery/jquery-migrate.js","lineNumber":418,"columnNumber":10},{"functionName":"","scriptId":"131","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/jquery.js","lineNumber":4831,"columnNumber":16},{"functionName":"each","scriptId":"131","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/jquery.js","lineNumber":369,"columnNumber":19},{"functionName":"each","scriptId":"131","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/jquery.js","lineNumber":136,"columnNumber":17},{"functionName":"on","scriptId":"131","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/jquery.js","lineNumber":4830,"columnNumber":14},{"functionName":"on","scriptId":"131","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/jquery.js","lineNumber":5815,"columnNumber":10},{"functionName":"Slick.initializeEvents","scriptId":"145","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Gene_BlueFoot/js/resource/jquery/slick/slick.js","lineNumber":1260,"columnNumber":16},{"functionName":"Slick.init","scriptId":"145","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Gene_BlueFoot/js/resource/jquery/slick/slick.js","lineNumber":1203,"columnNumber":14},{"functionName":"Slick","scriptId":"145","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Gene_BlueFoot/js/resource/jquery/slick/slick.js","lineNumber":176,"columnNumber":14},{"functionName":"$.fn.slick","scriptId":"145","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Gene_BlueFoot/js/resource/jquery/slick/slick.js","lineNumber":2661,"columnNumber":29},{"functionName":"","scriptId":"35","url":"https://www.gro-store.com/","lineNumber":1290,"columnNumber":56},{"functionName":"fire","scriptId":"131","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/jquery.js","lineNumber":3231,"columnNumber":31},{"functionName":"add","scriptId":"131","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/jquery.js","lineNumber":3290,"columnNumber":7},{"functionName":"jQuery.fn.ready","scriptId":"131","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/jquery.js","lineNumber":3541,"columnNumber":25},{"functionName":"jQuery.fn.init","scriptId":"131","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/jquery.js","lineNumber":2966,"columnNumber":10},{"functionName":"jQuery.fn.init","scriptId":"140","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/jquery/jquery-migrate.js","lineNumber":224,"columnNumber":16},{"functionName":"jQuery","scriptId":"131","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/jquery.js","lineNumber":74,"columnNumber":10},{"functionName":"","scriptId":"35","url":"https://www.gro-store.com/","lineNumber":1288,"columnNumber":12},{"functionName":"execCb","scriptId":"24","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/requirejs/require.js","lineNumber":1649,"columnNumber":32},{"functionName":"check","scriptId":"24","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/requirejs/require.js","lineNumber":865,"columnNumber":50},{"functionName":"","scriptId":"24","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/requirejs/require.js","lineNumber":1112,"columnNumber":33},{"functionName":"","scriptId":"24","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/requirejs/require.js","lineNumber":131,"columnNumber":22},{"functionName":"","scriptId":"24","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/requirejs/require.js","lineNumber":1155,"columnNumber":20},{"functionName":"each","scriptId":"24","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/requirejs/require.js","lineNumber":56,"columnNumber":30},{"functionName":"emit","scriptId":"24","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/requirejs/require.js","lineNumber":1154,"columnNumber":16},{"functionName":"check","scriptId":"24","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/requirejs/require.js","lineNumber":916,"columnNumber":29},{"functionName":"enable","scriptId":"24","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/requirejs/require.js","lineNumber":1142,"columnNumber":21},{"functionName":"init","scriptId":"24","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/requirejs/require.js","lineNumber":773,"columnNumber":25},{"functionName":"callGetModule","scriptId":"24","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/requirejs/require.js","lineNumber":1169,"columnNumber":62},{"functionName":"completeLoad","scriptId":"24","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/requirejs/require.js","lineNumber":1543,"columnNumber":20},{"functionName":"onScriptLoad","scriptId":"24","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/requirejs/require.js","lineNumber":1670,"columnNumber":28}]}},{"label":"line: 4931","source":"violation","level":"verbose","text":"Added non-passive event listener to a scroll-blocking 'touchmove' event. Consider marking event handler as 'passive' to make the page more responsive. See https://www.chromestatus.com/feature/5745543795965952","timestamp":1524587389547.78,"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/jquery.js","lineNumber":4931,"stackTrace":{"callFrames":[{"functionName":"add","scriptId":"131","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/jquery.js","lineNumber":4931,"columnNumber":12},{"functionName":"jQuery.event.add","scriptId":"140","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/jquery/jquery-migrate.js","lineNumber":418,"columnNumber":10},{"functionName":"","scriptId":"131","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/jquery.js","lineNumber":4831,"columnNumber":16},{"functionName":"each","scriptId":"131","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/jquery.js","lineNumber":369,"columnNumber":19},{"functionName":"each","scriptId":"131","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/jquery.js","lineNumber":136,"columnNumber":17},{"functionName":"on","scriptId":"131","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/jquery.js","lineNumber":4830,"columnNumber":14},{"functionName":"on","scriptId":"131","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/jquery.js","lineNumber":5815,"columnNumber":10},{"functionName":"Slick.initializeEvents","scriptId":"145","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Gene_BlueFoot/js/resource/jquery/slick/slick.js","lineNumber":1263,"columnNumber":16},{"functionName":"Slick.init","scriptId":"145","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Gene_BlueFoot/js/resource/jquery/slick/slick.js","lineNumber":1203,"columnNumber":14},{"functionName":"Slick","scriptId":"145","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Gene_BlueFoot/js/resource/jquery/slick/slick.js","lineNumber":176,"columnNumber":14},{"functionName":"$.fn.slick","scriptId":"145","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Gene_BlueFoot/js/resource/jquery/slick/slick.js","lineNumber":2661,"columnNumber":29},{"functionName":"","scriptId":"35","url":"https://www.gro-store.com/","lineNumber":1290,"columnNumber":56},{"functionName":"fire","scriptId":"131","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/jquery.js","lineNumber":3231,"columnNumber":31},{"functionName":"add","scriptId":"131","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/jquery.js","lineNumber":3290,"columnNumber":7},{"functionName":"jQuery.fn.ready","scriptId":"131","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/jquery.js","lineNumber":3541,"columnNumber":25},{"functionName":"jQuery.fn.init","scriptId":"131","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/jquery.js","lineNumber":2966,"columnNumber":10},{"functionName":"jQuery.fn.init","scriptId":"140","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/jquery/jquery-migrate.js","lineNumber":224,"columnNumber":16},{"functionName":"jQuery","scriptId":"131","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/jquery.js","lineNumber":74,"columnNumber":10},{"functionName":"","scriptId":"35","url":"https://www.gro-store.com/","lineNumber":1288,"columnNumber":12},{"functionName":"execCb","scriptId":"24","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/requirejs/require.js","lineNumber":1649,"columnNumber":32},{"functionName":"check","scriptId":"24","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/requirejs/require.js","lineNumber":865,"columnNumber":50},{"functionName":"","scriptId":"24","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/requirejs/require.js","lineNumber":1112,"columnNumber":33},{"functionName":"","scriptId":"24","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/requirejs/require.js","lineNumber":131,"columnNumber":22},{"functionName":"","scriptId":"24","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/requirejs/require.js","lineNumber":1155,"columnNumber":20},{"functionName":"each","scriptId":"24","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/requirejs/require.js","lineNumber":56,"columnNumber":30},{"functionName":"emit","scriptId":"24","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/requirejs/require.js","lineNumber":1154,"columnNumber":16},{"functionName":"check","scriptId":"24","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/requirejs/require.js","lineNumber":916,"columnNumber":29},{"functionName":"enable","scriptId":"24","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/requirejs/require.js","lineNumber":1142,"columnNumber":21},{"functionName":"init","scriptId":"24","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/requirejs/require.js","lineNumber":773,"columnNumber":25},{"functionName":"callGetModule","scriptId":"24","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/requirejs/require.js","lineNumber":1169,"columnNumber":62},{"functionName":"completeLoad","scriptId":"24","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/requirejs/require.js","lineNumber":1543,"columnNumber":20},{"functionName":"onScriptLoad","scriptId":"24","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/requirejs/require.js","lineNumber":1670,"columnNumber":28}]}},{"label":"line: 4931","source":"violation","level":"verbose","text":"Added non-passive event listener to a scroll-blocking 'touchstart' event. Consider marking event handler as 'passive' to make the page more responsive. See https://www.chromestatus.com/feature/5745543795965952","timestamp":1524587389901.86,"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/jquery.js","lineNumber":4931,"stackTrace":{"callFrames":[{"functionName":"add","scriptId":"131","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/jquery.js","lineNumber":4931,"columnNumber":12},{"functionName":"jQuery.event.add","scriptId":"140","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/jquery/jquery-migrate.js","lineNumber":418,"columnNumber":10},{"functionName":"","scriptId":"131","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/jquery.js","lineNumber":4831,"columnNumber":16},{"functionName":"each","scriptId":"131","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/jquery.js","lineNumber":369,"columnNumber":19},{"functionName":"each","scriptId":"131","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/jquery.js","lineNumber":136,"columnNumber":17},{"functionName":"on","scriptId":"131","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/jquery.js","lineNumber":4830,"columnNumber":14},{"functionName":"on","scriptId":"131","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/jquery.js","lineNumber":5815,"columnNumber":10},{"functionName":"Slick.initializeEvents","scriptId":"145","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Gene_BlueFoot/js/resource/jquery/slick/slick.js","lineNumber":1260,"columnNumber":16},{"functionName":"Slick.init","scriptId":"145","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Gene_BlueFoot/js/resource/jquery/slick/slick.js","lineNumber":1203,"columnNumber":14},{"functionName":"Slick.refresh","scriptId":"145","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Gene_BlueFoot/js/resource/jquery/slick/slick.js","lineNumber":1555,"columnNumber":10},{"functionName":"Slick.checkResponsive","scriptId":"145","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Gene_BlueFoot/js/resource/jquery/slick/slick.js","lineNumber":640,"columnNumber":26},{"functionName":"Slick","scriptId":"145","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Gene_BlueFoot/js/resource/jquery/slick/slick.js","lineNumber":177,"columnNumber":14},{"functionName":"$.fn.slick","scriptId":"145","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Gene_BlueFoot/js/resource/jquery/slick/slick.js","lineNumber":2661,"columnNumber":29},{"functionName":"","scriptId":"35","url":"https://www.gro-store.com/","lineNumber":1290,"columnNumber":56},{"functionName":"fire","scriptId":"131","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/jquery.js","lineNumber":3231,"columnNumber":31},{"functionName":"add","scriptId":"131","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/jquery.js","lineNumber":3290,"columnNumber":7},{"functionName":"jQuery.fn.ready","scriptId":"131","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/jquery.js","lineNumber":3541,"columnNumber":25},{"functionName":"jQuery.fn.init","scriptId":"131","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/jquery.js","lineNumber":2966,"columnNumber":10},{"functionName":"jQuery.fn.init","scriptId":"140","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/jquery/jquery-migrate.js","lineNumber":224,"columnNumber":16},{"functionName":"jQuery","scriptId":"131","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/jquery.js","lineNumber":74,"columnNumber":10},{"functionName":"","scriptId":"35","url":"https://www.gro-store.com/","lineNumber":1288,"columnNumber":12},{"functionName":"execCb","scriptId":"24","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/requirejs/require.js","lineNumber":1649,"columnNumber":32},{"functionName":"check","scriptId":"24","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/requirejs/require.js","lineNumber":865,"columnNumber":50},{"functionName":"","scriptId":"24","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/requirejs/require.js","lineNumber":1112,"columnNumber":33},{"functionName":"","scriptId":"24","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/requirejs/require.js","lineNumber":131,"columnNumber":22},{"functionName":"","scriptId":"24","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/requirejs/require.js","lineNumber":1155,"columnNumber":20},{"functionName":"each","scriptId":"24","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/requirejs/require.js","lineNumber":56,"columnNumber":30},{"functionName":"emit","scriptId":"24","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/requirejs/require.js","lineNumber":1154,"columnNumber":16},{"functionName":"check","scriptId":"24","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/requirejs/require.js","lineNumber":916,"columnNumber":29},{"functionName":"enable","scriptId":"24","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/requirejs/require.js","lineNumber":1142,"columnNumber":21},{"functionName":"init","scriptId":"24","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/requirejs/require.js","lineNumber":773,"columnNumber":25},{"functionName":"callGetModule","scriptId":"24","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/requirejs/require.js","lineNumber":1169,"columnNumber":62},{"functionName":"completeLoad","scriptId":"24","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/requirejs/require.js","lineNumber":1543,"columnNumber":20},{"functionName":"onScriptLoad","scriptId":"24","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/requirejs/require.js","lineNumber":1670,"columnNumber":28}]}},{"label":"line: 4931","source":"violation","level":"verbose","text":"Added non-passive event listener to a scroll-blocking 'touchmove' event. Consider marking event handler as 'passive' to make the page more responsive. See https://www.chromestatus.com/feature/5745543795965952","timestamp":1524587389905.89,"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/jquery.js","lineNumber":4931,"stackTrace":{"callFrames":[{"functionName":"add","scriptId":"131","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/jquery.js","lineNumber":4931,"columnNumber":12},{"functionName":"jQuery.event.add","scriptId":"140","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/jquery/jquery-migrate.js","lineNumber":418,"columnNumber":10},{"functionName":"","scriptId":"131","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/jquery.js","lineNumber":4831,"columnNumber":16},{"functionName":"each","scriptId":"131","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/jquery.js","lineNumber":369,"columnNumber":19},{"functionName":"each","scriptId":"131","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/jquery.js","lineNumber":136,"columnNumber":17},{"functionName":"on","scriptId":"131","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/jquery.js","lineNumber":4830,"columnNumber":14},{"functionName":"on","scriptId":"131","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/jquery.js","lineNumber":5815,"columnNumber":10},{"functionName":"Slick.initializeEvents","scriptId":"145","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Gene_BlueFoot/js/resource/jquery/slick/slick.js","lineNumber":1263,"columnNumber":16},{"functionName":"Slick.init","scriptId":"145","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Gene_BlueFoot/js/resource/jquery/slick/slick.js","lineNumber":1203,"columnNumber":14},{"functionName":"Slick.refresh","scriptId":"145","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Gene_BlueFoot/js/resource/jquery/slick/slick.js","lineNumber":1555,"columnNumber":10},{"functionName":"Slick.checkResponsive","scriptId":"145","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Gene_BlueFoot/js/resource/jquery/slick/slick.js","lineNumber":640,"columnNumber":26},{"functionName":"Slick","scriptId":"145","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Gene_BlueFoot/js/resource/jquery/slick/slick.js","lineNumber":177,"columnNumber":14},{"functionName":"$.fn.slick","scriptId":"145","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Gene_BlueFoot/js/resource/jquery/slick/slick.js","lineNumber":2661,"columnNumber":29},{"functionName":"","scriptId":"35","url":"https://www.gro-store.com/","lineNumber":1290,"columnNumber":56},{"functionName":"fire","scriptId":"131","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/jquery.js","lineNumber":3231,"columnNumber":31},{"functionName":"add","scriptId":"131","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/jquery.js","lineNumber":3290,"columnNumber":7},{"functionName":"jQuery.fn.ready","scriptId":"131","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/jquery.js","lineNumber":3541,"columnNumber":25},{"functionName":"jQuery.fn.init","scriptId":"131","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/jquery.js","lineNumber":2966,"columnNumber":10},{"functionName":"jQuery.fn.init","scriptId":"140","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/jquery/jquery-migrate.js","lineNumber":224,"columnNumber":16},{"functionName":"jQuery","scriptId":"131","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/jquery.js","lineNumber":74,"columnNumber":10},{"functionName":"","scriptId":"35","url":"https://www.gro-store.com/","lineNumber":1288,"columnNumber":12},{"functionName":"execCb","scriptId":"24","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/requirejs/require.js","lineNumber":1649,"columnNumber":32},{"functionName":"check","scriptId":"24","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/requirejs/require.js","lineNumber":865,"columnNumber":50},{"functionName":"","scriptId":"24","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/requirejs/require.js","lineNumber":1112,"columnNumber":33},{"functionName":"","scriptId":"24","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/requirejs/require.js","lineNumber":131,"columnNumber":22},{"functionName":"","scriptId":"24","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/requirejs/require.js","lineNumber":1155,"columnNumber":20},{"functionName":"each","scriptId":"24","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/requirejs/require.js","lineNumber":56,"columnNumber":30},{"functionName":"emit","scriptId":"24","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/requirejs/require.js","lineNumber":1154,"columnNumber":16},{"functionName":"check","scriptId":"24","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/requirejs/require.js","lineNumber":916,"columnNumber":29},{"functionName":"enable","scriptId":"24","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/requirejs/require.js","lineNumber":1142,"columnNumber":21},{"functionName":"init","scriptId":"24","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/requirejs/require.js","lineNumber":773,"columnNumber":25},{"functionName":"callGetModule","scriptId":"24","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/requirejs/require.js","lineNumber":1169,"columnNumber":62},{"functionName":"completeLoad","scriptId":"24","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/requirejs/require.js","lineNumber":1543,"columnNumber":20},{"functionName":"onScriptLoad","scriptId":"24","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/requirejs/require.js","lineNumber":1670,"columnNumber":28}]}},{"label":"line: 3","source":"violation","level":"verbose","text":"Added non-passive event listener to a scroll-blocking 'touchstart' event. Consider marking event handler as 'passive' to make the page more responsive. See https://www.chromestatus.com/feature/5745543795965952","timestamp":1524587391367.28,"url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Algolia_AlgoliaSearch/internals/algoliaBundle.min.js","lineNumber":3,"stackTrace":{"callFrames":[{"functionName":"add","scriptId":"148","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Algolia_AlgoliaSearch/internals/algoliaBundle.min.js","lineNumber":3,"columnNumber":20044},{"functionName":"","scriptId":"148","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Algolia_AlgoliaSearch/internals/algoliaBundle.min.js","lineNumber":1,"columnNumber":5570},{"functionName":"each","scriptId":"148","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Algolia_AlgoliaSearch/internals/algoliaBundle.min.js","lineNumber":1,"columnNumber":17809},{"functionName":"each","scriptId":"148","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Algolia_AlgoliaSearch/internals/algoliaBundle.min.js","lineNumber":1,"columnNumber":15750},{"functionName":"P","scriptId":"148","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Algolia_AlgoliaSearch/internals/algoliaBundle.min.js","lineNumber":1,"columnNumber":5545},{"functionName":"on","scriptId":"148","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Algolia_AlgoliaSearch/internals/algoliaBundle.min.js","lineNumber":3,"columnNumber":28974},{"functionName":"","scriptId":"44","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Algolia_AlgoliaSearch/autocomplete.js","lineNumber":113,"columnNumber":18},{"functionName":"each","scriptId":"148","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Algolia_AlgoliaSearch/internals/algoliaBundle.min.js","lineNumber":1,"columnNumber":17809},{"functionName":"each","scriptId":"148","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Algolia_AlgoliaSearch/internals/algoliaBundle.min.js","lineNumber":1,"columnNumber":15750},{"functionName":"","scriptId":"44","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Algolia_AlgoliaSearch/autocomplete.js","lineNumber":108,"columnNumber":41},{"functionName":"u","scriptId":"148","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Algolia_AlgoliaSearch/internals/algoliaBundle.min.js","lineNumber":3,"columnNumber":9791},{"functionName":"fireWith","scriptId":"148","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Algolia_AlgoliaSearch/internals/algoliaBundle.min.js","lineNumber":3,"columnNumber":10560},{"functionName":"ready","scriptId":"148","url":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Algolia_AlgoliaSearch/internals/algoliaBundle.min.js","lineNumber":3,"columnNumber":12379}]}}]},"scoringMode":"binary","name":"uses-passive-event-listeners","description":"Does not use passive listeners to improve scrolling performance","helpText":"Consider marking your touch and wheel event listeners as `passive` to improve your page's scroll performance. [Learn more](https://developers.google.com/web/tools/lighthouse/audits/passive-event-listeners).","details":{"type":"table","header":"View Details","itemHeaders":[{"type":"text","itemType":"url","text":"URL"},{"type":"text","itemType":"text","text":"Location"}],"items":[[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/jquery.js"},{"type":"text","text":"line: 4931"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/jquery.js"},{"type":"text","text":"line: 4931"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/jquery.js"},{"type":"text","text":"line: 4931"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/jquery.js"},{"type":"text","text":"line: 4931"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/Algolia_AlgoliaSearch/internals/algoliaBundle.min.js"},{"type":"text","text":"line: 3"}]]}},"meta-description":{"score":true,"displayValue":"","rawValue":true,"scoringMode":"binary","name":"meta-description","description":"Document has a meta description","helpText":"Meta descriptions may be included in search results to concisely summarize page content. [Learn more](https://developers.google.com/web/tools/lighthouse/audits/description)."},"http-status-code":{"score":true,"displayValue":"","rawValue":true,"scoringMode":"binary","name":"http-status-code","description":"Page has successful HTTP status code","helpText":"Pages with unsuccessful HTTP status codes may not be indexed properly. [Learn more](https://developers.google.com/web/tools/lighthouse/audits/successful-http-code)."},"font-size":{"score":true,"displayValue":"","rawValue":true,"debugString":null,"scoringMode":"binary","name":"font-size","description":"Document uses legible font sizes","helpText":"Font sizes less than 12px are too small to be legible and require mobile visitors to “pinch to zoom” in order to read. Strive to have >60% of page text ≥12px. [Learn more](https://developers.google.com/web/fundamentals/design-and-ux/responsive/#optimize_text_for_reading).","details":{"type":"table","header":"View Details","itemHeaders":[{"type":"text","itemType":"url","text":"Source"},{"type":"text","itemType":"code","text":"Selector"},{"type":"text","itemType":"text","text":"% of Page Text"},{"type":"text","itemType":"text","text":"Font Size"}],"items":[[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/css/styles.min.css:1:419364"},{"type":"code","text":".darwin-sidebar-title .darwin-sidebar-close"},{"type":"text","text":"0.05%"},{"type":"text","text":"0px"}],[{"type":"url","text":"https://www.gro-store.com/static/version1524047115/frontend/Gene/gro/en_GB/css/styles.min.css:1:411796"},{"type":"code","text":".page-header .darwin-main-navigation .navigation .divider span"},{"type":"text","text":"0.02%"},{"type":"text","text":"0px"}],[{"type":"url","text":"Legible text"},{"type":"code","text":null},{"type":"text","text":"99.93%"},{"type":"text","text":"≥ 12px"}]]}},"link-text":{"score":true,"displayValue":"","rawValue":true,"scoringMode":"binary","name":"link-text","description":"Links have descriptive text","helpText":"Descriptive link text helps search engines understand your content. [Learn more](https://webmasters.googleblog.com/2008/10/importance-of-link-architecture.html).","details":{"type":"table","header":"View Details","itemHeaders":[{"type":"text","itemType":"url","text":"Link destination"},{"type":"text","itemType":"text","text":"Link Text"}],"items":[]}},"is-crawlable":{"score":true,"displayValue":"","rawValue":true,"scoringMode":"binary","name":"is-crawlable","description":"Page isn’t blocked from indexing","helpText":"Search engines are unable to include your pages in search results if they don't have permission to crawl them. [Learn more](https://developers.google.com/lighthouse/audits/indexing).","details":{"type":"table","header":"View Details","itemHeaders":[{"type":"text","itemType":"code","text":"Blocking Directive Source"}],"items":[]}},"hreflang":{"score":true,"displayValue":"","rawValue":true,"scoringMode":"binary","name":"hreflang","description":"Document has a valid `hreflang`","helpText":"hreflang allows crawlers to discover alternate translations of the page content. [Learn more](https://support.google.com/webmasters/answer/189077).","details":{"type":"table","header":"View Details","itemHeaders":[{"type":"text","itemType":"code","text":"Source"}],"items":[]}},"plugins":{"score":true,"displayValue":"","rawValue":true,"scoringMode":"binary","name":"plugins","description":"Document avoids plugins","helpText":"Most mobile devices do not support plugins, and many desktop browsers restrict them.","details":{"type":"table","header":"View Details","itemHeaders":[{"type":"text","itemType":"code","text":"Element source"}],"items":[]}},"canonical":{"score":true,"displayValue":"","rawValue":true,"scoringMode":"binary","informative":true,"notApplicable":true,"name":"canonical","description":"Document has a valid `rel=canonical`","helpText":"Canonical links suggest which URL to show in search results. [Learn more](https://developers.google.com/web/tools/lighthouse/audits/canonical)."},"mobile-friendly":{"score":false,"displayValue":"","rawValue":false,"scoringMode":"binary","informative":true,"manual":true,"name":"mobile-friendly","description":"Page is mobile friendly","helpText":"Take the [Mobile-Friendly Test](https://search.google.com/test/mobile-friendly) to check for audits not covered by Lighthouse, like sizing tap targets appropriately. [Learn more](https://developers.google.com/search/mobile-sites/)."},"structured-data":{"score":false,"displayValue":"","rawValue":false,"scoringMode":"binary","informative":true,"manual":true,"name":"structured-data","description":"Structured data is valid","helpText":"Run the [Structured Data Testing Tool](https://search.google.com/structured-data/testing-tool/) and the [Structured Data Linter](http://linter.structured-data.org/) to validate structured data. [Learn more](https://developers.google.com/search/docs/guides/mark-up-content)."}},"pa11y":[{"code":"WCAG2AA.Principle1.Guideline1_4.1_4_3.G18.Fail","context":"<span>SALE</span>","message":"This element has insufficient contrast at this conformance level. Expected a contrast ratio of at least 4.5:1, but text in this element has a contrast ratio of 3.91:1. Recommendation: change text colour to #555.","type":"error","typeCode":1,"selector":"html > body > div:nth-child(6) > div:nth-child(1) > header > div > div > div:nth-child(3) > nav > ul > li:nth-child(9) > a > span"},{"code":"WCAG2AA.Principle1.Guideline1_4.1_4_3.G18.Fail","context":"<span>Shop Now</span>","message":"This element has insufficient contrast at this conformance level. Expected a contrast ratio of at least 4.5:1, but text in this element has a contrast ratio of 3.91:1. Recommendation: change background to #555.","type":"error","typeCode":1,"selector":"#bluefoot-advanced-slider-15 > div > div > div > div > div > div:nth-child(2) > button > span > span"},{"code":"WCAG2AA.Principle1.Guideline1_4.1_4_3.G18.Fail","context":"<span>Shop Now</span>","message":"This element has insufficient contrast at this conformance level. Expected a contrast ratio of at least 4.5:1, but text in this element has a contrast ratio of 3.91:1. Recommendation: change background to #555.","type":"error","typeCode":1,"selector":"#bluefoot-hero-5 > div:nth-child(1) > a > span > span"},{"code":"WCAG2AA.Principle1.Guideline1_4.1_4_3.G18.Fail","context":"<span class=\"action primary\">Shop Now</span>","message":"This element has insufficient contrast at this conformance level. Expected a contrast ratio of at least 4.5:1, but text in this element has a contrast ratio of 3.91:1. Recommendation: change background to #555.","type":"error","typeCode":1,"selector":"#bluefoot-driver-1230 > a > span > span:nth-child(2) > span"},{"code":"WCAG2AA.Principle1.Guideline1_4.1_4_3.G18.Fail","context":"<span class=\"action primary\">Shop Now</span>","message":"This element has insufficient contrast at this conformance level. Expected a contrast ratio of at least 4.5:1, but text in this element has a contrast ratio of 3.91:1. Recommendation: change background to #555.","type":"error","typeCode":1,"selector":"#bluefoot-driver-1231 > a > span > span:nth-child(2) > span"},{"code":"WCAG2AA.Principle1.Guideline1_4.1_4_3.G18.Fail","context":"<span class=\"action primary\">Shop Now</span>","message":"This element has insufficient contrast at this conformance level. Expected a contrast ratio of at least 4.5:1, but text in this element has a contrast ratio of 3.91:1. Recommendation: change background to #555.","type":"error","typeCode":1,"selector":"#bluefoot-driver-1232 > a > span > span:nth-child(2) > span"},{"code":"WCAG2AA.Principle1.Guideline1_4.1_4_3.G18.Fail","context":"<span>Shop All</span>","message":"This element has insufficient contrast at this conformance level. Expected a contrast ratio of at least 4.5:1, but text in this element has a contrast ratio of 3.91:1. Recommendation: change background to #555.","type":"error","typeCode":1,"selector":"#advanced-product-list-6 > div:nth-child(2) > div > a > span > span"},{"code":"WCAG2AA.Principle1.Guideline1_4.1_4_3.G18.Fail","context":"<span class=\"price-label from\">From</span>","message":"This element has insufficient contrast at this conformance level. Expected a contrast ratio of at least 4.5:1, but text in this element has a contrast ratio of 3.11:1. Recommendation: change text colour to #767676.","type":"error","typeCode":1,"selector":"#advanced-product-list-6 > div:nth-child(3) > div:nth-child(1) > div > div > div:nth-child(4) > div > div:nth-child(1) > div > div:nth-child(2) > div > span:nth-child(1)"},{"code":"WCAG2AA.Principle1.Guideline1_4.1_4_3.G18.Fail","context":"<span class=\"price\">£34.99</span>","message":"This element has insufficient contrast at this conformance level. Expected a contrast ratio of at least 4.5:1, but text in this element has a contrast ratio of 3.11:1. Recommendation: change text colour to #767676.","type":"error","typeCode":1,"selector":"#product-price-532 > span"},{"code":"WCAG2AA.Principle1.Guideline1_4.1_4_3.G18.Fail","context":"<span>Buy <span class=\"mobile-hidden\"...</span>","message":"This element has insufficient contrast at this conformance level. Expected a contrast ratio of at least 4.5:1, but text in this element has a contrast ratio of 3.91:1. Recommendation: change background to #555.","type":"error","typeCode":1,"selector":"#advanced-product-list-6 > div:nth-child(3) > div:nth-child(1) > div > div > div:nth-child(4) > div > div:nth-child(2) > div > button > span"},{"code":"WCAG2AA.Principle1.Guideline1_4.1_4_3.G18.Fail","context":"<span class=\"mobile-hidden\">Now</span>","message":"This element has insufficient contrast at this conformance level. Expected a contrast ratio of at least 4.5:1, but text in this element has a contrast ratio of 3.91:1. Recommendation: change background to #555.","type":"error","typeCode":1,"selector":"#advanced-product-list-6 > div:nth-child(3) > div:nth-child(1) > div > div > div:nth-child(4) > div > div:nth-child(2) > div > button > span > span"},{"code":"WCAG2AA.Principle1.Guideline1_4.1_4_3.G18.Fail","context":"<span class=\"price-label from\">From</span>","message":"This element has insufficient contrast at this conformance level. Expected a contrast ratio of at least 4.5:1, but text in this element has a contrast ratio of 3.11:1. Recommendation: change text colour to #767676.","type":"error","typeCode":1,"selector":"#advanced-product-list-6 > div:nth-child(3) > div:nth-child(1) > div > div > div:nth-child(5) > div > div:nth-child(1) > div > div:nth-child(2) > div > span:nth-child(1)"},{"code":"WCAG2AA.Principle1.Guideline1_4.1_4_3.G18.Fail","context":"<span class=\"price\">£29.99</span>","message":"This element has insufficient contrast at this conformance level. Expected a contrast ratio of at least 4.5:1, but text in this element has a contrast ratio of 3.11:1. Recommendation: change text colour to #767676.","type":"error","typeCode":1,"selector":"#product-price-568 > span"},{"code":"WCAG2AA.Principle1.Guideline1_4.1_4_3.G18.Fail","context":"<span>Buy <span class=\"mobile-hidden\"...</span>","message":"This element has insufficient contrast at this conformance level. Expected a contrast ratio of at least 4.5:1, but text in this element has a contrast ratio of 3.91:1. Recommendation: change background to #555.","type":"error","typeCode":1,"selector":"#advanced-product-list-6 > div:nth-child(3) > div:nth-child(1) > div > div > div:nth-child(5) > div > div:nth-child(2) > div > button > span"},{"code":"WCAG2AA.Principle1.Guideline1_4.1_4_3.G18.Fail","context":"<span class=\"mobile-hidden\">Now</span>","message":"This element has insufficient contrast at this conformance level. Expected a contrast ratio of at least 4.5:1, but text in this element has a contrast ratio of 3.91:1. Recommendation: change background to #555.","type":"error","typeCode":1,"selector":"#advanced-product-list-6 > div:nth-child(3) > div:nth-child(1) > div > div > div:nth-child(5) > div > div:nth-child(2) > div > button > span > span"},{"code":"WCAG2AA.Principle1.Guideline1_4.1_4_3.G18.Fail","context":"<span class=\"price-label from\">From</span>","message":"This element has insufficient contrast at this conformance level. Expected a contrast ratio of at least 4.5:1, but text in this element has a contrast ratio of 3.11:1. Recommendation: change text colour to #767676.","type":"error","typeCode":1,"selector":"#advanced-product-list-6 > div:nth-child(3) > div:nth-child(1) > div > div > div:nth-child(6) > div > div:nth-child(1) > div > div:nth-child(2) > div > span:nth-child(1)"},{"code":"WCAG2AA.Principle1.Guideline1_4.1_4_3.G18.Fail","context":"<span class=\"price\">£29.99</span>","message":"This element has insufficient contrast at this conformance level. Expected a contrast ratio of at least 4.5:1, but text in this element has a contrast ratio of 3.11:1. Recommendation: change text colour to #767676.","type":"error","typeCode":1,"selector":"#product-price-572 > span"},{"code":"WCAG2AA.Principle1.Guideline1_4.1_4_3.G18.Fail","context":"<span>Buy <span class=\"mobile-hidden\"...</span>","message":"This element has insufficient contrast at this conformance level. Expected a contrast ratio of at least 4.5:1, but text in this element has a contrast ratio of 3.91:1. Recommendation: change background to #555.","type":"error","typeCode":1,"selector":"#advanced-product-list-6 > div:nth-child(3) > div:nth-child(1) > div > div > div:nth-child(6) > div > div:nth-child(2) > div > button > span"},{"code":"WCAG2AA.Principle1.Guideline1_4.1_4_3.G18.Fail","context":"<span class=\"mobile-hidden\">Now</span>","message":"This element has insufficient contrast at this conformance level. Expected a contrast ratio of at least 4.5:1, but text in this element has a contrast ratio of 3.91:1. Recommendation: change background to #555.","type":"error","typeCode":1,"selector":"#advanced-product-list-6 > div:nth-child(3) > div:nth-child(1) > div > div > div:nth-child(6) > div > div:nth-child(2) > div > button > span > span"},{"code":"WCAG2AA.Principle3.Guideline3_2.3_2_2.H32.2","context":"<form action=\"https://www.gro-store.com/checkout/cart/add/uenc/aHR0cHM6Ly93d3cuZ3JvLXN0b3JlLmNvbS8%2C/\" method=\"post\" id=\"nosto_addtocart_form\">\n    <input name=\"form_key\" typ...</form>","message":"This form does not contain a submit button, which creates issues for those who cannot submit the form using the keyboard. Submit buttons are INPUT elements with type attribute \"submit\" or \"image\", or BUTTON elements with type \"submit\" or omitted/invalid.","type":"error","typeCode":1,"selector":"#nosto_addtocart_form"},{"code":"WCAG2AA.Principle1.Guideline1_4.1_4_3.G18.Fail","context":"<span class=\"nosto-newprice price\">£23.50</span>","message":"This element has insufficient contrast at this conformance level. Expected a contrast ratio of at least 4.5:1, but text in this element has a contrast ratio of 3.11:1. Recommendation: change text colour to #767676.","type":"error","typeCode":1,"selector":"#frontpage-nosto-1 > div > div > div > div > div > div:nth-child(1) > div > div:nth-child(2) > div:nth-child(2) > span"},{"code":"WCAG2AA.Principle1.Guideline1_4.1_4_3.G18.Fail","context":"<span>Buy <span class=\"mobile-hidden\"...</span>","message":"This element has insufficient contrast at this conformance level. Expected a contrast ratio of at least 4.5:1, but text in this element has a contrast ratio of 3.91:1. Recommendation: change background to #555.","type":"error","typeCode":1,"selector":"#frontpage-nosto-1 > div > div > div > div > div > div:nth-child(1) > div > div:nth-child(3) > a > span"},{"code":"WCAG2AA.Principle1.Guideline1_4.1_4_3.G18.Fail","context":"<span class=\"mobile-hidden\">Now</span>","message":"This element has insufficient contrast at this conformance level. Expected a contrast ratio of at least 4.5:1, but text in this element has a contrast ratio of 3.91:1. Recommendation: change background to #555.","type":"error","typeCode":1,"selector":"#frontpage-nosto-1 > div > div > div > div > div > div:nth-child(1) > div > div:nth-child(3) > a > span > span"},{"code":"WCAG2AA.Principle1.Guideline1_4.1_4_3.G18.Fail","context":"<span class=\"old-price\">\n                              ...</span>","message":"This element has insufficient contrast at this conformance level. Expected a contrast ratio of at least 4.5:1, but text in this element has a contrast ratio of 3.11:1. Recommendation: change text colour to #767676.","type":"error","typeCode":1,"selector":"#frontpage-nosto-1 > div > div > div > div > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(2) > span:nth-child(1)"},{"code":"WCAG2AA.Principle1.Guideline1_4.1_4_3.G18.Fail","context":"<span class=\"special-price\">\n                              ...</span>","message":"This element has insufficient contrast at this conformance level. Expected a contrast ratio of at least 4.5:1, but text in this element has a contrast ratio of 3.25:1. Recommendation: change text colour to #c05551.","type":"error","typeCode":1,"selector":"#frontpage-nosto-1 > div > div > div > div > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(2) > span:nth-child(2)"},{"code":"WCAG2AA.Principle1.Guideline1_4.1_4_3.G18.Fail","context":"<span>Buy <span class=\"mobile-hidden\"...</span>","message":"This element has insufficient contrast at this conformance level. Expected a contrast ratio of at least 4.5:1, but text in this element has a contrast ratio of 3.91:1. Recommendation: change background to #555.","type":"error","typeCode":1,"selector":"#frontpage-nosto-1 > div > div > div > div > div > div:nth-child(2) > div > div:nth-child(3) > a > span"},{"code":"WCAG2AA.Principle1.Guideline1_4.1_4_3.G18.Fail","context":"<span class=\"mobile-hidden\">Now</span>","message":"This element has insufficient contrast at this conformance level. Expected a contrast ratio of at least 4.5:1, but text in this element has a contrast ratio of 3.91:1. Recommendation: change background to #555.","type":"error","typeCode":1,"selector":"#frontpage-nosto-1 > div > div > div > div > div > div:nth-child(2) > div > div:nth-child(3) > a > span > span"},{"code":"WCAG2AA.Principle1.Guideline1_4.1_4_3.G18.Fail","context":"<span class=\"old-price\">\n                              ...</span>","message":"This element has insufficient contrast at this conformance level. Expected a contrast ratio of at least 4.5:1, but text in this element has a contrast ratio of 3.11:1. Recommendation: change text colour to #767676.","type":"error","typeCode":1,"selector":"#frontpage-nosto-1 > div > div > div > div > div > div:nth-child(3) > div > div:nth-child(2) > div:nth-child(2) > span:nth-child(1)"},{"code":"WCAG2AA.Principle1.Guideline1_4.1_4_3.G18.Fail","context":"<span class=\"special-price\">\n                              ...</span>","message":"This element has insufficient contrast at this conformance level. Expected a contrast ratio of at least 4.5:1, but text in this element has a contrast ratio of 3.25:1. Recommendation: change text colour to #c05551.","type":"error","typeCode":1,"selector":"#frontpage-nosto-1 > div > div > div > div > div > div:nth-child(3) > div > div:nth-child(2) > div:nth-child(2) > span:nth-child(2)"},{"code":"WCAG2AA.Principle1.Guideline1_4.1_4_3.G18.Fail","context":"<span>Buy <span class=\"mobile-hidden\"...</span>","message":"This element has insufficient contrast at this conformance level. Expected a contrast ratio of at least 4.5:1, but text in this element has a contrast ratio of 3.91:1. Recommendation: change background to #555.","type":"error","typeCode":1,"selector":"#frontpage-nosto-1 > div > div > div > div > div > div:nth-child(3) > div > div:nth-child(3) > a > span"},{"code":"WCAG2AA.Principle1.Guideline1_4.1_4_3.G18.Fail","context":"<span class=\"mobile-hidden\">Now</span>","message":"This element has insufficient contrast at this conformance level. Expected a contrast ratio of at least 4.5:1, but text in this element has a contrast ratio of 3.91:1. Recommendation: change background to #555.","type":"error","typeCode":1,"selector":"#frontpage-nosto-1 > div > div > div > div > div > div:nth-child(3) > div > div:nth-child(3) > a > span > span"},{"code":"WCAG2AA.Principle2.Guideline2_4.2_4_1.H64.1","context":"<iframe src=\"javascript:false\" style=\"width: 0px; height: 0px; border: 0px; display: none;\"></iframe>","message":"Iframe element requires a non-empty title attribute that identifies the frame.","type":"error","typeCode":1,"selector":"html > body > iframe"},{"code":"WCAG2AA.Principle4.Guideline4_1.4_1_2.H91.InputText.Name","context":"<input class=\"NostoInputText\" type=\"text\" id=\"nostoAddress\" placeholder=\"your@email.com\">","message":"This text input element does not have a name available to an accessibility API. Valid names are: label element, title attribute, aria-label attribute, aria-labelledby attribute.","type":"error","typeCode":1,"selector":"#nostoAddress"},{"code":"WCAG2AA.Principle1.Guideline1_3.1_3_1.F68","context":"<input class=\"NostoInputText\" type=\"text\" id=\"nostoAddress\" placeholder=\"your@email.com\">","message":"This form field should be labelled in some way. Use the label element (either with a \"for\" attribute or wrapped around the form field), or \"title\", \"aria-label\" or \"aria-labelledby\" attributes as appropriate.","type":"error","typeCode":1,"selector":"#nostoAddress"},{"code":"WCAG2AA.Principle1.Guideline1_4.1_4_3.G18.Fail","context":"<button type=\"button\" class=\"NostoInputButton disabled\" id=\"nostoOverlaySend\">Show Me My Code!</button>","message":"This element has insufficient contrast at this conformance level. Expected a contrast ratio of at least 4.5:1, but text in this element has a contrast ratio of 3.59:1. Recommendation: change background to #030303.","type":"error","typeCode":1,"selector":"#nostoOverlaySend"}]}]}

/***/ })
/******/ ]);
//# sourceMappingURL=app.js.map