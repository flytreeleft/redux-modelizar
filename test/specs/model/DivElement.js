import MyElement from './MyElement';

class DivElement extends MyElement {
    constructor(options = {}) {
        super(options);
        this.tag = 'div';
    }
}

export default DivElement;
