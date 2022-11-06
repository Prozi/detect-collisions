import RBush from "rbush";
import {
  testCircleCircle,
  testCirclePolygon,
  testPolygonCircle,
  testPolygonPolygon,
} from "sat";

import { BaseSystem } from "./base-system";
import { Circle } from "./bodies/circle";
import { Line } from "./bodies/line";
import { Polygon } from "./bodies/polygon";
import {
  Body,
  CollisionState,
  RaycastResult,
  Response,
  SATVector,
  Types,
  Vector,
} from "./model";
import {
  distance,
  intersectLineCircle,
  intersectLinePolygon,
  checkAInB,
  ensureConvex,
  intersectAABB,
  bodyMoved,
} from "./utils";

/**
 * collision system
 */
export class System extends BaseSystem {
  response: Response = new Response();

  /**
   * remove body aabb from collision tree
   */
  remove(body: Body, equals?: (a: Body, b: Body) => boolean): RBush<Body> {
    body.system = undefined;

    return super.remove(body, equals);
  }

  /**
   * update body aabb and in tree
   */
  insert(body: Body): RBush<Body> {
    body.bbox = body.getAABBAsBBox();

    // allow only on first insert or if body moved
    if (body.system && !bodyMoved(body)) {
      return this;
    }

    // old bounding box *needs* to be removed
    if (body.system) {
      // but we don't need to set system to undefined so super.remove
      super.remove(body);
    }

    // only then we update min, max
    body.minX = body.bbox.minX - body.padding;
    body.minY = body.bbox.minY - body.padding;
    body.maxX = body.bbox.maxX + body.padding;
    body.maxY = body.bbox.maxY + body.padding;

    // set system for later body.system.insert()
    body.system = this;

    // reinsert bounding box to collision tree
    return super.insert(body);
  }

  /**
   * @deprecated please use insert
   */
  updateBody(body: Body): void {
    this.insert(body);
  }

  /**
   * update all bodies aabb
   */
  update(): void {
    this.all().forEach((body: Body) => {
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
    this.checkAll((response: Response) => {
      // static bodies and triggers do not move back / separate
      if (response.a.isTrigger) {
        return;
      }

      response.a.x -= response.overlapV.x;
      response.a.y -= response.overlapV.y;

      this.insert(response.a);
    });
  }

  /**
   * check one collider collisions with callback
   */
  checkOne(body: Body, callback: (response: Response) => void | boolean): void {
    // no need to check static body collision
    if (body.isStatic) {
      return;
    }

    this.getPotentials(body).some((candidate: Body) => {
      if (this.checkCollision(body, candidate)) {
        return callback(this.response);
      }
    });
  }

  /**
   * check all colliders collisions with callback
   */
  checkAll(callback: (response: Response) => void | boolean): void {
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
  checkCollision(body: Body, wall: Body): boolean {
    // check bounding boxes without padding
    if (
      (body.padding || wall.padding) &&
      !intersectAABB(body.bbox, wall.bbox)
    ) {
      return false;
    }

    this.response.clear();

    const state: CollisionState = {
      collides: false,
    };

    let test: (
      a: Polygon | Circle | any,
      b: Polygon | Circle | any,
      r: Response
    ) => boolean;

    if (body.type === Types.Circle && wall.type === Types.Circle) {
      test = testCircleCircle;
    } else if (body.type === Types.Circle && wall.type !== Types.Circle) {
      test = testCirclePolygon;
    } else if (body.type !== Types.Circle && wall.type === Types.Circle) {
      test = testPolygonCircle;
    } else {
      test = testPolygonPolygon;
    }

    if (body.isConvex && wall.isConvex) {
      state.collides = test(body, wall, this.response);
    } else if (body.isConvex && !wall.isConvex) {
      ensureConvex(wall).forEach((convexWall: Body) =>
        this.collided(state, test(body, convexWall, this.response))
      );
    } else if (!body.isConvex && wall.isConvex) {
      ensureConvex(body).forEach((convexBody: Body) =>
        this.collided(state, test(convexBody, wall, this.response))
      );
    } else {
      const convexBodies = ensureConvex(body);
      const convexWalls = ensureConvex(wall);

      convexBodies.forEach((convexBody: Body) =>
        convexWalls.forEach((convexWall: Body) =>
          this.collided(state, test(convexBody, convexWall, this.response))
        )
      );
    }

    // collisionVector is set if body or candidate was concave during this.collided()
    if (state.collisionVector) {
      this.response.overlapV = state.collisionVector;
      this.response.overlapN = this.response.overlapV.clone().normalize();
      this.response.overlap = this.response.overlapV.len();
    }

    // set proper response object bodies
    if (!body.isConvex || !wall.isConvex) {
      this.response.a = body;
      this.response.b = wall;
    }

    if (!body.isConvex && !wall.isConvex) {
      this.response.aInB = checkAInB(body, wall);
      this.response.bInA = checkAInB(wall, body);
    } else if (!body.isConvex) {
      this.response.aInB = checkAInB(body, wall);
      this.response.bInA = !!state.bInA;
    } else if (!wall.isConvex) {
      this.response.aInB = !!state.aInB;
      this.response.bInA = checkAInB(wall, body);
    }

    return state.collides;
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

  private collided(state: CollisionState, collides: boolean): void {
    if (collides) {
      // lazy create vector
      if (typeof state.collisionVector === "undefined") {
        state.collisionVector = new SATVector();
      }

      // sum all collision vectors
      state.collisionVector.add(this.response.overlapV);
    }

    // aInB and bInA is kept in state for later restore
    state.aInB = state.aInB || this.response.aInB;
    state.bInA = state.bInA || this.response.bInA;

    // set state collide at least once value
    state.collides = collides || state.collides;

    // clear for reuse
    this.response.clear();
  }
}
