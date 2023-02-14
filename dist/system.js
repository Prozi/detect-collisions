"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.System = void 0;
const base_system_1 = require("./base-system");
const line_1 = require("./bodies/line");
const model_1 = require("./model");
const utils_1 = require("./utils");
const intersect_1 = require("./intersect");
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
        /**
         * reusable inner state - for non convex polygons collisions
         */
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
                return false;
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
            return false;
        }
        return this.search(body).some((candidate) => {
            if (candidate !== body && this.checkCollision(body, candidate)) {
                return callback(this.response);
            }
        });
    }
    /**
     * check all colliders collisions with callback
     */
    checkAll(callback) {
        return this.all().some((body) => {
            return this.checkOne(body, callback);
        });
    }
    /**
     * get object potential colliders
     * @deprecated because it's slower to use than checkOne() or checkAll()
     */
    getPotentials(body) {
        // filter here is required as collides with self
        return this.search(body).filter((candidate) => candidate !== body);
    }
    /**
     * check do 2 objects collide
     */
    checkCollision(body, wall) {
        this.state.collides = false;
        this.response.clear();
        // check real bounding boxes (without padding)
        if (body.bbox && wall.bbox && !(0, utils_1.intersectAABB)(body.bbox, wall.bbox)) {
            return false;
        }
        // proceed to sat.js checking
        const sat = (0, utils_1.getSATFunction)(body, wall);
        const convexBodies = (0, utils_1.ensureConvex)(body);
        const convexWalls = (0, utils_1.ensureConvex)(wall);
        convexBodies.forEach((convexBody) => {
            convexWalls.forEach((convexWall) => {
                this.test(sat, convexBody, convexWall);
            });
        });
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
            this.response.aInB = (0, utils_1.checkAInB)(body, wall);
            this.response.bInA = (0, utils_1.checkAInB)(wall, body);
        }
        return this.state.collides;
    }
    /**
     * raycast to get collider of ray from start to end
     */
    raycast(start, end, allowCollider = () => true) {
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
        this.checkOne(this.ray, ({ b: collider }) => {
            if (!allowCollider(collider)) {
                return false;
            }
            const points = collider.type === model_1.Types.Circle
                ? (0, intersect_1.intersectLineCircle)(this.ray, collider)
                : (0, intersect_1.intersectLinePolygon)(this.ray, collider);
            points.forEach((point) => {
                const pointDistance = (0, utils_1.distance)(start, point);
                if (pointDistance < minDistance) {
                    minDistance = pointDistance;
                    result = { point, collider };
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
    /**
     * update inner state function - for non convex polygons collisions
     */
    test(sat, body, wall) {
        const collides = sat(body, wall, this.response);
        if (collides) {
            // first time in loop, reset
            if (!this.state.collides) {
                this.state.overlapV = new model_1.SATVector();
            }
            // sum all collision vectors
            this.state.overlapV.add(this.response.overlapV);
        }
        // set state collide at least once value
        this.state.collides = collides || this.state.collides;
        // clear for reuse
        this.response.clear();
    }
}
exports.System = System;
//# sourceMappingURL=system.js.map