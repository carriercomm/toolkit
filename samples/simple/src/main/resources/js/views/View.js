define(
  [
    'jquery',
    'backbone',
    'underscore',
    '/simple/web/js/collections/SimpleCollection.js',
    '/simple/web/js/models/SimpleModel.js',
    '/js/ext/text/text.js!/simple/web/js/templates/simple.html'
    ], function($, Backbone, _, SimpleCollection, SimpleModel, Template) {
      var View = Backbone.View.extend({
        el: $("#main"),
        initialize: function() {
          var self = this;
          this.collection = new SimpleCollection();
          this.collection.url = 'http://localhost:8080/simple/northbound/simple';
          this.collection.fetch({
            success : function(call, response) {
              self.render();
            }
          });
        },
        render: function() {
          var that = this;
          var compiledTemplate = _.template(Template, 
          {
            simple : that.collection.models
          });
          $(this.el).append($(compiledTemplate).html());
        },
        events : {
          'click #simpleContainer button' : 'handleSimpleButton',
          'click #simpleTable tbody tr' : 'tableRowClicked'
        },
        handleSimpleButton : function(evt) {
          var self = this;
          var $button = $(evt.currentTarget);
          if ($button.attr('id') == 'simpleButton') {
            var simpleModel = new SimpleModel({
              foo : $('#simpleFooInput').val(),
              bar : $('#simpleBarInput').val()
            });
            simpleModel.urlRoot = '/simple/northbound/simple';
            simpleModel.save(null, {
              dataType: 'text',
              success: function(model, response) {
                $('#main').empty();
                self.updateView();
              }
            });
          } else if ($button.attr('id') == 'simpleRemoveButton') {
            var id = $('#simpleTable tbody tr.selected').attr('data-id');
            var simpleModel = self.collection.get(id);
            simpleModel.setUrlRoot();
            simpleModel.destroy({
              dataType: 'text',
              success: function() {
                $('#main').empty();
                self.updateView();
              },
              error: function() {
                $('#main').empty();
                self.updateView();
              }
            });
          } else {
            // cancel button
            $('#simpleInput').val('');
          }
        },
        tableRowClicked : function(evt) {
          $('#simpleTable tbody tr.selected').removeClass('selected');
          var $tr = $(evt.currentTarget);
          $tr.addClass('selected');
        },
        updateView : function() {
          $('#simpleContainer').remove();
          this.initialize();
        }
      });
      return View;
    });
