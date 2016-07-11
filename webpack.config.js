const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const merge = require('webpack-merge');
const validate = require('webpack-validator');

const parts = require('./libs/parts');

const PATHS = {
  app: path.join(__dirname, 'app'),
  style: path.join(__dirname, 'app', './styles/main.css'),
  build: path.join(__dirname, 'build')
};

const common = {
  entry: {
    style: PATHS.style,
    app: PATHS.app
  },
  output: {
    path: PATHS.build,
    filename: '[name].js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Webpack demo'
    })
  ]
};

var config;

// Detect how npm is run and branch based on that
switch(process.env.npm_lifecycle_event) {
  case 'build':
    config = merge(
      common,
      {
        devtool: 'source-map',
        // below from: http://survivejs.com/webpack/building-with-webpack/adding-hashes-to-filenames/
        output: {
          path: PATHS.build,
          filename: '[name].[chunkhash].js',
          // this is used for the require.esusure. The setup
          // will work witout, but this is useful to set
          chunkFilename: '[chunkhash].js'
        }
      },
      parts.clean(PATHS.build),
      parts.setFreeVariable(
        'process.env.NODE_ENV',
        'production'
      ),
      parts.extractBundle({
        name: 'vendor',
        entries: ['react'] // this needs to be managed manually - http://survivejs.com/webpack/building-with-webpack/splitting-bundles/#loading-dependencies-to-a-vendor-bundle-automatically
      }),
      parts.minify(),
      parts.extractCSS(PATHS.style),
      parts.purifyCSS([PATHS.app]),
      {}
    );
    break;
  default:
    // old-- config = merge(common,{});
    config = merge(
      common, 
      {
        devtool: 'eval-source-map'
      },
      parts.setupCSS(PATHS.style),
      parts.devServer({
        host: process.env.HOST,
        port: process.env.PORT
      })
    );
}

module.exports = validate(config);  