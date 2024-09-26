export default class LoopVariable {
    constructor (name, initialValue) {
        this.name = name;
        this.value = initialValue;
    }

    newValue (newValue) {
        this.value = newValue;
    }
}