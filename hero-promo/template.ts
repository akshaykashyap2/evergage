export class HomeHeroPromo implements CampaignTemplateComponent {

    @hidden(true)
    contentZone: string = "Homepage Hero";

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