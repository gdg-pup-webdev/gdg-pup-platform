import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Tooltip, Button } from "@packages/spark-ui";

const meta = {
  title: "Components/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  argTypes: {
    side: {
      control: "select",
      options: ["top", "right", "bottom", "left"],
    },
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    content: "This is a tooltip",
    children: <Button>Hover me</Button>,
  },
};

export const Top: Story = {
  args: {
    content: "Tooltip on top",
    side: "top",
    children: <Button>Top</Button>,
  },
};

export const Right: Story = {
  args: {
    content: "Tooltip on right",
    side: "right",
    children: <Button>Right</Button>,
  },
};

export const Bottom: Story = {
  args: {
    content: "Tooltip on bottom",
    side: "bottom",
    children: <Button>Bottom</Button>,
  },
};

export const Left: Story = {
  args: {
    content: "Tooltip on left",
    side: "left",
    children: <Button>Left</Button>,
  },
};

export const LongContent: Story = {
  args: {
    content: "This is a longer tooltip with more information",
    children: <Button>Long tooltip</Button>,
  },
};

export const WithIcon: Story = {
  args: {
    content: "",
    children: <></>,
  },
  render: () => (
    <Tooltip content="Click for help" side="top">
      <button className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-muted hover:bg-muted-foreground/10">
        ?
      </button>
    </Tooltip>
  ),
};

export const MultipleTooltips: Story = {
  args: {
    content: "",
    children: <></>,
  },
  render: () => (
    <div className="flex gap-4">
      <Tooltip content="Edit" side="top">
        <Button size="sm">Edit</Button>
      </Tooltip>
      <Tooltip content="Delete" side="top">
        <Button variant="destructive" size="sm">
          Delete
        </Button>
      </Tooltip>
      <Tooltip content="Share" side="top">
        <Button variant="secondary" size="sm">
          Share
        </Button>
      </Tooltip>
    </div>
  ),
};
