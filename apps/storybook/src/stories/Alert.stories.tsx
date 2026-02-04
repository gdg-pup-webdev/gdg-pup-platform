import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Alert, AlertTitle, AlertDescription } from "@packages/spark-ui/src";

const meta = {
  title: "Components/Alert",
  component: Alert,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Display important messages to users with different severity levels. Composed of Alert, AlertTitle, and AlertDescription sub-components for flexible content organization.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "success", "warning", "error", "info"],
      description: "The severity/type of the alert",
      table: {
        defaultValue: { summary: "default" },
      },
    },
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default alert with neutral styling.
 */
export const Default: Story = {
  render: () => (
    <Alert className="w-96">
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>
        This is a default alert. You can use it for general notifications.
      </AlertDescription>
    </Alert>
  ),
};

/**
 * Success alert for positive feedback and confirmations.
 */
export const Success: Story = {
  render: () => (
    <Alert variant="success" className="w-96">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clipRule="evenodd"
        />
      </svg>
      <AlertTitle>Success!</AlertTitle>
      <AlertDescription>
        Your changes have been saved successfully.
      </AlertDescription>
    </Alert>
  ),
};

/**
 * Warning alert to caution users about potential issues.
 */
export const Warning: Story = {
  render: () => (
    <Alert variant="warning" className="w-96">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
          clipRule="evenodd"
        />
      </svg>
      <AlertTitle>Warning</AlertTitle>
      <AlertDescription>
        This action cannot be undone. Please proceed with caution.
      </AlertDescription>
    </Alert>
  ),
};

/**
 * Error alert for displaying error messages and critical issues.
 */
export const Error: Story = {
  render: () => (
    <Alert variant="error" className="w-96">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
          clipRule="evenodd"
        />
      </svg>
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        Failed to save changes. Please try again later.
      </AlertDescription>
    </Alert>
  ),
};

/**
 * Info alert for informational messages and tips.
 */
export const Info: Story = {
  render: () => (
    <Alert variant="info" className="w-96">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
          clipRule="evenodd"
        />
      </svg>
      <AlertTitle>Information</AlertTitle>
      <AlertDescription>
        New features have been added. Check out what's new in the latest update.
      </AlertDescription>
    </Alert>
  ),
};

/**
 * Alert with only description, no title.
 */
export const DescriptionOnly: Story = {
  render: () => (
    <Alert variant="info" className="w-96">
      <AlertDescription>
        This alert only contains a description without a title.
      </AlertDescription>
    </Alert>
  ),
};

/**
 * Alert with only title, no description.
 */
export const TitleOnly: Story = {
  render: () => (
    <Alert variant="warning" className="w-96">
      <AlertTitle>Warning: Maintenance scheduled for tonight</AlertTitle>
    </Alert>
  ),
};

/**
 * Example showing all alert variants stacked vertically.
 */
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-96">
      <Alert variant="default">
        <AlertTitle>Default</AlertTitle>
        <AlertDescription>General notification message</AlertDescription>
      </Alert>
      <Alert variant="success">
        <AlertTitle>Success</AlertTitle>
        <AlertDescription>Operation completed successfully</AlertDescription>
      </Alert>
      <Alert variant="warning">
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription>Please review before continuing</AlertDescription>
      </Alert>
      <Alert variant="error">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>An error has occurred</AlertDescription>
      </Alert>
      <Alert variant="info">
        <AlertTitle>Info</AlertTitle>
        <AlertDescription>Here's some helpful information</AlertDescription>
      </Alert>
    </div>
  ),
};

/**
 * Example of alerts in a typical application context.
 */
export const InContext: Story = {
  render: () => (
    <div className="w-full max-w-2xl p-6 space-y-4">
      <Alert variant="info">
        <AlertDescription>
          💡 Tip: You can use keyboard shortcuts to navigate faster.
        </AlertDescription>
      </Alert>
      
      <div className="border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Update Profile</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Update your account information below.
        </p>
      </div>

      <Alert variant="success">
        <AlertTitle>Profile Updated</AlertTitle>
        <AlertDescription>
          Your profile information has been successfully updated.
        </AlertDescription>
      </Alert>
    </div>
  ),
};
