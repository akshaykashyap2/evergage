export class HeroBannerCta implements CampaignTemplateComponent {

    @title('Background Image URL')
    imageURL: string;
    
    @hidden(true)
    contentZone: string = "Homepage Hero";

    header: string;

    bodyText: string;

    @title('CTA Text')
    ctaText: string;

    destinationURL: string;

    @buttonGroup(true)
    font: "Helvetica" | "Roboto" | "Open Sans";
    
    textColor: Color;

    run(context:CampaignComponentContext) {
        return {};
    }
    
}