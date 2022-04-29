const { System } = require("../../dist");

const width = document.body.offsetWidth;
const height = document.body.offsetHeight;
const count = 500;
const speed = 1;
const size = (Math.hypot(width, height) || 500) * 0.004;

let frame = 0;
let fps_total = 0;

module.exports.Stress = class Stress {
  constructor() {
    this.element = document.createElement("div");
    this.canvas = document.createElement("canvas");
    this.context = this.canvas.getContext("2d");
    this.collisions = new System();
    this.bodies = [];
    this.polygons = 0;
    this.boxes = 0;
    this.circles = 0;
    this.ellipses = 0;
    this.lines = 0;

    this.canvas.width = width;
    this.canvas.height = height;
    this.context.font = "24px Arial";

    // World bounds
    this.bounds = [
      this.collisions.createPolygon({ x: 0, y: 0 }, [
        { x: 0, y: 0 },
        { x: width, y: 0 },
      ]),
      this.collisions.createPolygon({ x: 0, y: 0 }, [
        { x: width, y: 0 },
        { x: width, y: height },
      ]),
      this.collisions.createPolygon({ x: 0, y: 0 }, [
        { x: width, y: height },
        { x: 0, y: height },
      ]),
      this.collisions.createPolygon({ x: 0, y: 0 }, [
        { x: 0, y: height },
        { x: 0, y: 0 },
      ]),
    ];

    for (let i = 0; i < count; ++i) {
      this.createShape(!random(0, 20));
    }

    this.element.innerHTML = `
      <div><b>Total:</b> ${count}</div>
      <div><b>Polygons:</b> ${this.polygons}</div>
      <div><b>Boxes:</b> ${this.boxes}</div>
      <div><b>Circles:</b> ${this.circles}</div>
      <div><b>Ellipses:</b> ${this.ellipses}</div>
      <div><b>Lines:</b> ${this.lines}</div>
      <div><label><input id="bvh" type="checkbox">Show Bounding Volume Hierarchy</label></div>
    `;

    this.bvh_checkbox = this.element.querySelector("#bvh");

    if (this.canvas instanceof Node) {
      this.element.appendChild(this.canvas);
    }

    const self = this;

    let time = performance.now();

    this.frame = requestAnimationFrame(function frame() {
      const current_time = performance.now();

      try {
        self.update(1000 / (current_time - time));
      } catch (err) {
        console.warn(err.message || err);
      }

      self.frame = requestAnimationFrame(frame);

      time = current_time;
    });
  }

  update(fps) {
    ++frame;
    fps_total += fps;

    const average_fps = Math.round(fps_total / frame);

    if (frame > 100) {
      frame = 1;
      fps_total = average_fps;
    }

    this.bodies.forEach((body) => {
      if (body.type !== "Circle") {
        body.rotationAngle += body.rotationSpeed;
        body.setAngle(body.rotationAngle);
      }

      body.setPosition(
        body.pos.x + body.direction_x * speed,
        body.pos.y + body.direction_y * speed
      );
    });

    this.collisions.checkAll(({ a, overlapV }) => {
      if (this.bounds.includes(a)) {
        return;
      }

      const direction = (random(0, 360) * Math.PI) / 180;

      a.setPosition(a.pos.x - overlapV.x, a.pos.y - overlapV.y);

      a.direction_x = Math.cos(direction);
      a.direction_y = Math.sin(direction);

      if (a.type !== "Circle") {
        a.rotationSpeed = (Math.random() - Math.random()) * 0.1;
      }
    });

    // Clear the canvas
    this.context.fillStyle = "#000000";
    this.context.fillRect(0, 0, width, height);

    // Render the bodies
    this.context.strokeStyle = "#FFFFFF";
    this.context.beginPath();
    this.collisions.draw(this.context);
    this.context.stroke();

    // Render the BVH
    if (this.bvh_checkbox.checked) {
      this.context.strokeStyle = "#00FF00";
      this.context.beginPath();
      this.collisions.drawBVH(this.context);
      this.context.stroke();
    }

    // Render the FPS
    this.context.fillStyle = "#FFCC00";
    this.context.fillText(average_fps, 10, 30);
  }

  createShape(large) {
    const min_size = size * 1.0 * (large ? 2 : 1);
    const max_size = size * 1.25 * (large ? 3 : 1);
    const x = random(0, width);
    const y = random(0, height);
    const direction = (random(0, 360) * Math.PI) / 180;

    let body;
    let variant = random(0, 5);

    switch (variant) {
      case 0:
        body = this.collisions.createCircle(
          { x, y },
          random(min_size, max_size)
        );

        ++this.circles;
        break;

      case 1:
        body = this.collisions.createEllipse(
          { x, y },
          random(min_size, max_size),
          random(min_size, max_size),
          min_size
        );

        ++this.ellipses;
        break;

      case 2:
        body = this.collisions.createBox(
          { x, y },
          random(min_size, max_size),
          random(min_size, max_size)
        );

        body.center();

        ++this.boxes;
        break;

      case 3:
        body = this.collisions.createLine(
          { x, y },
          {
            x: x + random(min_size, max_size),
            y: y + random(min_size, max_size),
          }
        );

        ++this.lines;
        break;

      default:
        body = this.collisions.createPolygon({ x, y }, [
          { x: -random(min_size, max_size), y: -random(min_size, max_size) },
          { x: random(min_size, max_size), y: -random(min_size, max_size) },
          { x: random(min_size, max_size), y: random(min_size, max_size) },
          { x: -random(min_size, max_size), y: random(min_size, max_size) },
        ]);

        ++this.polygons;
        break;
    }

    if (body.type !== "Circle") {
      // set initial rotation angle direction
      body.rotationSpeed = (Math.random() - Math.random()) * 0.1;
      body.rotationAngle = (random(0, 360) * Math.PI) / 180;
      body.setAngle(body.rotationAngle);
    }

    body.direction_x = Math.cos(direction);
    body.direction_y = Math.sin(direction);

    this.bodies.push(body);
  }
};

function random(min, max) {
  return Math.floor(Math.random() * max) + min;
}
