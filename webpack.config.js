var resolve = require('path').resolve;

module.exports = {
  entry: {
    docs: resolve(__dirname, 'src/entry/docs.js')
  },
  output: {
    path: resolve(__dirname, 'out'),
    filename: "[name].bundle.js",
    chunkFilename: "[id].chunk.js"
  },
  module: {
    loaders: [
      {
        test: /\.json$/,
        loader: 'json'
      }, {
        test: /\.js$/,
        include: [
          resolve(__dirname, 'src')
        ],
        loader: 'babel',
        query: {
          cacheDirectory: true,
          presets: ['es2015', 'react'],
          plugins: ['transform-runtime']
        }
      }
    ],
  },
  resolve: {
    alias: {
      'uglify-js': resolve(__dirname, 'lib/uglify.js')
    }
  },
  node: {
    fs: 'empty'
  },
};
