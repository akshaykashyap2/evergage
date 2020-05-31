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

    @richText(true)
    mainText: string;

    @richText(true)
    @title('CTA Text')
    ctaText: string;

    @title('CTA Destination URL')
    @subtitle("Enter a fully qualified destination URL for the CTA (e.g., https://www.northerntrailoutfitters.com)")
    ctaUrl: string;

    style: "Dark on Light" | "Light on Dark";

    run(context:CampaignComponentContext) {
        return {};
    }
    
}