var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'dist');
var APP_DIR = path.resolve(__dirname, 'src');

var config = {
  entry: ['babel-polyfill', APP_DIR + '/reactions.js'],
  resolve: {
    alias: {
        'sinon': 'sinon/pkg/sinon'
    },
    root: [
      path.resolve(__dirname, './src/app')
    ],
    extensions: ['', '.js', '.json', '.jsx']
  },
  externals: {
    'cheerio': 'window',
  },
  output: {
    path: BUILD_DIR+'/',
    filename: 'bundle.js'
  },
  module : {
    noParse: [
        /node_modules\/sinon\//,
    ],
    loaders : [
      {
        test : /\.jsx?/,
        include : APP_DIR,
        loader : 'babel-loader'
      }
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false
        }
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ]
};

module.exports = config;
