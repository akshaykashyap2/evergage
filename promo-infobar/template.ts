export class ComplexType {
    position: string;
    label: string;
}

export class PromoCodeInfobar implements CampaignTemplateComponent {

    @options([
        {position: "top", label: "Top"},
        {position: "bottom", label: "Bottom"}
    ])
    infobarPosition: ComplexType;

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