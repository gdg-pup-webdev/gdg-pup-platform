import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Header } from "@packages/spark-ui";

const meta = {
  title: "Components/Header",
  component: Header,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    withBorder: {
      control: "boolean",
      description: "Adds a 2px black border around the header",
    },
    withPadding: {
      control: "boolean",
      description: "Adds 4rem padding to the header",
    },
    children: {
      control: "text",
      description: "The text content of the header",
    },
    customCn: {
      control: "text",
      description: "Custom Tailwind classes to apply",
    },
  },
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Welcome to Spark UI",
  },
};

export const WithBorder: Story = {
  args: {
    children: "Bordered Header",
    withBorder: true,
  },
};

export const WithPadding: Story = {
  args: {
    children: "Padded Header",
    withPadding: true,
  },
};

export const WithBorderAndPadding: Story = {
  args: {
    children: "Full Featured Header",
    withBorder: true,
    withPadding: true,
  },
};

export const CustomStyling: Story = {
  args: {
    children: "Custom Styled Header",
    customCn: "text-blue-600 underline",
  },
};

export const LongText: Story = {
  args: {
    children:
      "This is a very long header text that demonstrates how the component handles multiple lines of content",
    withBorder: true,
    withPadding: true,
  },
};

export const AllFeatures: Story = {
  args: {
    children: "All Features Combined",
    withBorder: true,
    withPadding: true,
    customCn:
      "bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg",
  },
};
