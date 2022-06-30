import { Types, PotentialVector, BodyOptions } from "../model";
import { Polygon } from "./polygon";
/**
 * collider - box
 */
export declare class Box extends Polygon {
    readonly type: Types.Box | Types.Point;
    private _width;
    private _height;
    /**
     * collider - box
     * @param {PotentialVector} position {x, y}
     * @param {number} width
     * @param {number} height
     */
    constructor(position: PotentialVector, width: number, height: number, options?: BodyOptions);
    /**
     * get box width
     */
    get width(): number;
    /**
     * set box width, update points
     */
    set width(width: number);
    /**
     * get box height
     */
    get height(): number;
    /**
     * set box height, update points
     */
    set height(height: number);
}
//# sourceMappingURL=box.d.ts.map