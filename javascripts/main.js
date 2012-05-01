$(function(){
	var LogEntry = Backbone.Model.extend({
		defaults: {active: true}
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
	var EntryView = Backbone.View.extend({
		className: "logEntry",
		template: _.template("<dt><% var d = new Date(Timestamp); print(d.toLocaleTimeString()); %></dt><dd><%= Title %></dd>"),
		render: function() {
			$(this.el).html(this.template(this.model.toJSON()));
			return this.$el;
		}
	});
	var LabelView = Backbone.View.extend({
		className: "label",
		tagName: "span",
		template: _.template("<%= Name %>"),
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
				var logEntryView = new EntryView({model: logEntry});
				that.$el.append(logEntryView.render());
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
				var moodEntryView = new EntryView({model: moodEntry, className: "moodEntry"});
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
			this.moodView = new MoodView();
			this.labelView = new LabelsView();
			_.bindAll(this, 'catchKey');
			$(document).bind('keydown', this.catchKey);
		},
		load: function(){
			$("#activitylog").empty();
			$("#activitylog").append(this.logView.render().el);
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
				entry = $("#activityField").val();
				time = new Date();
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
	
});