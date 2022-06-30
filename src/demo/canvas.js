const width = document.body.offsetWidth | 1024;
const height = document.body.offsetHeight | 768;

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

    const start = loop(() => this.update());

    start();
  }

  update() {
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
    if (this.test.fps) {
      this.context.fillStyle = "#FFCC00";
      this.context.fillText(this.test.fps, 10, 30);
    }
  }
}

function random(min, max) {
  return Math.floor(Math.random() * max) + min;
}

function loop(callback) {
  let time = performance.now() - 1; // prevent Infinity fps

  return function frame() {
    const now = performance.now();
    const fps = 1000 / (now - time);

    callback(fps);
    requestAnimationFrame(frame);

    time = now;
  };
}

module.exports.TestCanvas = TestCanvas;

module.exports.random = random;

module.exports.loop = loop;

module.exports.width = width;

module.exports.height = height;
