"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.System = void 0;
const base_system_1 = require("./base-system");
const model_1 = require("../model");
const utils_1 = require("../utils");
const raycast_utils_1 = require("../utils/raycast-utils");
/**
 * collision system
 */
class System extends base_system_1.BaseSystem {
    constructor() {
        super(...arguments);
        this.response = new model_1.Response();
        this.state = {
            collides: false,
            aInB: false,
            bInA: false,
            overlapV: new model_1.SATVector(),
        };
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
     */
    insert(body) {
        body.bbox = body.getAABBAsBBox();
        // allow only on first insert or if body moved
        if (body.system && !(0, utils_1.bodyMoved)(body)) {
            return this;
        }
        // old bounding box *needs* to be removed
        if (body.system) {
            // but we don't need to set system to undefined so super.remove
            super.remove(body);
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
        this.checkAll(({ a, overlapV }) => {
            // static bodies and triggers do not move back / separate
            if (a.isTrigger) {
                return true;
            }
            a.setPosition(a.x - overlapV.x, a.y - overlapV.y);
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
        this.getPotentials(body).some((candidate) => {
            if (this.checkCollision(body, candidate)) {
                return callback(this.response);
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
    checkCollision(body, wall) {
        // check bounding boxes without padding
        if ((body.padding || wall.padding) &&
            !(0, utils_1.intersectAABB)(body.bbox, wall.bbox)) {
            return false;
        }
        this.state.collides = false;
        this.response.clear();
        const sat = (0, utils_1.getSATFunction)(body, wall);
        if (body.isConvex && wall.isConvex) {
            this.state.collides = sat(body, wall, this.response);
        }
        else if (body.isConvex && !wall.isConvex) {
            (0, utils_1.ensureConvex)(wall).forEach((convexWall) => {
                this.test(sat, body, convexWall);
            });
        }
        else if (!body.isConvex && wall.isConvex) {
            (0, utils_1.ensureConvex)(body).forEach((convexBody) => {
                this.test(sat, convexBody, wall);
            });
        }
        else {
            const convexBodies = (0, utils_1.ensureConvex)(body);
            const convexWalls = (0, utils_1.ensureConvex)(wall);
            convexBodies.forEach((convexBody) => {
                convexWalls.forEach((convexWall) => {
                    this.test(sat, convexBody, convexWall);
                });
            });
        }
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
            this.response.aInB = body.isConvex
                ? this.state.aInB
                : (0, utils_1.checkAInB)(body, wall);
            this.response.bInA = wall.isConvex
                ? this.state.bInA
                : (0, utils_1.checkAInB)(wall, body);
        }
        return this.state.collides;
    }
    /**
     * raycast to get collider of ray from start to end
     */
    raycast(start, end, allowCollider = () => true) {
        return (0, raycast_utils_1.raycast)(this, start, end, allowCollider);
    }
    test(sat, body, wall) {
        const collides = sat(body, wall, this.response);
        if (collides) {
            // first time in loop, reset
            if (!this.state.collides) {
                this.state.aInB = false;
                this.state.bInA = false;
                this.state.overlapV = new model_1.SATVector();
            }
            // sum all collision vectors
            this.state.overlapV.add(this.response.overlapV);
        }
        // aInB and bInA is kept in state for later restore
        this.state.aInB = this.state.aInB || this.response.aInB;
        this.state.bInA = this.state.bInA || this.response.bInA;
        // set state collide at least once value
        this.state.collides = collides || this.state.collides;
        // clear for reuse
        this.response.clear();
    }
}
exports.System = System;
//# sourceMappingURL=system.js.map