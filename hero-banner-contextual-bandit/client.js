(function() {

    function apply(context, template, render) {
        var html = template(context);
        Evergage.cashDom(".experience-carousel-bannerCarousel").html(html);
        render(context);
    }
  
    function reset(context, template) {
    }
    
    function control() {
    
    }
  
    registerTemplate({
      apply: apply,
      reset: reset,
      control: control
    });
  
  })();