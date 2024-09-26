export class Matrix {
    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;
        this.data = this.createMatrix();
    }

    createMatrix() {
        return Array.from({ length: this.rows }, () => Array(this.cols).fill(0));
    }
}