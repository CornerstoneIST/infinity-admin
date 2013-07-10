App.UsersApp = function () {
  var
    UsersApp = {},
    Layout = Backbone.Marionette.Layout.extend({
      template: "#users-template"
    });
  UsersApp.initializeLayout = function () {
    App.content.show(new Layout());
  };

  return UsersApp;
}();
