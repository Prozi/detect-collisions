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
         * was the polygon modified and needs update in the next checkCollision
         */
        this.dirty = false;
        /*
         * circles are convex
         */
        this.isConvex = true;
        /**
         * circle type
         */
        this.type = model_1.BodyType.Circle;
        /**
         * always centered
         */
        this.isCentered = true;
        (0, utils_1.extendBody)(this, options);
        this.unscaledRadius = radius;
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
        this.pos.x = x;
        this.dirty = true;
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
        this.pos.y = y;
        this.dirty = true;
    }
    /**
     * allow get scale
     */
    get scale() {
        return this.r / this.unscaledRadius;
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
    setPosition(x, y, update = true) {
        this.pos.x = x;
        this.pos.y = y;
        this.dirty = true;
        if (update) {
            this.updateBody();
        }
        return this;
    }
    /**
     * update scale
     */
    setScale(scaleX, _scaleY = scaleX, update = true) {
        this.r = this.unscaledRadius * Math.abs(scaleX);
        this.dirty = true;
        if (update) {
            this.updateBody();
        }
        return this;
    }
    /**
     * set rotation
     */
    setAngle(angle, update = true) {
        this.angle = angle;
        const { x, y } = this.getOffsetWithAngle();
        this.offset.x = x;
        this.offset.y = y;
        this.dirty = true;
        if (update) {
            this.updateBody();
        }
        return this;
    }
    /**
     * set offset from center
     */
    setOffset(offset, update = true) {
        this.offsetCopy.x = offset.x;
        this.offsetCopy.y = offset.y;
        const { x, y } = this.getOffsetWithAngle();
        this.offset.x = x;
        this.offset.y = y;
        this.dirty = true;
        if (update) {
            this.updateBody();
        }
        return this;
    }
    /**
     * get body bounding box, without padding
     */
    getAABBAsBBox() {
        const x = this.pos.x + this.offset.x;
        const y = this.pos.y + this.offset.y;
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
        const x = this.pos.x + this.offset.x;
        const y = this.pos.y + this.offset.y;
        const r = Math.abs(this.r);
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
            context.moveTo(x + r, y);
            context.arc(x, y, r, 0, Math.PI * 2);
        }
    }
    /**
     * Draws Bounding Box on canvas context
     */
    drawBVH(context) {
        (0, utils_1.drawBVH)(context, this);
    }
    /**
     * inner function for after position change update aabb in system
     */
    updateBody(update = this.dirty) {
        var _a;
        if (update) {
            (_a = this.system) === null || _a === void 0 ? void 0 : _a.insert(this);
            this.dirty = false;
        }
    }
    /**
     * update instantly or mark as dirty
     */
    markAsDirty(update) {
        if (update) {
            this.updateBody(true);
        }
        else {
            this.dirty = true;
        }
    }
    /**
     * internal for getting offset with applied angle
     */
    getOffsetWithAngle() {
        if ((!this.offsetCopy.x && !this.offsetCopy.y) || !this.angle) {
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
