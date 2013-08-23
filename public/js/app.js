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
    this.$el.on('hide', function () {
       view.close();
    });
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
function enablePlgs () {
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
  });
};
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
    $('head title').text(li.find('span').text());
  },
  dashboard: function () {
    App.DashboardApp.initializeLayout();
  },
  reports: function () {
    App.ReportsApp.initializeLayout();
  },
  users: function () {
    App.UsersApp.showItems();
  },
  clients: function () {
    App.ClientsApp.showItems();
  },
  tasks: function () {
    App.TasksApp.initializeLayout();
  },
  organizer: function () {
    App.OrganizerApp.initializeLayout();
  },
  billing: function () {
    App.BillingApp.initializeLayout();
  },
  entries: function () {
    App.EntriesApp.showItems();
  },
  settings: function () {
    App.SettingsApp.showLayout();
  }
});

App.MenuView = new MenuView();

App.on("initialize:after", function () {
  if (Backbone.history){
    Backbone.history.start({ pushState: true }); 
  }
  enablePlgs();
});
