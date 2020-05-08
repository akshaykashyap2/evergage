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

    @subtitle("Text to display upon successful email submission")
    confirmationText: string;

    @subtitle("Text to display below Confirmation Text")
    confirmationSubtext: string;

    @buttonGroup(true)
    font: "Helvetica" | "Roboto" | "Open Sans";
    
    textColor: Color;

    run(context: CampaignComponentContext) {
        return {};
    }
    
}