import { Types, Vector } from "../model";
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
     * @param {Vector} position {x, y}
     * @param {number} width
     * @param {number} height
     */
    constructor(position: Vector, width: number, height: number);
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
    getCentroidWithoutRotation(): Vector;
    /**
     * reCenters the box anchor
     */
    center(): void;
}
//# sourceMappingURL=box.d.ts.map