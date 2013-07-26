App.module("Common.Views", function (Views, App, Backbone, Marionette, $, _) {
  Views.PaginationView = Backbone.Marionette.ItemView.extend({
    className: ".row-fluid",
    template: "#pagination-template",
    serializeData: function () {
      return this.collection
    },
    collectionEvents: {
      "sync": function () {
        this.render();
      }
    },
    events: {
      'click a[href=next]': 'nextResultPage',
      'click a[href=prev]': 'previousResultPage',
      'click a.page': 'gotoPage',
      'click .btn-group button': 'changeCount',
    },
    nextResultPage: function (e) {
      e.preventDefault();
      if (this.collection.currentPage >= this.collection.totalPages) {
        return false;
      }
      this.collection.requestNextPage();
    },
    previousResultPage: function (e) {
      e.preventDefault();
      if (this.collection.currentPage == 1) {
        return false;
      }
      this.collection.requestPreviousPage();
    },
    gotoPage: function (e) {
      e.preventDefault();
      var page = $(e.target).text();
      this.collection.goTo(page);
    },
    changeCount: function (e) {
      e.preventDefault();
      this.collection.howManyPer($(e.target).val());
    }
  });
});
