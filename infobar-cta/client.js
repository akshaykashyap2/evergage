(function() {

  function apply(context, template, render) {
    if (context && context.infobarPosition) {
      var html = template(context);
      Evergage.cashDom("body").append(html);
      
      // Infobar positioning
      if (context.infobarPosition.position === "top") {
        Evergage.cashDom("body").css("margin-bottom", "0px");
        Evergage.cashDom("body").css("margin-top", "42px");
        Evergage.cashDom("#evg-infobar-cta").css("top", "0px");
      } else {
        Evergage.cashDom("body").css("margin-bottom", "42px");
        Evergage.cashDom("body").css("margin-top", "0px");
        Evergage.cashDom("#evg-infobar-cta").css("bottom", "0px");
      }

      // 'Style' config setup
      if (context.style === "Dark on Light") {
        Evergage.cashDom("#evg-infobar-cta").addClass("evg-dark");
        Evergage.cashDom("#evg-infobar-cta .evg-cta").addClass("evg-dark");
      } else {
        Evergage.cashDom("#evg-infobar-cta").addClass("evg-light");
        Evergage.cashDom("#evg-infobar-cta .evg-cta").addClass("evg-light");
      }

      // Dismisses callout
      Evergage.cashDom("#evg-infobar-cta .evg-close").on("click", function() {
        Evergage.Render.reset("Global - Infobar with Call-to-Action", context);
      });
    }
  }

  function reset(context, template) {
    Evergage.cashDom("#evg-infobar-cta").remove();
    Evergage.cashDom("body").css("margin-bottom", "0px");
    Evergage.cashDom("body").css("margin-top", "0px");
  }
  
  function control() {
    
  }

  registerTemplate({
    apply: apply,
    reset: reset,
    control: control
  });
  
})();