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
        this.singleStep = false;

        this.autoNextStep = -1;
        this.undo = [];
        this.animationStepCheckID = null;
        this.resetIfPossible = false;

        //Controller labels
        this.resetLabel = "Reset";
        this.startLabel = "Play";
        this.stopLabel = "Stop";
        this.prevLabel = "◄◄";
        this.prevSingleLabel = "◄";
        this.nextSingleLabel = "►";
        this.nextLabel = "►►";

        this.reset = new matrixvis.MatrixButton(this.resetLabel, 80, this.resetAnimation);
        this.startStop = new matrixvis.MatrixButton(this.startLabel, 80, this.startStopAnimation);
        this.prevStep = new matrixvis.MatrixButton(this.prevLabel, 80, this.previousStepFunction);
        this.nextStep = new matrixvis.MatrixButton(this.nextLabel, 80, this.nextStepFunction);
        this.prevSingleStep = new matrixvis.MatrixButton(this.prevSingleLabel, 80, this.previousSingleStepFunction);
        this.nextSingleStep = new matrixvis.MatrixButton(this.nextSingleLabel, 80, this.nextSingleStepFunction);

        this.reset.enabled = false;
        this.prevStep.enabled = false;
        this.prevSingleStep.enabled = false;

    }

    restoreStepfromUndo = (stepNumber) => {
        const mainCanvas = this.ctx.canvas.parent;
        const updateAttributes = (source, target) => {
            Object.entries(source).forEach(([key, value]) => {
                try {
                    if (typeof value === 'object' && value !== null) {
                        if (!target.hasOwnProperty(key)) {
                            target[key] = Array.isArray(value) ? [] : {};
                        }
                        updateAttributes(value, target[key]);
                    } else {
                        target[key] = value;
                    }
                } catch (err) {
                    console.warn(`Cannot update key: ${key} → Read-Only Error:`, err);
                }
            });
        };

        const cleanProperties = (source, target) => {
            Object.keys(target).forEach((key) => {
                try {
                    if (typeof target[key] === 'object' && target[key] !== null) {
                        if (source.hasOwnProperty(key)) {
                            cleanProperties(source[key], target[key]);
                        } else {
                            delete target[key];
                        }
                    } else if (!source.hasOwnProperty(key)) {
                        delete target[key];
                    }
                } catch (err) {
                    console.warn(`Cannot delete key: ${key} → Read-Only Error:`, err);
                }
            });
        };

        const vars = JSON.parse(this.undo[stepNumber][0]);
        updateAttributes(vars, mainCanvas.vars);
        cleanProperties(vars, mainCanvas.vars);
        const matrixItems= JSON.parse(this.undo[stepNumber][1]);
        updateAttributes(matrixItems, mainCanvas.matrixItems);
        Object.values(mainCanvas.matrixItems).forEach((item) => {
            if (item instanceof matrixvis.MatrixCode) {
                if (matrixItems[item.id] && Array.isArray(matrixItems[item.id].selected)) {
                    item.selected = [...matrixItems[item.id].selected];
                } else {
                    item.selected = [];
                }
            }
            if (item instanceof matrixvis.Matrix) {
                if (matrixItems[item.id]) {
                    item.rowIndexes = matrixItems[item.id].rowIndexes ? { ...matrixItems[item.id].rowIndexes } : {};
                    item.colIndexes = matrixItems[item.id].colIndexes ? { ...matrixItems[item.id].colIndexes } : {};
                    item.rowLoopMarkers = matrixItems[item.id].rowLoopMarkers ? { ...matrixItems[item.id].rowLoopMarkers } : {};
                    item.colLoopMarkers = matrixItems[item.id].colLoopMarkers ? { ...matrixItems[item.id].colLoopMarkers } : {};
                } else {
                    item.rowIndexes = {};
                    item.colIndexes = {};
                    item.rowLoopMarkers = {};
                    item.colLoopMarkers = {};
                }
            }
        });
        this.functionIndex = JSON.parse(this.undo[stepNumber][2]);
        this.autoNextStep = this.undo[stepNumber][6];
    }



    resetAnimation = () => {
        const mainCanvas = this.ctx.canvas.parent;
        if(mainCanvas.animating === 0 && !this.isWaiting) {
            this.resetIfPossible = false;
            this.isPlaying = false;
            this.autoNextStep = -1;
            this.startStop.text = this.startLabel;
            this.restoreStepfromUndo(0);
            this.undo = [];
            this.reset.enabled = false;
            this.startStop.enabled = true;
            this.prevSingleStep.enabled = false;
            this.prevStep.enabled = false;
            this.nextSingleStep.enabled = true;
            this.nextStep.enabled = true;
        } else if(mainCanvas.animating > 0 || this.isWaiting) {
            this.resetIfPossible = true;
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

    previousStepAnimation = () => {
        const mainCanvas = this.ctx.canvas.parent;
        if (mainCanvas.animating === 0 && !this.isWaiting) {
            let i = this.undo.length - 1;
            if (!this.singleStep) {
                while (this.undo[i][6] > 0){
                    i--;
                }
            }
            this.restoreStepfromUndo(i);
            this.undo = this.undo.slice(0,i);
            if (this.undo.length === 0){
                this.prevStep.enabled = false;
                this.prevSingleStep.enabled = false;
                this.reset.enabled = false;
            }
            this.startStop.enabled = true;
            this.nextSingleStep.enabled = true;
            this.nextStep.enabled = true;
        }
    }

    animationWaitDone = () => {
        this.isWaiting = false;
        if (this.resetIfPossible) {
            this.resetAnimation();
        } else if(this.isPlaying || this.autoNextStep > 0) {
            this.nextStepAnimation();
        }
    }


    checkIfAnimationStepDone = () => {
        const mainCanvas = this.ctx.canvas.parent;
        if(mainCanvas.animating === 0 && !this.isWaiting){
            clearInterval(this.animationStepCheckID);
            if(this.resetIfPossible){
                this.resetAnimation();
            } else if(this.autoNextStep === 0) {
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
        if (mainCanvas.animating === 0 && !this.isWaiting && this.stepFunctions != null) {

            for (const matrixItem of Object.values(mainCanvas.matrixItems)) {
                if (matrixItem instanceof matrixvis.MatrixElement) {
                    matrixItem.wasSumming = false; //
                } else if (matrixItem instanceof matrixvis.Matrix) {
                    for (let i = 0; i < matrixItem.elements.length; i++) {
                        for (let j = 0; j < matrixItem.elements[i].length; j++) {
                            matrixItem.elements[i][j].wasSumming = false;
                        }
                    }
                }
            }
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
                    this.autoNextStep
                ]);
            }
            //mainCanvas.showArrow = [];
            //mainCanvas.showBendedArrow = [];
            //mainCanvas.showDoubleArrow = [];
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
                if (stepsCheck[i]) {
                    if (stepsCheck[i]()) {
                        this.functionIndex[i] = 0;
                    } else {
                        i--;
                        this.functionIndex[i]++;
                        this.functionIndex = this.functionIndex.slice(0, i + 1);
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

        this.animationStepCheckID = setInterval(this.checkIfAnimationStepDone, 10);
    }

    previousStepFunction = () => {
        this.singleStep = false;
        this.previousStepAnimation();
    }

    nextStepFunction = () => {
        const mainCanvas = this.ctx.canvas.parent;
        if (mainCanvas.animating > 0 || this.isWaiting) {
            return;
        }
        this.singleStep = false;
        this.nextStepAnimation();
    }

    previousSingleStepFunction = () => {
        this.singleStep = true;
        this.previousStepAnimation();
    }

    nextSingleStepFunction = () => {
        const mainCanvas = this.ctx.canvas.parent;
        if (mainCanvas.animating > 0 || this.isWaiting) {
            return;
        }
        this.singleStep = true;
        this.nextStepAnimation();
    }

    setSteps = (stepFunctions) => {
        this.stepFunctions = stepFunctions;
    }

    render = () => {
        const canvasWidth = this.ctx.canvas.clientWidth;// Get the canvas width
        //line above buttons
        this.ctx.setLineDash([])
        this.ctx.beginPath();
        this.ctx.strokeStyle = "#000";
        this.ctx.moveTo(0, this.y - 30 + 0.5);
        this.ctx.lineTo(this.ctx.canvas.clientWidth, this.y - 30 + 0.5);
        this.ctx.stroke();

        // Draw the buttons
        const buttons = [
            this.startStop,
            this.reset,
            this.prevStep,
            this.prevSingleStep,
            this.nextSingleStep,
            this.nextStep
        ];

        let totalButtonWidth = buttons.reduce((sum, button) => sum + button.width + 10, -10); // Sum button widths with spacing
        let currentX = (canvasWidth - totalButtonWidth) / 2;
        buttons.forEach(button => {
            if (button.width > 0) {
                button.ctx = this.ctx;
                button.x = currentX + button.width / 2;
                button.y = this.y;
                button.render();
                currentX += button.width + 10;
            }
        });
    }

}