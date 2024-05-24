/// <reference types="sat" />
import { BaseSystem } from "./base-system";
import { Line } from "./bodies/line";
import { BBox, Body, CollisionCallback, RBush, RaycastHit, Response, Vector } from "./model";
/**
 * collision system
 */
export declare class System<TBody extends Body = Body> extends BaseSystem<TBody> {
    /**
     * the last collision result
     */
    response: Response;
    /**
     * for raycasting
     */
    protected ray: Line;
    /**
     * re-insert body into collision tree and update its bbox
     * every body can be part of only one system
     */
    insert(body: TBody): RBush<TBody>;
    /**
     * separate (move away) bodies
     */
    separate(): void;
    /**
     * separate (move away) 1 body
     */
    separateBody(body: TBody): void;
    /**
     * check one body collisions with callback
     */
    checkOne(body: TBody, callback?: CollisionCallback, response?: Response): boolean;
    /**
     * callback all bodies in area
     */
    checkArea(area: BBox, callback?: CollisionCallback, response?: Response): boolean;
    /**
     * check all bodies collisions with callback
     */
    checkAll(callback?: CollisionCallback, response?: Response): boolean;
    /**
     * check do 2 objects collide
     */
    checkCollision(bodyA: TBody, bodyB: TBody, response?: Response): boolean;
    /**
     * raycast to get collider of ray from start to end
     */
    raycast(start: Vector, end: Vector, allow?: (body: TBody, ray: TBody) => boolean): RaycastHit<TBody> | null;
}
