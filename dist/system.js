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
                this.updateBody(body);
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
        this.response.clear();
        const state = {
            collides: false,
        };
        let test;
        if (body.type === model_1.Types.Circle && wall.type === model_1.Types.Circle) {
            test = sat_1.testCircleCircle;
        }
        else if (body.type === model_1.Types.Circle && wall.type !== model_1.Types.Circle) {
            test = sat_1.testCirclePolygon;
        }
        else if (body.type !== model_1.Types.Circle && wall.type === model_1.Types.Circle) {
            test = sat_1.testPolygonCircle;
        }
        else {
            test = sat_1.testPolygonPolygon;
        }
        if (body.isConvex && wall.isConvex) {
            state.collides = test(body, wall, this.response);
        }
        else if (body.isConvex && !wall.isConvex) {
            (0, utils_1.ensureConvex)(wall).forEach((convexWall) => this.collided(state, test(body, convexWall, this.response)));
        }
        else if (!body.isConvex && wall.isConvex) {
            (0, utils_1.ensureConvex)(body).forEach((convexBody) => this.collided(state, test(convexBody, wall, this.response)));
        }
        else {
            const convexBodies = (0, utils_1.ensureConvex)(body);
            const convexWalls = (0, utils_1.ensureConvex)(wall);
            convexBodies.forEach((convexBody) => convexWalls.forEach((convexWall) => this.collided(state, test(convexBody, convexWall, this.response))));
        }
        // collisionVector is set if body or candidate was concave during this.collided()
        if (state.collisionVector) {
            this.response.overlapV = state.collisionVector;
            this.response.overlapN = this.response.overlapV.clone().normalize();
            this.response.overlap = this.response.overlapV.len();
        }
        // set proper response object bodies
        if (!body.isConvex || !wall.isConvex) {
            this.response.a = body;
            this.response.b = wall;
        }
        if (!body.isConvex && !wall.isConvex) {
            this.response.aInB = (0, utils_1.checkAInB)(body, wall);
            this.response.bInA = (0, utils_1.checkAInB)(wall, body);
        }
        else if (!body.isConvex) {
            this.response.aInB = (0, utils_1.checkAInB)(body, wall);
            this.response.bInA = !!state.bInA;
        }
        else if (!wall.isConvex) {
            this.response.aInB = !!state.aInB;
            this.response.bInA = (0, utils_1.checkAInB)(wall, body);
        }
        return state.collides;
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
    collided(state, collides) {
        if (collides) {
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
        // set state collide at least once value
        state.collides = collides || state.collides;
        // clear for reuse
        this.response.clear();
    }
}
exports.System = System;
//# sourceMappingURL=system.js.map