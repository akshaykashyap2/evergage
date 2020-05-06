(function() {

  function apply(context, template, render) {
    let userSegments = context.userSegments;
    let userDimensions = context.userDimensions;
    // console.log(userSegments[0])

    if (window.ga && typeof window.ga === "function") {
        // var segments = {
        //     "d3jv3": false,
        //     "K871s": false,
        //     "gWOBI": false
        // };

        // /* #set ($segmentIds = $tools.user.get('SegmentIds', 'none')) */
        // /* #if ($segmentIds.contains('d3jv3')) */
        // segments.d3jv3 = true;
        // /* #end */
        // /* #if ($segmentIds.contains('K871s')) */
        // segments.K871s = true;
        // /* #end */
        // /* #if ($segmentIds.contains('gWOBI')) */
        // segments.gWOBI = true;
        // /* #end */

        userSegments.forEach(function(userSegment) {
            let userDimension = 'dimension' + userDimensions.pop()
            ga('set', userDimension, userSegment);
        })
 
        // ga('set', 'dimension1', "K871s");
        // ga('set', 'dimension2', segments[1]);
        // ga('set', 'dimension3', segments[2]);
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