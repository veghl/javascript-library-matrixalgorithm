import {MatrixData} from "./MatrixData.js";

export class MatrixCode extends MatrixData {
    constructor(code) {
        super();
        this.code = code;
        this.selected = [];
        this.selectionColor = '#7bbaa7'
    }

    render() {
        this.ctx.font = "bold 16px Courier New";
        const maxWidth = Math.max(...this.code.map(line => this.ctx.measureText(line).width));

        this.ctx.fillStyle = this.selectionColor;
        this.selected.forEach(selectedIndex => {this.ctx.fillRect(this.x, this.y + selectedIndex * 22, maxWidth + 20, 20 );})

        this.ctx.fillStyle = "#000";
        this.ctx.textAlign = "left";
        this.ctx.textBaseline = "top";
        this.code.forEach((line, i) => {
            this.ctx.fillText(line, this.x + 20, this.y + 1 + i * 22);
        })
    }

}