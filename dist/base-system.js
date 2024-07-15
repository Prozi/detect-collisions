"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseSystem = void 0;
const model_1 = require("./model");
const utils_1 = require("./utils");
const optimized_1 = require("./optimized");
const box_1 = require("./bodies/box");
const circle_1 = require("./bodies/circle");
const ellipse_1 = require("./bodies/ellipse");
const line_1 = require("./bodies/line");
const point_1 = require("./bodies/point");
const polygon_1 = require("./bodies/polygon");
/**
 * very base collision system (create, insert, update, draw, remove)
 */
class BaseSystem extends model_1.RBush {
    /**
     * create point at position with options and add to system
     */
    createPoint(position, options) {
        const point = new point_1.Point(position, options);
        this.insert(point);
        return point;
    }
    /**
     * create line at position with options and add to system
     */
    createLine(start, end, options) {
        const line = new line_1.Line(start, end, options);
        this.insert(line);
        return line;
    }
    /**
     * create circle at position with options and add to system
     */
    createCircle(position, radius, options) {
        const circle = new circle_1.Circle(position, radius, options);
        this.insert(circle);
        return circle;
    }
    /**
     * create box at position with options and add to system
     */
    createBox(position, width, height, options) {
        const box = new box_1.Box(position, width, height, options);
        this.insert(box);
        return box;
    }
    /**
     * create ellipse at position with options and add to system
     */
    createEllipse(position, radiusX, radiusY = radiusX, step, options) {
        const ellipse = new ellipse_1.Ellipse(position, radiusX, radiusY, step, options);
        this.insert(ellipse);
        return ellipse;
    }
    /**
     * create polygon at position with options and add to system
     */
    createPolygon(position, points, options) {
        const polygon = new polygon_1.Polygon(position, points, options);
        this.insert(polygon);
        return polygon;
    }
    /**
     * re-insert body into collision tree and update its bbox
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
        // reinsert bounding box to collision tree
        return super.insert(body);
    }
    /**
     * updates body in collision tree
     */
    updateBody(body) {
        body.updateBody();
    }
    /**
     * update all bodies aabb
     */
    update() {
        (0, optimized_1.forEach)(this.all(), (body) => {
            this.updateBody(body);
        });
    }
    /**
     * draw exact bodies colliders outline
     */
    draw(context) {
        (0, optimized_1.forEach)(this.all(), (body) => {
            body.draw(context);
        });
    }
    /**
     * draw bounding boxes hierarchy outline
     */
    drawBVH(context) {
        const drawChildren = (body) => {
            (0, utils_1.drawBVH)(context, body);
            if (body.children) {
                (0, optimized_1.forEach)(body.children, drawChildren);
            }
        };
        (0, optimized_1.forEach)(this.data.children, drawChildren);
    }
    /**
     * remove body aabb from collision tree
     */
    remove(body, equals) {
        body.system = undefined;
        return super.remove(body, equals);
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
     * used to find body deep inside data with finder function returning boolean found or not
     */
    traverse(traverseFunction, { children } = this.data) {
        return children === null || children === void 0 ? void 0 : children.find((body, index) => {
            if (!body) {
                return false;
            }
            if (body.typeGroup && traverseFunction(body, children, index)) {
                return true;
            }
            // if callback returns true, ends forEach
            if (body.children) {
                this.traverse(traverseFunction, body);
            }
        });
    }
}
exports.BaseSystem = BaseSystem;
