"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Circle = void 0;
const sat_1 = require("sat");
const model_1 = require("../model");
const utils_1 = require("../utils");
/**
 * collider - circle
 */
class Circle extends sat_1.Circle {
    /**
     * collider - circle
     */
    constructor(position, radius, options) {
        super((0, utils_1.ensureVectorPoint)(position), radius);
        /**
         * offset copy without angle applied
         */
        this.offsetCopy = { x: 0, y: 0 };
        /**
         * bodies are not reinserted during update if their bbox didnt move outside bbox + padding
         */
        this.padding = 0;
        /**
         * for compatibility reasons circle has angle
         */
        this.angle = 0;
        /*
         * circles are convex
         */
        this.isConvex = true;
        /**
         * circles are centered
         */
        this.isCentered = true;
        /**
         * circle type
         */
        this.type = model_1.Types.Circle;
        (0, utils_1.extendBody)(this, options);
        this.radiusBackup = radius;
    }
    /**
     * get this.pos.x
     */
    get x() {
        return this.pos.x;
    }
    /**
     * updating this.pos.x by this.x = x updates AABB
     */
    set x(x) {
        var _a;
        this.pos.x = x;
        (_a = this.system) === null || _a === void 0 ? void 0 : _a.insert(this);
    }
    /**
     * get this.pos.y
     */
    get y() {
        return this.pos.y;
    }
    /**
     * updating this.pos.y by this.y = y updates AABB
     */
    set y(y) {
        var _a;
        this.pos.y = y;
        (_a = this.system) === null || _a === void 0 ? void 0 : _a.insert(this);
    }
    /**
     * allow get scale
     */
    get scale() {
        return this.r / this.radiusBackup;
    }
    /**
     * shorthand for setScale()
     */
    set scale(scale) {
        this.setScale(scale);
    }
    /**
     * scaleX = scale in case of Circles
     */
    get scaleX() {
        return this.scale;
    }
    /**
     * scaleY = scale in case of Circles
     */
    get scaleY() {
        return this.scale;
    }
    /**
     * update position
     */
    setPosition(x, y) {
        var _a;
        this.pos.x = x;
        this.pos.y = y;
        (_a = this.system) === null || _a === void 0 ? void 0 : _a.insert(this);
    }
    /**
     * update scale
     */
    setScale(scale, _ignoredParameter) {
        this.r = this.radiusBackup * scale;
    }
    /**
     * set rotation
     */
    setAngle(angle) {
        this.angle = angle;
        const { x, y } = this.getOffsetWithAngle();
        this.offset.x = x;
        this.offset.y = y;
        return this;
    }
    /**
     * set offset from center
     */
    setOffset(offset) {
        this.offsetCopy.x = offset.x;
        this.offsetCopy.y = offset.y;
        const { x, y } = this.getOffsetWithAngle();
        this.offset.x = x;
        this.offset.y = y;
        return this;
    }
    /**
     * get body bounding box, without padding
     */
    getAABBAsBBox() {
        const x = this.x + this.offset.x;
        const y = this.y + this.offset.y;
        return {
            minX: x - this.r,
            maxX: x + this.r,
            minY: y - this.r,
            maxY: y + this.r,
        };
    }
    /**
     * Draws collider on a CanvasRenderingContext2D's current path
     */
    draw(context) {
        const x = this.x + this.offset.x;
        const y = this.y + this.offset.y;
        if (this.isTrigger) {
            const max = Math.max(8, this.r);
            for (let i = 0; i < max; i++) {
                const arc = (i / max) * 2 * Math.PI;
                const arcPrev = ((i - 1) / max) * 2 * Math.PI;
                const fromX = x + Math.cos(arcPrev) * this.r;
                const fromY = y + Math.sin(arcPrev) * this.r;
                const toX = x + Math.cos(arc) * this.r;
                const toY = y + Math.sin(arc) * this.r;
                (0, utils_1.dashLineTo)(context, fromX, fromY, toX, toY);
            }
        }
        else {
            context.moveTo(x + this.r, y);
            context.arc(x, y, this.r, 0, Math.PI * 2);
        }
    }
    /**
     * for compatility reasons, does nothing
     */
    center() {
        return;
    }
    /**
     * internal for getting offset with applied angle
     */
    getOffsetWithAngle() {
        if (!this.angle) {
            return this.offsetCopy;
        }
        const sin = Math.sin(this.angle);
        const cos = Math.cos(this.angle);
        const x = this.offsetCopy.x * cos - this.offsetCopy.y * sin;
        const y = this.offsetCopy.x * sin + this.offsetCopy.y * cos;
        return { x, y };
    }
}
exports.Circle = Circle;
//# sourceMappingURL=circle.js.map