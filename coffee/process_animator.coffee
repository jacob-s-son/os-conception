class App.ProcessAnimator
  @defaultUnitSize: 5

  constructor: ->
    @processCache = {}

  animate: (processId, units) ->
    @process( processId ).style.width = "#{@process( processId ).offsetWidth + units * 5}px"

  process: (processId) ->
    @processCache[ "#{processId}" ] ?= document.getElementById("process-#{processId}")