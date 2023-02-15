/// <reference types="sat" />
import RBush from "rbush";
import { BaseSystem } from "./base-system";
import { Body, Leaf, RaycastHit, Response, Vector } from "./model";
/**
 * collision system
 */
export declare class System extends BaseSystem {
    /**
     * the last collision result
     */
    response: Response;
    private ray;
    /**
     * remove body aabb from collision tree
     */
    remove(body: Body, equals?: (a: Body, b: Body) => boolean): RBush<Body>;
    /**
     * re-insert body into collision tree and update its aabb
     * every body can be part of only one system
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
    checkOne(body: Body, callback: (response: Response) => void | boolean): boolean;
    /**
     * check all colliders collisions with callback
     */
    checkAll(callback: (response: Response) => void | boolean): boolean;
    /**
     * get object potential colliders
     * @deprecated because it's slower to use than checkOne() or checkAll()
     */
    getPotentials(body: Body): Body[];
    /**
     * check do 2 objects collide
     */
    checkCollision(body: Body, wall: Body, response?: Response): boolean;
    /**
     * raycast to get collider of ray from start to end
     */
    raycast(start: Vector, end: Vector, allow?: (body: Body) => boolean): RaycastHit | null;
    /**
     * used to find body deep inside data with finder function returning boolean found or not
     */
    traverse(find: (child: Leaf, children: Leaf[], index: number) => boolean | void, { children }?: {
        children?: Leaf[];
    }): Body | undefined;
}
//# sourceMappingURL=system.d.ts.map