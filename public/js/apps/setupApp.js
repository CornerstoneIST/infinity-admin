App.SetupApp = function () {
  var
    SetupApp = {},
    Layout = Backbone.Marionette.Layout.extend({
      className: "container-fluid",
      template: "#setup-template"
    });
  SetupApp.initializeLayout = function () {
    App.content.show(new Layout());
  };

  return SetupApp;
}();
