'use strict';


class Part{
    /**
     *
     * @type {string}
     */
    type = "";
    /**
     *
     * @type {number}
     */
    size = 0;

    /**
     *
     * @param type {string}
     * @param size {number}
     */
    constructor(type, size) {
        this.type = type;
        this.size = size;
    }
}

export default Part;