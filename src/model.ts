import { BBox } from "rbush";
import SAT from "sat";
import { System } from ".";

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
   * is the collider non moving
   */
  isStatic?: boolean;

  /**
   * is the collider a "trigger"
   */
  isTrigger?: boolean;

  /**
   * collisions system reference
   */
  system?: System;

  /**
   * draw the collider
   */
  draw(context: CanvasRenderingContext2D): void;

  /**
   * should be called only by System.updateBody
   */
  updateAABB(): void;
}
