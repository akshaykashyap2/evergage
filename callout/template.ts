export class ComplexType {
    position: string;
    label: string; 
}

export class CalloutTemplate implements CampaignTemplateComponent {

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

    @richText(true)
    @title('CTA Text')
    ctaText: string;

    @title('CTA Destination URL')
    ctaUrl: string;

    run(context:CampaignComponentContext) {
        return {};
    }
    
}