import { BodyGroup, BodyOptions, BodyType, PotentialVector } from '../model'

import { Polygon } from './polygon'
import { createEllipse } from '../utils'

export interface EllipseConstructor<TEllipse extends Ellipse> {
  new (
    position: PotentialVector,
    radiusX: number,
    radiusY?: number,
    step?: number,
    options?: BodyOptions
  ): TEllipse
}

/**
 * collider - ellipse
 */
export class Ellipse<UserDataType = any> extends Polygon<UserDataType> {
  /**
   * ellipse type
   */
  readonly type: BodyType.Ellipse = BodyType.Ellipse

  /**
   * faster than type
   */
  readonly typeGroup: BodyGroup.Ellipse = BodyGroup.Ellipse

  /**
   * ellipses are convex
   */
  readonly isConvex = true

  /**
   * inner initial params save
   */
  protected _radiusX: number
  protected _radiusY: number
  protected _step: number

  /**
   * collider - ellipse
   */
  constructor(
    position: PotentialVector,
    radiusX: number,
    radiusY: number = radiusX,
    step: number = (radiusX + radiusY) / Math.PI,
    options?: BodyOptions<UserDataType>
  ) {
    super(position, createEllipse(radiusX, radiusY, step), options)

    this._radiusX = radiusX
    this._radiusY = radiusY
    this._step = step
  }

  /**
   * flag to set is body centered
   */
  set isCentered(_isCentered: boolean) {}

  /**
   * is body centered?
   */
  get isCentered(): boolean {
    return true
  }

  /**
   * get ellipse step number
   */
  get step(): number {
    return this._step
  }

  /**
   * set ellipse step number
   */
  set step(step: number) {
    this._step = step
    this.setPoints(createEllipse(this._radiusX, this._radiusY, this._step))
  }

  /**
   * get ellipse radiusX
   */
  get radiusX(): number {
    return this._radiusX
  }

  /**
   * set ellipse radiusX, update points
   */
  set radiusX(radiusX: number) {
    this._radiusX = radiusX
    this.setPoints(createEllipse(this._radiusX, this._radiusY, this._step))
  }

  /**
   * get ellipse radiusY
   */
  get radiusY(): number {
    return this._radiusY
  }

  /**
   * set ellipse radiusY, update points
   */
  set radiusY(radiusY: number) {
    this._radiusY = radiusY
    this.setPoints(createEllipse(this._radiusX, this._radiusY, this._step))
  }

  /**
   * do not attempt to use Polygon.center()
   */
  center(): void {
    return
  }

  /**
   * do not attempt to use Polygon.updateConvex()
   */
  protected updateConvex(): void {
    return
  }
}
