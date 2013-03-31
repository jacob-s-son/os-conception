class App.FormController
  constructor: ->
    @form = $('#params-form')
    @form.bind "submit", @retrieveParams

  retrieveParams: (event) =>
    event.preventDefault()
    @params = @form.serializeArray()


$ ->
  new App.FormController

