import {
  testCircleCircle,
  testCirclePolygon,
  testPolygonCircle,
  testPolygonPolygon,
} from "sat";
import RBush from "rbush";
import {
  Data,
  Body,
  Types,
  Vector,
  GetAABBAsBox,
  RaycastResult,
  Response,
} from "./model";
import {
  createBox,
  distance,
  intersectLineCircle,
  intersectLinePolygon,
} from "./utils";
import { Point } from "./bodies/point";
import { Circle } from "./bodies/circle";
import { Box } from "./bodies/box";
import { Polygon } from "./bodies/polygon";
import { Line } from "./bodies/line";
import { Ellipse } from "./bodies/ellipse";

/**
 * collision system
 */
export class System extends RBush<Body> implements Data {
  data!: { children: Body[] };
  response: Response = new Response();

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
    this.data.children.forEach(({ minX, maxX, minY, maxY }: Body) => {
      Polygon.prototype.draw.call(
        {
          pos: { x: minX, y: minY },
          calcPoints: createBox(maxX - minX, maxY - minY),
        },
        context
      );
    });

    this.all().forEach((body: Body) => {
      const { pos, w, h } = (body as unknown as GetAABBAsBox).getAABBAsBox();

      Polygon.prototype.draw.call(
        { pos, calcPoints: createBox(w, h) },
        context
      );
    });
  }

  /**
   * update body aabb and in tree
   */
  updateBody(body: Body): void {
    // old aabb needs to be removed
    this.remove(body);
    // then we update aabb
    body.updateAABB();
    // then we reinsert body to collision tree
    this.insert(body);
  }

  /**
   * remove body aabb from collision tree
   */
  remove(body: Body, equals?: (a: Body, b: Body) => boolean): RBush<Body> {
    body.system = undefined;

    return super.remove(body, equals);
  }

  /**
   * add body aabb to collision tree
   */
  insert(body: Body): RBush<Body> {
    body.system = this;

    return super.insert(body);
  }

  /**
   * update all bodies aabb
   */
  update(): void {
    this.all().forEach((body: Body) => {
      // no need to every cycle update static body aabb
      if (!body.isStatic) {
        this.updateBody(body);
      }
    });
  }

  /**
   * separate (move away) colliders
   */
  separate(): void {
    this.checkAll((response: Response) => {
      // static bodies and triggers do not move back / separate
      if (response.a.isTrigger) {
        return;
      }

      response.a.pos.x -= response.overlapV.x;
      response.a.pos.y -= response.overlapV.y;

      this.updateBody(response.a);
    });
  }

  /**
   * check one collider collisions with callback
   */
  checkOne(body: Body, callback: (response: Response) => void): void {
    // no need to check static body collision
    if (body.isStatic) {
      return;
    }

    this.getPotentials(body).forEach((candidate: Body) => {
      if (this.checkCollision(body, candidate)) {
        callback(this.response);
      }
    });
  }

  /**
   * check all colliders collisions with callback
   */
  checkAll(callback: (response: Response) => void): void {
    this.all().forEach((body: Body) => {
      this.checkOne(body, callback);
    });
  }

  /**
   * get object potential colliders
   */
  getPotentials(body: Body): Body[] {
    // filter here is required as collides with self
    return this.search(body).filter((candidate) => candidate !== body);
  }

  /**
   * check do 2 objects collide
   */
  checkCollision(body: Body, candidate: Body): boolean {
    this.response.clear();

    if (body.type === Types.Circle && candidate.type === Types.Circle) {
      return testCircleCircle(body, candidate, this.response);
    }

    if (body.type === Types.Circle && candidate.type !== Types.Circle) {
      return testCirclePolygon(body, candidate, this.response);
    }

    if (body.type !== Types.Circle && candidate.type === Types.Circle) {
      return testPolygonCircle(body, candidate, this.response);
    }

    if (body.type !== Types.Circle && candidate.type !== Types.Circle) {
      return testPolygonPolygon(body, candidate, this.response);
    }

    throw Error("Not implemented");
  }

  /**
   * raycast to get collider of ray from start to end
   */
  raycast(
    start: Vector,
    end: Vector,
    allowCollider: (testCollider: Body) => boolean = () => true
  ): RaycastResult {
    let minDistance = Infinity;
    let result: RaycastResult = null;

    const ray: Line = this.createLine(start, end);
    const colliders: Body[] = this.getPotentials(ray).filter(
      (potential: Body) =>
        allowCollider(potential) && this.checkCollision(ray, potential)
    );

    this.remove(ray);

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

  createPoint(position: Vector): Point {
    const point = new Point(position);

    this.insert(point);

    return point;
  }

  createLine(start: Vector, end: Vector, angle = 0): Line {
    const line = new Line(start, end);

    line.setAngle(angle);
    this.insert(line);

    return line;
  }

  createCircle(position: Vector, radius: number): Circle {
    const circle = new Circle(position, radius);

    this.insert(circle);

    return circle;
  }

  createBox(position: Vector, width: number, height: number, angle = 0): Box {
    const box = new Box(position, width, height);

    box.setAngle(angle);
    this.insert(box);

    return box;
  }

  createEllipse(
    position: Vector,
    radiusX: number,
    radiusY: number,
    step?: number,
    angle = 0
  ): Ellipse {
    const ellipse = new Ellipse(position, radiusX, radiusY, step);

    ellipse.setAngle(angle);
    this.insert(ellipse);

    return ellipse;
  }

  createPolygon(position: Vector, points: Vector[], angle = 0): Polygon {
    const polygon = new Polygon(position, points);

    polygon.setAngle(angle);
    this.insert(polygon);

    return polygon;
  }
}
