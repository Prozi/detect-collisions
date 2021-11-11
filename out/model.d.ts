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
export declare type Vector = SAT.Vector | {
    x?: number;
    y?: number;
};
export interface ICollider extends BBox {
    pos: SAT.Vector;
    type: Types;
    draw(context: CanvasRenderingContext2D): void;
    /**
     * should be called only by System.updateBody
     */
    updateAABB(): void;
}
