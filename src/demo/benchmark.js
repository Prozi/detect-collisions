require("pixi-shim");
const Stress = require("./stress");

const duration = +(process.argv[2] || 1000);
const summary = [];

const run = (items) => {
  const test = new Stress(items);

  let frames = 0;
  let timeout;

  const benchFrame = () => {
    test.update();
    frames++;
    timeout = setTimeout(benchFrame);
  };

  benchFrame();

  setTimeout(() => {
    clearTimeout(timeout);
    test.physics.clear();

    const fps = frames / (duration / 1000);
    summary.push({
      items,
      FPS: +fps.toFixed(2),
    });

    if (items < 10000) {
      run(items + 1000);
    } else {
      summary.unshift({
        items: "total",
        FPS: +summary.reduce((sum, entry) => sum + entry.FPS, 0).toFixed(2),
      });
      console.table(summary);
      process.exit(0);
    }
  }, duration);
};

run(1000);
