var config = {
  'development': {
    'database': 'mongodb://localhost:27017/directpay',
    'port': '3000',
    'host': 'http://0.0.0.0',
    'secret': 'B7syiTVp15hE9yvIUd8560sf0aQzM8qjTKPphTqX3JrQxV9ivtndyU5ZKY1P4Jfm',
    'dropboxKey': 'i_dx6w9mm_YAAAAAAAABRTnjkpZNmfhGoRtYeqx_kFvMQZqW_ZJFh5WeTXNKyQLu'
  },
  'production': {
    'database': 'mongodb://admin:123456@ds155934.mlab.com:55934/directpay',
    'port': '80',
    'host': 'http://0.0.0.0',
    'secret': 'B7syiTVp15hE9yvIUd8560sf0aQzM8qjTKPphTqX3JrQxV9ivtndyU5ZKY1P4Jfm',
    'dropboxKey': 'i_dx6w9mm_YAAAAAAAABRTnjkpZNmfhGoRtYeqx_kFvMQZqW_ZJFh5WeTXNKyQLu'
  }
}
exports.get = function(env) {
  return config[env] || config.development;
}
