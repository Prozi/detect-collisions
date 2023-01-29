import { quickDecomp, Polygon as DecompPolygon } from "poly-decomp";
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
  drawPolygon,
} from "../utils";

/**
 * collider - polygon
 */
export class Polygon extends SATPolygon implements BBox, Collider {
  /**
   * minimum x bound of body
   */
  minX!: number;

  /**
   * maximum x bound of body
   */
  maxX!: number;

  /**
   * minimum y bound of body
   */
  minY!: number;

  /**
   * maximum y bound of body
   */
  maxY!: number;

  /**
   * bounding box cache, without padding
   */
  bbox!: BBox;

  /**
   * is it a convex polgyon as opposed to a hollow inside (concave) polygon
   */
  isConvex!: boolean;

  /**
   * optimization for convex polygons
   */
  convexPolygons!: SATPolygon[];

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

  /**
   * type of body
   */
  readonly type:
    | Types.Polygon
    | Types.Box
    | Types.Point
    | Types.Ellipse
    | Types.Line = Types.Polygon;

  /**
   * backup of points used for scaling
   */
  protected pointsBackup!: Vector[];

  /**
   * scale Vector of body
   */
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
    this.updateConvexPolygonPositions();
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
    this.updateConvexPolygonPositions();
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
    this.updateConvexPolygonPositions();
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
  draw(context: CanvasRenderingContext2D) {
    drawPolygon(context, this, this.isTrigger);
  }

  /**
   * get body centroid without applied angle
   */
  getCentroidWithoutRotation(): Vector {
    // keep angle copy
    const angle = this.angle;
    // reset angle for get centroid
    this.setAngle(0);
    // get centroid
    const centroid: Vector = this.getCentroid();
    // revert angle change
    this.setAngle(angle);

    return centroid;
  }

  /**
   * sets polygon points to new array of vectors
   */
  setPoints(points: SATVector[]): Polygon {
    super.setPoints(points);
    this.updateIsConvex();
    this.pointsBackup = clonePointsArray(points);

    return this;
  }

  /**
   * translates polygon points in x, y direction
   */
  translate(x: number, y: number): Polygon {
    super.translate(x, y);
    this.pointsBackup = clonePointsArray(this.points);

    return this;
  }

  /**
   * rotates polygon points by angle
   */
  rotate(angle: number): Polygon {
    super.rotate(angle);
    this.pointsBackup = clonePointsArray(this.points);

    return this;
  }

  /**
   * center the box anchor
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

  /**
   * update the position of the decomposed convex polygons (if any), called
   * after the position of the body has changed
   */
  protected updateConvexPolygonPositions() {
    this.convexPolygons?.forEach((polygon: SATPolygon) => {
      polygon.pos.x = this.pos.x;
      polygon.pos.y = this.pos.y;
    });
  }

  /**
   * returns body split into convex polygons, or empty array for convex bodies
   */
  protected getConvex(): DecompPolygon[] {
    if ((this.type && this.type !== Types.Polygon) || this.points.length <= 3) {
      return [];
    }

    return quickDecomp(this.calcPoints.map(mapVectorToArray));
  }

  /**
   * updates convex polygons cache in body
   */
  protected updateConvexPolygons(
    convex: DecompPolygon[] = this.getConvex()
  ): void {
    if (this.isConvex) {
      return;
    }

    if (!this.convexPolygons) {
      this.convexPolygons = [];
    }

    convex.forEach((points: DecompPolygon, index: number) => {
      // lazy create
      if (!this.convexPolygons[index]) {
        this.convexPolygons[index] = new SATPolygon();
      }

      this.convexPolygons[index].pos.x = this.pos.x;
      this.convexPolygons[index].pos.y = this.pos.y;
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
    this.updateConvexPolygons(convex);
  }
}
