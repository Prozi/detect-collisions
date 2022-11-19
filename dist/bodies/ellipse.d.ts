import { BodyOptions, Types, PotentialVector } from "../model";
import { Polygon } from "./polygon";
/**
 * collider - ellipse
 */
export declare class Ellipse extends Polygon {
    readonly type: Types.Ellipse;
    /**
     * ellipses are centered
     */
    isCentered: boolean;
    /**
     * ellipses are convex
     */
    isConvex: boolean;
    protected _radiusX: number;
    protected _radiusY: number;
    protected _step: number;
    /**
     * collider - ellipse
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