import { Vector as SATVector } from "sat";

import { BodyOptions, Types, Vector } from "../model";
import { Polygon } from "./polygon";

/**
 * collider - line
 */
export class Line extends Polygon {
  readonly type: Types.Line = Types.Line;

  isConvex = true;

  /**
   * collider - line from start to end
   */
  constructor(start: Vector, end: Vector, options?: BodyOptions) {
    super(
      start,
      [
        { x: 0, y: 0 },
        { x: end.x - start.x, y: end.y - start.y },
      ],
      options
    );

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

  getCentroid(): SATVector {
    return new SATVector(
      (this.end.x - this.start.x) / 2,
      (this.end.y - this.start.y) / 2
    );
  }

  /**
   * do not attempt to use Polygon.updateIsConvex()
   */
  protected updateIsConvex(): void {
    return;
  }
}
