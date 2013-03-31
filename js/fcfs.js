(function() {
    App.Schedulers.FCFS = (function() {
        FCFS.defaultAnimateMethod = ( new App.ProcessAnimator ).animate;

        function FCFS() {
        }

        /**
         * @param taskConfig An config object, {
         *                   tasks: an array of objects with {id, total, arrival} representing the tasks to run
         *                   config: task specific config, irrelevant for FCFS
         *                   }
         * @param animate An animation callback taking as args the task object and the amount of time to run
         *                it for (in absolute units).
         */
        FCFS.prototype.schedule = function(taskConfig, animate) {
            var tasks = taskConfig.tasks.slice(0);
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

        return FCFS;
    })();
}).call(this);
