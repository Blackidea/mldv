var path            = require('path');
var paths           = require('./');
var webpack         = require('webpack');
var webpackManifest = require('../lib/webpackManifest');

module.exports = function(env) {
  var jsSrc = path.resolve(paths.sourceAssets + '/javascripts/');
  var jsDest = paths.publicAssets + '/javascripts/';
  var publicPath = 'javascripts/';

  var webpackConfig = {
    context: jsSrc,

    // externals: {
    //   "jquery": "jQuery"
    // },

    plugins: [
      new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /ru|en-gb/),
      new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery"
      }),
    ],

    resolve: {
      alias: {
        // "alertify": "alertify/src/alertify"
      },
      extensions: ['', '.js']
    },

    module: {
      preLoaders: [{
        test:    /\.js$/,
        exclude: [/node_modules/, /bower_components/],
        loader: 'jscs-loader'
      }],
      loaders: [
        {
          test: /\.js$/,
          loader: 'babel-loader?optional[]=runtime&stage=1',
          exclude: [/node_modules/, /bower_components/]
        },
        // {
        //   test: /jquery\/src\/selector\.js$/,
        //   loader: 'amd-define-factory-patcher-loader'
        // }
      ],
      postLoaders: [
        {
          test: /\.js$/,
          exclude: [/node_modules/, /bower_components/], // do not lint third-party code
          loader: 'jshint-loader'
        }
      ]
    }
  };

  if(env !== 'test') {
    // Karma doesn't need entry points or output settings
    webpackConfig.entry= "./main.js";

    webpackConfig.output= {
      path: jsDest,
      filename: env === 'production' ? '[name]-[hash].js' : '[name].js',
      publicPath: publicPath,
      library: "[name]"
    };

    // создаем файл с общими модулями + его же можно сдлеать entry point где подключать библиотечки...
    // Factor out common dependencies into a shared.js
    // webpackConfig.plugins.push(
    //   new webpack.optimize.CommonsChunkPlugin({
    //     name: 'main',
    //     filename: env === 'production' ? '[name]-[hash].js' : '[name].js',
    //     minChunks: 2 // если есть > 2 общих модуля, выносим в main...
    //   })
    // )
  }

  if(env === 'development') {
    webpackConfig.devtool = 'source-map';
    webpack.debug = true;
  }

  if(env === 'production') {
    webpackConfig.plugins.push(
      new webpackManifest(publicPath, 'public'),
      new webpack.DefinePlugin({
        'process.env': {
          'NODE_ENV': JSON.stringify('production')
        }
      }),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings:     false,
          drop_console: true,
          unsafe:       true
        }
      }),
      new webpack.NoErrorsPlugin()
    );
  }

  return webpackConfig;
};
