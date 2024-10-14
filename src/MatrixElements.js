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
        this.width = 25;
        this.height = 25;

    }

    render(ctx) {
        this.ctx.fillStyle = "#DEE";
        this.ctx.fillRect(this.x, this.y, this.width, this.height);

        this.ctx.fillStyle = "#000";
        this.ctx.font = "14p Arial";
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