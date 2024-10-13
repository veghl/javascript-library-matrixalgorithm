import {Data} from "./Data.js";

export class Matrix extends Data{
    constructor(name, values) {
        super();
        this.name = name;
        this.rows = values.length;
        this.cols = values[0].length;
        this.data = this.createMatrix();
    }

    createMatrix() {
        return Array.from({ length: this.rows }, () => Array(this.cols).fill(0));
    }
}