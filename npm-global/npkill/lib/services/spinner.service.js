"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SpinnerService {
    constructor() {
        this.spinner = [];
        this.count = -1;
    }
    setSpinner(spinner) {
        this.spinner = spinner;
        this.reset();
    }
    nextFrame() {
        this.updateCount();
        return this.spinner[this.count];
    }
    reset() {
        this.count = -1;
    }
    updateCount() {
        if (this.isLastFrame())
            this.count = 0;
        else
            ++this.count;
    }
    isLastFrame() {
        return this.count === this.spinner.length - 1;
    }
}
exports.SpinnerService = SpinnerService;
