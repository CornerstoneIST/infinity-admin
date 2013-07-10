App.ClientsApp = function () {
  var
    ClientsApp = {},
    Layout = Backbone.Marionette.Layout.extend({
      template: "#clients-template"
    });
  ClientsApp.initializeLayout = function () {
    App.content.show(new Layout());
  };

  return ClientsApp;
}();
