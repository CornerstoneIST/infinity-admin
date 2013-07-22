App.module("UsersApp", function (UsersApp, App, Backbone, Marionette, $, _) {
  var
    User = Backbone.Model.extend({
      urlRoot: '/api/member',
      idAttribute: "_id"
    }),
    Users = Backbone.Collection.extend({
      url: '/api/members',
      model: User
    }),
    Layout = Backbone.Marionette.Layout.extend({
      className: "container-fluid",
      regions: {
        table: "#table"
        //pagination: ".pagination"
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
      template: "#users-table-template"
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
              UsersApp.Users.add(data);
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
    Router = Marionette.AppRouter.extend({
      appRoutes: {
        "users": "showItems",
        "users/new": "newItem",
        "users/:id": "showItem",
      }
    });

  UsersApp.newItem = function () {
    App.MenuView.setActive('users');
    App.content.show(new NewUserView());
    Backbone.history.navigate('users/new');
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
    UsersApp.Users.fetch();
  };

  App.addInitializer(function () {
    UsersApp.Router = new Router({
      controller: UsersApp
    });
  });
});
