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
     * remove body aabb from collision tree
     */
    remove(body, equals) {
        body.system = undefined;
        return super.remove(body, equals);
    }
    /**
     * update body aabb and in tree
     */
    insert(body) {
        const bounds = body.getAABBAsBBox();
        const update = bounds.minX < body.minX ||
            bounds.minY < body.minY ||
            bounds.maxX > body.maxX ||
            bounds.maxY > body.maxY;
        if (body.system && !update) {
            return this;
        }
        // old bounding box *needs* to be removed
        if (body.system) {
            this.remove(body);
        }
        // only then we update min, max
        body.minX = bounds.minX - body.padding;
        body.minY = bounds.minY - body.padding;
        body.maxX = bounds.maxX + body.padding;
        body.maxY = bounds.maxY + body.padding;
        body.system = this;
        // reinsert bounding box to collision tree
        return super.insert(body);
    }
    /**
     * update all bodies aabb
     */
    update() {
        this.all().forEach((body) => {
            // no need to every cycle update static body aabb
            if (!body.isStatic) {
                this.insert(body);
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
            this.insert(response.a);
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
            result = convexBodies.reduce((reduceResult, convexBody) => convexCandidates.reduce((collidedAtLeastOnce, convexCandidate) => {
                state.collides = (0, sat_1.testPolygonPolygon)(convexBody, convexCandidate, this.response);
                return this.collided(state) || collidedAtLeastOnce;
            }, false) || reduceResult, false);
        }
        else {
            result = (0, sat_1.testPolygonPolygon)(body, candidate, this.response);
        }
        // collisionVector is set if body or candidate was concave during this.collided()
        if (state.collisionVector) {
            this.response.overlapV = state.collisionVector;
            this.response.overlapN = this.response.overlapV.clone().normalize();
            this.response.overlap = this.response.overlapV.len();
        }
        // set proper response object bodies
        if (!body.isConvex || !candidate.isConvex) {
            this.response.a = body;
            this.response.b = candidate;
        }
        if (!body.isConvex && !candidate.isConvex) {
            this.response.aInB = (0, utils_1.checkAInB)(body, candidate);
            this.response.bInA = (0, utils_1.checkAInB)(candidate, body);
        }
        else if (!body.isConvex) {
            this.response.aInB = (0, utils_1.checkAInB)(body, candidate);
            this.response.bInA = !!state.bInA;
        }
        else if (!candidate.isConvex) {
            this.response.aInB = !!state.aInB;
            this.response.bInA = (0, utils_1.checkAInB)(candidate, body);
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
            // lazy create vector
            if (typeof state.collisionVector === "undefined") {
                state.collisionVector = new model_1.SATVector();
            }
            // sum all collision vectors
            state.collisionVector.add(this.response.overlapV);
        }
        // aInB and bInA is kept in state for later restore
        state.aInB = state.aInB || this.response.aInB;
        state.bInA = state.bInA || this.response.bInA;
        // cleared response is at end recreated properly for concaves
        this.response.clear();
        return state.collides;
    }
}
exports.System = System;
//# sourceMappingURL=system.js.map