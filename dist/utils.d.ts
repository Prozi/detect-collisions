import { Vector as SATVector } from "sat";
import { Line } from "./bodies/line";
import { Circle } from "./bodies/circle";
import { Body, BodyOptions, PotentialVector, Vector } from "./model";
import { Polygon } from "./bodies/polygon";
import { BBox } from "rbush";
export declare function createEllipse(radiusX: number, radiusY?: number, step?: number): SATVector[];
/**
 * creates box polygon points
 */
export declare function createBox(width: number, height: number): SATVector[];
/**
 * ensure returns a Vector
 */
export declare function ensureVectorPoint(point?: PotentialVector): SATVector;
/**
 * ensure correct counterclockwise points
 */
export declare function ensurePolygonPoints(points: PotentialVector[]): SATVector[];
/**
 * get distance between two {x, y} points
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
export declare function updateAABB(body: Body, bounds: BBox): void;
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
//# sourceMappingURL=utils.d.ts.map