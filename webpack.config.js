const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = `${__dirname}/dist/demo/`;

module.exports = {
  entry: "./src/demo/index.js",
  mode: "development",
  target: "web",
  devtool: false,
  output: { path, filename: "demo.bundle.js" },
  plugins: [
    new HtmlWebpackPlugin({
      template: "src/index.html",
    }),
  ],
  devServer: {
    hot: false,
  },
};
