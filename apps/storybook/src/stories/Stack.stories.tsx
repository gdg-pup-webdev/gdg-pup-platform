import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Stack, Box, Text } from "@packages/spark-ui";

const meta = {
  title: "Primitives/Stack",
  component: Stack,
  tags: ["autodocs"],
  argTypes: {
    gap: {
      control: "select",
      options: ["none", "xs", "sm", "md", "lg", "xl", "2xl"],
    },
    align: {
      control: "select",
      options: ["start", "center", "end", "stretch"],
    },
    justify: {
      control: "select",
      options: ["start", "center", "end", "between", "around"],
    },
    width: {
      control: "select",
      options: ["auto", "full"],
    },
  },
} satisfies Meta<typeof Stack>;

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

export const LargeGap: Story = {
  args: {
    gap: "xl",
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

export const Centered: Story = {
  args: {
    gap: "md",
    align: "center",
    children: (
      <>
        <Box padding="md" className="bg-primary text-primary-foreground w-1/2">
          Centered Item 1
        </Box>
        <Box padding="md" className="bg-primary text-primary-foreground w-1/4">
          Item 2
        </Box>
        <Box padding="md" className="bg-primary text-primary-foreground w-3/4">
          Item 3
        </Box>
      </>
    ),
  },
};

export const SpaceBetween: Story = {
  args: {
    gap: "md",
    justify: "between",
    children: (
      <>
        <Box padding="md" className="bg-primary text-primary-foreground">
          Top
        </Box>
        <Box padding="md" className="bg-success text-success-foreground">
          Middle
        </Box>
        <Box padding="md" className="bg-destructive text-destructive-foreground">
          Bottom
        </Box>
      </>
    ),
  },
};

export const FormLayout: Story = {
  args: {
    children: <></>,
  },
  render: () => (
    <Stack gap="lg">
      <Stack gap="xs">
        <Text as="label" variant="label">
          Email Address
        </Text>
        <input
          type="email"
          placeholder="you@example.com"
          className="px-4 py-2 border border-gray-300 rounded"
        />
      </Stack>
      <Stack gap="xs">
        <Text as="label" variant="label">
          Password
        </Text>
        <input
          type="password"
          placeholder="••••••••"
          className="px-4 py-2 border border-gray-300 rounded"
        />
      </Stack>
      <Box>
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded">
          Sign In
        </button>
      </Box>
    </Stack>
  ),
};
