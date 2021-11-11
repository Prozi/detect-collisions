import SAT from "sat";
import RBush from "rbush";
import { ICollider, Vector } from "./model";
import { Box } from "./bodies/box";
import { Circle } from "./bodies/circle";
import { Polygon } from "./bodies/polygon";
import { Point } from "./bodies/point";
/**
 * collision system
 */
export declare class System {
    response: SAT.Response;
    tree: RBush<ICollider>;
    constructor();
    /**
     * getter for all tree bodies
     */
    get bodies(): ICollider[];
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
    updateBody(body: ICollider): void;
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
    checkOne(body: ICollider, callback: (response: SAT.Response) => void): void;
    /**
     * check all colliders collisions with callback
     * @param {function} callback
     */
    checkAll(callback: (response: SAT.Response) => void): void;
    /**
     * get object potential colliders
     * @param {object} collider
     */
    getPotentials(body: ICollider): ICollider[];
    /**
     * check do 2 objects collide
     * @param {object} collider
     * @param {object} candidate
     */
    collides(body: ICollider, candidate: ICollider): boolean;
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
