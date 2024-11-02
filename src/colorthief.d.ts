declare module "colorthief" {
  export default class ColorThief {
    getColor(img: HTMLImageElement | ImageBitmap): [number, number, number];
    getPalette(
      img: HTMLImageElement | ImageBitmap,
      colorCount?: number
    ): [number, number, number][];
  }
}
