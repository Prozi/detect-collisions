import { BodyOptions, PotentialVector, Types } from "../model";
import { Box } from "./box";
/**
 * collider - point (very tiny box)
 */
export declare class Point extends Box {
    readonly type: Types.Point;
    /**
     * collider - point (very tiny box)
     * @param {PotentialVector} position {x, y}
     */
    constructor(position: PotentialVector, options?: BodyOptions);
}
//# sourceMappingURL=point.d.ts.map