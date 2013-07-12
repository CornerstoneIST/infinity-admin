App.UsersApp = function () {
  var
    UsersApp = {},
    Layout = Backbone.Marionette.Layout.extend({
      className: "container-fluid",
      template: "#users-template",
      events: {
        'click #new-user' : function () {
          App.content.show(new NewUserView());
          return false;
        },
        'click td a' : function () {
          App.content.show(new ProfileUserView());
          return false;
        }
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
            success: function () {
              App.content.show(new Layout());
            }
          };
          $('form').ajaxSubmit(options);
          return false;
        },
        'click input[type=reset]': function () {
          App.content.show(new Layout());
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
    });
    ProfileUserView = Backbone.Marionette.ItemView.extend({
      className: "container-fluid",
      template: "#profile-user-template",
      events: {
        'click input[type=reset]': function () {
          App.content.show(new Layout());
        }
      }
    });
  UsersApp.initializeLayout = function () {
    App.content.show(new Layout());
  };

  return UsersApp;
}();
