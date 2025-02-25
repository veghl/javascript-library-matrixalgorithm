import {MatrixData} from "./MatrixData.js";
import {matrixvis} from "./index.js";

export class Matrix extends MatrixData {
    constructor(name, values , changeable) {
        super();
        if (typeof changeable === "undefined") {
            changeable = false;
        }
        this.name = name;
        this.minValue = -99;
        this.maxValue = 100;
        this.rows = values.length;
        this.cols = values[0].length;
        this.changeable = changeable;

        this.showIndexes = true;
        this.rowIndexes = {};
        this.colIndexes = {};
        this.rowLoopMarkers = {};
        this.colLoopMarkers = {};
        this.indexesPos = 0;
        this.indexStrokeC = '#000';
        this.indexFillC = '#FFF';


        this.elements = this.createMatrix(values);
    }

    render() {
        const indexOffset = 10;
        const gap = 1;
        // render col indexes
        for(let j = 0; j < this.cols; j++) {
            const x = this.x + j * (this.elements[0][j].width + (gap / 2));
            const y = this.y - (this.elements[0][0].height / 2 ) - indexOffset;
            this.ctx.fillStyle = "#888";
            this.ctx.font = "14px Arial";
            this.ctx.textAlign = "center";
            this.ctx.textBaseline = "middle";
            this.ctx.fillText(j.toString(), x, y);
        }
        // render row indexes
        for (let i = 0; i < this.rows; i++) {
            const x = this.x - (this.elements[0][0].width / 2 ) - indexOffset;
            const y = this.y + i * (this.elements[i][0].height + (gap / 2));
            this.ctx.fillStyle = "#888";
            this.ctx.font = "14px Arial";
            this.ctx.textAlign = "center";
            this.ctx.textBaseline = "middle";
            this.ctx.fillText(i.toString(), x, y);
        }

        //render elements
        for(let i = 0; i < this.elements.length; i++){
            for (let j = 0; j < this.elements[i].length; j++){
                this.elements[i][j].ctx = this.ctx;
                const element = this.elements[i][j];
                element.x = this.x + j * (element.width + gap);
                element.y = this.y + i * (element.height + gap);
                element.render();
            }
        }

        for (let j = -1; j <= this.elements[0].length; j++) {
            let maxIndexPos = -1;
            let fixIndexPos = [];
            for (let name in this.colIndexes){
                if(this.colIndexes[name].value === j && this.colIndexes[name].position >= 0){
                    fixIndexPos = fixIndexPos.concat([this.colIndexes[name].position]);
                }
            }
            let indexNames = [];
            for (const name in this.colIndexes){
                indexNames = indexNames.concat([name]);
            }
            indexNames.sort();
            for (let n = 0; n < indexNames.length; n++) {
                if(this.colIndexes[indexNames[n]].value === j){
                    let indexPos = this.indexesPos;
                    if (this.colIndexes[indexNames[n]].position >= 0){
                        indexPos = indexPos + 30 * this.colIndexes[indexNames[n]].position;
                    } else {
                        let k = 0;
                        while (fixIndexPos.indexOf(k) > -1){
                            k++
                        }
                        fixIndexPos = fixIndexPos.concat([k]);
                        indexPos = fixIndexPos + 27 * k;
                    }
                    this.ctx.strokeStyle = this.indexStrokeC;
                    this.ctx.fillStyle = this.indexFillC;
                    this.ctx.beginPath();
                    if(j >= 0 && j < this.elements[0].length ){
                        this.ctx.arc(this.elements[0][j].x, this.elements[0][0].y - this.elements[0][0].height - (this.elements[0][0].height * 0.3) - indexPos - 3, 11.5,0,2 * Math.PI);
                    } else if (j === -1){
                        this.ctx.arc(this.elements[0][0].x - this.elements[0][0].width - 2,this.elements[0][0].y - this.elements[0][0].height - (this.elements[0][0].height * 0.3) - indexPos - 3, 11.5, 0, 2 * Math.PI);
                    } else {
                        this.ctx.arc(this.elements[0][this.elements[0].length - 1].x + this.elements[0][0].width + 2, this.elements[0][0].y - this.elements[0][0].height - (this.elements[0][0].height * 0.3) - indexPos - 3, 11.5, 0, 2 * Math.PI)
                    }
                    if (indexPos > maxIndexPos) {
                        maxIndexPos = indexPos;
                    }
                    this.ctx.fill();
                    this.ctx.stroke();
                    this.ctx.fillStyle = this.indexStrokeC;
                    this.ctx.font = "bold 12px Courier New";
                    this.ctx.textAlign = "center";
                    this.ctx.textBaseline = "alphabetic"
                    if(j >= 0 && j < this.elements[0].length ){
                        this.ctx.fillText(indexNames[n], this.elements[0][j].x, this.elements[0][0].y - this.elements[0][0].height - this.elements[0][0].height * 0.3 + indexPos);
                    }
                }
            }
        }

        const centerX = this.x + (this.cols - 1) * (this.elements[0][0].width + gap) / 2;
        const bottomY = this.y + this.rows * (this.elements[0][0].height + gap) - (this.elements[0][0].height / 5);
        this.ctx.fillStyle = "#888";
        this.ctx.font = "14px Arial";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.fillText(this.name, centerX, bottomY);
    }

    randomize = (min, max) => {
        for (let i = 0; i < this.elements.length; i++){
            for (let j = 0; j < this.elements[i].length; j++){
                const element = this.elements[i][j];
                element.randomize(min, max);
            }
        }
    }

    setRowIndexes(name, value , position = -1) {
        this.rowIndexes[name] = {"value": value, "position": position};
    }

    setColIndexes(name, value, position = -1) {
        this.colIndexes[name] = {"value": value, "position": position};
    }

    deleteIndexes(name) {
        delete (this.rowIndexes[name]);
        delete (this.colIndexes[name]);
        delete (this.rowLoopMarkers[name]);
        delete (this.colLoopMarkers[name]);
    }

    deleteAllIndexes() {
        this.rowIndexes = {};
        this.colIndexes = {};
        this.rowLoopMarkers = {};
        this.colLoopMarkers = {};
    }

    setRowLoopMarkers(name, from, to, reverse = false) {
        this.rowLoopMarkers[name] = {"from": from, "to": to, "reverse": reverse};
    }

    setColLoopMarkers(name, from, to, reverse = false) {
        this.colLoopMarkers[name] = {"from": from, "to": to, "reverse": reverse};
    }

    deleteLoopMarkers(name) {
        delete this.colLoopMarkers[name];
        delete this.rowLoopMarkers[name];
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

        for(let i = 0; i < this.elements.length; i++){
            for (let j = 0; j < this.elements[i].length; j++){
                const element = this.elements[i][j];
                element.width = width;
                element.height = height;
            }
        }
    }
}