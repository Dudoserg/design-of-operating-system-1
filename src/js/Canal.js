'use strict';
import Task from "@/js/Task";
class Canal{

    /**
     *
     * @type {string}
     */
    type = "";


    /**
     *
     * @type {Array.<Task>}
     */
    tasks = [];

    static #idCounter = 1;

    /**
     *
     * @param type {String}
     */
    constructor(type) {
        this.id = (Canal.#idCounter++)

        this.type = type;
        this.isActive = false;

    }




}

export default Canal;