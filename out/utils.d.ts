import SAT from "sat";
import { Vector } from "./model";
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
export declare function ensureVectorPoint(point: Vector): SAT.Vector;
/**
 * ensure correct counterclockwise points
 * @param {SAT.Vector[]} points
 */
export declare function ensurePolygonPoints(points: Vector[]): SAT.Vector[];
/**
 * check direction of polygon
 * @param {SAT.Vector[]} points
 */
export declare function clockwise(points: Vector[]): boolean;
