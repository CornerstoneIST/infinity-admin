App.module("ClientsApp", function (ClientsApp, App, Backbone, Marionette, $, _) {
  var
    Client = Backbone.Model.extend({
      urlRoot: '/api/clients',
      idAttribute: "_id"
    }),
    Clients = Backbone.Collection.extend({
      url: '/api/clients',
      model: Client
    }),
    Layout = Backbone.Marionette.Layout.extend({
      className: "container-fluid",
      template: "#clients-template",
      regions: {
        table: "#table"
        //pagination: ".pagination"
      }
    }),
    ItemView = Backbone.Marionette.ItemView.extend({
      template: "#client-item-template",
      tagName: 'tr'
    }),
    TableClientsView = Backbone.Marionette.CompositeView.extend({
      collection: ClientsApp.Clients,
      itemView: ItemView,
      itemViewContainer: "tbody",
      className: "table table-hover",
      tagName: "table",
      template: "#clients-table-template"
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
    ClientsApp.Clients.fetch();
  };

  App.addInitializer(function () {
    ClientsApp.Router = new Router({
      controller: ClientsApp
    });
  });
});
