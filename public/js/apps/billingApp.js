App.BillingApp = function () {
  var
    BillingApp = {},
    Layout = Backbone.Marionette.Layout.extend({
      className: "container-fluid",
      template: "#billing-template"
    });
  BillingApp.initializeLayout = function () {
    App.content.show(new Layout());
  };

  return BillingApp;
}();
