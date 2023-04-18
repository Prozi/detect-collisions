import { isSimple } from "poly-decomp";
import { BBox } from "rbush";
import { Polygon as SATPolygon } from "sat";
import { BodyOptions, BodyProps, DecompPolygon, PotentialVector, SATVector, BodyType, Vector } from "../model";
import { System } from "../system";
export { isSimple };
/**
 * collider - polygon
 */
export declare class Polygon extends SATPolygon implements BBox, BodyProps {
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
    isStatic: boolean;
    /**
     * trigger bodies move but are like ghosts
     */
    isTrigger: boolean;
    /**
     * reference to collision system
     */
    system?: System;
    /**
     * type of body
     */
    readonly type: BodyType.Polygon | BodyType.Box | BodyType.Point | BodyType.Ellipse | BodyType.Line;
    /**
     * backup of points used for scaling
     */
    protected pointsBackup: Vector[];
    /**
     * is body centered
     */
    protected centered: boolean;
    /**
     * scale Vector of body
     */
    protected readonly scaleVector: Vector;
    /**
     * collider - polygon
     */
    constructor(position: PotentialVector, points: PotentialVector[], options?: BodyOptions);
    /**
     * flag to set is polygon centered
     */
    set isCentered(isCentered: boolean);
    /**
     * is polygon centered?
     */
    get isCentered(): boolean;
    get x(): number;
    /**
     * updating this.pos.x by this.x = x updates AABB
     * @deprecated use setPosition(x, y) instead
     */
    set x(x: number);
    get y(): number;
    /**
     * updating this.pos.y by this.y = y updates AABB
     * @deprecated use setPosition(x, y) instead
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
     * Draws exact collider on canvas context
     */
    draw(context: CanvasRenderingContext2D): void;
    /**
     * Draws Bounding Box on canvas context
     */
    drawBVH(context: CanvasRenderingContext2D): void;
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
     * rotates polygon points by angle, in radians
     */
    rotate(angle: number): Polygon;
    /**
     * if true, polygon is not an invalid, self-crossing polygon
     */
    isSimple(): boolean;
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
    /**
     * inner function for after position change update aabb in system and convex inner polygons
     */
    protected updateBody(): void;
}
//# sourceMappingURL=polygon.d.ts.map