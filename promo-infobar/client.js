(function() {

  function apply(context, template, render) {
    var html = template(context);
    Evergage.cashDom("body").css("margin-top", "40px");
    Evergage.cashDom("body").append(html);
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