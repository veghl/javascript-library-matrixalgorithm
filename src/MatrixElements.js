export class MatrixElement {
    constructor(value, x, y, size) {
        this.value = value;
        this.x = x;
        this.y = y;
    }

    updateValue(newValue) {
        this.value = newValue;
    }
}