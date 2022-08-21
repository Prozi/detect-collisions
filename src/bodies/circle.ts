import { BBox } from "rbush";
import { Circle as SATCircle } from "sat";

import { BodyOptions, Collider, PotentialVector, Types } from "../model";
import { System } from "../system";
import {
  dashLineTo,
  ensureVectorPoint,
  extendBody,
  updateAABB,
} from "../utils";

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
   * bodies are not reinserted during update if their bbox didnt move outside bbox + padding
   */
  padding = 0;

  /*
   * circles are convex
   */
  isConvex = true;

  /**
   * for compatibility reasons circle has angle
   */
  angle = 0;

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
   * Updates Bounding Box of collider
   */
  getAABBAsBBox(): BBox {
    return {
      minX: this.pos.x - this.r,
      minY: this.pos.y - this.r,
      maxX: this.pos.x + this.r,
      maxY: this.pos.y + this.r,
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
  draw(context: CanvasRenderingContext2D) {
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
    } else {
      context.moveTo(this.pos.x + radius, this.pos.y);
      context.arc(this.pos.x, this.pos.y, radius, 0, Math.PI * 2);
    }
  }

  setAngle(angle: number): void {
    this.angle = angle;
  }

  /**
   * for compatility reasons, does nothing
   */
  center(): void {}
}
