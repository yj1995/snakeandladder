const path = require("path");
const nodeExternals = require('webpack-node-externals');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    bundle: "./src/App"
  },
  target: 'node',
  externals: [nodeExternals()],
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'less-loader',
            options: {
              strictMath: true,
              noIeCompat: true,
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ],
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin('dist'),
    new HTMLWebpackPlugin(),
    new CopyPlugin([
      { from: './src/App/game.json', to: './game.json' }
    ]),
    require('autoprefixer'),
  ],
  devServer: {
    open: true,
    historyApiFallback: true
  }
}
