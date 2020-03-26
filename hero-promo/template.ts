export class HeroBannerPromo implements CampaignTemplateComponent {

    contentZone: string = "Homepage Hero";

    @hidden(true)
    renderPosition: "replace";

    header: string;

    bodyText: string;

    @title('CTA Text')
    ctaText: string;

    destinationURL: string;

    @title('Background Image URL')
    imageURL: string;

    @buttonGroup(true)
    font: "Helvetica" | "Roboto" | "Open Sans";
    
    textColor: Color;

    run(context:CampaignComponentContext) {
        return {};
    }
    
}