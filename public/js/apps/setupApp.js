App.module("SetupApp", function(SetupApp, App, Backbone, Marionette, $, _){
  var
    Layout = Backbone.Marionette.Layout.extend({
      className: "container-fluid",
      template: "#setup-template",
      initialize: function () {
        this.on('show', function () {
          var $wizard = $('#fuelux-wizard'),
          $btnPrev = $('.wizard-actions .btn-prev'),
          $btnNext = $('.wizard-actions .btn-next'),
          $btnFinish = $(".wizard-actions .btn-finish");
          $wizard.wizard().on('finished', function(e) {
          // wizard complete code
          }).on("changed", function(e) {
            var step = $wizard.wizard("selectedItem");
            // reset states
            $btnNext.removeAttr("disabled");
            $btnPrev.removeAttr("disabled");
            $btnNext.show();
            $btnFinish.hide();
            if (step.step === 1) {
              $btnPrev.attr("disabled", "disabled");
            } else if (step.step === 4) {
              $btnNext.hide();
              $btnFinish.show();
            }
          });
          $btnPrev.on('click', function() {
            $wizard.wizard('previous');
          });
          $btnNext.on('click', function() {
            $wizard.wizard('next');
          });

          // add uniform plugin styles to html elements
          $("input:checkbox, input:radio").uniform();
          // select2 plugin for select elements
          $(".select2").select2({
          placeholder: "Select a State"
          });
          // datepicker plugin
          $('.datepicker').datepicker().on('changeDate', function (ev) {
          $(this).datepicker('hide');
          });
          // wysihtml5 plugin on textarea
          $(".wysihtml5").wysihtml5({
          "font-styles": false
          });

          $('.question2').change(function(){
            $('.customQuestion2').hide();
            $('#' + $(this).val()).show();
          });

          $('.question1').change(function(){
            $('.customQuestion1').slideUp(1);
            $('#' + $(this).val()).slideDown(1);
          });

          $('form').on('submit', function(){
            var options = { 
              data: $(":input").not('#step1 input').serializeArray(),
              url: '/new-owner',
              type: 'post'
            };
            $(this).ajaxSubmit(options);
            return false;
          });

          $('#starter').click(function(){
              var token = function(res){
                var $input = $('<input type=hidden name=stripeToken />').val(res.id),
                    $plan = $('<input type=hidden name=plan value=starter />');
                $('form').first().append($input).append($plan).submit();
              };
              StripeCheckout.open({
                key:         'pk_test_sXNhYvC4yLuqun43GYrHhR0I',
                address:     false,
                amount:      1500,
                currency:    'usd',
                name:        'Starter Package',
                description: 'A bag of Pistachios',
                panelLabel:  'Start Trial',
                token:       token
              });
              return false;
            });
            $('#professional').click(function(){
              var token = function(res){
                var $input = $('<input type=hidden name=stripeToken />').val(res.id),
                    $plan = $('<input type=hidden name=plan value=professional />');
                $('form').first().append($input).append($plan).submit();
              };
              StripeCheckout.open({
                key:         'pk_test_sXNhYvC4yLuqun43GYrHhR0I',
                address:     false,
                amount:      2900,
                currency:    'usd',
                name:        'Professional Package',
                description: 'A bag of Pistachios',
                panelLabel:  'Start Trial',
                token:       token
              });
              return false;
            });
            $('#advanced').click(function(){
            var token = function(res){
              var $input = $('<input type=hidden name=stripeToken />').val(res.id),
                  $plan = $('<input type=hidden name=plan value=advanced />');
              $('form').first().append($input).append($plan).submit();
            };
            StripeCheckout.open({
              key:         'pk_test_sXNhYvC4yLuqun43GYrHhR0I',
              address:     false,
              amount:      4900,
              currency:    'usd',
              name:        'Advanced Package',
              description: 'A bag of Pistachios',
              panelLabel:  'Start Trial',
              token:       token
            });
            return false;
          });

        });
      }
    }),
    Router = Marionette.AppRouter.extend({
      appRoutes: {
        "setup": "initializeLayout"
      }
    });
  SetupApp.initializeLayout = function () {
    App.content.show(new Layout());
    App.MenuView.setActive('setup');
    Backbone.history.navigate('setup');
  };

  App.addInitializer(function () {
    SetupApp.Router = new Router({
      controller: SetupApp
    });
  });
});
