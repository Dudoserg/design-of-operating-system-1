'use strict';

import Canal from "@/js/Canal";
import Task from "@/js/Task";
import Part from "@/js/Part";


let A_setting = {proc: 75, perf: 25, countPartMin: 10, countPartMax: 20, sizeMin: 10, sizeMax: 50}
let B_setting = {proc: 65, perf: 35}
let C_setting = {proc: 60, perf: 40}

/**
 *
 * @param canal {Canal}
 */
function initCanal(canal) {
    if (canal.type === "A") {

        // Количество частей
        let countPart = randomInteger(A_setting.countPartMin, A_setting.countPartMax);


        let task_1 = new Task();
        task_1.parts.push(new Part("perf", 50));
        task_1.parts.push(new Part("proc", 300));
        task_1.parts.push(new Part("perf", 50));
        task_1.parts.push(new Part("proc", 170));
        task_1.parts.push(new Part("perf", 100));   // начало отсюда

        let task_2 = new Task();
        task_2.parts.push(new Part("perf", 300));
        task_2.parts.push(new Part("proc", 210));
        task_2.parts.push(new Part("perf", 170));
        task_2.parts.push(new Part("proc", 370));
        task_2.parts.push(new Part("perf", 100));   // начало отсюда

        canal.tasks.push(task_1);
        canal.tasks.push(task_2);
    } else if (canal.type === "B") {
        let task_1 = new Task();
        task_1.parts.push(new Part("proc", 70));
        task_1.parts.push(new Part("perf", 86));
        task_1.parts.push(new Part("perf", 10));
        task_1.parts.push(new Part("proc", 50));
        task_1.parts.push(new Part("perf", 20));   // начало отсюда
        let task_2 = new Task();
        task_2.parts.push(new Part("perf", 90));
        task_2.parts.push(new Part("proc", 53));
        task_2.parts.push(new Part("perf", 130));
        task_2.parts.push(new Part("proc", 80));
        task_2.parts.push(new Part("perf", 40));   // начало отсюда

        canal.tasks.push(task_1);
        canal.tasks.push(task_2);
    } else if (canal.type === "C") {
        let task_1 = new Task();
        task_1.parts.push(new Part("perf", 30));
        task_1.parts.push(new Part("proc", 70));
        task_1.parts.push(new Part("perf", 10));
        task_1.parts.push(new Part("proc", 100));
        task_1.parts.push(new Part("perf", 20));
        task_1.parts.push(new Part("proc", 70));
        task_1.parts.push(new Part("perf", 20));   // начало отсюда

        canal.tasks.push(task_1);
    }
}


function randomInteger(min, max) {
    // случайное число от min до (max+1)
    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
}



function randn_bm(min, max, skew) {

    let u = 0, v = 0;
    while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while(v === 0) v = Math.random();
    let num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );

    num = num / 10.0 + 0.5; // Translate to 0 -> 1
    if (num > 1 || num < 0) num = randn_bm(min, max, skew); // resample between 0 and 1 if out of range
    num = Math.pow(num, skew); // Skew
    num *= max - min; // Stretch to fill range
    num += min; // offset to min
    return num;
}

export {initCanal}