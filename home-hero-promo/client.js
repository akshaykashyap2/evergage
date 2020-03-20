(function() {

    function apply(context, template, render) {
      render(context);
    }
  
    function reset(context, template) {
      var inlineMsg = Evergage.cashDom(".hh-inline");
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