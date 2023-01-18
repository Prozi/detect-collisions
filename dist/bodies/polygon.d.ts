import { Polygon as DecompPolygon } from "poly-decomp";
import { BBox } from "rbush";
import { Polygon as SATPolygon } from "sat";
import { BodyOptions, Collider, PotentialVector, SATVector, Types, Vector } from "../model";
import { System } from "../system";
/**
 * collider - polygon
 */
export declare class Polygon extends SATPolygon implements BBox, Collider {
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
    /**
     * type of body
     */
    readonly type: Types.Polygon | Types.Box | Types.Point | Types.Ellipse | Types.Line;
    /**
     * backup of points used for scaling
     */
    protected pointsBackup: Vector[];
    /**
     * scale Vector of body
     */
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
    setPosition(x: number, y: number): void;
    /**
     * update scale
     */
    setScale(x: number, y?: number): void;
    /**
     * get body bounding box, without padding
     */
    getAABBAsBBox(): BBox;
    /**
     * Draws collider on a CanvasRenderingContext2D's current path
     */
    draw(context: CanvasRenderingContext2D): void;
    /**
     * get body centroid without applied angle
     */
    getCentroidWithoutRotation(): Vector;
    /**
     * sets polygon points to new array of vectors
     */
    setPoints(points: SATVector[]): Polygon;
    /**
     * translates polygon points in x, y direction
     */
    translate(x: number, y: number): Polygon;
    /**
     * rotates polygon points by angle
     */
    rotate(angle: number): Polygon;
    /**
     * center the box anchor
     */
    center(): void;
    toJSON(): Partial<Polygon>;
    /**
     * update the position of the decomposed convex polygons (if any), called
     * after the position of the body has changed
     */
    protected updateConvexPolygonPositions(): void;
    /**
     * returns body split into convex polygons, or empty array for convex bodies
     */
    protected getConvex(): DecompPolygon[];
    /**
     * updates convex polygons cache in body
     */
    protected updateConvexPolygons(convex?: DecompPolygon[]): void;
    /**
     * after points update set is convex
     */
    protected updateIsConvex(): void;
}
//# sourceMappingURL=polygon.d.ts.map