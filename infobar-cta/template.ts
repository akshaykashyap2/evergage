export class ComplexType {
    position: string;
    label: string;
}

export class InfobarCta implements CampaignTemplateComponent {

    @options([
        {position: "top", label: "Top"},
        {position: "bottom", label: "Bottom"}
    ])
    infobarPosition: ComplexType;

    @richText(true)
    mainText: string;

    mainTextColor: Color;

    @richText(true)
    @title('CTA Text')
    ctaText: string;
    
    @richText(true)
    @title('CTA Text Color')
    ctaTextColor: Color;

    @title('CTA URL')
    ctaUrl: string;

    @buttonGroup(true)
    font: "Helvetica" | "Roboto" | "Open Sans";
    
    backgroundColor: Color;

    run(context:CampaignComponentContext) {
        return {};
    }
    
}