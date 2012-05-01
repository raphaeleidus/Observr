$(function(){
	var LogEntry = Backbone.Model.extend({

	});
	console.log("done.");
	var Log = Backbone.Collection.extend({
		model: LogEntry,
		url: "/log",
		initialize: function() {
			this.backboneFirebase = new BackboneFirebase(this);
			this.on("all", this.reloadView, this);
		},
		reloadView: function() {
			log.load();
		}
	});
	activityLog = new Log();
	var LogEntryView = Backbone.View.extend({
		className: "logEntry",
		template: _.template("<dt><% var d = new Date(Timestamp); print(d.toLocaleTimeString()); %></dt><dd><%= Title %></dd>"),
		render: function() {
			$(this.el).html(this.template(this.model.toJSON()));
			return this.$el;
		}
	});
	var LogView = Backbone.View.extend({
		el: "body",
		tagName:"dl",
		className: "dl-horizontal",
		render: function() {
			var that = this;
			$("#activitylog").html("<dl class='dl-horizontal'></dl>");
			activityLog.each(function(logEntry){
				logEntryView = new LogEntryView({model: logEntry});
				$("#activitylog dl").append(logEntryView.render());
			});
			return this.$el;
		},
		initialize: function() {
			_.bindAll(this, 'addLogEntry');
			$(document).bind('keypress', this.addLogEntry);
		},
		load: function(){
			this.render();
		},
		addLogEntry: function(e) {
			if (e.keyCode === 13 && e.target === $("#activityField")[0] && $("#activityField").val().length > 3) {
				entry = $("#activityField").val();
				time = new Date();
				activityLog.create({Title: entry, Timestamp: time.toUTCString()});
				console.log(time.toUTCString(), entry);
				$("#activityField").val("");
			}
		}
	});
	var log = new LogView({ el: $("body") });
	
});