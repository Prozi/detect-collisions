import { Vector } from "./model";
import { Circle } from "./bodies/circle";
import { Polygon } from "./bodies/polygon";
import { Line } from "./bodies/line";
export declare function polygonInCircle(polygon: Polygon, circle: Pick<Circle, "pos" | "r">): boolean;
export declare function pointInPolygon(a: Vector, b: Polygon): boolean;
export declare function polygonInPolygon(a: Polygon, b: Polygon): boolean;
export declare function pointOnCircle(p: Vector, { r, pos }: Pick<Circle, "pos" | "r">): boolean;
export declare function circleInCircle(a: Pick<Circle, "pos" | "r">, b: Pick<Circle, "pos" | "r">): boolean;
export declare function circleInPolygon(circle: Pick<Circle, "pos" | "r">, polygon: Polygon): boolean;
export declare function circleOutsidePolygon(circle: Pick<Circle, "pos" | "r">, polygon: Polygon): boolean;
export declare function intersectLineCircleProposal({ start, end }: Pick<Line, "start" | "end">, { pos, r }: Pick<Circle, "pos" | "r">): boolean;
export declare function intersectLineCircle(line: Pick<Line, "start" | "end">, { pos, r }: Pick<Circle, "pos" | "r">): Vector[];
export declare function intersectLineLine(line1: Pick<Line, "start" | "end">, line2: Pick<Line, "start" | "end">): Vector | null;
/**
 * check if line (ray) intersects polygon
 */
export declare function intersectLinePolygon(line: Line, polygon: Polygon): Vector[];
//# sourceMappingURL=intersect.d.ts.map