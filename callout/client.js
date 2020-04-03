(function() {

  function apply(context, template, render) {
    if (context && context.calloutDirection && context.backgroundColor) {
      var html = template(context);
      Evergage.cashDom(".live-chat .fa-stack").append(html);
      var callout = Evergage.cashDom("#evg-callout");
      var arrow = Evergage.cashDom("#evg-callout #evg-callout-arrow");
      var position = context.calloutDirection.position;
      var parent = callout.parent();
      if (parent.css("position") === "static") {
        parent.css("position", "relative");
      }
      
      if (position === "top") {
        arrow.removeClass();
        arrow.addClass("top");
        callout.css({"top":"0%", "left":"50%", "transform":"translate(-50%, calc(-100% - 20px))"})
      } else if (position === "bottom") {
        arrow.removeClass();
        arrow.addClass("bottom");
        callout.css({"bottom":"0%", "left":"50%", "transform":"translate(-50%, calc(100% + 20px))"});
      } else if (position === "left") {
        arrow.removeClass();
        arrow.addClass("left");
        callout.css({"top": "50%", "left":"0%", "transform":"translate(calc(-100% - 20px), -50%)"});
      } else if (position === "right") {
        arrow.removeClass();
        arrow.addClass("right");
        callout.css({"bottom": "50%", "right":"0%", "transform":"translate(calc(100% + 20px), 50%)"});
      }

      arrow.css("border-" + context.calloutDirection.position, "10px solid" + context.backgroundColor.hex);
    }
  }

  function reset(context, template) {
    Evergage.cashDom("#evg-callout").remove();
  }
  
  function control() {
    
  }

  registerTemplate({
    apply: apply,
    reset: reset,
    control: control
  });
  
})();