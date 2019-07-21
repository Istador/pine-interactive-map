const webpack = require('webpack')
const dotenv  = require('dotenv')

require('dotenv').config()

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
    }),
  ],
}

