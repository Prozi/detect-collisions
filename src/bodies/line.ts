import { Types, Vector } from "../model";
import { Polygon } from "./polygon";

/**
 * collider - line
 */
export class Line extends Polygon {
  readonly type: Types.Line = Types.Line;

  /**
   * collider - line from start to end
   * @param {Vector} start {x, y}
   * @param {Vector} end {x, y}
   */
  constructor(start: Vector, end: Vector) {
    // position at middle of (start, end)
    super({ x: (start.x + end.x) / 2, y: (start.y + end.y) / 2 }, [
      // first point at minus half length
      { x: -(end.x - start.x) / 2, y: -(end.y - start.y) / 2 },
      // second point at plus half length
      { x: (end.x - start.x) / 2, y: (end.y - start.y) / 2 },
    ]);

    if (this.calcPoints.length === 1 || !end) {
      console.error({ start, end });

      throw new Error("No end point for line provided");
    }
  }

  get start(): Vector {
    return {
      x: this.x + this.calcPoints[0].x,
      y: this.y + this.calcPoints[0].y,
    };
  }

  get end(): Vector {
    return {
      x: this.x + this.calcPoints[1].x,
      y: this.y + this.calcPoints[1].y,
    };
  }
}
