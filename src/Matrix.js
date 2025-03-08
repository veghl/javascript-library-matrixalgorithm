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
        this.loopC = "rgba(0, 0, 0, 0.3)"


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

        for(const name in this.rowLoopMarkers){
            if(this.rowIndexes.hasOwnProperty(name)){
                let markerPos = 0;
                if(this.rowIndexes[name].position >= 0){
                    markerPos = this.rowIndexes[name].position;
                } else {
                    let fixIndexPos = [];
                    for (const otherName in this.rowIndexes) {
                        if(this.rowIndexes[name].value === this.rowIndexes[otherName].value && this.rowIndexes[name].position >= 0){
                            fixIndexPos = fixIndexPos.concat([this.rowIndexes[name].position]);
                        }
                    }
                    for (const otherName in this.rowIndexes) {
                        if(this.rowIndexes[name].value === this.rowIndexes[otherName].value && this. rowIndexes[name].position < 0 && name > otherName){
                            while(fixIndexPos.indexOf(markerPos) > -1) {
                                markerPos++;
                            }
                            fixIndexPos = fixIndexPos.concat([markerPos]);
                        }
                    }
                    while (fixIndexPos.indexOf(markerPos) > -1) {
                        markerPos++;
                    }
                }
                let startX, startY;
                if (this.rowLoopMarkers[name].from >=0 && this.rowLoopMarkers[name].from < this.elements.length) {
                    startX = this.elements[0][0].x - this.elements[0][0].width - (this.elements[0][0].width * 0.3) - this.indexesPos - 11.5 - 30  * markerPos;
                    startY = this.elements[this.rowLoopMarkers[name].from][0].y;
                } else if (this.rowLoopMarkers[name].from === -1){
                    startX = this.elements[0][0].x - this.elements[0][0].width - (this.elements[0][0].width * 0.3) - this.indexesPos - 11.5 - 30  * markerPos;
                    startY = this.elements[0][0].y - this.elements[0][0].height - 2;
                } else {
                    startX = this.elements[0][0].x - this.elements[0][0].width - (this.elements[0][0].width * 0.3) - this.indexesPos - 11.5 - 30  * markerPos;
                    startY = this.elements[this.elements.length - 1][0].y + this.elements[0][0].height + 2;
                }

                let targetY;
                if (this.rowLoopMarkers[name].to >= 0 && this.rowLoopMarkers[name].to < this.elements.length) {
                    targetY = this.elements[this.rowLoopMarkers[name].to][0].y;
                } else if (this.rowLoopMarkers[name].to === -1) {
                    targetY = this.elements[0][0].y - this.elements[0][0].height - 2;
                } else {
                    targetY = this.elements[this.elements.length - 1][0].y + this.elements[0][0].height + 2;
                }
                const loopHeight = Math.abs(startY - targetY);
                let isUpwardLoop = this.rowLoopMarkers[name].from > this.rowLoopMarkers[name].to;
                if (this.rowLoopMarkers[name].from === this.rowLoopMarkers[name].to) {
                    isUpwardLoop = this.rowLoopMarkers[name].backward;
                }
                if(isUpwardLoop){
                    startY = targetY;
                }
                console.log(startX, startY);
                this.ctx.strokeStyle = this.indexStrokeC;
                this.ctx.fillStyle = this.indexFillC;
                this.ctx.beginPath();
                this.ctx.rect(startX, startY, 16, loopHeight);
                this.ctx.fill();
                this.ctx.stroke();
                this.ctx.fillStyle = this.loopC;
                const loopChar = isUpwardLoop ? "▲" : "▼";
                const charSpacing = 18;
                let textY = startY + charSpacing / 2;

                while (textY < startY + loopHeight) {
                    this.ctx.fillText(loopChar, startX + 8, textY);
                    textY += charSpacing;
                }
            }
        }

        for (const name in this.colLoopMarkers){
            if(this.colIndexes.hasOwnProperty(name)) {
                let markerPos = 0;
                if(this.colIndexes[name].position >= 0) {
                    markerPos = this.colIndexes[name].position;
                } else {
                    let fixIndexPos = [];
                    for (const otherName in this.colIndexes) {
                        if(this.colIndexes[name].value === this.colIndexes[otherName].value && this.colIndexes[name].position >= 0){
                            fixIndexPos = fixIndexPos.concat([this.colIndexes[otherName].position]);
                        }
                    }
                    for (const otherName in this.colIndexes) {
                        if(this.colIndexes[name].value === this.colIndexes[otherName].value && this.colIndexes[name].position < 0 && name > otherName) {
                            while(fixIndexPos.indexOf(markerPos) > -1) {
                                markerPos++;
                            }
                            fixIndexPos = fixIndexPos.concat([markerPos]);
                        }
                    }
                    while (fixIndexPos.indexOf(markerPos) > -1) {
                        markerPos++;
                    }
                }
                let startX, startY;
                if(this.colLoopMarkers[name].from >= 0 && this.colLoopMarkers[name].from < this.elements[0].length) {
                    startX = this.elements[0][this.colLoopMarkers[name].from].x;
                    startY = this.elements[0][0].y - this.elements[0][0].height - (this.elements[0][0].height * 0.3) - this.indexesPos - 11.5 - 30  * markerPos ;
                } else if (this.colLoopMarkers[name].from === -1){
                    startX = this.elements[0][0].x - this.elements[0][0].width - 2;
                    startY = this.elements[0][0].y - this.elements[0][0].height - (this.elements[0][0].height * 0.3) - this.indexesPos - 11.5 - 30  * markerPos ;
                } else {
                    startX = this.elements[0][this.elements[0].length - 1].x + this.elements[0][0].width + 2;
                    startY = this.elements[0][0].y - this.elements[0][0].height - (this.elements[0][0].height * 0.3) - this.indexesPos - 11.5 - 30  * markerPos ;
                }

                let targetX;
                if(this.colLoopMarkers[name].to >= 0 && this.colLoopMarkers[name].to < this.elements[0].length) {
                    targetX = this.elements[0][this.colLoopMarkers[name].to].x;
                } else if (this.colLoopMarkers[name].to === -1){
                    targetX = this.elements[0][0].x - this.elements[0][0].width - 2;
                } else {
                    targetX = this.elements[0][this.elements[0].length - 1].x + this.elements[0][0].width + 2;
                }
                const loopWidth = Math.abs(startX - targetX);
                let isBackwardLoop = this.colLoopMarkers[name].from > this.colLoopMarkers[name].to;
                if (this.colLoopMarkers[name].from === this.colLoopMarkers[name].to) {
                    isBackwardLoop = this.colLoopMarkers[name].backward;
                }
                if (isBackwardLoop){
                    startX = targetX;
                }
                this.ctx.strokeStyle = this.indexStrokeC;
                this.ctx.fillStyle = this.indexFillC;
                this.ctx.beginPath();
                this.ctx.rect(startX, startY, loopWidth, 16);
                this.ctx.fill();
                this.ctx.stroke();
                this.ctx.fillStyle = this.loopC;
                let loopText = "►";
                if(isBackwardLoop){
                    loopText = "◄"
                }
                while(this.ctx.measureText(loopText + " >").width < loopWidth){
                    if(!isBackwardLoop){
                        loopText = loopText + " ►";
                    } else {
                        loopText = loopText + " ◄";
                    }
                }
                this.ctx.fillText(loopText, startX + loopWidth/2, startY + 7.5);
            }
        }

        for (const name in this.rowLoopMarkers){
            if (this.rowLoopMarkers.hasOwnProperty(name)) {
                let markerPos = 0;
                if(this.rowIndexes[name].position >= 0) {
                    markerPos = this.rowIndexes[name].position;
                } else {

                }
            }
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

        for (let i = -1; i <= this.elements.length; i++){
            let maxOffset = -1;
            let fixIndexPos = [];
            for (const name in this.rowIndexes){
                if(this.rowIndexes[name].value === i && this.rowIndexes[name].position >= 0) {
                    fixIndexPos = fixIndexPos.concat([this.rowIndexes[name].position]);
                }
            }
            let indexNames = Object.keys(this.rowIndexes).sort();
            for (let n = 0; n < indexNames.length; n++) {
                if(this.rowIndexes[indexNames[n]].value === i){
                    let currentOffset = this.indexesPos;
                    if(this.rowIndexes[indexNames[n]].position >= 0){
                        currentOffset = currentOffset + 30 * this.rowIndexes[indexNames[n]].position;
                    } else {
                        let availablePos = 0;
                        while (fixIndexPos.indexOf(availablePos) > -1){
                            availablePos++;
                        }
                        fixIndexPos = fixIndexPos.concat([availablePos]);
                        currentOffset = this.indexesPos + 30 * availablePos;
                    }
                    this.ctx.strokeStyle = this.indexStrokeC;
                    this.ctx.fillStyle = this.indexFillC;
                    this.ctx.beginPath();
                    if (i >= 0 && i < this.elements.length ){
                        this.ctx.arc(this.elements[0][0].x - this.elements[0][0].width - (this.elements[0][0].height * 0.3) - currentOffset - 3, this.elements[i][0].y, 11.5, 0, 2 * Math.PI);
                    } else if (i === -1) {
                        this.ctx.arc(this.elements[0][0].x - this.elements[0][0].width - (this.elements[0][0].height * 0.3) - currentOffset - 3, this.elements[0][0].y - this.elements[0][0].height, 11.5, 0, 2 * Math.PI);
                    } else {
                        this.ctx.arc(this.elements[0][0].x - this.elements[0][0].width - (this.elements[0][0].height * 0.3) - currentOffset - 3, this.elements[this.elements.length - 1][0].y + this.elements[0][0].height, 11.5, 0, 2 * Math.PI);
                    }
                    if (currentOffset > maxOffset) {
                        maxOffset = currentOffset;
                    }
                    this.ctx.fill();
                    this.ctx.stroke();
                    this.ctx.fillStyle = this.indexStrokeC;
                    this.ctx.font = "bold 12px Courier New";
                    this.ctx.textAlign = "center";
                    this.ctx.textBaseline = "alphabetic"
                    if (i >= 0 && i < this.elements.length){
                        this.ctx.fillText(indexNames[n], this.elements[0][0].x - this.elements[0][0].width - (this.elements[0][0].height * 0.3) - currentOffset - 3, this.elements[i][0].y + 3);
                    } else if (i === -1) {
                        this.ctx.fillText(indexNames[n], this.elements[0][0].x - this.elements[0][0].width - (this.elements[0][0].height * 0.3) - currentOffset - 3, this.elements[0][0].y - this.elements[0][0].height + 3);
                    } else {
                        this.ctx.fillText(indexNames[n], this.elements[0][0].x - this.elements[0][0].width - (this.elements[0][0].height * 0.3) - currentOffset - 3, this.elements[this.elements.length - 1][0].y + this.elements[0][0].height + 3);
                    }
                }
            }

        }

        for (let j = -1; j <= this.elements[0].length; j++) {
            let maxOffset = -1;
            let fixIndexPos = [];
            for (const name in this.colIndexes){
                if(this.colIndexes[name].value === j && this.colIndexes[name].position >= 0){
                    fixIndexPos = fixIndexPos.concat([this.colIndexes[name].position]);
                }
            }
            let indexNames = Object.keys(this.colIndexes).sort();

            for (let n = 0; n < indexNames.length; n++) {
                if(this.colIndexes[indexNames[n]].value === j){
                    let currentOffset = this.indexesPos;
                    if (this.colIndexes[indexNames[n]].position >= 0){
                        currentOffset = currentOffset + 30 * this.colIndexes[indexNames[n]].position;
                    } else {
                        let availablePos = 0;
                        while (fixIndexPos.indexOf(availablePos) > -1){
                            availablePos++;
                        }
                        fixIndexPos = fixIndexPos.concat([availablePos]);
                        currentOffset = this.indexesPos + 30 * availablePos;
                    }
                    this.ctx.strokeStyle = this.indexStrokeC;
                    this.ctx.fillStyle = this.indexFillC;
                    this.ctx.beginPath();
                    if(j >= 0 && j < this.elements[0].length ){
                        this.ctx.arc(this.elements[0][j].x, this.elements[0][0].y - this.elements[0][0].height - (this.elements[0][0].height * 0.3) - currentOffset - 3, 11.5,0,2 * Math.PI);
                    } else if (j === -1){
                        this.ctx.arc(this.elements[0][0].x - this.elements[0][0].width - 2,this.elements[0][0].y - this.elements[0][0].height - (this.elements[0][0].height * 0.3) - currentOffset - 3, 11.5, 0, 2 * Math.PI);
                    } else {
                        this.ctx.arc(this.elements[0][this.elements[0].length - 1].x + this.elements[0][0].width + 2, this.elements[0][0].y - this.elements[0][0].height - (this.elements[0][0].height * 0.3) - currentOffset - 3, 11.5, 0, 2 * Math.PI)
                    }
                    if (currentOffset > maxOffset) {
                        maxOffset = currentOffset;
                    }
                    this.ctx.fill();
                    this.ctx.stroke();
                    this.ctx.fillStyle = this.indexStrokeC;
                    this.ctx.font = "bold 12px Courier New";
                    this.ctx.textAlign = "center";
                    this.ctx.textBaseline = "alphabetic"
                    if(j >= 0 && j < this.elements[0].length ){
                        this.ctx.fillText(indexNames[n], this.elements[0][j].x, this.elements[0][0].y - this.elements[0][0].height - this.elements[0][0].height * 0.3 - currentOffset);
                    } else if (j === -1){
                        this.ctx.fillText(indexNames[n], this.elements[0][0].x - this.elements[0][0].width - 2, this.elements[0][0].y - this.elements[0][0].height - this.elements[0][0].height * 0.3 - currentOffset);
                    } else {
                        this.ctx.fillText(indexNames[n],this.elements[0][this.elements[0].length - 1].x + this.elements[0][0].width + 2, this.elements[0][0].y - this.elements[0][0].height - this.elements[0][0].height * 0.3 - currentOffset);
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

    setRowLoopMarkers(name, from, to, backward = false) {
        this.rowLoopMarkers[name] = {"from": from, "to": to, "backward": backward};
    }

    setColLoopMarkers(name, from, to, backward = false) {
        this.colLoopMarkers[name] = {"from": from, "to": to, "backward": backward};
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
                element.copyWidth = width;
                element.copyHeight = height;
            }
        }
    }
}