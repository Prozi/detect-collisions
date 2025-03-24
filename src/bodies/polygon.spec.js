describe("GIVEN Polygon", () => {
  it("THEN you need at least one point to create", () => {
    const { Polygon } = require("../../src");

    const nullPoints = () => new Polygon({});
    const zeroPoints = () => new Polygon({}, []);
    const onePoint = () => new Polygon({}, [{}]);

    expect(nullPoints).toThrow();
    expect(zeroPoints).toThrow();
    expect(onePoint).not.toThrow();
  });

  it("THEN you can set position by setting x & y", () => {
    const { Polygon } = require("../../src");

    const poly = new Polygon({}, [{}]);

    poly.x = 10;
    poly.y = 10;

    expect(poly.pos.x).toBe(10);
    expect(poly.pos.y).toBe(10);
  });

  it("THEN you can set position by setPosition()", () => {
    const { Polygon } = require("../../src");

    const poly = new Polygon({}, [{}]);

    poly.setPosition(10, 10);

    expect(poly.pos.x).toBe(10);
    expect(poly.pos.y).toBe(10);
  });

  it("THEN setPosition() by default leaves a clean body", () => {
    const { Polygon } = require("../../src");

    const poly = new Polygon({}, [{}]);

    poly.setPosition(10, 10);
    expect(poly.dirty).toBe(false);
  });

  it("THEN setAngle() by default leaves a clean body", () => {
    const { Polygon } = require("../../src");

    const poly = new Polygon({}, [{}]);

    poly.setAngle(Math.PI);
    expect(poly.dirty).toBe(false);
  });

  it("THEN setOffset() by default leaves a clean body", () => {
    const { Polygon } = require("../../src");

    const poly = new Polygon({}, [{}]);

    poly.setOffset(10);
    expect(poly.dirty).toBe(false);
  });

  it("THEN setScale() by default leaves a clean body", () => {
    const { Polygon } = require("../../src");

    const poly = new Polygon({}, [{}]);

    poly.setScale(5);
    expect(poly.dirty).toBe(false);
  });

  it("THEN setPosition() doesn't make bbox missed in checkCollision()", () => {
    const { System } = require("../../src");

    const system = new System();
    const poly = system.createPolygon({}, [
      { x: 0, y: 0 },
      { x: 10, y: 0 },
      { x: 10, y: 10 },
      { x: 0, y: 10 },
    ]);

    system.createBox({}, 100, 100, { isStatic: true });

    expect(system.checkOne(poly)).toBe(true);
    poly.setPosition(200, 200);
    expect(system.checkOne(poly)).toBe(false);
  });

  it("THEN setAngle() doesn't make bbox missed in checkCollision()", () => {
    const { System, deg2rad } = require("../../src");

    const system = new System();
    const poly = system.createPolygon({ x: -10, y: -10 }, [
      { x: 0, y: 0 },
      { x: 10, y: 0 },
      { x: 10, y: 10 },
      { x: 0, y: 10 },
    ]);

    system.createBox({}, 100, 100, { isStatic: true });

    expect(system.checkOne(poly)).toBe(true);
    poly.setAngle(deg2rad(45));
    expect(system.checkOne(poly)).toBe(false);
  });

  it("THEN setOffset() doesn't make bbox missed in checkCollision()", () => {
    const { System } = require("../../src");

    const system = new System();
    const poly = system.createPolygon({}, [
      { x: 0, y: 0 },
      { x: 10, y: 0 },
      { x: 10, y: 10 },
      { x: 0, y: 10 },
    ]);

    system.createBox({}, 100, 100, { isStatic: true });

    expect(system.checkOne(poly)).toBe(true);
    poly.setOffset(-20, -20);
    expect(system.checkOne(poly)).toBe(false);
  });

  it("THEN setScale() doesn't make bbox missed in checkCollision()", () => {
    const { System } = require("../../src");

    const system = new System();
    const poly = system.createPolygon({ x: -5, y: -5 }, [
      { x: 0, y: 0 },
      { x: 10, y: 0 },
      { x: 10, y: 10 },
      { x: 0, y: 10 },
    ]);

    system.createBox({}, 100, 100, { isStatic: true });

    expect(system.checkOne(poly)).toBe(true);
    poly.setScale(0.1);
    expect(system.checkOne(poly)).toBe(false);
  });

  describe("AND you set options", () => {
    it("THEN the parameters are set", () => {
      const { System } = require("../../src");

      const physics = new System();
      const body = physics.createPolygon({}, [{}], {
        isStatic: true,
        isTrigger: true,
      });

      expect(body.isStatic).toBe(true);
      expect(body.isTrigger).toBe(true);
    });
  });

  let polygonPoints;

  beforeEach(() => {
    polygonPoints = [
      {
        x: 2,
        y: 5,
      },
      {
        x: 180,
        y: -59,
      },
      {
        x: 177,
        y: -69,
      },
      {
        x: -2,
        y: -5,
      },
    ];
  });

  describe("AND has clockwise points", () => {
    it("THEN it collides properly", () => {
      const { System } = require("../../src");

      const physics = new System();
      const circle = physics.createCircle(
        {
          x: -1311,
          y: 1642,
        },
        3,
      );

      const polygon = physics.createPolygon(
        {
          x: -1418,
          y: 1675,
        },
        polygonPoints,
      );

      expect(physics.checkCollision(circle, polygon)).toBe(true);
    });
  });

  describe("AND has counter-clockwise points", () => {
    it("THEN it collides properly", () => {
      const { System } = require("../../src");

      const physics = new System();
      const circle = physics.createCircle(
        {
          x: -1311,
          y: 1642,
        },
        3,
      );

      const polygon = physics.createPolygon(
        {
          x: -1418,
          y: 1675,
        },
        polygonPoints.reverse(),
      );

      expect(physics.checkCollision(circle, polygon)).toBe(true);
    });
  });

  describe("AND is concave (not convex) polygon", () => {
    it("THEN it collides properly", () => {
      const { System } = require("../../src");

      const physics = new System();
      const concave = physics.createPolygon({ x: 0, y: 0 }, [
        { x: 190, y: 147 },
        { x: 256, y: 265 },
        { x: 400, y: 274 },
        { x: 360, y: 395 },
        { x: 80, y: 350 },
      ]);
      const convex = physics.createPolygon({ x: 0, y: 0 }, [
        { x: 273, y: 251 },
        { x: 200, y: 120 },
        { x: 230, y: 40 },
        { x: 320, y: 10 },
        { x: 440, y: 86 },
        { x: 440, y: 220 },
      ]);

      const collide = physics.checkCollision(concave, convex);

      expect(collide).toBe(false);
    });

    it("THEN it collides properly", () => {
      const { System } = require("../../src");

      const physics = new System();
      const concave = physics.createPolygon({ x: 0, y: 0 }, [
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
      ]);
      const convex = physics.createCircle({ x: 0, y: 7 }, 1);
      const collide = physics.checkCollision(concave, convex);

      expect(collide).toBe(true);
    });

    it("THEN it collides properly when rotated", () => {
      const { System } = require("../../src");

      const physics = new System();
      const concave = physics.createPolygon(
        { x: 0, y: 0 },
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
        ].map(({ x, y }) => {
          return { x: x * -1, y: y * -1 };
        }),
      );
      concave.setAngle(Math.PI);
      const convex = physics.createCircle({ x: 0, y: 7 }, 1);
      const collide = physics.checkCollision(concave, convex);

      expect(collide).toBe(true);
    });
  });

  describe("AND you scale it", () => {
    it("THEN it rescales properly", () => {
      const { System } = require("../../src");

      const physics = new System();
      const polygon = physics.createPolygon({ x: 0, y: 0 }, [
        { x: -10, y: -10 },
        { x: -10, y: 10 },
        { x: 10, y: 10 },
        { x: 10, y: -10 },
      ]);
      const circle = physics.createCircle({ x: -5, y: 0 }, 1);

      for (let i = 0; i < 10; i++) {
        polygon.setScale(Math.random());
      }

      // Make sure minX isn't -10 * 0.3 * 0.3
      polygon.setScale(0.3);

      const { minX, minY, maxX, maxY } = polygon.getAABBAsBBox();
      const collide = physics.checkCollision(polygon, circle);

      expect(minX).toBe(-3);
      expect(minY).toBe(-3);
      expect(maxX).toBe(3);
      expect(maxY).toBe(3);
      expect(collide).toBe(false);
    });

    it("THEN it rescales properly with rotation", () => {
      const { System } = require("../../src");

      const physics = new System();
      const polygon = physics.createPolygon({ x: 0, y: 0 }, [
        { x: -10, y: -10 },
        { x: -10, y: 10 },
        { x: 10, y: 10 },
        { x: 10, y: -10 },
      ]);

      // Make sure that pointsBackup is assigned
      polygon.setScale(1);
      // ~45deg
      polygon.rotate(0.7854);
      polygon.setScale(0.5);

      const { minX } = polygon.getAABBAsBBox();

      expect(minX).not.toBe(-5);
    });

    it("THEN it rescales properly with angle", () => {
      const { System } = require("../../src");

      const physics = new System();
      const polygon = physics.createPolygon({ x: 0, y: 0 }, [
        { x: -10, y: -10 },
        { x: -10, y: 10 },
        { x: 10, y: 10 },
        { x: 10, y: -10 },
      ]);

      // Make sure that pointsBackup is assigned
      polygon.setScale(1);
      // ~45deg
      polygon.setAngle(0.7854);
      polygon.setScale(0.5);

      const { minX } = polygon.getAABBAsBBox();

      expect(minX).not.toBe(-5);
    });

    it("THEN you can get and set scale, scaleX, scaleY", () => {
      const { System } = require("../../src");

      const physics = new System();
      const polygon = physics.createPolygon({ x: 0, y: 0 }, [
        { x: -10, y: -10 },
        { x: -10, y: 10 },
        { x: 10, y: 10 },
        { x: 10, y: -10 },
      ]);

      polygon.scale = 4;
      expect(polygon.scale).toBe(4);

      polygon.setScale(2, 3);
      expect(polygon.scaleX).toBe(2);
      expect(polygon.scaleY).toBe(3);
    });

    it("THEN isSimple works correctly for example polygons", () => {
      const { Polygon } = require("../../src");

      const simpleConvex = new Polygon({}, [
        { x: 144.890625, y: 389.609375 },
        { x: 144.890625, y: 211.6875 },
        { x: 289.6171875, y: 231.3203125 },
        { x: 297.53125, y: 407.0859375 },
      ]);
      const simpleConcave = new Polygon({}, [
        { x: 144.890625, y: 389.609375 },
        { x: 144.890625, y: 211.6875 },
        { x: 289.6171875, y: 231.3203125 },
        { x: 297.53125, y: 407.0859375 },
        { x: 223.2890625, y: 303.015625 },
      ]);
      const selfIntersecting = new Polygon({}, [
        { x: 124.1953125, y: 209.5546875 },
        { x: 276.203125, y: 396.7109375 },
        { x: 99.5546875, y: 363.4140625 },
        { x: 305.1015625, y: 215.703125 },
      ]);

      expect(simpleConvex.isConvex).toBe(true);
      expect(simpleConvex.isSimple()).toBe(true);

      expect(simpleConcave.isConvex).toBe(false);
      expect(simpleConcave.isSimple()).toBe(true);

      expect(selfIntersecting.isSimple()).toBe(false);
    });
  });

  describe("AND you set group", () => {
    it("THEN only collides with matching group", () => {
      const { System } = require("../../src");

      const dec = binary => Number(`0b${binary}`.replace(/\s/g, ""));

      const physics = new System();

      const a = physics.createPolygon(
        { x: 0, y: 0 },
        [
          { x: 0, y: 0 },
          { x: 10, y: 0 },
          { x: 10, y: 10 },
          { x: 0, y: 10 },
        ],
        {
          group:
            (dec("0000 0000 0000 0001") << 16) | dec("0000 0000 0000 0001"),
        },
      );
      const b = physics.createPolygon(
        { x: 0, y: 0 },
        [
          { x: 0, y: 0 },
          { x: 10, y: 0 },
          { x: 10, y: 10 },
          { x: 0, y: 10 },
        ],
        {
          group:
            (dec("0000 0000 0000 0010") << 16) | dec("0000 0000 0000 0010"),
        },
      );

      let collisions = 0;

      physics.checkAll(() => {
        collisions++;
      });

      expect(collisions).toBe(0);

      a.group = (dec("0000 0000 0000 0001") << 16) | dec("0000 0000 0000 0011");
      b.group = (dec("0000 0000 0000 0010") << 16) | dec("0000 0000 0000 0011");

      physics.checkAll(() => {
        collisions++;
      });

      expect(collisions).toBe(2);
    });
  });

  it("THEN not setting userData works", () => {
    const { System } = require("../../src");

    const physics = new System();
    const polygon = physics.createPolygon({}, [{}]);

    expect(polygon.userData).toBe(undefined);
  });

  it("THEN setting userData works", () => {
    const { System } = require("../../src");

    const physics = new System();
    const polygon = physics.createPolygon({}, [{}], {
      userData: { thank: "you" },
    });

    expect(polygon.userData.thank).toBe("you");
  });

  it("THEN setting userData to falsy values works", () => {
    const { System } = require("../../src");

    const physics = new System();
    const polygonFalse = physics.createPolygon({}, [{}], {
      userData: false,
    });
    const polygonNull = physics.createPolygon({}, [{}], {
      userData: null,
    });

    expect(polygonFalse.userData).toBe(false);
    expect(polygonNull.userData).toBe(null);
  });

  it("THEN isCentered is reversible with angle", () => {
    const { Polygon } = require("../../src");

    const pos = { x: 100, y: 50 };
    const points = [{ x: 40, y: 20 }, { x: 200, y: 100 }, { x: 100, y: 60 }];
    const angle = Math.PI / 7;

    const polygon1 = new Polygon(pos, points, {
      isCentered: false,
      angle,
    });
    const polygon2 = new Polygon(pos, points, {
      isCentered: true,
      angle,
    });

    expect(polygon1.points).not.toStrictEqual(polygon2.points);

    polygon1.isCentered = true;
    // both centered same way
    expect(polygon1.points).toStrictEqual(polygon2.points);

    polygon2.isCentered = false;
    expect(polygon1.points).not.toStrictEqual(polygon2.points);

    polygon1.isCentered = false;
    // both uncentered same way
    expect(polygon1.points).toStrictEqual(polygon2.points);
  });
});
