import { Circle } from "../bodies/circle";
import { Line } from "../bodies/line";
import { Polygon } from "../bodies/polygon";
import { RaycastResult, Types, Vector, Body } from "../model";
import { System } from "../system";
import { distance } from "./utils";

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
 * raycast to get collider of ray from start to end
 */
export function raycast(
  system: System,
  start: Vector,
  end: Vector,
  allowCollider: (testCollider: Body) => boolean = () => true
): RaycastResult {
  let minDistance = Infinity;
  let result: RaycastResult = null;

  const ray: Line = system.createLine(start, end);
  const colliders: Body[] = system
    .getPotentials(ray)
    .filter(
      (potential: Body) =>
        allowCollider(potential) && system.checkCollision(ray, potential)
    );

  system.remove(ray);

  colliders.forEach((collider: Body) => {
    const points: Vector[] =
      collider.type === Types.Circle
        ? intersectLineCircle(ray, collider)
        : intersectLinePolygon(ray, collider);

    points.forEach((point: Vector) => {
      const pointDistance: number = distance(start, point);

      if (pointDistance < minDistance) {
        minDistance = pointDistance;
        result = { point, collider };
      }
    });
  });

  return result;
}
