code = """alert "hello" """
# code = """
jQuery ->
	class LogEntry extends Backbone.Model
		defaults:
			Start: null
			End: null
			Duration: null
			Description: ""
			Activity: null
	class Log extends Backbone.Collection
		model: LogEntry
			
	class Project extends Backbone.Model
		defaults:
			StartClocktime: null
			Start: null
			Description: "Sample Description"
			Title: "Sample Project"
			Activities: []
		initialize: ->
			# @set "Log" new Log
			console.log @get "Activities"
		addActivity: (activity) ->
			Activities = @get "Activities"
			Activities.push activity
			@set "Activities", Activities
	
	project = new Project 
		Title: "Observer"
		Activities:  ["Watch", "Listen", "Do"]

	project.addActivity "Snack"
	console.log project.get "Activities"
# """
console.log CoffeeScript.compile code
