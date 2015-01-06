var gulp = require('gulp'),
    stylus = require('gulp-stylus'),
    nib = require('nib'),
    sourcemaps = require('gulp-sourcemaps'),
    watch = require('gulp-watch'),
    connect = require('gulp-connect'),
    directoryMap = require("gulp-directory-map");


gulp.task('stylus', function () {
  gulp.src('./styl/main.styl')
    .pipe(stylus({use: [nib()]}))
    .pipe(gulp.dest('./css'))
    .pipe(connect.reload());
});

gulp.task('html', function () {
    gulp.src('**/*.html')
      .pipe(connect.reload());
});

gulp.task('watch', function () {
    gulp.watch(['styl/**/*.styl'], ['stylus']);
    gulp.watch(['./**/*.html'], ['html']);
    gulp.watch(['./patterns/**/*.html'], ['tree']);
});

gulp.task('tree', function () {
    gulp.src('patterns/**/*.html')
      .pipe(directoryMap({
        filename: 'tree.json'
      }))
      .pipe(gulp.dest('patternz/data'));
});

gulp.task('connect', function() {
    connect.server({
        root: [__dirname],
        livereload: true
    });
});


gulp.task('default', [
    'stylus',
    'tree',
    'connect',
    'watch'
]);