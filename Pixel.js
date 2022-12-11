class Pixel {
  constructor(r, g, b) {
    this.r = r;
    this.g = g;
    this.b = b;
  }

  setColor({ r, g, b }) {
    if (r !== undefined) this.r = r;
    if (g !== undefined) this.g = g;
    if (b !== undefined) this.b = b;
  }

  getColor() {
    return { r: this.r, g: this.g, b: this.b };
  }
}
