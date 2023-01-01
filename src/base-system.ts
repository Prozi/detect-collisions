import { Box } from "./bodies/box";
import { Circle } from "./bodies/circle";
import { Ellipse } from "./bodies/ellipse";
import { Line } from "./bodies/line";
import { Point } from "./bodies/point";
import { Polygon } from "./bodies/polygon";
import {
  Body,
  BodyOptions,
  Data,
  PotentialVector,
  RBush,
  SATVector,
  Vector,
} from "./model";
import { createBox, drawPolygon } from "./utils";

/**
 * very base collision system
 */
export class BaseSystem extends RBush<Body> implements Data {
  data!: { children: Body[] };

  /**
   * draw bodies
   */
  draw(context: CanvasRenderingContext2D): void {
    this.all().forEach((body: Body) => {
      body.draw(context);
    });
  }

  /**
   * draw hierarchy
   */
  drawBVH(context: CanvasRenderingContext2D): void {
    [...this.all(), ...this.data.children].forEach(
      ({ minX: x, maxX, minY: y, maxY }: Body) => {
        drawPolygon(context, {
          pos: { x, y } as SATVector,
          calcPoints: createBox(maxX - x, maxY - y),
        });
      }
    );
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
