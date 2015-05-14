"use strict";

var gulp = require('gulp'),
    stylus = require('gulp-stylus'),
    nib = require('nib'),
    connect = require('gulp-connect'),
    directoryMap = require("gulp-directory-map"),
    runSequence = require('run-sequence'),
    clean = require('gulp-clean'),
    shell = require('gulp-shell'),
    gutil = require('gulp-util');


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
    gulp.watch(['./app**/*.html', 'library/**/*.html'], ['html']);
    gulp.watch(['./app/patterns/**/*.html'], ['tree']);
    gulp.watch(['./app/**/*.js', './patterns/**/*.js'], ['js']);
    gulp.watch(['./app/patterns/**/*.json'], ['json']);
    gulp.watch(['./library/js/**/*.js'], ['library-js']);
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

gulp.task('mkdirs', shell.task([
  'mkdir ./dist && mkdir ./dist/js'
]));

gulp.task('js', function () {
  var browserify = require('browserify');
  var source = require('vinyl-source-stream');
  var buffer = require('vinyl-buffer');
  var globby = require('globby');
  var through = require('through2');
  var uglify = require('gulp-uglify');
  var sourcemaps = require('gulp-sourcemaps');
  var reactify = require('reactify');

  // gulp expects tasks to return a stream, so we create one here.
  var bundledStream = through();

  bundledStream
    // turns the output bundle stream into a stream containing
    // the normal attributes gulp plugins expect.
    .pipe(source('main.js'))
    // the rest of the gulp task, as you would normally write it.
    // here we're copying from the Browserify + Uglify2 recipe.
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
      // Add gulp plugins to the pipeline here.

      // Minify Output
      // .pipe(uglify())
      .on('error', gutil.log)
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/js/'))
    .pipe(connect.reload());

  // "globby" replaces the normal "gulp.src" as Browserify
  // creates it's own readable stream.
  globby(['./app/**/*.js'], function(err, entries) {
    // ensure any errors from globby are handled
    if (err) {
      bundledStream.emit('error', err);
      return;
    }

    // create the Browserify instance.
    var b = browserify({
      entries: entries,
      debug: true,
      transform: [reactify]
    });

    // pipe the Browserify stream into the stream we created earlier
    // this starts our gulp pipeline.
    b.bundle().pipe(bundledStream);
  });

  // finally, we return the stream, so gulp knows when this task is done.
  return bundledStream;
});

gulp.task('library-js', function () {
  var browserify = require('browserify');
  var source = require('vinyl-source-stream');
  var buffer = require('vinyl-buffer');
  var globby = require('globby');
  var through = require('through2');
  var uglify = require('gulp-uglify');
  var sourcemaps = require('gulp-sourcemaps');
  var reactify = require('reactify');

  // gulp expects tasks to return a stream, so we create one here.
  var bundledStream = through();

  bundledStream
    // turns the output bundle stream into a stream containing
    // the normal attributes gulp plugins expect.
    .pipe(source('library.js'))
    // the rest of the gulp task, as you would normally write it.
    // here we're copying from the Browserify + Uglify2 recipe.
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
      // Add gulp plugins to the pipeline here.

    // Minify Output
    // .pipe(uglify())
    .on('error', gutil.log)
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/library/js/'))
    .pipe(connect.reload());

  // "globby" replaces the normal "gulp.src" as Browserify
  // creates it's own readable stream.
  globby([
      './library/js/library.js'
    ], function(err, entries) {
    // ensure any errors from globby are handled
    if (err) {
      bundledStream.emit('error', err);
      return;
    }

    // create the Browserify instance.
    var b = browserify({
      entries: entries,
      debug: true,
      transform: [reactify]
    });

    // pipe the Browserify stream into the stream we created earlier
    // this starts our gulp pipeline.
    b.bundle().pipe(bundledStream);
  });

  // finally, we return the stream, so gulp knows when this task is done.
  return bundledStream;
});


gulp.task('json', function () {
    gulp.src(['app/patterns/**/*.json'])
    .pipe(gulp.dest('dist/patterns'));
});

gulp.task('default', function(callback) {
    runSequence(
        ['clean'],
        ['mkdirs'],
        'html',
        'stylus',
        ['js'],
        ['library-js'],
        'json',
        ['tree', 'connect', 'watch'],
        callback);
});


// Handle the error
function errorHandler (error) {
  console.log(error.toString());
  this.emit('end');
}
