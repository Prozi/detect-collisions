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
const point_1 = require("./bodies/point");
const circle_1 = require("./bodies/circle");
const box_1 = require("./bodies/box");
const polygon_1 = require("./bodies/polygon");
const line_1 = require("./bodies/line");
const ellipse_1 = require("./bodies/ellipse");
/**
 * collision system
 */
class System extends rbush_1.default {
    constructor() {
        super(...arguments);
        this.response = new sat_1.default.Response();
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
            polygon_1.Polygon.prototype.draw.call({
                pos: { x: minX, y: minY },
                calcPoints: (0, utils_1.createBox)(maxX - minX, maxY - minY),
            }, context);
        });
        this.all().forEach((body) => {
            const { pos, w, h } = body.getAABBAsBox();
            polygon_1.Polygon.prototype.draw.call({ pos, calcPoints: (0, utils_1.createBox)(w, h) }, context);
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
        body.system = undefined;
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
        throw Error("Not implemented");
    }
    /**
     * raycast to get collider of ray from start to end
     * @param {Vector} start {x, y}
     * @param {Vector} end {x, y}
     * @returns {TBody|null}
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
    /**
     * create point
     * @param {Vector} position {x, y}
     */
    createPoint(position) {
        const point = new point_1.Point(position);
        this.insert(point);
        return point;
    }
    /**
     * create line
     * @param {Vector} start {x, y}
     * @param {Vector} end {x, y}
     */
    createLine(start, end, angle = 0) {
        const line = new line_1.Line(start, end);
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
        const circle = new circle_1.Circle(position, radius);
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
        const box = new box_1.Box(position, width, height);
        box.setAngle(angle);
        this.insert(box);
        return box;
    }
    /**
     * create ellipse
     * @param {Vector} position {x, y}
     * @param {number} radiusX
     * @param {number} radiusY
     * @param {number} step
     * @param {number} angle
     */
    createEllipse(position, radiusX, radiusY, step, angle = 0) {
        const ellipse = new ellipse_1.Ellipse(position, radiusX, radiusY, step);
        ellipse.setAngle(angle);
        this.insert(ellipse);
        return ellipse;
    }
    /**
     * create polygon
     * @param {Vector} position {x, y}
     * @param {Vector[]} points
     * @param {number} angle
     */
    createPolygon(position, points, angle = 0) {
        const polygon = new polygon_1.Polygon(position, points);
        polygon.setAngle(angle);
        this.insert(polygon);
        return polygon;
    }
}
exports.System = System;
//# sourceMappingURL=system.js.map