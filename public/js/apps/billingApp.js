App.module("BillingApp", function(BillingApp, App, Backbone, Marionette, $, _){
  var
    Layout = Backbone.Marionette.Layout.extend({
      className: "container-fluid",
      template: "#billing-template",
      initialize: function () {
        this.on('show', function () {
          // add uniform plugin styles to html elements
          $("input:checkbox, input:radio").uniform();
          // select2 plugin for select elements
          $(".select2").select2({
            placeholder: "Select a State"
          });
          // datepicker plugin
          $('.datepicker').datepicker().on('changeDate', function (ev) {
            $(this).datepicker('hide');
          });
          // wysihtml5 plugin on textarea
          $(".wysihtml5").wysihtml5({
            "font-styles": false
          });
        });
      }
    }),
    Router = Marionette.AppRouter.extend({
      appRoutes: {
        "billing": "initializeLayout"
      }
    });
  BillingApp.initializeLayout = function () {
    App.content.show(new Layout());
    App.MenuView.setActive('billing');
    Backbone.history.navigate('billing');
  };

  App.addInitializer(function () {
    BillingApp.Router = new Router({
      controller: BillingApp
    });
  });
});
