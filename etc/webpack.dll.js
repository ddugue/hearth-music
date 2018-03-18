const path = require('path');
const webpack = require('webpack');

const packageJson = require('../package.json');

module.exports = {
  context: path.resolve(__dirname, '../src'),
  entry: {
    react: [
      'dom-helpers',
      'history',
      'react-router-redux',
      'core-js',
      'regenerator-runtime',
      'react',
      'react-dom',
      'react-redux',
      'redux',
      'redux-saga',
      'react-router-dom',
      'react-router',
      'reselect',
    ],
  },
  module: {
    rules: [
      {
        test: /\.json$/,
        use: [
          { loader: 'json-loader' },
        ],
      },
      {
        test: /\.jsx?$/,
        exclude: path.resolve(__dirname, '../node_modules'),
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
            },
          },
        ],
      },
    ],
  },
  devtool: process.env.npm_config_debug ? 'eval-source-map' : 'source-map',
  output: {
    path: path.join(__dirname, '../dist'),
    filename: '[name].dll.js',
    library: '[name]',
  },
  plugins: [
    new webpack.DllPlugin({
      name: '[name]',
      path: path.join(__dirname, '[name].manifest.json'),
    }),
  ],
};
