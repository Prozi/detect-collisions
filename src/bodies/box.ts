import { BodyGroup, BodyOptions, BodyType, PotentialVector } from "../model";

import { Polygon } from "./polygon";
import { createBox } from "../utils";

/**
 * collider - box
 */
export class Box extends Polygon {
  /**
   * type of body
   */
  readonly type: BodyType.Box | BodyType.Point = BodyType.Box;

  /**
   * faster than type
   */
  readonly typeGroup: BodyGroup.Box | BodyGroup.Point = BodyGroup.Box;

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
    this.afterUpdateSize();
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
    this.afterUpdateSize();
  }

  /**
   * after setting width/height update translate
   * see https://github.com/Prozi/detect-collisions/issues/70
   */
  protected afterUpdateSize(): void {
    if (this.isCentered) {
      this.retranslate(false);
    }

    this.setPoints(createBox(this._width, this._height));

    if (this.isCentered) {
      this.retranslate();
    }
  }

  /**
   * do not attempt to use Polygon.updateIsConvex()
   */
  protected updateIsConvex(): void {
    return;
  }
}
