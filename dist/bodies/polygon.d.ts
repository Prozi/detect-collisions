import SAT from "sat";
import { BBox } from "rbush";
import { System } from "../system";
import { ICollider, Types, Vector } from "../model";
/**
 * collider - polygon
 */
export declare class Polygon extends SAT.Polygon implements BBox, ICollider {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
    /**
     * static bodies don't move but they collide
     */
    isStatic?: boolean;
    /**
     * trigger bodies move but are like ghosts
     */
    isTrigger?: boolean;
    /**
     * reference to collision system
     */
    system?: System;
    readonly type: Types.Polygon | Types.Box | Types.Point;
    /**
     * collider - polygon
     * @param {Vector} position {x, y}
     * @param {Vector[]} points
     */
    constructor(position: Vector, points: Vector[]);
    get x(): number;
    /**
     * updating this.pos.x by this.x = x updates AABB
     */
    set x(x: number);
    get y(): number;
    /**
     * updating this.pos.y by this.y = y updates AABB
     */
    set y(y: number);
    /**
     * update position
     * @param {number} x
     * @param {number} y
     */
    setPosition(x: number, y: number): void;
    /**
     * Updates Bounding Box of collider
     */
    updateAABB(): void;
    /**
     * Draws collider on a CanvasRenderingContext2D's current path
     * @param {CanvasRenderingContext2D} context The canvas context to draw on
     */
    draw(context: CanvasRenderingContext2D): void;
}
//# sourceMappingURL=polygon.d.ts.map