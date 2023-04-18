import { BBox } from "rbush";
import { Circle as SATCircle } from "sat";
import { BodyOptions, BodyProps, PotentialVector, SATVector, BodyType, Vector } from "../model";
import { System } from "../system";
/**
 * collider - circle
 */
export declare class Circle extends SATCircle implements BBox, BodyProps {
    /**
     * minimum x bound of body
     */
    minX: number;
    /**
     * maximum x bound of body
     */
    maxX: number;
    /**
     * minimum y bound of body
     */
    minY: number;
    /**
     * maximum y bound of body
     */
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
    /**
     * static bodies don't move but they collide
     */
    isStatic: boolean;
    /**
     * trigger bodies move but are like ghosts
     */
    isTrigger: boolean;
    /**
     * reference to collision system
     */
    system?: System;
    readonly isConvex = true;
    /**
     * circle type
     */
    readonly type: BodyType.Circle;
    /**
     * always centered
     */
    readonly isCentered = true;
    /**
     * saved initial radius - internal
     */
    protected readonly unscaledRadius: number;
    /**
     * collider - circle
     */
    constructor(position: PotentialVector, radius: number, options?: BodyOptions);
    /**
     * get this.pos.x
     */
    get x(): number;
    /**
     * updating this.pos.x by this.x = x updates AABB
     * @deprecated use setPosition(x, y) instead
     */
    set x(x: number);
    /**
     * get this.pos.y
     */
    get y(): number;
    /**
     * updating this.pos.y by this.y = y updates AABB
     * @deprecated use setPosition(x, y) instead
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
     */
    setPosition(x: number, y: number): void;
    /**
     * update scale
     */
    setScale(scale: number, _ignoredParameter?: number): void;
    /**
     * set rotation
     */
    setAngle(angle: number): Circle;
    /**
     * set offset from center
     */
    setOffset(offset: Vector): Circle;
    /**
     * get body bounding box, without padding
     */
    getAABBAsBBox(): BBox;
    /**
     * Draws collider on a CanvasRenderingContext2D's current path
     */
    draw(context: CanvasRenderingContext2D): void;
    /**
     * Draws Bounding Box on canvas context
     */
    drawBVH(context: CanvasRenderingContext2D): void;
    /**
     * internal for getting offset with applied angle
     */
    protected getOffsetWithAngle(): Vector;
}
//# sourceMappingURL=circle.d.ts.map