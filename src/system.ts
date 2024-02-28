import RBush from "rbush";

import { BaseSystem } from "./base-system";
import { Line } from "./bodies/line";
import {
  Leaf,
  RaycastHit,
  Response,
  SATVector,
  SATTest,
  Vector,
  Body,
  BodyType,
  CheckCollisionCallback,
} from "./model";
import {
  distance,
  checkAInB,
  bodyMoved,
  getSATTest,
  notIntersectAABB,
} from "./utils";
import {
  intersectLineCircle,
  intersectLinePolygon,
  ensureConvex,
} from "./intersect";
import { filter, forEach, some } from "./optimized";

/**
 * collision system
 */
export class System<TBody extends Body = Body> extends BaseSystem<TBody> {
  /**
   * the last collision result
   */
  response: Response = new Response();

  protected ray!: Line;

  /**
   * remove body aabb from collision tree
   */
  remove(body: TBody, equals?: (a: TBody, b: TBody) => boolean): RBush<TBody> {
    body.system = undefined;

    return super.remove(body, equals);
  }

  /**
   * re-insert body into collision tree and update its aabb
   * every body can be part of only one system
   */
  insert(body: TBody): RBush<TBody> {
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
   * updates body in collision tree
   */
  updateBody(body: TBody): void {
    body.updateBody();
  }

  /**
   * update all bodies aabb
   */
  update(): void {
    forEach(this.all(), (body: TBody) => {
      this.updateBody(body);
    });
  }

  /**
   * separate (move away) bodies
   */
  separate(): void {
    this.all().forEach((body) => {
      this.separateBody(body);
    });
  }

  /**
   * separate (move away) 1 body
   */
  separateBody(body: TBody): void {
    if (body.isStatic || body.isTrigger) {
      return;
    }

    const offsets = { x: 0, y: 0 };
    const addOffsets = ({ overlapV: { x, y } }: Response) => {
      offsets.x += x;
      offsets.y += y;
    };

    this.checkOne(body, addOffsets);
    body.setPosition(body.x - offsets.x, body.y - offsets.y);
  }

  /**
   * check one body collisions with callback
   */
  checkOne(
    body: TBody,
    callback: CheckCollisionCallback = () => true,
    response = this.response,
  ): boolean {
    // no need to check static body collision
    if (body.isStatic) {
      return false;
    }

    const bodies = this.search(body);
    const checkCollision = (candidate: TBody) => {
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
   * check all bodies collisions with callback
   */
  checkAll(
    callback: (response: Response) => void | boolean,
    response = this.response,
  ): boolean {
    const checkOne = (body: TBody) => {
      return this.checkOne(body, callback, response);
    };

    return some(this.all(), checkOne);
  }

  /**
   * get object potential colliders
   * @deprecated because it's slower to use than checkOne() or checkAll()
   */
  getPotentials(body: TBody): TBody[] {
    // filter here is required as collides with self
    return filter(this.search(body), (candidate: TBody) => candidate !== body);
  }

  /**
   * check do 2 objects collide
   */
  checkCollision(
    bodyA: TBody,
    bodyB: TBody,
    response = this.response,
  ): boolean {
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
    allow: (body: TBody) => boolean = () => true,
  ): RaycastHit<TBody> | null {
    let minDistance = Infinity;
    let result: RaycastHit<TBody> | null = null;

    if (!this.ray) {
      this.ray = new Line(start, end, { isTrigger: true });
    } else {
      this.ray.start = start;
      this.ray.end = end;
    }

    this.insert(this.ray as TBody);

    this.checkOne(this.ray as TBody, ({ b: body }) => {
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

    this.remove(this.ray as TBody);

    return result;
  }

  /**
   * used to find body deep inside data with finder function returning boolean found or not
   */
  traverse(
    find: (
      child: Leaf<TBody>,
      children: Leaf<TBody>[],
      index: number,
    ) => boolean | void,
    { children }: { children?: Leaf<TBody>[] } = this.data,
  ): TBody | undefined {
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
