import { BBox } from "rbush";
import SAT from "sat";
export { Response } from "sat";
/**
 * types
 */
export declare enum Types {
    Circle = "Circle",
    Box = "Box",
    Point = "Point",
    Polygon = "Polygon"
}
/**
 * potential vector
 */
export declare type Vector = SAT.Vector | {
    x?: number;
    y?: number;
};
/**
 * commonly used
 */
export interface ICollider extends BBox {
    /**
     * type of collider
     */
    type: Types;
    /**
     * is the collider non moving
     */
    isStatic?: boolean;
    /**
     * is the collider a "trigger"
     */
    isTrigger?: boolean;
    /**
     * draw the collider
     */
    draw(context: CanvasRenderingContext2D): void;
    /**
     * should be called only by System.updateBody
     */
    updateAABB(): void;
}
