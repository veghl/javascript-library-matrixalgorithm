import {MatrixData} from "./MatrixData.js";
import {matrixvis} from "./index.js";

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
        this.showIndexes = true;

        this.data = this.createMatrix(values);
        console.log(this.data);

    }

    createMatrix(values) {
        const matrix = [];
        for (let i = 0; i < this.rows; i++){
            const row = [];
            for (let j = 0; j < this.cols; j++){
                const elementName = `${this.name}[${i}][${j}]`;
                const matrixElement = new matrixvis.MatrixElement(elementName, values[i][j], this.changeable);
                row.push(matrixElement);
            }
            matrix.push(row);
        }
        return matrix;
    }


    render(ctx) {

    }


    setSize(width, height) {

    }
}