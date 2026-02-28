import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "@packages/spark-ui";

const meta = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
## Button Component

A versatile button component featuring Google-style gradient borders and multiple visual variants. Built with accessibility and flexibility in mind.

### Features
- 🎨 **4 Visual Variants**: Default, Outline, Stroke, and Link
- 📏 **3 Size Options**: Small (sm), Medium (md), and Large (lg)
- 🌓 **Theme Support**: Light and dark modes for default variant
- 🎯 **Icon Support**: Left and right icon positions
- ♿ **Accessible**: WCAG compliant with keyboard navigation
- 🎭 **Polymorphic**: Can render as child element using asChild prop

### Design System
- **Gradient Border**: Google brand colors (Red, Yellow, Green, Blue)
- **Border Radius**: 16px for default variant, 8px for outline/stroke
- **Shadows**: Multi-layered shadows on default variant for depth
- **Responsive**: Adapts to all screen sizes

### Usage Guidelines
- Use **Default** for primary CTAs and main actions
- Use **Outline** for secondary actions that need clear visual boundaries
- Use **Stroke** for tertiary actions with minimal visual weight
- Use **Link** for inline navigation or text-style actions
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "outline", "stroke", "link"],
      description: "The visual style variant of the button",
      table: {
        type: { summary: "'default' | 'outline' | 'stroke' | 'link'" },
        defaultValue: { summary: "'default'" },
      },
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "The size of the button affecting height, padding, and font size",
      table: {
        type: { summary: "'sm' | 'md' | 'lg'" },
        defaultValue: { summary: "'md'" },
      },
    },
    theme: {
      control: "select",
      options: ["light", "dark"],
      description: "Color theme (only applicable to default variant)",
      table: {
        type: { summary: "'light' | 'dark'" },
        defaultValue: { summary: "'light'" },
      },
    },
    iconLeft: {
      control: "boolean",
      description: "Icon element or boolean to show on the left side of the button text",
      table: {
        type: { summary: "React.ReactNode | boolean" },
      },
    },
    iconRight: {
      control: "boolean",
      description: "Icon element or boolean to show on the right side of the button text",
      table: {
        type: { summary: "React.ReactNode | boolean" },
      },
    },
    asChild: {
      control: "boolean",
      description: "Render as a child element (Radix Slot pattern)",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    disabled: {
      control: "boolean",
      description: "Disables the button and reduces opacity",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    children: {
      control: "text",
      description: "The content/text of the button",
      table: {
        type: { summary: "React.ReactNode" },
      },
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// ====================
// PRIMARY EXAMPLES
// ====================

/**
 * Interactive playground to test all button props and combinations.
 * Use the controls panel to experiment with different configurations.
 */
export const Playground: Story = {
  args: {
    variant: "default",
    size: "md",
    theme: "light",
    children: "Button",
  },
};

/**
 * The default button variant with light theme.
 * Features a gradient background and Google-colored gradient border.
 */
export const Default: Story = {
  args: {
    variant: "default",
    theme: "light",
    children: "Default Button",
  },
  parameters: {
    docs: {
      description: {
        story: "Primary button with gradient background and multi-layered shadows. Best for main CTAs.",
      },
    },
  },
};

// ====================
// VARIANTS
// ====================

/**
 * Default variant with dark theme.
 * Perfect for dark mode interfaces or to provide contrast.
 */
export const DefaultDark: Story = {
  args: {
    variant: "default",
    theme: "dark",
    children: "Default Dark",
  },
  parameters: {
    docs: {
      description: {
        story: "Dark themed variant with solid black background (80% opacity) and the signature gradient border.",
      },
    },
  },
};

/**
 * Outline variant with dashed gradient border.
 * Transparent background makes it perfect for secondary actions.
 */
export const Outline: Story = {
  args: {
    variant: "outline",
    children: "Outline Button",
  },
  parameters: {
    docs: {
      description: {
        story: "Features a dashed gradient border (4px dash, 4px gap) with transparent background. Ideal for secondary actions.",
      },
    },
  },
};

/**
 * Stroke variant with solid gradient border.
 * Clean and minimal design for tertiary actions.
 */
export const Stroke: Story = {
  args: {
    variant: "stroke",
    children: "Stroke Button",
  },
  parameters: {
    docs: {
      description: {
        story: "Solid gradient border with transparent background. Perfect for less prominent actions.",
      },
    },
  },
};

/**
 * Link variant styled as a hyperlink.
 * Only shows gradient border at the bottom.
 */
export const Link: Story = {
  args: {
    variant: "link",
    children: "Link Button",
  },
  parameters: {
    docs: {
      description: {
        story: "Text-style button with gradient underline. Use for inline navigation or subtle actions.",
      },
    },
  },
};

// ====================
// SIZES
// ====================

/**
 * Small size button (32px height).
 * Compact design for tight spaces or less prominent actions.
 */
export const Small: Story = {
  args: {
    variant: "default",
    size: "sm",
    children: "Small",
  },
  parameters: {
    docs: {
      description: {
        story: "32px height, 12px font size. Use in compact UIs, tables, or as supplementary actions.",
      },
    },
  },
};

/**
 * Medium size button (40px height) - Default.
 * The standard button size for most use cases.
 */
export const Medium: Story = {
  args: {
    variant: "default",
    size: "md",
    children: "Medium",
  },
  parameters: {
    docs: {
      description: {
        story: "40px height, 14px font size. The default and most commonly used size.",
      },
    },
  },
};

/**
 * Large size button (48px height).
 * Prominent design for primary CTAs and hero sections.
 */
export const Large: Story = {
  args: {
    variant: "default",
    size: "lg",
    children: "Large",
  },
  parameters: {
    docs: {
      description: {
        story: "48px height, 16px font size. Use for hero sections, primary CTAs, or when more prominence is needed.",
      },
    },
  },
};

// ====================
// SIZE MATRIX (All Variants × All Sizes)
// ====================

/**
 * Visual comparison of all button variants across all size options.
 * Demonstrates the consistent scaling and spacing across the design system.
 */
export const SizeMatrix: Story = {
  render: () => (
    <div className="space-y-8">
      {/* Default Variant */}
      <div>
        <h3 className="text-sm font-semibold mb-4 text-gray-700">Default Variant</h3>
        <div className="flex items-center gap-4">
          <Button variant="default" size="sm">Small</Button>
          <Button variant="default" size="md">Medium</Button>
          <Button variant="default" size="lg">Large</Button>
        </div>
      </div>
      
      {/* Outline Variant */}
      <div>
        <h3 className="text-sm font-semibold mb-4 text-gray-700">Outline Variant</h3>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm">Small</Button>
          <Button variant="outline" size="md">Medium</Button>
          <Button variant="outline" size="lg">Large</Button>
        </div>
      </div>
      
      {/* Stroke Variant */}
      <div>
        <h3 className="text-sm font-semibold mb-4 text-gray-700">Stroke Variant</h3>
        <div className="flex items-center gap-4">
          <Button variant="stroke" size="sm">Small</Button>
          <Button variant="stroke" size="md">Medium</Button>
          <Button variant="stroke" size="lg">Large</Button>
        </div>
      </div>
      
      {/* Link Variant */}
      <div>
        <h3 className="text-sm font-semibold mb-4 text-gray-700">Link Variant</h3>
        <div className="flex items-center gap-4">
          <Button variant="link" size="sm">Small</Button>
          <Button variant="link" size="md">Medium</Button>
          <Button variant="link" size="lg">Large</Button>
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story: "Complete size matrix showing all variants in all sizes for easy comparison.",
      },
    },
  },
};

// ====================
// WITH ICONS
// ====================

/**
 * Button with icon on the left side.
 * Useful for actions that benefit from visual reinforcement.
 */
export const WithIconLeft: Story = {
  args: {
    variant: "default",
    iconLeft: true,
    children: "With Icon",
  },
  parameters: {
    docs: {
      description: {
        story: "Icon positioned to the left of the button text. Pass a custom icon component or `true` for default icon.",
      },
    },
  },
};

/**
 * Button with icon on the right side.
 * Often used for navigation or \"next\" actions.
 */
export const WithIconRight: Story = {
  args: {
    variant: "default",
    iconRight: true,
    children: "With Icon",
  },
  parameters: {
    docs: {
      description: {
        story: "Icon positioned to the right of the button text. Commonly used for forward navigation.",
      },
    },
  },
};

/**
 * Button with icons on both sides.
 * For complex actions requiring visual context on both ends.
 */
export const WithBothIcons: Story = {
  args: {
    variant: "default",
    iconLeft: true,
    iconRight: true,
    children: "Both Icons",
  },
  parameters: {
    docs: {
      description: {
        story: "Icons flanking both sides of the button text for enhanced visual communication.",
      },
    },
  },
};

// ====================
// STATES
// ====================

/**
 * Disabled button state.
 * Visually indicates the button cannot be interacted with.
 */
export const Disabled: Story = {
  args: {
    variant: "default",
    disabled: true,
    children: "Disabled Button",
  },
  parameters: {
    docs: {
      description: {
        story: "Disabled state with reduced opacity and no pointer events. Automatically handled by the browser.",
      },
    },
  },
};

/**
 * All variants in disabled state for comparison.
 */
export const DisabledStates: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button variant="default" disabled>Default</Button>
      <Button variant="outline" disabled>Outline</Button>
      <Button variant="stroke" disabled>Stroke</Button>
      <Button variant="link" disabled>Link</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Visual comparison of all button variants in their disabled state.",
      },
    },
  },
};

// ====================
// THEME VARIATIONS
// ====================

/**
 * Light and dark theme comparison for default variant.
 */
export const ThemeComparison: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center gap-4 p-4 bg-white rounded">
        <Button variant="default" theme="light">Light Theme</Button>
        <span className="text-sm text-gray-500">On light background</span>
      </div>
      <div className="flex items-center gap-4 p-4 bg-gray-900 rounded">
        <Button variant="default" theme="dark">Dark Theme</Button>
        <span className="text-sm text-gray-300">On dark background</span>
      </div>
    </div>
  ),
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story: "Theme variants shown on appropriate backgrounds. Only applies to the default variant.",
      },
    },
  },
};

// ====================
// COMPLETE HIERARCHY
// ====================

/**
 * Complete visual hierarchy demonstrating all button variants,
 * sizes, and states in a single view.
 */
export const CompleteHierarchy: Story = {
  render: () => (
    <div className="space-y-12 p-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Button Component Hierarchy</h2>
        <p className="text-gray-600">Complete visual reference for all button variants and sizes</p>
      </div>

      {/* Default Variant - All Sizes */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Default Variant</h3>
          <p className="text-sm text-gray-600 mb-4">Primary actions with gradient background and multi-layered shadows</p>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <span className="w-20 text-sm text-gray-500">Light:</span>
            <Button variant="default" theme="light" size="sm">Small</Button>
            <Button variant="default" theme="light" size="md">Medium</Button>
            <Button variant="default" theme="light" size="lg">Large</Button>
          </div>
          <div className="flex items-center gap-4">
            <span className="w-20 text-sm text-gray-500">Dark:</span>
            <Button variant="default" theme="dark" size="sm">Small</Button>
            <Button variant="default" theme="dark" size="md">Medium</Button>
            <Button variant="default" theme="dark" size="lg">Large</Button>
          </div>
        </div>
      </div>

      {/* Outline Variant */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Outline Variant</h3>
          <p className="text-sm text-gray-600 mb-4">Secondary actions with dashed gradient border</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm">Small</Button>
          <Button variant="outline" size="md">Medium</Button>
          <Button variant="outline" size="lg">Large</Button>
        </div>
      </div>

      {/* Stroke Variant */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Stroke Variant</h3>
          <p className="text-sm text-gray-600 mb-4">Tertiary actions with solid gradient border</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="stroke" size="sm">Small</Button>
          <Button variant="stroke" size="md">Medium</Button>
          <Button variant="stroke" size="lg">Large</Button>
        </div>
      </div>

      {/* Link Variant */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Link Variant</h3>
          <p className="text-sm text-gray-600 mb-4">Inline navigation with gradient underline</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="link" size="sm">Small</Button>
          <Button variant="link" size="md">Medium</Button>
          <Button variant="link" size="lg">Large</Button>
        </div>
      </div>

      {/* With Icons */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">With Icons</h3>
          <p className="text-sm text-gray-600 mb-4">Buttons with icon support on either or both sides</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="default" iconLeft>Icon Left</Button>
          <Button variant="outline" iconRight>Icon Right</Button>
          <Button variant="stroke" iconLeft iconRight>Both Icons</Button>
        </div>
      </div>

      {/* Disabled States */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Disabled State</h3>
          <p className="text-sm text-gray-600 mb-4">All variants in disabled state</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="default" disabled>Default</Button>
          <Button variant="outline" disabled>Outline</Button>
          <Button variant="stroke" disabled>Stroke</Button>
          <Button variant="link" disabled>Link</Button>
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        story: "Comprehensive visual hierarchy showing all button variations in one organized view. Perfect for design reviews and reference.",
      },
    },
  },
};
