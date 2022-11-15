import { BBox } from "rbush";
import { Circle as SATCircle } from "sat";

import {
  BodyOptions,
  Collider,
  PotentialVector,
  SATVector,
  Types,
  Vector,
} from "../model";
import { System } from "../system";
import { dashLineTo, ensureVectorPoint, extendBody } from "../utils";

/**
 * collider - circle
 */
export class Circle extends SATCircle implements BBox, Collider {
  /**
   * bbox parameters
   */
  minX!: number;
  maxX!: number;
  minY!: number;
  maxY!: number;

  /**
   * bounding box cache, without padding
   */
  bbox!: BBox;

  /**
   * offset
   */
  offset!: SATVector;

  /**
   * offset copy without angle applied
   */
  offsetCopy: Vector = { x: 0, y: 0 };

  /**
   * bodies are not reinserted during update if their bbox didnt move outside bbox + padding
   */
  padding = 0;

  /**
   * for compatibility reasons circle has angle
   */
  angle = 0;

  /*
   * circles are convex
   */
  isConvex = true;

  /**
   * circles are centered
   */
  isCentered = true;

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

  readonly type: Types.Circle = Types.Circle;

  private readonly radiusBackup: number;

  /**
   * collider - circle
   * @param {PotentialVector} position {x, y}
   * @param {number} radius
   */
  constructor(
    position: PotentialVector,
    radius: number,
    options?: BodyOptions
  ) {
    super(ensureVectorPoint(position), radius);

    extendBody(this, options);

    this.radiusBackup = radius;
  }

  get x(): number {
    return this.pos.x;
  }

  /**
   * updating this.pos.x by this.x = x updates AABB
   */
  set x(x: number) {
    this.pos.x = x;
    this.system?.insert(this);
  }

  get y(): number {
    return this.pos.y;
  }

  /**
   * updating this.pos.y by this.y = y updates AABB
   */
  set y(y: number) {
    this.pos.y = y;
    this.system?.insert(this);
  }

  /**
   * allow get scale
   */
  get scale(): number {
    return this.r / this.radiusBackup;
  }

  /**
   * shorthand for setScale()
   */
  set scale(scale: number) {
    this.setScale(scale);
  }

  /**
   * scaleX = scale in case of Circles
   */
  get scaleX(): number {
    return this.scale;
  }

  /**
   * scaleY = scale in case of Circles
   */
  get scaleY(): number {
    return this.scale;
  }

  /**
   * update position
   * @param {number} x
   * @param {number} y
   */
  setPosition(x: number, y: number): void {
    this.pos.x = x;
    this.pos.y = y;
    this.system?.insert(this);
  }

  /**
   * update scale
   * @param {number} scale
   */
  setScale(scale: number, _ignoredParameter?: number): void {
    this.r = this.radiusBackup * scale;
  }

  /**
   * Updates Bounding Box of collider
   */
  getAABBAsBBox(): BBox {
    const offset = this.getOffsetWithAngle();
    const x = this.x + offset.x;
    const y = this.y + offset.y;

    return {
      minX: x - this.r,
      maxX: x + this.r,
      minY: y - this.r,
      maxY: y + this.r,
    };
  }

  /**
   * Draws collider on a CanvasRenderingContext2D's current path
   * @param {CanvasRenderingContext2D} context The canvas context to draw on
   */
  draw(context: CanvasRenderingContext2D) {
    const offset = this.getOffsetWithAngle();
    const x = this.x + offset.x;
    const y = this.y + offset.y;

    if (this.isTrigger) {
      const max = Math.max(8, this.r);

      for (let i = 0; i < max; i++) {
        const arc = (i / max) * 2 * Math.PI;
        const arcPrev = ((i - 1) / max) * 2 * Math.PI;
        const fromX = x + Math.cos(arcPrev) * this.r;
        const fromY = y + Math.sin(arcPrev) * this.r;
        const toX = x + Math.cos(arc) * this.r;
        const toY = y + Math.sin(arc) * this.r;

        dashLineTo(context, fromX, fromY, toX, toY);
      }
    } else {
      context.moveTo(x + this.r, y);
      context.arc(x, y, this.r, 0, Math.PI * 2);
    }
  }

  setAngle(angle: number): void {
    this.angle = angle;

    const { x, y } = this.getOffsetWithAngle();
    this.offset.x = x;
    this.offset.y = y;
  }

  setOffset(offset: Vector): Circle {
    this.offsetCopy.x = offset.x;
    this.offsetCopy.y = offset.y;

    const { x, y } = this.getOffsetWithAngle();
    this.offset.x = x;
    this.offset.y = y;

    return this;
  }

  /**
   * for compatility reasons, does nothing
   */
  center(): void {}

  protected getOffsetWithAngle(): Vector {
    if (!this.angle) {
      return this.offsetCopy;
    }

    const sin = Math.sin(this.angle);
    const cos = Math.cos(this.angle);
    const x = this.offsetCopy.x * cos - this.offsetCopy.y * sin;
    const y = this.offsetCopy.x * sin + this.offsetCopy.y * cos;

    return { x, y };
  }
}
