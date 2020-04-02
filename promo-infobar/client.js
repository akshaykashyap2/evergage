(function() {

  function apply(context, template, render) {
    var html = template(context);
    Evergage.cashDom("body").append(html);
    if (context.infobarPosition.position === "top") {
      Evergage.cashDom("body").css("margin-bottom", "0px");
      Evergage.cashDom("body").css("margin-top", "40px");
      Evergage.cashDom("#evg-promo-code-infobar").css("top", "0px");
    } else {
      Evergage.cashDom("body").css("margin-bottom", "40px");
      Evergage.cashDom("body").css("margin-top", "0px");
      Evergage.cashDom("#evg-promo-code-infobar").css("bottom", "0px");
    }
  }

  function reset(context, template) {
    Evergage.cashDom("#evg-promo-code-infobar").remove();
  }
  
  function control() {
    
  }

  registerTemplate({
    apply: apply,
    reset: reset,
    control: control
  });
  
})();