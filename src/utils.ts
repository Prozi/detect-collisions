import { BBox } from "rbush";
import { Point as DecompPoint } from "poly-decomp";
import {
  testCircleCircle,
  testCirclePolygon,
  testPolygonCircle,
  testPolygonPolygon,
  Vector as SATVector,
} from "sat";
import { Circle } from "./bodies/circle";
import { Point } from "./bodies/point";

import { Polygon } from "./bodies/polygon";
import {
  circleInCircle,
  circleInPolygon,
  polygonInCircle,
  polygonInPolygon,
} from "./intersect";
import {
  Body,
  BodyOptions,
  PotentialVector,
  SATPolygon,
  SATTest,
  BodyType,
  Vector,
} from "./model";
import { forEach, map } from "./optimized";

export const DEG2RAD = Math.PI / 180;
export const RAD2DEG = 180 / Math.PI;

/**
 * convert from degrees to radians
 */
export function deg2rad(degrees: number) {
  return degrees * DEG2RAD;
}

/**
 * convert from radians to degrees
 */
export function rad2deg(radians: number) {
  return radians * RAD2DEG;
}

/**
 * creates ellipse-shaped polygon based on params
 */
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

  const polygonPoints: SATVector[] = map(points, ensureVectorPoint);

  return clockwise(polygonPoints) ? polygonPoints.reverse() : polygonPoints;
}

/**
 * get distance between two Vector points
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
  if (body.type !== BodyType.Circle) {
    body.isCentered = options?.isCentered || false;
  }
  body.setAngle(options?.angle || 0);
}

/**
 * check if body moved outside of its padding
 */
export function bodyMoved(body: Body): boolean {
  return (
    body.bbox.minX < body.minX ||
    body.bbox.minY < body.minY ||
    body.bbox.maxX > body.maxX ||
    body.bbox.maxY > body.maxY
  );
}

/**
 * checks if two boxes intersect
 */
export function intersectAABB(a: BBox, b: BBox): boolean {
  return !(
    b.minX > a.maxX ||
    b.minY > a.maxY ||
    b.maxX < a.minX ||
    b.maxY < a.minY
  );
}

/**
 * checks if body a is in body b
 */
export function checkAInB(a: Body, b: Body): boolean {
  if (a.type === BodyType.Circle) {
    if (b.type !== BodyType.Circle) {
      return circleInPolygon(a, b);
    }

    return circleInCircle(a, b);
  }

  if (b.type === BodyType.Circle) {
    return polygonInCircle(a, b);
  }

  return polygonInPolygon(a, b);
}

/**
 * clone sat vector points array into vector points array
 */
export function clonePointsArray(points: SATVector[]): Vector[] {
  return map(points, ({ x, y }: Vector) => ({
    x,
    y,
  }));
}

/**
 * draws dashed line on canvas context
 */
export function dashLineTo(
  context: CanvasRenderingContext2D,
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  dash = 2,
  gap = 4
): void {
  const xDiff = toX - fromX;
  const yDiff = toY - fromY;
  const arc = Math.atan2(yDiff, xDiff);
  const offsetX = Math.cos(arc);
  const offsetY = Math.sin(arc);

  let posX = fromX;
  let posY = fromY;
  let dist = Math.hypot(xDiff, yDiff);

  while (dist > 0) {
    const step = Math.min(dist, dash);

    context.moveTo(posX, posY);
    context.lineTo(posX + offsetX * step, posY + offsetY * step);

    posX += offsetX * (dash + gap);
    posY += offsetY * (dash + gap);

    dist -= dash + gap;
  }
}

/**
 * change format from poly-decomp to SAT.js
 */
export function mapVectorToArray(
  { x, y }: Vector = { x: 0, y: 0 }
): DecompPoint {
  return [x, y];
}

/**
 * change format from SAT.js to poly-decomp
 */
export function mapArrayToVector([x, y]: DecompPoint = [0, 0]): Vector {
  return { x, y };
}

/**
 * replace body with array of related convex polygons
 */
export function ensureConvex<T extends Body = Circle | Point | Polygon>(
  body: T
): (T | SATPolygon)[] {
  if (body.isConvex || body.type !== BodyType.Polygon) {
    return [body];
  }

  return body.convexPolygons;
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

/**
 * returns correct sat.js testing function based on body types
 */
export function getSATTest(body: Body, wall: Body): SATTest {
  if (body.type === BodyType.Circle) {
    return wall.type === BodyType.Circle ? testCircleCircle : testCirclePolygon;
  }

  return wall.type === BodyType.Circle ? testPolygonCircle : testPolygonPolygon;
}

/**
 * draw polygon
 */
export function drawPolygon(
  context: CanvasRenderingContext2D,
  {
    pos,
    calcPoints,
  }: Pick<Polygon | SATPolygon, "calcPoints"> & { pos: Vector },
  isTrigger = false
): void {
  const loopPoints = [...calcPoints, calcPoints[0]];

  forEach(loopPoints, (point: Vector, index: number) => {
    const toX = pos.x + point.x;
    const toY = pos.y + point.y;
    const prev = calcPoints[index - 1] || calcPoints[calcPoints.length - 1];

    if (!index) {
      if (calcPoints.length === 1) {
        context.arc(toX, toY, 1, 0, Math.PI * 2);
      } else {
        context.moveTo(toX, toY);
      }
    } else if (calcPoints.length > 1) {
      if (isTrigger) {
        const fromX = pos.x + prev.x;
        const fromY = pos.y + prev.y;

        dashLineTo(context, fromX, fromY, toX, toY);
      } else {
        context.lineTo(toX, toY);
      }
    }
  });
}
