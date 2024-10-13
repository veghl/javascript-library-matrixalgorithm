import {Data} from "./Data.js";

export class MatrixElement extends Data{
    constructor(value, x, y, size) {
        super();
        this.value = value;
        this.x = x;
        this.y = y;
    }

    updateValue(newValue) {
        this.value = newValue;
    }
}