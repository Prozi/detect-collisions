import { BodyGroup, BodyOptions, BodyType, Vector } from "../model";

import { Vector as SATVector } from "sat";
import { Polygon } from "./polygon";

/**
 * collider - line
 */
export class Line<UserDataType = any> extends Polygon<UserDataType> {
  /**
   * line type
   */
  readonly type: BodyType.Line = BodyType.Line;

  /**
   * faster than type
   */
  readonly typeGroup: BodyGroup.Line = BodyGroup.Line;

  /**
   * line is convex
   */
  readonly isConvex = true;

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
      options,
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

  /**
   * @param position
   */
  set start({ x, y }: Vector) {
    this.x = x;
    this.y = y;
  }

  get end(): Vector {
    return {
      x: this.x + this.calcPoints[1].x,
      y: this.y + this.calcPoints[1].y,
    };
  }

  /**
   * @param position
   */
  set end({ x, y }: Vector) {
    this.points[1].x = x - this.start.x;
    this.points[1].y = y - this.start.y;
    this.setPoints(this.points);
  }

  getCentroid(): SATVector {
    return new SATVector(
      (this.end.x - this.start.x) / 2,
      (this.end.y - this.start.y) / 2,
    );
  }

  /**
   * do not attempt to use Polygon.updateIsConvex()
   */
  protected updateIsConvex(): void {
    return;
  }
}
