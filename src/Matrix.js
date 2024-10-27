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
        const indexOffset = 10;
        const gap = 1;
        // render col indexes
        for(let j = 0; j < this.cols; j++) {
            const x = this.x + j * (this.data[0][j].width + (gap / 2));
            const y = this.y - (this.data[0][0].height / 2 ) - indexOffset;
            this.ctx.fillStyle = "#888";
            this.ctx.font = "14px Arial";
            this.ctx.textAlign = "center";
            this.ctx.textBaseline = "middle";
            this.ctx.fillText(j.toString(), x, y);
        }
        // render row indexes
        for (let i = 0; i < this.rows; i++) {
            const x = this.x - (this.data[0][0].width / 2 ) - indexOffset;
            const y = this.y + i * (this.data[i][0].height + (gap / 2));
            this.ctx.fillStyle = "#888";
            this.ctx.font = "14px Arial";
            this.ctx.textAlign = "center";
            this.ctx.textBaseline = "middle";
            this.ctx.fillText(i.toString(), x, y);
        }

        for(let i = 0; i < this.data.length; i++){
            for (let j = 0; j < this.data[i].length; j++){
                this.data[i][j].ctx = this.ctx;
                const element = this.data[i][j];
                element.x = this.x + j * (element.width + gap);
                element.y = this.y + i * (element.height + gap);
                element.render();
            }
        }

        const centerX = this.x + (this.cols - 1) * (this.data[0][0].width + gap) / 2;
        const bottomY = this.y + this.rows * (this.data[0][0].height + gap) - (this.data[0][0].height / 5);
        this.ctx.fillStyle = "#888";
        this.ctx.font = "14px Arial";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.fillText(this.name, centerX, bottomY);

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
                const value = (values[i] && values[i][j] !== undefined) ? values[i][j] : 0;
                const matrixElement = new matrixvis.MatrixElement(elementName, value, this.changeable);
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