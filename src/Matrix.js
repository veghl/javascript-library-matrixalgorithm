export class Matrix {
    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;
        this.matrix = Array.from({ length: rows }, () => Array(cols).fill(0));
    }
}