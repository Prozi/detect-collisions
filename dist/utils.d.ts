import { BBox } from "rbush";
import { Point as DecompPoint } from "poly-decomp";
import { Vector as SATVector } from "sat";
import { Circle } from "./bodies/circle";
import { Point } from "./bodies/point";
import { Polygon } from "./bodies/polygon";
import { Body, BodyOptions, PotentialVector, SATPolygon, SATTest, Vector } from "./model";
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
export declare function createEllipse(radiusX: number, radiusY?: number, step?: number): SATVector[];
/**
 * creates box polygon points
 */
export declare function createBox(width: number, height: number): SATVector[];
/**
 * ensure Vector point
 */
export declare function ensureVectorPoint(point?: PotentialVector): SATVector;
/**
 * ensure Vector points (for polygon) in counter-clockwise order
 */
export declare function ensurePolygonPoints(points: PotentialVector[]): SATVector[];
/**
 * get distance between two Vector points
 */
export declare function distance(a: Vector, b: Vector): number;
/**
 * check direction of polygon
 */
export declare function clockwise(points: Vector[]): boolean;
/**
 * used for all types of bodies
 */
export declare function extendBody(body: Body, options?: BodyOptions): void;
/**
 * check if body moved outside of its padding
 */
export declare function bodyMoved(body: Body): boolean;
/**
 * checks if two boxes intersect
 */
export declare function intersectAABB(a: BBox, b: BBox): boolean;
/**
 * checks if body a is in body b
 */
export declare function checkAInB(a: Body, b: Body): boolean;
/**
 * clone sat vector points array into vector points array
 */
export declare function clonePointsArray(points: SATVector[]): Vector[];
/**
 * draws dashed line on canvas context
 */
export declare function dashLineTo(context: CanvasRenderingContext2D, fromX: number, fromY: number, toX: number, toY: number, dash?: number, gap?: number): void;
/**
 * change format from poly-decomp to SAT.js
 */
export declare function mapVectorToArray({ x, y }?: Vector): DecompPoint;
/**
 * change format from SAT.js to poly-decomp
 */
export declare function mapArrayToVector([x, y]?: DecompPoint): Vector;
/**
 * replace body with array of related convex polygons
 */
export declare function ensureConvex<T extends Body = Circle | Point | Polygon>(body: T): (T | SATPolygon)[];
/**
 * given 2 bodies calculate vector of bounce assuming equal mass and they are circles
 */
export declare function getBounceDirection(body: Vector, collider: Vector): Vector;
/**
 * returns correct sat.js testing function based on body types
 */
export declare function getSATTest(body: Body, wall: Body): SATTest;
/**
 * draw polygon
 */
export declare function drawPolygon(context: CanvasRenderingContext2D, { pos, calcPoints, }: Pick<Polygon | SATPolygon, "calcPoints"> & {
    pos: Vector;
}, isTrigger?: boolean): void;
//# sourceMappingURL=utils.d.ts.map