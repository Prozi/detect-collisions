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
        {
          x: 970,
          y: 270.5033381761426,
        },
        {
          x: 970.0000000000001,
          y: 420.5033381761426,
        },
        {
          x: 969.0000000000001,
          y: 420.5033381761426,
        },
        {
          x: 969.0000000000001,
          y: 530,
        },
        {
          x: 968.7287983217848,
          y: 530,
        },
        {
          x: 968.7287983217848,
          y: 531,
        },
        {
          x: 878.7287983217848,
          y: 531,
        },
        {
          x: 878.7287983217848,
          y: 530,
        },
        {
          x: 844.9555134337561,
          y: 530,
        },
        {
          x: 844.9555134337561,
          y: 531,
        },
        {
          x: 764.9555134337561,
          y: 531,
        },
        {
          x: 764.9555134337561,
          y: 530,
        },
        {
          x: 657.0000000000007,
          y: 530,
        },
        {
          x: 578.5920793286247,
          y: 451.59207932862427,
        },
        {
          x: 564.4499437048937,
          y: 465.73421495235533,
        },
        {
          x: 507.8814012099698,
          y: 409.1656724574315,
        },
        {
          x: 522.0235368337007,
          y: 395.0235368337006,
        },
        {
          x: 472,
          y: 345,
        },
        {
          x: 472,
          y: 344,
        },
        {
          x: 471,
          y: 344,
        },
        {
          x: 470,
          y: 343,
        },
        {
          x: 469,
          y: 344,
        },
        {
          x: 371.93498193881544,
          y: 344,
        },
        {
          x: 371.93498193881544,
          y: 345,
        },
        {
          x: 291.93498193881544,
          y: 345,
        },
        {
          x: 291.93498193881544,
          y: 344,
        },
        {
          x: 263.00000000000006,
          y: 344,
        },
        {
          x: 263,
          y: 225,
        },
        {
          x: 262,
          y: 225,
        },
        {
          x: 262,
          y: 75,
        },
        {
          x: 263,
          y: 75,
        },
        {
          x: 263,
          y: 70,
        },
        {
          x: 289.2059369307241,
          y: 70,
        },
        {
          x: 289.2059369307241,
          y: 50,
        },
        {
          x: 379.2059369307241,
          y: 50,
        },
        {
          x: 379.2059369307241,
          y: 70,
        },
        {
          x: 538.640166274238,
          y: 69.99999999999997,
        },
        {
          x: 538.640166274238,
          y: 67.99999999999997,
        },
        {
          x: 618.640166274238,
          y: 68.00000000000001,
        },
        {
          x: 618.640166274238,
          y: 70.00000000000001,
        },
        {
          x: 823.2657226785277,
          y: 69.99999999999997,
        },
        {
          x: 823.2657226785277,
          y: 67.99999999999997,
        },
        {
          x: 913.2657226785277,
          y: 67.99999999999996,
        },
        {
          x: 913.2657226785277,
          y: 69.99999999999996,
        },
        {
          x: 969,
          y: 69.99999999999994,
        },
        {
          x: 969,
          y: 270.5033381761426,
        },
      ]
        .map(mapVectorToArray)
        .map(([x, y]) => [x * 0.3, y * 0.3])
    );

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
      this.physics.updateBody(this.player);
    }

    if (this.right) {
      this.player.setAngle(this.player.angle + 0.03 * timeScale);
      this.physics.updateBody(this.player);
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
      if (a.isTrigger || b.isTrigger) {
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
    const player =
      Math.random() < 0.5
        ? this.physics.createCircle(
            { x: this.scaleX(x), y: this.scaleY(y) },
            this.scaleX(size / 2),
            { center: true }
          )
        : this.physics.createBox(
            { x: this.scaleX(x - size / 2), y: this.scaleY(y - size / 2) },
            this.scaleX(size),
            this.scaleX(size),
            { center: true }
          );

    player.velocity = 0;
    player.setOffset({ x: -this.scaleX(size / 2), y: 0 });
    player.setAngle(0.2);

    this.physics.updateBody(player);
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
