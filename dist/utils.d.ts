import SAT from "sat";
import { Line } from "./bodies/line";
import { Circle } from "./bodies/circle";
import { PotentialVector, Vector } from "./model";
import { Polygon } from "./bodies/polygon";
export declare function createEllipse(radiusX: number, radiusY?: number, step?: number): SAT.Vector[];
/**
 * creates box polygon points
 */
export declare function createBox(width: number, height: number): SAT.Vector[];
/**
 * ensure returns a SAT.Vector
 */
export declare function ensureVectorPoint(point?: PotentialVector): SAT.Vector;
/**
 * ensure correct counterclockwise points
 */
export declare function ensurePolygonPoints(points: PotentialVector[]): SAT.Vector[];
/**
 * get distance between two {x, y} points
 */
export declare function distance(a: Vector, b: Vector): number;
/**
 * check direction of polygon
 */
export declare function clockwise(points: Vector[]): boolean;
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