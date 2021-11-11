const path = `${__dirname}/dist/demo/`;

module.exports = {
  entry: "./src/demo/index.js",
  mode: "development",
  target: "web",
  output: {
    path,
    filename: "demo.bundle.js",
  },
};
