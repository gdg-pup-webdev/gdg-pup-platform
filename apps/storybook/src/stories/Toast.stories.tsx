import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ToastProvider, useToast, Button, Stack } from "@packages/spark-ui";

const meta = {
  title: "Components/Toast",
  component: ToastProvider,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <ToastProvider>
        <Story />
      </ToastProvider>
    ),
  ],
} satisfies Meta<typeof ToastProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

const ToastDemo = () => {
  const { addToast } = useToast();

  return (
    <Stack gap="md">
      <Button
        onClick={() =>
          addToast({
            title: "Success",
            description: "Your changes have been saved successfully.",
            variant: "success",
          })
        }
      >
        Show Success Toast
      </Button>
      <Button
        variant="destructive"
        onClick={() =>
          addToast({
            title: "Error",
            description: "Something went wrong. Please try again.",
            variant: "destructive",
          })
        }
      >
        Show Error Toast
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          addToast({
            title: "Warning",
            description: "This action may have consequences.",
            variant: "warning",
          })
        }
      >
        Show Warning Toast
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          addToast({
            title: "Default Toast",
            description: "This is a default notification.",
          })
        }
      >
        Show Default Toast
      </Button>
    </Stack>
  );
};

export const Default: Story = {
  args: {
    children: <></>,
  },
  render: () => <ToastDemo />,
};

const ToastWithActionDemo = () => {
  const { addToast } = useToast();

  return (
    <Button
      onClick={() =>
        addToast({
          title: "New message",
          description: "You have a new message from John.",
          action: {
            label: "View",
            onClick: () => alert("View message clicked!"),
          },
        })
      }
    >
      Show Toast with Action
    </Button>
  );
};

export const WithAction: Story = {
  args: {
    children: <></>,
  },
  render: () => <ToastWithActionDemo />,
};

const SimpleTitleDemo = () => {
  const { addToast } = useToast();

  return (
    <Button
      onClick={() =>
        addToast({
          title: "Settings saved",
          variant: "success",
        })
      }
    >
      Simple Title Toast
    </Button>
  );
};

export const SimpleTitle: Story = {
  args: {
    children: <></>,
  },
  render: () => <SimpleTitleDemo />,
};

const LongDurationDemo = () => {
  const { addToast } = useToast();

  return (
    <Button
      onClick={() =>
        addToast({
          title: "Long duration",
          description: "This toast will stay for 10 seconds",
          duration: 10000,
        })
      }
    >
      10 Second Toast
    </Button>
  );
};

export const LongDuration: Story = {
  args: {
    children: <></>,
  },
  render: () => <LongDurationDemo />,
};

const NoDismissDemo = () => {
  const { addToast } = useToast();

  return (
    <Button
      onClick={() =>
        addToast({
          title: "Manual dismiss only",
          description: "This toast won't auto-dismiss. Click X to close.",
          duration: 0,
        })
      }
    >
      No Auto-Dismiss Toast
    </Button>
  );
};

export const NoDismiss: Story = {
  args: {
    children: <></>,
  },
  render: () => <NoDismissDemo />,
};

const MultipleToastsDemo = () => {
  const { addToast } = useToast();

  const showMultiple = () => {
    addToast({ title: "First toast", variant: "success" });
    setTimeout(() => {
      addToast({ title: "Second toast", variant: "default" });
    }, 500);
    setTimeout(() => {
      addToast({ title: "Third toast", variant: "warning" });
    }, 1000);
  };

  return <Button onClick={showMultiple}>Show Multiple Toasts</Button>;
};

export const MultipleToasts: Story = {
  args: {
    children: <></>,
  },
  render: () => <MultipleToastsDemo />,
};
