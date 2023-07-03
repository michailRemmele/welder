const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: 'none',

  entry: {
    app: path.resolve(__dirname, 'editor/index.js'),
  },

  output: {
    path: path.resolve(__dirname, 'build-editor'),
    filename: 'index.js',
    libraryTarget: 'umd',
    library: 'editorExtension',
  },

  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
    i18next: 'i18next',
    'react-i18next': 'ReactI18next',
    dayjs: 'dayjs',
    antd: 'antd',
    '@emotion/react': 'emotionReact',
    '@emotion/styled': 'emotionStyled',
    'remiz-editor': 'RemizEditor',
  },

  devtool: false,

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
    new CleanWebpackPlugin(),
  ],
};
