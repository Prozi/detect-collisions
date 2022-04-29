import SAT from "sat";
import RBush from "rbush";
import {
  IData,
  TBody,
  Types,
  Vector,
  IGetAABBAsBox,
  RaycastResult,
} from "./model";
import { closest, createBox } from "./utils";
import { Point } from "./bodies/point";
import { Circle } from "./bodies/circle";
import { Box } from "./bodies/box";
import { Polygon } from "./bodies/polygon";
import { Line } from "./bodies/line";
import { Oval } from "./bodies/oval";

/**
 * collision system
 */
export class System extends RBush<TBody> {
  public response: SAT.Response = new SAT.Response();

  // https://stackoverflow.com/questions/37224912/circle-line-segment-collision
  static intersectLineCircle(line: Line, circle: Circle): Vector[] {
    const v1 = { x: line.end.x - line.start.x, y: line.end.y - line.start.y };
    const v2 = {
      x: line.start.x - circle.pos.x,
      y: line.start.y - circle.pos.y,
    };
    const b = (v1.x * v2.x + v1.y * v2.y) * -2;
    const c = 2 * (v1.x * v1.x + v1.y * v1.y);
    const d = Math.sqrt(
      b * b - 2 * c * (v2.x * v2.x + v2.y * v2.y - circle.r * circle.r)
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
      results.push({
        x: line.start.x + v1.x * u1,
        y: line.start.y + v1.y * u1,
      });
    }

    if (u2 <= 1 && u2 >= 0) {
      // second add point if on the line segment
      results.push({
        x: line.start.x + v1.x * u2,
        y: line.start.y + v1.y * u2,
      });
    }

    return results;
  }

  // https://stackoverflow.com/questions/9043805/test-if-two-lines-intersect-javascript-function
  static intersectLineLine(line1: Line, line2: Line): Vector | null {
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
    if (!(0 <= lambda && lambda <= 1) || !(0 <= gamma && gamma <= 1)) {
      return null;
    }

    return {
      x: line1.start.x + lambda * dX,
      y: line1.start.y + lambda * dY,
    };
  }

  /**
   * draw bodies
   * @param {CanvasRenderingContext2D} context
   */
  draw(context: CanvasRenderingContext2D): void {
    this.all().forEach((body: TBody) => {
      body.draw(context);
    });
  }

  /**
   * draw hierarchy
   * @param {CanvasRenderingContext2D} context
   */
  drawBVH(context: CanvasRenderingContext2D) {
    (this as unknown as IData).data.children.forEach(
      ({ minX, maxX, minY, maxY }: TBody) => {
        Polygon.prototype.draw.call(
          {
            pos: { x: minX, y: minY },
            calcPoints: createBox(maxX - minX, maxY - minY),
          },
          context
        );
      }
    );

    this.all().forEach((body: TBody) => {
      const { pos, w, h } = (body as unknown as IGetAABBAsBox).getAABBAsBox();

      Polygon.prototype.draw.call(
        {
          pos,
          calcPoints: createBox(w, h),
        },
        context
      );
    });
  }

  /**
   * update body aabb and in tree
   * @param {object} body
   */
  updateBody(body: TBody): void {
    // old aabb needs to be removed
    this.remove(body);

    // then we update aabb
    body.updateAABB();

    // then we reinsert body to collision tree
    this.insert(body);
  }

  /**
   * remove body aabb from collision tree
   * @param body
   * @param equals
   * @returns System
   */
  remove(body: TBody, equals?: (a: TBody, b: TBody) => boolean): RBush<TBody> {
    body.system = undefined;

    return super.remove(body, equals);
  }

  /**
   * add body aabb to collision tree
   * @param body
   * @returns System
   */
  insert(body: TBody): RBush<TBody> {
    body.system = this;

    return super.insert(body);
  }

  /**
   * update all bodies aabb
   */
  update() {
    this.all().forEach((body: TBody) => {
      // no need to every cycle update static body aabb
      if (!body.isStatic) {
        this.updateBody(body);
      }
    });
  }

  /**
   * separate (move away) colliders
   */
  separate() {
    this.checkAll((response: SAT.Response) => {
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
   * @param {function} callback
   */
  checkOne(body: TBody, callback: (response: SAT.Response) => void): void {
    // no need to check static body collision
    if (body.isStatic) {
      return;
    }

    this.getPotentials(body).forEach((candidate: TBody) => {
      if (this.checkCollision(body, candidate)) {
        callback(this.response);
      }
    });
  }

  /**
   * check all colliders collisions with callback
   * @param {function} callback
   */
  checkAll(callback: (response: SAT.Response) => void): void {
    this.all().forEach((body: TBody) => {
      this.checkOne(body, callback);
    });
  }

  /**
   * get object potential colliders
   * @param {object} collider
   */
  getPotentials(body: TBody): TBody[] {
    // filter here is required as collides with self
    return this.search(body).filter((candidate) => candidate !== body);
  }

  /**
   * check do 2 objects collide
   * @param {object} collider
   * @param {object} candidate
   */
  checkCollision(body: TBody, candidate: TBody): boolean {
    this.response.clear();

    if (body.type === Types.Circle && candidate.type === Types.Circle) {
      return SAT.testCircleCircle(
        body as Circle,
        candidate as Circle,
        this.response
      );
    }

    if (body.type === Types.Circle && candidate.type !== Types.Circle) {
      return SAT.testCirclePolygon(
        body as Circle,
        candidate as Polygon,
        this.response
      );
    }

    if (body.type !== Types.Circle && candidate.type === Types.Circle) {
      return SAT.testPolygonCircle(
        body as Polygon,
        candidate as Circle,
        this.response
      );
    }

    if (body.type !== Types.Circle && candidate.type !== Types.Circle) {
      return SAT.testPolygonPolygon(
        body as Polygon,
        candidate as Polygon,
        this.response
      );
    }

    throw Error("Not implemented");
  }

  /**
   * raycast to get collider of ray from start to end
   * @param {Vector} start {x, y}
   * @param {Vector} end {x, y}
   * @returns {TBody}
   */
  raycast(
    start: Vector,
    end: Vector,
    allowCollider: (testCollider: TBody) => boolean = () => true
  ): RaycastResult {
    const ray: Line = this.createLine(start, end);
    const colliders: TBody[] = this.getPotentials(ray).filter(
      (potential: TBody) =>
        allowCollider(potential) && this.checkCollision(ray, potential)
    );

    this.remove(ray);

    const results: RaycastResult[] = [];
    const sort: (a: RaycastResult, b: RaycastResult) => number = closest(start);

    colliders.forEach((collider: TBody) => {
      switch (collider.type) {
        case Types.Circle: {
          const points: Vector[] = System.intersectLineCircle(ray, collider);

          results.push(...points.map((point: Vector) => ({ point, collider })));

          break;
        }

        default: {
          const points: Vector[] = collider.calcPoints
            .map((to: Vector, index: number) => {
              const from = index
                ? collider.calcPoints[index - 1]
                : collider.calcPoints[collider.calcPoints.length - 1];
              const line = new Line(
                { x: from.x + collider.pos.x, y: from.y + collider.pos.y },
                { x: to.x + collider.pos.x, y: to.y + collider.pos.y }
              );

              return System.intersectLineLine(ray, line);
            })
            .filter((test: Vector | null) => !!test) as Vector[];

          results.push(...points.map((point: Vector) => ({ point, collider })));

          break;
        }
      }
    });

    return results.sort(sort)[0];
  }

  /**
   * create point
   * @param {Vector} position {x, y}
   */
  createPoint(position: Vector): Point {
    const point = new Point(position);

    this.insert(point);

    return point;
  }

  /**
   * create line
   * @param {Vector} start {x, y}
   * @param {Vector} end {x, y}
   */
  createLine(start: Vector, end: Vector, angle = 0): Line {
    const line = new Line(start, end);

    line.setAngle(angle);

    this.insert(line);

    return line;
  }

  /**
   * create circle
   * @param {Vector} position {x, y}
   * @param {number} radius
   */
  createCircle(position: Vector, radius: number): Circle {
    const circle = new Circle(position, radius);

    this.insert(circle);

    return circle;
  }

  /**
   * create box
   * @param {Vector} position {x, y}
   * @param {number} width
   * @param {number} height
   * @param {number} angle
   */
  createBox(position: Vector, width: number, height: number, angle = 0): Box {
    const box = new Box(position, width, height);

    box.setAngle(angle);

    this.insert(box);

    return box;
  }

  /**
   * create oval
   * @param {Vector} position {x, y}
   * @param {number} radiusX
   * @param {number} radiusY
   * @param {number} step
   * @param {number} angle
   */
  createOval(
    position: Vector,
    radiusX: number,
    radiusY: number,
    step = 1,
    angle = 0
  ): Oval {
    const oval = new Oval(position, radiusX, radiusY, step);

    oval.setAngle(angle);

    this.insert(oval);

    return oval;
  }

  /**
   * create polygon
   * @param {Vector} position {x, y}
   * @param {Vector[]} points
   * @param {number} angle
   */
  createPolygon(position: Vector, points: Vector[], angle = 0): Polygon {
    const polygon = new Polygon(position, points);

    polygon.setAngle(angle);

    this.insert(polygon);

    return polygon;
  }
}
