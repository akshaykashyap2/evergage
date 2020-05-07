import { UserSegmentLookup, UserSegmentReference } from "common"

export class GASegmentTemplate implements CampaignTemplateComponent {

    @lookupOptions(() => new UserSegmentLookup())
    segments: UserSegmentReference[]

    @title("Google Analytics Dimensions")
    @subtitle("Enter a comma or space delimited list of the Google Analytics dimension numbers")
    gaDimensions: string

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
