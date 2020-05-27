(function() {

    function apply(context, template, render) {
        var html = template(context);
        Evergage.cashDom("body").append(html);
      
        Evergage.cashDom("#evg-email-capture-popup .evg-overlay, #evg-email-capture-popup .evg-close, #evg-email-capture-popup .evg-opt-out").on("click", function() {
            Evergage.cashDom("#evg-email-capture-popup").remove();
        });

        Evergage.cashDom("#evg-email-capture-popup .evg-cta").on("click", function(event) {
            Evergage.cashDom("#evg-email-capture-popup .evg-content").addClass("evg-hide");
            Evergage.cashDom("#evg-email-capture-popup .evg-confirm-content").removeClass("evg-hide");
        });

        if (context.style === "Dark on Light") {
            Evergage.cashDom("#evg-email-capture-popup, #evg-email-capture-popup .evg-cta").addClass("evg-dark");
        } else {
            Evergage.cashDom("#evg-email-capture-popup, #evg-email-capture-popup .evg-cta").addClass("evg-light");
        }
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