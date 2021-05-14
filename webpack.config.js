const path = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  target: 'web',
  resolve: {
    alias: {
      client: path.resolve(__dirname, 'src/'),
    },
    extensions: ['.tsx', '.ts', '.js'],
  },
  entry: path.resolve(__dirname, 'src', 'index.tsx'),
  output: {
    path: path.resolve(__dirname, 'lib'),
    filename: 'index.tsx',
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.(jsx|tsx|js|ts)$/,
        loader: 'eslint-loader',
        exclude: /node_modules/,
        options: {
          fix: true,
        },
      },
      {
        test: /\.(jsx|tsx|js|ts)$/,
        exclude: /node_modules/,
        use: [{ loader: 'ts-loader' }, { loader: 'eslint-loader' }],
      },
      {
        test: /\.(less)$/,
        use: [
          {
            loader: 'style-loader', // creates style nodes from JS strings
          },
          {
            loader: 'css-loader', // translates CSS into CommonJS
          },
          {
            loader: 'less-loader', // compiles Less to CSS
          },
        ],
      },
      {
        test: /\.css$/,
        use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
      },
      {
        test: /\.(png|svg|jpg|gif)$/i,
        use: ['file-loader'],
      },
      { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' },
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
    contentBase: path.resolve(__dirname, './lib'),
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
