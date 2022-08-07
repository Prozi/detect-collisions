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
        if (body.type === model_1.Types.Circle) {
            if (candidate.type === model_1.Types.Circle) {
                return (0, sat_1.testCircleCircle)(body, candidate, this.response);
            }
            return (0, sat_1.testCirclePolygon)(body, candidate, this.response);
        }
        if (candidate.type === model_1.Types.Circle) {
            return (0, sat_1.testPolygonCircle)(body, candidate, this.response);
        }
        if (body.type === model_1.Types.Polygon || candidate.type === model_1.Types.Polygon) {
            const convexBodies = (0, utils_1.ensureConvexPolygons)(body);
            const convexCandidates = (0, utils_1.ensureConvexPolygons)(candidate);
            return convexBodies.some((convexBody) => convexCandidates.some((convexCandidate) => {
                const collide = (0, sat_1.testPolygonPolygon)(convexBody, convexCandidate, this.response);
                if (collide) {
                    this.response.a = body;
                    this.response.b = candidate;
                }
                return collide;
            }));
        }
        return (0, sat_1.testPolygonPolygon)(body, candidate, this.response);
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
    getBounceDirection(body, overlap) {
        const v2 = new sat_1.Vector(body.x - overlap.x, body.y - overlap.y);
        const v1 = new sat_1.Vector(overlap.x - body.x, overlap.y - body.y);
        const len = v1.dot(v2.normalize()) * 2;
        return new sat_1.Vector(v2.x * len - v1.x, v2.y * len - v1.y).normalize();
    }
}
exports.System = System;
//# sourceMappingURL=system.js.map