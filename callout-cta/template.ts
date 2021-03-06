export class ComplexType {
    position: string;
    label: string; 
}

export class CalloutCtaTemplate implements CampaignTemplateComponent {

    @options([
        {position: "top", label: "Top"},
        {position: "bottom", label: "Bottom"},
        {position: "left", label: "Left"},
        {position: "right", label: "Right"}
    ])
    calloutDirection: ComplexType;
    
    style: "Dark on Light" | "Light on Dark";

    @richText(true)
    mainText: string;

    @title('CTA Text')
    ctaText: string;

    @title('CTA Destination URL')
    ctaUrl: string;

    run(context:CampaignComponentContext) {
        return {};
    }
    
}