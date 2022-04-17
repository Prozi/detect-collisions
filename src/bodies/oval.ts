import { Types, Vector } from "../model";
import { ensureVectorPoint, createOval } from "../utils";
import { Polygon } from "./polygon";

/**
 * collider - oval
 */
export class Oval extends Polygon {
  readonly type: Types.Oval = Types.Oval;

  private _radiusX: number;
  private _radiusY: number;
  private _step: number;

  /**
   * collider - oval
   * @param {Vector} position {x, y}
   * @param {number} radiusX
   * @param {number} radiusY
   */
  constructor(
    position: Vector,
    radiusX: number,
    radiusY: number = radiusX,
    step = 1
  ) {
    super(ensureVectorPoint(position), createOval(radiusX, radiusY, step));

    this._radiusX = radiusX;
    this._radiusY = radiusY;
    this._step = step;
  }

  /**
   * get oval step number
   */
  get step(): number {
    return this._step;
  }

  /**
   * set oval step number
   */
  set step(step: number) {
    this._step = step;

    this.setPoints(createOval(this._radiusX, this._radiusY, this._step));
  }

  /**
   * get oval radiusX
   */
  get radiusX(): number {
    return this._radiusX;
  }

  /**
   * set oval radiusX, update points
   */
  set radiusX(radiusX: number) {
    this._radiusX = radiusX;

    this.setPoints(createOval(this._radiusX, this._radiusY, this._step));
  }

  /**
   * get oval radiusY
   */
  get radiusY(): number {
    return this._radiusY;
  }

  /**
   * set oval radiusY, update points
   */
  set radiusY(radiusY: number) {
    this._radiusY = radiusY;

    this.setPoints(createOval(this._radiusX, this._radiusY, this._step));
  }
}
