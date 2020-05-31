export class ComplexType {
    position: string;
    label: string;
}

export class InfobarCtaTemplate implements CampaignTemplateComponent {

    @options([
        {position: "top", label: "Top"},
        {position: "bottom", label: "Bottom"}
    ])
    infobarPosition: ComplexType;

    style: "Dark on Light" | "Light on Dark";

    @richText(true)
    mainText: string;

    @title('CTA Text')
    ctaText: string;

    @title('CTA Destination URL')
    @subtitle("Enter a fully qualified destination URL for the CTA (e.g., https://www.northerntrailoutfitters.com)")
    ctaUrl: string;

    run(context:CampaignComponentContext) {
        return {};
    }
    
}