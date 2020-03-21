(function() {

    function apply(context, template, render) {
        var html = template(context);
        var div = Evergage.cashDom("div");
        Evergage.cashDom("body").append(html);
      
        Evergage.cashDom(".ecp-overlay, .ecp-close, .ecp-cancel").on("click", function() {
            Evergage.cashDom("#email-capture-popup").remove();
        });

        Evergage.cashDom(".ecp-cta").on("click", function(event) {
            Evergage.cashDom(".ecp-content").addClass("ecp-hide");
            Evergage.cashDom(".ecp-confirm-content").removeClass("ecp-hide");
        });
    }

    function reset(context, template) {
        var popup = Evergage.cashDom("#email-capture-popup");
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