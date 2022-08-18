const { System, SATVector, getBounceDirection } = require("../../dist");
const { width, height, random, loop } = require("./canvas");
const count = 1000;
const padding = (Math.PI * Math.sqrt(width * height)) / count;

class Stress {
  constructor() {
    const size = (width * height) / (count * 500);

    this.physics = new System();
    this.bodies = [];
    this.polygons = 0;
    this.boxes = 0;
    this.circles = 0;
    this.ellipses = 0;
    this.lines = 0;

    // World bounds
    this.bounds = [
      this.physics.createPolygon(
        { x: 0, y: 0 },
        [
          { x: 0, y: 0 },
          { x: width, y: 0 },
        ],
        { isStatic: true, center: true }
      ),
      this.physics.createPolygon(
        { x: 0, y: 0 },
        [
          { x: width, y: 0 },
          { x: width, y: height },
        ],
        { isStatic: true, center: true }
      ),
      this.physics.createPolygon(
        { x: 0, y: 0 },
        [
          { x: width, y: height },
          { x: 0, y: height },
        ],
        { isStatic: true, center: true }
      ),
      this.physics.createPolygon(
        { x: 0, y: 0 },
        [
          { x: 0, y: height },
          { x: 0, y: 0 },
        ],
        { isStatic: true, center: true }
      ),
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

    loop((timeScale) => this.update(Math.min(1, timeScale)));
  }

  update(timeScale) {
    this.bodies.forEach((body) => {
      body.rotationAngle += body.rotationSpeed * timeScale;
      body.setAngle(body.rotationAngle);

      // adaptive padding, when no collisions goes up to "padding" variable value
      body.padding = (body.padding + padding) / 2;
      body.setPosition(
        body.x + body.directionX * timeScale,
        body.y + body.directionY * timeScale
      );
    });

    this.physics.checkAll(({ a, b, overlapV }) => {
      a.pos.x -= overlapV.x;
      a.pos.y -= overlapV.y;

      // adaptive padding, when collides, halves
      a.padding /= 2;

      this.bounce(a, b);
      this.bounce(b, a);

      a.rotationSpeed = (Math.random() - Math.random()) * 0.1;
    });
  }

  bounce(a, b) {
    if (b.isStatic) {
      const { x, y } = new SATVector(
        width / 2 - a.x,
        height / 2 - a.y
      ).normalize();

      a.directionX = x;
      a.directionY = y;

      return;
    }

    const { x, y } = getBounceDirection(a, b);

    a.directionX = x;
    a.directionY = y;
  }

  createShape(large, size) {
    const minSize = size * 1.0 * (large ? Math.random() + 1 : 1);
    const maxSize = size * 1.25 * (large ? Math.random() * 2 + 1 : 1);
    const x = random(0, width);
    const y = random(0, height);
    const direction = (random(0, 360) * Math.PI) / 180;
    const options = {
      center: true,
    };

    let body;
    let variant = random(0, 5);

    switch (variant) {
      case 0:
        body = this.physics.createCircle({ x, y }, random(minSize, maxSize));

        ++this.circles;
        break;

      case 1:
        const width = random(minSize, maxSize);
        const height = random(minSize, maxSize);
        body = this.physics.createEllipse({ x, y }, width, height);

        ++this.ellipses;
        break;

      case 2:
        body = this.physics.createBox(
          { x, y },
          random(minSize, maxSize),
          random(minSize, maxSize),
          options
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
          options
        );

        ++this.lines;
        break;

      default:
        body = this.physics.createPolygon(
          { x, y },
          [
            { x: -random(minSize, maxSize), y: random(minSize, maxSize) },
            { x: random(minSize, maxSize), y: random(minSize, maxSize) },
            { x: random(minSize, maxSize), y: -random(minSize, maxSize) },
            { x: -random(minSize, maxSize), y: -random(minSize, maxSize) },
          ],
          options
        );

        ++this.polygons;
        break;
    }

    // set initial rotation angle direction
    body.rotationSpeed = (Math.random() - Math.random()) * 0.1;
    body.rotationAngle = (random(0, 360) * Math.PI) / 180;
    body.setAngle(body.rotationAngle);

    body.directionX = Math.cos(direction);
    body.directionY = Math.sin(direction);

    this.bodies.push(body);
  }
}

module.exports = Stress;
