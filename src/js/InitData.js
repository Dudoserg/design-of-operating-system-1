'use strict';

import Canal from "@/js/Canal";
import Task from "@/js/Task";
import Part from "@/js/Part";
import {randomNormal} from "@/js/RandomGauss";

import * as _ from 'lodash';


let A_setting = {proc: 0.80, perf: 0.20, countPartMin: 5, countPartMax: 10, sizeMin: 10, sizeMax: 50}
let B_setting = {proc: 0.60, perf: 0.40, countPartMin: 7, countPartMax: 16, sizeMin: 10, sizeMax: 30}
let C_setting = {proc: 0.40, perf: 0.60, countPartMin: 15, countPartMax: 25, sizeMin: 10, sizeMax: 20}

/**
 *
 * @param canal {Canal}
 */
function initCanal(canal) {
    if (canal.type === "A") {

        for (let i = 0; i < 20; i++) {
            let task = new Task();
            task.parts = createRandomOrderArr(generateTask(A_setting));
            canal.tasks.push(task);
        }

    } else if (canal.type === "B") {
        for (let i = 0; i < 20; i++) {
            let task = new Task();
            task.parts = createRandomOrderArr(generateTask(B_setting));
            canal.tasks.push(task);
        }
    } else if (canal.type === "C") {
        for (let i = 0; i < 20; i++) {
            let task = new Task();
            task.parts = createRandomOrderArr(generateTask(C_setting));
            canal.tasks.push(task);
        }
    }
}


function generateTask(settings) {
    // Количество частей, полный рандом
    let countPart = randomInteger(settings.countPartMin, settings.countPartMax);

    // генерируем задачи для проца
    let task_proc = [];
    let proc_sizeAll = 0;
    for (let i = 0; i < countPart * settings.proc; i++) {
        let x = 0;
        do {
            x = Math.round(randomNormal(settings.sizeMin, settings.sizeMax, 0, 4, 5));
        } while (x <= settings.sizeMin || x >= settings.sizeMax)
        proc_sizeAll += x;
        task_proc.push(new Part("proc", x));
    }
    // генерируем задачи для периферии
    let task_perf = [];
    let perf_sizeAll = 0;
    for (let i = 0; i < countPart * settings.perf; i++) {
        let x = 0;
        do {
            x = Math.round(randomNormal(settings.sizeMin, settings.sizeMax, 0, 4, 5));
        } while (x <= settings.sizeMin || x >= settings.sizeMax)
        perf_sizeAll += x;
        task_perf.push(new Part("perf", x));
    }
    let needRelation = settings.proc / settings.perf;
    let currentRelation = proc_sizeAll / perf_sizeAll;

    // Если проца сильно меньше
    if (needRelation > currentRelation) {
        let indexProcPlus = 0;
        while (needRelation > currentRelation) {
            // добавляем размеры частей проца
            task_proc[indexProcPlus++].size++;
            if (indexProcPlus >= task_proc.length)
                indexProcPlus = 0;
            currentRelation = (++proc_sizeAll) / perf_sizeAll;
            console.log("=");
        }
    } else {
        // проса сильно больше
        let indexPerfPlus = 0;
        while (needRelation < currentRelation) {
            // добавляем размеры частей периферии
            task_perf[indexPerfPlus++].size++;
            if (indexPerfPlus >= task_perf.length)
                indexPerfPlus = 0;
            currentRelation = proc_sizeAll / (++perf_sizeAll);
            console.log("=");
        }
    }
    // проверка, вроде норм
    // proc_sizeAll = 0;
    // task_proc.forEach(value => {
    //     proc_sizeAll += value.size;
    // })
    // perf_sizeAll = 0;
    // task_perf.forEach(value => {
    //     perf_sizeAll += value.size;
    // })
    let proc_generated_percent = proc_sizeAll / (proc_sizeAll + perf_sizeAll);
    let perf_generated_percent = perf_sizeAll / (proc_sizeAll + perf_sizeAll);

    return task_proc.concat(task_perf);
}

function randomInteger(min, max) {
    // случайное число от min до (max+1)
    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
}

function createRandomOrderArr(arr) {
    let result = [];
    //copy
    for (let i = 0; i < arr.length; i++) {
        result[i] = arr[i];
    }
    return shuffle(result);
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


export {initCanal}