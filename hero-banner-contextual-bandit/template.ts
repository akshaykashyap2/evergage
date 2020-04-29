import {ContextualBanditConfig, decide} from "corvus";

export class CorvusTemplate implements CampaignTemplateComponent {

    readonly doc = "No configuration required for this template.";

    @hidden(true)
    banditFeatureSubsetId: string = "HVuhl";

    run(context: CampaignComponentContext) {
            
        let banditConfig : ContextualBanditConfig = {
            contentZone: "Homepage Banner",
            maxResults: 1,
            banditFeatureSubsetId: this.banditFeatureSubsetId,
            imageWidth: 1800,
            imageHeight: 600
        } as ContextualBanditConfig;
        let promo = decide(context, banditConfig, null)[0] as Promotion;
        if (promo == null) {
            return { promotion: {} as Promotion, promotionImageUrl: ""};
        }
        return { promotion: promo, promotionImageUrl: promo.images["1800x600"].imageUrl };
    }
}