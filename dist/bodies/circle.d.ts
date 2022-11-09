import { BBox } from "rbush";
import { Circle as SATCircle } from "sat";
import { BodyOptions, Collider, PotentialVector, SATVector, Types, Vector } from "../model";
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
     * bounding box cache, without padding
     */
    bbox: BBox;
    /**
     * offset
     */
    offset: SATVector;
    /**
     * offset copy without angle applied
     */
    offsetCopy: Vector;
    /**
     * bodies are not reinserted during update if their bbox didnt move outside bbox + padding
     */
    padding: number;
    /**
     * for compatibility reasons circle has angle
     */
    angle: number;
    isConvex: boolean;
    /**
     * circles are centered
     */
    isCentered: boolean;
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
    private readonly radiusBackup;
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
     * allow get scale
     */
    get scale(): number;
    /**
     * shorthand for setScale()
     */
    set scale(scale: number);
    /**
     * scaleX = scale in case of Circles
     */
    get scaleX(): number;
    /**
     * scaleY = scale in case of Circles
     */
    get scaleY(): number;
    /**
     * update position
     * @param {number} x
     * @param {number} y
     */
    setPosition(x: number, y: number): void;
    /**
     * update scale
     * @param {number} scale
     */
    setScale(scale: number, _ignoredParameter?: number): void;
    /**
     * Updates Bounding Box of collider
     */
    getAABBAsBBox(): BBox;
    /**
     * Draws collider on a CanvasRenderingContext2D's current path
     * @param {CanvasRenderingContext2D} context The canvas context to draw on
     */
    draw(context: CanvasRenderingContext2D): void;
    setAngle(angle: number): void;
    setOffset(offset: Vector): void;
    /**
     * for compatility reasons, does nothing
     */
    center(): void;
    protected getOffsetWithAngle(): Vector;
}
//# sourceMappingURL=circle.d.ts.map