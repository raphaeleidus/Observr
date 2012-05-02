$(function(){
	var LogEntry = Backbone.Model.extend({
		defaults: {active: true, Label: ""}
	});
	var MoodEntry = Backbone.Model.extend({

	});
	var ActivityLabel= Backbone.Model.extend({

	});

	var Labels = Backbone.Collection.extend({
		model: ActivityLabel,
		url: "/labels",
		initialize: function() {
			this.backboneFirebase = new BackboneFirebase(this);
			this.on("all", this.reloadView, this);
		},
		reloadView: function() {
			observation.loadLabels();
		}
	})
	var Log = Backbone.Collection.extend({
		model: LogEntry,
		url: "/log",
		initialize: function() {
			this.backboneFirebase = new BackboneFirebase(this);
			this.on("all", this.reloadView, this);
		},
		reloadView: function() {
			observation.load();
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
			observation.loadMood();
		}
	});
	moodLog = new MoodLog();
	activityLog = new Log();
	labels = new Labels();
	activeLabel = null;
	var EntryView = Backbone.View.extend({
		className: "logEntry",
		template: _.template("<dt><% var d = new Date(Timestamp); print(d.toLocaleTimeString()); %></dt><dd><%= Title %></dd>"),
		render: function() {
			$(this.el).html(this.template(this.model.toJSON()));
			return this.$el;
		}
	});
	var MoodEntryView = EntryView.extend({
		className: "moodEntry"
	});
	var ShortLogEntryView = Backbone.View.extend({
		tagName: "li",
		template: _.template("<span rel='tooltip' title='<%= Title %>' class='label'><% if(Label != '') { print(Label) } else { print(Title) } %></span> - <%= Math.round(Duration*100)/100 %> min"),
		render: function() {
			$(this.el).html(this.template(this.model.toJSON()));
			return this.$el;
		}
	});
	var LogEntryView = EntryView.extend({
		template: _.template("<dt><% var d = new Date(Timestamp); print(d.toLocaleTimeString()); %></dt><dd><%= Title %><% if(Label != '') { %> <span class='label'><%= Label %></span><% } %></dd>"),
		events: {
			"click": "label"
		},
		label: function(){
			if(activeLabel != null) {
				this.model.set("Label", activeLabel.model.get("Name"));
				this.model.save();
			}
		}
	});
	var LabelView = Backbone.View.extend({
		className: "label",
		tagName: "span",
		template: _.template("<%= Name %>"),
		events: {
			"click": "select"
		},
		render: function() {
			$(this.el).html(this.template(this.model.toJSON()));
			return this.$el;
		},
		select: function() {
			if(activeLabel != null) {
				activeLabel.$el.removeClass("btn-primary");
			}
			if(activeLabel != this) {
				activeLabel = this;
				this.$el.addClass("btn-primary");
			} else {
				activeLabel == null;
			}
			
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
		}
	});
	var ShortLogView = LogView.extend({
		tagName:"ul",
		className: "unstyled",
		render: function() {
			var that = this;
			this.$el.empty().remove();
			activityLog.each(function(logEntry){
				if(typeof(logEntry.get("Duration")) !== "undefined") {
					var logEntryView = new ShortLogEntryView({model: logEntry});
					that.$el.append(logEntryView.render());
				}
			});
			return this;
		}
	});
	var MoodView = Backbone.View.extend({
		tagName:"dl",
		className: "dl-horizontal",
		render: function() {
			var that = this;
			this.$el.empty().remove();
			moodLog.each(function(moodEntry){
				var moodEntryView = new MoodEntryView({model: moodEntry});
				that.$el.append(moodEntryView.render());
			});
			return this;
		}
	});
	var LabelsView = Backbone.View.extend({
		render: function() {
			var that = this;
			this.$el.empty().remove();
			labels.each(function(label){
				var labelView = new LabelView({model: label});
				that.$el.append(labelView.render());
			});
			return this;
		}
	});
	var ObservationView = Backbone.View.extend({
		initialize: function() {
			this.logView = new LogView();
			this.shortLogView = new ShortLogView();
			this.moodView = new MoodView();
			this.labelView = new LabelsView();
			_.bindAll(this, 'catchKey');
			$(document).bind('keydown', this.catchKey);
		},
		load: function(){
			$("#activitylog").empty();
			$("#shortLog").empty();
			$("#activitylog").append(this.logView.render().el);
			$("#shortLog").append(this.shortLogView.render().el);
			$("#shortLog ul li span").tooltip();
		},
		loadMood: function(){
			$("#moodlog").empty();
			$("#moodlog").append(this.moodView.render().el);
		},
		loadLabels: function(){
			$("#activitylabels").empty();
			$("#activitylabels").append(this.labelView.render().el);
		},
		catchKey: function(e) {
			if (e.keyCode === 9) {
				e.preventDefault();
				if(e.target === $("#activityField")[0]) {
					$("#moodField").focus();
				} else if(e.target === $("#moodField")[0]) {
					$("#activityField").focus();
				} else if(e.target === $("#labelField")[0]) {
					$("#activityField").focus();
				}
			} else if (e.keyCode === 13 && e.target === $("#activityField")[0] && $("#activityField").val().length > 3) {
				var entry = $("#activityField").val();
				var time = new Date();
				var hasPrev = activityLog.length !== 0;
				if (hasPrev) {
					prev = activityLog.last();
					prev = activityLog.get(prev.id);
					prev.set("End", time.toUTCString());
					oldTime = prev.get("Timestamp");
					oldTime = new Date(oldTime);
					duration = ((time - oldTime) / 1000) / 60;
					prev.set("Duration", duration);
					prev.save();
				}
				activityLog.create({Title: entry, Timestamp: time.toUTCString()});
				activityLog.fetch();
				console.log(time.toUTCString(), entry);
				$("#activityField").val("");
			} else if (e.keyCode === 13 && e.target === $("#moodField")[0]) {
				entry = $("#moodField").val();
				if (entry.length > 2) {
					time = new Date();
					moodLog.create({Title: entry, Timestamp: time.toUTCString()});
				}
				moodLog.fetch();
				$("#moodField").val("");
				$("#activityField").focus();
			} else if (e.keyCode === 13 && e.target === $("#labelField")[0]) {
				entry = $("#labelField").val();
				if (entry.length > 2) {
					labels.create({Name: entry});
				}
				labels.fetch();
				$("#labelField").val("");
			}
		}
	});
	var observation = new ObservationView();
	console.log("loaded!");
	
});