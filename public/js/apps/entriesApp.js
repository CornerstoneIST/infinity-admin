App.module("EntriesApp", function (EntriesApp, App, Backbone, Marionette, $, _) {
  var
    Ticket = Backbone.Model.extend({
      urlRoot: '/api/ticket',
      idAttribute: "_id"
    }),
    Tickets = Backbone.Paginator.requestPager.extend({
      model: Ticket,
      paginator_core: {
        type: 'GET',
        dataType: 'json',
        url: '/api/tickets'
      },
      paginator_ui: {
        firstPage: 1,
        currentPage: 1,
        perPage: 5,
        totalPages: 5
      },
      server_api: {
        'per_page': function() { return this.perPage },
        'page': function() { return this.currentPage }
      },
      parse: function (response) {
        this.totalRecords = response.count;
        this.totalPages = Math.ceil(response.count / this.perPage);
        return response.collection;
      }
    }),
    Layout = Backbone.Marionette.Layout.extend({
      className: "container-fluid",
      template: "#entries-template",
      regions: {
        table: "#table",
        pagination: "#pagination"
      },
      onShow: function () {
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
      itemView: ItemView,
      itemViewContainer: "tbody",
      className: "table table-hover",
      tagName: "table",
      template: "#entries-table-template",
      initialize: function () {
        this.collection.pager({
          success: function(){
            EntriesApp.layout.pagination.show(new App.Common.Views.PaginationView({
              collection: EntriesApp.Tickets
            }));
          }
        });
      },
      events: {
        'change th input:checkbox': function (e) {
          // toggle all checkboxes from a table when header checkbox is clicked
          this.$('input:checkbox').prop("checked", $(e.target).prop("checked")).uniform();
        }
      }
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
  };

  App.addInitializer(function () {
    EntriesApp.Router = new Router({
      controller: EntriesApp
    });
  });
});
