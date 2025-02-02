import {matrixvis} from "./index.js";

export class Controller {
    constructor(ctx) {

        this.x = 0;
        this.y = 0;
        this.ctx = ctx;
        this.functionIndex = [0];
        this.stepFunctions = null;
        this.isPlaying = false;
        this.isWaiting = false;
        this.autoNextStep = -1;
        this.singleStep = false;
        this.undo = [];

        //Controller labels
        this.resetLabel = "Reset";
        this.startLabel = "Play";
        this.stopLabel = "Stop";
        this.prevLabel = "◄◄";
        this.prevSingleLabel = "◄";
        this.nextSingleLabel = "►";
        this.nextLabel = "►►";

        this.reset = new matrixvis.MatrixButton(this.resetLabel, 70, this.resetAnimation);
        this.startStop = new matrixvis.MatrixButton(this.startLabel, 70, this.startStopAnimation);
        this.prevStep = new matrixvis.MatrixButton(this.prevLabel, 70, this.previousStepFunction);
        this.nextStep = new matrixvis.MatrixButton(this.nextLabel, 70, this.nextStepFunction);
        this.prevSingleStep = new matrixvis.MatrixButton(this.prevSingleLabel, 70, this.previousSingleStepFunction);
        this.nextSingleStep = new matrixvis.MatrixButton(this.nextSingleLabel, 70, this.nextSingleStepFunction);

        this.reset.enabled = false;
        this.prevStep.enabled = false;
        this.prevSingleStep.enabled = false;

        this.animationStepCheckID = null;
    }

    restoreStepfromUndo = () => {}



    resetAnimation = () => {
        const mainCanvas = this.ctx.canvas.parent;
        if(mainCanvas.animating === 0 && !this.isWaiting) {
            this.isPlaying = false;
            this.autoNextStep = -1;
            this.startStop.text = this.startLabel;
            //reset the animation using undo function here
            this.undo = [];
            this.reset.enabled = false;
            this.startStop.enabled = true;
            this.prevSingleStep.enabled = false;
            this.prevStep.enabled = false;
            this.nextSingleStep.enabled = true;
            this.nextStep.enabled = true;
        }
    };

    startStopAnimation = () => {
        const mainCanvas = this.ctx.canvas.parent;
        this.singleStep = false;
        if (!this.isPlaying) {
            this.isPlaying = true;
            this.startStop.text = this.stopLabel;
            this.prevSingleStep.enabled = false;
            this.nextSingleStep.enabled = false;
            this.prevStep.enabled = false;
            this.nextStep.enabled = false;
            if(mainCanvas.animating === 0){
                this.nextStepAnimation();
            }
        } else {
            this.isPlaying = false;
            this.startStop.text = this.startLabel;
            if (this.undo.length > 0) {
                this.prevSingleStep.enabled = true;
                this.prevStep.enabled = true;
            }
            this.nextSingleStep.enabled = true;
            this.nextStep.enabled = true;
        }
    }

    previousStepAnimation = () => {}

    animationWaitDone = () => {
        this.isWaiting = false;
        if(this.isPlaying || this.autoNextStep > 0) {
            this.nextStepAnimation();
        }
    }


    checkIfAnimationStepDone = () => {
        const mainCanvas = this.ctx.canvas.parent;
        if(mainCanvas.animating === 0 && !this.isWaiting){
            clearInterval(this.animationStepCheckID);
            if(this.autoNextStep === 0) {
                this.nextStepAnimation();
            } else if (this.autoNextStep > 0 && !this.singleStep) {
                this.isWaiting = true;
                setTimeout(this.animationWaitDone, (mainCanvas.time / 1000) * this.autoNextStep);
            } else if (this.isPlaying) {
                this.isWaiting = true;
                setTimeout(this.animationWaitDone, mainCanvas.time);
            }
        }

    }

    nextStepAnimation = () => {
        const mainCanvas = this.ctx.canvas.parent;
        if (mainCanvas.animating === 0 && !this.isWaiting && this.stepFunctions) {
            if(this.autoNextStep !== 0){
                this.reset.enabled = true;
                if(!this.isPlaying){
                    this.prevStep.enabled = true;
                    this.prevSingleStep.enabled = true;
                }
                const i = this.undo.length;
                this.undo.push([
                    JSON.stringify(mainCanvas.vars),
                    JSON.stringify(mainCanvas.matrixItems),
                    JSON.stringify(this.functionIndex),
                    JSON.stringify(mainCanvas.showArrow),
                    JSON.stringify(mainCanvas.showBendedArrow),
                    JSON.stringify(mainCanvas.showDoubleArrow),
                    this.autoNextStep
                ]);
            }
            mainCanvas.showArrow = [];
            mainCanvas.showBendedArrow = [];
            mainCanvas.showDoubleArrow = [];
            mainCanvas.stopComparingAndCopying()
        }

        let i = 0;
        const stepsArray = [this.stepFunctions];
        const stepsCheck = [null];
        while (Array.isArray(stepsArray[i][this.functionIndex[i]])) {
            stepsCheck[i + 1] = stepsArray[i][this.functionIndex[i] + 1];
            stepsArray[i + 1] = stepsArray[i][this.functionIndex[i]];
            i++;
            if (i >= this.functionIndex.length) {
                this.functionIndex[i] = 0;
            }
        }

        this.autoNextStep = stepsArray[i][this.functionIndex[i]]?.() ?? -1;

        let ok;
        do {
            ok = true;
            this.functionIndex[i]++;
            if (this.functionIndex[i] >= stepsArray[i].length) {
                if (stepsCheck[i] !== null) {
                    if (stepsCheck[i]()) {
                        // repeat some steps
                        this.functionIndex[i] = 0;
                    } else {
                        // no more repeat, step back to previous repeat
                        i--;
                        this.functionIndex[i]++; // to skip the check function
                        this.functionIndex = this.functionIndex.slice(0, i + 1); // remove last item from array
                        ok = false;
                    }
                } else {
                    this.autoNextStep = -1;
                    this.isPlaying = false;
                    if (this.undo.length > 0) {
                        this.prevSingleStep.enabled = true;
                        this.prevStep.enabled = true;
                    }
                    this.nextSingleStep.enabled = false;
                    this.nextStep.enabled = false;
                    this.startStop.enabled = false;
                    this.startStop.text = this.startLabel;
                }
            }
        } while (!ok);
        this.animationStepCheckID = setInterval(this.checkIfAnimationStepDone, 1);
    }

    previousStepFunction = () => {
        this.singleStep = true;
        this.previousStepAnimation();
    }

    nextStepFunction = () => {
        this.singleStep = false;
        this.nextStepAnimation();
    }

    previousSingleStepFunction = () => {
        this.singleStep = true;
        this.previousStepAnimation();
    }

    nextSingleStepFunction = () => {
        this.singleStep = true;
        this.nextStepAnimation();
    }

    setSteps = (stepFunctions) => {
        this.stepFunctions = stepFunctions;
    }

    render = () => {
        //line above buttons
        this.ctx.beginPath();
        this.ctx.strokeStyle = "#000";
        this.ctx.moveTo(0, this.y - 30 + 0.5);
        this.ctx.lineTo(this.ctx.canvas.clientWidth, this.y - 30 + 0.5);
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