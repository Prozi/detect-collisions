import { BodyOptions, PotentialVector, Types } from "../model";
import { Box } from "./box";
/**
 * collider - point (very tiny box)
 */
export declare class Point extends Box {
    /**
     * point type
     */
    readonly type: Types.Point;
    /**
     * collider - point (very tiny box)
     */
    constructor(position: PotentialVector, options?: BodyOptions);
}
//# sourceMappingURL=point.d.ts.map