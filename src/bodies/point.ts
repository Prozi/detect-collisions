import SAT from "sat";
import { Box } from "./box";
import { ICollider, Types, Vector } from "../model";
import { ensureVectorPoint, createBox } from "../utils";

/**
 * collider - point (very tiny box)
 */
export class Point extends SAT.Polygon implements ICollider {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;

  readonly type: Types = Types.Point;

  /**
   * collider - point (very tiny box)
   * @param {Vector} position {x, y}
   */
  constructor(position: Vector) {
    super(ensureVectorPoint(position), createBox(0.1, 0.1));

    this.updateAABB();
  }

  /**
   * Updates Bounding Box of collider
   */
  updateAABB(): void {
    Box.prototype.updateAABB.call(this);
  }

  /**
   * Draws collider on a CanvasRenderingContext2D's current path
   * @param {CanvasRenderingContext2D} context The canvas context to draw on
   */
  draw(context: CanvasRenderingContext2D): void {
    Box.prototype.draw.call(this, context);
  }
}
