App = new Backbone.Marionette.Application();
var ModalRegion = Backbone.Marionette.Region.extend({
  el: "#modal",
  constructor: function () {
    Backbone.Marionette.Region.prototype.constructor.apply(this, arguments);
    this.on("show", this.showModal, this);
  },

  getEl: function (selector) {
    var $el = $(selector);
    $el.on("hidden", this.close);
    return $el;
  },

  showModal: function (view) {
    view.on("close", this.hideModal, this);
    this.$el.modal('show');
  },

  hideModal: function () {
    this.$el.modal('hide');
  }
});
App.addRegions({
  menu: "#sidebar-nav",
  content: ".content",
  modal: ModalRegion
});
App.content.on("show", function(view){
  // build all tooltips from data-attributes
  $("[data-toggle='tooltip']").each(function (index, el) {
    $(el).tooltip({
      placement: $(this).data("placement") || 'top'
    });
  });
  // custom uiDropdown element, example can be seen in user-list.html on the 'Filter users' button
  var uiDropdown = new function() {
    var self;
    self = this;
    this.hideDialog = function($el) {
        return $el.find(".dialog").hide().removeClass("is-visible");
    };
    this.showDialog = function($el) {
        return $el.find(".dialog").show().addClass("is-visible");
    };
    return this.initialize = function() {
      $("html").click(function() {
        $(".ui-dropdown .head").removeClass("active");
          return self.hideDialog($(".ui-dropdown"));
        });
        $(".ui-dropdown .body").click(function(e) {
          return e.stopPropagation();
        });
        return $(".ui-dropdown").each(function(index, el) {
          return $(el).click(function(e) {
            e.stopPropagation();
            $(el).find(".head").toggleClass("active");
            if ($(el).find(".head").hasClass("active")) {
              return self.showDialog($(el));
            } else {
              return self.hideDialog($(el));
            }
          });
        });
      };
  };
  // instantiate new uiDropdown from above to build the plugins
  new uiDropdown();
  // toggle all checkboxes from a table when header checkbox is clicked
  $(".table th input:checkbox").click(function () {
    $checks = $(this).closest(".table").find("tbody input:checkbox");
    if ($(this).is(":checked")) {
      $checks.prop("checked", true);
    } else {
      $checks.prop("checked", false);
    }     
  });

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
});

App.Routing = Backbone.Marionette.AppRouter.extend({
  appRoutes: {
    '': 'dashboard',
    'dashboard': 'dashboard',
    'reports': 'reports',
    'users': 'users',
    'clients': 'clients',
    'tasks': 'tasks',
    'at-a-glance': 'organizer',
    'billing': 'billing',
    'time-entries': 'entries',
    'setup': 'setup',
  }
});

App.addInitializer(function () {
  App.routing = new App.Routing({
    controller: App.MenuView
  });
});
