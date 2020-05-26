(function() {

  function apply(context, template, render) {
    render(context);

    if (context.style === "Dark on Light") {
      Evergage.cashDom("#evg-hero-cta, #evg-hero-cta .evg-cta").addClass("evg-dark");
    } else {
      Evergage.cashDom("#evg-hero-cta, #evg-hero-cta .evg-cta").addClass("evg-light");
    }
  }

  function reset(context, template) {
    Evergage.cashDom("#evg-hero-cta");
  }

  function control() {
  
  }

  registerTemplate({
    apply: apply,
    reset: reset,
    control: control
  });
  
})();