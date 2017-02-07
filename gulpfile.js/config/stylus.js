var config = require('./')

module.exports = {
  autoprefixer: { browsers: ['> 1%', 'last 2 versions', 'ff > 20', 'iOS 6', 'Android 4', 'ie > 8', 'Opera 12.1'], cascade: false },
  src: config.sourceAssets + "/stylesheets/**/*.styl",
  dest: config.publicAssets + '/css'
}
