import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Spinner } from "@packages/spark-ui";

const meta = {
  title: "Components/Spinner",
  component: Spinner,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A loading spinner component for indicating loading states. Fully accessible with proper ARIA attributes and screen reader support.",
      },
    },
  },
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg", "xl"],
      description: "The size of the spinner",
      table: {
        defaultValue: { summary: "md" },
      },
    },
    variant: {
      control: "select",
      options: ["default", "secondary", "muted"],
      description: "The color variant of the spinner",
      table: {
        defaultValue: { summary: "default" },
      },
    },
    label: {
      control: "text",
      description: "Accessible label for screen readers",
      table: {
        defaultValue: { summary: "Loading" },
      },
    },
  },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default spinner with medium size and primary color.
 */
export const Default: Story = {
  args: {},
};

/**
 * Small spinner for compact spaces like buttons.
 */
export const Small: Story = {
  args: {
    size: "sm",
  },
};

/**
 * Medium spinner (default size).
 */
export const Medium: Story = {
  args: {
    size: "md",
  },
};

/**
 * Large spinner for prominent loading states.
 */
export const Large: Story = {
  args: {
    size: "lg",
  },
};

/**
 * Extra large spinner for full-page loading.
 */
export const ExtraLarge: Story = {
  args: {
    size: "xl",
  },
};

/**
 * Secondary color variant spinner.
 */
export const Secondary: Story = {
  args: {
    variant: "secondary",
  },
};

/**
 * Muted color variant for subtle loading indicators.
 */
export const Muted: Story = {
  args: {
    variant: "muted",
  },
};

/**
 * Spinner with custom accessible label.
 */
export const WithLabel: Story = {
  args: {
    label: "Loading events...",
  },
};

/**
 * Example showing all sizes side by side.
 */
export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      <div className="flex flex-col items-center gap-2">
        <Spinner size="sm" />
        <span className="text-xs text-muted-foreground">Small</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Spinner size="md" />
        <span className="text-xs text-muted-foreground">Medium</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Spinner size="lg" />
        <span className="text-xs text-muted-foreground">Large</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Spinner size="xl" />
        <span className="text-xs text-muted-foreground">Extra Large</span>
      </div>
    </div>
  ),
};

/**
 * Example showing all color variants.
 */
export const AllVariants: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      <div className="flex flex-col items-center gap-2">
        <Spinner variant="default" />
        <span className="text-xs text-muted-foreground">Default</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Spinner variant="secondary" />
        <span className="text-xs text-muted-foreground">Secondary</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Spinner variant="muted" />
        <span className="text-xs text-muted-foreground">Muted</span>
      </div>
    </div>
  ),
};

/**
 * Spinner inside a button for loading state.
 */
export const InButton: Story = {
  render: () => (
    <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md">
      <Spinner size="sm" variant="default" />
      <span>Loading...</span>
    </button>
  ),
};

/**
 * Centered spinner for full-page loading.
 */
export const FullPageLoading: Story = {
  render: () => (
    <div className="flex flex-col items-center justify-center h-64 gap-4">
      <Spinner size="xl" />
      <p className="text-sm text-muted-foreground">Loading your content...</p>
    </div>
  ),
};

/**
 * Spinner in a card for content loading.
 */
export const InCard: Story = {
  render: () => (
    <div className="border rounded-lg shadow-sm w-80">
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-2">Event Details</h3>
        <div className="flex items-center justify-center py-12">
          <Spinner size="lg" label="Loading event details..." />
        </div>
      </div>
    </div>
  ),
};

/**
 * Inline spinner with text.
 */
export const InlineWithText: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Spinner size="sm" />
      <span className="text-sm">Processing your request...</span>
    </div>
  ),
};

/**
 * Multiple spinners in different contexts.
 */
export const MultipleContexts: Story = {
  render: () => (
    <div className="space-y-6 w-96">
      {/* In button */}
      <div>
        <p className="text-sm font-medium mb-2">Button Loading State</p>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md">
          <Spinner size="sm" />
          <span>Submitting...</span>
        </button>
      </div>

      {/* In alert */}
      <div>
        <p className="text-sm font-medium mb-2">Alert with Spinner</p>
        <div className="border rounded-lg p-4 flex items-center gap-3">
          <Spinner size="sm" variant="muted" />
          <span className="text-sm">Processing your payment...</span>
        </div>
      </div>

      {/* Centered in card */}
      <div>
        <p className="text-sm font-medium mb-2">Card Loading State</p>
        <div className="border rounded-lg p-6 flex flex-col items-center justify-center gap-3">
          <Spinner size="lg" />
          <p className="text-sm text-muted-foreground">Loading data...</p>
        </div>
      </div>
    </div>
  ),
};
