const path = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  target: 'web',
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  entry: path.resolve(__dirname, 'src', 'index.tsx'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [{ loader: 'babel-loader' }, { loader: 'eslint-loader' }],
      },
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        use: [{ loader: 'ts-loader' }, { loader: 'eslint-loader' }],
      },
      {
        test: /\.css$/,
        use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
      },
      {
        test: /\.(png|svg|jpg|gif)$/i,
        use: ['file-loader'],
      },
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader',
      },
    ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new ESLintPlugin(),
    new HtmlWebpackPlugin({
      hash: true,
      chunks: ['main'],
      template: `./src/template.html`,
    }),
  ],
  devServer: {
    contentBase: path.resolve(__dirname, './dist'),
    watchOptions: {
      ignored: /node_modules/,
    },
    historyApiFallback: { index: 'index.html' },
    hot: true,
    compress: true,
    port: 9000,
    inline: true,
    watchContentBase: true,
    disableHostCheck: true,
  },
};
