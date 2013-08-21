App.module("ClientsApp", function (ClientsApp, App, Backbone, Marionette, $, _) {
  var
    Client = Backbone.Model.extend({
      urlRoot: '/api/client',
      idAttribute: "_id"
    }),

    Clients = Backbone.Paginator.requestPager.extend({
      model: Client,
      paginator_core: {
        type: 'GET',
        dataType: 'json',
        url: '/api/clients'
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
      template: "#clients-template",
      regions: {
        table: "#table",
        pagination: "#pagination"
      }
    }),

    ItemView = Backbone.Marionette.ItemView.extend({
      template: "#client-item-template",
      tagName: 'tr'
    }),

    TableClientsView = Backbone.Marionette.CompositeView.extend({
      itemView: ItemView,
      itemViewContainer: "tbody",
      className: "table table-hover",
      tagName: "table",
      template: "#clients-table-template",
      initialize: function () {
        this.collection.pager({
          success: function(){
            ClientsApp.layout.pagination.show(new App.Common.Views.PaginationView({
              collection: ClientsApp.Clients
            }));
          }
        });
      }
    }),
    Router = Marionette.AppRouter.extend({
      appRoutes: {
        "clients": "showItems"
      }
    });

  ClientsApp.showItems = function () {
    ClientsApp.initializeLayout();
    App.content.show(ClientsApp.layout);
    ClientsApp.layout.table.show(ClientsApp.Table);
    App.MenuView.setActive('clients');
    Backbone.history.navigate('clients');
  };
  ClientsApp.initializeLayout = function () {
    ClientsApp.layout = new Layout();
    ClientsApp.Clients = new Clients();
    ClientsApp.Table = new TableClientsView({
      collection: ClientsApp.Clients
    });
  };

  App.addInitializer(function () {
    ClientsApp.Router = new Router({
      controller: ClientsApp
    });
  });
});
