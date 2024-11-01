import { BodyGroup, BodyOptions, BodyType, PotentialVector } from "../model";

import { ensureVectorPoint } from "../utils";
import { Box } from "./box";

/**
 * collider - point (very tiny box)
 */
export class Point<UserDataType = any> extends Box<UserDataType> {
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
