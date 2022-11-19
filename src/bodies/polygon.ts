import { quickDecomp } from "poly-decomp";
import { BBox } from "rbush";
import { Polygon as SATPolygon } from "sat";

import {
  BodyOptions,
  Collider,
  GetAABBAsBox,
  PotentialVector,
  SATVector,
  Types,
  Vector,
} from "../model";
import { System } from "../system";
import {
  ensurePolygonPoints,
  ensureVectorPoint,
  extendBody,
  mapArrayToVector,
  mapVectorToArray,
  clonePointsArray,
} from "../utils";
import { drawPolygon } from "../utils/draw-utils";

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
   * bounding box cache, without padding
   */
  bbox!: BBox;

  /**
   * is it a convex polygon as opposed to a hollow inside (concave) polygon
   */
  isConvex!: boolean;

  /**
   * optimization for convex polygons
   */
  convexPolygons: SATPolygon[] = [];

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
   * flag to show is it centered
   */
  isCentered?: boolean;

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

  protected pointsBackup!: Vector[];
  protected readonly scaleVector: Vector = { x: 1, y: 1 };

  /**
   * collider - polygon
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
   * allow exact getting of scale x - use setScale(x, y) to set
   */
  get scaleX(): number {
    return this.scaleVector.x;
  }

  /**
   * allow exact getting of scale y - use setScale(x, y) to set
   */
  get scaleY(): number {
    return this.scaleVector.y;
  }

  /**
   * allow approx getting of scale
   */
  get scale(): number {
    return this.scaleVector.x;
  }

  /**
   * allow easier setting of scale
   */
  set scale(scale: number) {
    this.setScale(scale);
  }

  /**
   * update position
   */
  setPosition(x: number, y: number): void {
    this.pos.x = x;
    this.pos.y = y;

    this.system?.insert(this);
  }

  /**
   * update scale
   */
  setScale(x: number, y: number = x): void {
    this.scaleVector.x = x;
    this.scaleVector.y = y;

    this.points.forEach((point: SATVector, i: number) => {
      point.x = this.pointsBackup[i].x * x;
      point.y = this.pointsBackup[i].y * y;
    });

    super.setPoints(this.points);
  }

  /**
   * get body bounding box, without padding
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
   * Draws collider on a CanvasRenderingContext2D's current path
   */
  draw(context: CanvasRenderingContext2D): void {
    drawPolygon(this, context);
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

  setPoints(points: SATVector[]): Polygon {
    super.setPoints(points);
    this.updateIsConvex();
    this.pointsBackup = clonePointsArray(points);

    return this;
  }

  translate(x: number, y: number): Polygon {
    super.translate(x, y);
    this.pointsBackup = clonePointsArray(this.points);

    return this;
  }

  rotate(angle: number): Polygon {
    super.rotate(angle);
    this.pointsBackup = clonePointsArray(this.points);

    return this;
  }

  /**
   * reCenters the box anchor
   */
  center(): void {
    if (this.isCentered) {
      return;
    }

    const { x, y } = this.getCentroidWithoutRotation();
    this.translate(-x, -y);
    this.pos.x += x;
    this.pos.y += y;
    this.isCentered = true;
  }

  getConvex(): number[][][] {
    // if not line
    return this.points.length > 2
      ? quickDecomp(this.calcPoints.map(mapVectorToArray))
      : // for line and point
        [];
  }

  updateConvexPolygons(convex: number[][][] = this.getConvex()): void {
    convex.forEach((points: number[][], index: number) => {
      // lazy create
      if (!this.convexPolygons[index]) {
        this.convexPolygons[index] = new SATPolygon();
      }

      this.convexPolygons[index].pos.x = this.x;
      this.convexPolygons[index].pos.y = this.y;
      this.convexPolygons[index].setPoints(
        ensurePolygonPoints(points.map(mapArrayToVector))
      );
    });

    // trim array length
    this.convexPolygons.length = convex.length;
  }

  /**
   * after points update set is convex
   */
  protected updateIsConvex(): void {
    // all other types other than polygon are always convex
    const convex = this.getConvex();
    // everything with empty array or one element array
    this.isConvex = convex.length <= 1;
  }
}
