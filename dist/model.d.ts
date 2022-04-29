/// <reference types="sat" />
export { Response } from "sat";
import { Point } from "./bodies/point";
import { Circle } from "./bodies/circle";
import { Box } from "./bodies/box";
import { Polygon } from "./bodies/polygon";
import { System } from "./system";
/**
 * types
 */
export declare enum Types {
    Ellipse = "Ellipse",
    Line = "Line",
    Circle = "Circle",
    Box = "Box",
    Point = "Point",
    Polygon = "Polygon"
}
/**
 * for use of private function of sat.js
 */
export interface GetAABBAsBox {
    getAABBAsBox(): {
        pos: SAT.Vector;
        w: number;
        h: number;
    };
}
/**
 * for use of private function of sat.js
 */
export interface Data {
    data: {
        children: TBody[];
    };
}
/**
 * system.raycast(from, to) result
 */
export declare type RaycastResult = {
    point: Vector;
    collider: TBody;
} | null;
/**
 * potential vector
 */
export interface PotentialVector {
    x?: number;
    y?: number;
}
/**
 * potential vector
 */
export interface Vector {
    x: number;
    y: number;
}
/**
 * generic body union type
 */
export declare type TBody = Point | Circle | Box | Polygon;
/**
 * commonly used
 */
export interface Collider {
    /**
     * type of collider
     */
    readonly type: Types;
    /**
     * is the collider non moving
     */
    isStatic?: boolean;
    /**
     * is the collider a "trigger"
     */
    isTrigger?: boolean;
    /**
     * collisions system reference
     */
    system?: System;
    /**
     * draw the collider
     */
    draw(context: CanvasRenderingContext2D): void;
    /**
     * should be called only by System.updateBody
     */
    updateAABB(): void;
}
//# sourceMappingURL=model.d.ts.map