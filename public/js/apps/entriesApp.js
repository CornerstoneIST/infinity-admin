App.EntriesApp = function () {
  var
    EntriesApp = {},
    Layout = Backbone.Marionette.Layout.extend({
      className: "container-fluid",
      template: "#entries-template"
    });
  EntriesApp.initializeLayout = function () {
    App.content.show(new Layout());
  };

  return EntriesApp;
}();
