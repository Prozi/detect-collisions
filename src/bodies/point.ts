import { Box } from "./box";
import { Types, Vector } from "../model";
import { ensureVectorPoint } from "../utils";

/**
 * collider - point (very tiny box)
 */
export class Point extends Box {
  readonly type: Types.Point = Types.Point;

  /**
   * collider - point (very tiny box)
   * @param {Vector} position {x, y}
   */
  constructor(position: Vector) {
    super(ensureVectorPoint(position), 0.1, 0.1);
  }
}
