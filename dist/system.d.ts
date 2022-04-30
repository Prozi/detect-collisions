import SAT from "sat";
import RBush from "rbush";
import { TBody, Vector, RaycastResult } from "./model";
import { Point } from "./bodies/point";
import { Circle } from "./bodies/circle";
import { Box } from "./bodies/box";
import { Polygon } from "./bodies/polygon";
import { Line } from "./bodies/line";
import { Ellipse } from "./bodies/ellipse";
/**
 * collision system
 */
export declare class System extends RBush<TBody> {
    response: SAT.Response;
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
    updateBody(body: TBody): void;
    /**
     * remove body aabb from collision tree
     */
    remove(body: TBody, equals?: (a: TBody, b: TBody) => boolean): RBush<TBody>;
    /**
     * add body aabb to collision tree
     */
    insert(body: TBody): RBush<TBody>;
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
    checkOne(body: TBody, callback: (response: SAT.Response) => void): void;
    /**
     * check all colliders collisions with callback
     */
    checkAll(callback: (response: SAT.Response) => void): void;
    /**
     * get object potential colliders
     */
    getPotentials(body: TBody): TBody[];
    /**
     * check do 2 objects collide
     */
    checkCollision(body: TBody, candidate: TBody): boolean;
    /**
     * raycast to get collider of ray from start to end
     */
    raycast(start: Vector, end: Vector, allowCollider?: (testCollider: TBody) => boolean): RaycastResult;
    createPoint(position: Vector): Point;
    createLine(start: Vector, end: Vector, angle?: number): Line;
    createCircle(position: Vector, radius: number): Circle;
    createBox(position: Vector, width: number, height: number, angle?: number): Box;
    createEllipse(position: Vector, radiusX: number, radiusY: number, step?: number, angle?: number): Ellipse;
    createPolygon(position: Vector, points: Vector[], angle?: number): Polygon;
}
//# sourceMappingURL=system.d.ts.map