const webpack = require('webpack')
const fs      = require('fs')
const path    = require('path')
const dotenv  = require('dotenv')

const MiniCssExtractPlugin       = require('mini-css-extract-plugin')
const TerserPlugin               = require('terser-webpack-plugin')
const OptimizeCSSAssetsPlugin    = require('optimize-css-assets-webpack-plugin')
const HtmlWebpackPlugin          = require('html-webpack-plugin')
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin')
const PreloadWebpackPlugin       = require('preload-webpack-plugin')
const SpritesmithPlugin          = require('webpack-spritesmith')
const BabelTransformUnicodeRegex = require('./src/babel-transform-unicode-regex')

require('dotenv').config()

fs.copyFileSync('./node_modules/axios/dist/axios.js', './build/axios.js')
fs.copyFileSync('./node_modules/wtf_wikipedia/builds/wtf_wikipedia.js', './build/wtf_wikipedia.js')

const spritesmith = (dir, key, name) => new SpritesmithPlugin({
  src: {
    cwd: path.join(__dirname, 'img/' + dir),
    glob: '*.png',
  },
  target: {
    image: path.resolve(__dirname, 'build/img/' + key + '.[contenthash].png'),
    css: [[
      path.resolve(__dirname, 'build/img/' + key + '.scss'),
      { spritesheetName: 'pine-' + key },
    ]],
  },
  apiOptions: {
    cssImageRef: '~' + key + '.[contenthash].png',
    generateSpriteName: (p) => `pine-${name}-${path.parse(p).name}`,
  },
  spritesmithOptions: {
    padding: 4,
  },
})

module.exports = {
  entry : {
    fetch: [(
      process.env.DATAMODE === 'wiki'
      ? './src/wtf_wikipedia.js'
      : './src/axios.js'
    )],
    leaflet: [
      './node_modules/leaflet/dist/leaflet.js',
      './node_modules/leaflet/dist/leaflet.css',
      './node_modules/leaflet-panel-layers/dist/leaflet-panel-layers.src.js',
      './node_modules/leaflet-panel-layers/dist/leaflet-panel-layers.src.css',
      './node_modules/leaflet-fullscreen/dist/Leaflet.fullscreen.js',
      './node_modules/leaflet-fullscreen/dist/leaflet.fullscreen.css',
      './node_modules/leaflet-languageselector/leaflet-languageselector.js',
      './node_modules/leaflet-languageselector/leaflet-languageselector.css',
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
    publicPath : 'build/',
  },
  module: {
    rules: [
      {
        test: /\.js$/i,
        exclude: /[\\/]node_modules[\\/](?!(wtf_wikipedia|regexpu\-core|unicode\-match\-property\-(value\-)?ecmascript)[\\/])/,
        use: {
          loader: 'babel-loader',
          options: {
            sourceType: 'unambiguous',
            presets: [[
              '@babel/preset-env',
              {
                useBuiltIns: 'usage',
                corejs: 3,
                modules: 'commonjs',
                targets: {
                  ie      : 11,
                  chrome  : 60,
                  firefox : 56,
                },
              },
            ]],
            plugins: [
              BabelTransformUnicodeRegex,
            ],
          },
        },
      },
      {
        test: /\.s(a|c)ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
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
        exclude: /(icons|langs|styles)\.[a-z0-9]+\.png/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[contenthash].[ext]',
            publicPath: 'img/vendor/',
            outputPath: 'img/vendor/',
          },
        }],
      },
      {
        test: /(icons|langs|styles)\.[a-z0-9]+\.png$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            publicPath: 'img',
            outputPath: 'img',
          },
        }],
      },
    ],
  },
  resolve: {
    alias: {
      // do not let webpack resolve leaflet normally, as it'd install the wrong version
      leaflet: path.join(__dirname, 'src', 'leaflet.js'),
    },
    modules: [
      'node_modules',
      'build/img',
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      __WIKI__     : JSON.stringify(process.env.WIKI),
      __VERSIONS__ : JSON.stringify(process.env.VERSIONS),
      __DATAMODE__ : JSON.stringify(process.env.DATAMODE),
      __SOURCE__   : JSON.stringify(process.env.SOURCE),
      __JSON__     : JSON.stringify(process.env.JSON),
      __TILES__    : JSON.stringify(
        process.env.IMGMODE === 'github'
        ? 'https://raw.githubusercontent.com/Istador/pine-interactive-map/tiles/{version}/{z}/{x}/{y}.png'
        : 'tiles/{version}/{z}/{x}/{y}.png'
      ),
    }),
    new HtmlWebpackPlugin({
      filename: path.join(__dirname, 'index.html'),
      template: 'src/index.template.html',
    }),
    new PreloadWebpackPlugin({
      rel: 'preload',
      include: 'allAssets',
      fileBlacklist: [ /@2x/, /-2x/, /layers\./, /marker-icon\./ ],
      as: (name) => ( /\.png$/.test(name) ? 'image' : ( /\.css$/.test(name) ? 'style' : 'script' ) ),
    }),
    new ScriptExtHtmlWebpackPlugin({
      defaultAttribute: 'defer',
    }),
    new MiniCssExtractPlugin({
        filename: '[name].[contenthash].min.css',
    }),
    spritesmith('icons',  'icons',  'icon'),
    spritesmith('lang',   'langs',  'lang'),
    spritesmith('styles', 'styles', 'style'),
    new webpack.WatchIgnorePlugin([
      path.join(__dirname, 'node_modules'),
      path.join(__dirname, 'build'),
      path.join(__dirname, 'index.html'),
    ]),
  ],
  watchOptions: {
    aggregateTimeout: 500,
    poll: 1000,
  },
}
