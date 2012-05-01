$(function(){
	var LogEntry = Backbone.Model.extend({

	});
	var Log = Backbone.Collection.extend({
		model: LogEntry
	});
	activityLog = new Log();
	console.log(activityLog.toJSON());
	var dataRef = new Firebase('http://gamma.firebase.com/codercub/');
	dataRef.on('value', function(snapshot) {
		console.log(snapshot.val());
	});
	console.log("done.");
});