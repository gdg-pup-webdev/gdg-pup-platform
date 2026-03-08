import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "@packages/spark-ui";
// Example icons for demonstration
const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const PlusIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const DownloadIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'tag', 'colored', 'link', 'dashed-outline', 'stroke-outline', 'ghost', 'attribute', 'disabled'],
      description: 'The main visual style of the button',
    },
    subVariant: {
      control: 'select',
      options: ['plain', 'colored', 'blue', 'yellow', 'green', 'red', 'dark-blue'],
      description: 'Secondary variant for additional styling options',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the button',
    },
    children: {
      control: 'text',
      description: 'Button text content',
    },
    iconLeft: {
      control: 'boolean',
      description: 'Show icon on the left side',
    },
    iconRight: {
      control: 'boolean',
      description: 'Show icon on the right side',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
    asChild: {
      control: 'boolean',
      description: 'Render as child component (Radix Slot pattern)',
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default story
export const Default: Story = {
  args: {
    children: 'Button',
    variant: 'default',
    subVariant: 'colored',
    size: 'md',
  },
};

// Variants showcase
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-3">
        <Button variant="default" >Default</Button>
        <Button variant="tag">Tag</Button>
        <Button variant="colored">Colored</Button>
        <Button variant="link">Link</Button>
        <Button variant="dashed-outline">Dashed Outline</Button>
        <Button variant="outline">Stroke Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="attribute">Attribute</Button>
        <Button variant="disabled" disabled>Disabled</Button>
      </div>
    </div>
  ),
};

// Sizes
export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-3">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};

// Semi-filled sub-variants
export const DefaultVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4 items-center">
      <div className="flex gap-4">
        <div className="flex flex-col gap-3">
          <Button size="sm">Blue</Button>
          <Button size="md">Blue</Button>
          <Button size="lg">Blue</Button>
        </div>
        <div className="flex flex-col gap-3">
          <Button subVariant="plain" size="sm">Plain</Button>
          <Button subVariant="plain" size="md">Plain</Button>
          <Button subVariant="plain" size="lg">Plain</Button>
        </div>
      </div>
      <div className="text-sm text-gray-600">Default Variants</div>
      
    </div>
  ),
};

// Colored sub-variants
export const ColoredVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4 items-center">
      <div className="flex gap-4">
        <div className="flex flex-col gap-3">
          <Button variant="colored" subVariant="blue" size="sm">Blue</Button>
          <Button variant="colored" subVariant="blue" size="md">Blue</Button>
          <Button variant="colored" subVariant="blue" size="lg">Blue</Button>
        </div>
        <div className="flex flex-col gap-3">
          <Button variant="colored" subVariant="yellow" size="sm">Yellow</Button>
          <Button variant="colored" subVariant="yellow" size="md">Yellow</Button>
          <Button variant="colored" subVariant="yellow" size="lg">Yellow</Button>
        </div>
        <div className="flex flex-col gap-3">
          <Button variant="colored" subVariant="green" size="sm">Green</Button>
          <Button variant="colored" subVariant="green" size="md">Green</Button>
          <Button variant="colored" subVariant="green" size="lg">Green</Button>
        </div>
        <div className="flex flex-col gap-3">
          <Button variant="colored" subVariant="red" size="sm">Red</Button>
          <Button variant="colored" subVariant="red" size="md">Red</Button>
          <Button variant="colored" subVariant="red" size="lg">Red</Button>
        </div>
        <div className="flex flex-col gap-3">
          <Button variant="colored" subVariant="dark-blue" size="sm">Dark Blue</Button>
          <Button variant="colored" subVariant="dark-blue" size="md">Dark Blue</Button>
          <Button variant="colored" subVariant="dark-blue" size="lg">Dark Blue</Button>
        </div>
      </div>
      <div className="text-sm text-gray-600">Colored variant with color sub-variants</div>
      
    </div>
  ),
};

export const Tags: Story = {
  render: () => (
    <div className="flex flex-col gap-4 items-center">
      <div className="flex gap-4">
        <div className="flex flex-col gap-3">
          <Button variant="tag" size="sm">Tag</Button>
          <Button variant="tag" size="md">Tag</Button>
          <Button variant="tag" size="lg">Tag</Button>
        </div>
      </div>
      <div className="text-sm text-gray-600">Default Variants</div>
      
    </div>
  )
}

// With Icons
export const WithLeftIcon: Story = {
  render: () => (
    <div className="flex items-end flex-wrap gap-3">
      <Button iconLeft={<CheckIcon />} size="sm">Small</Button>
      <Button iconLeft={<CheckIcon />} size="md">Medium</Button>
      <Button iconLeft={<CheckIcon />} size="lg">Large</Button>
    </div>
  ),
};

export const WithRightIcon: Story = {
  render: () => (
    <div className="flex flex-wrap items-end gap-3">
      <Button iconRight={<ArrowRightIcon />} size="sm">Continue</Button>
      <Button iconRight={<ArrowRightIcon />} size="md">Continue</Button>
      <Button iconRight={<ArrowRightIcon />} size="lg">Continue</Button>
    </div>
  ),
};

export const WithBothIcons: Story = {
  render: () => (
    <div className="flex flex-wrap items-end gap-3">
      <Button iconLeft={<CheckIcon />} iconRight={<ArrowRightIcon />} size="sm">
        Complete
      </Button>
      <Button iconLeft={<CheckIcon />} iconRight={<ArrowRightIcon />} size="md">
        Complete
      </Button>
      <Button iconLeft={<CheckIcon />} iconRight={<ArrowRightIcon />} size="lg">
        Complete
      </Button>
    </div>
  ),
};

export const IconOnly: Story = {
  render: () => (
    <div className="flex flex-wrap items-end gap-3">
      <Button iconLeft={<PlusIcon />} size="sm" aria-label="Add" />
      <Button iconLeft={<PlusIcon />} size="md" aria-label="Add" />
      <Button iconLeft={<PlusIcon />} size="lg" aria-label="Add" />
    </div>
  ),
};

// Default icon (when iconLeft={true})
export const WithDefaultIcon: Story = {
  render: () => (
    <div className="flex flex-wrap items-end gap-3">
      <Button iconLeft={true}>Default Icon Left</Button>
      <Button iconRight={true}>Default Icon Right</Button>
      <Button iconLeft={true} iconRight={true}>Both Default Icons</Button>
    </div>
  ),
};

// States
export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-3">
        <Button>Normal</Button>
        <Button className="hover:scale-105">Hover (simulate)</Button>
        <Button className="focus:ring-2">Focus (simulate)</Button>
        <Button disabled>Disabled</Button>
      </div>
    </div>
  ),
};

// Real-world examples
export const ActionButtons: Story = {
  render: () => (
    <div className="flex flex-col gap-4 p-6 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-semibold">Common Actions</h3>
      <div className="flex flex-wrap gap-3">
        <Button variant="colored" subVariant="blue" iconLeft={<PlusIcon />}>
          Create New
        </Button>
        <Button variant="colored" subVariant="green" iconLeft={<CheckIcon />}>
          Save Changes
        </Button>
        <Button variant="colored" subVariant="red">
          Delete
        </Button>
        <Button variant="ghost" iconLeft={<DownloadIcon />}>
          Download
        </Button>
        <Button variant="link">Learn More</Button>
      </div>
    </div>
  ),
};

export const ButtonGroup: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div>
        <h4 className="text-sm font-medium mb-2">Horizontal Group</h4>
        <div className="inline-flex rounded-lg border overflow-hidden">
          <Button variant="ghost" className="rounded-none border-r">Left</Button>
          <Button variant="ghost" className="rounded-none border-r">Center</Button>
          <Button variant="ghost" className="rounded-none">Right</Button>
        </div>
      </div>
      
      <div>
        <h4 className="text-sm font-medium mb-2">Action Group</h4>
        <div className="flex gap-2">
          <Button variant="colored" subVariant="blue" size="sm">Primary</Button>
          <Button variant="default" size="sm">Secondary</Button>
          <Button variant="ghost" size="sm">Tertiary</Button>
        </div>
      </div>
    </div>
  ),
};

type variants = "disabled" | "default" | "tag" | "colored" | "link" | "dashed-outline" | "outline" | "ghost" | "attribute" | null | undefined;

// Size comparison across variants
export const SizeComparison: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {['default', 'tag', 'colored', 'ghost'].map((variant) => (
        <div key={variant} className="flex flex-col gap-2">
          <h4 className="text-sm font-medium capitalize">{variant}</h4>
          <div className="flex flex-wrap items-end gap-3">
            <Button variant={variant as variants} size="sm" iconLeft={<CheckIcon />} className="">
              Small
            </Button>
            <Button variant={variant as variants} size="md" iconLeft={<CheckIcon />}>
              Medium
            </Button>
            <Button variant={variant as variants} size="lg" iconLeft={<CheckIcon />}>
              Large
            </Button>
          </div>
        </div>
      ))}
    </div>
  ),
};

// Loading state example (you might want to add this to your component)
export const LoadingExample: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Button disabled iconLeft={
        <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
      }>
        Loading...
      </Button>
      <Button variant="colored" subVariant="blue" disabled iconLeft={
        <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
      }>
        Processing...
      </Button>
    </div>
  ),
};

// Interactive playground
export const Playground: Story = {
  args: {
    children: 'Customize Me',
    variant: 'default',
    subVariant: undefined,
    size: 'md',
    iconLeft: undefined,
    iconRight: undefined,
    disabled: false,
  },
};