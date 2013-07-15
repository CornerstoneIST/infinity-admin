App.UsersApp = function () {
  var
    UsersApp = {},
    User = Backbone.Model.extend({
      urlRoot: '/api/members',
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
          App.content.show(new NewUserView());
          return false;
        }
      }
    }),
    ItemView = Backbone.Marionette.ItemView.extend({
      template: "#user-item-template",
      tagName: 'tr',
      events: {
        'click' : function () {
          App.content.show(new ProfileUserView({
            model: this.model
          }));
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
    });
  UsersApp.showItems = function () {
    UsersApp.layout = new Layout();
    App.content.show(UsersApp.layout);
    UsersApp.layout.table.show(UsersApp.Table);
  };
  UsersApp.initializeLayout = function () {
    UsersApp.Users = new Users();
    UsersApp.Table = new TableUsersView({
      collection: UsersApp.Users
    });
    UsersApp.Users.fetch();
    UsersApp.showItems();
  };

  return UsersApp;
}();
