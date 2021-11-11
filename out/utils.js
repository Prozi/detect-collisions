import SAT from "sat";
/**
 * creates box polygon points
 * @param {number} width
 * @param {number} height
 * @returns SAT.Vector
 */
export function createBox(width, height) {
    return [
        new SAT.Vector(),
        new SAT.Vector(width, 0),
        new SAT.Vector(width, height),
        new SAT.Vector(0, height),
    ];
}
/**
 * ensure returns a SAT.Vector
 * @param {SAT.Vector} point
 */
export function ensureVectorPoint(point) {
    return point instanceof SAT.Vector ? point : new SAT.Vector(point.x, point.y);
}
/**
 * ensure correct counterclockwise points
 * @param {SAT.Vector[]} points
 */
export function ensurePolygonPoints(points) {
    return (clockwise(points) ? points.reverse() : points).map(ensureVectorPoint);
}
/**
 * check direction of polygon
 * @param {SAT.Vector[]} points
 */
export function clockwise(points) {
    let sum = 0;
    for (let i = 0; i < points.length; i++) {
        const v1 = points[i];
        const v2 = points[(i + 1) % points.length];
        sum += (v2.x - v1.x) * (v2.y + v1.y);
    }
    return sum > 0;
}
