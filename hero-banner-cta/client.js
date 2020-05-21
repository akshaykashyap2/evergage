(function() {

  function apply(context, template, render) {
    render(context);
  }

  function reset(context, template) {
    var inlineMsg = Evergage.cashDom("#evg-hero-cta");
    if (inlineMsg) inlineMsg.remove();
  }

  function control() {
  
  }

  registerTemplate({
    apply: apply,
    reset: reset,
    control: control
  });
  
})();