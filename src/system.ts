import { BaseSystem } from "./base-system";
import { Line } from "./bodies/line";
import {
  RaycastHit,
  Response,
  SATVector,
  Vector,
  Body,
  BodyType,
  CollisionCallback,
} from "./model";
import {
  distance,
  checkAInB,
  getSATTest,
  notIntersectAABB,
  returnTrue,
} from "./utils";
import {
  intersectLineCircle,
  intersectLinePolygon,
  ensureConvex,
} from "./intersect";
import { forEach, some } from "./optimized";

/**
 * collision system
 */
export class System<TBody extends Body = Body> extends BaseSystem<TBody> {
  /**
   * the last collision result
   */
  response: Response = new Response();

  /**
   * for raycasting
   */
  protected ray!: Line;

  /**
   * separate (move away) bodies
   */
  separate(): void {
    forEach(this.all(), (body: TBody) => {
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

    if (offsets.x || offsets.y) {
      body.setPosition(body.x - offsets.x, body.y - offsets.y);
    }
  }

  /**
   * check one body collisions with callback
   */
  checkOne(
    body: TBody,
    callback: CollisionCallback = returnTrue,
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
    callback: CollisionCallback = returnTrue,
    response = this.response,
  ): boolean {
    const checkOne = (body: TBody) => {
      return this.checkOne(body, callback, response);
    };

    return some(this.all(), checkOne);
  }

  /**
   * check do 2 objects collide
   */
  checkCollision(
    bodyA: TBody,
    bodyB: TBody,
    response = this.response,
  ): boolean {
    // assess the bodies real aabb without padding
    if (
      !bodyA.bbox ||
      !bodyB.bbox ||
      notIntersectAABB(bodyA.bbox, bodyB.bbox)
    ) {
      return false;
    }

    const sat = getSATTest(bodyA, bodyB);

    // 99% of cases
    if (bodyA.isConvex && bodyB.isConvex) {
      // always first clear response
      response.clear();

      return sat(bodyA, bodyB, response);
    }

    // more complex (non convex) cases
    const convexBodiesA = ensureConvex(bodyA);
    const convexBodiesB = ensureConvex(bodyB);

    let overlapX = 0;
    let overlapY = 0;
    let collided = false;

    forEach(convexBodiesA, (convexBodyA) => {
      forEach(convexBodiesB, (convexBodyB) => {
        // always first clear response
        response.clear();

        if (sat(convexBodyA, convexBodyB, response)) {
          collided = true;
          overlapX += response.overlapV.x;
          overlapY += response.overlapV.y;
        }
      });
    });

    if (collided) {
      const vector = new SATVector(overlapX, overlapY);

      response.a = bodyA;
      response.b = bodyB;
      response.overlapV.x = overlapX;
      response.overlapV.y = overlapY;
      response.overlapN = vector.normalize();
      response.overlap = vector.len();
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
    allow: (body: TBody) => boolean = returnTrue,
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
}
