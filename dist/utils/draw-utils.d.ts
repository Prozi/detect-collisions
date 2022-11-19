import { Body, Data, RBush } from "../model";
import { Polygon } from "../bodies/polygon";
import { Circle } from "../bodies/circle";
/**
 * draws dashed line on canvas context
 */
export declare function dashLineTo(context: CanvasRenderingContext2D, fromX: number, fromY: number, toX: number, toY: number, dash?: number, gap?: number): void;
/**
 * draw bodies
 */
export declare function draw(system: RBush<Body>, context: CanvasRenderingContext2D): void;
/**
 * draw hierarchy
 */
export declare function drawBVH(system: RBush<Body> & Data, context: CanvasRenderingContext2D): void;
/**
 * draw polygon helper function
 */
export declare function drawPolygon(polygon: Polygon, context: CanvasRenderingContext2D): void;
/**
 * draw circle helper function
 */
export declare function drawCircle(circle: Circle, context: CanvasRenderingContext2D): void;
//# sourceMappingURL=draw-utils.d.ts.map