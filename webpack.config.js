const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  entry: "./src/js/index.tsx",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist")
  },
  devServer: {
    contentBase: "./dist"
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"]
  },
  module: {
    rules: [
      { test: /\.[tj]sx?$/, loader: "babel-loader" },
      { test: /\.s?css$/, use: ["style-loader", "css-loader", "sass-loader"] }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: path.resolve(__dirname, "./templates/index.html")
    })
  ]
};
