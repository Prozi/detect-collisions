"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.System = void 0;
const base_system_1 = require("./base-system");
const line_1 = require("./bodies/line");
const model_1 = require("./model");
const utils_1 = require("./utils");
const intersect_1 = require("./intersect");
const optimized_1 = require("./optimized");
/**
 * collision system
 */
class System extends base_system_1.BaseSystem {
    constructor() {
        super(...arguments);
        /**
         * the last collision result
         */
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
     * re-insert body into collision tree and update its aabb
     * every body can be part of only one system
     */
    insert(body) {
        body.bbox = body.getAABBAsBBox();
        if (body.system) {
            // allow end if body inserted and not moved
            if (!(0, utils_1.bodyMoved)(body)) {
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
    updateBody(body) {
        this.insert(body);
    }
    /**
     * update all bodies aabb
     */
    update() {
        (0, optimized_1.forEach)(this.all(), (body) => {
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
        this.checkAll(({ a, overlapV }) => {
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
    checkOne(body, callback, response = this.response) {
        // no need to check static body collision
        if (body.isStatic) {
            return false;
        }
        return (0, optimized_1.some)(this.search(body), (candidate) => {
            if (candidate !== body &&
                this.checkCollision(body, candidate, response)) {
                return callback(response);
            }
        });
    }
    /**
     * check all colliders collisions with callback
     */
    checkAll(callback, response = this.response) {
        return (0, optimized_1.some)(this.all(), (body) => {
            return this.checkOne(body, callback, response);
        });
    }
    /**
     * get object potential colliders
     * @deprecated because it's slower to use than checkOne() or checkAll()
     */
    getPotentials(body) {
        // filter here is required as collides with self
        return (0, optimized_1.filter)(this.search(body), (candidate) => candidate !== body);
    }
    /**
     * check do 2 objects collide
     */
    checkCollision(body, wall, response = this.response) {
        let collided = false;
        if ((!body.padding && !wall.padding) ||
            (0, utils_1.intersectAABB)(body.bbox || body, wall.bbox || wall)) {
            const sat = (0, utils_1.getSATTest)(body, wall);
            const overlapV = new model_1.SATVector();
            const bothConvex = body.isConvex && wall.isConvex;
            const convexBodies = (0, utils_1.ensureConvex)(body);
            const convexWalls = (0, utils_1.ensureConvex)(wall);
            (0, optimized_1.some)(convexBodies, (convexBody) => (0, optimized_1.some)(convexWalls, (convexWall) => {
                response.clear();
                if (sat(convexBody, convexWall, response)) {
                    collided = true;
                    if (bothConvex) {
                        return true;
                    }
                    overlapV.add(response.overlapV);
                }
                return false;
            }));
            if (!collided) {
                response.aInB = false;
                response.bInA = false;
            }
            else if (!bothConvex) {
                response.a = body;
                response.b = wall;
                response.overlapV = overlapV;
                response.overlapN = overlapV.clone().normalize();
                response.overlap = overlapV.len();
                response.aInB = (0, utils_1.checkAInB)(body, wall);
                response.bInA = (0, utils_1.checkAInB)(wall, body);
            }
        }
        return collided;
    }
    /**
     * raycast to get collider of ray from start to end
     */
    raycast(start, end, allow = () => true) {
        let minDistance = Infinity;
        let result = null;
        if (!this.ray) {
            this.ray = new line_1.Line(start, end, { isTrigger: true });
        }
        else {
            this.ray.start = start;
            this.ray.end = end;
        }
        this.insert(this.ray);
        this.checkOne(this.ray, ({ b: body }) => {
            if (!allow(body)) {
                return false;
            }
            const points = body.type === model_1.BodyType.Circle
                ? (0, intersect_1.intersectLineCircle)(this.ray, body)
                : (0, intersect_1.intersectLinePolygon)(this.ray, body);
            (0, optimized_1.forEach)(points, (point) => {
                const pointDistance = (0, utils_1.distance)(start, point);
                if (pointDistance < minDistance) {
                    minDistance = pointDistance;
                    result = { point, body };
                }
            });
        });
        this.remove(this.ray);
        return result;
    }
    /**
     * used to find body deep inside data with finder function returning boolean found or not
     */
    traverse(find, { children } = this.data) {
        return children === null || children === void 0 ? void 0 : children.find((body, index) => {
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
}
exports.System = System;
//# sourceMappingURL=system.js.map