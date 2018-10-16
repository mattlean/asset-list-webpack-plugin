const path = require('path');

const AssetListWebpackPlugin = require('./src/asset-list-webpack-plugin');

const PATHS = {
  entry: path.join(__dirname, 'test', 'index.js'),
  build: path.join(__dirname, 'build'),
};

module.exports = {
  entry: {
    main: PATHS.entry,
  },

  output: {
    path: PATHS.build,
    filename: '[name].js',
  },

  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'initial',
        },
      },
    },
  },

  plugins: [new AssetListWebpackPlugin({mode: 'object', key: 'name'})],
};
