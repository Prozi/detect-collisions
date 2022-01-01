import SAT from "sat";
import RBush from "rbush";
import { Types } from "./model";
import { Box } from "./bodies/box";
import { Circle } from "./bodies/circle";
import { Polygon } from "./bodies/polygon";
import { Point } from "./bodies/point";
import { createBox } from "./utils";
/**
 * collision system
 */
export class System extends RBush {
    constructor() {
        super(...arguments);
        this.response = new SAT.Response();
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
            Polygon.prototype.draw.call({
                pos: { x: minX, y: minY },
                calcPoints: createBox(maxX - minX, maxY - minY),
            }, context);
        });
        this.all().forEach((body) => {
            const { pos, w, h } = body.getAABBAsBox();
            Polygon.prototype.draw.call({
                pos,
                calcPoints: createBox(w, h),
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
        if (body.type === Types.Circle && candidate.type === Types.Circle) {
            return SAT.testCircleCircle(body, candidate, this.response);
        }
        if (body.type === Types.Circle && candidate.type !== Types.Circle) {
            return SAT.testCirclePolygon(body, candidate, this.response);
        }
        if (body.type !== Types.Circle && candidate.type === Types.Circle) {
            return SAT.testPolygonCircle(body, candidate, this.response);
        }
        if (body.type !== Types.Circle && candidate.type !== Types.Circle) {
            return SAT.testPolygonPolygon(body, candidate, this.response);
        }
    }
    /**
     * create point
     * @param {Vector} position {x, y}
     */
    createPoint(position) {
        const point = new Point(position);
        this.insert(point);
        return point;
    }
    /**
     * create circle
     * @param {Vector} position {x, y}
     * @param {number} radius
     */
    createCircle(position, radius) {
        const circle = new Circle(position, radius);
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
        const box = new Box(position, width, height);
        box.setAngle(angle);
        this.insert(box);
        return box;
    }
    /**
     * create polygon
     * @param {Vector} position {x, y}
     * @param {Vector[]} points
     * @param {number} angle
     */
    createPolygon(position, points, angle = 0) {
        const polygon = new Polygon(position, points);
        polygon.setAngle(angle);
        this.insert(polygon);
        return polygon;
    }
}
