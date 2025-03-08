import {MatrixData} from "./MatrixData.js";

export class MatrixElement extends MatrixData {
    constructor(name, value, changeable, showLabel) {
        super();
        if (typeof changeable === "undefined") {
            changeable = false;
        }
        if (typeof showLabel === "undefined") {
            showLabel = false;
        }
        this.name = name;
        this.value = value;
        this.maxValue = 99;
        this.minValue = -99;

        this.changeable = changeable;
        this.showLabel = showLabel;
        this.summing = false;
        this.sumvalue = value;
        this.wasSumming = false;
        this.wasMoved = false;

        this.copying = false;
        this.copyx = 0;
        this.copyy = 0;
        this.copyWidth = 30;
        this.copyHeight = 30;
        this.comparing = false;

        this.minSize = 35;
        this.maxSize = 50;
        this.width = 30; //default width of the element
        this.height = 30; //default height of the element

        this.fillColor = '#EEE';
        this.strokeColor = '#000';

        this.defaultColor = '#EEE';
        this.greenColor = '#579F6E';
        this.orangeColor = '#F9B900';
        this.lightOrangeColor = '#FFDA99';
        this.grayColor = '#BBBBBB';
        this.blackColor = '#000';
        this.updateColor = "#9FD7B6";

        this.originalFillColor = "#EEE";
        this.originalStrokeColor = "#000";

        this.persistentColor = null;
    }

    render() {
        this.ctx.fillStyle = this.fillColor;
        this.ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        this.ctx.setLineDash([])
        this.ctx.strokeStyle = this.blackColor;
        this.ctx.strokeRect(this.x - this.width / 2 - 0.5, this.y - this.height / 2 - 0.5, this.width + 1, this.height + 1);

        this.ctx.fillStyle = this.strokeColor;
        this.ctx.font = "16px Arial";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";

        this.ctx.fillText(this.value, this.x, this.y);

        if (this.showLabel) {
            this.ctx.fillStyle = this.blackColor;
            this.ctx.font = "12px Arial";
            this.ctx.textBaseline = "alphabetic";
            this.ctx.fillText(this.name, this.x, this.y - this.height /2 - 5);
        }
        if (this.comparing) {
            this.ctx.fillStyle = "#FFF"
            this.ctx.globalAlpha = 0.5;
            const textSize = (this.width + this.height) /2;
            this.ctx.font = "bold " + textSize + "px serif";
            this.ctx.textAlign = "center";
            this.ctx.textBaseline = "middle";
            this.ctx.fillText("?", this.x, this.y);
            this.ctx.globalAlpha = 1;
        }
    }

    copyRender() {
        if (this.copying) {
            this.ctx.fillStyle = this.orangeColor;
            this.ctx.fillRect(this.copyx - this.copyWidth  / 2, this.copyy - this.copyHeight / 2, this.copyWidth, this.copyHeight);
            this.ctx.setLineDash([5]);
            this.ctx.strokeStyle = this.blackColor;
            this.ctx.strokeRect(this.copyx - this.copyWidth / 2 - 0.5, this.copyy - this.copyHeight / 2 - 0.5, this.copyWidth + 1, this.copyHeight + 1);
            if(this.wasSumming){
                this.ctx.fillStyle = this.blackColor;
                this.ctx.font = "16px Arial";
                this.ctx.textAlign = "center";
                this.ctx.textBaseline = "middle";
                this.ctx.fillText(this.sumvalue, this.copyx, this.copyy);
            } else{
                this.ctx.fillStyle = this.blackColor;
                this.ctx.font = "16px Arial";
                this.ctx.textAlign = "center";
                this.ctx.textBaseline = "middle";
                this.ctx.fillText(this.value, this.copyx, this.copyy);
            }
            if(this.summing) {
                this.ctx.setLineDash([]);
                this.ctx.beginPath();
                this.ctx.arc(this.copyx - this.copyWidth / 2 - 10,  this.copyy, 7, 0, 2 * Math.PI, false);
                this.ctx.fillStyle = this.orangeColor;
                this.ctx.fill()
                this.ctx.fillStyle = this.strokeColor;
                this.ctx.stroke();
                this.ctx.font = "20px Arial";
                this.ctx.fillStyle = this.strokeColor;
                this.ctx.fillText("+", this.copyx - this.copyWidth / 2 - 10, this.copyy);
            }
        }
    }

    // set random value to element
    randomize = (min, max) => {
        min = typeof min === "undefined" ? this.minValue : min;
        max = typeof max === "undefined" ? this.maxValue : max;
        if (min > max) {
            [min, max] = [max, min];
        }
        this.value = Math.floor(Math.random() * (max - min) + min);
        this.sumvalue = this.value;
    }

    setSize(width, height) {
        if (typeof width !== 'number' || typeof height !== 'number' || width <= 0 || height <= 0) {
            console.warn("Invalid width or height specified. Both must be positive numbers.");
            return;
        }
        if (width > this.maxSize) {
            console.warn(`Width exceeds maximum allowed size of ${this.maxSize}. Setting width to ${this.maxSize}.`);
            width = this.maxSize;
        }
        if (height > this.maxSize) {
            console.warn(`Height exceeds maximum allowed size of ${this.maxSize}. Setting height to ${this.maxSize}.`);
            height = this.maxSize;
        }
        if (width < this.minSize) {
            console.warn(`Width exceeds maximum allowed size of ${this.maxSize}. Setting width to ${this.minSize}.`);
            width = this.minSize;
        }
        if (height < this.minSize) {
            console.warn(`Height exceeds maximum allowed size of ${this.maxSize}. Setting height to ${this.minSize}.`);
            height = this.minSize;
        }
        this.height = height;
        this.width = width;
        this.copyWidth = width;
        this.copyHeight = height;
    }

    isOver = (x, y) => {
        return (
            this.width > 0 &&
            x >= this.x - this.width / 2 &&
            x <= this.x + this.width / 2 &&
            y >= this.y - this.height / 2 &&
            y <= this.y + this.height / 2
        );
    }

    startCopy() {
        this.originalFillColor = this.fillColor;
        this.originalStrokeColor = this.strokeColor;
        this.copyx = this.x;
        this.copyy = this.y;
        this.copying = true;
    }

    stopCopy() {
        if (this.copying && this.wasMoved) {
            this.fillColor = this.grayColor;
            this.strokeColor = this.grayColor;
            this.copying = false;
        } else if (this.copying && !this.wasMoved) {
            this.fillColor = this.originalFillColor;
            this.strokeColor = this.originalStrokeColor;
            this.copying = false;
        }
    }

    startCompare() {
        this.originalFillColor = this.fillColor;
        this.originalStrokeColor = this.strokeColor;
        this.fillColor = this.orangeColor;
        this.strokeColor = this.blackColor;
        this.comparing = true;
    }

    stopCompare() {
        if (this.comparing) {
            this.fillColor = this.originalFillColor;
            this.strokeColor = this.originalStrokeColor;
            this.comparing = false;
            this.changeable = false;
        }
    }


    updateValue(value) {
        this.value = value;
        this.sumvalue = value;
    }

    // setting colors of MatrixElement
    setDefaultColor() {
        if(!this.persistentColor){
            this.fillColor = this.defaultColor;
            this.strokeColor = this.blackColor;
        }
    }
    // setting color when object is changeable and mouse is over
    setDefaultOverColor() {
        if(!this.persistentColor){
            this.fillColor = "#CCC"
        }
    }
    // setting color to green, when something is done
    setGreenColor() {
        this.fillColor = this.greenColor;
        this.strokeColor = '#000';
        this.persistentColor = this.greenColor;
    }
    // setting color to lightblue when comparing
    setCompareColor() {
        this.fillColor = this.orangeColor;
        this.strokeColor = this.blackColor;
    }

    setCopyColor() {
        this.fillColor = this.lightOrangeColor;
        this.strokeColor = this.blackColor;
    }
    //setting color to grey
    setGrayColor() {
        this.fillColor = this.grayColor;
        this.strokeColor = this.grayColor;
    }

    setUpdateColor() {
        this.fillColor = this.updateColor;
        this.strokeColor = '#000';
    }
}