import {MatrixData} from "./MatrixData.js";

export class MatrixButton extends MatrixData{
    constructor(text, width, clickFcn) {
        super();
        this.x = 0;
        this.y = 0;
        this.text = text;
        this.width = width;
        this.height = 28;
        this.enabled = true;
        this.clicked = false;
        this.clickFcn = clickFcn;
        this.color = "#579F6E";

        this.font = "bold 16px Arial";
        this.strokeColor = "#FFF";
        this.defaultColor = "#579F6E";
        this.disabledColor = "#999";
        this.overColor = "#357D4B";
    }

    render(ctx) {
        if (this.width > 0) {
            if (this.enabled === true) {
                this.ctx.fillStyle = this.color;
            } else {
                this.ctx.fillStyle = this.disabledColor;
            }
            this.ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
            this.ctx.strokeStyle = this.color;
            this.ctx.strokeRect(this.x - this.width / 2 - 0.5 , this.y - this.height / 2 - 0.5, this.width + 1, this.height + 1);
            if (this.enabled === true) {
                this.ctx.fillStyle = this.strokeColor;
            } else {
                this.ctx.fillStyle = "#000";
            }
            this.ctx.font = this.font;
            this.ctx.textAlign = "center";
            this.ctx.textBaseline = "middle";
            this.ctx.fillText(this.text, this.x, this.y);
        }
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
}