"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.drawCircle = exports.drawPolygon = exports.drawBVH = exports.draw = exports.dashLineTo = void 0;
const polygon_1 = require("../bodies/polygon");
const utils_1 = require("./utils");
/**
 * draws dashed line on canvas context
 */
function dashLineTo(context, fromX, fromY, toX, toY, dash = 2, gap = 4) {
    const xDiff = toX - fromX;
    const yDiff = toY - fromY;
    const arc = Math.atan2(yDiff, xDiff);
    const offsetX = Math.cos(arc);
    const offsetY = Math.sin(arc);
    let posX = fromX;
    let posY = fromY;
    let dist = Math.hypot(xDiff, yDiff);
    while (dist > 0) {
        const step = Math.min(dist, dash);
        context.moveTo(posX, posY);
        context.lineTo(posX + offsetX * step, posY + offsetY * step);
        posX += offsetX * (dash + gap);
        posY += offsetY * (dash + gap);
        dist -= dash + gap;
    }
}
exports.dashLineTo = dashLineTo;
/**
 * draw bodies
 */
function draw(system, context) {
    system.all().forEach((body) => {
        body.draw(context);
    });
}
exports.draw = draw;
/**
 * draw hierarchy
 */
function drawBVH(system, context) {
    [...system.all(), ...system.data.children].forEach(({ minX, maxX, minY, maxY }) => {
        polygon_1.Polygon.prototype.draw.call({
            x: minX,
            y: minY,
            calcPoints: (0, utils_1.createBox)(maxX - minX, maxY - minY),
        }, context);
    });
}
exports.drawBVH = drawBVH;
/**
 * draw polygon helper function
 */
function drawPolygon(polygon, context) {
    const points = [...polygon.calcPoints, polygon.calcPoints[0]];
    points.forEach((point, index) => {
        const toX = polygon.x + point.x;
        const toY = polygon.y + point.y;
        const prev = polygon.calcPoints[index - 1] ||
            polygon.calcPoints[polygon.calcPoints.length - 1];
        if (!index) {
            if (polygon.calcPoints.length === 1) {
                context.arc(toX, toY, 1, 0, Math.PI * 2);
            }
            else {
                context.moveTo(toX, toY);
            }
        }
        else if (polygon.calcPoints.length > 1) {
            if (polygon.isTrigger) {
                const fromX = polygon.x + prev.x;
                const fromY = polygon.y + prev.y;
                dashLineTo(context, fromX, fromY, toX, toY);
            }
            else {
                context.lineTo(toX, toY);
            }
        }
    });
}
exports.drawPolygon = drawPolygon;
/**
 * draw circle helper function
 */
function drawCircle(circle, context) {
    const x = circle.x + circle.offset.x;
    const y = circle.y + circle.offset.y;
    if (circle.isTrigger) {
        const max = Math.max(8, circle.r);
        for (let i = 0; i < max; i++) {
            const arc = (i / max) * 2 * Math.PI;
            const arcPrev = ((i - 1) / max) * 2 * Math.PI;
            const fromX = x + Math.cos(arcPrev) * circle.r;
            const fromY = y + Math.sin(arcPrev) * circle.r;
            const toX = x + Math.cos(arc) * circle.r;
            const toY = y + Math.sin(arc) * circle.r;
            dashLineTo(context, fromX, fromY, toX, toY);
        }
    }
    else {
        context.moveTo(x + circle.r, y);
        context.arc(x, y, circle.r, 0, Math.PI * 2);
    }
}
exports.drawCircle = drawCircle;
//# sourceMappingURL=draw-utils.js.map