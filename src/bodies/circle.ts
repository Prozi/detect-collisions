import SAT from "sat";
import { ICollider, Types, Vector } from "../model";
import { ensureVectorPoint } from "../utils";

/**
 * collider - circle
 */
export class Circle extends SAT.Circle implements ICollider {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;

  readonly type: Types = Types.Circle;

  /**
   * collider - circle
   * @param {Vector} position {x, y}
   * @param {number} radius
   */
  constructor(position: Vector, radius: number) {
    super(ensureVectorPoint(position), radius);

    this.updateAABB();
  }

  /**
   * Updates Bounding Box of collider
   */
  updateAABB(): void {
    this.minX = this.pos.x - this.r;
    this.minY = this.pos.y - this.r;
    this.maxX = this.pos.x + this.r;
    this.maxY = this.pos.y + this.r;
  }

  /**
   * Draws collider on a CanvasRenderingContext2D's current path
   * @param {CanvasRenderingContext2D} context The canvas context to draw on
   */
  draw(context: CanvasRenderingContext2D) {
    const x = this.pos.x;
    const y = this.pos.y;
    const radius = this.r;

    context.moveTo(x + radius, y);
    context.arc(x, y, radius, 0, Math.PI * 2);
  }
}
