export default class PixelArray {
  constructor(row = []) {
    this.row = row;
  }

  getLength(){
    return this.row.length;
  }

  push(pixel) {
    this.row.push(pixel);
  }

  update(index, value) {
    this.row[index] = value;
  }
}
