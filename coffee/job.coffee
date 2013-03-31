class App.Job
  constructor: (@params, @functionToRun) ->

  run: ->
    console.log "Running jobs with params: "
    console.log @functionToRun
    console.log @params
    @functionToRun( @params )
