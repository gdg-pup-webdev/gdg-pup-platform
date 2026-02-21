import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Skeleton, Stack, Card } from "@packages/spark-ui";

const meta = {
  title: "Components/Skeleton",
  component: Skeleton,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "circle", "text"],
    },
  },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    className: "h-12 w-12",
  },
};

export const Circle: Story = {
  args: {
    variant: "circle",
    className: "h-12 w-12",
  },
};

export const Text: Story = {
  args: {
    variant: "text",
    className: "w-[250px]",
  },
};

export const CardSkeleton: Story = {
  args: {
    children: <></>,
  },
  render: () => (
    <Card className="w-[350px]">
      <Stack gap="md">
        <Skeleton className="h-48 w-full" />
        <Skeleton variant="text" className="w-3/4" />
        <Skeleton variant="text" className="w-1/2" />
      </Stack>
    </Card>
  ),
};

export const AvatarSkeleton: Story = {
  args: {
    children: <></>,
  },
  render: () => (
    <Stack gap="md">
      <Skeleton variant="circle" className="h-12 w-12" />
      <Skeleton variant="text" className="w-[200px]" />
    </Stack>
  ),
};

export const ListSkeleton: Story = {
  args: {
    children: <></>,
  },
  render: () => (
    <Stack gap="md" className="w-full">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <Skeleton variant="circle" className="h-10 w-10" />
          <Stack gap="xs" className="flex-1">
            <Skeleton variant="text" className="w-3/4" />
            <Skeleton variant="text" className="w-1/2" />
          </Stack>
        </div>
      ))}
    </Stack>
  ),
};
