import {MatrixData} from "./MatrixData.js";

export class MatrixButton extends MatrixData{
    constructor(text, width, clickFcn) {
        super();
        this.x = 0;
        this.y = 0;
        this.width = width;
        this.height = 30;
        this.enabled = true;
        this.clicked = false;
        this.clickFcn = clickFcn;

    }

    render(ctx) {
        if (this.width > 0) {
            if (this.enabled === true) {

            }
        }
    }
}