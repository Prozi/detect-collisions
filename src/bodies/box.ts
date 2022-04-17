import { Types, Vector } from "../model";
import { createBox } from "../utils";
import { Polygon } from "./polygon";

/**
 * collider - box
 */
export class Box extends Polygon {
  readonly type: Types.Box | Types.Point = Types.Box;

  private _width: number;
  private _height: number;

  /**
   * collider - box
   * @param {Vector} position {x, y}
   * @param {number} width
   * @param {number} height
   */
  constructor(position: Vector, width: number, height: number) {
    super(position, createBox(width, height));

    this._width = width;
    this._height = height;
  }

  /**
   * get box width
   */
  get width(): number {
    return this._width;
  }

  /**
   * set box width, update points
   */
  set width(width: number) {
    this._width = width;

    this.setPoints(createBox(this._width, this._height));
  }

  /**
   * get box height
   */
  get height(): number {
    return this._height;
  }

  /**
   * set box height, update points
   */
  set height(height: number) {
    this._height = height;

    this.setPoints(createBox(this._width, this._height));
  }

  getCentroidWithoutRotation(): Vector {
    // reset angle for get centroid
    const angle = this.angle;

    this.setAngle(0);

    const centroid: Vector = this.getCentroid();

    // revert angle change
    this.setAngle(angle);

    return centroid;
  }

  /**
   * reCenters the box anchor
   */
  center(): void {
    const firstPoint: Vector = this.points[0];

    // skip if has original points translated already
    if (firstPoint.x !== 0 || firstPoint.y !== 0) {
      return;
    }

    const { x, y } = this.getCentroidWithoutRotation();

    this.translate(-x, -y);
    this.setPosition(this.pos.x + x, this.pos.y + y);
  }
}
