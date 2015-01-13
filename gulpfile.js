var gulp = require('gulp'),
    stylus = require('gulp-stylus'),
    nib = require('nib'),
    sourcemaps = require('gulp-sourcemaps'),
    watch = require('gulp-watch'),
    connect = require('gulp-connect'),
    directoryMap = require("gulp-directory-map"),
    data = require('gulp-data'),
    gutil = require('gulp-util'),
    map = require('vinyl-map'),
    rename = require("gulp-rename"),
    runSequence = require('run-sequence'),
    clean = require('gulp-clean');


gulp.task('stylus', function () {
    gulp.src(['./styl/*.styl', '!styl/**/_*'])
        .pipe(stylus({use: [nib()]}))
        .pipe(gulp.dest('./css'))
        .pipe(connect.reload());

    gulp.src(['./patternz/styl/*.styl', '!styl/**/_*'])
        .pipe(stylus({use: [nib()]}))
        .pipe(gulp.dest('./patternz/css'))
        .pipe(connect.reload());
});

gulp.task('html', function () {
    gulp.src('**/*.html')
      .pipe(connect.reload());
});

gulp.task('watch', function () {
    gulp.watch(['styl/**/*.styl', './patternz/styl/*.styl'], ['stylus']);
    gulp.watch(['./**/*.html'], ['html']);
    gulp.watch(['./tmp/patterns/**/*.html'], ['tree']);
    gulp.watch(['./patterns/**/*.md'], ['patternz']);
});

gulp.task('clean', function () {
    return gulp.src('tmp/patterns', {read: false})
        .pipe(clean());
});

gulp.task('tree', function () {
    gulp.src('tmp/patterns/**/*.html')
      .pipe(directoryMap({
        filename: 'tree.json'
      }))
      .pipe(gulp.dest('patternz/data'));
});

gulp.task('patternz', function () {
    var fname;
    var getMarkup = map(function(code, filename) {
        // file contents are handed
        // over as buffers
        fname = filename;

        code = code.toString();

        var arr = code.split('---');

        // Last item in array is the code
        // AKA anything after last "---"
        return arr[arr.length - 1].trim();

    });

    return gulp.src('patterns/**/*.md')
        .pipe(getMarkup)
        .pipe(rename(function (path) {
            path.extname = ".html";
        }))
        // .on('error', errorHandler)
        .pipe(gulp.dest("tmp/patterns"));

});

gulp.task('connect', function() {
    connect.server({
        root: [__dirname],
        livereload: true
    });
});

gulp.task('default', function(callback) {
    runSequence('clean',
        ['stylus', 'patternz'],
        ['tree', 'connect', 'watch'],
        callback);
});


// Handle the error
function errorHandler (error) {
  console.log(error.toString());
  this.emit('end');
}
