export class CanvasRenderer {
    constructor(canvasId) {
        document.onselectstart = function () {return false;};
        this.canvas = document.getElementById(canvasId);
        this.canvas.parent = this;
        this.ctx = this.canvas.getContext('2d');

        this.matrixItems = {};

        this.vars = {};

        //this.controller = new matrixvis.Controller();
        //this.controller.ctx = this.ctx;
        
    }

    add(matrixData, id) {
        if (this.matrixItems[id] !== undefined) {
            throw new Error(`Cannot add matrixItem ${id}, object with this id already exists.`);
        } else if (matrixData.id !== undefined) {
            throw new Error(`This object was already added to the canvas with ID: ${matrixData.id} .`);
        }
        console.log(Object.isFrozen(matrixData));
        console.log(Object.getOwnPropertyDescriptor(matrixData, 'ctx'));
        matrixData.ctx = this.ctx;
        matrixData.id = id;
        this.matrixItems[id] = matrixData;
        console.log(this.matrixItems);
    }


}