import { Body, Data, RBush, Vector } from "../model";
import { Polygon } from "../bodies/polygon";
import { createBox } from "./utils";
import { Circle } from "../bodies/circle";

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
 * draw bodies
 */
export function draw(
  system: RBush<Body>,
  context: CanvasRenderingContext2D
): void {
  system.all().forEach((body: Body) => {
    body.draw(context);
  });
}

/**
 * draw hierarchy
 */
export function drawBVH(
  system: RBush<Body> & Data,
  context: CanvasRenderingContext2D
): void {
  [...system.all(), ...system.data.children].forEach(
    ({ minX, maxX, minY, maxY }: Body) => {
      Polygon.prototype.draw.call(
        {
          x: minX,
          y: minY,
          calcPoints: createBox(maxX - minX, maxY - minY),
        },
        context
      );
    }
  );
}

/**
 * draw polygon helper function
 */
export function drawPolygon(
  polygon: Polygon,
  context: CanvasRenderingContext2D
): void {
  const points: Vector[] = [...polygon.calcPoints, polygon.calcPoints[0]];

  points.forEach((point: Vector, index: number) => {
    const toX = polygon.x + point.x;
    const toY = polygon.y + point.y;
    const prev =
      polygon.calcPoints[index - 1] ||
      polygon.calcPoints[polygon.calcPoints.length - 1];

    if (!index) {
      if (polygon.calcPoints.length === 1) {
        context.arc(toX, toY, 1, 0, Math.PI * 2);
      } else {
        context.moveTo(toX, toY);
      }
    } else if (polygon.calcPoints.length > 1) {
      if (polygon.isTrigger) {
        const fromX = polygon.x + prev.x;
        const fromY = polygon.y + prev.y;

        dashLineTo(context, fromX, fromY, toX, toY);
      } else {
        context.lineTo(toX, toY);
      }
    }
  });
}

/**
 * draw circle helper function
 */
export function drawCircle(
  circle: Circle,
  context: CanvasRenderingContext2D
): void {
  const x = circle.x + circle.offset.x;
  const y = circle.y + circle.offset.y;

  if (circle.isTrigger) {
    const max = Math.max(8, circle.r);

    for (let i = 0; i < max; i++) {
      const arc = (i / max) * 2 * Math.PI;
      const arcPrev = ((i - 1) / max) * 2 * Math.PI;
      const fromX = x + Math.cos(arcPrev) * circle.r;
      const fromY = y + Math.sin(arcPrev) * circle.r;
      const toX = x + Math.cos(arc) * circle.r;
      const toY = y + Math.sin(arc) * circle.r;

      dashLineTo(context, fromX, fromY, toX, toY);
    }
  } else {
    context.moveTo(x + circle.r, y);
    context.arc(x, y, circle.r, 0, Math.PI * 2);
  }
}
