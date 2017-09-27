var config = {
  'development': {
    'database': 'mongodb://localhost:27017/waashgreendev',
    'port': '3000',
    'host': 'http://0.0.0.0',
    'secret': 'B7syiTVp15hE9yvIUd8560sf0aQzM8qjTKPphTqX3JrQxV9ivtndyU5ZKY1P4Jfm',
    'dropboxKey':'i_dx6w9mm_YAAAAAAAABRTnjkpZNmfhGoRtYeqx_kFvMQZqW_ZJFh5WeTXNKyQLu'
  },
  'production': {
    'database': 'mongodb://admin:prueba$1@ds153652.mlab.com:53652/waashgreen',
    'port': '80',
    'host': 'http://0.0.0.0',
    'secret': 'B7syiTVp15hE9yvIUd8560sf0aQzM8qjTKPphTqX3JrQxV9ivtndyU5ZKY1P4Jfm',
    'dropboxKey':'i_dx6w9mm_YAAAAAAAABRTnjkpZNmfhGoRtYeqx_kFvMQZqW_ZJFh5WeTXNKyQLu'
  }
}
exports.get = function(env) {
  return config[env] || config.development;
}
