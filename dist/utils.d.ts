import {
  BBox,
  Body,
  BodyOptions,
  PotentialVector,
  SATPolygon,
  SATTest,
  Vector,
} from "./model";
import { Response, Vector as SATVector } from "sat";
import { Point as DecompPoint } from "poly-decomp-es";
import { Polygon } from "./bodies/polygon";
export declare const DEG2RAD: number;
export declare const RAD2DEG: number;
/**
 * convert from degrees to radians
 */
export declare function deg2rad(degrees: number): number;
/**
 * convert from radians to degrees
 */
export declare function rad2deg(radians: number): number;
/**
 * creates ellipse-shaped polygon based on params
 */
export declare function createEllipse(
  radiusX: number,
  radiusY?: number,
  step?: number,
): SATVector[];
/**
 * creates box shaped polygon points
 */
export declare function createBox(width: number, height: number): SATVector[];
/**
 * ensure SATVector type point result
 */
export declare function ensureVectorPoint(point?: PotentialVector): SATVector;
/**
 * ensure Vector points (for polygon) in counter-clockwise order
 */
export declare function ensurePolygonPoints(
  points?: PotentialVector[],
): SATVector[];
/**
 * get distance between two Vector points
 */
export declare function distance(bodyA: Vector, bodyB: Vector): number;
/**
 * check [is clockwise] direction of polygon
 */
export declare function clockwise(points: Vector[]): boolean;
/**
 * used for all types of bodies in constructor
 */
export declare function extendBody(body: Body, options?: BodyOptions): void;
/**
 * check if body moved outside of its padding
 */
export declare function bodyMoved(body: Body): boolean;
/**
 * returns true if two boxes not intersect
 */
export declare function notIntersectAABB(bodyA: BBox, bodyB: BBox): boolean;
/**
 * checks if two boxes intersect
 */
export declare function intersectAABB(bodyA: BBox, bodyB: BBox): boolean;
/**
 * checks if two bodies can interact (for collision filtering)
 */
export declare function canInteract(bodyA: Body, bodyB: Body): boolean;
/**
 * checks if body a is in body b
 */
export declare function checkAInB(bodyA: Body, bodyB: Body): boolean;
/**
 * clone sat vector points array into vector points array
 */
export declare function clonePointsArray(points: SATVector[]): Vector[];
/**
 * change format from SAT.js to poly-decomp
 */
export declare function mapVectorToArray({ x, y }?: Vector): DecompPoint;
/**
 * change format from poly-decomp to SAT.js
 */
export declare function mapArrayToVector([x, y]?: DecompPoint): Vector;
/**
 * given 2 bodies calculate vector of bounce assuming equal mass and they are circles
 */
export declare function getBounceDirection(
  body: Vector,
  collider: Vector,
): SATVector;
/**
 * returns correct sat.js testing function based on body types
 */
export declare function getSATTest(bodyA: Body, bodyB: Body): SATTest;
/**
 * draws dashed line on canvas context
 */
export declare function dashLineTo(
  context: CanvasRenderingContext2D,
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  dash?: number,
  gap?: number,
): void;
/**
 * draw polygon
 */
export declare function drawPolygon(
  context: CanvasRenderingContext2D,
  {
    pos,
    calcPoints,
  }: Pick<Polygon | SATPolygon, "calcPoints"> & {
    pos: Vector;
  },
  isTrigger?: boolean,
): void;
/**
 * draw body bounding body box
 */
export declare function drawBVH(
  context: CanvasRenderingContext2D,
  body: Body,
): void;
/**
 * clone response object returning new response with previous ones values
 */
export declare function cloneResponse(response: Response): Response;
/**
 * dummy fn used as default, for optimization
 */
export declare function returnTrue(): boolean;
/**
 * for groups
 */
export declare function getGroup(group: number): number;
/**
 * binary string to decimal number
 */
export declare function bin2dec(binary: string): number;
/**
 * helper for groupBits()
 *
 * @param input - number or binary string
 */
export declare function ensureNumber(input: number | string): number;
/**
 * create group bits from category and mask
 *
 * @param category - category bits
 * @param mask - mask bits (default: category)
 */
export declare function groupBits(
  category: number | string,
  mask?: number | string,
): number;
export declare function move(
  body: Body,
  speed?: number,
  updateNow?: boolean,
): void;
