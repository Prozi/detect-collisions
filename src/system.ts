import SAT from "sat";
import RBush from "rbush";
import { ICollider, Types, Vector } from "./model";
import { Box } from "./bodies/box";
import { Circle } from "./bodies/circle";
import { Polygon } from "./bodies/polygon";
import { Point } from "./bodies/point";
import { createBox } from "./utils";

/**
 * collision system
 */
export class System extends RBush<ICollider> {
  public response: SAT.Response = new SAT.Response();

  /**
   * draw bodies
   * @param {CanvasRenderingContext2D} context
   */
  draw(context: CanvasRenderingContext2D): void {
    this.all().forEach((body: ICollider) => {
      body.draw(context);
    });
  }

  /**
   * draw hierarchy
   * @param {CanvasRenderingContext2D} context
   */
  drawBVH(context: CanvasRenderingContext2D) {
    (this as any).data.children.forEach(({ minX, maxX, minY, maxY }: any) => {
      Polygon.prototype.draw.call(
        {
          pos: { x: minX, y: minY },
          calcPoints: createBox(maxX - minX, maxY - minY),
        },
        context
      );
    });

    this.all().forEach((body: any) => {
      const { pos, w, h } = body.getAABBAsBox();

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
  updateBody(body: ICollider): void {
    this.remove(body);

    body.updateAABB();

    this.insert(body);
  }

  /**
   * update all bodies aabb
   */
  update() {
    this.all().forEach((body: ICollider) => {
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
  checkOne(body: ICollider, callback: (response: SAT.Response) => void): void {
    // no need to check static body collision
    if (body.isStatic) {
      return;
    }

    this.getPotentials(body).forEach((candidate: ICollider) => {
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
    this.all().forEach((body: ICollider) => {
      this.checkOne(body, callback);
    });
  }

  /**
   * get object potential colliders
   * @param {object} collider
   */
  getPotentials(body: ICollider): ICollider[] {
    // filter here is required as collides with self
    return this.search(body).filter((candidate) => candidate !== body);
  }

  /**
   * check do 2 objects collide
   * @param {object} collider
   * @param {object} candidate
   */
  checkCollision(body: ICollider, candidate: ICollider): boolean {
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
  createBox(
    position: Vector,
    width: number,
    height: number,
    angle: number = 0
  ): Box {
    const box = new Box(position, width, height);

    box.setAngle(angle);

    this.insert(box);

    return box;
  }

  /**
   * create polygon
   * @param {Vector} position {x, y}
   * @param {Vector[]} points
   * @param {number} angle
   */
  createPolygon(
    position: Vector,
    points: Vector[],
    angle: number = 0
  ): Polygon {
    const polygon = new Polygon(position, points);

    polygon.setAngle(angle);

    this.insert(polygon);

    return polygon;
  }
}
