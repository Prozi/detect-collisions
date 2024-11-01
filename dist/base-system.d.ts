import { Body, BodyOptions, ChildrenData, Data, InTest, Leaf, PotentialVector, RBush, TraverseFunction, Vector } from "./model";
import { Box } from "./bodies/box";
import { Circle } from "./bodies/circle";
import { Ellipse } from "./bodies/ellipse";
import { Line } from "./bodies/line";
import { Point } from "./bodies/point";
import { Polygon } from "./bodies/polygon";
/**
 * very base collision system (create, insert, update, draw, remove)
 */
export declare class BaseSystem<TBody extends Body = Body> extends RBush implements Data<TBody> {
    data: ChildrenData<TBody>;
    /**
     * create point at position with options and add to system
     */
    createPoint(position: PotentialVector, options?: BodyOptions): Point;
    /**
     * create line at position with options and add to system
     */
    createLine(start: Vector, end: Vector, options?: BodyOptions): Line;
    /**
     * create circle at position with options and add to system
     */
    createCircle(position: PotentialVector, radius: number, options?: BodyOptions): Circle;
    /**
     * create box at position with options and add to system
     */
    createBox(position: PotentialVector, width: number, height: number, options?: BodyOptions): Box;
    /**
     * create ellipse at position with options and add to system
     */
    createEllipse(position: PotentialVector, radiusX: number, radiusY?: number, step?: number, options?: BodyOptions): Ellipse;
    /**
     * create polygon at position with options and add to system
     */
    createPolygon(position: PotentialVector, points: PotentialVector[], options?: BodyOptions): Polygon;
    /**
     * re-insert body into collision tree and update its bbox
     * every body can be part of only one system
     */
    insert(body: TBody): this;
    /**
     * updates body in collision tree
     */
    updateBody(body: TBody): void;
    /**
     * update all bodies aabb
     */
    update(): void;
    /**
     * draw exact bodies colliders outline
     */
    draw(context: CanvasRenderingContext2D): void;
    /**
     * draw bounding boxes hierarchy outline
     */
    drawBVH(context: CanvasRenderingContext2D, isTrigger?: boolean): void;
    /**
     * remove body aabb from collision tree
     */
    remove(body: TBody, equals?: InTest<TBody>): this;
    /**
     * get object potential colliders
     * @deprecated because it's slower to use than checkOne() or checkAll()
     */
    getPotentials(body: TBody): TBody[];
    /**
     * used to find body deep inside data with finder function returning boolean found or not
     *
     * @param traverseFunction
     * @param tree
     */
    traverse(traverseFunction: TraverseFunction<TBody>, { children }?: {
        children?: Leaf<TBody>[];
    }): TBody | undefined;
}
