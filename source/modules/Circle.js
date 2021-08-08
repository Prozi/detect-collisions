const Polygon = require("./Polygon");

class Circle extends Polygon {
  /**
   * minimum a pentagon
   * @param {Number} radius
   */
  static createCirclePoints(radius) {
    const steps = Math.max(5, radius / 2);
    const points = [];

    for (let i = 0; i < steps; i++) {
      const r = (2 * Math.PI * i) / steps;

      points.push([Math.cos(r) * radius, Math.sin(r) * radius]);
    }

    return points;
  }

  /**
   * @constructor
   * @param {Number} [x = 0] The starting X coordinate
   * @param {Number} [y = 0] The starting Y coordinate
   * @param {Number} [radius = 0] The radius
   * @param {Number} [scale = 1] The scale
   * @param {Number} [padding = 0] The amount to pad the bounding volume when testing for potential collisions
   */
  constructor(x = 0, y = 0, radius = 0, scale = 1, padding = 0) {
    const points = Circle.createCirclePoints(radius);

    super(x, y, points, 0, scale, scale, padding);

    /**
     * @type {Number}
     */
    this.radius = radius;

    /**
     * @type {Number}
     */
    this.scale = scale;
  }

  set scale(scale) {
    this.scale_x = scale;
    this.scale_y = scale;
  }

  get scale() {
    return {
      x: this.scale_x,
      y: this.scale_y,
    };
  }
}

module.exports = Circle;

module.exports.default = module.exports;
