import RBush from "rbush";

import { BaseSystem } from "./base-system";
import { Circle } from "./bodies/circle";
import { Line } from "./bodies/line";
import {
  Body,
  CollisionState,
  Leaf,
  RaycastResult,
  Response,
  SATPolygon,
  SATVector,
  TestFunction,
  Types,
  Vector,
} from "./model";
import {
  distance,
  checkAInB,
  ensureConvex,
  intersectAABB,
  bodyMoved,
  getSATFunction,
} from "./utils";
import { intersectLineCircle, intersectLinePolygon } from "./intersect";

/**
 * collision system
 */
export class System extends BaseSystem {
  /**
   * the last collision result
   */
  response: Response = new Response();

  /**
   * reusable inner state - for non convex polygons collisions
   */
  protected state: CollisionState = {
    collides: false,
    overlapV: new SATVector(),
  };

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
    callback: (response: Response) => void | boolean
  ): boolean {
    // no need to check static body collision
    if (body.isStatic) {
      return false;
    }

    return this.search(body).some((candidate: Body) => {
      if (candidate !== body && this.checkCollision(body, candidate)) {
        return callback(this.response);
      }
    });
  }

  /**
   * check all colliders collisions with callback
   */
  checkAll(callback: (response: Response) => void | boolean): boolean {
    return this.all().some((body: Body) => {
      return this.checkOne(body, callback);
    });
  }

  /**
   * get object potential colliders
   * @deprecated because it's slower to use than checkOne() or checkAll()
   */
  getPotentials(body: Body): Body[] {
    // filter here is required as collides with self
    return this.search(body).filter((candidate) => candidate !== body);
  }

  /**
   * check do 2 objects collide
   */
  checkCollision(body: Body, wall: Body): boolean {
    this.state.collides = false;
    this.response.clear();

    // check real bounding boxes (without padding)
    if (body.bbox && wall.bbox && !intersectAABB(body.bbox, wall.bbox)) {
      return false;
    }

    // proceed to sat.js checking
    const sat: TestFunction = getSATFunction(body, wall);
    const convexBodies = ensureConvex(body);
    const convexWalls = ensureConvex(wall);

    convexBodies.forEach((convexBody) => {
      convexWalls.forEach((convexWall) => {
        this.test(sat, convexBody, convexWall);
      });
    });

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

      this.response.aInB = checkAInB(body, wall);
      this.response.bInA = checkAInB(wall, body);
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

    this.checkOne(this.ray, ({ b: collider }) => {
      if (!allowCollider(collider)) {
        return false;
      }

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

  /**
   * update inner state function - for non convex polygons collisions
   */
  protected test(
    sat: TestFunction,
    body: SATPolygon | Circle,
    wall: SATPolygon | Circle
  ): void {
    const collides = sat(body, wall, this.response);

    if (collides) {
      // first time in loop, reset
      if (!this.state.collides) {
        this.state.overlapV = new SATVector();
      }

      // sum all collision vectors
      this.state.overlapV.add(this.response.overlapV);
    }

    // set state collide at least once value
    this.state.collides = collides || this.state.collides;

    // clear for reuse
    this.response.clear();
  }
}
