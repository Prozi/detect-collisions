module.exports = {
  entry: "./demo/index.js",
  mode: "development",
  target: "web",
  output: {
    path: `${__dirname}/docs/demo/`,
    filename: "index.js",
  },
};
