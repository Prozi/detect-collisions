import { BodyOptions, Types, PotentialVector } from "../model";
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
     * @param {PotentialVector} position {x, y}
     * @param {number} radiusX
     * @param {number} radiusY defaults to radiusX
     * @param {number} step precision division >= 1px
     */
    constructor(position: PotentialVector, radiusX: number, radiusY?: number, step?: number, options?: BodyOptions);
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
    /**
     * do not attempt to use Polygon.center()
     */
    center(): void;
    /**
     * do not attempt to use Polygon.updateIsConvex()
     */
    protected updateIsConvex(): void;
}
//# sourceMappingURL=ellipse.d.ts.map