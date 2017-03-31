var gulp         = require('gulp');
var gulpSequence = require('gulp-sequence');

gulp.task('build:production', function(cb) {
  gulpSequence('clean', ['fonts', 'images', 'videos'], 'jade', ['stylus', 'webpack:production'], 'rev', 'vendor-js', cb);
});
