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
        'click #new-user': function () {
          UsersApp.newItem();
          return false;
        },
        'click #manually': function () {
          UsersApp.newItem();
          return false;
        },
        'click #freshbooks': function () {
          UsersApp.importFreshbooks();
          return false;
        }
      }
    }),
    ItemView = Backbone.Marionette.ItemView.extend({
      template: "#user-item-template",
      tagName: 'tr',
      onRender: function () {
        if (!this.model.get('activated')) {
          this.$el.css('background-color', '#F7F7F7')
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
          var me = this
          , options = {
            url: '/api/new-user',
            type: 'post',
            success: function (data) {
              UsersApp.showItems();
              App.modal.show(new SuccessView({
                model: new User(data)
              }));
            },
            error: function (err) {
              if (err.responseText == "This email is in use") {
                me.$('.alert-error').show().text(err.responseText);
              }
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
    ImportView = Backbone.Marionette.ItemView.extend({
      template: "#import-users-template",
      className: "modal-dialog",
      onClose: function () {
        UsersApp.showItems();
      },
      onRender: function () {
        $('#modal').width('690px')
        var me = this
          , options = {
              type: 'get',
              url: '/api/import-freshbooks',
              success: function (res) {
                me.availableList = new ImportListView({
                  collection: new Backbone.Collection(res.appUsers),
                  actualUsers: new Backbone.Collection(res.actualUsers)
                });
                me.availableList.render();
                me.$('.available').html(me.availableList.el);
              },
              error: function (err) {
                if (err.responseText == "Freshbooks params not found") {
                  $('#modal').one('hidden', function () {
                    App.SettingsApp.addApp('freshbooks')
                  })
                  me.close();
                } else {
                  me.$('.alert').show().text('FreshBooks-' + err.responseText);
                }
              }
          };
        this.selectedList = new ImportListView({
            collection: new Backbone.Collection()
        });
        $.ajax(options);
        this.selectedList.render();
        this.$('.selected').html(this.selectedList.el);
      },
      events: {
        'click #confirm': function () {
          if (this.selectedList.collection.models.length !== 0) {
            var me = this
            , options = {
                type: 'post',
                url: '/api/freshbooks-users',
                success: function () {
                  $('#modal').one('hidden', function () {
                    App.modal.show(new SuccessView());
                  })
                }
              };
            Backbone.sync('create', this.selectedList.collection, options)
          }
        }
      }
    }),

    ItemClientView = Backbone.Marionette.ItemView.extend({
      template: _.template("<a style='width:244px;min-height: 20px;' href='#'> <%= first_name %> <%= last_name %> <small class='text-info pull-right'><%= organization %></small> </a>"),
      tagName: "li",
      initialize: function () {
        var me = this;
        this.$el.draggable({
          revert: "invalid",
          containment: "document",
          helper: "clone",
          start: function (event, ui) {
           $('.ui-droppable').not($(event.target).parents('.ui-droppable')).css('background-color', '#FCF8E3');
            App.vent.trigger('item:dragged', me.model);
          },
          stop: function (event, ui) {
            $('.ui-droppable').css('background-color', '#fff');
            App.vent.trigger('item:dragged', me.model);
          }
        });
      }
    }),

    ImportListView = Backbone.Marionette.CompositeView.extend({
      className: "span3",
      onCompositeCollectionRendered: function () {
        if (this.collection.length === 0) {
          this.$('ul').html('<li class="empty"><a href="#"> EMPTY </a></li>');
        }
        var me = this;
        this.$el.droppable({
          drop: function (e) {
            App.vent.trigger('item:dropped', e.target);
          }
        });
      },
      initialize: function () {
        var me = this;
        if (this.options.actualUsers) {
          this.options.actualUsers.models.forEach(function (actualModel, i) {
            me.collection.models.forEach(function (appModel, i) {
              if (actualModel.get('email') == appModel.get('email')) {
                me.collection.remove(appModel);
              }
            })
          })
        }
        App.vent.on('item:dragged', function (model) {
          me.selectedItem = model;
        })
        App.vent.on('item:dropped', function (target) {
          if (me.collection.contains(me.selectedItem) & me.el != target) {
            me.collection.remove(me.selectedItem);
          } else if (me.el == target) {
            me.collection.add(me.selectedItem);
          }
        })
      },
      itemView: ItemClientView,
      itemViewContainer: "ul",
      template: function () {
        return _.template("<ul class='nav nav-tabs nav-stacked' style='margin-bottom: 0px;'></ul>");
      },
      collectionEvents: {
        "all": function () {
          if (this.collection.length === 0) {
            this.$('ul').html('<li class="empty"><a href="#"> EMPTY </a></li>');
          } else {
            this.$('.empty').remove();
          }
        }
      }
    }),

    Router = Marionette.AppRouter.extend({
      appRoutes: {
        "users": "showItems"
        , "users/new": "newItem"
        , "users/:id": "showItem"
        , "users/import/freshbooks": "importFreshbooks"
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

  UsersApp.importFreshbooks = function () {
    UsersApp.showItems();
    App.modal.show(new ImportView());
    Backbone.history.navigate('users/import/freshbooks');
  };

  UsersApp.showItems = function () {
    UsersApp.initializeLayout();
    App.content.show(UsersApp.layout);
    UsersApp.layout.table.show(UsersApp.Table);
    App.MenuView.setActive('users');
    Backbone.history.navigate('users');
    App.modal.close();
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
