$(function(){
	var LogEntry = Backbone.Model.extend({

	});
	var MoodEntry = Backbone.Model.extend({

	});
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
	var MoodLog = Backbone.Collection.extend({
		model: MoodEntry,
		url: "/moodLog",
		initialize: function() {
			this.backboneFirebase = new BackboneFirebase(this);
			this.on("all", this.reloadView, this);
		},
		reloadView: function() {
			log.loadMood();
		}
	});
	moodLog = new MoodLog();
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
		renderMoods: function() {
			var that = this;
			//this.$el.empty().remove();
			moodLog.each(function(moodEntry){
				var moodEntryView = new MoodEntryView({model: moodEntry});
				that.$el.append(moodEntryView.render());
			});
			//return this;
		},
		initialize: function() {
			_.bindAll(this, 'catchKey');
			$(document).bind('keydown', this.catchKey);
		},
		load: function(){
			$("#activitylog").empty();
			$("#activitylog").append(this.render().el);
		},
		loadMood: function(){
			$("#moodlog").empty();
			$("#moodlog").append(this.renderMoods().el);
		},
		catchKey: function(e) {
			if (e.keyCode === 9) {
				e.preventDefault();
				if(e.target === $("#activityField")[0]) {
					$("#moodField").focus();
				} else if(e.target === $("#moodField")[0]) {
					$("#activityField").focus();
				}
			} 
			if (e.keyCode === 13 && e.target === $("#activityField")[0] && $("#activityField").val().length > 3) {
				entry = $("#activityField").val();
				time = new Date();
				activityLog.create({Title: entry, Timestamp: time.toUTCString()});
				activityLog.fetch();
				console.log(time.toUTCString(), entry);
				$("#activityField").val("")
				;
			}
			if (e.keyCode === 13 && e.target === $("#moodField")[0]) {
				entry = $("#activityField").val();
				time = new Date();
				moodLog.create({Title: entry, Timestamp: time.toUTCString()});
				//moodLog.fetch();
				console.log(time.toUTCString(), entry);
				$("#activityField").val("")
				;
			}
		}
	});
	var log = new LogView();
	
});