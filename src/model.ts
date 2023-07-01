import { BBox, default as RBush } from "rbush";
import {
  Response,
  Vector as SATVector,
  Polygon as SATPolygon,
  Circle as SATCircle,
} from "sat";

import { Box } from "./bodies/box";
import { Circle } from "./bodies/circle";
import { Ellipse } from "./bodies/ellipse";
import { Line } from "./bodies/line";
import { Point } from "./bodies/point";
import { Polygon } from "./bodies/polygon";
import { System } from "./system";

export { Polygon as DecompPolygon, Point as DecompPoint } from "poly-decomp";
export { RBush, BBox, Response, SATVector, SATPolygon, SATCircle };

/**
 * types
 */
export enum BodyType {
  Ellipse = "Ellipse",
  Line = "Line",
  Circle = "Circle",
  Box = "Box",
  Point = "Point",
  Polygon = "Polygon",
}

/**
 * body with children (rbush)
 */
export type Leaf<TBody extends Body> = TBody & {
  children?: Leaf<TBody>[];
};

/**
 * rbush data
 */
export interface ChildrenData<TBody extends Body> {
  children: Leaf<TBody>[];
}

/**
 * for use of private function of sat.js
 */
export interface Data<TBody extends Body> {
  data: ChildrenData<TBody>;
}

/**
 * BodyOptions for body creation
 */
export interface BodyOptions {
  /**
   * system.separate() doesn't move this body
   */
  isStatic?: boolean;

  /**
   * system.separate() doesn't trigger collision of this body
   */
  isTrigger?: boolean;

  /**
   * is body offset centered for rotation purpouses
   */
  isCentered?: boolean;

  /**
   * body angle in radians use deg2rad to convert
   */
  angle?: number;

  /**
   * BHV padding for bounding box, preventing costly updates
   */
  padding?: number;
}

/**
 * system.raycast(from, to) result
 */
export interface RaycastHit<TBody> {
  point: Vector;
  body: TBody;
}

/**
 * potential vector
 */
export interface PotentialVector {
  x?: number;
  y?: number;
}

/**
 * x, y vector
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
 * each body contains those regardless of type
 */
export interface BodyProps<TBody extends Body = Body>
  extends Required<BodyOptions> {
  /**
   * type of body
   */
  readonly type: BodyType;

  /**
   * flag to show is it a convex body or non convex polygon
   */
  isConvex: boolean;

  /**
   * bounding box cache, without padding
   */
  bbox: BBox;

  /**
   * each body may have offset from center
   */
  offset: SATVector;

  /**
   * collisions system reference
   */
  system?: System<TBody>;

  /**
   * was the body modified and needs update in the next checkCollision
   */
  dirty: boolean;

  /**
   * scale getter (x)
   */
  get scaleX(): number;

  /**
   * scale getter (y = x for Circle)
   */
  get scaleY(): number;

  /**
   * update position, and cached convexes positions
   */
  setPosition(x: number, y: number): Circle | SATPolygon;

  /**
   * for setting scale
   */
  setScale(x: number, y?: number): Circle | SATPolygon;

  /**
   * for setting angle
   */
  setAngle(angle: number): Circle | SATPolygon;

  /**
   * for setting offset from center
   */
  setOffset(offset: Vector): Circle | SATPolygon;

  /**
   * draw the bounding box
   */
  drawBVH(context: CanvasRenderingContext2D): void;

  /**
   * draw the collider
   */
  draw(context: CanvasRenderingContext2D): void;

  /**
   * return bounding box without padding
   */
  getAABBAsBBox(): BBox;
}

export type SATTest<
  T extends {} = Circle | Polygon | SATPolygon,
  Y extends {} = Circle | Polygon | SATPolygon
> = (bodyA: T, bodyB: Y, response: Response) => boolean;
