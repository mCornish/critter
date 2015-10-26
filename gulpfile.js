'use strict';

var gulp = require('gulp'),
// TODO maybe figure out gulp-watch with browserify — whatever
    watch = require('gulp-watch'),
    browserSync = require('browser-sync').create(),
    sass = require('gulp-sass'),
    browserify = require('gulp-browserify'),
    rename = require('gulp-rename'),
    qunit = require('gulp-qunit'),
    uglify = require('gulp-uglify'),
    minifyCss = require('gulp-minify-css');

var debug = true;

// Static server + watching scss/html
gulp.task('serve', ['sass'], function() {
    browserSync.init({
        server: '.'
    }) ;

    gulp.watch('./js/*.js', ['browserify']).on('change', browserSync.reload);
    gulp.watch('.styles/sass/*.scss', ['sass']);
    gulp.watch('./index.html').on('change', browserSync.reload);
});

// compile sass into css & auto-inject into browsers
gulp.task('sass', function() {
    gulp.src('./styles/sass/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./styles/css'))
        .pipe(browserSync.stream());
});

gulp.task('uglify', function() {
    return gulp.src('./js/app.js')
        .pipe(uglify())
        .pipe(rename('app.min.js'))
        .pipe(gulp.dest('./public/js'));
});

gulp.task('minify-css', function() {
    return gulp.src('./styles/css/main.css')
        .pipe(minifyCss())
        .pipe(rename('main.min.css'))
        .pipe(gulp.dest('./styles/css'));
});

gulp.task('browserify', function() {
    return gulp.src(['./index.html'])
        .pipe(browserify({
            insertGlobals: true,
            debug: debug
        }));
});

gulp.task('default', ['browserify', 'serve']);

gulp.task('build', ['sass', 'minify-css', 'test', 'browserify', 'uglify']);