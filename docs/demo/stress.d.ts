export = Stress;
declare class Stress {
  constructor(count?: number);
  physics: System<import("..").Body>;
  bodies: any[];
  polygons: number;
  boxes: number;
  circles: number;
  ellipses: number;
  lines: number;
  lastVariant: number;
  count: number;
  bounds: import("..").Box[];
  legend: string;
  lastTime: number;
  updateBody(body: any): void;
  start: () => void;
  update(): void;
  timeScale: number | undefined;
  bounceBody(body: any): void;
  createShape(large: any, size: any): void;
}
import { System } from "../system";
