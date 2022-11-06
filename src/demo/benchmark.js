require("pixi-shim");
const Stress = require("./stress");

const duration = +(process.argv[2] || 3000);

let totalFrames = 0;

const run = (phase) => {
  const count = 2000;
  const test = new Stress(count);
  console.log(`stress test with ${count} items created`);

  let frames = 0;
  let timeout;

  const benchFrame = () => {
    timeout = setTimeout(benchFrame, 1000 / 120);
    test.update();
    frames++;
  };

  setTimeout(() => {
    const fps = frames / (duration / 1000);
    totalFrames += frames;

    console.log({
      duration: +duration.toFixed(),
      frames,
      totalFrames,
      fps: +fps.toFixed(1),
    });

    clearTimeout(timeout);

    test.physics.all().forEach((body) => test.physics.remove(body));

    if (phase < 3) {
      run(phase + 1);
    } else {
      process.exit(0);
    }
  }, duration);

  benchFrame();
};

run(1);
