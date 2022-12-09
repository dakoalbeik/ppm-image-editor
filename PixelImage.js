import PixelArray from "./PixelArray.js";
import Pixel from "./Pixel.js";

export default class PixelImage {
  static PPM_TYPE = "P3";
  static WIDTH_IDX = 0;
  static HEIGHT_IDX = 1;
  static MAX_COLOR_IDX = 2;
  #width = null;
  #height = null;
  #maxColorVal = null;
  #rows = [];

  constructor(rawData) {
    this.parseRawData(rawData);
  }

  parseRawData(rawTextData) {
    // split the string at white space, and remove white space
    const data = rawTextData.split(/\s+/);
    const { WIDTH_IDX, HEIGHT_IDX, MAX_COLOR_IDX } = PixelImage;
    try {
      if (!data.includes(PixelImage.PPM_TYPE)) throw new Error("Invalid type");

      // keep only numbers in the array
      const cleanData = data.filter((string) =>
        this.#onlyContainsDigits(string)
      );
      this.#width = parseInt(cleanData[WIDTH_IDX]);
      this.#height = parseInt(cleanData[HEIGHT_IDX]);
      this.#maxColorVal = parseInt(cleanData[MAX_COLOR_IDX]);

      if (this.#areMembersInvalid())
        throw new Error("Missing critical file information!");
      cleanData.splice(0, 3);
      this.#setRows(cleanData);
    } catch (e) {
      throw e;
    }
  }

  #setRows(data) {
    const pixelList = data.map((numberStr) => parseInt(numberStr));

    let counter = 0;
    let currentPixelIndex = 0;
    let pixelArray = new PixelArray();
    while (counter < pixelList.length) {
      // skip pushing an array the first time
      if (counter !== 0 && (counter / 3) % this.#width === 0) {
        this.#rows.push(pixelArray);
        pixelArray = new PixelArray();
        currentPixelIndex = 0;
      }
      const R = pixelList[counter++];
      const G = pixelList[counter++];
      const B = pixelList[counter++];
      pixelArray.update(currentPixelIndex++, new Pixel(R, G, B));
    }
    this.#rows.push(pixelArray);
  }

  getImageData = () => {
    const ALPHA = 255;
    const pixels = [];
    for (const row of this.#rows) {
      for (const pixel of row.row) {
        pixels.push(pixel.r, pixel.g, pixel.b, ALPHA);
      }
    }
    return new ImageData(
      new Uint8ClampedArray(pixels),
      this.#width,
      this.#height
    );
  };

  getDimensions = () => ({ width: this.#width, height: this.#height });

  #onlyContainsDigits = (string) => /^\d+$/.test(string);

  toString() {
    let string = "";
    string += PixelImage.PPM_TYPE + "\n";
    string += `${this.#width} ${this.#height} ${this.#maxColorVal} `;
    for (const pixelArray of this.#rows) {
      for (const col of pixelArray.row) {
        const { r, g, b } = col;
        string += `${r} ${g} ${b} `;
      }
    }
    return string;
  }

  flipY = () => {
    for (let i = 0; i < this.#rows.length; i++) {
      for (let j = 0; j < Math.floor(this.#width / 2); j++) {
        const { r, g, b } = this.#rows[i].row[j].getColor();
        const {
          r: _r,
          g: _g,
          b: _b,
        } = this.#rows[i].row[this.#width - j - 1].getColor();
        this.#rows[i].row[this.#width - j - 1].setColor({ r, g, b });
        this.#rows[i].row[j].setColor({ r: _r, g: _g, b: _b });
      }
    }
  };

  flipX = () => {
    for (let i = 0; i < Math.floor(this.#rows.length / 2); i++) {
      for (let j = 0; j < this.#width; j++) {
        const { r, g, b } = this.#rows[i].row[j].getColor();
        const {
          r: _r,
          g: _g,
          b: _b,
        } = this.#rows[this.#rows.length - i - 1].row[j].getColor();
        this.#rows[this.#rows.length - i - 1].row[j].setColor({ r, g, b });
        this.#rows[i].row[j].setColor({ r: _r, g: _g, b: _b });
      }
    }
  };

  transpose = () => {
    const pixelArrays = [];
    for (let i = 0; i < this.#width; i++) {
      const pixelArray = new PixelArray();
      for (let j = 0; j < this.#height; j++) {
        const { r, g, b } = this.#rows[j].row[i].getColor();
        const pixel = new Pixel();
        pixel.setColor({ r, g, b });
        pixelArray.push(pixel);
      }
      pixelArrays.push(pixelArray);
    }

    this.#rows = pixelArrays;
    [this.#width, this.#height] = [this.#height, this.#width];
  };

  rotateClockwise90 = () => {
    this.transpose();
    this.flipY();
  };

  rotateCounterClockwise90 = () => {
    this.transpose();
    this.flipX();
  };

  rotate180 = () => {
    this.rotateClockwise90();
    this.rotateClockwise90();
  };

  #areMembersInvalid = () =>
    isNaN(this.#width) || isNaN(this.#height) || isNaN(this.#maxColorVal);
}
