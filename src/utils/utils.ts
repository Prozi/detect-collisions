import { BBox } from "rbush";
import {
  testCircleCircle,
  testCirclePolygon,
  testPolygonCircle,
  testPolygonPolygon,
  Vector as SATVector,
} from "sat";

import {
  Body,
  BodyOptions,
  PotentialVector,
  TestFunction,
  Types,
  Vector,
} from "../model";

export function createEllipse(
  radiusX: number,
  radiusY: number = radiusX,
  step = 1
): SATVector[] {
  const steps: number = Math.PI * Math.hypot(radiusX, radiusY) * 2;
  const length: number = Math.max(8, Math.ceil(steps / Math.max(1, step)));

  return Array.from({ length }, (_: unknown, index: number) => {
    const value: number = (index / length) * 2 * Math.PI;
    const x: number = Math.cos(value) * radiusX;
    const y: number = Math.sin(value) * radiusY;

    return new SATVector(x, y);
  });
}

/**
 * creates box polygon points
 */
export function createBox(width: number, height: number): SATVector[] {
  return [
    new SATVector(0, 0),
    new SATVector(width, 0),
    new SATVector(width, height),
    new SATVector(0, height),
  ];
}

/**
 * ensure Vector point
 */
export function ensureVectorPoint(point: PotentialVector = {}): SATVector {
  return point instanceof SATVector
    ? point
    : new SATVector(point.x || 0, point.y || 0);
}

/**
 * ensure Vector points (for polygon) in counter-clockwise order
 */
export function ensurePolygonPoints(points: PotentialVector[]): SATVector[] {
  if (!points) {
    throw new Error("No points array provided");
  }

  const polygonPoints: SATVector[] = points.map(ensureVectorPoint);

  return clockwise(polygonPoints) ? polygonPoints.reverse() : polygonPoints;
}

/**
 * get distance between two {x, y} points
 */
export function distance(a: Vector, b: Vector): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

/**
 * check direction of polygon
 */
export function clockwise(points: Vector[]): boolean {
  let sum = 0;

  for (let i = 0; i < points.length; i++) {
    const v1 = points[i];
    const v2 = points[(i + 1) % points.length];

    sum += (v2.x - v1.x) * (v2.y + v1.y);
  }

  return sum > 0;
}

/**
 * used for all types of bodies
 */
export function extendBody(body: Body, options?: BodyOptions): void {
  body.isStatic = !!options?.isStatic;
  body.isTrigger = !!options?.isTrigger;
  body.padding = options?.padding || 0;

  if (options?.center) {
    body.center();
  }

  body.setAngle(options?.angle || 0);
}

// check if body moved outside of padding
export function bodyMoved(body: Body): boolean {
  return (
    body.bbox.minX < body.minX ||
    body.bbox.minY < body.minY ||
    body.bbox.maxX > body.maxX ||
    body.bbox.maxY > body.maxY
  );
}

export function intersectAABB(a: BBox, b: BBox): boolean {
  return !(
    b.minX > a.maxX ||
    b.minY > a.maxY ||
    b.maxX < a.minX ||
    b.maxY < a.minY
  );
}

export function checkAInB(a: BBox, b: BBox): boolean {
  const insideX = a.minX >= b.minX && a.maxX <= b.maxX;
  const insideY = a.minY >= b.minY && a.maxY <= b.maxY;

  return insideX && insideY;
}

export function clonePointsArray(points: SATVector[]): Vector[] {
  return points.map(({ x, y }) => ({
    x,
    y,
  }));
}

/**
 * change format from poly-decomp to SAT.js
 */
export function mapVectorToArray({ x, y }: Vector): number[] {
  return [x, y];
}

/**
 * change format from SAT.js to poly-decomp
 */
export function mapArrayToVector([x, y]: number[]): Vector {
  return { x, y };
}

/**
 * replace body with array of related convex polygons
 */
export function ensureConvex(body: Body): Body[] {
  if (body.isConvex || body.type !== Types.Polygon) {
    return [body];
  }

  return body.convexPolygons as Body[];
}

/**
 * given 2 bodies calculate vector of bounce assuming equal mass and they are circles
 */
export function getBounceDirection(body: Vector, collider: Vector): Vector {
  const v2 = new SATVector(collider.x - body.x, collider.y - body.y);
  const v1 = new SATVector(body.x - collider.x, body.y - collider.y);
  const len = v1.dot(v2.normalize()) * 2;

  return new SATVector(v2.x * len - v1.x, v2.y * len - v1.y).normalize();
}

export function getSATFunction(body: Body, wall: Body): TestFunction {
  if (body.type === Types.Circle) {
    return (
      wall.type === Types.Circle ? testCircleCircle : testCirclePolygon
    ) as TestFunction;
  }

  return (
    wall.type === Types.Circle ? testPolygonCircle : testPolygonPolygon
  ) as TestFunction;
}
