import PixelArray from "./PixelArray.js";
import Pixel from "./Pixel.js";

export default class PixelImage {
    static PPM_TYPE = "P3";
    #width = null;
    #height = null;
    #maxColorVal = null;
    #rows = [];
    constructor(rawData) {
        this.parseRawData(rawData)
    }

    parseRawData(rawData) {
        console.log(rawData)
        try {
            if(rawData[0] !== PixelImage.PPM_TYPE) throw new Error('Invalid type')
            const cleanData = rawData.filter((string) => this.#onlyContainsDigits(string))
            this.#width = parseInt(cleanData[0]);
            this.#height = parseInt(cleanData[1]);
            this.#maxColorVal = parseInt(cleanData[2]);

            if(this.#width === null || this.#height === null || this.#maxColorVal === null){
                throw new Error("Missing critical file information!")
            }

            for(let i = 3; i < rawData.length; i += this.#width * 3){

                const pixelArray = new PixelArray();
                for(let j = i; j < this.#width; j += 3){
                    const r = parseInt(rawData[j]);
                    const g = parseInt(rawData[j + 1]);
                    const b = parseInt(rawData[j + 2]);
                    pixelArray.push(new Pixel(r, g, b));
                }
                this.#rows.push(pixelArray);
            }

            console.log(this.#rows)
        } catch (e) {
            
        }
        
    }

    #onlyContainsDigits = (string) => /^\d+$/.test(string);
}