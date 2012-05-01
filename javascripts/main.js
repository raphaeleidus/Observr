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
		tagName: "li",
		className: "well logEntry",
		template: _.template("<span class='label'><%= Timestamp %></span><span><%= Title %></span>"),
		render: function() {
			$(this.el).html(this.template(this.model.toJSON()));
			return this.$el;
		}
	});
	var LogView = Backbone.View.extend({
		tagName:"ul",
		render: function() {
			var that = this;
			this.$el.empty();
			activityLog.each(function(logEntry){
				logEntryView = new LogEntryView({model: logEntry});
				that.$el.append(logEntryView.render());
			});
			return this.$el;
		},
		load: function(){
			$("body").append(this.render());
		}
	});
	var log = new LogView();
	
});