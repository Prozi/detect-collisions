import { Box } from "./box";
import { Types } from "../model";
import { ensureVectorPoint } from "../utils";
/**
 * collider - point (very tiny box)
 */
export class Point extends Box {
    /**
     * collider - point (very tiny box)
     * @param {Vector} position {x, y}
     */
    constructor(position) {
        super(ensureVectorPoint(position), 0.1, 0.1);
        this.type = Types.Point;
    }
}
