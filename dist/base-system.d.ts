import RBush from "rbush";
import { Box } from "./bodies/box";
import { Circle } from "./bodies/circle";
import { Ellipse } from "./bodies/ellipse";
import { Line } from "./bodies/line";
import { Point } from "./bodies/point";
import { Polygon } from "./bodies/polygon";
import { Body, BodyOptions, Data, Vector } from "./model";
/**
 * very base collision system
 */
export declare class BaseSystem extends RBush<Body> implements Data {
    data: {
        children: Body[];
    };
    /**
     * draw bodies
     */
    draw(context: CanvasRenderingContext2D): void;
    /**
     * draw hierarchy
     */
    drawBVH(context: CanvasRenderingContext2D): void;
    /**
     * create point at position with options and add to system
     */
    createPoint(position: Vector, options?: BodyOptions): Point;
    /**
     * create line at position with options and add to system
     */
    createLine(start: Vector, end: Vector, options?: BodyOptions): Line;
    /**
     * create circle at position with options and add to system
     */
    createCircle(position: Vector, radius: number, options?: BodyOptions): Circle;
    /**
     * create box at position with options and add to system
     */
    createBox(position: Vector, width: number, height: number, options?: BodyOptions): Box;
    /**
     * create ellipse at position with options and add to system
     */
    createEllipse(position: Vector, radiusX: number, radiusY: number, step?: number, options?: BodyOptions): Ellipse;
    /**
     * create polygon at position with options and add to system
     */
    createPolygon(position: Vector, points: Vector[], options?: BodyOptions): Polygon;
}
//# sourceMappingURL=base-system.d.ts.map