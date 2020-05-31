export class HeroBannerCtaTemplate implements CampaignTemplateComponent {

    @title('Background Image URL')
    imageURL: string;
    
    @hidden(true)
    contentZone: string = "Homepage Hero";

    style: "Dark on Light" | "Light on Dark";

    header: string;

    subheader: string;

    @title('CTA Text')
    ctaText: string;

    @title('CTA Destination URL')
    @subtitle("Enter a fully qualified destination URL for the CTA (e.g., https://www.northerntrailoutfitters.com)")
    ctaUrl: string;

    run(context:CampaignComponentContext) {
        return {};
    }
    
}