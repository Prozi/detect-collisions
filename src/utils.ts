import { BBox } from "rbush";
import { Polygon as SATPolygon, Vector as SATVector } from "sat";

import { Circle } from "./bodies/circle";
import { Line } from "./bodies/line";
import { Polygon } from "./bodies/polygon";
import { Body, BodyOptions, PotentialVector, Types, Vector } from "./model";

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

export function updateAABB(body: Body, bounds: BBox): void {
  body.minX = bounds.minX - body.padding;
  body.minY = bounds.minY - body.padding;
  body.maxX = bounds.maxX + body.padding;
  body.maxY = bounds.maxY + body.padding;
}

export function checkAInB(a: BBox, b: BBox): boolean {
  const insideX = a.minX >= b.minX && a.maxX <= b.maxX;
  const insideY = a.minY >= b.minY && a.maxY <= b.maxY;

  return insideX && insideY;
}

export function clonePointsArray(points: SATVector[]): SATVector[] {
  return Array.from(points, (_: unknown, index: number) =>
    points[index].clone()
  );

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

// https://stackoverflow.com/questions/37224912/circle-line-segment-collision
export function intersectLineCircle(line: Line, circle: Circle): Vector[] {
  const v1 = { x: line.end.x - line.start.x, y: line.end.y - line.start.y };
  const v2 = { x: line.start.x - circle.pos.x, y: line.start.y - circle.pos.y };
  const b = (v1.x * v2.x + v1.y * v2.y) * -2;
  const c = (v1.x * v1.x + v1.y * v1.y) * 2;
  const d = Math.sqrt(
    b * b - (v2.x * v2.x + v2.y * v2.y - circle.r * circle.r) * c * 2
  );

  if (isNaN(d)) {
    // no intercept
    return [];
  }

  const u1 = (b - d) / c; // these represent the unit distance of point one and two on the line
  const u2 = (b + d) / c;
  const results: Vector[] = []; // return array

  if (u1 <= 1 && u1 >= 0) {
    // add point if on the line segment
    results.push({ x: line.start.x + v1.x * u1, y: line.start.y + v1.y * u1 });
  }

  if (u2 <= 1 && u2 >= 0) {
    // second add point if on the line segment
    results.push({ x: line.start.x + v1.x * u2, y: line.start.y + v1.y * u2 });
  }

  return results;
}

// https://stackoverflow.com/questions/9043805/test-if-two-lines-intersect-javascript-function
export function intersectLineLine(line1: Line, line2: Line): Vector | null {
  const dX: number = line1.end.x - line1.start.x;
  const dY: number = line1.end.y - line1.start.y;

  const determinant: number =
    dX * (line2.end.y - line2.start.y) - (line2.end.x - line2.start.x) * dY;

  if (determinant === 0) {
    return null;
  }

  const lambda: number =
    ((line2.end.y - line2.start.y) * (line2.end.x - line1.start.x) +
      (line2.start.x - line2.end.x) * (line2.end.y - line1.start.y)) /
    determinant;

  const gamma: number =
    ((line1.start.y - line1.end.y) * (line2.end.x - line1.start.x) +
      dX * (line2.end.y - line1.start.y)) /
    determinant;

  // check if there is an intersection
  if (!(lambda >= 0 && lambda <= 1) || !(gamma >= 0 && gamma <= 1)) {
    return null;
  }

  return { x: line1.start.x + lambda * dX, y: line1.start.y + lambda * dY };
}

/**
 * check if line (ray) intersects polygon
 */
export function intersectLinePolygon(line: Line, polygon: Polygon): Vector[] {
  return polygon.calcPoints
    .map((to: Vector, index: number) => {
      const from: Vector = index
        ? polygon.calcPoints[index - 1]
        : polygon.calcPoints[polygon.calcPoints.length - 1];
      const side: Line = new Line(
        { x: from.x + polygon.pos.x, y: from.y + polygon.pos.y },
        { x: to.x + polygon.pos.x, y: to.y + polygon.pos.y }
      );

      return intersectLineLine(line, side);
    })
    .filter((test: Vector | null) => !!test) as Vector[];
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
export function ensureConvexPolygons(body: Polygon): SATPolygon[] {
  if (body.isConvex) {
    return [body];
  }

  body.updateConvexPolygons();

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
