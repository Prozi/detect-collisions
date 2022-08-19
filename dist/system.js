"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.System = void 0;
const sat_1 = require("sat");
const base_system_1 = require("./base-system");
const model_1 = require("./model");
const utils_1 = require("./utils");
/**
 * collision system
 */
class System extends base_system_1.BaseSystem {
    constructor() {
        super(...arguments);
        this.response = new model_1.Response();
    }
    /**
     * update body aabb and in tree
     */
    updateBody(body) {
        const bounds = body.getAABBAsBBox();
        const update = bounds.minX < body.minX ||
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
    remove(body, equals) {
        body.system = undefined;
        return super.remove(body, equals);
    }
    /**
     * add body aabb to collision tree
     */
    insert(body) {
        body.system = this;
        return super.insert(body);
    }
    /**
     * update all bodies aabb
     */
    update() {
        this.all().forEach((body) => {
            // no need to every cycle update static body aabb
            if (!body.isStatic) {
                this.updateBody(body);
            }
        });
    }
    /**
     * separate (move away) colliders
     */
    separate() {
        this.checkAll((response) => {
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
    checkOne(body, callback) {
        // no need to check static body collision
        if (body.isStatic) {
            return;
        }
        this.getPotentials(body).forEach((candidate) => {
            if (this.checkCollision(body, candidate)) {
                callback(this.response);
            }
        });
    }
    /**
     * check all colliders collisions with callback
     */
    checkAll(callback) {
        this.all().forEach((body) => {
            this.checkOne(body, callback);
        });
    }
    /**
     * get object potential colliders
     */
    getPotentials(body) {
        // filter here is required as collides with self
        return this.search(body).filter((candidate) => candidate !== body);
    }
    /**
     * check do 2 objects collide
     */
    checkCollision(body, candidate) {
        this.response.clear();
        let result = false;
        const state = {
            collides: false,
        };
        if (body.type === model_1.Types.Circle) {
            if (candidate.type === model_1.Types.Circle) {
                result = (0, sat_1.testCircleCircle)(body, candidate, this.response);
            }
            else {
                result = (0, utils_1.ensureConvexPolygons)(candidate).reduce((collidedAtLeastOnce, convexCandidate) => {
                    state.collides = (0, sat_1.testCirclePolygon)(body, convexCandidate, this.response);
                    return this.collided(state) || collidedAtLeastOnce;
                }, false);
            }
        }
        else if (candidate.type === model_1.Types.Circle) {
            result = (0, utils_1.ensureConvexPolygons)(body).reduce((collidedAtLeastOnce, convexBody) => {
                state.collides = (0, sat_1.testPolygonCircle)(convexBody, candidate, this.response);
                return this.collided(state) || collidedAtLeastOnce;
            }, false);
        }
        else if (!body.isConvex || !candidate.isConvex) {
            const convexBodies = (0, utils_1.ensureConvexPolygons)(body);
            const convexCandidates = (0, utils_1.ensureConvexPolygons)(candidate);
            result = convexBodies.reduce((result, convexBody) => convexCandidates.reduce((collidedAtLeastOnce, convexCandidate) => {
                state.collides = (0, sat_1.testPolygonPolygon)(convexBody, convexCandidate, this.response);
                return this.collided(state) || collidedAtLeastOnce;
            }, false) || result, false);
        }
        else {
            result = (0, sat_1.testPolygonPolygon)(body, candidate, this.response);
        }
        if (state.collisionVector) {
            this.response.a = body;
            this.response.b = candidate;
            this.response.overlapV = state.collisionVector;
            this.response.overlapN = this.response.overlapV.clone().normalize();
            this.response.overlap = this.response.overlapV.len();
        }
        return result;
    }
    /**
     * raycast to get collider of ray from start to end
     */
    raycast(start, end, allowCollider = () => true) {
        let minDistance = Infinity;
        let result = null;
        const ray = this.createLine(start, end);
        const colliders = this.getPotentials(ray).filter((potential) => allowCollider(potential) && this.checkCollision(ray, potential));
        this.remove(ray);
        colliders.forEach((collider) => {
            const points = collider.type === model_1.Types.Circle
                ? (0, utils_1.intersectLineCircle)(ray, collider)
                : (0, utils_1.intersectLinePolygon)(ray, collider);
            points.forEach((point) => {
                const pointDistance = (0, utils_1.distance)(start, point);
                if (pointDistance < minDistance) {
                    minDistance = pointDistance;
                    result = { point, collider };
                }
            });
        });
        return result;
    }
    collided(state) {
        if (state.collides) {
            if (typeof state.collisionVector === "undefined") {
                state.collisionVector = new model_1.SATVector();
            }
            state.collisionVector.add(this.response.overlapV);
        }
        this.response.clear();
        return state.collides;
    }
}
exports.System = System;
//# sourceMappingURL=system.js.map