import { BodyOptions, PotentialVector, Types } from "../model";
import { ensureVectorPoint } from "../utils";
import { Box } from "./box";

/**
 * collider - point (very tiny box)
 */
export class Point extends Box {
  readonly type: Types.Point = Types.Point;

  /**
   * collider - point (very tiny box)
   */
  constructor(position: PotentialVector, options?: BodyOptions) {
    super(ensureVectorPoint(position), 0.001, 0.001, options);
  }
}
