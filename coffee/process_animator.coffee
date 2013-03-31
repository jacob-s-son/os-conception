class App.ProcessAnimator
  constructor: ->
    @processCache    = {}
    @defaultUnitSize = 5

  enequeProcess: (process, units) =>
    App.AnimationWorker.eneque( new App.Job( { id: process.id, units: units }, @animateWidth ) )

  animateWidth: (process) =>
    @process( process.id ).animate({ width: "#{@process( process.id ).width() + process.units * @defaultUnitSize}px" }, 500 )
    # @process( process.id ).width( @process( process.id ).width() + process.units * @defaultUnitSize )

  process: (processId) =>
    @processCache[ "#{processId}" ] ?= $("#process-#{processId}")
