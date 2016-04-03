/* eslint-env node */

var path = require('path');

module.exports = {
  module: {
    loaders: [
      {
        test: path.join(__dirname, 'src'),
        loader: 'babel-loader',
        query: {
          presets: ['es2015'],
          plugins: ['transform-react-jsx'],
        },
      },
    ],
  },
  entry: {
    bundle: './src/index',
    'layout-worker': './src/workers/layout-worker',
    'morph-worker': './src/workers/morph-worker',
  },
  output: {
    path: path.join(__dirname, 'app'),
    filename: '[name].js',
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
};
