<template>
    <div class="app">
<!--        <canvas id="myCanvas" width="501" height="501" style="border:1px solid #000000;"></canvas>-->
        <div v-for="canal in canals.canals"
             style="display: flex; align-items: center; margin-bottom: 10px;"
        >
            <div class="bulb">
                {{ canal.type }}
                <div :class="'bulb__lamp ' + ( canal.isActive === true ? 'bulb__lamp_active' : '') "></div>
            </div>
            <div :class="'wrapper ' +  ( canal.isActive === false ? 'wrapper_disable' : '')  ">
                <div class="task" v-for="task in canal.tasks">
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
import Canals from "@/js/Canals";
import {initCanal} from "@/js/InitData"
import {draw} from "@/js/DrawLine";

import {randomNormal} from "@/js/RandomGauss";

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
            canals: new Canals(),

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

        // function rand_gen() {
        //     // return a uniformly distributed random value
        //     return ((Math.random()) + 1.) / ((1.0) + 1.);
        // }
        //
        // function normalRandom() {
        //     // return a normally distributed random value
        //     let v1 = rand_gen();
        //     let v2 = rand_gen();
        //     return Math.cos(2 * 3.14 * v2) * Math.sqrt(-2. * Math.log(v1));
        // }
        function normalRandom(min, max, skew) {
            let u = 0, v = 0;
            while (u === 0) u = Math.random(); //Converting [0,1) to (0,1)
            while (v === 0) v = Math.random();
            let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);

            num = num / 10.0 + 0.5; // Translate to 0 -> 1
            if (num > 1 || num < 0) num = randn_bm(min, max, skew); // resample between 0 and 1 if out of range
            num = Math.pow(num, skew); // Skew
            num *= max - min; // Stretch to fill range
            num += min; // offset to min
            return num;
        }
        function normal(mu, sigma, nsamples){
            if(!nsamples) nsamples = 6
            if(!sigma) sigma = 1
            if(!mu) mu=0

            var run_total = 0
            for(var i=0 ; i< nsamples ; i++){
                run_total += Math.random()
            }

            return sigma*(run_total - nsamples/2)/(nsamples/2) + mu
        }
        let arr = [];
        let iteration = 100000;
        let sigma = 1.0;
        let Mi = 0.0;
        for (let i = 0; i < 500; i++) {
            arr[i] = 0;
        }
        for (let i = 0; i < iteration; i++) {
            // let x = normalRandom(0, 500, 1) * sigma + Mi;
            // let x = (normal(0, 3, 5) + 1 ) * 250;
            let x = randomNormal(0, 500, 0, 4, 5);

            arr[Math.round(x)]++;
            // console.log(x);
        }
        // draw(arr, "myCanvas");

        let canal_A = new Canal("A");
        initCanal(canal_A, true);
        this.canals.canals.push(canal_A)

        let canal_B = new Canal("B");
        initCanal(canal_B, true);
        this.canals.canals.push(canal_B)

        let canal_C = new Canal("C");
        initCanal(canal_C, true);
        this.canals.canals.push(canal_C)

        // среди задач выбираем на переферию
        this.canals.canals.forEach((canal, index, array) => {
            if (canal.tasks[0].parts[0].type === "perf") {
                if (this.computer.perf === null) {
                    this.computer.perf = canal;
                }
            } else if (canal.tasks[0].parts[0].type === "proc") {
                if (this.computer.proc === null) {
                    this.computer.proc = canal;
                }
            }
        })


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
                            let tmp = this.computer.proc;
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
            let randomOrder = createRandomOrderArr(this.canals.canals);

            // test createRandomOrderArr
            // let result = [];
            // for(let i = 0 ; i < 100000; i++){
            //     let randomOrder = createRandomOrderArr(this.canals.canals);
            //     let x = randomOrder[0].id;
            //     let str = (randomOrder[0].id + '') + (randomOrder[1].id + '')  + (randomOrder[2].id + '');
            //     let resultElement = result[str];
            //     if( typeof  resultElement === "undefined")
            //         result[str] = 1;
            //     else
            //         result[str]++;
            // }

            console.log(randomOrder[0].id + "\t" + randomOrder[1].id + "\t" + randomOrder[2].id);
            // среди задач выбираем на переферию
            randomOrder.forEach(canal => {
                if (canal.tasks.length > 0) {
                    if (canal.tasks[0].parts.length > 0) {
                        let part = canal.tasks[0].parts[0];
                        if (part.type === "perf") {
                            if (this.computer.perf === null) {
                                this.computer.perf = canal;
                                return;
                            }
                        }
                    }
                }
            })
        },
        // Проц освободился, назначаем ему задачу
        procFreed() {
            this.computer.proc = null;
            // let keys = shuffle(["A", "B"]);
            let randomOrder = createRandomOrderArr(this.canals.canals);
            // среди задач выбираем на проц
            randomOrder.forEach(canal => {
                if (canal.tasks.length > 0) {
                    if (canal.tasks[0].parts.length > 0) {
                        let part = canal.tasks[0].parts[0];
                        if (part.type === "proc") {
                            if (this.computer.proc === null) {
                                this.computer.proc = canal;
                            }
                        }
                    }
                }
            })
        },

        // task end, нужно удалить его из списка
        removeTask(tmp) {
            for (let i = 0; i < this.canals.canals.length; i++) {
                let currentCanal = this.canals.canals[i];
                let q_1 = currentCanal.type;
                let q_2 = tmp.type;
                if (q_1 === q_2) {
                    this.canals.canals[i].tasks.splice(0, 1);
                }
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
        },

        getPercent(percent) {
            if (!isNaN(percent))
                return percent.toFixed(1);
            else
                return "---";
        },
        //
        lampReload(tmp) {
            this.canals.canals.forEach(canal => {
                canal.isActive = false;
            })
            let canalProc;      // канал, который сейчас обрабатывается процессором
            let canalPerf;      // канал, который сейчас обрабатывается процессором
            this.canals.canals.forEach(canal => {
                if (this.computer.proc !== null) {
                    if (this.computer.proc.id === canal.id) {
                        if (canal.isActive !== true) {
                            canal.isActive = true;
                        }
                        canalProc = canal;
                    }
                }
                if (this.computer.perf !== null) {
                    if (this.computer.perf.id === canal.id) {
                        if (canal.isActive !== true) {
                            canal.isActive = true;
                        }
                        canalPerf = canal;
                    }
                }
            })

            // this.canals.canals.forEach(canal => {
            //     // Если она ща включен
            //     if (canal.isActive === true) {
            //         let status = true;
            //         if (canalProc != null) {
            //             if (canalProc.id !== canal.id)
            //                 status = false;
            //         }
            //         if (canalPerf != null)
            //             if (canalPerf.id !== canal.id)
            //                 status = false;
            //         if (status === false && canal.isActive !== false)
            //             canal.isActive = status;
            //     }
            // })
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

function createRandomOrderArr(arr) {
    let result = [];
    //copy
    for (let i = 0; i < arr.length; i++) {
        result[i] = arr[i];
    }
    return shuffle(result);
}
</script>