export class EmailCapturePopup implements CampaignTemplateComponent {

    @richText(true)
    promoText: string;

    @title('CTA Text')
    ctaText: string;

    cancelText: string;

    confirmText: string;

    confirmSubtext: string;

    @title('Background Image URL')
    imageUrl: string;

    @buttonGroup(true)
    font: "Helvetica" | "Roboto" | "Open Sans";
    
    textColor: Color;

    run(context: CampaignComponentContext) {
        return {};
    }
    
}