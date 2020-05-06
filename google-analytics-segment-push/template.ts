import { UserSegmentLookup, UserSegmentReference } from "common"

export class GASegmentTemplate implements CampaignTemplateComponent {
    
    @lookupOptions(() => new UserSegmentLookup())
    segments: UserSegmentReference[]

    googleAnalyticsDimensions: string

    run(context:CampaignComponentContext) {

        console.log("user id is", context.user.id);
        // console.log("this.segments is", this.segments);
        // console.log("this.segments is", JSON.stringify(this.segments));

        let userSegments = [];
        if (this.segments) {
            this.segments.forEach(function(segment) { 

                // console.log("segment is", JSON.stringify(segment));
                // console.log("segment ID is", JSON.stringify(segment.id));

                let segmentJoinDate = context.user.getSegmentJoinDate(segment.id);
            
                console.log("segmentJoinDate", segmentJoinDate)

                if (segmentJoinDate) {
                    userSegments.push(segment.id);
                } 

                // console.log("segmentJoinDates", userSegments)
            });
        }
        
        // console.log("segments are", userSegments);
        
        // let usersegmentcheck = userSegmentRule.isUserMember(context, user) // deprecated
        // let segmentJoinDate = context.user.getSegmentJoinDate("CZkDo")

        let gaDimensions = this.googleAnalyticsDimensions;
        let userDimensions = gaDimensions? gaDimensions.split(",").map(Number): []
        // console.log(gaDimensionsNumbers);

        // let gaDimensionsNumbers = []
        // if (gaDimensions) {
        //     gaDimensionsNumbers = gaDimensions.split(",").map(Number);
        //     console.log(gaDimensionsNumbers)
        // }

        return {
            userSegments: userSegments,
            userDimensions: userDimensions
        };
    }
}
