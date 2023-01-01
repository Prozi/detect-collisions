import { BBox } from "rbush";
import { Vector as SATVector } from "sat";
import { Circle } from "./bodies/circle";
import { Line } from "./bodies/line";
import { Polygon } from "./bodies/polygon";
import { Body, BodyOptions, PotentialVector, SATPolygon, TestFunction, Vector } from "./model";
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
export declare function bodyMoved(body: Body): boolean;
export declare function intersectAABB(a: BBox, b: BBox): boolean;
export declare function checkAInB(a: BBox, b: BBox): boolean;
export declare function clonePointsArray(points: SATVector[]): Vector[];
/**
 * draws dashed line on canvas context
 */
export declare function dashLineTo(context: CanvasRenderingContext2D, fromX: number, fromY: number, toX: number, toY: number, dash?: number, gap?: number): void;
export declare function intersectLineCircle(line: Line, circle: Circle): Vector[];
export declare function intersectLineLine(line1: Line, line2: Line): Vector | null;
/**
 * check if line (ray) intersects polygon
 */
export declare function intersectLinePolygon(line: Line, polygon: Polygon): Vector[];
/**
 * change format from poly-decomp to SAT.js
 */
export declare function mapVectorToArray({ x, y }: Vector): number[];
/**
 * change format from SAT.js to poly-decomp
 */
export declare function mapArrayToVector([x, y]: number[]): Vector;
/**
 * replace body with array of related convex polygons
 */
export declare function ensureConvex(body: Body): Body[];
/**
 * given 2 bodies calculate vector of bounce assuming equal mass and they are circles
 */
export declare function getBounceDirection(body: Vector, collider: Vector): Vector;
export declare function getSATFunction(body: Body, wall: Body): TestFunction;
export declare function drawPolygon(context: CanvasRenderingContext2D, { pos, calcPoints }: Pick<Polygon | SATPolygon, "pos" | "calcPoints">, isTrigger?: boolean): void;
//# sourceMappingURL=utils.d.ts.map