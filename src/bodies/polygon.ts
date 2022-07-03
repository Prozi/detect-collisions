import { Polygon as SATPolygon } from "sat";
import { BBox } from "rbush";
import { System } from "../system";
import {
  BodyOptions,
  Collider,
  GetAABBAsBox,
  PotentialVector,
  Types,
  Vector,
} from "../model";
import {
  ensureVectorPoint,
  ensurePolygonPoints,
  dashLineTo,
  extendBody,
  updateAABB,
} from "../utils";

/**
 * collider - polygon
 */
export class Polygon extends SATPolygon implements BBox, Collider {
  /**
   * bbox parameters
   */
  minX!: number;
  maxX!: number;
  minY!: number;
  maxY!: number;

  /**
   * bodies are not reinserted during update if their bbox didnt move outside bbox + padding
   */
  padding = 0;

  /**
   * static bodies don't move but they collide
   */
  isStatic?: boolean;

  /**
   * trigger bodies move but are like ghosts
   */
  isTrigger?: boolean;

  /**
   * reference to collision system
   */
  system?: System;

  readonly type:
    | Types.Polygon
    | Types.Box
    | Types.Point
    | Types.Ellipse
    | Types.Line = Types.Polygon;

  /**
   * collider - polygon
   * @param {PotentialVector} position {x, y}
   * @param {PotentialVector[]} points
   */
  constructor(
    position: PotentialVector,
    points: PotentialVector[],
    options?: BodyOptions
  ) {
    super(ensureVectorPoint(position), ensurePolygonPoints(points));

    if (!points?.length) {
      throw new Error("No points in polygon");
    }

    extendBody(this, options);

    this.updateAABB();
  }

  get x(): number {
    return this.pos.x;
  }

  /**
   * updating this.pos.x by this.x = x updates AABB
   */
  set x(x: number) {
    this.pos.x = x;

    this.system?.updateBody(this);
  }

  get y(): number {
    return this.pos.y;
  }

  /**
   * updating this.pos.y by this.y = y updates AABB
   */
  set y(y: number) {
    this.pos.y = y;

    this.system?.updateBody(this);
  }

  /**
   * update position
   * @param {number} x
   * @param {number} y
   */
  setPosition(x: number, y: number): void {
    this.pos.x = x;
    this.pos.y = y;

    this.system?.updateBody(this);
  }

  /**
   * get bbox without padding
   */
  getAABBAsBBox(): BBox {
    const { pos, w, h } = (this as unknown as GetAABBAsBox).getAABBAsBox();

    return {
      minX: pos.x,
      minY: pos.y,
      maxX: pos.x + w,
      maxY: pos.y + h,
    };
  }

  /**
   * Updates Bounding Box of collider
   */
  updateAABB(bounds = this.getAABBAsBBox()): void {
    updateAABB(this, bounds);
  }

  /**
   * Draws collider on a CanvasRenderingContext2D's current path
   * @param {CanvasRenderingContext2D} context The canvas context to draw on
   */
  draw(context: CanvasRenderingContext2D): void {
    const points: Vector[] = [...this.calcPoints, this.calcPoints[0]];

    points.forEach((point: Vector, index: number) => {
      const toX = this.x + point.x;
      const toY = this.y + point.y;
      const prev =
        this.calcPoints[index - 1] ||
        this.calcPoints[this.calcPoints.length - 1];

      if (!index) {
        if (this.calcPoints.length === 1) {
          context.arc(toX, toY, 1, 0, Math.PI * 2);
        } else {
          context.moveTo(toX, toY);
        }
      } else if (this.calcPoints.length > 1) {
        if (this.isTrigger) {
          const fromX = this.x + prev.x;
          const fromY = this.y + prev.y;

          dashLineTo(context, fromX, fromY, toX, toY);
        } else {
          context.lineTo(toX, toY);
        }
      }
    });
  }

  getCentroidWithoutRotation(): Vector {
    // reset angle for get centroid
    const angle = this.angle;

    this.setAngle(0);

    const centroid: Vector = this.getCentroid();

    // revert angle change
    this.setAngle(angle);

    return centroid;
  }

  /**
   * reCenters the box anchor
   */
  center(): void {
    const { x, y } = this.getCentroidWithoutRotation();

    this.translate(-x, -y);
    this.setPosition(this.x + x, this.y + y);
  }
}
