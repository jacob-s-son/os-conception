dummyAnimate = function(task, numTimeUnits) {
    console.log("Task: " + task.id + ", time: " + numTimeUnits);
}

/**
 * @param taskConfig An array of objects with {id, total, arrival} representing the tasks to run
 * @param animate An animation callback taking as args the task object and the amount of time to run
 *                it for (in absolute units).
 */
schedule = function(taskConfig, animate) {
    var tasks = taskConfig.slice(0);
    $.each(tasks, function(i, n) {
        n.timeLeft = n.total;
    });
    
    var selectTaskToRun = function(taskConfig) {
        if (!taskConfig.length) {
            return null;
        } else {
            // Finds min by arrival that still has work to be done. If jQ has a min() taking a lambda, rewrite.
            var toRun = taskConfig[0];
            $.each(taskConfig, function(i, n) {
                if (n.arrival < toRun.arrival && n.timeLeft || !toRun.timeLeft) {
                    toRun = n;
                }
            });
            if (toRun.timeLeft) {
                return toRun;
            } else {
                return null;
            }
        }
    };
    // TODO: remove this for release
    // sanity check for infinite loop
    debugFailover = 100;
    task = selectTaskToRun(tasks);
    while (task && debugFailover) {
        animate(task, task.timeLeft);
        task.timeLeft = 0;
        task = selectTaskToRun(tasks);
        debugFailover--;
    }
}
