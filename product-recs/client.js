(function() {

  function apply(context, template, render) {
    var html = template(context);
    Evergage.cashDom(".experience-component.experience-layouts-3_column").before(html);
  }

  function reset(context, template) {
    Evergage.cashDom("#evg-product-recs").remove();
  }
  
  function control() {
    
  }

  registerTemplate({
    apply: apply,
    reset: reset,
    control: control
  });
  
})();