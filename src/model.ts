import { BBox } from "rbush";
import SAT from "sat";

export { Response } from "sat";

/**
 * types
 */
export enum Types {
  Circle = "Circle",
  Box = "Box",
  Point = "Point",
  Polygon = "Polygon",
}

/**
 * potential vector
 */
export type Vector = SAT.Vector | { x?: number; y?: number };

/**
 * commonly used
 */
export interface ICollider extends BBox {
  /**
   * type of collider
   */
  type: Types;

  /**
   * draw the collider
   */
  draw(context: CanvasRenderingContext2D): void;

  /**
   * should be called only by System.updateBody
   */
  updateAABB(): void;
}
