var webpackConfig = require('./webpack.test.js');

module.exports = function (config) {
  var _config = {
    basePath: '',

    frameworks: ['jasmine'],

	exclude: [
		'typings/globals'
	],

    files: [
      {pattern: './config/karma-test-shim.js', watched: false}
    ],

    preprocessors: {
      './config/karma-test-shim.js': ['coverage', 'webpack', 'sourcemap']
    },

    webpack: webpackConfig,

    coverageReporter: {
	      dir : 'coverage/',
	      reporters: [
		          { type: 'text-summary' },
		          { type: 'json' },
		          { type: 'html' }
		        ]
	},

    webpackMiddleware: {
      stats: 'errors-only'
    },

    webpackServer: {
      noInfo: true
    },

    reporters: ['kjhtml','progress', 'mocha', 'coverage'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ['Chrome'],
	customLaunchers: {
		ChromeTravisCi: {
			base: 'Chrome',
			flags: ['--no-sandbox']
		}
	},
    singleRun: true
  };

  config.set(_config);
};
