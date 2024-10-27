import {MatrixData} from "./MatrixData.js";
import {matrixvis} from "./index.js";

export class Matrix extends MatrixData {
    constructor(name, values , changeable) {
        super();
        if (typeof changeable === "undefined") {
            changeable = false;
        }
        this.name = name;
        this.minValue = -999;
        this.maxValue = 1000;
        this.rows = values.length;
        this.cols = values[0].length;
        this.changeable = changeable;
        this.showIndexes = true;

        this.data = this.createMatrix(values);
        console.log(this.data);

    }

    render() {
        for(let i = 0; i < this.data.length; i++){
            for (let j = 0; j < this.data[i].length; j++){
                this.data[i][j].ctx = this.ctx;
                const element = this.data[i][j];
                element.x = this.x + j * (element.width + 1);
                element.y = this.y + i * (element.height + 1);
                element.render();
            }
        }
    }

    randomize (min, max) {
        for (let i = 0; i < this.data.length; i++){
            for (let j = 0; j < this.data[i].length; j++){
                const element = this.data[i][j];
                element.randomize(min, max);
            }
        }
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

    setSize(width, height) {
        const MAX_WIDTH = 50;   // example maximum width
        const MAX_HEIGHT = 50;

        // check if width and height are specified and positive numbers
        if (typeof width !== 'number' || typeof height !== 'number' || width <= 0 || height <= 0) {
            console.warn("Invalid width or height specified. Both must be positive numbers.");
            return;
        }

        if (width > MAX_WIDTH) {
            console.warn(`Width exceeds maximum allowed size of ${MAX_WIDTH}. Setting width to ${MAX_WIDTH}.`);
            width = MAX_WIDTH;
        }
        if (height > MAX_HEIGHT) {
            console.warn(`Height exceeds maximum allowed size of ${MAX_HEIGHT}. Setting height to ${MAX_HEIGHT}.`);
            height = MAX_HEIGHT;
        }

        for(let i = 0; i < this.data.length; i++){
            for (let j = 0; j < this.data[i].length; j++){
                const element = this.data[i][j];
                element.width = width;
                element.height = height;
            }
        }
    }
}