import { BodyGroup, BodyOptions, BodyType, PotentialVector } from "../model";
import { Box } from "./box";
/**
 * collider - point (very tiny box)
 */
export declare class Point extends Box {
  /**
   * point type
   */
  readonly type: BodyType.Point;
  /**
   * faster than type
   */
  readonly typeGroup: BodyGroup.Point;
  /**
   * collider - point (very tiny box)
   */
  constructor(position: PotentialVector, options?: BodyOptions);
}
