import { BodyGroup, BodyOptions, BodyType, PotentialVector } from "../model";

import { Box } from "./box";
import { ensureVectorPoint } from "../utils";

/**
 * collider - point (very tiny box)
 */
export class Point extends Box {
  /**
   * point type
   */
  readonly type: BodyType.Point = BodyType.Point;

  /**
   * faster than type
   */
  readonly typeGroup: BodyGroup.Point = BodyGroup.Point;

  /**
   * collider - point (very tiny box)
   */
  constructor(position: PotentialVector, options?: BodyOptions) {
    super(ensureVectorPoint(position), 0.001, 0.001, options);
  }
}
