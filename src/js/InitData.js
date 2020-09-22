'use strict';

import Canal from "@/js/Canal";
import Task from "@/js/Task";
import Part from "@/js/Part";
import {randomNormal} from "@/js/RandomGauss";

import * as _ from 'lodash';


// let A_setting = {
//     proc: 0.80, // процент процессорного времени
//     perf: 0.20, // процент периферийного времени
//     countPartMin: 5,    // минимальное количество частей( процессор, или периферия) из которой состоит задача
//     countPartMax: 10,   // максимальное количество частей( процессор, или периферия) из которой состоит задача
//     sizeMin: 10,    // минимальный размер части в условных единицах
//     sizeMax: 50     // максимальный размер части в условных единицах
// }
let A_setting = {proc: 0.80, perf: 0.20, countPartMin: 10, countPartMax: 15, sizeMin: 10, sizeMax: 50}
let B_setting = {proc: 0.60, perf: 0.40, countPartMin: 10, countPartMax: 15, sizeMin: 10, sizeMax: 50}
let C_setting = {proc: 0.40, perf: 0.60, countPartMin: 10, countPartMax: 15, sizeMin: 10, sizeMax: 50}

/**
 *
 * @param canal {Canal}
 */
function initCanal(canal, isConcatSamePart = false) {
    if (canal.type === "A") {

        for (let i = 0; i < 20; i++) {
            let task = new Task();
            task.parts = generateTask(A_setting, isConcatSamePart);
            canal.tasks.push(task);
        }

    } else if (canal.type === "B") {
        for (let i = 0; i < 20; i++) {
            let task = new Task();
            task.parts = generateTask(B_setting, isConcatSamePart);
            canal.tasks.push(task);
        }
    } else if (canal.type === "C") {
        for (let i = 0; i < 20; i++) {
            let task = new Task();
            task.parts = generateTask(C_setting, isConcatSamePart);
            canal.tasks.push(task);
        }
    }
}


function generateTask(settings, isConcatSamePart) {
    // Количество частей, полный рандом
    let countPart = randomInteger(settings.countPartMin, settings.countPartMax);

    // генерируем задачи для проца
    let task_proc = [];
    let proc_sizeAll = 0;
    for (let i = 0; i < countPart * settings.proc; i++) {
        let x = 0;
        do {
            // размер задачи - случайное число по закону нормального распределения
            x = Math.round(randomNormal(settings.sizeMin, settings.sizeMax, 0, 4, 5));
        } while (x <= settings.sizeMin || x >= settings.sizeMax)
        proc_sizeAll += x; // считаем общее время прцоессора
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
        perf_sizeAll += x;  // общее время периферии
        task_perf.push(new Part("perf", x));
    }
    // Отношение между временем проца и перф которое задано в настройках
    let needRelation = settings.proc / settings.perf;
    // которое получили
    let currentRelation = proc_sizeAll / perf_sizeAll;

    // Если проца  меньше
    if (needRelation > currentRelation) {
        let indexProcPlus = 0;
        // то пока отношение не будет удовлетворять настройкам
        while (needRelation > currentRelation) {
            // добавляем размеры к частям процессора, чтобы добиться нужного соотношения
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
    // let proc_generated_percent = proc_sizeAll / (proc_sizeAll + perf_sizeAll);
    // let perf_generated_percent = perf_sizeAll / (proc_sizeAll + perf_sizeAll);

    let result = createRandomOrderArr(task_proc.concat(task_perf));
    if (isConcatSamePart) {
        for (let i = 0; i < result.length - 1; i++) {
            if (result[i].type === result[i + 1].type) {
                result[i].size += result[i + 1].size
                result.splice(i, 1);
                i--
            }
        }
    }

    return result;
}

function randomInteger(min, max) {
    // случайное число от min до (max+1)
    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
}

// перемещиваем массив
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