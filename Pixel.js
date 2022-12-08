export default class Pixel {
  constructor(r, g, b) {
    this.r = r;
    this.g = g;
    this.b = b;
  }

  setColor({ r, g, b }) {
    if (r) this.r = r;
    if (g) this.g = g;
    if (b) this.b = b;
  }

  getColor(){
    return {r: this.r, g: this.g, b: this.b}
  }
}
