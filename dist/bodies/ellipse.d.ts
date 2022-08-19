import { BodyOptions, Types, Vector } from "../model";
import { Polygon } from "./polygon";
/**
 * collider - ellipse
 */
export declare class Ellipse extends Polygon {
    readonly type: Types.Ellipse;
    isConvex: boolean;
    private _radiusX;
    private _radiusY;
    private _step;
    /**
     * collider - ellipse
     * @param {Vector} position {x, y}
     * @param {number} radiusX
     * @param {number} radiusY defaults to radiusX
     * @param {number} step precision division >= 1px
     */
    constructor(position: Vector, radiusX: number, radiusY?: number, step?: number, options?: BodyOptions);
    /**
     * get ellipse step number
     */
    get step(): number;
    /**
     * set ellipse step number
     */
    set step(step: number);
    /**
     * get ellipse radiusX
     */
    get radiusX(): number;
    /**
     * set ellipse radiusX, update points
     */
    set radiusX(radiusX: number);
    /**
     * get ellipse radiusY
     */
    get radiusY(): number;
    /**
     * set ellipse radiusY, update points
     */
    set radiusY(radiusY: number);
    center(): void;
}
//# sourceMappingURL=ellipse.d.ts.map