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
    isStatic?: boolean;
    isTrigger?: boolean;
    system?: System;
    readonly type: Types.Polygon | Types.Box | Types.Point;
    /**
     * collider - polygon
     * @param {Vector} position {x, y}
     * @param {Vector[]} points
     */
    constructor(position: Vector, points: Vector[]);
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