const webpack = require('webpack')
const path = require('path')
const dotenv  = require('dotenv')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

require('dotenv').config()

const github = process.env.IMGMODE === 'github'

module.exports = {
  entry : {
    vendor: [
      './src/axios.js',
      './node_modules/leaflet/dist/leaflet.js',
      './node_modules/leaflet/dist/leaflet.css',
      './node_modules/leaflet-panel-layers/dist/leaflet-panel-layers.src.js',
      './node_modules/leaflet-panel-layers/dist/leaflet-panel-layers.src.css',
      './node_modules/leaflet-fullscreen/dist/Leaflet.fullscreen.js',
      './node_modules/leaflet-fullscreen/dist/leaflet.fullscreen.css',
    ],
    app: [
      './src/app.js',
      './src/app.scss',
    ],
  },
  mode: 'production',
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({ parallel: true }),
      new OptimizeCSSAssetsPlugin,
    ],
  },
  output: {
    filename : '[name].[contenthash].min.js',
    path     : path.join(__dirname, 'build'),
  },
  module: {
    rules: [
      {
        test: /\.s(a|c)ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader?-url',
          'sass-loader',
        ],
      },
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
        ],
      },
      {
        test: /\.png$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[contenthash].[ext]',
            publicPath: 'img/vendor/',
            outputPath: 'img/vendor/',
          }
        }],
      },
    ],
  },
  resolve: {
    alias: {
      // do not let webpack resolve leaflet normally, as it'd install the wrong version
      leaflet: path.join(__dirname, 'src', 'leaflet.js'),
    },
  },
  plugins: [
    new webpack.DefinePlugin({
      __SOURCE__ : JSON.stringify(process.env.SOURCE),
      __JSON__   : JSON.stringify(process.env.JSON),
      __TILES__  : JSON.stringify(
        github
        ? 'https://raw.githubusercontent.com/Istador/pine-interactive-map/tiles/{z}/{x}/{y}.png'
        : 'tiles/{z}/{x}/{y}.png'
      ),
      __2D_MAP__ : JSON.stringify(
        github
        ? 'https://raw.githubusercontent.com/Istador/pine-interactive-map/img/map/sharp.png'
        : 'img/map/sharp.png'
      ),
    }),
    new HtmlWebpackPlugin({
      filename: path.join(__dirname, 'index.html'),
      template: 'src/index.template.html',
    }),
    new MiniCssExtractPlugin({
        filename: '[name].[contenthash].min.css'
    }),
  ],
}
