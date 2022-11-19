import { BBox } from "rbush";
import { Polygon as SATPolygon } from "sat";
import { BodyOptions, Collider, PotentialVector, SATVector, Types, Vector } from "../model";
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
     * bounding box cache, without padding
     */
    bbox: BBox;
    /**
     * is it a convex polgyon as opposed to a hollow inside (concave) polygon
     */
    isConvex: boolean;
    /**
     * optimization for convex polygons
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
     * flag to show is it centered
     */
    isCentered?: boolean;
    /**
     * reference to collision system
     */
    system?: System;
    readonly type: Types.Polygon | Types.Box | Types.Point | Types.Ellipse | Types.Line;
    protected pointsBackup: Vector[];
    protected readonly scaleVector: Vector;
    /**
     * collider - polygon
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
    /**
     * allow exact getting of scale x - use setScale(x, y) to set
     */
    get scaleX(): number;
    /**
     * allow exact getting of scale y - use setScale(x, y) to set
     */
    get scaleY(): number;
    /**
     * allow approx getting of scale
     */
    get scale(): number;
    /**
     * allow easier setting of scale
     */
    set scale(scale: number);
    /**
     * update position
     */
    setPosition(x: number, y: number): Polygon;
    /**
     * update scale
     */
    setScale(x: number, y?: number): Polygon;
    /**
     * get body bounding box, without padding
     */
    getAABBAsBBox(): BBox;
    /**
     * Draws collider on a CanvasRenderingContext2D's current path
     */
    draw(context: CanvasRenderingContext2D): void;
    getCentroidWithoutRotation(): Vector;
    setPoints(points: SATVector[]): Polygon;
    translate(x: number, y: number): Polygon;
    rotate(angle: number): Polygon;
    /**
     * center the box anchor
     */
    center(): void;
    protected getConvex(): number[][][];
    protected updateConvexPolygons(convex?: number[][][]): void;
    /**
     * after points update set is convex
     */
    protected updateIsConvex(): void;
}
//# sourceMappingURL=polygon.d.ts.map