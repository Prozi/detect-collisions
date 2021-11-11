import SAT from "sat";
import { Types } from "../model";
import { ensureVectorPoint } from "../utils";
/**
 * collider - circle
 */
export class Circle extends SAT.Circle {
    /**
     * collider - circle
     * @param {Vector} position {x, y}
     * @param {number} radius
     */
    constructor(position, radius) {
        super(ensureVectorPoint(position), radius);
        this.type = Types.Circle;
        this.updateAABB();
    }
    /**
     * Updates Bounding Box of collider
     */
    updateAABB() {
        this.minX = this.pos.x - this.r;
        this.minY = this.pos.y - this.r;
        this.maxX = this.pos.x + this.r;
        this.maxY = this.pos.y + this.r;
    }
    /**
     * Draws collider on a CanvasRenderingContext2D's current path
     * @param {CanvasRenderingContext2D} context The canvas context to draw on
     */
    draw(context) {
        const x = this.pos.x;
        const y = this.pos.y;
        const radius = this.r;
        context.moveTo(x + radius, y);
        context.arc(x, y, radius, 0, Math.PI * 2);
    }
}
