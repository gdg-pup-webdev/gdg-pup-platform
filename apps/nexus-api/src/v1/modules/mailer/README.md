# Mailer Module

The Mailer module is responsible for sending emails across the GDG PUP Platform. It follows a clean architecture pattern with a pluggable infrastructure.

## Architecture

- **Domain**: Defines the `Email` entity and `IMailerService` interface.
- **Use Cases**: Contains `SendEmail` which orchestrates the sending process.
- **Infrastructure**:
  - `MockMailerService`: Logs emails to the console (default for development).
  - `ZeptoMailerService`: Sends real emails using the ZeptoMail API.
- **Templates**: Contains HTML email templates like `OtpEmailTemplate`.

## Configuration

The mailer service is configured in `src/configs/configs.ts`. It automatically switches to `ZeptoMailerService` if a `ZEPTOMAIL_TOKEN` is provided in the environment variables.

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `ZEPTOMAIL_TOKEN` | Your ZeptoMail API Key | (Empty, triggers Mock) |
| `ZEPTOMAIL_URL` | ZeptoMail API Endpoint | `https://api.zeptomail.com/v1.1/email` |
| `ZEPTOMAIL_FROM_ADDRESS` | Sender email address | `noreply@gdgpup.org` |
| `ZEPTOMAIL_FROM_NAME` | Sender display name | `GDG PUP` |

## Usage

```typescript
import { mailerController, OtpEmailTemplate } from "@/v1/modules/mailer";

// Using the controller
await mailerController.sendEmail(
  "user@example.com",
  "Verification Code",
  OtpEmailTemplate.render("123456")
);
```

## Email Templates

Templates are located in `src/v1/modules/mailer/templates/`. They are optimized for:
- **Light/Dark Mode**: Automatic theme detection.
- **Pure White Theme**: Clean high-contrast look for light mode.
- **GDG Branding**: Rainbow headers and brand colors.
