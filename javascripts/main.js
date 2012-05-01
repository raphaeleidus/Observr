$(function(){
	var LogEntry = Backbone.Model.extend({

	});
	console.log("done.");
	var Log = Backbone.Collection.extend({
		model: LogEntry,
		url: "/log",
		initialize: function() {
			this.backboneFirebase = new BackboneFirebase(this);
		}
	});
	activityLog = new Log();
	
});