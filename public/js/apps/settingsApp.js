App.module("SettingsApp", function(SettingsApp, App, Backbone, Marionette, $, _){
  var
    Layout = Backbone.Marionette.Layout.extend({
      className: "container-fluid",
      template: "#settings-template",
      events: {
        'click a': 'setApp'
      },
      modelEvents: {
        "sync": function () {
          this.render();
        }
      },
      setApp: function (e) {
        e.preventDefault();
        SettingsApp.setApp($(e.target).attr('href'), $(e.target).hasClass('danger') ? 'delete' : null)
      }
    }),

    SaveAppView = Backbone.Marionette.ItemView.extend({
      getTemplate: function () {
        var me = this;
        if (this.options.type == 'delete') {
          return _.template($('#delete-app-template').html(), {
            model: me.model,
            app: me.options.app
          });
        }
        return _.template($('#save-app-template').html(), {
          model: me.model,
          app: me.options.app
        });
      },
      className: "modal-dialog",
      events: {
        'click #confirm': 'saveApp'
      },
      saveApp: function () {
        var error = false
          , app = {
              apiKey: this.$('#apiKey').val() || '',
              subDomain: this.$('#subDomain').val() || ''
            };
        if (this.options.app == 'zendesk') {
          app.username = this.$('#userName').val() || '';
        }
        _.each(this.$('input'), function (inp) {
          if ($(inp).val() == '') {
            error = true;
          }
        });
        if (error) {
          this.$('.alert').show();
          return false;
        }
        if (!SettingsApp.Company.get('integration')) {
          SettingsApp.Company.set('integration', {});
        }

        SettingsApp.Company.get('integration')[this.options.app] = app;
        SettingsApp.Company.save({}, {url: '/api/save-app'});
      }
    }),

    Router = Marionette.AppRouter.extend({
      appRoutes: {
        "settings": "showLayout"
      }
    });
  SettingsApp.setApp = function (appType, type) {
    if (!SettingsApp.Company) {
      getMainCompany();
    }
    App.modal.show(new SaveAppView({
      model: SettingsApp.Company,
      app: appType,
      type: type,
    }));
  },

  SettingsApp.showLayout = function (cb) {
    getMainCompany();
    App.content.show(new Layout({
      model: SettingsApp.Company
    }));
    App.MenuView.setActive('settings');
    Backbone.history.navigate('settings');
  };

  function getMainCompany () {
    var Company = Backbone.Model.extend({
      urlRoot: '/api/get-company',
      idAttribute: "_id"
    });
    SettingsApp.Company = new Company();
    SettingsApp.Company.fetch();
  };

  App.addInitializer(function () {
    SettingsApp.Router = new Router({
      controller: SettingsApp
    });
  });
});
