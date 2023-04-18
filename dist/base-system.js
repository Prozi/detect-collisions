"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseSystem = void 0;
const box_1 = require("./bodies/box");
const circle_1 = require("./bodies/circle");
const ellipse_1 = require("./bodies/ellipse");
const line_1 = require("./bodies/line");
const point_1 = require("./bodies/point");
const polygon_1 = require("./bodies/polygon");
const model_1 = require("./model");
const optimized_1 = require("./optimized");
const utils_1 = require("./utils");
/**
 * very base collision system
 */
class BaseSystem extends model_1.RBush {
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
}
exports.BaseSystem = BaseSystem;
//# sourceMappingURL=base-system.js.map