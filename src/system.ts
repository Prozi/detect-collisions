import RBush from "rbush";

import { BaseSystem } from "./base-system";
import { Line } from "./bodies/line";
import {
  Body,
  Leaf,
  RaycastHit,
  Response,
  SATVector,
  SATTest,
  BodyType,
  Vector,
} from "./model";
import {
  distance,
  checkAInB,
  ensureConvex,
  bodyMoved,
  getSATTest,
  notIntersectAABB,
} from "./utils";
import { intersectLineCircle, intersectLinePolygon } from "./intersect";
import { filter, forEach, some } from "./optimized";

/**
 * collision system
 */
export class System extends BaseSystem {
  /**
   * the last collision result
   */
  response: Response = new Response();

  private ray!: Line;

  /**
   * remove body aabb from collision tree
   */
  remove(body: Body, equals?: (a: Body, b: Body) => boolean): RBush<Body> {
    body.system = undefined;

    return super.remove(body, equals);
  }

  /**
   * re-insert body into collision tree and update its aabb
   * every body can be part of only one system
   */
  insert(body: Body): RBush<Body> {
    body.bbox = body.getAABBAsBBox();

    if (body.system) {
      // allow end if body inserted and not moved
      if (!bodyMoved(body)) {
        return this;
      }

      // old bounding box *needs* to be removed
      body.system.remove(body);
    }

    // only then we update min, max
    body.minX = body.bbox.minX - body.padding;
    body.minY = body.bbox.minY - body.padding;
    body.maxX = body.bbox.maxX + body.padding;
    body.maxY = body.bbox.maxY + body.padding;

    // set system for later body.system.updateBody(body)
    body.system = this;

    // reinsert bounding box to collision tree
    return super.insert(body);
  }

  /**
   * alias for insert, updates body in collision tree
   */
  updateBody(body: Body): void {
    this.insert(body);
  }

  /**
   * update all bodies aabb
   */
  update(): void {
    forEach(this.all(), (body: Body) => {
      // no need to every cycle update static body aabb
      if (!body.isStatic) {
        this.insert(body);
      }
    });
  }

  /**
   * separate (move away) colliders
   */
  separate(): void {
    this.checkAll(({ a, overlapV }: Response) => {
      // static bodies and triggers do not move back / separate
      if (a.isTrigger) {
        return false;
      }

      a.setPosition(a.x - overlapV.x, a.y - overlapV.y);
    });
  }

  /**
   * check one collider collisions with callback
   */
  checkOne(
    body: Body,
    callback: (response: Response) => void | boolean,
    response = this.response
  ): boolean {
    // no need to check static body collision
    if (body.isStatic) {
      return false;
    }

    const bodies = this.search(body);
    const checkCollision = (candidate: Body) => {
      if (
        candidate !== body &&
        this.checkCollision(body, candidate, response)
      ) {
        return callback(response);
      }
    };

    return some(bodies, checkCollision);
  }

  /**
   * check all colliders collisions with callback
   */
  checkAll(
    callback: (response: Response) => void | boolean,
    response = this.response
  ): boolean {
    const bodies = this.all();
    const checkOne = (body: Body) => {
      return this.checkOne(body, callback, response);
    };

    return some(bodies, checkOne);
  }

  /**
   * get object potential colliders
   * @deprecated because it's slower to use than checkOne() or checkAll()
   */
  getPotentials(body: Body): Body[] {
    // filter here is required as collides with self
    return filter(this.search(body), (candidate: Body) => candidate !== body);
  }

  /**
   * check do 2 objects collide
   */
  checkCollision(bodyA: Body, bodyB: Body, response = this.response): boolean {
    // if any of bodies has padding, we can short return false by assesing the bbox without padding
    if (
      (bodyA.padding || bodyB.padding) &&
      notIntersectAABB(bodyA.bbox || bodyA, bodyB.bbox || bodyB)
    ) {
      return false;
    }

    const sat = getSATTest(bodyA, bodyB) as SATTest;

    // 99% of cases
    if (bodyA.isConvex && bodyB.isConvex) {
      response.clear();

      return sat(bodyA, bodyB, response);
    }

    // more complex (non convex) cases
    const convexBodiesA = ensureConvex(bodyA);
    const convexBodiesB = ensureConvex(bodyB);
    const overlapV = new SATVector();
    let collided = false;

    forEach(convexBodiesA, (convexBodyA) => {
      forEach(convexBodiesB, (convexBodyB) => {
        response.clear();

        if (sat(convexBodyA, convexBodyB, response)) {
          collided = true;
          overlapV.add(response.overlapV);
        }
      });
    });

    if (collided) {
      response.a = bodyA;
      response.b = bodyB;
      response.overlapV = overlapV;
      response.overlapN = overlapV.clone().normalize();
      response.overlap = overlapV.len();
      response.aInB = checkAInB(bodyA, bodyB);
      response.bInA = checkAInB(bodyB, bodyA);
    }

    return collided;
  }

  /**
   * raycast to get collider of ray from start to end
   */
  raycast(
    start: Vector,
    end: Vector,
    allow: (body: Body) => boolean = () => true
  ): RaycastHit | null {
    let minDistance = Infinity;
    let result: RaycastHit | null = null;

    if (!this.ray) {
      this.ray = new Line(start, end, { isTrigger: true });
    } else {
      this.ray.start = start;
      this.ray.end = end;
    }

    this.insert(this.ray);

    this.checkOne(this.ray, ({ b: body }) => {
      if (!allow(body)) {
        return false;
      }

      const points: Vector[] =
        body.type === BodyType.Circle
          ? intersectLineCircle(this.ray, body)
          : intersectLinePolygon(this.ray, body);

      forEach(points, (point: Vector) => {
        const pointDistance: number = distance(start, point);

        if (pointDistance < minDistance) {
          minDistance = pointDistance;
          result = { point, body };
        }
      });
    });

    this.remove(this.ray);

    return result;
  }

  /**
   * used to find body deep inside data with finder function returning boolean found or not
   */
  traverse(
    find: (child: Leaf, children: Leaf[], index: number) => boolean | void,
    { children }: { children?: Leaf[] } = this.data
  ): Body | undefined {
    return children?.find((body, index) => {
      if (!body) {
        return false;
      }

      if (body.type && find(body, children, index)) {
        return true;
      }

      // if callback returns true, ends forEach
      if (body.children) {
        this.traverse(find, body);
      }
    });
  }
}
