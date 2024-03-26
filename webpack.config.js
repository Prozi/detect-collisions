const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = `${__dirname}/dist/demo/`;

module.exports = {
  entry: {
    demo: "./src/demo/index.js",
  },
  resolve: {
    extensions: [".js", ".ts"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  mode: "development",
  target: "web",
  devtool: false,
  output: { path, filename: "[name].js" },
  plugins: [
    new HtmlWebpackPlugin({
      template: "src/index.html",
      inject: "body",
    }),
  ],
  devServer: {
    hot: false,
  },
};
