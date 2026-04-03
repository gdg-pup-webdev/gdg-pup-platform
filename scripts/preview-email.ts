import fs from 'fs';

// Standalone template for preview to avoid module resolution issues in script
class OtpEmailTemplate {
  static render(otp: string): string {
    const gdgColors = {
      blue: "#4285F4",
      red: "#EA4335",
      yellow: "#FBBC04",
      green: "#34A853",
    };

    const uiColors = {
      cyan: "#57CAFF",
      white: "#F0F8FF",
    };

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <title>Verification Code | GDG on Campus PUP</title>
  <style>
    :root { color-scheme: light dark; }
    @media only screen and (max-width: 600px) {
      .main-table { width: 100% !important; }
      .content-padding { padding: 24px 16px !important; }
      .header-padding { padding: 32px 16px 16px 16px !important; }
      .footer-padding { padding: 20px 16px !important; }
    }
    /* Light mode */
    .body-bg { background-color: #f0f4ff !important; }
    .main-card { background: #ffffff !important; }
    .header-bg { background: linear-gradient(180deg, rgba(66,133,244,0.08), transparent) !important; }
    .content-card { background: rgba(66,133,244,0.03) !important; border: 1px solid rgba(66,133,244,0.1) !important; }
    .heading-text { color: #1a1a1a !important; }
    .body-text { color: #333333 !important; }
    .otp-bg { background: #f8faff !important; border: 1px dashed ${gdgColors.blue} !important; }
    .footer-bg { background: #f8faff !important; }
    
    /* Dark mode */
    @media (prefers-color-scheme: dark) {
      .body-bg { background: #000614 !important; }
      .main-card { background: #020d28 !important; border: 1px solid rgba(87,202,255,0.1) !important; }
      .header-bg { background: linear-gradient(180deg, rgba(87,202,255,0.12), transparent) !important; }
      .content-card { background: rgba(87,202,255,0.08) !important; border: 1px solid rgba(87,202,255,0.1) !important; }
      .heading-text { color: #ffffff !important; }
      .body-text { color: rgba(255, 255, 255, 0.85) !important; }
      .otp-bg { background: rgba(87,202,255,0.05) !important; border: 1px dashed ${uiColors.cyan} !important; }
      .footer-bg { background: rgba(0, 6, 20, 0.4) !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" class="body-bg" style="background-color: #f0f4ff;">
    <tr>
      <td align="center" style="padding: 20px 12px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" class="main-table main-card" style="background: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);">
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
          <tr>
            <td align="center" class="header-padding header-bg" style="padding: 40px 24px 16px 24px;">
              <h1 class="heading-text" style="margin: 0; font-size: 24px; font-weight: 800; color: #1a1a1a;">Verification Code</h1>
              <p style="margin: 8px 0 0 0; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1.5px; color: ${gdgColors.blue};">GDG on Campus PUP</p>
            </td>
          </tr>
          <tr>
            <td class="content-padding" style="padding: 24px 40px 32px 40px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" class="content-card" style="background: rgba(66,133,244,0.03); border-radius: 20px; border: 1px solid rgba(66,133,244,0.1);">
                <tr>
                  <td style="padding: 32px;" align="center">
                    <p class="body-text" style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #333333;">Hello Sparkmate! Use the code below to verify your identity. This code will expire in <strong>10 minutes</strong>.</p>
                    <table role="presentation" cellspacing="0" cellpadding="0" style="margin: 24px 0;">
                      <tr>
                        <td class="otp-bg" style="padding: 20px 40px; border-radius: 16px; border: 1px dashed ${gdgColors.blue};">
                          <p style="margin: 0; font-family: 'Courier New', monospace; font-size: 42px; font-weight: 800; letter-spacing: 8px; color: ${gdgColors.blue};">
                            ${otp}
                          </p>
                        </td>
                      </tr>
                    </table>
                    <p class="body-text" style="margin: 24px 0 0 0; font-size: 14px; color: #666666;">If you didn't request this code, you can safely ignore this email.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td class="footer-padding footer-bg" style="padding: 32px 24px; background: #f8faff; border-top: 1px solid rgba(0, 0, 0, 0.05);">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" align="center">
                <tr>
                  <td align="center">
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
                    <p class="muted-text" style="margin: 0; font-size: 12px; font-weight: 600; color: #666666; text-transform: uppercase; letter-spacing: 1px;">Google Developer Groups <span style="color: ${gdgColors.blue};">on Campus</span> PUP</p>
                    <p style="margin: 8px 0 0 0; color: #999999; font-size: 10px;">Polytechnic University of the Philippines, Manila<br>© ${new Date().getFullYear()} GDG PUP. All rights reserved.</p>
                  </td>
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

const previewContent = OtpEmailTemplate.render('984251');
fs.writeFileSync('email-preview.html', previewContent);

console.log('✅ Preview generated: email-preview.html');
console.log('Open this file in your browser to see the light/dark mode design.');
