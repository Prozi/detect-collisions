import { Circle } from "../bodies/circle";
import { Line } from "../bodies/line";
import { Polygon } from "../bodies/polygon";
import { RaycastResult, Vector, Body } from "../model";
import { System } from "../system";
export declare function intersectLineCircle(line: Line, circle: Circle): Vector[];
export declare function intersectLineLine(line1: Line, line2: Line): Vector | null;
/**
 * check if line (ray) intersects polygon
 */
export declare function intersectLinePolygon(line: Line, polygon: Polygon): Vector[];
/**
 * raycast to get collider of ray from start to end
 */
export declare function raycast(system: System, start: Vector, end: Vector, allowCollider?: (testCollider: Body) => boolean): RaycastResult;
//# sourceMappingURL=raycast-utils.d.ts.map