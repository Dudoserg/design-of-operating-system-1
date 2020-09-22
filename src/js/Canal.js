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

    /**
     *
     * @param type {String}
     */
    constructor(type) {


        this.type = type;
        this.isLampActive = false;

    }




}

export default Canal;