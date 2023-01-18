import RBush from "rbush";

import { BaseSystem } from "./base-system";
import { Line } from "./bodies/line";
import {
  Body,
  ChildrenData,
  CollisionState,
  Leaf,
  RaycastResult,
  Response,
  SATVector,
  TestFunction,
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
  getSATFunction,
} from "./utils";

/**
 * collision system
 */
export class System extends BaseSystem {
  /**
   * the last collision result
   */
  response: Response = new Response();

  bodies: Record<string, Body> = {};

  /**
   * reusable inner state - for non convex polygons collisions
   */
  protected state: CollisionState = {
    collides: false,
    aInB: false,
    bInA: false,
    overlapV: new SATVector(),
  };

  private ray!: Line;

  all(): Body[] {
    return Object.values(this.bodies);
  }

  /**
   * remove body aabb from collision tree
   */
  remove(body: Body, equals?: (a: Body, b: Body) => boolean): RBush<Body> {
    if (body.system) {
      delete body.system.bodies[body.uid];
    }
    body.system = undefined;

    return super.remove(body, equals);
  }

  /**
   * re-insert body into collision tree and update its aabb
   */
  insert(body: Body): RBush<Body> {
    body.bbox = body.getAABBAsBBox();

    // allow only on first insert or if body moved
    if (body.system && !bodyMoved(body)) {
      return this;
    }

    // old bounding box *needs* to be removed
    if (body.system) {
      body.system.remove(body);
    }

    // only then we update min, max
    body.minX = body.bbox.minX - body.padding;
    body.minY = body.bbox.minY - body.padding;
    body.maxX = body.bbox.maxX + body.padding;
    body.maxY = body.bbox.maxY + body.padding;

    // set system for later body.system.updateBody(body)
    body.system = this;

    this.bodies[body.uid] = body;

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
    this.checkAll(({ a, overlapV }: Response) => {
      // static bodies and triggers do not move back / separate
      if (a.isTrigger) {
        return true;
      }

      a.setPosition(a.x - overlapV.x, a.y - overlapV.y);
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

    this.state.collides = false;
    this.response.clear();

    const sat: TestFunction = getSATFunction(body, wall);

    if (body.isConvex && wall.isConvex) {
      this.state.collides = sat(body, wall, this.response);
    } else if (body.isConvex && !wall.isConvex) {
      ensureConvex(wall).forEach((convexWall: Body) => {
        this.test(sat, body, convexWall);
      });
    } else if (!body.isConvex && wall.isConvex) {
      ensureConvex(body).forEach((convexBody: Body) => {
        this.test(sat, convexBody, wall);
      });
    } else {
      const convexBodies = ensureConvex(body);
      const convexWalls = ensureConvex(wall);

      convexBodies.forEach((convexBody: Body) => {
        convexWalls.forEach((convexWall: Body) => {
          this.test(sat, convexBody, convexWall);
        });
      });
    }

    // set proper response object bodies
    if (!body.isConvex || !wall.isConvex) {
      this.response.a = body;
      this.response.b = wall;

      // collisionVector is set if body or candidate was concave during this.test()
      if (this.state.collides) {
        this.response.overlapV = this.state.overlapV;
        this.response.overlapN = this.response.overlapV.clone().normalize();
        this.response.overlap = this.response.overlapV.len();
      }

      this.response.aInB = body.isConvex
        ? this.state.aInB
        : checkAInB(body, wall);
      this.response.bInA = wall.isConvex
        ? this.state.bInA
        : checkAInB(wall, body);
    }

    return this.state.collides;
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

    if (!this.ray) {
      this.ray = new Line(start, end, { isTrigger: true });
    } else {
      this.ray.start = start;
      this.ray.end = end;
    }

    this.insert(this.ray);

    const colliders: Body[] = this.getPotentials(this.ray).filter(
      (potential: Body) =>
        allowCollider(potential) && this.checkCollision(this.ray, potential)
    );

    this.remove(this.ray);

    colliders.forEach((collider: Body) => {
      const points: Vector[] =
        collider.type === Types.Circle
          ? intersectLineCircle(this.ray, collider)
          : intersectLinePolygon(this.ray, collider);

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

  fromJSON(data: ChildrenData): RBush<Body> {
    this.traverse((body, children, index) => {
      if (this.bodies[body.uid]) {
        children[index] = Object.assign(this.bodies[body.uid], body);
      }
    }, data);

    this.data = data;

    return this;
  }

  /**
   * update inner state function - for non convex polygons collisions
   */
  protected test(sat: TestFunction, body: Body, wall: Body): void {
    const collides = sat(body, wall, this.response);

    if (collides) {
      // first time in loop, reset
      if (!this.state.collides) {
        this.state.aInB = false;
        this.state.bInA = false;
        this.state.overlapV = new SATVector();
      }

      // sum all collision vectors
      this.state.overlapV.add(this.response.overlapV);
    }

    // aInB and bInA is kept in state for later restore
    this.state.aInB = this.state.aInB || this.response.aInB;
    this.state.bInA = this.state.bInA || this.response.bInA;

    // set state collide at least once value
    this.state.collides = collides || this.state.collides;

    // clear for reuse
    this.response.clear();
  }
}
