declare module "poly-decomp" {
  function quickDecomp(points: number[][]): number[][][];
  function decomp(points: number[][]): number[][][];
  function isSimple(points: number[][]): boolean;
}
