import {matrixvis} from "./index.js";

export class Controller {
    constructor(ctx) {

        this.x = 0;
        this.y = 0;
        this.ctx = ctx;
        this.isPlaying = false;
        this.isWaiting = false;

        //Controller labels
        this.resetLabel = "Reset";
        this.startLabel = "Play";
        this.stopLabel = "Stop";
        this.prevLabel = "◄◄";
        this.prevSingleLabel = "◄";
        this.nextSingleLabel = "►";
        this.nextLabel = "►►";

        this.reset = new matrixvis.MatrixButton(this.resetLabel, 70);
        this.startStop = new matrixvis.MatrixButton(this.startLabel, 70);
        this.prevStep = new matrixvis.MatrixButton(this.prevLabel, 70,);
        this.nextStep = new matrixvis.MatrixButton(this.nextLabel, 70);
        this.prevSingleStep = new matrixvis.MatrixButton(this.prevSingleLabel, 70);
        this.nextSingleStep = new matrixvis.MatrixButton(this.nextSingleLabel, 70);

        this.reset.enabled = false;
        this.prevStep.enabled = false;
        this.prevSingleStep.enabled = false;


    }

    render() {
        //line above buttons
        this.ctx.beginPath();
        this.ctx.strokeStyle = "#000";
        this.ctx.moveTo(0, this.y - 30 + 0.5);
        this.ctx.lineTo(this.ctx.canvas.clientWidth, this.y - 40 + 0.5);
        this.ctx.stroke();

        // Draw the buttons
        let spaceWidth = 0;
        const buttons = [
            this.reset,
            this.startStop,
            this.prevStep,
            this.prevSingleStep,
            this.nextSingleStep,
            this.nextStep
        ];

        buttons.forEach(button => {
            if (button.width > 0) {
                button.ctx = this.ctx;
                button.x = this.x + button.width / 2 + spaceWidth;
                button.y = this.y;
                button.render();
                spaceWidth += button.width + 10; //space between buttons
            }
        });
    }

}