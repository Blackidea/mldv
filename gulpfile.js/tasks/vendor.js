var gulp         = require('gulp');
var browserSync  = require('browser-sync');
var config       = require('../config/vendor');

gulp.task('vendor-js', function() {
  return gulp.src(config.jsSrc)
    .pipe(gulp.dest(config.jsDest))
    .pipe(browserSync.reload({stream:true}));
});
