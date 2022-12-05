export default class Pixel {
  constructor(r, g, b) {
    this.r = r;
    this.g = g;
    this.b = b;
  }

  set({ r, g, b }) {
    if (r) this.r = r;
    if (g) this.g = g;
    if (b) this.b = b;
  }
}
