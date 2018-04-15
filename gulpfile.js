'use strict';

const gulp = require('gulp'),
    browserSync = require('browser-sync'),
    nodemon = require('gulp-nodemon'),
    gutil = require('gulp-util'),
    sass = require('gulp-sass'),
    cssnano = require('gulp-cssnano'),
    plumber = require('gulp-plumber'),
    rename = require('gulp-rename'),
    autoprefixer = require('gulp-autoprefixer'),
    sourcemaps = require('gulp-sourcemaps'),
    webpack = require('webpack-stream');


gulp.task('styles', function() {
    return gulp.src(['./src/scss/styles.scss'])
        .pipe(plumber(function(error) {
            gutil.log(gutil.colors.red(error.message));
            this.emit('end');
        }))
        .pipe(sourcemaps.init()) // Start Sourcemaps
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['last 5 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('./public/stylesheets/'))
        .pipe(rename({suffix: '.min'}))
        .pipe(cssnano())
        .pipe(sourcemaps.write('.')) // Creates sourcemaps for minified styles
        .pipe(gulp.dest('./public/stylesheets/'))
});

gulp.task('beagle-js', function() {
    return gulp.src([
        './node_modules/chart.js/dist/chart.js',
        './src/js/app.js'
    ])
        .pipe(webpack( require('./webpack.config.js') ))
        .pipe(gulp.dest('./public/js/'));
});

gulp.task('build', ['styles', 'beagle-js'], function () {

});

gulp.task('default', ['styles', 'beagle-js', 'browser-sync'], function () {

});

gulp.task('browser-sync', ['nodemon'], function() {
    browserSync.init(null, {
        proxy: "http://localhost:5000",
        files: ["public/**/*.*", "views/**/*.ejs"],
        browser: "google chrome",
        port: 7000,
    });

    gulp.watch(['./src/scss/**/*.scss', './src/js/*.js'], ['styles', 'beagle-js']);
});

gulp.task('nodemon', function (cb) {

    let started = false;

    return nodemon({
        script: 'index.js'
    }).on('start', function () {
        // to avoid nodemon being started multiple times
        // thanks @matthisk
        if (!started) {
            cb();
            started = true;
        }
    });
});