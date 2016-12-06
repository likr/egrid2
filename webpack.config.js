const path = require('path')
const webpack = require('webpack')

const base = {
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        include: [
          path.resolve(__dirname, 'src'),
          path.resolve(__dirname, 'node_modules/egraph')
        ],
        loader: 'babel-loader',
        query: {
          presets: ['latest'],
          plugins: ['transform-react-jsx']
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
    path: './public',
    filename: '[name].js'
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  plugins: [
  ],
  externals: {
    'jquery': '$',
    'd3': 'd3',
    'react': 'React',
    'react-dom': 'ReactDOM',
    'react-router': 'ReactRouter'
  }
}

if (process.env.NODE_ENV === 'production') {
  base.plugins.push(new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false
    }
  }))
} else {
  Object.assign(base, {
    devtool: 'inline-source-map'
  })
}

module.exports = base
