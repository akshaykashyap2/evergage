import { smartsearch, SmartSearchConfig } from "smartsearch";

export class SmartSearch implements CampaignTemplateComponent {

    @title("Recipe ID")
    recipeId: string;

    @hidden(true)
    maxItems: 12;

    run(context:CampaignComponentContext) {
        
        let contextUserId = context.user.id;
        return {
            userId: contextUserId
        };
    }

}