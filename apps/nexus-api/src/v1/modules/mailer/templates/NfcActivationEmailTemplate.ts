export class NfcActivationEmailTemplate {
  static render(name: string, gdgId: string, cardId: string, baseUrl: string): string {
    // GDG Brand Colors
    const gdgColors = {
      blue: "#4285F4",
      red: "#EA4335",
      yellow: "#FBBC04",
      green: "#34A853",
    };

    // UI Colors
    const uiColors = {
      cyan: "#57CAFF",
      white: "#F0F8FF",
      navy: "#000614",
    };

    const heading = "Nexus Card Activated";
    const subject = "Your Nexus Card is Activated!";

    // Ensure baseUrl doesn't have a trailing slash for consistency
    const sanitizedBaseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <title>${heading} | GDG on Campus PUP</title>
  <style>
    :root {
      color-scheme: light dark;
    }
    
    @media only screen and (max-width: 600px) {
      .main-table { width: 100% !important; }
      .content-padding { padding: 24px 16px !important; }
      .header-padding { padding: 32px 16px 16px 16px !important; }
      .footer-padding { padding: 20px 16px !important; }
    }
    
    /* Light mode */
    .body-bg { background-color: #ffffff !important; }
    .main-card { background: #ffffff !important; border: 1px solid #f0f0f0 !important; }
    .header-bg { background: linear-gradient(180deg, rgba(66,133,244,0.05), transparent) !important; }
    .content-card { background: #ffffff !important; border: 1px solid #f0f0f0 !important; }
    .heading-text { color: #1a1a1a !important; }
    .body-text { color: #333333 !important; }
    .info-bg { background: #f8faff !important; border: 1px solid rgba(66,133,244,0.1) !important; }
    .footer-bg { background: #ffffff !important; }
    
    /* Dark mode */
    @media (prefers-color-scheme: dark) {
      .body-bg { background: #000614 !important; }
      .main-card { background: #020d28 !important; border: 1px solid rgba(87,202,255,0.1) !important; }
      .header-bg { background: linear-gradient(180deg, rgba(87,202,255,0.12), transparent) !important; }
      .content-card { background: rgba(87,202,255,0.08) !important; border: 1px solid rgba(87,202,255,0.1) !important; }
      .heading-text { color: #ffffff !important; }
      .body-text { color: rgba(255, 255, 255, 0.85) !important; }
      .info-bg { background: rgba(87,202,255,0.05) !important; border: 1px solid rgba(87,202,255,0.1) !important; }
      .footer-bg { background: rgba(0, 6, 20, 0.6) !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Roboto, Arial, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" class="body-bg" style="background-color: #ffffff;">
    <tr>
      <td align="center" style="padding: 20px 12px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" class="main-table main-card" style="background: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.05);">
          
          <!-- GDG Brand Header -->
          <tr>
            <td style="padding: 0;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td width="25%" style="height: 6px; background-color: ${gdgColors.blue};"></td>
                  <td width="25%" style="height: 6px; background-color: ${gdgColors.red};"></td>
                  <td width="25%" style="height: 6px; background-color: ${gdgColors.yellow};"></td>
                  <td width="25%" style="height: 6px; background-color: ${gdgColors.green};"></td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Header -->
          <tr>
            <td align="center" class="header-padding header-bg" style="padding: 40px 24px 16px 24px;">
              <h1 class="heading-text" style="margin: 0; font-size: 24px; font-weight: 800; color: #1a1a1a; letter-spacing: -0.5px;">
                ${heading}
              </h1>
              <p style="margin: 8px 0 0 0; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1.5px; color: ${gdgColors.blue};">
                GDG on Campus PUP
              </p>
            </td>
          </tr>
          
          <!-- Content Section -->
          <tr>
            <td class="content-padding" style="padding: 24px 40px 32px 40px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" class="content-card" style="background: #ffffff; border-radius: 20px; border: 1px solid #f0f0f0;">
                <tr>
                  <td style="padding: 32px;" align="center">
                    <p class="body-text" style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #333333;">
                      Hi <strong>${name}</strong>, your physical Nexus Card has been successfully activated and permanently linked to your digital identity.
                    </p>
                    
                    <!-- Activation Success Details -->
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" class="info-bg" style="margin: 24px 0; border-radius: 16px; padding: 20px;">
                      <tr>
                        <td align="left" style="padding-bottom: 8px;">
                          <p style="margin: 0; font-size: 12px; font-weight: 600; text-transform: uppercase; color: #666666; letter-spacing: 1px;">GDG ID</p>
                          <p class="heading-text" style="margin: 4px 0 0 0; font-size: 16px; font-weight: 700; color: #1a1a1a;">${gdgId}</p>
                        </td>
                      </tr>
                      <tr>
                        <td align="left">
                          <p style="margin: 0; font-size: 12px; font-weight: 600; text-transform: uppercase; color: #666666; letter-spacing: 1px;">Card ID</p>
                          <p class="heading-text" style="margin: 4px 0 0 0; font-size: 16px; font-weight: 700; color: #1a1a1a;">${cardId}</p>
                        </td>
                      </tr>
                    </table>

                    <p class="body-text" style="margin: 24px 0 0 0; font-size: 16px; line-height: 1.6; color: #333333;">
                      You can now tap your card to share your Sparkmates profile at any event!
                    </p>

                    <!-- Call to Action -->
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin-top: 32px;">
                      <tr>
                        <td align="center" bgcolor="${gdgColors.blue}" style="border-radius: 12px;">
                          <a href="${sanitizedBaseUrl}/sparkmates/${gdgId}?source=nfc_card" target="_blank" style="padding: 14px 28px; font-size: 16px; font-family: 'Segoe UI', Roboto, Arial, sans-serif; color: #ffffff; text-decoration: none; font-weight: 700; display: inline-block;">
                            View My Public Profile
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td class="footer-padding footer-bg" style="padding: 32px 24px; background: #ffffff; border-top: 1px solid #f0f0f0;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" align="center">
                <tr>
                  <td align="center">
                    <!-- Brand Dots -->
                    <table role="presentation" cellspacing="0" cellpadding="0" style="margin-bottom: 16px;">
                      <tr>
                        <td style="width: 8px; height: 8px; border-radius: 50%; background-color: ${gdgColors.blue};"></td>
                        <td style="width: 8px;"></td>
                        <td style="width: 8px; height: 8px; border-radius: 50%; background-color: ${gdgColors.red};"></td>
                        <td style="width: 8px;"></td>
                        <td style="width: 8px; height: 8px; border-radius: 50%; background-color: ${gdgColors.yellow};"></td>
                        <td style="width: 8px;"></td>
                        <td style="width: 8px; height: 8px; border-radius: 50%; background-color: ${gdgColors.green};"></td>
                      </tr>
                    </table>
                    <p class="muted-text" style="margin: 0; font-size: 12px; font-weight: 600; color: #666666; text-transform: uppercase; letter-spacing: 1px;">
                      Google Developer Groups <span style="color: ${gdgColors.blue};">on Campus</span> PUP
                    </p>
                    <p style="margin: 8px 0 0 0; color: #999999; font-size: 10px; line-height: 1.5;">
                      Polytechnic University of the Philippines, Manila<br>
                      © ${new Date().getFullYear()} GDG PUP. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Bottom Rainbow Bar -->
          <tr>
            <td style="padding: 0;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td width="25%" style="height: 4px; background-color: ${gdgColors.blue};"></td>
                  <td width="25%" style="height: 4px; background-color: ${gdgColors.red};"></td>
                  <td width="25%" style="height: 4px; background-color: ${gdgColors.yellow};"></td>
                  <td width="25%" style="height: 4px; background-color: ${gdgColors.green};"></td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
  }
}
