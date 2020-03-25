export class PromoCodeInfobar implements CampaignTemplateComponent {

    @richText(true)
    bodyText: string;

    bodyTextColor: Color;

    @richText(true)
    linkText: string;
    
    @richText(true)
    linkTextColor: Color;

    @title('Link URL')
    destinationUrl: string;

    @buttonGroup(true)
    font: "Helvetica" | "Roboto" | "Open Sans";
    
    backgroundColor: Color;

    run(context:CampaignComponentContext) {
        return {};
    }
    
}