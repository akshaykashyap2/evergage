(function() {

  function apply(context, template, render) {
    render(context);   
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