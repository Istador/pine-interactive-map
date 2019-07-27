const webpack = require('webpack')
const dotenv  = require('dotenv')

require('dotenv').config()

const github = process.env.IMGMODE === 'github'

module.exports = {
  entry : './app.js',
  mode  : 'production',
  output: {
    filename : 'app.min.js',
    path     : __dirname,
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
  ],
}

