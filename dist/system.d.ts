import SAT from "sat";
import RBush from "rbush";
import { TBody, Vector } from "./model";
import { Box, Circle, Point, Polygon } from ".";
/**
 * collision system
 */
export declare class System extends RBush<TBody> {
    response: SAT.Response;
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
     * create point
     * @param {Vector} position {x, y}
     */
    createPoint(position: Vector): Point;
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
     * create polygon
     * @param {Vector} position {x, y}
     * @param {Vector[]} points
     * @param {number} angle
     */
    createPolygon(position: Vector, points: Vector[], angle?: number): Polygon;
}
//# sourceMappingURL=system.d.ts.map