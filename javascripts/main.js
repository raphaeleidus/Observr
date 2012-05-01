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
		tagName:"dl",
		className: "dl-horizontal",
		render: function() {
			var that = this;
			this.$el.empty().remove();
			activityLog.each(function(logEntry){
				var logEntryView = new LogEntryView({model: logEntry});
				that.$el.append(logEntryView.render());
			});
			return this;
		},
		initialize: function() {
			_.bindAll(this, 'addLogEntry');
			$(document).bind('keypress', this.addLogEntry);
		},
		load: function(){
			$("#activitylog").empty();
			$("#activitylog").append(this.render().el);
		},
		addLogEntry: function(e) {
			console.log(e.type, e.keyCode);
			if (e.keyCode === 13 && e.target === $("#activityField")[0] && $("#activityField").val().length > 3) {
				entry = $("#activityField").val();
				time = new Date();
				activityLog.create({Title: entry, Timestamp: time.toUTCString()});
				activityLog.fetch();
				console.log(time.toUTCString(), entry);
				$("#activityField").val("")
				;
			}
		}
	});
	var log = new LogView();
	
});