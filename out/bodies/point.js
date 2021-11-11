import SAT from "sat";
import { Box } from "./box";
import { Types } from "../model";
import { ensureVectorPoint, createBox } from "../utils";
/**
 * collider - point (very tiny box)
 */
export class Point extends SAT.Polygon {
    /**
     * collider - point (very tiny box)
     * @param {Vector} position {x, y}
     */
    constructor(position) {
        super(ensureVectorPoint(position), createBox(0.1, 0.1));
        this.type = Types.Point;
        this.updateAABB();
    }
    /**
     * Updates Bounding Box of collider
     */
    updateAABB() {
        Box.prototype.updateAABB.call(this);
    }
    /**
     * Draws collider on a CanvasRenderingContext2D's current path
     * @param {CanvasRenderingContext2D} context The canvas context to draw on
     */
    draw(context) {
        Box.prototype.draw.call(this, context);
    }
}
