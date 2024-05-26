import { Point as DecompPoint } from "poly-decomp-es";
import { BBox } from "rbush";
import {
  Response,
  testCircleCircle,
  testCirclePolygon,
  testPolygonCircle,
  testPolygonPolygon,
  Vector as SATVector,
} from "sat";

import { Polygon } from "./bodies/polygon";
import {
  circleInCircle,
  circleInPolygon,
  polygonInCircle,
  polygonInPolygon,
} from "./intersect";
import {
  Body,
  BodyGroup,
  BodyOptions,
  BodyType,
  InTest,
  PotentialVector,
  SATPolygon,
  SATTest,
  Vector,
} from "./model";
import { forEach, map } from "./optimized";

/* helpers for faster getSATTest() and checkAInB() */

const testMap = {
  satCircleCircle: testCircleCircle,
  satCirclePolygon: testCirclePolygon,
  satPolygonCircle: testPolygonCircle,
  satPolygonPolygon: testPolygonPolygon,
  inCircleCircle: circleInCircle,
  inCirclePolygon: circleInPolygon,
  inPolygonCircle: polygonInCircle,
  inPolygonPolygon: polygonInPolygon,
};

function createMap<T = SATTest | InTest>(
  bodyType: BodyType.Circle | BodyType.Polygon,
  testType: "sat" | "in",
): Record<BodyType, T> {
  return Object.values(BodyType).reduce(
    (result, type) => ({
      ...result,
      [type]:
        type === BodyType.Circle
          ? testMap[`${testType}${bodyType}Circle`]
          : testMap[`${testType}${bodyType}Polygon`],
    }),
    {} as Record<BodyType, T>,
  );
}

const circleSATFunctions = createMap<SATTest>(BodyType.Circle, "sat");
const circleInFunctions = createMap<InTest>(BodyType.Circle, "in");
const polygonSATFunctions = createMap<SATTest>(BodyType.Polygon, "sat");
const polygonInFunctions = createMap<InTest>(BodyType.Polygon, "in");

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
  step = 1,
): SATVector[] {
  const steps: number = Math.PI * Math.hypot(radiusX, radiusY) * 2;
  const length: number = Math.max(8, Math.ceil(steps / Math.max(1, step)));
  const ellipse: SATVector[] = [];

  for (let index = 0; index < length; index++) {
    const value: number = (index / length) * 2 * Math.PI;
    const x: number = Math.cos(value) * radiusX;
    const y: number = Math.sin(value) * radiusY;

    ellipse.push(new SATVector(x, y));
  }

  return ellipse;
}

/**
 * creates box shaped polygon points
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
 * ensure SATVector type point result
 */
export function ensureVectorPoint(point: PotentialVector = {}): SATVector {
  return point instanceof SATVector
    ? point
    : new SATVector(point.x || 0, point.y || 0);
}

/**
 * ensure Vector points (for polygon) in counter-clockwise order
 */
export function ensurePolygonPoints(
  points: PotentialVector[] = [],
): SATVector[] {
  const polygonPoints: SATVector[] = map(points, ensureVectorPoint);

  return clockwise(polygonPoints) ? polygonPoints.reverse() : polygonPoints;
}

/**
 * get distance between two Vector points
 */
export function distance(bodyA: Vector, bodyB: Vector): number {
  const xDiff = bodyA.x - bodyB.x;
  const yDiff = bodyA.y - bodyB.y;

  return Math.hypot(xDiff, yDiff);
}

/**
 * check [is clockwise] direction of polygon
 */
export function clockwise(points: Vector[]): boolean {
  const length = points.length;
  let sum = 0;

  forEach(points, (v1, index) => {
    const v2 = points[(index + 1) % length];

    sum += (v2.x - v1.x) * (v2.y + v1.y);
  });

  return sum > 0;
}

/**
 * used for all types of bodies in constructor
 */
export function extendBody(body: Body, options: BodyOptions = {}): void {
  body.isStatic = !!options.isStatic;
  body.isTrigger = !!options.isTrigger;
  body.padding = options.padding || 0;
  body.group = typeof options.group === "number" ? options.group : 0x7fffffff;

  if (body.typeGroup !== BodyGroup.Circle) {
    body.isCentered = options.isCentered || false;
  }

  body.setAngle(options.angle || 0);
}

/**
 * check if body moved outside of its padding
 */
export function bodyMoved(body: Body): boolean {
  const { bbox, minX, minY, maxX, maxY } = body;

  return (
    bbox.minX < minX || bbox.minY < minY || bbox.maxX > maxX || bbox.maxY > maxY
  );
}

/**
 * returns true if two boxes not intersect
 */
export function notIntersectAABB(bodyA: BBox, bodyB: BBox): boolean {
  return (
    bodyB.minX > bodyA.maxX ||
    bodyB.minY > bodyA.maxY ||
    bodyB.maxX < bodyA.minX ||
    bodyB.maxY < bodyA.minY
  );
}

/**
 * checks if two boxes intersect
 */
export function intersectAABB(bodyA: BBox, bodyB: BBox): boolean {
  return !notIntersectAABB(bodyA, bodyB);
}

/**
 * checks if two bodies can interact (for collision filtering)
 */
export function canInteract(bodyA: Body, bodyB: Body): boolean {
  return (
    ((bodyA.group >> 16) & (bodyB.group & 0xffff) &&
      (bodyB.group >> 16) & (bodyA.group & 0xffff)) !== 0
  );
}

/**
 * checks if body a is in body b
 */
export function checkAInB(bodyA: Body, bodyB: Body): boolean {
  const check =
    bodyA.typeGroup === BodyGroup.Circle
      ? circleInFunctions
      : polygonInFunctions;

  return check[bodyB.type](bodyA, bodyB);
}

/**
 * clone sat vector points array into vector points array
 */
export function clonePointsArray(points: SATVector[]): Vector[] {
  return map(points, ({ x, y }: Vector) => ({ x, y }));
}

/**
 * change format from SAT.js to poly-decomp
 */
export function mapVectorToArray(
  { x, y }: Vector = { x: 0, y: 0 },
): DecompPoint {
  return [x, y];
}

/**
 * change format from poly-decomp to SAT.js
 */
export function mapArrayToVector([x, y]: DecompPoint = [0, 0]): Vector {
  return { x, y };
}

/**
 * given 2 bodies calculate vector of bounce assuming equal mass and they are circles
 */
export function getBounceDirection(body: Vector, collider: Vector): SATVector {
  const v2 = new SATVector(collider.x - body.x, collider.y - body.y);
  const v1 = new SATVector(body.x - collider.x, body.y - collider.y);
  const len = v1.dot(v2.normalize()) * 2;

  return new SATVector(v2.x * len - v1.x, v2.y * len - v1.y).normalize();
}

/**
 * returns correct sat.js testing function based on body types
 */
export function getSATTest(bodyA: Body, bodyB: Body): SATTest {
  const check =
    bodyA.typeGroup === BodyGroup.Circle
      ? circleSATFunctions
      : polygonSATFunctions;

  return check[bodyB.type];
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
  gap = 4,
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
 * draw polygon
 */
export function drawPolygon(
  context: CanvasRenderingContext2D,
  {
    pos,
    calcPoints,
  }: Pick<Polygon | SATPolygon, "calcPoints"> & { pos: Vector },
  isTrigger = false,
): void {
  const lastPoint = calcPoints[calcPoints.length - 1];
  const fromX = pos.x + lastPoint.x;
  const fromY = pos.y + lastPoint.y;

  if (calcPoints.length === 1) {
    context.arc(fromX, fromY, 1, 0, Math.PI * 2);
  } else {
    context.moveTo(fromX, fromY);
  }

  forEach(calcPoints, (point, index) => {
    const toX = pos.x + point.x;
    const toY = pos.y + point.y;

    if (isTrigger) {
      const prev = calcPoints[index - 1] || lastPoint;
      dashLineTo(context, pos.x + prev.x, pos.y + prev.y, toX, toY);
    } else {
      context.lineTo(toX, toY);
    }
  });
}

/**
 * draw body bounding body box
 */
export function drawBVH(context: CanvasRenderingContext2D, body: Body) {
  drawPolygon(context, {
    pos: { x: body.minX, y: body.minY },
    calcPoints: createBox(body.maxX - body.minX, body.maxY - body.minY),
  });
}

/**
 * clone response object returning new response with previous ones values
 */
export function cloneResponse(response: Response) {
  const clone = new Response();
  const { a, b, overlap, overlapN, overlapV, aInB, bInA } = response;
  clone.a = a;
  clone.b = b;
  clone.overlap = overlap;
  clone.overlapN = overlapN.clone();
  clone.overlapV = overlapV.clone();
  clone.aInB = aInB;
  clone.bInA = bInA;

  return clone;
}

/**
 * dummy fn used as default, for optimization
 */
export function returnTrue() {
  return true;
}

/**
 * binary string to decimal number
 */
export function bin2dec(binary: string): number {
  return Number(`0b${binary}`.replace(/\s/g, ""));
}
