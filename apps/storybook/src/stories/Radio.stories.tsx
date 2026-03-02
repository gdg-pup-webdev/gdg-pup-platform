import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Radio, Stack } from "@packages/spark-ui";

const meta = {
  title: "Components/Radio",
  component: Radio,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
  },
} satisfies Meta<typeof Radio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Option 1",
    name: "option",
    value: "1",
  },
};

export const WithHelperText: Story = {
  args: {
    label: "Free Plan",
    helperText: "Limited features",
    name: "plan",
    value: "free",
  },
};

export const WithError: Story = {
  args: {
    label: "Required option",
    error: true,
    errorMessage: "You must select an option",
    name: "required",
    value: "yes",
  },
};

export const Disabled: Story = {
  args: {
    label: "Disabled radio",
    disabled: true,
    name: "option",
    value: "disabled",
  },
};

export const DisabledChecked: Story = {
  args: {
    label: "Disabled checked",
    disabled: true,
    checked: true,
    name: "option",
    value: "disabled-checked",
  },
};

export const Small: Story = {
  args: {
    size: "sm",
    label: "Small radio",
    name: "size",
    value: "sm",
  },
};

export const Large: Story = {
  args: {
    size: "lg",
    label: "Large radio",
    name: "size",
    value: "lg",
  },
};

export const RadioGroup: Story = {
  args: {
    children: <></>,
  },
  render: () => (
    <Stack gap="md">
      <Radio label="Option 1" name="group" value="1" />
      <Radio label="Option 2" name="group" value="2" />
      <Radio label="Option 3" name="group" value="3" />
      <Radio label="Option 4 (disabled)" name="group" value="4" disabled />
    </Stack>
  ),
};
