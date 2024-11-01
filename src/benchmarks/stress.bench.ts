/* tslint:disable:no-implicit-dependencies variable-name no-any */
import { Bench } from "tinybench";

export const stressBenchmark = async() => {
  const { default: Stress } = await import("../demo/stress.js");

  let stressTest: any;

  const benchmark = new Bench({
    time: 1000,
    warmupIterations: 0,
    setup: ({ opts }: any) => {
      stressTest = new Stress(opts.items);
      stressTest.headless = true;
    },
    teardown: () => {
      stressTest.physics.clear();
    },
  });

  const recursiveAddTest = (items: number) => {
    benchmark.add(
      `stress test, items=${items}`,
      () => {
        stressTest.update();
      },
      { items } as any,
    );

    if (items < 10000) {
      recursiveAddTest(items + 1000);
    }
  };

  recursiveAddTest(1000);

  await benchmark.run();

  console.table(benchmark.table());
};
