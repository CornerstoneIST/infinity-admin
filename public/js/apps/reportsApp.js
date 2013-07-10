App.ReportsApp = function () {
  var
    ReportsApp = {},
    Layout = Backbone.Marionette.Layout.extend({
      template: "#reports-template"
    });
  ReportsApp.initializeLayout = function () {
    App.content.show(new Layout());
  };

  return ReportsApp;
}();
