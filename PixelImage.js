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
        this.parseRawData(rawData)
    }

    parseRawData(rawData) {
        console.log(rawData)
        const {WIDTH_IDX, HEIGHT_IDX, MAX_COLOR_IDX} = PixelImage;
        try {
            if(rawData[0] !== PixelImage.PPM_TYPE) throw new Error('Invalid type')
            // keep only numbers in the array
            const cleanData = rawData.filter((string) => this.#onlyContainsDigits(string))
            this.#width = parseInt(cleanData[WIDTH_IDX]);
            this.#height = parseInt(cleanData[HEIGHT_IDX]);
            this.#maxColorVal = parseInt(cleanData[MAX_COLOR_IDX]);

            console.log(this.#width, this.#height)
            if(this.#areMembersInvalid()) throw new Error("Missing critical file information!")
            cleanData.splice(0, 3);
            console.log(cleanData)
            this.#setRows(cleanData)

            console.log(this.#rows)

        } catch (e) {
            
        }
        
    }

    #setRows(data){
            let counter = 0;
            let currentPixelIndex = 0;
            let pixelArray = new PixelArray()
            while (counter < data.length){
                // skip pushing an array the first time
                if(counter !== 0 && counter % this.#width === 0){
                    this.#rows.push(pixelArray)
                    currentPixelIndex = 0;
                }
                pixelArray.update(currentPixelIndex++, new Pixel(data[counter++], data[counter++], data[counter++]));
            }
            this.#rows.push(pixelArray)

    }

    #onlyContainsDigits = (string) => /^\d+$/.test(string);

    #areMembersInvalid = () => this.#width === null || this.#height === null || this.#maxColorVal === null
}