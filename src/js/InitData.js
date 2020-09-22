import Canal from "@/js/Canal";
import Task from "@/js/Task";
import Part from "@/js/Part";
/**
 *
 * @param canal {Canal}
 */
function initCanal(canal) {
    if (canal.type === "B") {
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

        canal.tasks.push(task_1, task_2);
    }
    if (canal.type === "A") {
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

        canal.tasks.push(task_1, task_2);
    }
}

module.exports = {
    initCanal: initCanal,
};
