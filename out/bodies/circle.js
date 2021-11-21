import SAT from "sat";
import { Types } from "../model";
import { dashLineTo, ensureVectorPoint } from "../utils";
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
        const radius = this.r;
        if (this.isTrigger) {
            const max = radius / 2;
            for (let i = 0; i < max; i++) {
                const arc = (i / max) * 2 * Math.PI;
                const arcPrev = ((i - 1) / max) * 2 * Math.PI;
                const fromX = this.pos.x + Math.cos(arcPrev) * radius;
                const fromY = this.pos.y + Math.sin(arcPrev) * radius;
                const toX = this.pos.x + Math.cos(arc) * radius;
                const toY = this.pos.y + Math.sin(arc) * radius;
                dashLineTo(context, fromX, fromY, toX, toY);
            }
        }
        else {
            context.moveTo(this.pos.x + radius, this.pos.y);
            context.arc(this.pos.x, this.pos.y, radius, 0, Math.PI * 2);
        }
    }
}
