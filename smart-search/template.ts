import { smartsearch, SmartSearchConfig } from "smartsearch";

export class SmartSearch implements CampaignTemplateComponent {

    @title("Recipe ID")
    recipeId: string;

    @title("Max number of items")
    maxItems: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

    run(context:CampaignComponentContext) {
        
        let contextUserId = context.user.id;
        return {
            userId: contextUserId
        };
    }

}