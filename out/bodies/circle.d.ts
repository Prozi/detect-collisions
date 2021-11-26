import SAT from "sat";
import { ICollider, Types, Vector } from "../model";
/**
 * collider - circle
 */
export declare class Circle extends SAT.Circle implements ICollider {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
    isStatic?: boolean;
    isTrigger?: boolean;
    readonly type: Types;
    /**
     * collider - circle
     * @param {Vector} position {x, y}
     * @param {number} radius
     */
    constructor(position: Vector, radius: number);
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
//# sourceMappingURL=circle.d.ts.map