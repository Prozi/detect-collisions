import { Types, Vector } from "../model";
import { Polygon } from "./polygon";
/**
 * collider - oval
 */
export declare class Oval extends Polygon {
    readonly type: Types.Oval;
    private _radiusX;
    private _radiusY;
    private _step;
    /**
     * collider - oval
     * @param {Vector} position {x, y}
     * @param {number} radiusX
     * @param {number} radiusY defaults to radiusX
     * @param {number} step precision division >= 1px
     */
    constructor(position: Vector, radiusX: number, radiusY?: number, step?: number);
    /**
     * get oval step number
     */
    get step(): number;
    /**
     * set oval step number
     */
    set step(step: number);
    /**
     * get oval radiusX
     */
    get radiusX(): number;
    /**
     * set oval radiusX, update points
     */
    set radiusX(radiusX: number);
    /**
     * get oval radiusY
     */
    get radiusY(): number;
    /**
     * set oval radiusY, update points
     */
    set radiusY(radiusY: number);
}
//# sourceMappingURL=oval.d.ts.map