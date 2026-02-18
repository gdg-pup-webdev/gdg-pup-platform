import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Grid, Box, Text } from "@packages/spark-ui";

const meta = {
  title: "Primitives/Grid",
  component: Grid,
  tags: ["autodocs"],
  argTypes: {
    columns: {
      control: "select",
      options: [1, 2, 3, 4, 5, 6],
    },
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
  },
} satisfies Meta<typeof Grid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TwoColumns: Story = {
  args: {
    columns: 2,
    gap: "md",
    children: (
      <>
        <Box padding="lg" className="bg-primary text-primary-foreground">
          Column 1
        </Box>
        <Box padding="lg" className="bg-primary text-primary-foreground">
          Column 2
        </Box>
        <Box padding="lg" className="bg-primary text-primary-foreground">
          Column 3
        </Box>
        <Box padding="lg" className="bg-primary text-primary-foreground">
          Column 4
        </Box>
      </>
    ),
  },
};

export const ThreeColumns: Story = {
  args: {
    columns: 3,
    gap: "md",
    children: (
      <>
        {Array.from({ length: 9 }, (_, i) => (
          <Box key={i} padding="lg" className="bg-primary text-primary-foreground">
            Item {i + 1}
          </Box>
        ))}
      </>
    ),
  },
};

export const FourColumns: Story = {
  args: {
    columns: 4,
    gap: "md",
    children: (
      <>
        {Array.from({ length: 12 }, (_, i) => (
          <Box key={i} padding="lg" className="bg-primary text-primary-foreground">
            {i + 1}
          </Box>
        ))}
      </>
    ),
  },
};

export const LargeGap: Story = {
  args: {
    columns: 3,
    gap: "xl",
    children: (
      <>
        <Box padding="lg" className="bg-primary text-primary-foreground">
          1
        </Box>
        <Box padding="lg" className="bg-primary text-primary-foreground">
          2
        </Box>
        <Box padding="lg" className="bg-primary text-primary-foreground">
          3
        </Box>
      </>
    ),
  },
};

export const ProductGrid: Story = {
  args: {
    children: <></>,
  },
  render: () => (
    <Grid columns={3} gap="lg">
      {Array.from({ length: 6 }, (_, i) => (
        <Box key={i} className="border border-gray-200 rounded overflow-hidden">
          <div className="bg-gray-200 h-48" />
          <Box padding="md">
            <Text variant="heading-5">Product {i + 1}</Text>
            <Text variant="body-sm" color="muted">
              $99.99
            </Text>
          </Box>
        </Box>
      ))}
    </Grid>
  ),
};

export const DashboardLayout: Story = {
  args: {
    children: <></>,
  },
  render: () => (
    <Grid columns={4} gap="md">
      <Box className="col-span-1 bg-primary text-primary-foreground p-4 rounded">
        Sidebar
      </Box>
      <Box className="col-span-3">
        <Grid columns={3} gap="md">
          <Box padding="lg" className="bg-accent rounded">
            Card 1
          </Box>
          <Box padding="lg" className="bg-accent rounded">
            Card 2
          </Box>
          <Box padding="lg" className="bg-accent rounded">
            Card 3
          </Box>
        </Grid>
      </Box>
    </Grid>
  ),
};
