export class EmailCapturePopup implements CampaignTemplateComponent {
    
    @title('Background Image URL')
    imageUrl: string;

    @richText(true)
    header: string;

    @subtitle('Input sub-header text')
    @richText(true)
    subheader: string;

    @title('CTA Text')
    ctaText: string;

    @title("Opt-out Text")
    optOutText: string;

    @subtitle("Header to display upon successful email submission")
    confirmationHeader: string;

    @subtitle("Subheader to display below Confirmation Header")
    confirmationSubheader: string;

    style: "Dark on Light" | "Light on Dark";

    run(context: CampaignComponentContext) {
        return {};
    }
    
}