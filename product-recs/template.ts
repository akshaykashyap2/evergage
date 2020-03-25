import { RecommendationsConfig, RecipeReference, recommend } from "recs";

export class NewTemplate implements CampaignTemplateComponent {

    contentZone: "Featured Categories" | "Shop By Category";

    renderPosition: "before";

    @title("Title")
    title: string;
    
    @title("Recommendations")
    recipe: RecommendationsConfig = new RecommendationsConfig({itemType: "Product"});

    @buttonGroup(true)
    font: "Helvetica" | "Roboto" | "Open Sans";

    textColor: Color;

    run(context:CampaignComponentContext) {
        return {
            items: recommend(context, this.recipe)
        };
    }
    
}
