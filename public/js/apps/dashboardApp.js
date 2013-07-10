App.DashboardApp = function () {
  var
    DashboardApp = {},
    Layout = Backbone.Marionette.Layout.extend({
      template: "#dashboard-template",
      regions: {
        
      },
      events: {
        
      }
    });
  DashboardApp.initializeLayout = function () {
    App.content.show(new Layout());
  };

  return DashboardApp;
}();
