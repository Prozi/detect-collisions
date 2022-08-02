import { BBox } from "rbush";
import { Polygon as SATPolygon } from "sat";
import { BodyOptions, Collider, PotentialVector, Types, Vector } from "../model";
import { System } from "../system";
/**
 * collider - polygon
 */
export declare class Polygon extends SATPolygon implements BBox, Collider {
    /**
     * bbox parameters
     */
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
    /**
     * is it a convex polyon as opposed to a hollow inside (concave) polygon
     */
    isConvex: boolean;
    /**
     * optimization for above
     */
    convexPolygons: SATPolygon[];
    /**
     * bodies are not reinserted during update if their bbox didnt move outside bbox + padding
     */
    padding: number;
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
    readonly type: Types.Polygon | Types.Box | Types.Point | Types.Ellipse | Types.Line;
    /**
     * collider - polygon
     * @param {PotentialVector} position {x, y}
     * @param {PotentialVector[]} points
     */
    constructor(position: PotentialVector, points: PotentialVector[], options?: BodyOptions);
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
    getConvex(): number[][][];
    updateConvexPolygons(): void;
    /**
     * update position
     * @param {number} x
     * @param {number} y
     */
    setPosition(x: number, y: number): void;
    /**
     * get bbox without padding
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
    getCentroidWithoutRotation(): Vector;
    /**
     * reCenters the box anchor
     */
    center(): void;
}
//# sourceMappingURL=polygon.d.ts.map