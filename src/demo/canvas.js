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

    this.started = Date.now();
    this.fps = 0;
    this.frame = 0;

    loop(() => this.update());
  }

  update() {
    this.frame++;
    this.fps = this.frame / ((Date.now() - this.started) / 1000);

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
    this.context.fillText(`FPS: ${this.fps.toFixed(0)}`, 24, 48);

    if (this.test.drawCallback) {
      this.test.drawCallback();
    }
  }
}

function random(min, max) {
  return Math.floor(Math.random() * max) + min;
}

function loop(callback, loopFn = requestAnimationFrame) {
  let time = performance.now();

  function frame() {
    loopFn(frame);

    const now = performance.now();
    const timeScale = (now - time) / (1000 / 60);
    time = now;

    callback(timeScale);
  }

  frame();
}

module.exports.TestCanvas = TestCanvas;

module.exports.random = random;

module.exports.loop = loop;

module.exports.width = width;

module.exports.height = height;
