import { BodyOptions, Types, PotentialVector } from "../model";
import { createEllipse } from "../utils";
import { Polygon } from "./polygon";

/**
 * collider - ellipse
 */
export class Ellipse extends Polygon {
  readonly type: Types.Ellipse = Types.Ellipse;

  isConvex = true;

  private _radiusX: number;
  private _radiusY: number;
  private _step: number;

  /**
   * collider - ellipse
   * @param {PotentialVector} position {x, y}
   * @param {number} radiusX
   * @param {number} radiusY defaults to radiusX
   * @param {number} step precision division >= 1px
   */
  constructor(
    position: PotentialVector,
    radiusX: number,
    radiusY: number = radiusX,
    step: number = (radiusX + radiusY) / Math.PI,
    options?: BodyOptions
  ) {
    super(position, createEllipse(radiusX, radiusY, step), options);

    this._radiusX = radiusX;
    this._radiusY = radiusY;
    this._step = step;
  }

  /**
   * get ellipse step number
   */
  get step(): number {
    return this._step;
  }

  /**
   * set ellipse step number
   */
  set step(step: number) {
    this._step = step;
    this.setPoints(createEllipse(this._radiusX, this._radiusY, this._step));
  }

  /**
   * get ellipse radiusX
   */
  get radiusX(): number {
    return this._radiusX;
  }

  /**
   * set ellipse radiusX, update points
   */
  set radiusX(radiusX: number) {
    this._radiusX = radiusX;
    this.setPoints(createEllipse(this._radiusX, this._radiusY, this._step));
  }

  /**
   * get ellipse radiusY
   */
  get radiusY(): number {
    return this._radiusY;
  }

  /**
   * set ellipse radiusY, update points
   */
  set radiusY(radiusY: number) {
    this._radiusY = radiusY;
    this.setPoints(createEllipse(this._radiusX, this._radiusY, this._step));
  }

  /**
   * do not attempt to use Polygon.center()
   */
  center(): void {}

  /**
   * do not attempt to use Polygon.updateIsConvex()
   */
  protected updateIsConvex(): void {}
}
