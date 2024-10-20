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
        this.render = (evt) => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            for (const matrixItem of Object.values(this.matrixItems)) {
                if(typeof matrixItem.render === 'function') {
                    matrixItem.render();
                }
            }
        }

        this.get = (id) => {
            return this.matrixItems[id];
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
        console.log(this.matrixItems);
    }


}