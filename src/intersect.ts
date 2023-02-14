import { pointInCircle, pointInPolygon as pointInConvexPolygon } from "sat";

import { SATVector, Vector } from "./model";
import { Circle } from "./bodies/circle";
import { Polygon } from "./bodies/polygon";
import { Line } from "./bodies/line";
import { ensureConvex } from "./utils";

export function polygonInCircle(
  polygon: Polygon,
  circle: Pick<Circle, "pos" | "r">
): boolean {
  return polygon.calcPoints.every((p) => pointInCircle(p, circle));
}

export function pointInPolygon(a: Vector, b: Polygon): boolean {
  return (ensureConvex(b) as []).some((convex) =>
    pointInConvexPolygon(a as SATVector, convex as Polygon)
  );
}

export function polygonInPolygon(a: Polygon, b: Polygon): boolean {
  return a.calcPoints.every((point) => pointInPolygon(point, b));
}

export function pointOnCircle(
  p: Vector,
  { r, pos }: Pick<Circle, "pos" | "r">
): boolean {
  return (
    (p.x - pos.x) * (p.x - pos.x) + (p.y - pos.y) * (p.y - pos.y) === r * r
  );
}

export function circleInCircle(
  a: Pick<Circle, "pos" | "r">,
  b: Pick<Circle, "pos" | "r">
) {
  const x1 = a.pos.x;
  const y1 = a.pos.y;
  const x2 = b.pos.x;
  const y2 = b.pos.y;
  const r1 = a.r;
  const r2 = b.r;
  const distSq = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));

  return distSq + r2 === r1 || distSq + r2 < r1;
}

export function circleInPolygon(
  circle: Pick<Circle, "pos" | "r">,
  polygon: Polygon
): boolean {
  // Circle with radius 0 isn't a circle
  if (circle.r === 0) {
    return false;
  }

  const { calcPoints } = polygon;
  // If the center of the circle is not within the polygon,
  // then the circle may overlap, but it'll never be "contained"
  // so return false
  if (!pointInPolygon(circle.pos, polygon)) {
    return false;
  }

  for (let i = 0; i < calcPoints.length; i++) {
    // If any point of the polygon is within the circle,
    // the circle is not "contained"
    // so return false
    if (pointInCircle(calcPoints[i], circle)) {
      return false;
    }
  }

  for (let i = 0; i < calcPoints.length; i++) {
    // If any line-segment of the polygon intersects the circle,
    // the circle is not "contained"
    // so return false

    const start: Vector = i === 0 ? calcPoints[0] : calcPoints[i];
    const end: Vector =
      i === 0
        ? calcPoints[calcPoints.length - 1]
        : calcPoints[i + 1] || calcPoints[i];

    if (intersectLineCircle({ start, end }, circle).length) {
      return false;
    }
  }

  return true;
}

export function circleOutsidePolygon(
  circle: Pick<Circle, "pos" | "r">,
  polygon: Polygon
): boolean {
  // Circle with radius 0 isn't a circle
  if (circle.r === 0) {
    return false;
  }

  // If the center of the circle is within the polygon,
  // the circle is not outside of the polygon completely.
  // so return false.
  if (pointInPolygon(circle.pos, polygon)) {
    return false;
  }

  const { calcPoints } = polygon;
  for (let i = 0; i < calcPoints.length; i++) {
    // If any point of the polygon is within the circle,
    // or any point of the polygon lies on the circle,
    // the circle is not outside of the polygon
    // so return false.
    if (
      pointInCircle(calcPoints[i], circle) ||
      pointOnCircle(calcPoints[i], circle)
    ) {
      return false;
    }
  }

  for (let i = 0; i < calcPoints.length; i++) {
    // If any line-segment of the polygon intersects the circle,
    // the circle is not outside the polygon, it is overlapping,
    // so return false

    const start: Vector = i === 0 ? calcPoints[0] : calcPoints[i];
    const end: Vector =
      i === 0
        ? calcPoints[calcPoints.length - 1]
        : calcPoints[i + 1] || calcPoints[i];

    if (intersectLineCircle({ start, end }, circle).length) {
      return false;
    }
  }

  return true;
}

// TODO compare in raycast then Benchmark and remove or remove the other
export function intersectLineCircleProposal(
  { start, end }: Pick<Line, "start" | "end">,
  { pos, r }: Pick<Circle, "pos" | "r">
): boolean {
  const X1 = start.x;
  const X2 = end.x;
  const Y1 = start.y;
  const Y2 = end.y;

  const A = Y1 - Y2;
  const B = X2 - X1;
  const C = X1 * Y2 - X2 * Y1;

  // radius === distance = touching/tangent
  // radius > distance = not intersecting
  // radius < distance = intersecting
  const distance: number =
    Math.abs(A * pos.x + B * pos.y + C) / Math.sqrt(A * A + B * B);

  return distance <= r;
}

// https://stackoverflow.com/questions/37224912/circle-line-segment-collision
export function intersectLineCircle(
  line: Pick<Line, "start" | "end">,
  { pos, r }: Pick<Circle, "pos" | "r">
): Vector[] {
  const v1 = { x: line.end.x - line.start.x, y: line.end.y - line.start.y };
  const v2 = { x: line.start.x - pos.x, y: line.start.y - pos.y };
  const b = (v1.x * v2.x + v1.y * v2.y) * -2;
  const c = (v1.x * v1.x + v1.y * v1.y) * 2;
  const d = Math.sqrt(b * b - (v2.x * v2.x + v2.y * v2.y - r * r) * c * 2);

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
export function intersectLineLine(
  line1: Pick<Line, "start" | "end">,
  line2: Pick<Line, "start" | "end">
): Vector | null {
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
      const side = {
        start: { x: from.x + polygon.pos.x, y: from.y + polygon.pos.y },
        end: { x: to.x + polygon.pos.x, y: to.y + polygon.pos.y },
      };

      return intersectLineLine(line, side);
    })
    .filter((test: Vector | null) => !!test) as Vector[];
}
