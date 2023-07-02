const width = innerWidth || 1024;
const height = innerHeight || 768;

class TestCanvas {
  constructor(test) {
    this.test = test;

    this.element = document.createElement("div");
    this.element.id = "debug";
    this.element.innerHTML = `${this.test.legend}
    <div>
      <label>
        <input id="bvh" type="checkbox"/> Show Bounding Volume Hierarchy
      </label>
    </div>`;

    this.canvas = document.createElement("canvas");
    this.canvas.width = width;
    this.canvas.height = height;

    this.context = this.canvas.getContext("2d");
    this.context.font = "24px Arial";
    this.test.context = this.context;

    this.bvhCheckbox = this.element.querySelector("#bvh");

    if (this.canvas instanceof Node) {
      this.element.appendChild(this.canvas);
    }

    this.fps = 0;
    this.frame = 0;
    this.started = Date.now();

    loop(() => this.update());
  }

  update() {
    this.frame++;

    const timeDiff = Date.now() - this.started;
    if (timeDiff >= 1000) {
      this.fps = this.frame / (timeDiff / 1000);
      this.frame = 0;
      this.started = Date.now();
    }

    // Clear the canvas
    this.context.fillStyle = "#000000";
    this.context.fillRect(0, 0, width, height);

    // Render the bodies
    this.context.strokeStyle = "#FFFFFF";
    this.context.beginPath();
    this.test.physics.draw(this.context);
    this.context.stroke();

    // Render the BVH
    if (this.bvhCheckbox.checked) {
      this.context.strokeStyle = "#00FF00";
      this.context.beginPath();
      this.test.physics.drawBVH(this.context);
      this.context.stroke();
    }

    // Render the FPS
    this.context.fillStyle = "#FFCC00";
    this.context.fillText(
      `FPS: ${this.fps ? this.fps.toFixed(0) : "?"}`,
      24,
      48
    );

    if (this.test.drawCallback) {
      this.test.drawCallback();
    }
  }
}

function loop(callback) {
  let time = Date.now();

  function frame() {
    const now = Date.now();
    const timeScale = Math.min(1000, now - time) / (1000 / 60);

    callback(timeScale);

    time = now;
  }

  return setInterval(frame);
}

module.exports.TestCanvas = TestCanvas;

module.exports.loop = loop;

module.exports.width = width;

module.exports.height = height;
