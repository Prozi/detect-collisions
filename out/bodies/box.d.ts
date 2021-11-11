import SAT from "sat";
import { ICollider, Types, Vector } from "../model";
/**
 * collider - box
 */
export declare class Box extends SAT.Polygon implements ICollider {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
    readonly type: Types;
    /**
     * collider - box
     * @param {Vector} position {x, y}
     * @param {number} width
     * @param {number} height
     */
    constructor(position: Vector, width: number, height: number);
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
