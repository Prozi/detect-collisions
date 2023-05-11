import { Box } from "./bodies/box";
import { Circle } from "./bodies/circle";
import { Ellipse } from "./bodies/ellipse";
import { Line } from "./bodies/line";
import { Point } from "./bodies/point";
import { Polygon } from "./bodies/polygon";
import {
  Body,
  BodyOptions,
  ChildrenData,
  Data,
  Leaf,
  PotentialVector,
  RBush,
  Vector,
} from "./model";
import { forEach } from "./optimized";
import { drawBVH } from "./utils";

/**
 * very base collision system
 */
export class BaseSystem<TBody extends Body>
  extends RBush<TBody>
  implements Data<TBody>
{
  data!: ChildrenData<TBody>;

  /**
   * draw exact bodies colliders outline
   */
  draw(context: CanvasRenderingContext2D): void {
    forEach(this.all(), (body: TBody) => {
      body.draw(context);
    });
  }

  /**
   * draw bounding boxes hierarchy outline
   */
  drawBVH(context: CanvasRenderingContext2D): void {
    const drawChildren = (body: Leaf<TBody>) => {
      drawBVH(context, body as TBody);

      if (body.children) {
        forEach(body.children, drawChildren);
      }
    };

    forEach(this.data.children, drawChildren);
  }

  /**
   * create point at position with options and add to system
   */
  createPoint(position: PotentialVector, options?: BodyOptions): Point {
    const point = new Point(position, options);

    this.insert(point as TBody);

    return point;
  }

  /**
   * create line at position with options and add to system
   */
  createLine(start: Vector, end: Vector, options?: BodyOptions): Line {
    const line = new Line(start, end, options);

    this.insert(line as TBody);

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

    this.insert(circle as TBody);

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

    this.insert(box as TBody);

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

    this.insert(ellipse as TBody);

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

    this.insert(polygon as TBody);

    return polygon;
  }
}
