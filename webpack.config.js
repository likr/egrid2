const path = require('path')
const {GenerateSW} = require('workbox-webpack-plugin')

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
    new GenerateSW({
      maximumFileSizeToCacheInBytes: '10000000',
      swDest: 'service-worker.js',
      globDirectory: './public',
      globPatterns: [
        '**/*.*'
      ],
      globIgnores: [
        'bundle.js',
        'layout-worker.js',
        'morph-worker.js',
        'service-worker.js'
      ],
      navigateFallback: '/index.html'
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
  base.plugins.push(
  )
} else {
  Object.assign(base, {
    devtool: 'inline-source-map'
  })
}

module.exports = base
