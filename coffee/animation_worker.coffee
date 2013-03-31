class App.AnimationWorker
  instance = null

  class AnimationWorkerInstance
    constructor: ->
      @queue = []
      @workerTimeoutId = null
      @processJobs()

    eneque: (job) ->
      console.log "Adding job to queue:"
      console.log job

      @queue.push job

    processJobs: =>
      console.log "Checking queue"
      if @queue.length > 0
        console.log "Running job"
        @queue[0].run()
        @queue = @queue.slice(1, @queue.length)

      @workerTimeoutId = setTimeout( @processJobs, 800 )

    emptyQueue: =>
      @queue = []

    terminate: =>
      @emptyQueue()
      clearTimeout @workerTimeoutId
      @workerTimeoutId = null

  @currentInstance: ->
    ( instance ?= new AnimationWorkerInstance )

  @eneque: (job) ->
    console.log "Singleton received job"
    @currentInstance().eneque( job )

  @emptyQueue: ->
    @currentInstance().emptyQueue()

  @terminate: ->
    @currentInstance().terminate()