import SAT from "sat";
import { PotentialVector, Vector } from "./model";
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
 * returns function to sort raycast results
 * @param {Vector} from
 * @returns {function}
 */
export declare function closest(from: Vector): (a: {
    point: Vector;
} | null, b: {
    point: Vector;
} | null) => number;
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
//# sourceMappingURL=utils.d.ts.map