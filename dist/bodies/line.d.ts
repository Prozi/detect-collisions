import { Vector as SATVector } from "sat";
import { BodyGroup, BodyOptions, BodyType, Vector } from "../model";
import { Polygon } from "./polygon";
/**
 * collider - line
 */
export declare class Line extends Polygon {
    /**
     * line type
     */
    readonly type: BodyType.Line;
    /**
     * faster than type
     */
    readonly typeGroup: BodyGroup.Line;
    /**
     * line is convex
     */
    readonly isConvex = true;
    /**
     * collider - line from start to end
     */
    constructor(start: Vector, end: Vector, options?: BodyOptions);
    get start(): Vector;
    set start({ x, y }: Vector);
    get end(): Vector;
    set end({ x, y }: Vector);
    getCentroid(): SATVector;
    /**
     * do not attempt to use Polygon.updateIsConvex()
     */
    protected updateIsConvex(): void;
}
