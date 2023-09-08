import { BodyOptions, PotentialVector, BodyType } from "../model";
import { createBox } from "../utils";
import { Polygon } from "./polygon";

/**
 * collider - box
 */
export class Box extends Polygon {
  /**
   * type of body
   */
  readonly type: BodyType.Box | BodyType.Point = BodyType.Box;

  /**
   * boxes are convex
   */
  readonly isConvex = true;

  /**
   * inner width
   */
  protected _width: number;

  /**
   * inner height
   */
  protected _height: number;

  /**
   * collider - box
   */
  constructor(
    position: PotentialVector,
    width: number,
    height: number,
    options?: BodyOptions,
  ) {
    super(position, createBox(width, height), options);

    this._width = width;
    this._height = height;
  }

  /**
   * get box width
   */
  get width(): number {
    return this._width;
  }

  /**
   * set box width, update points
   */
  set width(width: number) {
    this._width = width;

    this.setPoints(createBox(this._width, this._height));
  }

  /**
   * get box height
   */
  get height(): number {
    return this._height;
  }

  /**
   * set box height, update points
   */
  set height(height: number) {
    this._height = height;

    this.setPoints(createBox(this._width, this._height));
  }

  /**
   * do not attempt to use Polygon.updateIsConvex()
   */
  protected updateIsConvex(): void {
    return;
  }
}
