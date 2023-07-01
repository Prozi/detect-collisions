/// <reference types="sat" />
import RBush from "rbush";
import { BaseSystem } from "./base-system";
import { Line } from "./bodies/line";
import { Leaf, RaycastHit, Response, Vector, Body, CheckCollisionCallback } from "./model";
/**
 * collision system
 */
export declare class System<TBody extends Body = Body> extends BaseSystem<TBody> {
    /**
     * the last collision result
     */
    response: Response;
    protected ray: Line;
    /**
     * remove body aabb from collision tree
     */
    remove(body: TBody, equals?: (a: TBody, b: TBody) => boolean): RBush<TBody>;
    /**
     * re-insert body into collision tree and update its aabb
     * every body can be part of only one system
     */
    insert(body: TBody): RBush<TBody>;
    /**
     * alias for insert, updates body in collision tree
     */
    updateBody(body: TBody): void;
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
    checkOne(body: TBody, callback?: CheckCollisionCallback, response?: Response): boolean;
    /**
     * check all colliders collisions with callback
     */
    checkAll(callback: (response: Response) => void | boolean, response?: Response): boolean;
    /**
     * get object potential colliders
     * @deprecated because it's slower to use than checkOne() or checkAll()
     */
    getPotentials(body: TBody): TBody[];
    /**
     * check do 2 objects collide
     */
    checkCollision(bodyA: TBody, bodyB: TBody, response?: Response): boolean;
    /**
     * raycast to get collider of ray from start to end
     */
    raycast(start: Vector, end: Vector, allow?: (body: TBody) => boolean): RaycastHit<TBody> | null;
    /**
     * used to find body deep inside data with finder function returning boolean found or not
     */
    traverse(find: (child: Leaf<TBody>, children: Leaf<TBody>[], index: number) => boolean | void, { children }?: {
        children?: Leaf<TBody>[];
    }): TBody | undefined;
}
