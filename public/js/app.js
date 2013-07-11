App = new Backbone.Marionette.Application();
App.addRegions({
    menu: "#sidebar-nav",
    content: ".content"
  });
  var MenuView = Backbone.Marionette.View.extend({
    el: "#sidebar-nav",

    events: {
      'click li': function (e) {
        e.preventDefault();
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
      $('head title').text('Dashboard')
      Backbone.history.navigate('dashboard');
      this.setActive('dashboard');
      App.DashboardApp.initializeLayout();
    },
    reports: function () {
      $('head title').text('Reports')
      Backbone.history.navigate('reports');
      this.setActive('reports');
      App.ReportsApp.initializeLayout();
    },
    users: function () {
      $('head title').text('Users')
      Backbone.history.navigate('users');
      App.UsersApp.initializeLayout();
      this.setActive('users');
    },
    clients: function () {
      $('head title').text('Clients')
      Backbone.history.navigate('clients');
      App.ClientsApp.initializeLayout();
      this.setActive('clients');
    },
    tasks: function () {
      $('head title').text('Tasks')
      Backbone.history.navigate('tasks');
      App.TasksApp.initializeLayout();
      this.setActive('tasks');
    },
    organizer: function () {
      $('head title').text('At a Glance')
      Backbone.history.navigate('at-a-glance');
      App.OrganizerApp.initializeLayout();
      this.setActive('organizer');
    },
    billing: function () {
      $('head title').text('Billing & Account')
      Backbone.history.navigate('billing');
      App.BillingApp.initializeLayout();
      this.setActive('billing');
    },
    entries: function () {
      $('head title').text('Time Entries')
      Backbone.history.navigate('time-entries');
      App.EntriesApp.initializeLayout();
      this.setActive('entries');
    },
    setup: function () {
      $('head title').text('First time Setup')
      Backbone.history.navigate('setup');
      App.SetupApp.initializeLayout();
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
