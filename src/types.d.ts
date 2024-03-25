declare module "random-seed" {
  export function create(name: string): { random(): number };
}

declare module "pixi-shim";
