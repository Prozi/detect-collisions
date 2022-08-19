import { BBox } from "rbush";
import { Circle as SATCircle } from "sat";
import { BodyOptions, Collider, PotentialVector, Types } from "../model";
import { System } from "../system";
/**
 * collider - circle
 */
export declare class Circle extends SATCircle implements BBox, Collider {
    /**
     * bbox parameters
     */
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
    /**
     * bodies are not reinserted during update if their bbox didnt move outside bbox + padding
     */
    padding: number;
    isConvex: boolean;
    /**
     * for compatibility reasons circle has angle
     */
    angle: number;
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
    readonly type: Types.Circle;
    /**
     * collider - circle
     * @param {PotentialVector} position {x, y}
     * @param {number} radius
     */
    constructor(position: PotentialVector, radius: number, options?: BodyOptions);
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
    getAABBAsBBox(): BBox;
    /**
     * Updates Bounding Box of collider
     */
    updateAABB(bounds?: BBox): void;
    /**
     * Draws collider on a CanvasRenderingContext2D's current path
     * @param {CanvasRenderingContext2D} context The canvas context to draw on
     */
    draw(context: CanvasRenderingContext2D): void;
    setAngle(angle: number): void;
    center(): void;
}
//# sourceMappingURL=circle.d.ts.map