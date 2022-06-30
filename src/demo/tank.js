const { System } = require("../../dist");
const { width, height, loop } = require("./canvas");

class Tank {
  constructor() {
    this.physics = new System();
    this.bodies = [];
    this.player = this.createPlayer(400, 300);

    this.up = false;
    this.down = false;
    this.left = false;
    this.right = false;

    this.legend = `<div><b>W, S</b> - Accelerate/Decelerate</div>
    <div><b>A, D</b> - Turn</div>`;

    const updateKeys = ({ type, key }) => {
      const keyDown = type === "keydown";
      const keyLowerCase = key.toLowerCase();

      keyLowerCase === "w" && (this.up = keyDown);
      keyLowerCase === "s" && (this.down = keyDown);
      keyLowerCase === "a" && (this.left = keyDown);
      keyLowerCase === "d" && (this.right = keyDown);
    };

    document.addEventListener("keydown", updateKeys);
    document.addEventListener("keyup", updateKeys);

    if (this.canvas instanceof Node) {
      this.element.appendChild(this.canvas);
    }

    this.createMap();

    const start = loop((fps) => this.update(fps));

    start();
  }

  update() {
    this.handleInput();
    this.processGameLogic();
    this.handleCollisions();
    this.updateTurret();
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
    this.physics.update();
    this.physics.checkAll(({ a, b, overlapV }) => {
      if (a === this.playerTurret || b === this.playerTurret) {
        return;
      }

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

  updateTurret() {
    this.playerTurret.setPosition(this.player.x, this.player.y);
    this.playerTurret.setAngle(this.player.angle);
    this.playerTurret.updateAABB();

    const hit = this.physics.raycast(
      this.playerTurret.start,
      this.playerTurret.end,
      (test) => test !== this.player
    );

    if (hit && this.context) {
      this.context.strokeStyle = "#FF0000";
      this.context.beginPath();
      this.context.arc(hit.point.x, hit.point.y, 5, 0, 2 * Math.PI);
      this.context.stroke();
    }
  }

  createPlayer(x, y, size = 13) {
    const player = this.physics.createBox(
      { x: this.scaleX(x), y: this.scaleY(y) },
      this.scaleX(2.6 * size),
      this.scaleX(1.3 * size),
      { angle: 0.2, center: true }
    );

    player.velocity = 0;

    this.playerTurret = this.physics.createLine(
      player,
      { x: player.x + this.scaleX(70), y: player.y },
      { angle: 0.2, isTrigger: true }
    );

    this.playerTurret.translate(this.scaleX(17), 0);

    return player;
  }

  scaleX(x) {
    return (x / 800) * width;
  }

  scaleY(y) {
    return (y / 600) * height;
  }

  createCircle(x, y, radius) {
    this.physics.createCircle(
      { x: this.scaleX(x), y: this.scaleY(y) },
      this.scaleX(radius)
    );
  }

  createEllipse(x, y, radiusX, radiusY, step, angle) {
    this.physics.createEllipse(
      { x: this.scaleX(x), y: this.scaleY(y) },
      this.scaleX(radiusX),
      this.scaleY(radiusY),
      step,
      { angle }
    );
  }

  createPolygon(x, y, points, angle) {
    const scaledPoints = points.map(([pointX, pointY]) => ({
      x: this.scaleX(pointX),
      y: this.scaleY(pointY),
    }));

    return this.physics.createPolygon(
      { x: this.scaleX(x), y: this.scaleY(y) },
      scaledPoints,
      { angle }
    );
  }

  createMap(width = 800, height = 600) {
    // World bounds
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
    this.createEllipse(530, 130, 80, 70, 10, -0.2);
  }
}

module.exports = Tank;
