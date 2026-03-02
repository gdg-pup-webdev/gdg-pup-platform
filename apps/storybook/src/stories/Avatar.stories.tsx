import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Avatar, Inline } from "@packages/spark-ui";

const meta = {
  title: "Components/Avatar",
  component: Avatar,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg", "xl"],
    },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithImage: Story = {
  args: {
    src: "https://github.com/shadcn.png",
    alt: "John Doe",
  },
};

export const WithFallback: Story = {
  args: {
    fallback: "JD",
  },
};

export const Small: Story = {
  args: {
    size: "sm",
    src: "https://github.com/shadcn.png",
    alt: "John Doe",
  },
};

export const Medium: Story = {
  args: {
    size: "md",
    src: "https://github.com/shadcn.png",
    alt: "John Doe",
  },
};

export const Large: Story = {
  args: {
    size: "lg",
    src: "https://github.com/shadcn.png",
    alt: "John Doe",
  },
};

export const ExtraLarge: Story = {
  args: {
    size: "xl",
    src: "https://github.com/shadcn.png",
    alt: "John Doe",
  },
};

export const BrokenImage: Story = {
  args: {
    src: "https://broken-link.jpg",
    fallback: "JD",
  },
};

export const AvatarGroup: Story = {
  args: {
    children: <></>,
  },
  render: () => (
    <Inline gap="sm">
      <Avatar src="https://github.com/shadcn.png" alt="User 1" />
      <Avatar fallback="AB" />
      <Avatar fallback="CD" />
      <Avatar fallback="EF" />
    </Inline>
  ),
};
