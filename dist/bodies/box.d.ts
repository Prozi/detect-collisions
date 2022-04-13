import { Types, Vector } from "../model";
import { Polygon } from "./polygon";
/**
 * collider - box
 */
export declare class Box extends Polygon {
    width: number;
    height: number;
    readonly type: Types.Box | Types.Point;
    /**
     * collider - box
     * @param {Vector} position {x, y}
     * @param {number} width
     * @param {number} height
     */
    constructor(position: Vector, width: number, height: number);
}
//# sourceMappingURL=box.d.ts.map