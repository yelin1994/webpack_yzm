var loaderUtils = require('loader-utils')
module.exports = function(content) {
  if(this.cacheable) { // 缓存
    this.cacheable()
  }
  var options = loaderUtils.getOptions(this) || {}
  var useStrictPrefix = '\'use strict\';\n\n'
  return useStrictPrefix + content;
}