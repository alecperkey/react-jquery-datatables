module.exports = {
  context: __dirname,
  devServer: {
    contentBase: __dirname,
  },
  entry: {
    table: './table/main',
  },
  output: {
    filename: '[name].entry.js',
  },
  resolve: {
    alias: {
      // Use uncompiled version
      'react-jquery-datatables': '../../src',
    },
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.css$/,
        loaders: ['style', 'css'],
      },
    ],
  },
};
