App.EntriesApp = function () {
  var
    EntriesApp = {},
    Layout = Backbone.Marionette.Layout.extend({
      className: "container-fluid",
      template: "#entries-template",
      initialize: function () {
        this.on('show', function () {
           // add uniform plugin styles to html elements
          $("input:checkbox, input:radio").uniform();
          // select2 plugin for select elements
          $(".select2").select2({
            placeholder: "Select a State"
          });
          // datepicker plugin
          $('.startDate').datepicker().on('changeDate', function (ev) {
            $(this).datepicker('hide');
          });
          $('.endDate').datepicker().on('changeDate', function (ev) {
            $(this).datepicker('hide');
          });
          // wysihtml5 plugin on textarea
          $(".wysihtml5").wysihtml5({
            "font-styles": false
          });
        });
      }
    });
  EntriesApp.initializeLayout = function () {
    App.content.show(new Layout());
  };

  return EntriesApp;
}();
