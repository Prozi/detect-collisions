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
    static intersectLineCircle(line: Line, circle: Circle): Vector[];
    static intersectLineLine(line1: Line, line2: Line): Vector | null;
    /**
     * draw bodies
     * @param {CanvasRenderingContext2D} context
     */
    draw(context: CanvasRenderingContext2D): void;
    /**
     * draw hierarchy
     * @param {CanvasRenderingContext2D} context
     */
    drawBVH(context: CanvasRenderingContext2D): void;
    /**
     * update body aabb and in tree
     * @param {object} body
     */
    updateBody(body: TBody): void;
    /**
     * remove body aabb from collision tree
     * @param body
     * @param equals
     * @returns System
     */
    remove(body: TBody, equals?: (a: TBody, b: TBody) => boolean): RBush<TBody>;
    /**
     * add body aabb to collision tree
     * @param body
     * @returns System
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
     * @param {function} callback
     */
    checkOne(body: TBody, callback: (response: SAT.Response) => void): void;
    /**
     * check all colliders collisions with callback
     * @param {function} callback
     */
    checkAll(callback: (response: SAT.Response) => void): void;
    /**
     * get object potential colliders
     * @param {object} collider
     */
    getPotentials(body: TBody): TBody[];
    /**
     * check do 2 objects collide
     * @param {object} collider
     * @param {object} candidate
     */
    checkCollision(body: TBody, candidate: TBody): boolean;
    /**
     * raycast to get collider of ray from start to end
     * @param {Vector} start {x, y}
     * @param {Vector} end {x, y}
     * @returns {TBody}
     */
    raycast(start: Vector, end: Vector, allowCollider?: (testCollider: TBody) => boolean): RaycastResult;
    /**
     * create point
     * @param {Vector} position {x, y}
     */
    createPoint(position: Vector): Point;
    /**
     * create line
     * @param {Vector} start {x, y}
     * @param {Vector} end {x, y}
     */
    createLine(start: Vector, end: Vector, angle?: number): Line;
    /**
     * create circle
     * @param {Vector} position {x, y}
     * @param {number} radius
     */
    createCircle(position: Vector, radius: number): Circle;
    /**
     * create box
     * @param {Vector} position {x, y}
     * @param {number} width
     * @param {number} height
     * @param {number} angle
     */
    createBox(position: Vector, width: number, height: number, angle?: number): Box;
    /**
     * create ellipse
     * @param {Vector} position {x, y}
     * @param {number} radiusX
     * @param {number} radiusY
     * @param {number} step
     * @param {number} angle
     */
    createEllipse(position: Vector, radiusX: number, radiusY: number, step?: number, angle?: number): Ellipse;
    /**
     * create polygon
     * @param {Vector} position {x, y}
     * @param {Vector[]} points
     * @param {number} angle
     */
    createPolygon(position: Vector, points: Vector[], angle?: number): Polygon;
}
//# sourceMappingURL=system.d.ts.map