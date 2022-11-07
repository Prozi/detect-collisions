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
   * flag to show is it centered
   */
  isCentered?: boolean;

  /**
   * BHV padding (defaults to 0)
   */
  padding: number;

  /**
   * bounding box cache, without padding
   */
  bbox: BBox;

  /**
   * body angle
   */
  angle: number;

  /**
   * collisions system reference
   */
  system?: System;

  /**
   * scale getter (x)
   */
  get scaleX(): number;

  /**
   * scale getter (y = x for Circle)
   */
  get scaleY(): number;

  /**
   * for setting scale
   */
  setScale(x: number, y?: number): void;

  /**
   * for setting angle
   */
  setAngle(angle: number): void;

  /**
   * draw the collider
   */
  draw(context: CanvasRenderingContext2D): void;

  /**
   * should be called only by System.insert
   */
  getAABBAsBBox(): BBox;
}

export interface CollisionState {
  collides: boolean;
  aInB: boolean;
  bInA: boolean;
  overlapV: SATVector;
}

export type TestFunction<T extends Body = any, Y extends Body = any> = (
  a: T,
  b: Y,
  r: Response
) => boolean;
