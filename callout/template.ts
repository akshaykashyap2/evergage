export class ComplexType {
    position: string;
    label: string; 
}

export class PromoCodeInfobar implements CampaignTemplateComponent {

    @options([
        {position: "top", label: "Top"},
        {position: "bottom", label: "Bottom"},
        {position: "left", label: "Left"},
        {position: "right", label: "Right"}
    ])
    calloutDirection: ComplexType;

    backgroundColor: Color;

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

    run(context:CampaignComponentContext) {
        return {};
    }
    
}