var browserSync  = require('browser-sync');
var config       = require('../config/jade');
var gulp         = require('gulp');
var jade         = require('gulp-jade');
var handleErrors = require('../lib/handleErrors');

gulp.task('jade', function() {
  return gulp.src(config.src)
    .pipe(jade({
            pretty: true
        }))
    .on('error', handleErrors)
    .pipe(gulp.dest(config.dest))
    .pipe(browserSync.reload({
      stream: true
    }));
});
