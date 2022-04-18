"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.System = void 0;
const sat_1 = __importDefault(require("sat"));
const rbush_1 = __importDefault(require("rbush"));
const model_1 = require("./model");
const utils_1 = require("./utils");
const _1 = require(".");
const oval_1 = require("./bodies/oval");
/**
 * collision system
 */
class System extends rbush_1.default {
    constructor() {
        super(...arguments);
        this.response = new sat_1.default.Response();
    }
    // https://stackoverflow.com/questions/37224912/circle-line-segment-collision
    static intersectLineCircle(line, circle) {
        const v1 = { x: line.end.x - line.start.x, y: line.end.y - line.start.y };
        const v2 = {
            x: line.start.x - circle.pos.x,
            y: line.start.y - circle.pos.y,
        };
        const b = (v1.x * v2.x + v1.y * v2.y) * -2;
        const c = 2 * (v1.x * v1.x + v1.y * v1.y);
        const d = Math.sqrt(b * b - 2 * c * (v2.x * v2.x + v2.y * v2.y - circle.r * circle.r));
        if (isNaN(d)) {
            // no intercept
            return [];
        }
        const u1 = (b - d) / c; // these represent the unit distance of point one and two on the line
        const u2 = (b + d) / c;
        const results = []; // return array
        if (u1 <= 1 && u1 >= 0) {
            // add point if on the line segment
            results.push({
                x: line.start.x + v1.x * u1,
                y: line.start.y + v1.y * u1,
            });
        }
        if (u2 <= 1 && u2 >= 0) {
            // second add point if on the line segment
            results.push({
                x: line.start.x + v1.x * u2,
                y: line.start.y + v1.y * u2,
            });
        }
        return results;
    }
    // https://stackoverflow.com/questions/9043805/test-if-two-lines-intersect-javascript-function
    static intersectLineLine(line1, line2) {
        const dX = line1.end.x - line1.start.x;
        const dY = line1.end.y - line1.start.y;
        const determinant = dX * (line2.end.y - line2.start.y) - (line2.end.x - line2.start.x) * dY;
        if (determinant === 0) {
            return null;
        }
        const lambda = ((line2.end.y - line2.start.y) * (line2.end.x - line1.start.x) +
            (line2.start.x - line2.end.x) * (line2.end.y - line1.start.y)) /
            determinant;
        const gamma = ((line1.start.y - line1.end.y) * (line2.end.x - line1.start.x) +
            dX * (line2.end.y - line1.start.y)) /
            determinant;
        // check if there is an intersection
        if (!(0 <= lambda && lambda <= 1) || !(0 <= gamma && gamma <= 1)) {
            return null;
        }
        return {
            x: line1.start.x + lambda * dX,
            y: line1.start.y + lambda * dY,
        };
    }
    /**
     * draw bodies
     * @param {CanvasRenderingContext2D} context
     */
    draw(context) {
        this.all().forEach((body) => {
            body.draw(context);
        });
    }
    /**
     * draw hierarchy
     * @param {CanvasRenderingContext2D} context
     */
    drawBVH(context) {
        this.data.children.forEach(({ minX, maxX, minY, maxY }) => {
            _1.Polygon.prototype.draw.call({
                pos: { x: minX, y: minY },
                calcPoints: (0, utils_1.createBox)(maxX - minX, maxY - minY),
            }, context);
        });
        this.all().forEach((body) => {
            const { pos, w, h } = body.getAABBAsBox();
            _1.Polygon.prototype.draw.call({
                pos,
                calcPoints: (0, utils_1.createBox)(w, h),
            }, context);
        });
    }
    /**
     * update body aabb and in tree
     * @param {object} body
     */
    updateBody(body) {
        // old aabb needs to be removed
        this.remove(body);
        // then we update aabb
        body.updateAABB();
        // then we reinsert body to collision tree
        this.insert(body);
    }
    /**
     * remove body aabb from collision tree
     * @param body
     * @param equals
     * @returns System
     */
    remove(body, equals) {
        body.system = null;
        return super.remove(body, equals);
    }
    /**
     * add body aabb to collision tree
     * @param body
     * @returns System
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
            response.a.pos.x -= response.overlapV.x;
            response.a.pos.y -= response.overlapV.y;
            this.updateBody(response.a);
        });
    }
    /**
     * check one collider collisions with callback
     * @param {function} callback
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
     * @param {function} callback
     */
    checkAll(callback) {
        this.all().forEach((body) => {
            this.checkOne(body, callback);
        });
    }
    /**
     * get object potential colliders
     * @param {object} collider
     */
    getPotentials(body) {
        // filter here is required as collides with self
        return this.search(body).filter((candidate) => candidate !== body);
    }
    /**
     * check do 2 objects collide
     * @param {object} collider
     * @param {object} candidate
     */
    checkCollision(body, candidate) {
        this.response.clear();
        if (body.type === model_1.Types.Circle && candidate.type === model_1.Types.Circle) {
            return sat_1.default.testCircleCircle(body, candidate, this.response);
        }
        if (body.type === model_1.Types.Circle && candidate.type !== model_1.Types.Circle) {
            return sat_1.default.testCirclePolygon(body, candidate, this.response);
        }
        if (body.type !== model_1.Types.Circle && candidate.type === model_1.Types.Circle) {
            return sat_1.default.testPolygonCircle(body, candidate, this.response);
        }
        if (body.type !== model_1.Types.Circle && candidate.type !== model_1.Types.Circle) {
            return sat_1.default.testPolygonPolygon(body, candidate, this.response);
        }
    }
    /**
     * raycast to get collider of ray from start to end
     * @param {Vector} start {x, y}
     * @param {Vector} end {x, y}
     * @returns {TBody}
     */
    raycast(start, end, allowCollider = () => true) {
        const ray = this.createLine(start, end);
        const colliders = this.getPotentials(ray).filter((potential) => allowCollider(potential) && this.checkCollision(ray, potential));
        this.remove(ray);
        const results = [];
        const sort = (0, utils_1.closest)(start);
        colliders.forEach((collider) => {
            switch (collider.type) {
                case model_1.Types.Circle: {
                    const points = System.intersectLineCircle(ray, collider);
                    results.push(...points.map((point) => ({ point, collider })));
                    break;
                }
                default: {
                    const points = collider.calcPoints
                        .map((to, index) => {
                        const from = index
                            ? collider.calcPoints[index - 1]
                            : collider.calcPoints[collider.calcPoints.length - 1];
                        const line = new _1.Line({ x: from.x + collider.pos.x, y: from.y + collider.pos.y }, { x: to.x + collider.pos.x, y: to.y + collider.pos.y });
                        return System.intersectLineLine(ray, line);
                    })
                        .filter((test) => !!test);
                    results.push(...points.map((point) => ({ point, collider })));
                    break;
                }
            }
        });
        return results.sort(sort)[0];
    }
    /**
     * create point
     * @param {Vector} position {x, y}
     */
    createPoint(position) {
        const point = new _1.Point(position);
        this.insert(point);
        return point;
    }
    /**
     * create line
     * @param {Vector} start {x, y}
     * @param {Vector} end {x, y}
     */
    createLine(start, end, angle = 0) {
        const line = new _1.Line(start, end);
        line.setAngle(angle);
        this.insert(line);
        return line;
    }
    /**
     * create circle
     * @param {Vector} position {x, y}
     * @param {number} radius
     */
    createCircle(position, radius) {
        const circle = new _1.Circle(position, radius);
        this.insert(circle);
        return circle;
    }
    /**
     * create box
     * @param {Vector} position {x, y}
     * @param {number} width
     * @param {number} height
     * @param {number} angle
     */
    createBox(position, width, height, angle = 0) {
        const box = new _1.Box(position, width, height);
        box.setAngle(angle);
        this.insert(box);
        return box;
    }
    /**
     * create oval
     * @param {Vector} position {x, y}
     * @param {number} radiusX
     * @param {number} radiusY
     * @param {number} step
     * @param {number} angle
     */
    createOval(position, radiusX, radiusY, step = 1, angle = 0) {
        const oval = new oval_1.Oval(position, radiusX, radiusY, step);
        oval.setAngle(angle);
        this.insert(oval);
        return oval;
    }
    /**
     * create polygon
     * @param {Vector} position {x, y}
     * @param {Vector[]} points
     * @param {number} angle
     */
    createPolygon(position, points, angle = 0) {
        const polygon = new _1.Polygon(position, points);
        polygon.setAngle(angle);
        this.insert(polygon);
        return polygon;
    }
}
exports.System = System;
