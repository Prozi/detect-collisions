import SAT from "sat";
import { ICollider, Types, Vector } from "../model";
import { ensureVectorPoint, ensurePolygonPoints } from "../utils";

/**
 * collider - polygon
 */
export class Polygon extends SAT.Polygon implements ICollider {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;

  readonly type: Types = Types.Polygon;

  /**
   * collider - polygon
   * @param {Vector} position {x, y}
   * @param {Vector[]} points
   */
  constructor(position: Vector, points: Vector[]) {
    super(ensureVectorPoint(position), ensurePolygonPoints(points));

    this.updateAABB();
  }

  /**
   * Updates Bounding Box of collider
   */
  updateAABB(): void {
    const { pos, w, h } = (this as any).getAABBAsBox();

    this.minX = pos.x;
    this.minY = pos.y;
    this.maxX = pos.x + w;
    this.maxY = pos.y + h;
  }

  /**
   * Draws collider on a CanvasRenderingContext2D's current path
   * @param {CanvasRenderingContext2D} context The canvas context to draw on
   */
  draw(context: CanvasRenderingContext2D): void {
    this.calcPoints.forEach((point, index: number) => {
      const posX = this.pos.x + point.x;
      const posY = this.pos.y + point.y;

      if (!index) {
        if (this.calcPoints.length === 1) {
          context.arc(posX, posY, 1, 0, Math.PI * 2);
        } else {
          context.moveTo(posX, posY);
        }
      } else {
        context.lineTo(posX, posY);
      }
    });

    if (this.calcPoints.length > 2) {
      context.lineTo(
        this.pos.x + this.calcPoints[0].x,
        this.pos.y + this.calcPoints[0].y
      );
    }
  }
}
