const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

const packageJson = require('../package.json');
const USE_TEST = false;


module.exports = {
  context: path.resolve(__dirname, '../src'),
  entry: './index.jsx',
  devtool: 'cheap-module-eval-source-map',
  output: {
    path: path.join(__dirname, '../dist'),
    filename: '[name].js',
  },
  module: {
    rules: [
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
      {
        test: /\.(jpg|jpeg|gif|png)$/,
        use: [
          { loader: 'cache-loader' },
          {
            loader: 'url-loader',
            options: {
              limit: 10000, // 10 kb
              name: '[name].[ext]',
            },
          },
        ],
      },
      {
        test: /\.svg?$/,
        exclude: path.resolve(__dirname, 'node_modules'),
        use: {
          loader: 'raw-loader',
        },
      }
    ],
  },
  resolve: {
    extensions: ['.js', '.json', '.jsx'],
  },
  node: {
    console: true,
    process: true,
  },
  externals: {
    // This is all to supress error messages from 'enzyme'
    cheerio: 'window',
    'react-addons-test-utils': 'window',
    'react/addons': true, // important!!
    'react/lib/ExecutionEnvironment': true,
    'react/lib/ReactContext': true,
  },
  devServer: {
    contentBase: path.resolve(__dirname, '../dist'),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html',
      inject: 'body',
      title: 'Neo Smart Blinds',
      version: JSON.stringify(packageJson.version),
    }),
    new HardSourceWebpackPlugin({
      cacheDirectory: path.resolve(__dirname, '../node_modules/.cache/hard-source/[confighash]'),
    }),
    new webpack.DllReferencePlugin({
      context: path.resolve(__dirname, '../src'),
      manifest: require(path.join(__dirname, 'react.manifest.json')),
    }),
    new webpack.DefinePlugin({
      _VERSION: JSON.stringify(packageJson.version),
      _DEBUG: process.env.npm_config_debug,
    }),
  ],
};
