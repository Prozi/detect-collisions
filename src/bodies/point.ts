import { Box } from "./box";
import { BodyOptions, PotentialVector, Types } from "../model";
import { ensureVectorPoint } from "../utils";

/**
 * collider - point (very tiny box)
 */
export class Point extends Box {
  readonly type: Types.Point = Types.Point;

  /**
   * collider - point (very tiny box)
   * @param {PotentialVector} position {x, y}
   */
  constructor(position: PotentialVector, options?: BodyOptions) {
    super(ensureVectorPoint(position), 0.1, 0.1, options);
  }
}
