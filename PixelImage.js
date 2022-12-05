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
    #rawData = null;
    #rawDataAlpha = null;
    constructor(rawData) {
        this.parseRawData(rawData)
    }

    parseRawData(rawTextData) {
        // split the string at white space, and remove white space
        const data = rawTextData.split(/\s+/)
        const { WIDTH_IDX, HEIGHT_IDX, MAX_COLOR_IDX } = PixelImage;
        try {
            if(data[0] !== PixelImage.PPM_TYPE) throw new Error('Invalid type')
            /**
             * @type {[]}
             */
            // keep only numbers in the array
            const cleanData = data.filter((string) => this.#onlyContainsDigits(string))
            this.#width = parseInt(cleanData[WIDTH_IDX]);
            this.#height = parseInt(cleanData[HEIGHT_IDX]);
            this.#maxColorVal = parseInt(cleanData[MAX_COLOR_IDX]);

            console.log({WIDTH: this.#width, HEIGHT: this.#height})
            if(this.#areMembersInvalid()) throw new Error("Missing critical file information!")
            cleanData.splice(0, 3);
            console.log(cleanData)
            this.#setRows(cleanData)

            console.log(this.#rows)
            console.log(this.#rawData)

        } catch (e) {
            throw e;
        }
        
    }

    #setRows(data){
            this.#rawData = data.map((numberStr) => parseInt(numberStr))
            this.#rawDataAlpha = new Uint8ClampedArray(this.#rawData.reduce((accumulator, current, index) => {
                // push a value of 1 every 3 iterations including the last one
                if(index !== 0 && index % 3 === 0) accumulator.push(1)
                accumulator.push(current)
                if(this.#rawData.length - 1 === index) accumulator.push(1);
                return accumulator;
            }, []))
            console.log(this.#rawDataAlpha)
            let counter = 0;
            let currentPixelIndex = 0;
            let pixelArray = new PixelArray()
            while (counter < this.#rawData.length){
                // skip pushing an array the first time
                if(counter !== 0 && counter % this.#width === 0){
                    this.#rows.push(pixelArray)
                    currentPixelIndex = 0;
                }
                const R = this.#rawData[counter++];
                const G = this.#rawData[counter++];
                const B = this.#rawData[counter++];
                pixelArray.update(currentPixelIndex++, new Pixel(R, G, B));
            }
            this.#rows.push(pixelArray)

    }

    #onlyContainsDigits = (string) => /^\d+$/.test(string);

    #areMembersInvalid = () =>  isNaN(this.#width) || isNaN(this.#height) || isNaN(this.#maxColorVal)
}