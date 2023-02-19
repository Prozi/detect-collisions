const { System, getBounceDirection } = require("../..");
const { width, height } = require("./canvas");
const seededRandom = require("random-seed").create("@Prozi").random;

function random(min, max) {
  return Math.floor(seededRandom() * max) + min;
}

class Stress {
  constructor(count = 2000) {
    const size = Math.sqrt((width * height) / (count * 50));

    this.physics = new System(5);
    this.bodies = [];
    this.polygons = 0;
    this.boxes = 0;
    this.circles = 0;
    this.ellipses = 0;
    this.lines = 0;
    this.lastVariant = 0;
    this.count = count;

    // World bounds
    this.bounds = [
      this.physics.createBox({ x: 0, y: 0 }, width, 10, {
        isStatic: true,
        isCentered: true,
      }),
      this.physics.createBox({ x: width - 10, y: 0 }, 10, height, {
        isStatic: true,
        isCentered: true,
      }),
      this.physics.createBox({ x: 0, y: height - 10 }, width, 10, {
        isStatic: true,
        isCentered: true,
      }),
      this.physics.createBox({ x: 0, y: 0 }, 10, height, {
        isStatic: true,
        isCentered: true,
      }),
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

    this.lastTime = Date.now();
    this.start = () => {
      const frame = () => {
        this.update();

        requestAnimationFrame(frame);
      };

      requestAnimationFrame(frame);
    };
  }

  update() {
    const now = Date.now();
    const timeScale = (now - this.lastTime) / 60;
    this.lastTime = now;

    this.bodies.forEach(this.updateBody.bind(this, timeScale));
  }

  updateBody(timeScale, body) {
    body.setAngle(body.angle + body.rotationSpeed * timeScale);

    if (seededRandom() < 0.05 * timeScale) {
      body.targetScale.x = 0.5 + seededRandom();
    }

    if (seededRandom() < 0.05 * timeScale) {
      body.targetScale.y = 0.5 + seededRandom();
    }

    if (Math.abs(body.targetScale.x - body.scaleX) > 0.01) {
      body.setScale(
        body.scaleX +
          Math.sign(body.targetScale.x - body.scaleX) * 0.02 * timeScale,
        body.scaleY +
          Math.sign(body.targetScale.y - body.scaleY) * 0.02 * timeScale
      );
    }

    // as last step update position, and bounding box
    body.setPosition(
      body.x + body.directionX * timeScale,
      body.y + body.directionY * timeScale
    );

    this.physics.checkOne(body, this.checkBounce.bind(this));
  }

  checkBounce({ a, b, overlapV }) {
    this.bounce(a, b, overlapV);
    a.rotationSpeed = (seededRandom() - seededRandom()) * 0.1;
    a.setPosition(a.x - overlapV.x, a.y - overlapV.y);
  }

  bounce(a, b, overlapV) {
    if (b.isStatic) {
      // flip on wall
      if (Math.abs(overlapV.x) > Math.abs(overlapV.y)) {
        a.directionX *= -1;
      } else {
        a.directionY *= -1;
      }

      return;
    }

    const bounce = getBounceDirection(a, b);
    bounce.scale(b.size * 0.5 * (b.scaleX + b.scaleY)).add({
      x: a.directionX * a.size,
      y: a.directionY * a.size * 0.5 * (a.scaleX + a.scaleY),
    });
    const { x, y } = bounce.normalize();

    a.directionX = x;
    a.directionY = y;
  }

  createShape(large, size) {
    const minSize = size * 1.0 * (large ? seededRandom() + 1 : 1);
    const maxSize = size * 1.25 * (large ? seededRandom() * 2 + 1 : 1);
    const x = random(0, width);
    const y = random(0, height);
    const direction = (random(0, 360) * Math.PI) / 180;
    const options = {
      isCentered: true,
      padding: (minSize + maxSize) * 0.2,
    };

    let body;
    let variant = this.lastVariant++ % 5;

    switch (variant) {
      case 0:
        body = this.physics.createCircle(
          { x, y },
          random(minSize, maxSize) / 2,
          options
        );

        ++this.circles;
        break;

      case 1:
        const width = random(minSize, maxSize);
        const height = random(minSize, maxSize);
        body = this.physics.createEllipse({ x, y }, width, height, 2, options);

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
    body.rotationSpeed = (seededRandom() - seededRandom()) * 0.1;
    body.setAngle((random(0, 360) * Math.PI) / 180);

    body.targetScale = { x: 1, y: 1 };
    body.size = (minSize + maxSize) / 2;

    body.directionX = Math.cos(direction);
    body.directionY = Math.sin(direction);

    this.bodies.push(body);
  }
}

module.exports = Stress;
