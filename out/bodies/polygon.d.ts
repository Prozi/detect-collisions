import SAT from "sat";
import { ICollider, Types, Vector } from "../model";
/**
 * collider - polygon
 */
export declare class Polygon extends SAT.Polygon implements ICollider {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
    isStatic?: boolean;
    isTrigger?: boolean;
    readonly type: Types;
    /**
     * collider - polygon
     * @param {Vector} position {x, y}
     * @param {Vector[]} points
     */
    constructor(position: Vector, points: Vector[]);
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