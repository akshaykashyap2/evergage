(function() {

  function apply(context, template, render) {
    let userSegments = context.userSegments;
    let userDimensions = context.userDimensions;

    if (window.ga && typeof window.ga === "function") {
        
        userSegments.forEach(function(userSegment, i) { debugger;
            if (userSegment) {
                let userDimension = 'dimension' + userDimensions[i]
                ga('set', userDimension, userSegment);
            }
        })

        ga('send', {
            hitType: 'event',
            eventCategory: 'Evergage',
            eventAction: 'Set Segments',
            nonInteraction: true
        });
    }

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