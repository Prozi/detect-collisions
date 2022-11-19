import { Box } from "../bodies/box";
import { Circle } from "../bodies/circle";
import { Ellipse } from "../bodies/ellipse";
import { Line } from "../bodies/line";
import { Point } from "../bodies/point";
import { Polygon } from "../bodies/polygon";
import { Body, BodyOptions, Data, PotentialVector, RBush, Vector } from "../model";
/**
 * very base collision system
 */
export declare class BaseSystem extends RBush<Body> implements Data {
    data: {
        children: Body[];
    };
    draw(context: CanvasRenderingContext2D): void;
    drawBVH(context: CanvasRenderingContext2D): void;
    /**
     * create point at position with options and add to system
     */
    createPoint(position: PotentialVector, options?: BodyOptions): Point;
    /**
     * create line at position with options and add to system
     */
    createLine(start: Vector, end: Vector, options?: BodyOptions): Line;
    /**
     * create circle at position with options and add to system
     */
    createCircle(position: PotentialVector, radius: number, options?: BodyOptions): Circle;
    /**
     * create box at position with options and add to system
     */
    createBox(position: PotentialVector, width: number, height: number, options?: BodyOptions): Box;
    /**
     * create ellipse at position with options and add to system
     */
    createEllipse(position: PotentialVector, radiusX: number, radiusY?: number, step?: number, options?: BodyOptions): Ellipse;
    /**
     * create polygon at position with options and add to system
     */
    createPolygon(position: PotentialVector, points: PotentialVector[], options?: BodyOptions): Polygon;
}
//# sourceMappingURL=base-system.d.ts.map