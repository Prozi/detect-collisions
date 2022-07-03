const { System } = require("../../dist");
const { width, height, random, loop } = require("./canvas");

class Stress {
  constructor(count = 1000) {
    const size = Math.hypot(width, height) / count;

    this.physics = new System(24);
    this.bodies = [];
    this.polygons = 0;
    this.boxes = 0;
    this.circles = 0;
    this.ellipses = 0;
    this.lines = 0;

    this.fps = 0;
    this.frame = 0;
    this.fpsTotal = 0;

    // World bounds
    this.bounds = [
      this.physics.createPolygon({ x: 0, y: 0 }, [
        { x: 0, y: 0 },
        { x: width, y: 0 },
      ]),
      this.physics.createPolygon({ x: 0, y: 0 }, [
        { x: width, y: 0 },
        { x: width, y: height },
      ]),
      this.physics.createPolygon({ x: 0, y: 0 }, [
        { x: width, y: height },
        { x: 0, y: height },
      ]),
      this.physics.createPolygon({ x: 0, y: 0 }, [
        { x: 0, y: height },
        { x: 0, y: 0 },
      ]),
    ];

    for (let i = 0; i < count; ++i) {
      this.createShape(!random(0, 20), size);
    }

    this.legend = `<div><b>Total:</b> ${count}</div>
    <div><b>Polygons:</b> ${this.polygons}</div>
    <div><b>Boxes:</b> ${this.boxes}</div>
    <div><b>Circles:</b> ${this.circles}</div>
    <div><b>Ellipses:</b> ${this.ellipses}</div>
    <div><b>Lines:</b> ${this.lines}</div>`;

    const start = loop((fps) => this.update(fps));

    start();
  }

  update(fps) {
    this.frame++;
    this.fpsTotal += fps;
    this.fps = Math.round(this.fpsTotal / this.frame);

    if (this.frame > 100) {
      this.frame = 1;
      this.fpsTotal = this.fps;
    }

    this.bodies.forEach((body) => {
      if (body.type !== "Circle") {
        body.rotationAngle += body.rotationSpeed;
        body.setAngle(body.rotationAngle);
      }

      body.setPosition(
        body.pos.x + body.directionX,
        body.pos.y + body.directionY
      );
    });

    this.physics.checkAll(({ a, overlapV }) => {
      if (this.bounds.includes(a)) {
        return;
      }

      const direction = (random(0, 360) * Math.PI) / 180;

      a.setPosition(a.pos.x - overlapV.x, a.pos.y - overlapV.y);

      a.directionX = Math.cos(direction);
      a.directionY = Math.sin(direction);

      if (a.type !== "Circle") {
        a.rotationSpeed = (Math.random() - Math.random()) * 0.1;
      }
    });
  }

  createShape(large, size) {
    const minSize = size * 1.0 * (large ? 2 : 1);
    const maxSize = size * 1.25 * (large ? 3 : 1);
    const x = random(0, width);
    const y = random(0, height);
    const direction = (random(0, 360) * Math.PI) / 180;
    const center = true;
    const padding = size * 7;

    let body;
    let variant = random(0, 5);

    switch (variant) {
      case 0:
        body = this.physics.createCircle({ x, y }, random(minSize, maxSize));

        ++this.circles;
        break;

      case 1:
        body = this.physics.createEllipse(
          { x, y },
          random(minSize, maxSize),
          random(minSize, maxSize),
          2,
          { padding }
        );

        ++this.ellipses;
        break;

      case 2:
        body = this.physics.createBox(
          { x, y },
          random(minSize, maxSize),
          random(minSize, maxSize),
          { center, padding }
        );

        ++this.boxes;
        break;

      case 3:
        body = this.physics.createLine(
          { x, y },
          {
            x: x + random(minSize, maxSize),
            y: y + random(minSize, maxSize),
          },
          { center, padding }
        );

        ++this.lines;
        break;

      default:
        body = this.physics.createPolygon(
          { x, y },
          [
            { x: -random(minSize, maxSize), y: -random(minSize, maxSize) },
            { x: random(minSize, maxSize), y: -random(minSize, maxSize) },
            { x: random(minSize, maxSize), y: random(minSize, maxSize) },
            { x: -random(minSize, maxSize), y: random(minSize, maxSize) },
          ],
          { center, padding }
        );

        ++this.polygons;
        break;
    }

    if (body.type !== "Circle") {
      // set initial rotation angle direction
      body.rotationSpeed = (Math.random() - Math.random()) * 0.1;
      body.rotationAngle = (random(0, 360) * Math.PI) / 180;
      body.setAngle(body.rotationAngle);
    }

    body.directionX = Math.cos(direction);
    body.directionY = Math.sin(direction);

    this.bodies.push(body);
  }
}

module.exports = Stress;
