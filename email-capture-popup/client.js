(function() {

    function apply(context, template, render) {
        var html = template(context);
        var div = Evergage.cashDom("div");
        Evergage.cashDom("body").append(html);
      
        Evergage.cashDom(".evg-overlay, .evg-close, .evg-cancel").on("click", function() {
            Evergage.cashDom("#evg-email-capture-popup").remove();
        });

        Evergage.cashDom(".evg-cta").on("click", function(event) {
            Evergage.cashDom(".evg-content").addClass("evg-hide");
            Evergage.cashDom(".evg-confirm-content").removeClass("evg-hide");
        });
    }

    function reset(context, template) {
        var popup = Evergage.cashDom("#evg-email-capture-popup");
        if (popup) popup.remove();
    }

    function control() {
    
    }
  
    registerTemplate({
      apply: apply,
      reset: reset, 
      control: control
    });
    
  })();