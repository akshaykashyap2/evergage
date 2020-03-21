export class EmailCapturePopup implements CampaignTemplateComponent {

    @richText(true)
    header: string;

    @title('CTA Text')
    ctaText: string;

    cancelText: string;

    confirmationText: string;

    confirmationSubtext: string;

    @title('Background Image URL')
    imageUrl: string;

    @buttonGroup(true)
    font: "Helvetica" | "Roboto" | "Open Sans";
    
    textColor: Color;

    run(context: CampaignComponentContext) {
        return {};
    }
    
}