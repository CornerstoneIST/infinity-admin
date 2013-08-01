App.module("UsersApp", function (UsersApp, App, Backbone, Marionette, $, _) {
  var
    User = Backbone.Model.extend({
      urlRoot: '/api/user',
      idAttribute: "_id"
    }),
    Users = Backbone.Paginator.requestPager.extend({
      model: User,
      paginator_core: {
        type: 'GET',
        dataType: 'json',
        url: '/api/users'
      },
      paginator_ui: {
        firstPage: 1,
        currentPage: 1,
        perPage: 5,
        totalPages: 5
      },
      server_api: {
        'per_page': function() { return this.perPage },
        'page': function() { return this.currentPage }
      },
      parse: function (response) {
        this.totalRecords = response.count;
        this.totalPages = Math.ceil(response.count / this.perPage);
        return response.collection;
      }
    }),
    Layout = Backbone.Marionette.Layout.extend({
      className: "container-fluid",
      regions: {
        table: "#table",
        pagination: "#pagination"
      },
      template: "#users-template",
      events: {
        'click #new-user' : function (e) {
          UsersApp.newItem();
          return false;
        }
      }
    }),
    ItemView = Backbone.Marionette.ItemView.extend({
      template: "#user-item-template",
      tagName: 'tr',
      onRender: function () {
        if (!this.model.get('activated')) {
          this.$el.css('background-color', '#FDFDFD')
        }
      },
      events: {
        'click' : function () {
          UsersApp.showItem(this.model.id)
          return false;
        }
      }
    }),
    TableUsersView = Backbone.Marionette.CompositeView.extend({
      collection: UsersApp.Users,
      itemView: ItemView,
      itemViewContainer: "tbody",
      className: "table table-hover",
      tagName: "table",
      template: "#users-table-template",
      initialize: function () {
        this.collection.pager({
          success: function(){
            UsersApp.layout.pagination.show(new App.Common.Views.PaginationView({
              collection: UsersApp.Users
            }));
          }
        });
      }
    }),
    NewUserView = Backbone.Marionette.ItemView.extend({
      className: "container-fluid",
      template: "#new-user-template",
      events: {
        'submit form' : function (e) {
          e.preventDefault();
          var options = { 
            url: '/new-user',
            type: 'post',
            success: function (data) {
              App.modal.show(new SuccessView({
                model: new User(data)
              }));
              UsersApp.showItems();
            }
          };
          $('form').ajaxSubmit(options);
          return false;
        },
        'click input[type=reset]': function () {
          UsersApp.showItems();
        },
        'click .toggle-inputs button' : function (e) {
          var
            $buttons = this.$(".toggle-inputs button"),
            $form = this.$("form.new_user_form"),
            mode = $(e.currentTarget).data("input");
          $buttons.removeClass("active");
          $(e.currentTarget).addClass("active");
          if (mode === "inline") {
            $form.addClass("inline-input");
          } else {
            $form.removeClass("inline-input");
          }
        }
      }
    }),
    ProfileUserView = Backbone.Marionette.ItemView.extend({
      className: "container-fluid",
      template: "#profile-user-template",
      events: {
        'click input[type=reset]': function () {
          UsersApp.showItems();
        }
      }
    }),
    SuccessView = Backbone.Marionette.ItemView.extend({
      template: "#success-template",
      className: "modal-dialog"
    }),
    ActivateView = Backbone.Marionette.ItemView.extend({
      template: "#activate-user-template",
      className: "modal-dialog",
      events: {
        'click #confirm': function () {
          var options = {
              type: 'post',
              url: '/api/activation?id=' + this.model.get('_id'),
              data: this.$('form').serialize(),
              success: function () {
                console.log('success')
              }
            };
          $.ajax(options);
        }
      }
    }),
    Router = Marionette.AppRouter.extend({
      appRoutes: {
        "users": "showItems",
        "users/new": "newItem",
        "activation/:id": "activateUser",
        "users/:id": "showItem"
      }
    });
  
  UsersApp.newItem = function () {
    App.MenuView.setActive('users');
    App.content.show(new NewUserView());
    Backbone.history.navigate('users/new');
  };
  UsersApp.activateUser = function (id) {
    App.MenuView.setActive('users');
    var user = new User();
    user.fetch({
      data: { id: id },
      success: function () {
        App.modal.show(new ActivateView({
          model: user
        }));
      }
    })
    Backbone.history.navigate('activation/' + id);
  };
  UsersApp.showItem = function (id) {
    App.MenuView.setActive('users');
    var user = new User();
    user.fetch({
      data: { id: id },
      success: function () {
        App.content.show(new ProfileUserView({
          model: user
        }));
      }
    })
    Backbone.history.navigate('users/' + id);
  };
  UsersApp.showItems = function () {
    UsersApp.initializeLayout();
    App.content.show(UsersApp.layout);
    UsersApp.layout.table.show(UsersApp.Table);
    App.MenuView.setActive('users');
    Backbone.history.navigate('users');
  };
  UsersApp.initializeLayout = function () {
    UsersApp.Users = new Users();
    UsersApp.layout = new Layout();
    UsersApp.Table = new TableUsersView({
      collection: UsersApp.Users
    });
  };

  App.addInitializer(function () {
    UsersApp.Router = new Router({
      controller: UsersApp
    });
  });
});
