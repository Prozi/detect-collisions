import SAT from "sat";
import { BBox } from "rbush";
import { System } from "../system";
import { ICollider, Types, Vector } from "../model";
/**
 * collider - circle
 */
export declare class Circle extends SAT.Circle implements BBox, ICollider {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
    isStatic?: boolean;
    isTrigger?: boolean;
    system?: System;
    readonly type: Types;
    /**
     * collider - circle
     * @param {Vector} position {x, y}
     * @param {number} radius
     */
    constructor(position: Vector, radius: number);
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
//# sourceMappingURL=circle.d.ts.map