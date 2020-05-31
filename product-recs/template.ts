import { RecipeReference, RecipeReferenceLookup, recommend } from "recs";

export class ProductRecommendationsTemplate implements CampaignTemplateComponent {

    @title("Recommendations Row Header")
    header: string;

    @lookupOptions((self) => new RecipeReferenceLookup("Product"))
    @title("Recipe")
    recipeId: RecipeReference;

    run(context:CampaignComponentContext) {
        const items = recommend(context, {
            itemType: "Product",
            maxResults: 4,
            recipeId: this.recipeId,
            validate: () => true
        });
        return {
            items
        };
    }
}