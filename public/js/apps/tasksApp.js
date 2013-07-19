App.module("TasksApp", function(TasksApp, App, Backbone, Marionette, $, _){
  var
    Layout = Backbone.Marionette.Layout.extend({
      className: "container-fluid",
      template: "#tasks-template"
    }),
    Router = Marionette.AppRouter.extend({
      appRoutes: {
        "tasks": "initializeLayout"
      }
    });
  TasksApp.initializeLayout = function () {
    App.content.show(new Layout());
    App.MenuView.setActive('tasks');
    Backbone.history.navigate('tasks');
  };

  App.addInitializer(function () {
    TasksApp.Router = new Router({
      controller: TasksApp
    });
  });
});
