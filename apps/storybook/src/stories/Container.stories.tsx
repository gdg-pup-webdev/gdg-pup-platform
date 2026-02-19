import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Container, Stack, Text, Box } from "@packages/spark-ui";

const meta = {
  title: "Primitives/Container",
  component: Container,
  tags: ["autodocs"],
  argTypes: {
    maxWidth: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl", "5xl", "6xl", "7xl", "full", "screen"],
    },
    padding: {
      control: "select",
      options: ["none", "sm", "md", "lg"],
    },
  },
} satisfies Meta<typeof Container>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <Box padding="md" className="bg-primary text-primary-foreground">
        Default container (7xl - 1280px max-width)
      </Box>
    ),
  },
};

export const Small: Story = {
  args: {
    maxWidth: "sm",
    children: (
      <Box padding="md" className="bg-primary text-primary-foreground">
        Small container (640px max-width)
      </Box>
    ),
  },
};

export const Medium: Story = {
  args: {
    maxWidth: "md",
    children: (
      <Box padding="md" className="bg-primary text-primary-foreground">
        Medium container (768px max-width)
      </Box>
    ),
  },
};

export const Large: Story = {
  args: {
    maxWidth: "4xl",
    children: (
      <Box padding="md" className="bg-primary text-primary-foreground">
        Large container (896px max-width)
      </Box>
    ),
  },
};

export const WithPadding: Story = {
  args: {
    padding: "lg",
    children: (
      <Box padding="md" className="bg-primary text-primary-foreground">
        Container with large padding
      </Box>
    ),
  },
};

export const ArticleLayout: Story = {
  args: {
    children: <></>,
  },
  render: () => (
    <Container maxWidth="4xl" padding="lg">
      <Stack gap="lg">
        <Text variant="display">Article Title</Text>
        <Text variant="body-lg" color="muted">
          Published on January 15, 2025
        </Text>
        <div className="h-64 bg-gray-200 rounded" />
        <Text variant="body">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
          ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </Text>
        <Text variant="body">
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
          nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
          deserunt mollit anim id est laborum.
        </Text>
      </Stack>
    </Container>
  ),
};

export const FormLayout: Story = {
  args: {
    children: <></>,
  },
  render: () => (
    <Container maxWidth="md" padding="lg">
      <Stack gap="xl">
        <Stack gap="sm">
          <Text variant="heading-2">Sign Up</Text>
          <Text variant="body" color="muted">
            Create your account to get started
          </Text>
        </Stack>
        <Stack gap="md">
          <Stack gap="xs">
            <Text as="label" variant="label">
              Full Name
            </Text>
            <input
              type="text"
              placeholder="John Doe"
              className="px-4 py-2 border border-gray-300 rounded"
            />
          </Stack>
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
            <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded">
              Create Account
            </button>
          </Box>
        </Stack>
      </Stack>
    </Container>
  ),
};

export const MultipleContainers: Story = {
  args: {
    children: <></>,
  },
  render: () => (
    <Stack gap="2xl">
      <Box className="bg-primary text-primary-foreground">
        <Container maxWidth="7xl" padding="lg">
          <Text variant="heading-1">Hero Section (Full Width)</Text>
        </Container>
      </Box>
      <Container maxWidth="4xl" padding="lg">
        <Stack gap="md">
          <Text variant="heading-2">Content Section (Narrower)</Text>
          <Text variant="body">
            Different sections can use different container widths for visual hierarchy.
          </Text>
        </Stack>
      </Container>
      <Box className="bg-accent">
        <Container maxWidth="5xl" padding="lg">
          <Text variant="heading-3">Feature Section (Medium Width)</Text>
        </Container>
      </Box>
    </Stack>
  ),
};
