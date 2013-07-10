App = new Backbone.Marionette.Application();
App.addRegions({
    menu: "#sidebar-nav",
    content: ".container-fluid"
  });
  var MenuView = Backbone.Marionette.View.extend({
    el: "#sidebar-nav",

    events: {
      'click li': function (e) {
        this[$(e.currentTarget).find('a').attr('href')]();
        return false;
      }
    },
    setActive: function (href) {
      var
        li = this.$('a[href=' + href +']').parent(),
        arrow = $('#arrow-template').html();
      this.$('.pointer').remove();
      this.$('.active').removeClass('active');
      li.addClass('active').append(arrow);        
    },
    dashboard: function () {
      Backbone.history.navigate('dashboard');
      this.setActive('dashboard');
      App.DashboardApp.initializeLayout();
    },
    reports: function () {
      Backbone.history.navigate('reports');
      this.setActive('reports');
      App.ReportsApp.initializeLayout();
    },
    users: function () {
      Backbone.history.navigate('users');
      App.UsersApp.initializeLayout();
      this.setActive('users');
    },
    clients: function () {
      Backbone.history.navigate('clients');
      App.ClientsApp.initializeLayout();
      this.setActive('clients');
    },
    tasks: function () {
      Backbone.history.navigate('tasks');
      this.setActive('tasks');
    },
    organizer: function () {
      Backbone.history.navigate('at-a-glance');
      this.setActive('organizer');
    },
    billing: function () {
      Backbone.history.navigate('billing');
      this.setActive('billing');
    },
    entries: function () {
      Backbone.history.navigate('time-entries');
      this.setActive('entries');
    },
    setup: function () {
      Backbone.history.navigate('billing');
      this.setActive('setup');
    }
  });
  App.MenuView = new MenuView();

  App.on("initialize:after", function () {
    Backbone.history.start({ pushState: true });
    Backbone.history.navigate('dashboard', true);
  });

  App.Routing = Backbone.Marionette.AppRouter.extend({
    appRoutes: {
      'dashboard': 'dashboard',
      'reports': 'reports',
      'users': 'users',
      'clients': 'clients',
      'tasks': 'tasks',
      'at-a-glance': 'organizer',
      'billing': 'billing',
      'time-entries': 'entries',
      'setup': 'billing',
    }
  });

  App.addInitializer(function () {
    App.routing = new App.Routing({
      controller: App.MenuView
    });
  });
