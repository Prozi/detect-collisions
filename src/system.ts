import RBush from "rbush";
import {
  testCircleCircle,
  testCirclePolygon,
  testPolygonCircle,
  testPolygonPolygon,
} from "sat";

import { BaseSystem } from "./base-system";
import { Line } from "./bodies/line";
import { Polygon } from "./bodies/polygon";
import { Body, Data, RaycastResult, Response, Types, Vector } from "./model";
import {
  distance,
  ensureConvexPolygons,
  intersectLineCircle,
  intersectLinePolygon,
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

    if (body.type === Types.Circle) {
      if (candidate.type === Types.Circle) {
        return testCircleCircle(body, candidate, this.response);
      }

      return testCirclePolygon(body, candidate, this.response);
    }

    if (candidate.type === Types.Circle) {
      return testPolygonCircle(body, candidate, this.response);
    }

    if (body.type === Types.Polygon || candidate.type === Types.Polygon) {
      const convexBodies = ensureConvexPolygons(body);
      const convexCandidates = ensureConvexPolygons(candidate);

      return convexBodies.some((convexBody: Polygon) =>
        convexCandidates.some((convexCandidate: Polygon) => {
          const collide = testPolygonPolygon(
            convexBody,
            convexCandidate,
            this.response
          );

          if (collide) {
            this.response.a = body;
            this.response.b = candidate;
          }

          return collide;
        })
      );
    }

    return testPolygonPolygon(body, candidate, this.response);
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
}
