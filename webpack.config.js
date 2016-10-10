module.exports = {
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
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
  devtool: 'inline-source-map'
}
