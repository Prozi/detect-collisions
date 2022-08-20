import RBush from "rbush";
import {
  Polygon as SATPolygon,
  testCircleCircle,
  testCirclePolygon,
  testPolygonCircle,
  testPolygonPolygon,
} from "sat";

import { BaseSystem } from "./base-system";
import { Line } from "./bodies/line";
import {
  Body,
  CollisionState,
  Data,
  RaycastResult,
  Response,
  SATVector,
  Types,
  Vector,
} from "./model";
import {
  distance,
  ensureConvexPolygons,
  intersectLineCircle,
  intersectLinePolygon,
  checkAInB,
} from "./utils";

/**
 * collision system
 */
export class System extends BaseSystem implements Data {
  response: Response = new Response();

  /**
   * update body aabb and in tree
   */
  updateBody(body: Body): void {
    const bounds = body.getAABBAsBBox();
    const update =
      bounds.minX < body.minX ||
      bounds.minY < body.minY ||
      bounds.maxX > body.maxX ||
      bounds.maxY > body.maxY;

    if (!update) {
      return;
    }

    // old aabb needs to be removed
    this.remove(body);
    // then we update aabb
    body.updateAABB(bounds);
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

      response.a.x -= response.overlapV.x;
      response.a.y -= response.overlapV.y;

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

    let result = false;

    const state: CollisionState = {
      collides: false,
    };

    if (body.type === Types.Circle) {
      if (candidate.type === Types.Circle) {
        result = testCircleCircle(body, candidate, this.response);
      } else {
        result = ensureConvexPolygons(candidate).reduce(
          (collidedAtLeastOnce: boolean, convexCandidate: SATPolygon) => {
            state.collides = testCirclePolygon(
              body,
              convexCandidate,
              this.response
            );

            return this.collided(state) || collidedAtLeastOnce;
          },
          false
        );
      }
    } else if (candidate.type === Types.Circle) {
      result = ensureConvexPolygons(body).reduce(
        (collidedAtLeastOnce: boolean, convexBody: SATPolygon) => {
          state.collides = testPolygonCircle(
            convexBody,
            candidate,
            this.response
          );

          return this.collided(state) || collidedAtLeastOnce;
        },
        false
      );
    } else if (!body.isConvex || !candidate.isConvex) {
      const convexBodies = ensureConvexPolygons(body);
      const convexCandidates = ensureConvexPolygons(candidate);

      result = convexBodies.reduce(
        (result: boolean, convexBody: SATPolygon) =>
          convexCandidates.reduce(
            (collidedAtLeastOnce: boolean, convexCandidate: SATPolygon) => {
              state.collides = testPolygonPolygon(
                convexBody,
                convexCandidate,
                this.response
              );

              return this.collided(state) || collidedAtLeastOnce;
            },
            false
          ) || result,
        false
      );
    } else {
      result = testPolygonPolygon(body, candidate, this.response);
    }

    if (state.collisionVector) {
      this.response.a = body;
      this.response.b = candidate;
      this.response.aInB = checkAInB(body, candidate);
      this.response.bInA = checkAInB(candidate, body);
      this.response.overlapV = state.collisionVector;
      this.response.overlapN = this.response.overlapV.clone().normalize();
      this.response.overlap = this.response.overlapV.len();
    }

    return result;
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

  private collided(state: CollisionState): boolean {
    if (state.collides) {
      if (typeof state.collisionVector === "undefined") {
        state.collisionVector = new SATVector();
      }

      state.collisionVector.add(this.response.overlapV);
    }

    this.response.clear();

    return state.collides;
  }
}
