import SAT from "sat";
import { PotentialVector, Vector } from "./model";

export function createOval(
  radiusX: number,
  radiusY: number = radiusX,
  step = 1
): SAT.Vector[] {
  const steps: number = 2 * Math.PI * Math.hypot(radiusX, radiusY);
  const length: number = Math.max(8, Math.ceil(steps / step));

  return Array.from({ length }, (_: unknown, index: number) => {
    const value: number = (index / length) * 2 * Math.PI;
    const x: number = Math.cos(value) * radiusX;
    const y: number = Math.sin(value) * radiusY;

    return new SAT.Vector(x, y);
  });
}

/**
 * creates box polygon points
 * @param {number} width
 * @param {number} height
 * @returns SAT.Vector
 */
export function createBox(width: number, height: number): SAT.Vector[] {
  return [
    new SAT.Vector(),
    new SAT.Vector(width, 0),
    new SAT.Vector(width, height),
    new SAT.Vector(0, height),
  ];
}

/**
 * ensure returns a SAT.Vector
 * @param {SAT.Vector} point
 */
export function ensureVectorPoint(point: PotentialVector = {}): SAT.Vector {
  return point instanceof SAT.Vector
    ? point
    : new SAT.Vector(point.x || 0, point.y || 0);
}

/**
 * ensure correct counterclockwise points
 * @param {SAT.Vector[]} points
 */
export function ensurePolygonPoints(points: PotentialVector[]): SAT.Vector[] {
  if (!points) {
    throw new Error("No points array provided");
  }

  const vectorPoints: SAT.Vector[] = points.map(ensureVectorPoint);

  return clockwise(vectorPoints) ? vectorPoints.reverse() : vectorPoints;
}

/**
 * get distance between two {x, y} points
 * @param {Vector} a
 * @param {Vector} b
 * @returns {number}
 */
export function distance(a: Vector, b: Vector): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

/**
 * returns function to sort raycast results
 * @param {Vector} from
 * @returns {function}
 */
export function closest(
  from: Vector
): (a: { point: Vector } | null, b: { point: Vector } | null) => number {
  return (a: { point: Vector } | null, b: { point: Vector } | null) => {
    if (!a && !b) {
      return 0;
    }

    if (!a) {
      return -Infinity;
    }

    if (!b) {
      return Infinity;
    }

    return distance(from, a.point) - distance(from, b.point);
  };
}

/**
 * check direction of polygon
 * @param {SAT.Vector[]} points
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
 * draws dashed line on canvas context
 * @param {CanvasRenderingContext2D} context
 * @param {number} fromX
 * @param {number} fromY
 * @param {number} toX
 * @param {number} toY
 * @param {number?} dash
 * @param {number?} gap
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
