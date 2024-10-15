import {MatrixData} from "./MatrixData.js";

export class MatrixElement extends MatrixData {
    constructor(name, value, changeable) {
        super();
        if (typeof changeable === "undefined") {
            changeable = false;
        }
        this.name = name;
        this.value = value;
        this.changeable = changeable;
        this.minValue = 0;
        this.maxValue = 0;
        this.width = 30; //default width of the variable
        this.height = 30; //default height of the variable

        this.defaultColor = '#DEE';
        this.redColor = '#FF0000';
        this.greenColor = '#00FF00';
        this.grayColor = '#999999';
        this.strokeColor = '#000000';
    }

    render(ctx) {
        this.ctx.fillStyle = this.defaultColor;
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
        this.ctx.strokeStyle = this.strokeColor;
        this.ctx.strokeRect(this.x, this.y, this.width, this.height);

        this.ctx.fillStyle = this.strokeColor;
        this.ctx.font = "16px Arial";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";

        this.centerX = this.x + this.width / 2;
        this.centerY = this.y + this.height / 2;
        this.ctx.fillText(this.value, this.centerX, this.centerY);
    }



    updateValue(newValue) {
        this.value = newValue;
    }
}