export default class PixelArray {
    constructor(row = []) {
        this.row = row;
    }

    push(pixel){
        this.row.push(pixel)
    }
}