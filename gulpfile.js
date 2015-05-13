"use strict";

var gulp = require('gulp'),
    stylus = require('gulp-stylus'),
    nib = require('nib'),
    connect = require('gulp-connect'),
    directoryMap = require("gulp-directory-map"),
    runSequence = require('run-sequence'),
    clean = require('gulp-clean');


gulp.task('stylus', function () {
    gulp.src(['./app/styl/*.styl', '!styl/**/_*'])
        .pipe(stylus({use: [nib()]}))
        .pipe(gulp.dest('./dist/css'))
        .pipe(connect.reload());

    gulp.src(['./library/styl/*.styl', '!styl/**/_*'])
        .pipe(stylus({use: [nib()]}))
        .pipe(gulp.dest('./dist/library/css'))
        .pipe(connect.reload());
});

gulp.task('html', function () {
    gulp.src('app/**/*.html')
        .pipe(gulp.dest('dist'))
        .pipe(connect.reload());

    gulp.src('library/**/*.html')
        .pipe(gulp.dest('dist/library'))
        .pipe(connect.reload());

});

gulp.task('watch', function () {
    gulp.watch(['styl/**/*.styl', './library/styl/*.styl'], ['stylus']);
    gulp.watch(['./**/*.html'], ['html']);
    gulp.watch(['./app/patterns/**/*.html'], ['tree']);
    gulp.watch(['./app/**/*.js', './patterns/**/*.js'], ['js']);
    gulp.watch(['./app/patterns/**/*.json'], ['json']);
});

gulp.task('clean', function () {
    return gulp.src('dist', {read: false})
        .pipe(clean());
});

gulp.task('tree', function () {
    gulp.src('app/patterns/**/*.html')
      .pipe(directoryMap({
        filename: 'tree.json'
      }))
      .pipe(gulp.dest('dist/library/data'));
});

gulp.task('connect', function() {
    connect.server({
        root: ['./dist', './bower_components'],
        livereload: true
    });
});

gulp.task('js', function () {
    gulp.src(['app/**/*.js'])
    .pipe(gulp.dest('dist'));
});

gulp.task('json', function () {
    gulp.src(['app/patterns/**/*.json'])
    .pipe(gulp.dest('dist/patterns'));
});

gulp.task('default', function(callback) {
    runSequence(
        ['clean'],
        'html',
        'stylus',
        'js',
        'json',
        ['tree', 'connect', 'watch'],
        callback);
});


// Handle the error
function errorHandler (error) {
  console.log(error.toString());
  this.emit('end');
}
