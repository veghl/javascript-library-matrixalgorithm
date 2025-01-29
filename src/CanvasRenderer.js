import {matrixvis} from "./index.js";

export class CanvasRenderer {
    constructor(canvasId) {
        document.onselectstart = function () {return false;};
        this.canvas = document.getElementById(canvasId);
        this.canvas.parent = this;
        this.ctx = this.canvas.getContext('2d');
        this.matrixItems = {};
        this.vars = {};

        this.fps = 24;
        setInterval(() => this.render(), 1000 / this.fps);

        this.controller = new matrixvis.Controller(this.ctx);
        this.controller.x =this.canvas.width / 6;
        this.controller.y = this.ctx.canvas.height - 30;

        this.canvas.addEventListener("mousemove", (e) => this.mouseMoveEvent(e));
        this.canvas.addEventListener("mousedown", (e) => this.mouseDownEvent(e));
        this.canvas.addEventListener("mouseup", (e) => this.mouseUpEvent(e));

        this.showArrow = [];
        this.showDoubleArrow = [];
        this.animating = 0;
        this.time = 1000;

        this.render = (e) => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.controller.render();
            for (const matrixItem of Object.values(this.matrixItems)) {
                if(typeof matrixItem.render === 'function') {
                    matrixItem.render(this.ctx);
                }
            }

        }

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
                } else if (obj.comparing || obj.copying) {
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
                        console.log(obj);
                        obj.clicked = false;
                        obj.clickFcn();
                    }
                }
            }
            for (const obj of Object.values(this.matrixItems)) {
                if (obj instanceof matrixvis.MatrixElement) {
                    if (obj.changeable && obj.isOver(mouseX, mouseY)) {
                        console.log(obj);
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

    compare(firstObj, secondObj) {
        firstObj.startCompare();
        if (firstObj !== secondObj) {
            secondObj.startCompare();
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
            element.setGreenColor(); // Optionally show success color
        }
        document.body.removeChild(input); // Clean up
    };
}