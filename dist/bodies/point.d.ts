import { Box } from "./box";
import { PotentialVector, Types } from "../model";
/**
 * collider - point (very tiny box)
 */
export declare class Point extends Box {
    readonly type: Types.Point;
    /**
     * collider - point (very tiny box)
     * @param {PotentialVector} position {x, y}
     */
    constructor(position: PotentialVector);
}
//# sourceMappingURL=point.d.ts.map