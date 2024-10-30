import {matrixvis} from "./index.js";

export class CanvasRenderer {
    constructor(canvasId) {
        document.onselectstart = function () {return false;};
        this.canvas = document.getElementById(canvasId);
        this.canvas.parent = this;
        this.ctx = this.canvas.getContext('2d');
        this.fps = 24;
        this.matrixItems = {};
        this.vars = {};
        setInterval(() => this.render(), 1000 / this.fps);


        this.controller = new matrixvis.Controller(this.ctx);
        this.controller.x =this.canvas.width / 6;
        this.controller.y = this.ctx.canvas.height - 30;

        this.canvas.addEventListener("mousemove", (e) =>this.mouseMoveEvent(e));

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
        e.target.style.cursor = mouseCursor;
    }

    get = (id) => {
        return this.matrixItems[id];
    }


    add = (matrixData, id) => {
        if (this.matrixItems[id] !== undefined) {
            throw new Error(`Cannot add matrixItem ${id}, object with this id already exists.`);
        } else if (matrixData.id !== undefined) {
            throw new Error(`This object was already added to the canvas with ID: ${matrixData.id} .`);
        }
        matrixData.ctx = this.ctx;
        matrixData.id = id;
        this.matrixItems[id] = matrixData;
    }


}