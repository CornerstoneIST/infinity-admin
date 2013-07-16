App.EntriesApp = function () {
  var
    EntriesApp = {},
    Ticket = Backbone.Model.extend({
      urlRoot: '/api/tickets',
      idAttribute: "_id"
    }),
    Tickets = Backbone.Collection.extend({
      url: '/api/tickets',
      model: Ticket
    }),
    Layout = Backbone.Marionette.Layout.extend({
      className: "container-fluid",
      template: "#entries-template",
      regions: {
        table: "#table"
        //pagination: ".pagination"
      },
      initialize: function () {
        this.on('show', function () {
           // add uniform plugin styles to html elements
          // $("input:checkbox, input:radio").uniform();
          // select2 plugin for select elements
          $(".select2").select2({
            placeholder: "Select a State"
          });
          // datepicker plugin
          $('.startDate').datepicker().on('changeDate', function (ev) {
            $(this).datepicker('hide');
          });
          $('.endDate').datepicker().on('changeDate', function (ev) {
            $(this).datepicker('hide');
          });
          // wysihtml5 plugin on textarea
          $(".wysihtml5").wysihtml5({
            "font-styles": false
          });
        });
      }
    }),
    ItemView = Backbone.Marionette.ItemView.extend({
      template: "#entries-item-template",
      tagName: 'tr',
      onShow: function () {
        // add uniform plugin styles to html elements
        $("input:checkbox, input:radio").uniform();
      }
    }),
    TableEntriesView = Backbone.Marionette.CompositeView.extend({
      collection: EntriesApp.Tickets,
      itemView: ItemView,
      itemViewContainer: "tbody",
      className: "table table-hover",
      tagName: "table",
      template: "#entries-table-template"
    });
  EntriesApp.showItems = function () {
    EntriesApp.layout = new Layout();
    App.content.show(EntriesApp.layout);
    EntriesApp.layout.table.show(EntriesApp.Table);
  };
  EntriesApp.initializeLayout = function () {
    EntriesApp.Tickets = new Tickets();
    EntriesApp.Table = new TableEntriesView({
      collection: EntriesApp.Tickets
    });
    EntriesApp.Tickets.fetch();
    EntriesApp.showItems();
  };

  return EntriesApp;
}();
