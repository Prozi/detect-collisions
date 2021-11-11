import SAT from "sat";
import { Types } from "../model";
import { ensureVectorPoint, ensurePolygonPoints } from "../utils";
/**
 * collider - polygon
 */
export class Polygon extends SAT.Polygon {
    /**
     * collider - polygon
     * @param {Vector} position {x, y}
     * @param {Vector[]} points
     */
    constructor(position, points) {
        super(ensureVectorPoint(position), ensurePolygonPoints(points));
        this.type = Types.Polygon;
        this.updateAABB();
    }
    /**
     * Updates Bounding Box of collider
     */
    updateAABB() {
        const { pos, w, h } = this.getAABBAsBox();
        this.minX = pos.x;
        this.minY = pos.y;
        this.maxX = pos.x + w;
        this.maxY = pos.y + h;
    }
    /**
     * Draws collider on a CanvasRenderingContext2D's current path
     * @param {CanvasRenderingContext2D} context The canvas context to draw on
     */
    draw(context) {
        this.calcPoints.forEach((point, index) => {
            const posX = this.pos.x + point.x;
            const posY = this.pos.y + point.y;
            if (!index) {
                if (this.calcPoints.length === 1) {
                    context.arc(posX, posY, 1, 0, Math.PI * 2);
                }
                else {
                    context.moveTo(posX, posY);
                }
            }
            else {
                context.lineTo(posX, posY);
            }
        });
        if (this.calcPoints.length > 2) {
            context.lineTo(this.pos.x + this.calcPoints[0].x, this.pos.y + this.calcPoints[0].y);
        }
    }
}
