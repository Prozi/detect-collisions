import SAT from "sat";
import { ICollider, Types, Vector } from "../model";
/**
 * collider - point (very tiny box)
 */
export declare class Point extends SAT.Polygon implements ICollider {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
    isStatic?: boolean;
    isTrigger?: boolean;
    readonly type: Types;
    /**
     * collider - point (very tiny box)
     * @param {Vector} position {x, y}
     */
    constructor(position: Vector);
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
//# sourceMappingURL=point.d.ts.map