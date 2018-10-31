const webpack = require("webpack"); // to access built-in plugins
const path = require("path");

module.exports = {
  entry: "./js/src/ux-capture.js",
  mode: "production",
  output: {
    filename: "ux-capture.min.js",
    path: path.resolve(__dirname, "lib")
  },
  module: {
    rules: [
      {
        enforce: "pre",
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "eslint-loader"
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: "babel-loader"
      }
    ]
  },
  plugins: [new webpack.ProgressPlugin()]
};
