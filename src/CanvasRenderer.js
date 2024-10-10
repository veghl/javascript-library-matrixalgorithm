export class CanvasRenderer {
    constructor(canvasId) {
        document.onselectstart = function () {return false;};
        this.canvas = document.getElementById(canvasId);
        this.canvas.parent = this;
        this.ctx = this.canvas.getContext('2d');

        this.vars = {};

        this.controller = new inmaalvi.Controller();
        this.controller.ctx = this.ctx;
    }
}