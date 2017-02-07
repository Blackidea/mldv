var config = require('./');

module.exports = {
  watch: config.sourceDirectory + '/jade/**/*.jade',
  src: config.sourceDirectory + '/jade/*.jade',
  dest: config.publicDirectory
};
