App.ClientsApp = function () {
  var
    ClientsApp = {},
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
    });
  ClientsApp.showItems = function () {
    ClientsApp.layout = new Layout();
    App.content.show(ClientsApp.layout);
    ClientsApp.layout.table.show(ClientsApp.Table);
  };
  ClientsApp.initializeLayout = function () {
    ClientsApp.Clients = new Clients();
    ClientsApp.Table = new TableClientsView({
      collection: ClientsApp.Clients
    });
    ClientsApp.Clients.fetch();
    ClientsApp.showItems();
  };

  return ClientsApp;
}();
