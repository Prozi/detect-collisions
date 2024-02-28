declare module "poly-decomp" {
  type Point = [number, number];
  type Polygon = Point[];

  export function isSimple(polygon: Polygon): boolean;
  export function makeCCW(polygon: Polygon): boolean;
  export function quickDecomp(polygon: Polygon): Polygon[];
  export function decomp(polygon: Polygon): Polygon[];
  export function removeCollinearPoints(
    polygon: Polygon,
    thresholdAngle: number,
  ): number;
  export function removeDuplicatePoints(
    polygon: Polygon,
    precision: number,
  ): void;
}

declare module "random-seed" {
  export function create(name: string): { random(): number };
}

declare module "pixi-shim";
