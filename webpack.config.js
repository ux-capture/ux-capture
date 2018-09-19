const webpack = require("webpack"); //to access built-in plugins
const path = require("path");

module.exports = {
  entry: "./js/src/ux-capture.js",
  output: {
    filename: "ux-capture.min.js",
    path: path.resolve(__dirname, "js")
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: "babel-loader"
      }
    ]
  },
  plugins: [new webpack.ProgressPlugin()]
};
