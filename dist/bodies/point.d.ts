import { BodyOptions, PotentialVector, BodyType } from "../model";
import { Box } from "./box";
/**
 * collider - point (very tiny box)
 */
export declare class Point extends Box {
    /**
     * point type
     */
    readonly type: BodyType.Point;
    /**
     * collider - point (very tiny box)
     */
    constructor(position: PotentialVector, options?: BodyOptions);
}
