/// <reference types="sat" />
import RBush from "rbush";
import { BaseSystem } from "./base-system";
import { Body, ChildrenData, CollisionState, Leaf, RaycastResult, Response, TestFunction, Vector } from "./model";
/**
 * collision system
 */
export declare class System extends BaseSystem {
    /**
     * the last collision result
     */
    response: Response;
    bodies: Record<string, Body>;
    /**
     * reusable inner state - for non convex polygons collisions
     */
    protected state: CollisionState;
    private ray;
    /**
     * remove body aabb from collision tree
     */
    remove(body: Body, equals?: (a: Body, b: Body) => boolean): RBush<Body>;
    /**
     * re-insert body into collision tree and update its aabb
     */
    insert(body: Body): RBush<Body>;
    /**
     * alias for insert, updates body in collision tree
     */
    updateBody(body: Body): void;
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
    checkOne(body: Body, callback: (response: Response) => void | boolean): void;
    /**
     * check all colliders collisions with callback
     */
    checkAll(callback: (response: Response) => void | boolean): void;
    /**
     * get object potential colliders
     * @deprecated
     */
    getPotentials(body: Body): Body[];
    /**
     * check do 2 objects collide
     */
    checkCollision(body: Body, wall: Body): boolean;
    /**
     * raycast to get collider of ray from start to end
     */
    raycast(start: Vector, end: Vector, allowCollider?: (testCollider: Body) => boolean): RaycastResult;
    clear(): this;
    /**
     * used to find body deep inside data with finder function returning boolean found or not
     */
    traverse(find: (child: Leaf, children: Leaf[], index: number) => boolean | void, { children }?: {
        children?: Leaf[];
    }): Body | undefined;
    fromJSON(data: ChildrenData): RBush<Body>;
    /**
     * update inner state function - for non convex polygons collisions
     */
    protected test(sat: TestFunction, body: Body, wall: Body): void;
}
//# sourceMappingURL=system.d.ts.map