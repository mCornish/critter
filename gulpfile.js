'use strict';

var gulp = require('gulp'),
// TODO maybe figure out gulp-watch with browserify — whatever
    watch = require('gulp-watch'),
    browserSync = require('browser-sync').create(),
    sass = require('gulp-sass'),
    browserify = require('gulp-browserify'),
    rename = require('gulp-rename'),
    qunit = require('gulp-qunit'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    concatCss = require('gulp-concat-css'),
    minifyCss = require('gulp-minify-css'),
    replace = require('gulp-replace'),
    minifyHtml = require('gulp-minify-html'),
    imagemin = require('gulp-imagemin');

var debug = true;

// Static server + watching scss/html
gulp.task('serve', ['sass'], function() {
    browserSync.init({
        server: '.'
    }) ;

    gulp.watch('./js/*.js', ['browserify']).on('change', browserSync.reload);
    gulp.watch('./styles/scss/*.scss', ['sass']);
    gulp.watch('./index.html').on('change', browserSync.reload);
});

// compile sass into css & auto-inject into browsers
gulp.task('sass', function() {
    gulp.src('./styles/scss/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(rename('main.css'))
        .pipe(gulp.dest('./styles/css'))
        .pipe(browserSync.stream());
});

gulp.task('uglify', function() {
    return gulp.src('./js/*.js')
        .pipe(concat('scripts.js'))
        .pipe(uglify())
        .pipe(rename('scripts.min.js'))
        .pipe(gulp.dest('./dist'));
});

gulp.task('minify-css', ['sass'], function() {
    return gulp.src('./styles/css/*.css')
        .pipe(concatCss('tmp/bundle.css'))
        .pipe(minifyCss())
        .pipe(rename('main.min.css'))
        .pipe(gulp.dest('./dist'));
});

gulp.task('minify-html', function() {
    return gulp.src('./index.html')
        .pipe(replace('styles/css/main.css', 'main.min.css'))
        .pipe(replace('<link rel="stylesheet" href="styles/css/bootstrap.min.css">', ''))
        .pipe(replace('js/html5-youtube.min.js', ''))
        .pipe(replace('js/scripts.js', 'scripts.min.js'))
        .pipe(minifyHtml({conditionals: true}))  // Prevents removing conditional IE comments
        .pipe(gulp.dest('./dist'));
});

gulp.task('compress-images', function () {
    return gulp.src('./images/*')
        .pipe(imagemin({
            progressive: true
        }))
        .pipe(gulp.dest('./dist/images'));
});

gulp.task('browserify', function() {
    return gulp.src(['./index.html'])
        .pipe(browserify({
            insertGlobals: true,
            debug: debug
        }));
});

gulp.task('default', ['browserify', 'serve']);

gulp.task('build', ['minify-css', 'minify-html', 'compress-images', 'uglify']);