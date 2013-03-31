(function() {
    App.Schedulers.SJF = (function() {

        function SJF() {
        }
        /**
         * @param taskConfig An config object, {
         *                   tasks: an array of objects with {id, total, arrival} representing the tasks to run
         *                   config: task specific config, irrelevant for SJF
         *                   }
         * @param animate An animation callback taking as args the task object and the amount of time to run
         *                it for (in absolute units).
         */
        SJF.prototype.schedule = function(taskConfig, animate) {
            var time = 0;

            var tasks = taskConfig.tasks.slice(0);
            $.each(tasks, function(i, n) {
                n.timeLeft = n.total;
            });
            // returns {time, task} where task is the task to run
            // and time is the amount of time units to run it for
            var selectTaskToRun = function(taskConfig) {
                available = $.grep(taskConfig, function(task) {
                    return task.timeLeft && task.arrival <= time;
                }).sort(function (lhs, rhs) {
                    return lhs.timeLeft - rhs.timeLeft;
                });
                if (available.length) {
                    return available[0];
                } else {
                    return null;
                }
            };
            // TODO: remove this for release
            // sanity check for infinite loop
            debugFailover = 100;
            task = selectTaskToRun(tasks);
            while (debugFailover && (task || $.grep(tasks, function (elem) { return elem.timeLeft; }).length)) {
                if (task) {
                    animate(task, task.timeLeft);
                    time += task.timeLeft;
                    task.timeLeft = 0;
                } else {
                    time++;
                }
                task = selectTaskToRun(tasks);
                debugFailover--;
            }
        }

        return SJF;
    })();
}).call(this);

