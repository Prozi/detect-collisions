const { System, mapVectorToArray } = require("../../dist");
const { width, height, loop } = require("./canvas");

class Tank {
  constructor() {
    this.physics = new System();
    this.bodies = [];
    this.player = this.createPlayer(400, 300);

    this.createPolygon(
      300,
      300,
      [
        { x: -11.25, y: -6.76 },
        { x: -12.5, y: -6.76 },
        { x: -12.5, y: 6.75 },
        { x: -3.1, y: 6.75 },
        { x: -3.1, y: 0.41 },
        { x: -2.35, y: 0.41 },
        { x: -2.35, y: 6.75 },
        { x: 0.77, y: 6.75 },
        { x: 0.77, y: 7.5 },
        { x: -13.25, y: 7.5 },
        { x: -13.25, y: -7.51 },
        { x: -11.25, y: -7.51 },
      ]
        .map(mapVectorToArray)
        .map(([x, y]) => [x * 10, y * 10])
    );

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

    loop((timeScale) => this.update(timeScale));
  }

  update(timeScale) {
    this.handleInput(timeScale);
    this.processGameLogic();
    this.handleCollisions();
    this.updateTurret();
  }

  handleInput(timeScale) {
    if (this.up) {
      this.player.velocity += 0.2 * timeScale;
    }

    if (this.down) {
      this.player.velocity -= 0.2 * timeScale;
    }

    if (this.left) {
      this.player.setAngle(this.player.angle - 0.03 * timeScale);
    }

    if (this.right) {
      this.player.setAngle(this.player.angle + 0.03 * timeScale);
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
      this.player.setPosition(
        this.player.x + x * this.player.velocity,
        this.player.y + y * this.player.velocity
      );
    }
  }

  handleCollisions() {
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
    this.playerTurret.setAngle(this.player.angle);
    this.playerTurret.setPosition(this.player.x, this.player.y);

    const hit = this.physics.raycast(
      this.playerTurret.start,
      this.playerTurret.end,
      (test) => test !== this.player
    );

    this.drawCallback = () => {
      if (hit) {
        this.context.strokeStyle = "#FF0000";
        this.context.beginPath();
        this.context.arc(hit.point.x, hit.point.y, 5, 0, 2 * Math.PI);
        this.context.stroke();
      }
    };
  }

  createPlayer(x, y, size = 13) {
    const player = this.physics.createCircle(
      { x: this.scaleX(x), y: this.scaleY(y) },
      this.scaleX(size * 0.67),
      { angle: 0.2, center: true }
    );

    player.velocity = 0;

    this.playerTurret = this.physics.createLine(
      player,
      { x: player.x + this.scaleX(20) + this.scaleY(20), y: player.y },
      { angle: 0.2, isTrigger: true }
    );

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
