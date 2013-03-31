class App.FormController
  constructor: ->
    @form = $('#params-form')
    @form.bind "submit", @runAlgorithm
    @cache = {}

    @defaultTasks = [
      { id: 1, total: 10, arrival: 0 },
      { id: 2, total: 10, arrival: 0 },
      { id: 3, total: 10, arrival: 0 },
    ]

  runAlgorithm: (event) =>
    event.preventDefault()
    @cache = {}
    @scheduleRun()

  formParams: =>
    @cache['params'] ?= @form.serializeArray().reduce ( previousValue, currentValue, index, array ) ->
      previousValue[currentValue.name] = currentValue.value
      return previousValue
    , {}

  scheduleRun: ->
    @selectedAlgorithm().schedule( @schedulerOptions() )

  selectedAlgorithm: ->
    @cache['algoConstant'] ?= new App.Schedulers["#{@formParams()['algorithm']}"]

  schedulerOptions: ->
    {
      tasks: @tasks()
    }

  tasks: ->
    @defaultTasks

$ ->
  window.formController = new App.FormController

