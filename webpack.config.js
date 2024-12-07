const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/main.ts',  // Entry point of your application
  output: {
    filename: 'bundle.js', // The bundled output file
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.ts$/,        // For all .ts files
        use: 'ts-loader',     // use ts-loader to transpile them
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']  // Resolve these file extensions
  },
  devtool: 'source-map'         // Generate source maps for debugging
};
