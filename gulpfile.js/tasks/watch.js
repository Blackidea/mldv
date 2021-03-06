var gulp      = require('gulp');
var jade      = require('../config/jade');
var images    = require('../config/images');
var stylus    = require('../config/stylus');
var fonts     = require('../config/fonts');
var videos    = require('../config/videos');
var watch     = require('gulp-watch');

gulp.task('watch', ['browserSync'], function() {
  watch(images.src, function() { gulp.start('images'); });
  watch(stylus.src, function() { gulp.start('stylus'); });
  watch(fonts.src, function() { gulp.start('fonts'); });
  watch(videos.src, function() { gulp.start('videos'); });
  watch(jade.watch, function() { gulp.start('jade'); });
});
