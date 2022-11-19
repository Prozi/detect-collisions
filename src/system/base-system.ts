import { Box } from "../bodies/box";
import { Circle } from "../bodies/circle";
import { Ellipse } from "../bodies/ellipse";
import { Line } from "../bodies/line";
import { Point } from "../bodies/point";
import { Polygon } from "../bodies/polygon";
import {
  Body,
  BodyOptions,
  Data,
  PotentialVector,
  RBush,
  Vector,
} from "../model";
import { draw, drawBVH } from "../utils/draw-utils";

/**
 * very base collision system
 */
export class BaseSystem extends RBush<Body> implements Data {
  data!: { children: Body[] };

  /**
   * draw bodies of system on context
   */
  draw(context: CanvasRenderingContext2D): void {
    draw(this, context);
  }

  /**
   * draw bounding volume hierarchy of system on context
   */
  drawBVH(context: CanvasRenderingContext2D): void {
    drawBVH(this, context);
  }

  /**
   * create point at position with options and add to system
   */
  createPoint(position: PotentialVector, options?: BodyOptions): Point {
    const point = new Point(position, options);

    this.insert(point);

    return point;
  }

  /**
   * create line at position with options and add to system
   */
  createLine(start: Vector, end: Vector, options?: BodyOptions): Line {
    const line = new Line(start, end, options);

    this.insert(line);

    return line;
  }

  /**
   * create circle at position with options and add to system
   */
  createCircle(
    position: PotentialVector,
    radius: number,
    options?: BodyOptions
  ): Circle {
    const circle = new Circle(position, radius, options);

    this.insert(circle);

    return circle;
  }

  /**
   * create box at position with options and add to system
   */
  createBox(
    position: PotentialVector,
    width: number,
    height: number,
    options?: BodyOptions
  ): Box {
    const box = new Box(position, width, height, options);

    this.insert(box);

    return box;
  }

  /**
   * create ellipse at position with options and add to system
   */
  createEllipse(
    position: PotentialVector,
    radiusX: number,
    radiusY: number = radiusX,
    step?: number,
    options?: BodyOptions
  ): Ellipse {
    const ellipse = new Ellipse(position, radiusX, radiusY, step, options);

    this.insert(ellipse);

    return ellipse;
  }

  /**
   * create polygon at position with options and add to system
   */
  createPolygon(
    position: PotentialVector,
    points: PotentialVector[],
    options?: BodyOptions
  ): Polygon {
    const polygon = new Polygon(position, points, options);

    this.insert(polygon);

    return polygon;
  }
}
