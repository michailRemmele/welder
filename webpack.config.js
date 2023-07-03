const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';

module.exports = {
  mode: 'none',

  entry: {
    app: path.resolve(__dirname, 'src/index.js'),
  },

  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].[hash].js',
  },

  devServer: {
    open: true,
    static: {
      directory: path.join(__dirname, 'public'),
    },
  },

  devtool: isDev ? 'eval' : false,

  resolve: {
    extensions: ['.js'],
  },

  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
    isDev ? null : new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      inject: true,
      template: path.resolve(__dirname, 'public/index.html'),
      chunks: ['app'],
    }),
    isDev ? null : new CopyWebpackPlugin({
      patterns: [
        {
          from: path.join(__dirname, 'public'),
          globOptions: {
            ignore: [path.resolve(__dirname, 'public/index.html')],
          },
        },
      ],
    }),
  ].filter(Boolean),
};
