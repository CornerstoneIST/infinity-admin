App.OrganizerApp = function () {
  var
    OrganizerApp = {},
    Layout = Backbone.Marionette.Layout.extend({
      className: "container-fluid",
      template: "#organizer-template"
    });
  OrganizerApp.initializeLayout = function () {
    App.content.show(new Layout());
  };

  return OrganizerApp;
}();
