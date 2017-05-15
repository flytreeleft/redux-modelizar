import MyElement from './MyElement';

class ImageElement extends MyElement {
    constructor(options = {}) {
        super(options);
        this.tag = 'img';
        this.src = null;
    }

    removeChildren() {
        // Doing nothing
    }

    addChildren() {
        // Doing nothing
    }
}

export default ImageElement;
