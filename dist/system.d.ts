/// <reference types="sat" />
import RBush from "rbush";
import { BaseSystem } from "./base-system";
import { Body, RaycastResult, Response, Vector } from "./model";
/**
 * collision system
 */
export declare class System extends BaseSystem {
    response: Response;
    /**
     * update body aabb and in tree
     */
    updateBody(body: Body): void;
    /**
     * remove body aabb from collision tree
     */
    remove(body: Body, equals?: (a: Body, b: Body) => boolean): RBush<Body>;
    /**
     * add body aabb to collision tree
     */
    insert(body: Body): RBush<Body>;
    /**
     * update all bodies aabb
     */
    update(): void;
    /**
     * separate (move away) colliders
     */
    separate(): void;
    /**
     * check one collider collisions with callback
     */
    checkOne(body: Body, callback: (response: Response) => void): void;
    /**
     * check all colliders collisions with callback
     */
    checkAll(callback: (response: Response) => void): void;
    /**
     * get object potential colliders
     */
    getPotentials(body: Body): Body[];
    /**
     * check do 2 objects collide
     */
    checkCollision(body: Body, candidate: Body): boolean;
    /**
     * raycast to get collider of ray from start to end
     */
    raycast(start: Vector, end: Vector, allowCollider?: (testCollider: Body) => boolean): RaycastResult;
    private collided;
}
//# sourceMappingURL=system.d.ts.map