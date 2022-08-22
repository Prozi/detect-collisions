require("pixi-shim");
const Stress = require("./stress");

const duration = +(process.argv[2] || 1000);

const run = (count) => {
  const test = new Stress(count * 1000);
  console.log(`stress test with ${test.count} items created`);

  let frames = 0;
  let timeout;

  const benchFrame = () => {
    timeout = setTimeout(benchFrame, 1000 / 120);
    test.update(1);
    frames++;
  };

  setTimeout(() => {
    const fps = frames / (duration / 1000);

    console.log({
      duration: +duration.toFixed(),
      frames,
      fps: +fps.toFixed(1),
    });
    clearTimeout(timeout);

    test.physics.all().forEach((body) => test.physics.remove(body));

    if (count < 128) {
      run(count * 2);
    } else {
      process.exit(0);
    }
  }, duration);

  benchFrame();
};

run(1);
