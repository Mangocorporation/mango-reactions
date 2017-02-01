var webpack = require('webpack');
var path = require('path');

var config = {
  devtool: 'inline-source-map',
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
    'react/lib/ExecutionEnvironment': true,
    'react/lib/ReactContext': true,
    'react/addons': true
  },
  node: {
    fs: "empty"
  },
  // babel: {
  //   presets: ['es2015', 'react'],
  // },
  // isparta: {
  //   embedSource: true,
  //   noAutoWrap: true,
  //   // these babel options will be passed only to isparta and not to babel-loader
  //   babel: {
  //     presets: ['es2015', 'react']
  //   }
  // },
  module: {
    noParse: [
        /node_modules\/sinon\//,
    ],
  //   preLoaders: [
  //    {
  //      test: /\.jsx?$/,
  //      exclude: [
  //        /node_modules/,
  //        /test/
  //      ],
  //      loader: 'babel-loader'
  //    },
  //  ],
    loaders: [
      {
        exclude: /node_modules/,
        test: /\.jsx?$/,
        loader: 'babel-loader',
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('test')
    })
  ]
};

module.exports = config;
