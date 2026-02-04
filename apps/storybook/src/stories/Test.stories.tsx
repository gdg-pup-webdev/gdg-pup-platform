import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Test } from "@packages/spark-ui";

const meta = {
  title: "Components/Test",
  component: Test,
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "light",
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Test>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};