App.module("SettingsApp", function(SettingsApp, App, Backbone, Marionette, $, _){
  var
    Layout = Backbone.Marionette.Layout.extend({
      className: "container-fluid",
      template: "#settings-template",
      events: {
        'click a:not(.danger)': 'addApp',
        'click a.danger': 'deleteApp'
      },
      modelEvents: {
        "change": function () {
          this.render();
        }
      },
      addApp: function (e) {
        SettingsApp.addApp($(e.target).attr('href'))
        return false;
      },
      deleteApp: function (e) {
        this.model.set('app', $(e.target).attr('href'), {silent: true});
        App.modal.show(new DeleteAppView({
          model: this.model
        }));
        return false;
      }
    }),
    SaveAppView = Backbone.Marionette.ItemView.extend({
      template: "#save-app-template",
      className: "modal-dialog",
      events: {
        'click #confirm': 'saveApp'
      },
      saveApp: function () {
        var options = {
              type: 'post',
              url: '/api/save-app',
              data: this.$('form').serialize() + '&companyId=' + this.model.get('_id') + '&app=' + this.model.get('app')
            },
            error = false;
        _.each(this.$('input'), function (inp) {
          if ($(inp).val() == '') {
            error = true;
          }
        });
        if (error) {
          this.$('.alert').show();
          return false;
        }
        SettingsApp.Company.save({}, options);
      }
    }),
    DeleteAppView = Backbone.Marionette.ItemView.extend({
      template: "#delete-app-template",
      className: "modal-dialog",
      events: {
        'click #confirm': 'deleteApp'
      },
      deleteApp: function () {
        var
          data = {
            apiKey: '',
            subDomain: '',
            companyId: this.model.get('_id'),
            app: this.model.get('app')
          },
          options = {
            type: 'post',
            url: '/api/save-app',
          };
        SettingsApp.Company.save(data, options);
      }
    }),
    Router = Marionette.AppRouter.extend({
      appRoutes: {
        "settings": "initializeLayout"
      }
    });
  SettingsApp.addApp = function (appType) {
    function addApp () {
      SettingsApp.Company.set('app', appType, {silent: true});
      App.modal.show(new SaveAppView({
        model: SettingsApp.Company
      }));
    };
    SettingsApp.initializeLayout(addApp);
  },

  SettingsApp.initializeLayout = function (cb) {
    var options = {
          type: 'get',
          url: '/api/get-company',
          success: function (res, status, xhr) {
            SettingsApp.Company = new Backbone.Model(res);
            App.content.show(new Layout({
              model: SettingsApp.Company
            }));
            if (cb) {
              cb();
            }
          }
      };
    $.ajax(options);
    App.MenuView.setActive('settings');
    Backbone.history.navigate('settings');
  };

  App.addInitializer(function () {
    SettingsApp.Router = new Router({
      controller: SettingsApp
    });
  });
});
