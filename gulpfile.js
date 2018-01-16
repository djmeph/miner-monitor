/* file: gulpfile.js */

var gulp   = require('gulp');
var less = require('gulp-less');
var sourcemaps = require('gulp-sourcemaps');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

gulp.task('less', function () {
  return gulp.src('less/app.less')
    .pipe(gutil.env.type === 'production' ? gutil.noop() : sourcemaps.init())
    .pipe(gutil.env.type === 'production' ? less({ compress: true }) : less())
    .pipe(gutil.env.type === 'production' ? gutil.noop() : sourcemaps.write())
    .pipe(gulp.dest('www'));
});

if (gutil.env.type !== 'production') gulp.watch('less/**/*.less', ['less']);

gulp.task('js', function() {
  return gulp.src('js/**/*.js')
    .pipe(gutil.env.type === 'production' ? gutil.noop() : sourcemaps.init())
    .pipe(concat('app.js'))
    .pipe(gutil.env.type === 'production' ? uglify() : gutil.noop())
    .pipe(gutil.env.type === 'production' ? gutil.noop() : sourcemaps.write())
    .pipe(gulp.dest('www'));
});

if (gutil.env.type !== 'production') gulp.watch('js/**/*.js', ['js']);

gulp.task('default', ['less', 'js']);
