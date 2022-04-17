import SAT from "sat";
import RBush from "rbush";
import { IData, TBody, Types, Vector } from "./model";
import { createBox } from "./utils";
import { Box, Circle, IGetAABBAsBox, Line, Point, Polygon } from ".";
import { Oval } from "./bodies/oval";

/**
 * collision system
 */
export class System extends RBush<TBody> {
  public response: SAT.Response = new SAT.Response();

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
    body.system = null;

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
