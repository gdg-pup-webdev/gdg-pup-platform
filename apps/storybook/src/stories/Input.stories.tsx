import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Input } from "@packages/spark-ui/src";

const meta = {
  title: "Components/Input",
  component: Input,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "A versatile input component with multiple variants and sizes. Built with accessibility in mind and supports all native HTML input attributes.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "error"],
      description: "The visual style variant of the input",
      table: {
        defaultValue: { summary: "default" },
      },
    },
    inputSize: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "The size of the input field",
      table: {
        defaultValue: { summary: "md" },
      },
    },
    type: {
      control: "select",
      options: ["text", "email", "password", "number", "tel", "url", "search"],
      description: "The HTML input type",
      table: {
        defaultValue: { summary: "text" },
      },
    },
    placeholder: {
      control: "text",
      description: "Placeholder text for the input",
    },
    disabled: {
      control: "boolean",
      description: "Whether the input is disabled",
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The default input with standard styling.
 */
export const Default: Story = {
  args: {
    placeholder: "Enter text...",
  },
};

/**
 * A small-sized input field, useful for compact layouts.
 */
export const Small: Story = {
  args: {
    inputSize: "sm",
    placeholder: "Small input",
  },
};

/**
 * A medium-sized input field (default size).
 */
export const Medium: Story = {
  args: {
    inputSize: "md",
    placeholder: "Medium input",
  },
};

/**
 * A large-sized input field for prominent forms.
 */
export const Large: Story = {
  args: {
    inputSize: "lg",
    placeholder: "Large input",
  },
};

/**
 * Error variant with red border, used to indicate validation errors.
 */
export const Error: Story = {
  args: {
    variant: "error",
    placeholder: "Invalid input",
    defaultValue: "invalid@email",
  },
};

/**
 * Email input type with appropriate keyboard on mobile devices.
 */
export const Email: Story = {
  args: {
    type: "email",
    placeholder: "Enter your email",
  },
};

/**
 * Password input type that masks the entered text.
 */
export const Password: Story = {
  args: {
    type: "password",
    placeholder: "Enter your password",
  },
};

/**
 * Disabled input that cannot be interacted with.
 */
export const Disabled: Story = {
  args: {
    placeholder: "Disabled input",
    disabled: true,
    defaultValue: "Cannot edit this",
  },
};

/**
 * Search input with appropriate styling and behavior.
 */
export const Search: Story = {
  args: {
    type: "search",
    placeholder: "Search...",
  },
};

/**
 * Example showing all sizes side by side.
 */
export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <Input inputSize="sm" placeholder="Small" />
      <Input inputSize="md" placeholder="Medium" />
      <Input inputSize="lg" placeholder="Large" />
    </div>
  ),
};

/**
 * Example form showing various input types together.
 */
export const FormExample: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <div>
        <label className="block text-sm font-medium mb-2">Name</label>
        <Input placeholder="John Doe" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Email</label>
        <Input type="email" placeholder="john@example.com" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Password</label>
        <Input type="password" placeholder="••••••••" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Invalid Field</label>
        <Input variant="error" defaultValue="invalid-email" />
        <p className="text-sm text-destructive mt-1">Please enter a valid email</p>
      </div>
    </div>
  ),
};
