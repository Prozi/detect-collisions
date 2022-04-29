import SAT from "sat";
import { Line } from "./bodies/line";
import { Circle } from "./bodies/circle";
import { PotentialVector, Vector } from "./model";
import { Polygon } from "./bodies/polygon";
export declare function createEllipse(radiusX: number, radiusY?: number, step?: number): SAT.Vector[];
/**
 * creates box polygon points
 * @param {number} width
 * @param {number} height
 * @returns SAT.Vector
 */
export declare function createBox(width: number, height: number): SAT.Vector[];
/**
 * ensure returns a SAT.Vector
 * @param {SAT.Vector} point
 */
export declare function ensureVectorPoint(point?: PotentialVector): SAT.Vector;
/**
 * ensure correct counterclockwise points
 * @param {SAT.Vector[]} points
 */
export declare function ensurePolygonPoints(points: PotentialVector[]): SAT.Vector[];
/**
 * get distance between two {x, y} points
 * @param {Vector} a
 * @param {Vector} b
 * @returns {number}
 */
export declare function distance(a: Vector, b: Vector): number;
/**
 * check direction of polygon
 * @param {SAT.Vector[]} points
 */
export declare function clockwise(points: Vector[]): boolean;
/**
 * draws dashed line on canvas context
 * @param {CanvasRenderingContext2D} context
 * @param {number} fromX
 * @param {number} fromY
 * @param {number} toX
 * @param {number} toY
 * @param {number?} dash
 * @param {number?} gap
 */
export declare function dashLineTo(context: CanvasRenderingContext2D, fromX: number, fromY: number, toX: number, toY: number, dash?: number, gap?: number): void;
export declare function intersectLineCircle(line: Line, circle: Circle): Vector[];
export declare function intersectLineLine(line1: Line, line2: Line): Vector | null;
export declare function intersectLinePolygon(line: Line, polygon: Polygon): Vector[];
//# sourceMappingURL=utils.d.ts.map