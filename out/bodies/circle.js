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
     * update position
     * @param {number} x
     * @param {number} y
     */
    setPosition(x, y) {
        var _a;
        this.pos.x = x;
        this.pos.y = y;
        (_a = this.system) === null || _a === void 0 ? void 0 : _a.updateBody(this);
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
            const max = Math.max(8, radius);
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
