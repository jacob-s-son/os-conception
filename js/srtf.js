(function() {
    App.Schedulers.SRTF = (function() {
        SRTF.defaultAnimateMethod = ( new App.ProcessAnimator ).animate;

        function SRTF() {
        }

        /**
         * @param taskConfig An config object, {
         *                   tasks: an array of objects with {id, total, arrival} representing the tasks to run
         *                   config: task specific config, irrelevant for SRTF
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
        SRTF.prototype.schedule = function(taskConfig, animate) {
            if ( animate === null || typeof(animate) === 'undefined' ) {
                animate = SRTF.defaultAnimateMethod;
            }

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
                    return {task: available[0], time: 1};
                } else {
                    return null;
                }
            };
            // TODO: remove this for release
            // sanity check for infinite loop
            // TODO: implement jumps in time instead of brute-forcingly advancing it by 1
            debugFailover = 100;
            info = selectTaskToRun(tasks);
            while (debugFailover && (info || $.grep(tasks, function (elem) { return elem.timeLeft; }).length)) {
                if (info) {
                    animate(info.task, info.time);
                    info.task.timeLeft--;
                }
                debugFailover--;
                info = selectTaskToRun(tasks);
                time++;
            }
        }

        return SRTF;
    })();
}).call(this);
