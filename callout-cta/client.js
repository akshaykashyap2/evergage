(function() {

  function apply(context, template, render) {
    if (context && context.calloutDirection) {
      
      var html = template(context);
      Evergage.cashDom(".live-chat .fa-stack").append(html);
      var callout = Evergage.cashDom("#evg-callout");
      var parent = callout.parent();
      var canvas = Evergage.cashDom("#evg-callout canvas");
      var ctx = document.querySelector("#evg-callout canvas").getContext("2d");
      var arrowFillStyle;
      var coord = []; // triangle: base, peak, base
      var position = context.calloutDirection.position;

      if (parent.css("position") === "static") {
        parent.css("position", "relative");
      }
    
    //-- Style config setup --// 
      if (context.style === "Dark on Light") {
        Evergage.cashDom("#evg-callout").addClass("evg-dark");
        Evergage.cashDom("#evg-callout .evg-cta").addClass("evg-dark");
        arrowFillStyle = "#f8f8f8";
      } else {
        Evergage.cashDom("#evg-callout").addClass("evg-light");
        Evergage.cashDom("#evg-callout .evg-cta").addClass("evg-light");
        arrowFillStyle = "#343a40";
      }

    //-- Callout positioning --//
      if (position === "top") {
        callout.css({"top":"0%", "left":"50%", "transform":"translate(-50%, calc(-100% - 20px))"});
        canvas.removeClass();
        canvas.addClass("top");
        coords = [ [5, 0], [10, 10], [15, 0] ];
      } else if (position === "bottom") {
        callout.css({"bottom":"0%", "left":"50%", "transform":"translate(-50%, calc(100% + 20px))"});
        canvas.removeClass();
        canvas.addClass("bottom");
        coords = [ [15, 20], [10, 10], [5, 20] ];
      } else if (position === "left") {
        callout.css({"top": "50%", "left":"0%", "transform":"translate(calc(-100% - 20px), -50%)"});
        canvas.removeClass();
        canvas.addClass("left");
        coords = [ [0, 15], [10, 10], [0, 5] ];
      } else if (position === "right") {
        callout.css({"bottom": "50%", "right":"0%", "transform":"translate(calc(100% + 20px), 50%)"});
        canvas.removeClass();
        canvas.addClass("right");
        coords = [ [20, 5], [10, 10], [20, 15] ];
      }

    //-- Callout triangle arrow --// 
      // set properties
      ctx.fillStyle = arrowFillStyle;
      ctx.strokeStyle = "rgb(0, 0, 0)";
      ctx.lineWidth =  2;

      // draw the arrow
      ctx.beginPath();
      ctx.moveTo(...coords[0]);
      ctx.lineTo(...coords[1]);
      ctx.lineTo(...coords[2]);
      ctx.closePath();
      
      // apply shadow on arrow
      ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
      ctx.shadowBlur = 1;
      
      // apply fill
      ctx.fill();

    //-- Dismisses callout --//
      Evergage.cashDom("#evg-callout .evg-close").on("click", function() {
        Evergage.cashDom("#evg-callout").remove();
      });
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