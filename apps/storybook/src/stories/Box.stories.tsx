import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Box, Text } from "@packages/spark-ui";

const meta = {
  title: "Primitives/Box",
  component: Box,
  tags: ["autodocs"],
  argTypes: {
    padding: {
      control: "select",
      options: ["none", "xs", "sm", "md", "lg", "xl", "2xl"],
    },
    margin: {
      control: "select",
      options: ["none", "xs", "sm", "md", "lg", "xl", "2xl"],
    },
    width: {
      control: "select",
      options: ["auto", "full", "screen", "banner"],
    },
    height: {
      control: "select",
      options: ["auto", "full", "screen", "banner"],
    },
    display: {
      control: "select",
      options: ["block", "inline", "inline-block", "flex", "grid", "none"],
    },
    position: {
      control: "select",
      options: ["static", "relative", "absolute", "fixed", "sticky"],
    },
  },
} satisfies Meta<typeof Box>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    padding: "md",
    className: "bg-primary text-primary-foreground",
    children: "Default Box",
  },
};

export const WithPadding: Story = {
  args: {
    padding: "xl",
    className: "bg-primary text-primary-foreground",
    children: "Box with extra large padding",
  },
};

export const WithMargin: Story = {
  args: {
    children: <></>,
  },
  render: () => (
    <>
      <Box
        padding="md"
        margin="md"
        className="bg-primary text-primary-foreground"
      >
        Box with margin
      </Box>
      <Box
        padding="md"
        margin="md"
        className="bg-secondary text-secondary-foreground"
      >
        Another box with margin
      </Box>
    </>
  ),
};

export const FullWidth: Story = {
  args: {
    padding: "md",
    width: "full",
    className: "bg-primary text-primary-foreground",
    children: "Full width box",
  },
};

export const FlexContainer: Story = {
  args: {
    display: "flex",
    padding: "md",
    className: "gap-4 bg-accent",
    children: (
      <>
        <Box padding="md" className="bg-primary text-primary-foreground">
          Child 1
        </Box>
        <Box padding="md" className="bg-primary text-primary-foreground">
          Child 2
        </Box>
        <Box padding="md" className="bg-primary text-primary-foreground">
          Child 3
        </Box>
      </>
    ),
  },
};

export const Card: Story = {
  args: {
    children: <></>,
  },
  render: () => (
    <Box
      padding="lg"
      className="bg-white border border-gray-200 rounded-lg shadow-sm"
    >
      <Text variant="heading-4">Card Title</Text>
      <div className="my-2" />
      <Text variant="body" color="muted">
        This is a card built with the Box primitive. You can use it to create
        any custom layout.
      </Text>
      <div className="my-4" />
      <Box display="flex" className="gap-2">
        <Box
          padding="sm"
          className="bg-primary text-primary-foreground rounded"
        >
          Action 1
        </Box>
        <Box
          padding="sm"
          className="bg-secondary text-secondary-foreground rounded"
        >
          Action 2
        </Box>
      </Box>
    </Box>
  ),
};

export const Hero: Story = {
  args: {
    children: <></>,
  },
  render: () => (
    <Box
      padding="2xl"
      className="bg-linear-to-r from-primary to-secondary text-primary-foreground"
    >
      <Box className="max-w-3xl mx-auto text-center">
        <Text variant="display">Welcome to Our Platform</Text>
        <div className="my-4" />
        <Text variant="body-lg">
          Build amazing applications with our design system primitives
        </Text>
        <div className="my-6" />
        <Box
          display="inline-block"
          padding="md"
          className="bg-white text-primary rounded"
        >
          Get Started
        </Box>
      </Box>
    </Box>
  ),
};
