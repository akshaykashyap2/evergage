export class HeroBannerCta implements CampaignTemplateComponent {

    @title('Background Image URL')
    imageURL: string;
    
    @hidden(true)
    contentZone: string = "Homepage Hero";

    header: string;

    subheader: string;

    @title('CTA Text')
    ctaText: string;

    @title('CTA Destination URL')
    @subtitle("Enter a fully qualified destination URL for the CTA (e.g., https://www.northerntrailoutfitters.com)")
    ctaUrl: string;

    @buttonGroup(true)
    style: "Dark on Light" | "Light on Dark";

    run(context:CampaignComponentContext) {
        return {};
    }
    
}