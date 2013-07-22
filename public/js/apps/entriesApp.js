App.module("EntriesApp", function (EntriesApp, App, Backbone, Marionette, $, _) {
  var
    Ticket = Backbone.Model.extend({
      urlRoot: '/api/tickets',
      idAttribute: "_id"
    }),
    Tickets = Backbone.Collection.extend({
      url: '/api/tickets',
      model: Ticket
    }),
    Layout = Backbone.Marionette.Layout.extend({
      className: "container-fluid",
      template: "#entries-template",
      regions: {
        table: "#table"
        //pagination: ".pagination"
      },
      initialize: function () {
        this.on('show', function () {
          $(".select2").select2({
            placeholder: "Select a State"
          });
          // datepicker plugin
          $('.startDate').datepicker().on('changeDate', function (ev) {
            $(this).datepicker('hide');
          });
          $('.endDate').datepicker().on('changeDate', function (ev) {
            $(this).datepicker('hide');
          });
          // wysihtml5 plugin on textarea
          $(".wysihtml5").wysihtml5({
            "font-styles": false
          });
        });
      }
    }),
    ItemView = Backbone.Marionette.ItemView.extend({
      template: "#entries-item-template",
      tagName: 'tr',
      events: {
        'click .user a': function () {
          App.UsersApp.showItem(this.model.get('user')._id);
          return false;
        }
      },
      onShow: function () {
        // add uniform plugin styles to html elements
        $("input:checkbox, input:radio").uniform();
      }
    }),
    TableEntriesView = Backbone.Marionette.CompositeView.extend({
      collection: EntriesApp.Tickets,
      itemView: ItemView,
      itemViewContainer: "tbody",
      className: "table table-hover",
      tagName: "table",
      template: "#entries-table-template"
    }),
    Router = Marionette.AppRouter.extend({
      appRoutes: {
        "time-entries": "showItems"
      }
    });
  EntriesApp.showItems = function () {
    EntriesApp.initializeLayout();
    App.content.show(EntriesApp.layout);
    EntriesApp.layout.table.show(EntriesApp.Table);
    App.MenuView.setActive('entries');
    Backbone.history.navigate('time-entries');
  };
  EntriesApp.initializeLayout = function () {
    EntriesApp.Tickets = new Tickets();
    EntriesApp.layout = new Layout();
    EntriesApp.Table = new TableEntriesView({
      collection: EntriesApp.Tickets
    });
    EntriesApp.Tickets.fetch();
  };

  App.addInitializer(function () {
    EntriesApp.Router = new Router({
      controller: EntriesApp
    });
  });
});
