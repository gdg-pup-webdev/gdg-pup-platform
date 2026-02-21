import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Textarea } from "@packages/spark-ui";
import { useState } from "react";

const meta = {
  title: "Components/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  argTypes: {
    textareaSize: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Description",
    placeholder: "Enter description...",
  },
};

export const WithHelperText: Story = {
  args: {
    label: "Bio",
    helperText: "Tell us about yourself",
    placeholder: "Write your bio...",
  },
};

export const WithError: Story = {
  args: {
    label: "Message",
    error: true,
    errorMessage: "Message is required",
    placeholder: "Enter your message...",
  },
};

export const WithCharacterCount: Story = {
  args: {
    children: <></>,
  },
  render: () => {
    const [value, setValue] = useState("");
    return (
      <Textarea
        label="Tweet"
        maxLength={280}
        showCount
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="What's happening?"
      />
    );
  },
};

export const Disabled: Story = {
  args: {
    label: "Disabled",
    placeholder: "This textarea is disabled",
    disabled: true,
  },
};

export const Small: Story = {
  args: {
    textareaSize: "sm",
    label: "Small textarea",
    placeholder: "Enter text...",
  },
};

export const Large: Story = {
  args: {
    textareaSize: "lg",
    label: "Large textarea",
    placeholder: "Enter text...",
  },
};

export const Readonly: Story = {
  args: {
    label: "Readonly",
    value: "This text cannot be edited",
    readOnly: true,
  },
};
