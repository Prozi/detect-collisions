/// <reference types="sat" />
import RBush from "rbush";
import { Box } from "./bodies/box";
import { Circle } from "./bodies/circle";
import { Ellipse } from "./bodies/ellipse";
import { Line } from "./bodies/line";
import { Point } from "./bodies/point";
import { Polygon } from "./bodies/polygon";
import { Body, BodyOptions, Data, RaycastResult, Response, Vector } from "./model";
/**
 * collision system
 */
export declare class System extends RBush<Body> implements Data {
    data: {
        children: Body[];
    };
    response: Response;
    /**
     * draw bodies
     */
    draw(context: CanvasRenderingContext2D): void;
    /**
     * draw hierarchy
     */
    drawBVH(context: CanvasRenderingContext2D): void;
    /**
     * update body aabb and in tree
     */
    updateBody(body: Body): void;
    /**
     * remove body aabb from collision tree
     */
    remove(body: Body, equals?: (a: Body, b: Body) => boolean): RBush<Body>;
    /**
     * add body aabb to collision tree
     */
    insert(body: Body): RBush<Body>;
    /**
     * update all bodies aabb
     */
    update(): void;
    /**
     * separate (move away) colliders
     */
    separate(): void;
    /**
     * check one collider collisions with callback
     */
    checkOne(body: Body, callback: (response: Response) => void): void;
    /**
     * check all colliders collisions with callback
     */
    checkAll(callback: (response: Response) => void): void;
    /**
     * get object potential colliders
     */
    getPotentials(body: Body): Body[];
    /**
     * check do 2 objects collide
     */
    checkCollision(body: Body, candidate: Body): boolean;
    /**
     * raycast to get collider of ray from start to end
     */
    raycast(start: Vector, end: Vector, allowCollider?: (testCollider: Body) => boolean): RaycastResult;
    createPoint(position: Vector, options?: BodyOptions): Point;
    createLine(start: Vector, end: Vector, options?: BodyOptions): Line;
    createCircle(position: Vector, radius: number, options?: BodyOptions): Circle;
    createBox(position: Vector, width: number, height: number, options?: BodyOptions): Box;
    createEllipse(position: Vector, radiusX: number, radiusY: number, step?: number, options?: BodyOptions): Ellipse;
    createPolygon(position: Vector, points: Vector[], options?: BodyOptions): Polygon;
}
//# sourceMappingURL=system.d.ts.map