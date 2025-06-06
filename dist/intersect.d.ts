import { Body, SATPolygon, Vector } from './model';
import { Circle } from './bodies/circle';
import { Line } from './bodies/line';
import { Point } from './bodies/point';
import { Polygon } from './bodies/polygon';
/**
 * replace body with array of related convex polygons
 */
export declare function ensureConvex<TBody extends Body = Circle | Point | Polygon>(body: TBody): (TBody | SATPolygon)[];
/**
 * @param polygon
 * @param circle
 */
export declare function polygonInCircle(polygon: Polygon, circle: Pick<Circle, 'pos' | 'r'>): boolean;
export declare function pointInPolygon(point: Vector, polygon: Polygon): boolean;
export declare function polygonInPolygon(polygonA: Polygon, polygonB: Polygon): boolean;
/**
 * https://stackoverflow.com/a/68197894/1749528
 *
 * @param point
 * @param circle
 */
export declare function pointOnCircle(point: Vector, circle: Pick<Circle, 'pos' | 'r'>): boolean;
/**
 * https://stackoverflow.com/a/68197894/1749528
 *
 * @param circle1
 * @param circle2
 */
export declare function circleInCircle(circle1: Pick<Circle, 'pos' | 'r'>, circle2: Pick<Circle, 'pos' | 'r'>): boolean;
/**
 * https://stackoverflow.com/a/68197894/1749528
 *
 * @param circle
 * @param polygon
 */
export declare function circleInPolygon(circle: Pick<Circle, 'pos' | 'r'>, polygon: Polygon): boolean;
/**
 * https://stackoverflow.com/a/68197894/1749528
 *
 * @param circle
 * @param polygon
 */
export declare function circleOutsidePolygon(circle: Pick<Circle, 'pos' | 'r'>, polygon: Polygon): boolean;
/**
 * https://stackoverflow.com/a/37225895/1749528
 *
 * @param line
 * @param circle
 */
export declare function intersectLineCircle(line: Pick<Line, 'start' | 'end'>, { pos, r }: Pick<Circle, 'pos' | 'r'>): Vector[];
/**
 * faster implementation of intersectLineLine
 * https://stackoverflow.com/a/16725715/1749528
 *
 * @param line1
 * @param line2
 */
export declare function intersectLineLineFast(line1: Pick<Line, 'start' | 'end'>, line2: Pick<Line, 'start' | 'end'>): boolean;
/**
 * returns the point of intersection
 * https://stackoverflow.com/a/24392281/1749528
 *
 * @param line1
 * @param line2
 */
export declare function intersectLineLine(line1: Pick<Line, 'start' | 'end'>, line2: Pick<Line, 'start' | 'end'>): Vector | undefined;
export declare function intersectLinePolygon(line: Pick<Line, 'start' | 'end'>, polygon: Polygon): Vector[];
/**
 * @param circle1
 * @param circle2
 */
export declare function intersectCircleCircle(circle1: Circle, circle2: Circle): Vector[];
