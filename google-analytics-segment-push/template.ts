import { UserSegmentLookup, UserSegmentReference } from "common"

export class GASegmentTemplate implements CampaignTemplateComponent {

    @lookupOptions(() => new UserSegmentLookup())
    segments: UserSegmentReference[]

    @title("Google Analytics Dimensions")
    @subtitle("Enter a comma or space delimited list of the Google Analytics dimension numbers")
    gaDimensions: string

    validate() {
        let segmentCount = this.segments ? this.segments.length : 0;
        return new Validator(this)
            .applyPredicate("gaDimensions", function(val) {
                let dimensionCount = val ? val.match(/\d+/g).length : 0;
                return dimensionCount != segmentCount ? 'Number of dimensions must match number of segments chosen' : true
            })
            .errors;
    }
    
    run(context:CampaignComponentContext) {

        let userDimensions = this.gaDimensions ? this.gaDimensions.match(/\d+/g).map(Number) : []

        let userSegments = [];
        if (this.segments) {
            this.segments.forEach(function(segment) { 
                let segmentJoinDate = context.user.getSegmentJoinDate(segment.id);
                userSegments.push(segmentJoinDate ? true : false);
            });
        }

        return {
            userSegments: userSegments,
            userDimensions: userDimensions
        };
    }
}
