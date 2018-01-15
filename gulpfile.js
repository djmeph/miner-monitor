/* file: gulpfile.js */

var gulp   = require('gulp');
var less = require('gulp-less');
var sourcemaps = require('gulp-sourcemaps');
var gutil = require('gulp-util');

gulp.task('less', function () {
  return gulp.src('less/app.less')
    .pipe(sourcemaps.init())
    .pipe(gutil.env.type === 'production' ? less({ compress: true }) : less())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('www'));
});

if (gutil.env.type !== 'production') gulp.watch('less/**/*.less', ['less']);

gulp.task('default', ['less']);
