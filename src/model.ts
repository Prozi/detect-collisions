export { Response } from "sat";
import { Point, Circle, Box, Polygon, System } from ".";

/**
 * types
 */
export enum Types {
  Oval = "Oval",
  Circle = "Circle",
  Box = "Box",
  Point = "Point",
  Polygon = "Polygon",
}

export interface IGetAABBAsBox {
  getAABBAsBox: () => { pos: SAT.Vector; w: number; h: number };
}

export interface IData {
  data: {
    children: TBody[];
  };
}

/**
 * potential vector
 */
export type Vector = { x?: number; y?: number };

/**
 * generic body union type
 */
export type TBody = Point | Circle | Box | Polygon;

/**
 * commonly used
 */
export interface ICollider {
  /**
   * type of collider
   */
  readonly type: Types;

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
