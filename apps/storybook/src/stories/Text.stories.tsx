import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Text, Stack, Box } from "@packages/spark-ui";

const meta = {
  title: "Primitives/Text",
  component: Text,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "display",
        "heading-1",
        "heading-2",
        "heading-3",
        "heading-4",
        "heading-5",
        "heading-6",
        "body",
        "body-lg",
        "body-sm",
        "caption",
        "label",
      ],
    },
    color: {
      control: "select",
      options: [
        "default",
        "primary",
        "secondary",
        "muted",
        "success",
        "warning",
        "error",
        "on-primary",
        "on-secondary",
      ],
    },
    align: {
      control: "select",
      options: ["left", "center", "right", "justify"],
    },
    weight: {
      control: "select",
      options: ["normal", "medium", "semibold", "bold"],
    },
    gradient: {
      control: "select",
      options: ["none", "white-blue", "white-yellow", "white-green", "white-red", "red", "green", "yellow", "blue"],
    },
    truncate: {
      control: "boolean",
    },
    clamp: {
      control: "select",
      options: [1, 2, 3, 4, "none"],
    },
  },
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Display: Story = {
  args: {
    variant: "display",
    children: "Display Text",
  },
};

export const Heading1: Story = {
  args: {
    variant: "heading-1",
    children: "Heading Level 1",
  },
};

export const Heading2: Story = {
  args: {
    variant: "heading-2",
    children: "Heading Level 2",
  },
};

export const Heading3: Story = {
  args: {
    variant: "heading-3",
    children: "Heading Level 3",
  },
};

export const Body: Story = {
  args: {
    variant: "body",
    children: "This is body text. Perfect for paragraphs and main content.",
  },
};

export const BodyLarge: Story = {
  args: {
    variant: "body-lg",
    children:
      "This is large body text. Use for introductory paragraphs or emphasis.",
  },
};

export const BodySmall: Story = {
  args: {
    variant: "body-sm",
    children: "This is small body text. Great for secondary information.",
  },
};

export const Caption: Story = {
  args: {
    variant: "caption",
    children: "This is caption text. Use for image captions or footnotes.",
  },
};

export const Label: Story = {
  args: {
    variant: "label",
    children: "Label Text",
  },
};

export const ColorVariants: Story = {
  args: {
    children: <></>,
  },
  render: () => (
    <Stack gap="md">
      <Text color="default">Default color text</Text>
      <Text color="primary">Primary color text</Text>
      <Text color="secondary">Secondary color text</Text>
      <Text color="muted">Muted color text</Text>
      <Text color="success">Success color text</Text>
      <Text color="warning">Warning color text</Text>
      <Text color="error">Error color text</Text>
      <Box padding="md" className="bg-primary">
        <Text color="on-primary">Text on primary background</Text>
      </Box>
    </Stack>
  ),
};

export const Alignment: Story = {
  args: {
    children: <></>,
  },
  render: () => (
    <Stack gap="md">
      <Text align="left">Left aligned text</Text>
      <Text align="center">Center aligned text</Text>
      <Text align="right">Right aligned text</Text>
      <Text align="justify">
        Justified text that spans multiple lines. Lorem ipsum dolor sit amet,
        consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore
        et dolore magna aliqua.
      </Text>
    </Stack>
  ),
};

export const FontWeights: Story = {
  args: {
    children: <></>,
  },
  render: () => (
    <Stack gap="md">
      <Text weight="normal">Normal weight text</Text>
      <Text weight="medium">Medium weight text</Text>
      <Text weight="semibold">Semibold weight text</Text>
      <Text weight="bold">Bold weight text</Text>
    </Stack>
  ),
};

export const Truncated: Story = {
  args: {
    variant: "body",
    truncate: true,
    children:
      "This is a very long text that will be truncated with an ellipsis when it exceeds the container width. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
};

export const LineClamping: Story = {
  args: {
    children: <></>,
  },
  render: () => (
    <Stack gap="lg">
      <Stack gap="sm">
        <Text variant="label">Clamp to 2 lines:</Text>
        <Text clamp={2}>
          This text will be clamped to 2 lines maximum. Lorem ipsum dolor sit
          amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut
          labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
          exercitation ullamco laboris.
        </Text>
      </Stack>
      <Stack gap="sm">
        <Text variant="label">Clamp to 3 lines:</Text>
        <Text clamp={3}>
          This text will be clamped to 3 lines maximum. Lorem ipsum dolor sit
          amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut
          labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
          exercitation ullamco laboris. Duis aute irure dolor in reprehenderit
          in voluptate velit esse cillum dolore.
        </Text>
      </Stack>
    </Stack>
  ),
};

export const TypographyHierarchy: Story = {
  args: {
    children: <></>,
  },
  render: () => (
    <Stack gap="lg">
      <Text variant="display">Display: Hero Headline</Text>
      <Text variant="heading-1">Heading 1: Page Title</Text>
      <Text variant="heading-2">Heading 2: Section Title</Text>
      <Text variant="heading-3">Heading 3: Subsection</Text>
      <Text variant="heading-4">Heading 4: Minor Heading</Text>
      <Text variant="heading-5">Heading 5: Small Heading</Text>
      <Text variant="body-lg">
        Body Large: Introductory paragraph or emphasis text that stands out from
        regular body copy.
      </Text>
      <Text variant="body">
        Body: Regular paragraph text. Perfect for main content, descriptions,
        and general reading.
      </Text>
      <Text variant="body-sm">
        Body Small: Secondary information or less important text that still
        needs to be readable.
      </Text>
      <Text variant="caption">
        Caption: Small text for image captions, footnotes, or metadata.
      </Text>
      <Text variant="label">Label: Form labels and UI labels</Text>
    </Stack>
  ),
};

export const SemanticElements: Story = {
  args: {
    children: <></>,
  },
  render: () => (
    <Stack gap="md">
      <Text as="h1" variant="heading-1">
        H1 Element with heading-1 style
      </Text>
      <Text as="p" variant="body">
        Paragraph element with body style
      </Text>
      <Text as="span" variant="caption">
        Span element with caption style
      </Text>
      <Text as="label" variant="label">
        Label element with label style
      </Text>
      <Text as="div" variant="body-sm">
        Div element with body-sm style
      </Text>
    </Stack>
  ),
};

export const GradientHeadings: Story = {
  args: {
    children: <></>,
  },
  render: () => (
    <Stack gap="lg">
      <Stack gap="sm">
        <Text variant="label" color="muted">
          White to Blue Gradient
        </Text>
        <Text variant="heading-1" gradient="white-blue">
          Gradient Heading
        </Text>
        <Text variant="heading-2" gradient="white-blue">
          White to Blue Gradient
        </Text>
      </Stack>

      <Stack gap="sm">
        <Text variant="label" color="muted">
          Red Gradient
        </Text>
        <Text variant="heading-1" gradient="red">
          Gradient Heading
        </Text>
        <Text variant="heading-2" gradient="red">
          Red Gradient
        </Text>
      </Stack>

      <Stack gap="sm">
        <Text variant="label" color="muted">
          Green Gradient
        </Text>
        <Text variant="heading-1" gradient="green">
          Gradient Heading
        </Text>
        <Text variant="heading-2" gradient="green">
          Green Gradient
        </Text>
      </Stack>

      <Stack gap="sm">
        <Text variant="label" color="muted">
          Yellow Gradient
        </Text>
        <Text variant="heading-1" gradient="yellow">
          Gradient Heading
        </Text>
        <Text variant="heading-2" gradient="yellow">
          Yellow Gradient
        </Text>
      </Stack>

      <Stack gap="sm">
        <Text variant="label" color="muted">
          Blue Gradient
        </Text>
        <Text variant="heading-1" gradient="blue">
          Gradient Heading
        </Text>
        <Text variant="heading-2" gradient="blue">
          Blue Gradient
        </Text>
      </Stack>

      <Stack gap="sm">
        <Text variant="label" color="muted">
          White to Yellow Gradient
        </Text>
        <Text variant="heading-1" gradient="white-yellow">
          Gradient Heading
        </Text>
        <Text variant="heading-2" gradient="white-yellow">
          White to Yellow Gradient
        </Text>
      </Stack>

      <Stack gap="sm">
        <Text variant="label" color="muted">
          White to Green Gradient
        </Text>
        <Text variant="heading-1" gradient="white-green">
          Gradient Heading
        </Text>
        <Text variant="heading-2" gradient="white-green">
          White to Green Gradient
        </Text>
      </Stack>

      <Stack gap="sm">
        <Text variant="label" color="muted">
          White to Red Gradient
        </Text>
        <Text variant="heading-1" gradient="white-red">
          Gradient Heading
        </Text>
        <Text variant="heading-2" gradient="white-red">
          White to Red Gradient
        </Text>
      </Stack>
    </Stack>
  ),
};