var config = require('./')

module.exports = {
  jsSrc: config.sourceDirectory + '/javascripts/vendor/**/*.js',
  jsDest: config.publicDirectory + '/javascripts/vendor/'
}
