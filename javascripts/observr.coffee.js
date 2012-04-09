code = """alert "hello" """
# code = """
jQuery ->
	class LogEntry extends Backbone.Model
		defaults:
			Start: null
			End: null
			Duration: null
			Description: ""
			Action: null
		initialize: ->
			_.bindAll @

	class Log extends Backbone.Collection
		model: LogEntry
		initialize: ->
			_.bindAll @
			
	class Activity extends Backbone.Model
		defaults:
			StartClocktime: null
			Start: null
			Description: "Sample Description"
			Title: "Sample Activity"
			Actions: []
		initialize: ->
			_.bindAll @
			@set "Log", new Log
			console.log @get "Actions"
		addAction: (action) ->
			Actions = @get "Actions"
			Actions.push action
			@set 
				Actions: Actions

	class LoggingView extends Backbone.View
		el: $ "#Body"
		initialize: ->
			_.bindAll @
	
	activity = new Activity 
		Title: "Observer"
		Actions:  ["Watch", "Listen", "Do"]

	activity.addAction "Snack"
	console.log activity.get "Actions"
# """
console.log CoffeeScript.compile code
