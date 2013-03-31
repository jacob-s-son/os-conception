class App.ProcessAnimator
  constructor: ->
    @processCache    = {}
    @defaultUnitSize = 5

  animate: (process, units) =>
    @process( process.id ).style.width = "#{@process( process.id ).offsetWidth + units * @defaultUnitSize}px"

  process: (processId) =>
    @processCache[ "#{processId}" ] ?= document.getElementById("process-#{processId}")