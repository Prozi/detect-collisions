import { Types, Vector } from "../model";
import { ensureVectorPoint, createBox } from "../utils";
import { Polygon } from "./polygon";

/**
 * collider - box
 */
export class Box extends Polygon {
  width: number;
  height: number;

  readonly type: Types.Box | Types.Point = Types.Box;

  /**
   * collider - box
   * @param {Vector} position {x, y}
   * @param {number} width
   * @param {number} height
   */
  constructor(position: Vector, width: number, height: number) {
    super(ensureVectorPoint(position), createBox(width, height));

    this.width = width;
    this.height = height;
    this.updateAABB();
  }
}
