import { Vector as SATVector } from "sat";
import { BodyOptions, Types, Vector } from "../model";
import { Polygon } from "./polygon";
/**
 * collider - line
 */
export declare class Line extends Polygon {
    readonly type: Types.Line;
    isConvex: boolean;
    /**
     * collider - line from start to end
     * @param {Vector} start {x, y}
     * @param {Vector} end {x, y}
     */
    constructor(start: Vector, end: Vector, options?: BodyOptions);
    get start(): Vector;
    get end(): Vector;
    getCentroid(): SATVector;
    /**
     * do not attempt to use Polygon.updateIsConvex()
     */
    protected updateIsConvex(): void;
}
//# sourceMappingURL=line.d.ts.map