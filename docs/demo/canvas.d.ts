export class TestCanvas {
  constructor(test: any);
  test: any;
  element: HTMLDivElement;
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D | null;
  bvhCheckbox: Element | null;
  fps: number;
  frame: number;
  started: number;
  update(): void;
}
export function loop(callback: any): void;
export const width: number;
export const height: number;
