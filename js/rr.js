dummyAnimate = function(task, numTimeUnits) {
    console.log("Task: " + task.id + ", time: " + numTimeUnits);
}

/**
 * @param taskConfig An config object, {
 *                   tasks: an array of objects with {id, total, arrival} representing the tasks to run
 *                   config: task specific config, irrelevant for SJF
 *                   }
 * @param animate An animation callback taking as args the task object and the amount of time to run
 *                it for (in absolute units).
 * 
 * A test case is
 *  {tasks: [{id: "task1", total: 10, arrival: 1}, 
 *           {id: "task2", total: 5, arrival: 4}, 
 *           {id: "task3", total: 2, arrival: 6}]}
 *
 * The order of execution should be:
 *     task1 for 3 units
 *     task2 for 2 units
 *     task3 for 2 units
 *     task2 for 3 units
 *     task1 for 7 units
 */
schedule = function(taskConfig, animate) {
    var time = 0;

    var timeSlice = taskConfig.config.timeSlice;
    var tasks = taskConfig.tasks.slice(0);
    $.each(tasks, function(i, n) {
        n.timeLeft = n.total;
    });

    var rebuildTaskQueue = function(queue) {
        if (queue.length) {
            justFinished = queue.shift();
            // console.log("Finished " + justFinished.id);
            justFinished.done = true;
            if (justFinished.timeLeft) {
                queue.push(justFinished);
            }
        }

        available = $.grep(tasks, function (elem) {
            return elem.arrival <= time;
        }).sort(function (lhs, rhs) {
            return lhs.arrival - rhs.arrival;
        });
        $.each(available, function (i, elem) {
            elem.done = false;
        });

        // find first task that already performed in this round, insert newly available tasks 
        // in queue before it
        // console.log("Available at time " + time + ": ");
        // console.log(available);
        insertIdx = queue.length;
        for (var i = 0; i < queue.length; ++i) {
            currTask = queue[i];
            if (currTask.done) {
                insertIdx = i;
                break;
            }
        }
        front = queue.slice(0, insertIdx);
        back = queue.slice(insertIdx);
        queue = front.concat(available);
        queue = queue.concat(back);
        tasks = tasks.filter(function (elem) { return elem.arrival > time; });

        // If no elems exist with work to do, current round is over. Reset all states for next
        // round.
        if (!queue.some(function (elem) { return !elem.done; })) {
            $.each(queue, function (i, elem) {
                elem.done = false;
            });
        }

        return queue;
    };

    // TODO: remove this for release
    // sanity check for infinite loop
    debugFailover = 100;
    queue = rebuildTaskQueue([], tasks);
    while (debugFailover && (queue.length || $.grep(tasks, function (elem) { return elem.timeLeft; }).length)) {
        if (queue.length) {
            task = queue[0];
            runTime = task.timeLeft < timeSlice ? task.timeLeft : timeSlice;
            animate(task, runTime);
            task.timeLeft -= runTime;
            time += runTime;
        } else {
            time++;
        }
        debugFailover--;
        queue = rebuildTaskQueue(queue);
    }
}
