class PixelArray {
  constructor(row = []) {
    this.row = row;
  }

  push(pixel) {
    this.row.push(pixel);
  }

  update(index, value) {
    this.row[index] = value;
  }
}
