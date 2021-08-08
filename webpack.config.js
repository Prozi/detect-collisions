module.exports = {
  entry: "./demo/index.js",
  mode: "development",
  target: "web",
  output: {
    path: `${__dirname}/demo/`,
    filename: "demo.bundle.js",
  },
};
