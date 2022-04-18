import { Types, Vector } from "../model";
import { Polygon } from "./polygon";
/**
 * collider - line
 */
export declare class Line extends Polygon {
    readonly type: Types.Line;
    /**
     * collider - line from start to end
     * @param {Vector} start {x, y}
     * @param {Vector} end {x, y}
     */
    constructor(start: Vector, end: Vector);
    get start(): Vector;
    get end(): Vector;
}
//# sourceMappingURL=line.d.ts.map