import { BBox, default as RBush } from "rbush";
import { Response, Vector as SATVector } from "sat";

import { Box } from "./bodies/box";
import { Circle } from "./bodies/circle";
import { Ellipse } from "./bodies/ellipse";
import { Line } from "./bodies/line";
import { Point } from "./bodies/point";
import { Polygon } from "./bodies/polygon";
import { System } from "./system";

export { RBush, BBox, Response, SATVector };

/**
 * types
 */
export enum Types {
  Ellipse = "Ellipse",
  Line = "Line",
  Circle = "Circle",
  Box = "Box",
  Point = "Point",
  Polygon = "Polygon",
}

/**
 * for use of private function of sat.js
 */
export interface Data {
  data: { children: Body[] };
}

export interface BodyOptions {
  isStatic?: boolean;
  isTrigger?: boolean;
  center?: boolean;
  angle?: number;
  padding?: number;
}

/**
 * system.raycast(from, to) result
 */
export type RaycastResult = { point: Vector; collider: Body } | null;

/**
 * potential vector
 */
export interface PotentialVector {
  x?: number;
  y?: number;
}

/**
 * { x, y } vector
 */
export interface Vector extends PotentialVector {
  x: number;
  y: number;
}

/**
 * for use of private function of sat.js
 */
export interface GetAABBAsBox {
  getAABBAsBox(): { pos: Vector; w: number; h: number };
}

/**
 * generic body union type
 */
export type Body = Point | Line | Ellipse | Circle | Box | Polygon;

/**
 * commonly used
 */
export interface Collider {
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
   * BHV padding (defaults to 0)
   */
  padding: number;

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

  /**
   * should be called only by System.updateBody
   */
  getAABBAsBBox(): BBox;
}
