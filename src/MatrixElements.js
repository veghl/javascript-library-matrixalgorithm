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
        this.changeable = changeable;
        this.showLabel = showLabel;
        this.minValue = 0;
        this.maxValue = 0;
        this.width = 31; //default width of the variable
        this.height = 31; //default height of the variable

        this.defaultColor = '#DEE';
        this.redColor = '#FF0000';
        this.greenColor = '#00FF00';
        this.grayColor = '#999999';
        this.strokeColor = '#000000';
    }

    render(ctx) {
        this.ctx.fillStyle = this.defaultColor;
        this.ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        this.ctx.strokeStyle = this.strokeColor;
        this.ctx.strokeRect(this.x - this.width / 2 - 0.5, this.y - this.height / 2 - 0.5, this.width + 1, this.height + 1);

        this.ctx.fillStyle = this.strokeColor;
        this.ctx.font = "16px Arial";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";

        this.ctx.fillText(this.value, this.x, this.y);

        if (this.showLabel) {
            this.ctx.font = "12px Arial";
            this.ctx.textBaseline = "alphabetic";
            this.ctx.fillText(this.name, this.x, this.y - this.height /2 - 5);
        }
    }

    updateValue(newValue) {
        this.value = newValue;
    }
}