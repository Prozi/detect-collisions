const { System } = require("../../dist");

module.exports.Tank = class Tank {
  constructor() {
    const width = document.body.offsetWidth;
    const height = document.body.offsetHeight;
    const collisions = new System();

    this.element = document.createElement("div");
    this.canvas = document.createElement("canvas");
    this.context = this.canvas.getContext("2d");
    this.collisions = collisions;
    this.bodies = [];

    this.canvas.width = width;
    this.canvas.height = height;
    this.player = null;

    this.up = false;
    this.down = false;
    this.left = false;
    this.right = false;

    this.element.innerHTML = `
      <div><b>W, S</b> - Accelerate/Decelerate</div>
      <div><b>A, D</b> - Turn</div>
      <div><label><input id="bvh" type="checkbox"> Show Bounding Volume Hierarchy</label></div>
    `;

    const updateKeys = (e) => {
      const keydown = e.type === "keydown";
      const key = e.key.toLowerCase();

      key === "w" && (this.up = keydown);
      key === "s" && (this.down = keydown);
      key === "a" && (this.left = keydown);
      key === "d" && (this.right = keydown);
    };

    document.addEventListener("keydown", updateKeys);
    document.addEventListener("keyup", updateKeys);

    this.bvh_checkbox = this.element.querySelector("#bvh");

    if (this.canvas instanceof Node) {
      this.element.appendChild(this.canvas);
    }

    this.createPlayer(400, 300);
    this.createMap(800, 600);

    const frame = () => {
      try {
        this.update();
      } catch (err) {
        console.warn(err.message || err);
      }
      requestAnimationFrame(frame);
    };

    frame();
  }

  update() {
    this.handleInput();
    this.processGameLogic();
    this.handleCollisions();
    this.render();
  }

  handleInput() {
    this.up && (this.player.velocity += 0.1);
    this.down && (this.player.velocity -= 0.1);

    if (this.left) {
      this.player.setAngle(this.player.angle - 0.04);
    }
    if (this.right) {
      this.player.setAngle(this.player.angle + 0.04);
    }
  }

  processGameLogic() {
    const x = Math.cos(this.player.angle);
    const y = Math.sin(this.player.angle);

    if (this.player.velocity > 0) {
      this.player.velocity -= 0.05;

      if (this.player.velocity > 3) {
        this.player.velocity = 3;
      }
    } else if (this.player.velocity < 0) {
      this.player.velocity += 0.05;

      if (this.player.velocity < -2) {
        this.player.velocity = -2;
      }
    }

    if (!Math.round(this.player.velocity * 100)) {
      this.player.velocity = 0;
    }

    if (this.player.velocity) {
      this.player.pos.x += x * this.player.velocity;
      this.player.pos.y += y * this.player.velocity;
    }
  }

  handleCollisions() {
    this.collisions.update();
    this.collisions.checkAll(({ a, b, overlapV }) => {
      if (a.type === "Circle" || a === this.player) {
        a.setPosition(a.pos.x - overlapV.x, a.pos.y - overlapV.y);
      }

      if (b.type === "Circle" || b === this.player) {
        b.setPosition(b.pos.x + overlapV.x, b.pos.y + overlapV.y);
      }

      if (a === this.player) {
        a.velocity *= 0.9;
      }
    });
  }

  render() {
    this.context.fillStyle = "#000000";
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.context.strokeStyle = "#FFFFFF";
    this.context.beginPath();
    this.collisions.draw(this.context);
    this.context.stroke();

    if (this.bvh_checkbox.checked) {
      this.context.strokeStyle = "#00FF00";
      this.context.beginPath();
      this.collisions.drawBVH(this.context);
      this.context.stroke();
    }
  }

  createPlayer(x, y, size = 13) {
    this.player = this.collisions.createBox(
      { x: this.scaleX(x), y: this.scaleY(y) },
      this.scaleX(2.6 * size),
      this.scaleX(1.3 * size),
      0.2
    );

    this.player.center();

    this.player.velocity = 0;
  }

  scaleX(x) {
    return (x / 800) * this.canvas.width;
  }

  scaleY(y) {
    return (y / 600) * this.canvas.height;
  }

  createCircle(x, y, radius) {
    this.collisions.createCircle(
      { x: this.scaleX(x), y: this.scaleY(y) },
      this.scaleX(radius)
    );
  }

  createOval(x, y, radiusX, radiusY, step, angle) {
    this.collisions.createOval(
      { x: this.scaleX(x), y: this.scaleY(y) },
      this.scaleX(radiusX),
      this.scaleY(radiusY),
      step,
      angle
    );
  }

  createPolygon(x, y, points, angle) {
    const scaledPoints = points.map(([pointX, pointY]) => ({
      x: this.scaleX(pointX),
      y: this.scaleY(pointY),
    }));

    return this.collisions.createPolygon(
      { x: this.scaleX(x), y: this.scaleY(y) },
      scaledPoints,
      angle
    );
  }

  createMap(width, height) {
    // World bounds
    this.createPolygon(0, 0, [
      [0, 0],
      [width, 0],
    ]);
    this.createPolygon(0, 0, [
      [width, 0],
      [width, height],
    ]);
    this.createPolygon(0, 0, [
      [width, height],
      [0, height],
    ]);
    this.createPolygon(0, 0, [
      [0, height],
      [0, 0],
    ]);

    // Factory
    this.createPolygon(
      100,
      100,
      [
        [-50, -50],
        [50, -50],
        [50, 50],
        [-50, 50],
      ],
      0.4
    );
    this.createPolygon(
      190,
      105,
      [
        [-20, -20],
        [20, -20],
        [20, 20],
        [-20, 20],
      ],
      0.4
    );
    this.createCircle(170, 140, 6);
    this.createCircle(185, 155, 6);
    this.createCircle(165, 165, 6);
    this.createCircle(145, 165, 6);

    // Airstrip
    this.createPolygon(
      230,
      50,
      [
        [-150, -30],
        [150, -30],
        [150, 30],
        [-150, 30],
      ],
      0.4
    );

    // HQ
    this.createPolygon(
      100,
      500,
      [
        [-40, -50],
        [40, -50],
        [50, 50],
        [-50, 50],
      ],
      0.2
    );
    this.createCircle(180, 490, 12);
    this.createCircle(175, 540, 12);

    // Barracks
    this.createPolygon(
      400,
      500,
      [
        [-60, -20],
        [60, -20],
        [60, 20],
        [-60, 20],
      ],
      1.7
    );
    this.createPolygon(
      350,
      494,
      [
        [-60, -20],
        [60, -20],
        [60, 20],
        [-60, 20],
      ],
      1.7
    );

    // Mountains
    this.createPolygon(750, 0, [
      [0, 0],
      [-20, 100],
    ]);
    this.createPolygon(750, 0, [
      [-20, 100],
      [30, 250],
    ]);
    this.createPolygon(750, 0, [
      [30, 250],
      [20, 300],
    ]);
    this.createPolygon(750, 0, [
      [20, 300],
      [-50, 320],
    ]);
    this.createPolygon(750, 0, [
      [-50, 320],
      [-90, 500],
    ]);
    this.createPolygon(750, 0, [
      [-90, 500],
      [-200, 600],
    ]);

    // Lake
    this.createOval(530, 130, 80, 70, 10, -0.2);
  }
};
