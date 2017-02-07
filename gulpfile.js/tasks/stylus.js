var gulp         = require('gulp');
var browserSync  = require('browser-sync');
var stylus       = require('gulp-stylus');
var jeet         = require('jeet');
var nib         = require('nib');
var rupture      = require('rupture');
var sourcemaps   = require('gulp-sourcemaps');
var handleErrors = require('../lib/handleErrors');
var config       = require('../config/stylus');
var autoprefixer = require('gulp-autoprefixer');

gulp.task('stylus', function() {
  return gulp.src(config.src)
    .pipe(sourcemaps.init())
    .pipe(stylus({
        url: 'eurl',
        'include css': true,
        use:[jeet(), rupture(), nib()],
      }))
    .on('error', handleErrors)
    .pipe(autoprefixer(config.autoprefixer))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(config.dest))
    .pipe(browserSync.reload({stream:true}));
});
