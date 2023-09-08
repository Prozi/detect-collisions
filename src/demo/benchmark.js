require("pixi-shim");
const Stress = require("./stress");
const { Bench } = require("tinybench");

let test;

const bench = new Bench({
  time: 1000,
  warmupIterations: 0,
  setup: ({ opts }) => {
    test = new Stress(opts.items);
  },
  teardown: () => {
    test.physics.clear();
  },
});

const recursiveAddTest = (items) => {
  bench.add(
    `stress test, items=${items}`,
    () => {
      test.update();
    },
    { items },
  );

  if (items < 10000) {
    recursiveAddTest(items + 1000);
  }
};

recursiveAddTest(1000);

bench.run().then(() => {
  console.table(bench.table());
  process.exit(0);
});
