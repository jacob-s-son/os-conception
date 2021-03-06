// Generated by CoffeeScript 1.6.2
(function() {
  App.Job = (function() {
    function Job(params, functionToRun) {
      this.params = params;
      this.functionToRun = functionToRun;
    }

    Job.prototype.run = function() {
      console.log("Running jobs with params: ");
      console.log(this.functionToRun);
      console.log(this.params);
      return this.functionToRun(this.params);
    };

    return Job;

  })();

}).call(this);
