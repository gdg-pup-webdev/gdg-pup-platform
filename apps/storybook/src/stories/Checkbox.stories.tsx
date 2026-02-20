import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Checkbox, Stack } from "@packages/spark-ui";

const meta = {
  title: "Components/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Accept terms and conditions",
  },
};

export const WithHelperText: Story = {
  args: {
    label: "Subscribe to newsletter",
    helperText: "We'll send you updates once a week",
  },
};

export const WithError: Story = {
  args: {
    label: "Required checkbox",
    error: true,
    errorMessage: "You must accept to continue",
  },
};

export const Disabled: Story = {
  args: {
    label: "Disabled checkbox",
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    label: "Disabled checked",
    disabled: true,
    checked: true,
  },
};

export const Small: Story = {
  args: {
    size: "sm",
    label: "Small checkbox",
  },
};

export const Large: Story = {
  args: {
    size: "lg",
    label: "Large checkbox",
  },
};

export const CheckboxGroup: Story = {
  args: {
    children: <></>,
  },
  render: () => (
    <Stack gap="md">
      <Checkbox label="Option 1" />
      <Checkbox label="Option 2" />
      <Checkbox label="Option 3" />
      <Checkbox label="Option 4" disabled />
    </Stack>
  ),
};
