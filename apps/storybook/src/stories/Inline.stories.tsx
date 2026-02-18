import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Inline, Box } from "@packages/spark-ui";

const meta = {
  title: "Primitives/Inline",
  component: Inline,
  tags: ["autodocs"],
  argTypes: {
    gap: {
      control: "select",
      options: ["none", "xs", "sm", "md", "lg", "xl", "2xl"],
    },
    align: {
      control: "select",
      options: ["start", "center", "end", "baseline", "stretch"],
    },
    justify: {
      control: "select",
      options: ["start", "center", "end", "between", "around"],
    },
    wrap: {
      control: "boolean",
    },
  },
} satisfies Meta<typeof Inline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    gap: "md",
    children: (
      <>
        <Box padding="md" className="bg-primary text-primary-foreground">
          Item 1
        </Box>
        <Box padding="md" className="bg-primary text-primary-foreground">
          Item 2
        </Box>
        <Box padding="md" className="bg-primary text-primary-foreground">
          Item 3
        </Box>
      </>
    ),
  },
};

export const SmallGap: Story = {
  args: {
    gap: "sm",
    children: (
      <>
        <Box padding="sm" className="bg-primary text-primary-foreground">
          Tag 1
        </Box>
        <Box padding="sm" className="bg-primary text-primary-foreground">
          Tag 2
        </Box>
        <Box padding="sm" className="bg-primary text-primary-foreground">
          Tag 3
        </Box>
      </>
    ),
  },
};

export const WithWrapping: Story = {
  args: {
    gap: "md",
    wrap: true,
    children: (
      <>
        {Array.from({ length: 20 }, (_, i) => (
          <Box key={i} padding="md" className="bg-primary text-primary-foreground">
            Item {i + 1}
          </Box>
        ))}
      </>
    ),
  },
};

export const CenteredNavigation: Story = {
  args: {
    gap: "lg",
    justify: "center",
    align: "center",
    children: (
      <>
        <Box padding="md" className="hover:bg-accent">
          Home
        </Box>
        <Box padding="md" className="hover:bg-accent">
          About
        </Box>
        <Box padding="md" className="hover:bg-accent">
          Services
        </Box>
        <Box padding="md" className="hover:bg-accent">
          Contact
        </Box>
      </>
    ),
  },
};

export const SpaceBetween: Story = {
  args: {
    gap: "md",
    justify: "between",
    align: "center",
    children: (
      <>
        <Box className="text-xl font-bold">Logo</Box>
        <Inline gap="md">
          <Box padding="md">Link 1</Box>
          <Box padding="md">Link 2</Box>
          <Box padding="md">Link 3</Box>
        </Inline>
        <Box padding="md" className="bg-primary text-primary-foreground rounded">
          Sign In
        </Box>
      </>
    ),
  },
};

export const TagList: Story = {
  args: {
    children: <></>,
  },
  render: () => (
    <Inline gap="sm" wrap>
      {["React", "TypeScript", "Next.js", "Tailwind", "Storybook", "Vitest", "TanStack Query"].map(
        (tag) => (
          <Box
            key={tag}
            padding="sm"
            className="bg-secondary text-secondary-foreground rounded text-sm"
          >
            {tag}
          </Box>
        )
      )}
    </Inline>
  ),
};
