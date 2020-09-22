<template>
    <div class="app">

        <div style="display: flex; align-items: center; margin-bottom: 10px;">
            <div class="bulb">
                <div :class="'bulb__lamp ' + ( work_A.isActive === true ? 'bulb__lamp_active' : '') "></div>
            </div>
            <div :class="'wrapper ' +  ( work_A.isActive === false ? 'wrapper_disable' : '')  ">
                <div class="task" v-for="task in work_A.tasks">
                    <div v-for="part in task.parts"
                         :class="part.type"
                         :style="'width: ' + part.size + 'px'">
                    </div>
                </div>
                <div class="task" style="visibility: hidden">
                    <div class="proc"></div>
                </div>
            </div>
            <div style="margin-left: 20px">
                <button @click="addTask('A')">+</button>
            </div>
        </div>

        <div style="display: flex; align-items: center">
            <div class="bulb">
                <div :class="'bulb__lamp ' + ( work_B.isActive === true ? 'bulb__lamp_active' : '') "></div>
            </div>
            <div :class="'wrapper ' +  ( work_B.isActive === false ? 'wrapper_disable' : '')  ">
            <div class="task" v-for="task in work_B.tasks">
                    <div v-for="part in task.parts"
                         :class="part.type"
                         :style="'width: ' + part.size + 'px'">
                    </div>
                </div>
                <div class="task" style="visibility: hidden">
                    <div class="proc"></div>
                </div>
            </div>
            <div style="margin-left: 20px">
                <button @click="addTask('B')">+</button>
            </div>
        </div>
        <div class="status">
            <div class="status__type">
                <div class="perf"> {{ perfTitle }}</div>
                {{ getPercent(computer.countPerf / countTik * 100) }} %
            </div>
            <div class="status__type">
                <div class="proc"> {{ procTitle }}</div>
                {{ getPercent(computer.countProc / countTik * 100) }} %
            </div>
        </div>

        <div class="control-pane" style="margin-top: 50px">
            <div style="margin-bottom: 10px">
                <input type="range" v-model="speed" min="1" max="32"> {{ tikSpeed }}
            </div>
            <div style="margin-bottom: 10px">
                <button style="width: 25px; height: 25px" @click="tik"> +</button>
                iteration
            </div>
            <div style="margin-bottom: 10px; display: flex; align-items: center">
                <div style="margin-right: 30px">
                    <label class="switch">
                        <input type="checkbox" v-model="power">
                        <span class="slider round"></span>
                    </label>
                </div>
                <div>
                    {{ power === true ? "ON" : "OFF" }}
                </div>
            </div>
        </div>
    </div>


</template>

<script>

import Canal from "@/js/Canal";

import Greeter from "@/js/Greeter.ts";

import {initCanal} from "@/js/InitData"

export default {
    data() {
        return {
            power: false,
            width: 30,
            tikSpeed: 400,
            speed: 20,
            step: 1,
            countTik: 0,
            computer: {
                perf: null,
                countPerf: 0,
                proc: null,
                countProc: 0,
            },
            canals:[],
            work_A: {
                isActive: "",
                type: "A",
                tasks: [
                    {
                        parts: [
                            {type: "perf", size: 50},
                            {type: "proc", size: 300},
                            {type: "perf", size: 50},
                            {type: "proc", size: 170},
                            {type: "perf", size: 100},// начало отсюда
                        ]
                    },
                    {
                        parts: [
                            {type: "perf", size: 300},
                            {type: "proc", size: 300},
                            {type: "perf", size: 500},
                            {type: "proc", size: 170},
                            {type: "perf", size: 100},// начало отсюда
                        ]
                    },
                ]
            },
            work_B: {
                isActive: "",
                type: "B",
                tasks: [
                    {
                        parts: [
                            {type: "proc", size: 70},
                            {type: "perf", size: 86},
                            {type: "perf", size: 10},
                            {type: "proc", size: 50},
                            {type: "perf", size: 20},// начало отсюда
                        ]
                    },
                    {
                        parts: [
                            {type: "perf", size: 90},
                            {type: "proc", size: 53},
                            {type: "perf", size: 130},
                            {type: "proc", size: 80},
                            {type: "perf", size: 40},// начало отсюда
                        ]
                    },
                ]
            },
            works: {}

        }
    },
    computed: {
        perfTitle() {
            if (this.computer.perf != null)
                return this.computer.perf.type;
            return "";
        },
        procTitle() {
            if (this.computer.proc != null)
                return this.computer.proc.type;
            return "";
        }
    },
    mounted() {

        let canal_A = new Canal("A");
        initCanal(canal_A);
        this.canals.push(canal_A);

        let canal_B = new Canal("B");
        initCanal(canal_B);
        this.canals.push(canal_B);




        this.works["A"] = this.work_A;
        this.works["B"] = this.work_B;
        // среди задач выбираем на переферию
        for (let key in this.works) {
            let work = this.works[key];
            if (work.tasks[0].parts[0].type === "perf") {
                if (this.computer.perf === null) {
                    this.computer.perf = work;
                }
            } else if (work.tasks[0].parts[0].type === "proc") {
                if (this.computer.proc === null) {
                    this.computer.proc = work;
                }
            }
        }

        let iter = (function () {
            setTimeout(() => {
                if (this.power) {
                    this.tik();
                }
                iter();
            }, this.tikSpeed)
        }).bind(this);

        iter();
    },

    methods: {
        tik() {
            this.countTik++;
            let i = 0;
            // perf
            if (this.computer.perf != null && this.computer.perf.tasks.length > 0) {
                let currentTask = this.computer.perf.tasks[0];
                if (currentTask.parts.length > 0) {
                    let currentPart = currentTask.parts[0];

                    // Если после этого тика задача закончится
                    if ((currentPart.size - this.step) <= 0) {
                        currentTask.parts.splice(i, 1);

                        if (currentTask.parts.length === 0) {
                            let tmp = this.computer.perf;
                            this.removeTask(tmp);
                        }

                        this.computer.perf = null;
                        // выбираем новую задачу на проц и перефирию
                    } else {
                        currentPart.size -= this.step;
                    }
                } else {
                    this.work_A.tasks.splice(0, 1);
                }
            }

            // proc
            if (this.computer.proc != null && this.computer.proc.tasks.length > 0) {
                let currentTask = this.computer.proc.tasks[0];
                if (currentTask.parts.length > 0) {
                    let currentPart = currentTask.parts[0];

                    // Если после этого тика задача закончится
                    if ((currentPart.size - this.step) <= 0) {
                        currentTask.parts.splice(i, 1);

                        if (currentTask.parts.length === 0) {
                            let tmp = this.computer.perf;
                            this.removeTask(tmp);
                        }

                        this.computer.proc = null;
                        // выбираем новую задачу на проц и перефирию
                    } else {
                        currentPart.size -= this.step;
                    }
                } else {
                    this.work_A.tasks.splice(0, 1);
                }
            }

            this.lampReload();
            if (this.computer.perf === null) {
                this.perfFreed();
            } else {
                this.computer.countPerf++;
            }
            if (this.computer.proc === null) {
                this.procFreed();
            } else {
                this.computer.countProc++;
            }


        },
        // Если такс закончился в одном из типов работа, Удалим его
        removeEmptyTask(work) {

        },
        // периферия освободилась
        perfFreed() {
            this.computer.perf = null;
            let keys = shuffle(["A", "B"]);
            // среди задач выбираем на переферию
            keys.forEach(key => {
                let work = this.works[key];
                if (work.tasks.length > 0 && work.tasks[0].parts[0].type === "perf") {
                    if (this.computer.perf === null) {
                        this.computer.perf = work;
                    }
                }
            })
        },
        // Проц освободился, назначаем ему задачу
        procFreed() {
            this.computer.proc = null;
            let keys = shuffle(["A", "B"]);
            // среди задач выбираем на переферию
            keys.forEach(key => {
                let work = this.works[key];
                if (work.tasks.length > 0 && work.tasks[0].parts[0].type === "proc") {
                    if (this.computer.proc === null) {
                        this.computer.proc = work;
                    }
                }
            })
        },

        // task end, нужно удалить его из списка
        removeTask(tmp) {
            if (tmp.type === "A") {
                this.work_A.tasks.splice(0, 1);
            } else if (tmp.type === "B") {
                this.work_B.tasks.splice(0, 1);
            }
        },
        tikSpeedPlus() {
            this.tikSpeed += 10;
        },
        tikSpeedMinus() {
            this.tikSpeed -= 10;
            if (this.tikSpeed < 10) {
                this.tikSpeed = 10;
            }
        },
        addTask(type) {
            switch (type) {
                case "A": {
                    let task = {
                        parts: [
                            {type: "perf", size: 50},
                            {type: "proc", size: 300},
                            {type: "perf", size: 50},
                            {type: "proc", size: 170},
                            {type: "perf", size: 100},// начало отсюда
                        ]
                    };
                    this.work_A.push(task);
                }
            }
        },

        getPercent(percent) {
            if (!isNaN(percent))
                return percent.toFixed(1);
            else
                return "---";
        },
        //
        lampReload(tmp) {
            let A_show = false;
            let B_show = false;
            if (this.computer.proc !== null) {
                switch (this.computer.proc.type) {
                    case "A": {
                        A_show = true;
                        break;
                    }
                    case "B": {
                        B_show = true;
                        break;
                    }
                    default: {
                        throw new Error(" type not found, in lampReload()");
                    }
                }
            }
            if (this.computer.perf !== null) {
                switch (this.computer.perf.type) {
                    case "A": {
                        A_show = true;
                        break;
                    }
                    case "B": {
                        B_show = true;
                        break;
                    }
                    default: {
                        throw new Error(" type not found, in lampReload()");
                    }
                }
            }

            if (this.work_A.isActive !== A_show)
                this.work_A.isActive = A_show

            if (this.work_B.isActive !== B_show)
                this.work_B.isActive = B_show
        }
    },
    watch: {
        speed: function (val) {
            this.tikSpeed = val * val;
        },
    },
}

function shuffle(array) {
    let result = [];
    while (array.length !== 0) {
        let x = randomInteger(0, array.length - 1);
        result.push(array[x]);
        array.splice(x, 1);
    }
    return result;
}

function randomInteger(min, max) {
    // получить случайное число от (min-0.5) до (max+0.5)
    let rand = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(rand);
}
</script>