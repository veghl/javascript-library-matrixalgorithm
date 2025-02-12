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

        this.showArrow = [];
        this.showBendedArrow = [];
        this.showDoubleArrow = [];
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
                if (matrixItem instanceof matrixvis.MatrixElement || matrixItem instanceof matrixvis.Matrix) {
                    if (typeof matrixItem.copyRender === 'function') {
                        matrixItem.copyRender();
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
                } else if (obj.comparing /*|| obj.copying*/) {
                    obj.setCompareColor();
                } else {
                    obj.setDefaultColor();
                }
            }
            // check matrix
            if (obj instanceof matrixvis.Matrix) {
                for (let i = 0; i < obj.elements.length; i++) {
                    for (let j = 0 ; j < obj.elements[i].length; j++){
                        if (obj.elements[i][j].changeable && obj.elements[i][j].isOver(mouseX, mouseY)) {
                            obj.elements[i][j].setDefaultOverColor();
                            mouseCursor = "pointer";
                        }else if (obj.elements[i][j].comparing || obj.elements[i][j].copying) {
                            obj.elements[i][j].setCompareColor();
                        } else {
                            obj.elements[i][j].setDefaultColor();
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
                                console.log(obj.elements[i][j]);
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
        console.log(distance);
        console.log(time);
        console.log(frames);
        const dx = (obj2.x - obj1.x) / frames;
        const dy = (obj2.y - obj1.y) / frames;

        const strokeC = obj1.strokeColor;
        const fillC = obj1.fillColor;
        obj1.startCopy();
        obj1.setCompareColor();
        const intervalId = setInterval(() => {
            frames--;

            if (frames > 0) {
                obj1.copyx += dx;
                obj1.copyy += dy;
            } else {
                obj1.copyx = obj2.x;
                obj1.copyy = obj2.y;
                obj2.value = obj1.value;
                obj2.minValue = obj1.minValue;
                obj2.maxValue = obj1.maxValue;
                obj2.strokeColor = strokeC;
                obj2.fillColor = fillC;
                clearInterval(intervalId);
                this.animating--;
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
        input.style.position = "absolute";

        const rect = this.canvas.getBoundingClientRect();
        input.style.left = `${rect.left + element.x - element.width / 2}px`;
        input.style.top = `${rect.top + element.y - element.height}px`;

        input.style.width = `${element.width}px`;
        input.style.zIndex = 10;

        document.body.appendChild(input);
        input.focus();
        input.onblur = () => {
            this.updateElementValue(element, input);
        };

        input.onkeydown = (e) => {
            if (e.key === "Enter") {
                this.updateElementValue(element, input);
            }
        };
    };

    updateElementValue = (element, input) => {
        const newValue = parseInt(input.value, 10);
        if (!isNaN(newValue)) {
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