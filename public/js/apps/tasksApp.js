App.TasksApp = function () {
  var
    TasksApp = {},
    Layout = Backbone.Marionette.Layout.extend({
      className: "container-fluid",
      template: "#tasks-template"
    });
  TasksApp.initializeLayout = function () {
    App.content.show(new Layout());
  };

  return TasksApp;
}();
