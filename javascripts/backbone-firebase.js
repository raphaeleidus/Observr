//     Backbone <-> Firebase v0.0.3
//
//     Started as a fork of Backpusher.js (https://github.com/pusher/backpusher)
//
//     Backbone <-> Firebase (c) 2012 Alex Bain
//     Backpusher originally (c) 2011-2012 Pusher
//
//     This script may be freely distributed under the MIT license.
//
(function(exports, undefined){

  // Note: Add your appname to the end of this string
  var urlPrefix = 'burning-torch-6969.firebaseio.com';

  var BackboneFirebase = function(collection, options) {
    console.log(urlPrefix+collection.url);
    this.reference = new Firebase(urlPrefix + collection.url);
    this.collection = collection;
    this.options = (options || {});

    if (this.options.events) {
      this.events = this.options.events;
    } else {
      this.events = BackboneFirebase.defaultEvents;
    }

    this._bindEvents();
    this.initialize(collection, options);

    return this;
  };

  _.extend(BackboneFirebase.prototype, Backbone.Events, {
    initialize: function() {},

    _bindEvents: function() {
      if (!this.events) return;

      for (var event in this.events) {
        if (this.events.hasOwnProperty(event)) {
          this.reference.on(event, _.bind(this.events[event], this));
        }
      }
    },

    _add: function(model) {
      var Collection = this.collection;
      var cmodel = new Collection.model(model.val());
      cmodel.id = model.name();

      Collection.add(cmodel);
      this.trigger('remote_create', cmodel);

      return cmodel;
    }
  });

  BackboneFirebase.defaultEvents = {
    child_added: function(pushed_model) {
      return this._add(pushed_model);
    },

    child_changed: function(pushed_model) {
      var model = this.collection.get(pushed_model.name());

      if (model) {
        model = model.set(pushed_model.val());
        model.id = pushed_model.name();

        this.trigger('remote_update', model);

        return model;
      } else {
        return this._add(pushed_model.val());
      }
    },

    child_removed: function(pushed_model) {
      var model = this.collection.get(pushed_model.val());

      if (model) {
        this.collection.remove(model);
        this.trigger('remote_destroy', model);

        return model;
      }
    }
  };

  // Original Backbone.sync method from v0.9.2
  Backbone.sync = function(method, model, options) {

    // Verify Firebase object exists
    if (typeof Firebase === undefined) return false;

    // Default options, unless specified.
    options || (options = {});

    var url = getValue(model, 'url') || urlError();

    // Setup the Firebase Reference
    var ref = new Firebase(urlPrefix + url);

    // Map CRUD to Firebase actions
    switch (method) {
      case 'create':
        ref.push(model.toJSON(), function (success) {
          if (success && options.success) options.success();
          else if (!success && options.error) options.error();
        });
        break;
      case 'read':
        var dataArray = [];
        pushData = function(data) {
          i = dataArray.length;
          dataArray[i] = data.val();
          dataArray[i].id = data.name();
        }
        ref.on('child_added', pushData);
        ref.off('child_added', pushData);
        if (options.success) options.success(dataArray, "success", {});
        break;
      case 'update':
        ref.set(model.toJSON(), function (success) {
          if (success && options.success) options.success();
          else if (!success && options.error) options.error();
        });
        break;
      case 'delete':
        ref.remove(function (success) {
          if (success && options.success) options.success();
          else if (!success && options.erorr) options.error();
        });
        break;
      default:
        break;
    }

    return ref;
  };

  var getValue = function(object, prop) {
    if (!(object && object[prop])) return null;
    return _.isFunction(object[prop]) ? object[prop]() : object[prop];
  };

  exports.BackboneFirebase = BackboneFirebase;

})((typeof exports !== 'undefined' ? exports : this));
