class App.FormController
  constructor: ->
    @form = $('#params-form')
    @form.bind "submit", @runAlgorithm
    $("#reset-button").bind 'click', @reset
    @cache = {}

    @defaultTasks = [
      { id: 1, total: 10, arrival: 0 },
      { id: 2, total: 10, arrival: 0 },
      { id: 3, total: 10, arrival: 0 },
    ]

  runAlgorithm: (event) =>
    event.preventDefault()
    @reset()
    @cache = {}
    @scheduleRun()

  formParams: =>
    @cache['params'] ?= @form.serializeArray().reduce ( previousValue, currentValue, index, array ) ->
      previousValue[currentValue.name] = currentValue.value
      return previousValue
    , {}

  scheduleRun: ->
    @selectedAlgorithm().schedule( @schedulerOptions(), ( new App.ProcessAnimator ).enequeProcess )

  selectedAlgorithm: ->
    @cache['algoConstant'] ?= new App.Schedulers["#{@formParams()['algorithm']}"]

  schedulerOptions: ->
    {
      tasks: @tasks()
      config: @schedulerConfig()
    }

  schedulerConfig: ->
    { timeSlice: @formParams()['timeSlice'] }

  tasks: ->
    @defaultTasks.map ( val ) =>
      {
        id:       val.id,
        total:    parseInt( @formParams()["total-t#{val.id}"] ),
        priority: parseInt( @formParams()["priority-t#{val.id}"]),
        arrival:  parseInt( @formParams()["arrival-t#{val.id}"])
      }

  reset: =>
    $('.process').width(0)

$ ->
  window.formController = new App.FormController

