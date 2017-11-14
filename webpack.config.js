const path = require('path')
const webpack = require('webpack')
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin')

const base = {
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: [
          path.resolve(__dirname, 'src'),
          path.resolve(__dirname, 'node_modules/egraph')
        ],
        loader: 'babel-loader',
        query: {
          presets: ['env', 'react']
        }
      }
    ]
  },
  entry: {
    bundle: './src/index',
    'layout-worker': './src/workers/layout-worker',
    'morph-worker': './src/workers/morph-worker'
  },
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  plugins: [
    new webpack.DefinePlugin({
      PRODUCTION: process.env.NODE_ENV === 'production'
    })
  ],
  externals: {
    'jquery': '$'
  },
  devServer: {
    contentBase: path.join(__dirname, 'public'),
    historyApiFallback: true,
    port: 8080
  }
}

if (process.env.NODE_ENV === 'production') {
  base.plugins.push(new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false
    }
  }))
  base.plugins.push(new SWPrecacheWebpackPlugin({
    maximumFileSizeToCacheInBytes: 10000000,
    staticFileGlobs: [
      'public/**/*.*'
    ],
    stripPrefix: 'public/',
    navigateFallback: '/index.html',
    runtimeCaching: [
    ]
  }))
} else {
  Object.assign(base, {
    devtool: 'inline-source-map'
  })
}

module.exports = base
