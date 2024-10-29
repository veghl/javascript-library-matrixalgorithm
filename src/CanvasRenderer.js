import {matrixvis} from "./index.js";

export class CanvasRenderer {
    constructor(canvasId) {
        document.onselectstart = function () {return false;};
        this.canvas = document.getElementById(canvasId);
        this.canvas.parent = this;
        this.ctx = this.canvas.getContext('2d');

        this.matrixItems = {};
        this.vars = {};

        this.controller = new matrixvis.Controller(this.ctx);
        this.controller.x =this.canvas.width / 6;
        this.controller.y = this.ctx.canvas.height - 30;

        this.canvas.addEventListener("mousemove", (event) =>this.mouseMoveEvent);


        this.render = (evt) => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.controller.render();
            for (const matrixItem of Object.values(this.matrixItems)) {
                if(typeof matrixItem.render === 'function') {
                    matrixItem.render(this.ctx);
                }
            }
        }
    }


    mouseMoveEvent(event){
        
        console.log("Mouse moved: ", event);
    }

    get = (id) => {
        return this.matrixItems[id];
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


}