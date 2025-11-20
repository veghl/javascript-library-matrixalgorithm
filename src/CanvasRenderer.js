import {matrixvis} from "./index.js";

export class CanvasRenderer {
    constructor(canvasId) {
        document.onselectstart = function () {return false;};
        this.canvas = document.getElementById(canvasId);
        this.canvas.parent = this;
        this.ctx = this.canvas.getContext('2d');
        this.matrixItems = {};
        this.vars = {};

        this.fps = 30;
        setInterval(() => this.render(), 1000 / this.fps);

        this.controller = new matrixvis.Controller(this.ctx);
        this.controller.x =this.canvas.width / 6;
        this.controller.y = this.ctx.canvas.height - 30;

        this.canvas.addEventListener("mousemove", (e) => this.mouseMoveEvent(e));
        this.canvas.addEventListener("mousedown", (e) => this.mouseDownEvent(e));
        this.canvas.addEventListener("mouseup", (e) => this.mouseUpEvent(e));

        //this.showArrow = [];
        //this.showBendedArrow = [];
        //this.showDoubleArrow = [];
        this.animating = 0;
        this.time = 1000;

        this.render = (e) => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.controller.render();

            for (const matrixItem of Object.values(this.matrixItems)) {
                if (typeof matrixItem.render === 'function') {
                    matrixItem.render(this.ctx);
                }
            }
            for (const matrixItem of Object.values(this.matrixItems)) {
                if (matrixItem instanceof matrixvis.MatrixElement ) {
                    if (typeof matrixItem.copyRender === 'function') {
                        matrixItem.copyRender();
                    }
                } else if (matrixItem instanceof matrixvis.Matrix) {
                    for (let i = 0; i < matrixItem.elements.length; i++) {
                        for (let j = 0 ; j < matrixItem.elements[i].length; j++){
                            if(typeof matrixItem.elements[i][j].copyRender === 'function') {
                                matrixItem.elements[i][j].copyRender();
                            }
                        }
                    }
                }
            }
        };

    }

    mouseMoveEvent = (e) => {
        const canvasRect = this.canvas.getBoundingClientRect();
        const mouseX = e.clientX - canvasRect.left;
        const mouseY = e.clientY - canvasRect.top;
        let mouseCursor = "default";
        for (const obj of Object.values(this.controller)) {
            if (obj instanceof matrixvis.MatrixButton && obj.enabled) {
                if (obj.isOver(mouseX, mouseY)) {
                    obj.color = obj.overColor;
                    mouseCursor = "pointer";
                }
                else {
                    obj.color = obj.defaultColor;
                }
            }
        }

        for(const obj of Object.values(this.matrixItems)) {
            // check element
            if (obj instanceof matrixvis.MatrixElement) {
                if (obj.changeable && obj.isOver(mouseX, mouseY)) {
                    mouseCursor = "pointer";
                    obj.setDefaultOverColor();
                } else {
                    if (obj.persistentColor) {
                        obj.fillColor = obj.persistentColor;
                    } else if (obj.comparing) {
                        obj.setCompareColor();
                    } else if (obj.copying && !obj.wasMoved) {
                        obj.setCopyColor();
                    } else if (obj.wasMoved) {
                        obj.setGrayColor();
                    } else {
                        obj.setDefaultColor();
                    }
                }
            }
            // check matrix
            if (obj instanceof matrixvis.Matrix) {
                for (let i = 0; i < obj.elements.length; i++) {
                    for (let j = 0 ; j < obj.elements[i].length; j++){
                        if (obj.elements[i][j].changeable && obj.elements[i][j].isOver(mouseX, mouseY)) {
                            obj.elements[i][j].setDefaultOverColor();
                            mouseCursor = "pointer";
                        } else {
                            if (obj.elements[i][j].persistentColor) {
                                obj.fillColor = obj.elements[i][j].persistentColor;
                            }else if (obj.elements[i][j].comparing) {
                                obj.elements[i][j].setCompareColor();
                            }else if (obj.elements[i][j].copying && !obj.elements[i][j].wasMoved) {
                                obj.elements[i][j].setCopyColor();
                            }else if (obj.elements[i][j].wasMoved) {
                                obj.elements[i][j].setGrayColor();
                            }else {
                                obj.elements[i][j].setDefaultColor();
                            }
                        }
                    }
                }
            }
            // check button
            if (obj instanceof matrixvis.MatrixButton && obj.enabled) {
                if (obj.isOver(mouseX, mouseY)) {
                    obj.color = obj.overColor;
                    mouseCursor = "pointer";
                }
                else {
                    obj.color = obj.defaultColor;
                }
            }
        }
        e.target.style.cursor = mouseCursor;
    }

    mouseDownEvent = (e) => {
        if (e.button === 0) {
            const canvasRect = this.canvas.getBoundingClientRect();
            const mouseX = e.clientX - canvasRect.left;
            const mouseY = e.clientY - canvasRect.top;
            for (const obj of Object.values(this.controller)) {
                if (obj instanceof matrixvis.MatrixButton && obj.enabled) {
                    if (obj.isOver(mouseX, mouseY)) {
                        obj.clicked = true;
                    }
                }
            }

            for (const obj of Object.values(this.matrixItems)) {
                if (obj instanceof matrixvis.MatrixElement) {
                    if (obj.changeable && obj.isOver(mouseX, mouseY)) {
                    }
                }

                if (obj instanceof matrixvis.Matrix) {
                    for (let i = 0; i < obj.elements.length; i++) {
                        for (let j = 0 ; j < obj.elements[i].length; j++){
                            if (obj.elements[i][j].changeable && obj.elements[i][j].isOver(mouseX, mouseY)) {
                            }
                        }
                    }
                }

                if (obj instanceof matrixvis.MatrixButton && obj.enabled) {
                    if (obj.isOver(mouseX, mouseY)) {
                        obj.clicked = true;
                        obj.clickFcn();
                    }
                }
            }

        }
    }

    mouseUpEvent = (e) => {
        if (e.button === 0) {
            const canvasRect = this.canvas.getBoundingClientRect();
            const mouseX = e.clientX - canvasRect.left;
            const mouseY = e.clientY - canvasRect.top;
            for (const obj of Object.values(this.controller)) {
                if (obj instanceof matrixvis.MatrixButton && obj.enabled) {
                    if (obj.isOver(mouseX, mouseY) && obj.clicked) {
                        obj.clicked = false;
                        obj.clickFcn();
                    }
                }
            }
            for (const obj of Object.values(this.matrixItems)) {
                if (obj instanceof matrixvis.MatrixElement) {
                    if (obj.changeable && obj.isOver(mouseX, mouseY)) {
                        this.makeElementEditable(obj);
                    }
                }
                if (obj instanceof matrixvis.Matrix) {
                    for (let i = 0; i < obj.elements.length; i++) {
                        for (let j = 0 ; j < obj.elements[i].length; j++){
                            if (obj.elements[i][j].changeable && obj.elements[i][j].isOver(mouseX, mouseY)) {
                                this.makeElementEditable(obj.elements[i][j]);
                            }
                        }
                    }
                }
            }
        }
    }

    setSteps = (stepFunctions) => {
        this.controller.setSteps(stepFunctions);
    }

    add(matrixData, id) {
        if (this.matrixItems[id] !== undefined) {
            throw new Error(`Cannot add matrixItem ${id}, object with this id already exists.`);
        } else if (matrixData.id !== undefined) {
            throw new Error(`This object was already added to the canvas with ID: ${matrixData.id} .`);
        }
        matrixData.ctx = this.ctx;
        matrixData.id = id;
        this.matrixItems[id] = matrixData;
    }

    copy(obj1, obj2) {
        this.animating++;
        obj1.changeable = false;
        obj2.changeable = false;
        const fps = this.fps;
        const distance = Math.hypot(obj1.x - obj2.x, obj1.y - obj2.y);
        let time = (distance * this.time) /100;
        if(time > this.time){
            time = this.time;
        }
        let frames = Math.floor(time * fps /1000);
        let dx = (obj2.x - obj1.x) / frames;
        let dy = (obj2.y - obj1.y) / frames;
        let dw = (obj2.width - obj1.width) / frames;
        let dh = (obj2.height - obj1.height) / frames;

        const strokeC = obj1.strokeColor;
        const fillC = obj1.fillColor;
        obj1.startCopy();
        obj1.setCopyColor();
        const intervalId = setInterval(() => {
            frames--;

            if (frames > 0) {
                obj1.copyx += dx;
                obj1.copyy += dy;
                obj1.copyWidth += dw;
                obj1.copyHeight += dh;
            } else {
                obj1.copyx = obj2.x;
                obj1.copyy = obj2.y;
                obj1.copyWidth = obj2.width;
                obj1.copyHeight = obj2.height;

                obj2.value = obj1.value;
                obj2.sumvalue = obj2.value;
                obj2.minValue = obj1.minValue;
                obj2.maxValue = obj1.maxValue;
                obj2.strokeColor = strokeC;
                obj2.fillColor = fillC;
                obj2.wasMoved = false;
                clearInterval(intervalId);
                this.animating--;
            }
        }, 1000 / fps);
    }

    swap(obj1, obj2) {
        this.animating++;
        obj1.changeable = false;
        obj2.changeable = false;
        const fps = this.fps;
        const distance = Math.hypot(obj1.x - obj2.x, obj1.y - obj2.y);
        let time = (distance * this.time) /100;
        if(time > this.time){
            time = this.time;
        }
        let frames = Math.floor(time * fps / 1000);
        const dx = (obj2.x - obj1.x) / frames;
        const dy = (obj2.y - obj1.y) / frames;
        const strokeC = obj1.strokeColor;
        const fillC = obj1.fillColor;

        const dw1 = (obj2.width - obj1.width) / frames;
        const dh1 = (obj2.height - obj1.height) / frames;
        const dw2 = -dw1; // Reverse for obj2
        const dh2 = -dh1;

        obj1.strokeColor = obj2.strokeColor;
        obj1.fillColor = obj2.fillColor;
        obj2.strokeColor = strokeC;
        obj2.fillColor = fillC;
        obj1.startCopy();
        obj2.startCopy();
        obj1.setGrayColor()
        obj2.setGrayColor()
        obj1.wasMoved = true;
        obj2.wasMoved = true;

        obj1.copyWidth = obj1.width;
        obj1.copyHeight = obj1.height;
        obj2.copyWidth = obj2.width;
        obj2.copyHeight = obj2.height;
        const intervalId = setInterval(() => {
            frames--;
            if (frames > 0) {
                obj1.copyx += dx;
                obj1.copyy += dy;
                obj2.copyx -= dx;
                obj2.copyy -= dy;
                obj1.copyWidth += dw1;
                obj1.copyHeight += dh1;
                obj2.copyWidth += dw2;
                obj2.copyHeight += dh2;
            } else {
                obj1.wasMoved = false;
                obj2.wasMoved = false;
                let tmp = obj2.value;
                obj2.value = obj1.value;
                obj1.value = tmp;
                tmp = obj2.sumvalue;
                obj2.sumvalue = obj1.sumvalue;
                obj1.sumvalue = tmp;
                obj1.copyx = obj1.x;
                obj1.copyy = obj1.y;
                obj2.copyx = obj2.x;
                obj2.copyy = obj2.y;

                obj1.copyWidth = obj1.width;
                obj1.copyHeight = obj1.height;
                obj2.copyWidth = obj2.width;
                obj2.copyHeight = obj2.height;
                clearInterval(intervalId);
                this.animating--;
            }
        }, 1000 / fps);

    }

    move(obj1, obj2) {
        this.animating++;
        obj1.changeable = false;
        obj2.changeable = false;
        const fps = this.fps;
        const distance = Math.hypot(obj1.x - obj2.x, obj1.y - obj2.y);
        let time = (distance * this.time) /100;
        if(time > this.time){
            time = this.time;
        }
        let frames = Math.floor(time * fps / 1000);
        const dx = (obj2.x - obj1.x) / frames;
        const dy = (obj2.y - obj1.y) / frames;
        const dw = (obj2.width - obj1.width) / frames;
        const dh = (obj2.height - obj1.height) / frames;

        const strokeC = obj1.strokeColor;
        const fillC = obj1.fillColor;
        obj1.startCopy();
        obj1.setGrayColor();
        obj1.wasMoved = true;

        obj1.copyWidth = obj1.width;
        obj1.copyHeight = obj1.height;
        const intervalId = setInterval(() => {
            frames--;
            if (frames > 0) {
                obj1.copyx += dx;
                obj1.copyy += dy;
                obj1.copyWidth += dw;
                obj1.copyHeight += dh;
            } else {
                obj1.copyx = obj2.x;
                obj1.copyy = obj2.y;
                obj1.copyWidth = obj2.width;
                obj1.copyHeight = obj2.height;

                obj2.value = obj1.value;
                obj2.sumvalue = obj2.value;
                obj2.minValue = obj1.minValue;
                obj2.maxValue = obj1.maxValue;
                obj2.strokeColor = strokeC;
                obj2.fillColor = fillC;
                obj2.wasMoved = false;
                obj1.wasSumming = true;
                obj1.value = 0;
                clearInterval(intervalId);
                this.animating--;
            }
        }, 1000 / fps);

    }

    sum(obj1, obj2) {
        this.animating++;
        obj1.changeable = false;
        obj2.changeable = false;

        const fps = this.fps;
        const midX = obj2.x + obj2.width + 20;
        const midY = obj2.y;
        const distance1 = Math.hypot(midX - obj1.x, midY - obj1.y);
        const distance2 = Math.hypot(obj2.x - midX, obj2.y - midY);

        let time1 = (distance1 * this.time) / 100;
        let time2 = (distance2 * this.time) / 100;
        if (time1 > this.time) time1 = this.time;
        if (time2 > this.time) time2 = this.time;

        let frames1 = Math.floor(time1 * fps / 1000);
        let frames2 = Math.floor(time2 * fps / 1000);

        const dx1 = (midX - obj1.x) / frames1;
        const dy1 = (midY - obj1.y) / frames1;
        const dx2 = (obj2.x - midX) / frames2;
        const dy2 = (obj2.y - midY) / frames2;
        const dw1 = (obj2.width - obj1.width) / frames1;
        const dh1 = (obj2.height - obj1.height) / frames1;
        const strokeC = obj1.strokeColor;
        const fillC = obj1.fillColor;

        obj1.summing = true;
        obj1.startCopy();
        obj1.setCopyColor();

        obj1.copyWidth = obj1.width;
        obj1.copyHeight = obj1.height;
        let phase = 1;
        const intervalId = setInterval(() => {
            if (phase === 1) {
                if (frames1 > 0) {
                    obj1.copyx += dx1;
                    obj1.copyy += dy1;
                    obj1.copyWidth += dw1;
                    obj1.copyHeight += dh1;
                    frames1--;
                } else {
                    obj1.copyWidth = obj2.width;
                    obj1.copyHeight = obj2.height;
                    phase = 2;
                }
            } else if (phase === 2) {
                if (frames2 > 0) {
                    obj1.copyx += dx2;
                    obj1.copyy += dy2;
                    frames2--;
                    obj1.summing = false;
                } else {
                    obj1.copyx = obj2.x;
                    obj1.copyy = obj2.y;
                    obj1.copyWidth = obj2.width;
                    obj1.copyHeight = obj2.height;

                    obj2.value += obj1.value;
                    obj2.sumvalue = obj2.value;
                    obj1.sumvalue = obj2.value;
                    obj1.wasSumming = true;
                    obj2.strokeColor = strokeC;
                    obj2.fillColor = fillC;
                    obj2.wasMoved = false;
                    clearInterval(intervalId);
                    this.animating--;
                }
            }
        }, 1000 / fps);
    }

    compare(obj1, obj2) {
        obj1.startCompare();
        if (obj1 !== obj2) {
            obj2.startCompare();
        }
    }

    get(id) {
        return this.matrixItems[id];
    }
    makeElementEditable = (element) => {
        const input = document.createElement("input");
        input.type = "number";
        input.value = element.value;
		input.min = element.minValue;
		input.max = element.maxValue;
        input.style.position = "absolute";

        const rect = this.canvas.getBoundingClientRect();
        input.style.left = `${rect.left + window.scrollX + element.x - element.width / 2}px`;
        input.style.top = `${rect.top + window.scrollY + element.y - element.height}px`;

        input.style.width = `${element.width}px`;
        input.style.zIndex = 10;

        document.body.appendChild(input);
        input.focus();
        input.onblur = () => {
            this.updateElementValue(element, input);
        };

        input.onkeydown = (e) => {
            if (e.key === "Enter") {
                input.blur();
            }
        };
    };

    updateElementValue = (element, input) => {
        var newValue = parseInt(input.value, 10);
        if (!isNaN(newValue) && element.changeable) {
			if (newValue < element.minValue) { newValue = element.minValue; }
			if (newValue > element.maxValue) { newValue = element.maxValue; }
            element.updateValue(newValue);
            element.setUpdateColor();
        }
        document.body.removeChild(input);
    };

    stopComparingAndCopying = () => {
        for (const element of Object.values(this.matrixItems)) {
            if (element instanceof matrixvis.MatrixElement) {
                if(element.comparing) {
                    element.stopCompare();
                }
                if(element.copying){
                    element.stopCopy();
                }
            }

            if (element instanceof matrixvis.Matrix) {
                for (let i = 0; i < element.elements.length; i++) {
                    for (let j = 0; j < element.elements[i].length; j++) {
                        if(element.elements[i][j].comparing) {
                            element.elements[i][j].stopCompare();
                        }
                        if(element.elements[i][j].copying) {
                            element.elements[i][j].stopCopy();
                        }
                    }
                }
            }
        }
    }
}