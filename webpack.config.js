const path = `${__dirname}/dist/demo/`;

module.exports = {
  entry: "./src/demo/index.js",
  mode: "development",
  target: "web",
  devtool: false,
  output: {
    path,
    filename: "demo.bundle.js",
  },
};
