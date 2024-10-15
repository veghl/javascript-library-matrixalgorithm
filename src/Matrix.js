import {MatrixData} from "./MatrixData.js";

export class Matrix extends MatrixData {
    constructor(name, values , changeable) {
        super();
        if (typeof changeable !== "undefined") {
            changeable = false;
        }
        this.name = name;
        this.rows = values.length;
        this.cols = values[0].length;
        this.changeable = changeable;

        this.data = this.createMatrix();

    }

    render(ctx) {

    }

    createMatrix() {
        return Array.from({ length: this.rows }, () => Array(this.cols).fill(0));
    }
}