const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = `${__dirname}/dist/demo/`;

module.exports = {
  entry: {
    demo: "./src/demo/index.js",
  },
  mode: "development",
  target: "web",
  devtool: false,
  output: { path, filename: "[name].js" },
  plugins: [
    new HtmlWebpackPlugin({
      template: "src/index.html",
      inject: ["demo"],
    }),
  ],
  devServer: {
    hot: false,
  },
};
