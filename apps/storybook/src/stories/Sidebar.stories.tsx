import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  Sidebar,
  SidebarItem,
  SidebarGroup,
  Text,
} from "@packages/spark-ui";

/**
 * Sidebar component for navigation with gradient border and glass-morphism effect.
 * 
 * Features:
 * - Gradient border (orange to red)
 * - Glass-morphism background
 * - Multiple shadow effects
 * - Support for nested items
 * - Collapsible groups
 * - Active state highlighting
 * 
 * @example
 * ```tsx
 * <Sidebar>
 *   <SidebarItem active>Administrative</SidebarItem>
 *   <SidebarItem>Marketing</SidebarItem>
 *   <SidebarGroup label="Tech Department">
 *     <SidebarItem nested>Leads</SidebarItem>
 *     <SidebarItem nested>Web Development</SidebarItem>
 *   </SidebarGroup>
 * </Sidebar>
 * ```
 */
const meta = {
  title: "Components/Sidebar",
  component: Sidebar,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "A navigation sidebar with gradient border, glass-morphism effect, and support for nested items.",
      },
    },
  },
  argTypes: {
    children: {
      control: false,
    },
  },
} satisfies Meta<typeof Sidebar>;

export default meta;

/**
 * Default sidebar with basic items.
 */
export const Default = {
  render: () => (
    <Sidebar>
      <SidebarItem active>Administrative</SidebarItem>
      <SidebarItem>Marketing</SidebarItem>
      <SidebarItem>Creatives</SidebarItem>
      <SidebarItem>Operation</SidebarItem>
      <SidebarItem>Community Relation</SidebarItem>
      <SidebarItem>Partnership</SidebarItem>
    </Sidebar>
  ),
};

/**
 * Sidebar with nested items in a group.
 */
export const WithNestedItems = {
  render: () => (
    <Sidebar>
      <SidebarItem active>Administrative</SidebarItem>
      <SidebarItem>Marketing</SidebarItem>
      <SidebarItem>Creatives</SidebarItem>
      <SidebarItem>Operation</SidebarItem>
      <SidebarItem>Community Relation</SidebarItem>
      <SidebarItem>Partnership</SidebarItem>
      <SidebarGroup label="Tech Department" defaultOpen>
        <SidebarItem nested>Leads</SidebarItem>
        <SidebarItem nested>Project Management</SidebarItem>
        <SidebarItem nested>Web Development</SidebarItem>
        <SidebarItem nested>UI/UX</SidebarItem>
        <SidebarItem nested>Cybersecurity</SidebarItem>
        <SidebarItem nested>Cloud Solution</SidebarItem>
        <SidebarItem nested>Data and ML</SidebarItem>
        <SidebarItem nested>IoT</SidebarItem>
      </SidebarGroup>
    </Sidebar>
  ),
};

/**
 * Sidebar with multiple collapsible groups.
 */
export const MultipleGroups = {
  render: () => (
    <Sidebar>
      <SidebarItem active>Dashboard</SidebarItem>
      <SidebarGroup label="Tech Department" defaultOpen>
        <SidebarItem nested>Leads</SidebarItem>
        <SidebarItem nested>Project Management</SidebarItem>
        <SidebarItem nested>Web Development</SidebarItem>
        <SidebarItem nested>UI/UX</SidebarItem>
      </SidebarGroup>
      <SidebarGroup label="Marketing" defaultOpen={false}>
        <SidebarItem nested>Social Media</SidebarItem>
        <SidebarItem nested>Content</SidebarItem>
        <SidebarItem nested>Analytics</SidebarItem>
      </SidebarGroup>
      <SidebarGroup label="Operations">
        <SidebarItem nested>Logistics</SidebarItem>
        <SidebarItem nested>Finance</SidebarItem>
        <SidebarItem nested>HR</SidebarItem>
      </SidebarGroup>
    </Sidebar>
  ),
};

/**
 * Sidebar with clickable items and console logging.
 */
export const Interactive = {
  render: () => (
    <Sidebar>
      <SidebarItem active onClick={() => console.log("Administrative clicked")}>
        Administrative
      </SidebarItem>
      <SidebarItem onClick={() => console.log("Marketing clicked")}>
        Marketing
      </SidebarItem>
      <SidebarItem onClick={() => console.log("Creatives clicked")}>
        Creatives
      </SidebarItem>
      <SidebarGroup label="Tech Department">
        <SidebarItem nested onClick={() => console.log("Leads clicked")}>
          Leads
        </SidebarItem>
        <SidebarItem nested onClick={() => console.log("Web Development clicked")}>
          Web Development
        </SidebarItem>
        <SidebarItem nested onClick={() => console.log("UI/UX clicked")}>
          UI/UX
        </SidebarItem>
      </SidebarGroup>
    </Sidebar>
  ),
};

/**
 * Different sidebar widths.
 */
export const Widths = {
  render: () => (
    <div className="flex gap-8">
      <Sidebar width="sm">
        <SidebarItem active>Small</SidebarItem>
        <SidebarItem>Item 2</SidebarItem>
        <SidebarItem>Item 3</SidebarItem>
      </Sidebar>
      <Sidebar width="md">
        <SidebarItem active>Medium</SidebarItem>
        <SidebarItem>Item 2</SidebarItem>
        <SidebarItem>Item 3</SidebarItem>
      </Sidebar>
      <Sidebar width="lg">
        <SidebarItem active>Large</SidebarItem>
        <SidebarItem>Item 2</SidebarItem>
        <SidebarItem>Item 3</SidebarItem>
      </Sidebar>
    </div>
  ),
};

/**
 * Complete example matching the design reference.
 */
export const CompleteExample = {
  render: () => (
    <Sidebar>
      <div className="text-white text-sm mb-4 flex items-center gap-2">
        <span className="text-xl">📊</span>
        <span className="font-semibold">SideBar</span>
      </div>
      <SidebarItem active>Administrative</SidebarItem>
      <SidebarItem>Marketing</SidebarItem>
      <SidebarItem>Creatives</SidebarItem>
      <SidebarItem>Operation</SidebarItem>
      <SidebarItem>Community Relation</SidebarItem>
      <SidebarItem>Partnership</SidebarItem>
      <SidebarGroup label="Tech Department" defaultOpen>
        <SidebarItem nested>Leads</SidebarItem>
        <SidebarItem nested>Project Management</SidebarItem>
        <SidebarItem nested>Web Development</SidebarItem>
        <SidebarItem nested>UI/UX</SidebarItem>
        <SidebarItem nested>Cybersecurity</SidebarItem>
        <SidebarItem nested>Cloud Solution</SidebarItem>
        <SidebarItem nested>Data and ML</SidebarItem>
        <SidebarItem nested>IoT</SidebarItem>
      </SidebarGroup>
    </Sidebar>
  ),
};

/**
 * Custom text styling using Text component inside SidebarItem.
 * You can wrap the content with Text component to apply gradients or custom styling.
 */
export const WithTextComponent = {
  render: () => (
    <Sidebar>
      <div className="text-white text-sm mb-4 flex items-center gap-2">
        <span className="text-xl">🎨</span>
        <span className="font-semibold">Custom Styling</span>
      </div>
      <SidebarItem active>
        <Text variant="body" gradient="yellow">Administrative</Text>
      </SidebarItem>
      <SidebarItem>
        <Text variant="body" gradient="red">Marketing</Text>
      </SidebarItem>
      <SidebarItem>
        <Text variant="body" gradient="green">Creatives</Text>
      </SidebarItem>
      <SidebarItem>
        <Text variant="body" gradient="blue">Operation</Text>
      </SidebarItem>
      <SidebarGroup label="Tech Department" defaultOpen>
        <SidebarItem nested>Leads</SidebarItem>
        <SidebarItem nested>Web Development</SidebarItem>
      </SidebarGroup>
    </Sidebar>
  ),
};

