import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
  DropdownLabel,
  DropdownSeparator,
  Button,
  Stack,
  Text,
} from "@packages/spark-ui";

/**
 * # Dropdown
 *
 * A dropdown menu component with keyboard navigation and accessibility features.
 * Perfect for navigation menus, action menus, and context menus.
 *
 * ## Features
 * - 🎯 Compound component pattern
 * - ⌨️ Full keyboard navigation
 * - ♿ WCAG 2.1 AA compliant
 * - 🎨 Customizable variants and sizes
 * - 🔗 Support for links and actions
 * - 📱 Click-outside to close
 *
 * ## Usage
 *
 * ```tsx
 * <Dropdown>
 *   <DropdownTrigger>
 *     <Button>Menu</Button>
 *   </DropdownTrigger>
 *   <DropdownContent>
 *     <DropdownItem onClick={() => alert('Profile')}>
 *       Profile
 *     </DropdownItem>
 *     <DropdownItem onClick={() => alert('Settings')}>
 *       Settings
 *     </DropdownItem>
 *     <DropdownSeparator />
 *     <DropdownItem variant="danger" onClick={() => alert('Logout')}>
 *       Logout
 *     </DropdownItem>
 *   </DropdownContent>
 * </Dropdown>
 * ```
 */
const meta = {
  title: "Components/Dropdown",
  component: Dropdown,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A flexible dropdown menu component with compound pattern and full accessibility support.",
      },
    },
  },
  argTypes: {
    children: {
      control: false,
    },
  },
} satisfies Meta<typeof Dropdown>;

export default meta;

/**
 * Default dropdown with basic items.
 */
export const Default = {
  render: () => (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="default">
          Menu
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </Button>
      </DropdownTrigger>
      <DropdownContent>
        <DropdownItem onClick={() => alert("Profile clicked")}>Profile</DropdownItem>
        <DropdownItem onClick={() => alert("Settings clicked")}>Settings</DropdownItem>
        <DropdownItem onClick={() => alert("Billing clicked")}>Billing</DropdownItem>
        <DropdownSeparator />
        <DropdownItem variant="danger" onClick={() => alert("Logout clicked")}>
          Logout
        </DropdownItem>
      </DropdownContent>
    </Dropdown>
  ),
};

/**
 * Dropdown with section labels for organization.
 */
export const WithLabels = {
  render: () => (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="default">Account</Button>
      </DropdownTrigger>
      <DropdownContent>
        <DropdownLabel>My Account</DropdownLabel>
        <DropdownItem>Profile</DropdownItem>
        <DropdownItem>Settings</DropdownItem>
        <DropdownSeparator />
        <DropdownLabel>Billing</DropdownLabel>
        <DropdownItem>Invoices</DropdownItem>
        <DropdownItem>Payment Methods</DropdownItem>
        <DropdownSeparator />
        <DropdownItem variant="danger">Logout</DropdownItem>
      </DropdownContent>
    </Dropdown>
  ),
};

/**
 * Dropdown with keyboard shortcuts displayed.
 */
export const WithShortcuts = {
  render: () => (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="default">Edit</Button>
      </DropdownTrigger>
      <DropdownContent>
        <DropdownItem shortcut="⌘C">Copy</DropdownItem>
        <DropdownItem shortcut="⌘V">Paste</DropdownItem>
        <DropdownItem shortcut="⌘X">Cut</DropdownItem>
        <DropdownSeparator />
        <DropdownItem shortcut="⌘Z">Undo</DropdownItem>
        <DropdownItem shortcut="⌘⇧Z">Redo</DropdownItem>
      </DropdownContent>
    </Dropdown>
  ),
};

/**
 * Dropdown with icons before text.
 */
export const WithIcons = {
  render: () => (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="default">Actions</Button>
      </DropdownTrigger>
      <DropdownContent>
        <DropdownItem
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          }
        >
          View Profile
        </DropdownItem>
        <DropdownItem
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          }
        >
          Settings
        </DropdownItem>
        <DropdownSeparator />
        <DropdownItem
          variant="danger"
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          }
        >
          Logout
        </DropdownItem>
      </DropdownContent>
    </Dropdown>
  ),
};

/**
 * Dropdown with different item variants (danger, success).
 */
export const ItemVariants = {
  render: () => (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="default">Status Actions</Button>
      </DropdownTrigger>
      <DropdownContent>
        <DropdownItem variant="default">Default Action</DropdownItem>
        <DropdownItem variant="success">Approve</DropdownItem>
        <DropdownItem variant="danger">Delete</DropdownItem>
      </DropdownContent>
    </Dropdown>
  ),
};

/**
 * Dropdown with disabled items.
 */
export const DisabledItems = {
  render: () => (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="default">Options</Button>
      </DropdownTrigger>
      <DropdownContent>
        <DropdownItem>Enabled Item</DropdownItem>
        <DropdownItem disabled>Disabled Item</DropdownItem>
        <DropdownItem>Another Enabled Item</DropdownItem>
        <DropdownItem disabled>Another Disabled Item</DropdownItem>
      </DropdownContent>
    </Dropdown>
  ),
};

/**
 * Dropdown with different sizes.
 */
export const Sizes = {
  render: () => (
    <Stack gap="lg">
      <div>
        <Text variant="label" className="mb-2 block">Small</Text>
        <Dropdown>
          <DropdownTrigger>
            <Button variant="default">Small Menu</Button>
          </DropdownTrigger>
          <DropdownContent size="sm">
            <DropdownItem>Item 1</DropdownItem>
            <DropdownItem>Item 2</DropdownItem>
            <DropdownItem>Item 3</DropdownItem>
          </DropdownContent>
        </Dropdown>
      </div>

      <div>
        <Text variant="label" className="mb-2 block">Medium (Default)</Text>
        <Dropdown>
          <DropdownTrigger>
            <Button variant="default">Medium Menu</Button>
          </DropdownTrigger>
          <DropdownContent size="md">
            <DropdownItem>Item 1</DropdownItem>
            <DropdownItem>Item 2</DropdownItem>
            <DropdownItem>Item 3</DropdownItem>
          </DropdownContent>
        </Dropdown>
      </div>

      <div>
        <Text variant="label" className="mb-2 block">Large</Text>
        <Dropdown>
          <DropdownTrigger>
            <Button variant="default">Large Menu</Button>
          </DropdownTrigger>
          <DropdownContent size="lg">
            <DropdownItem>Item 1</DropdownItem>
            <DropdownItem>Item 2</DropdownItem>
            <DropdownItem>Item 3</DropdownItem>
          </DropdownContent>
        </Dropdown>
      </div>
    </Stack>
  ),
};

/**
 * Dropdown positioned at different locations.
 */
export const Positions = {
  render: () => (
    <Stack gap="lg">
      <div>
        <Text variant="label" className="mb-2 block">Bottom Start (Default)</Text>
        <Dropdown>
          <DropdownTrigger>
            <Button variant="default">Bottom Start</Button>
          </DropdownTrigger>
          <DropdownContent position="bottom-start">
            <DropdownItem>Item 1</DropdownItem>
            <DropdownItem>Item 2</DropdownItem>
          </DropdownContent>
        </Dropdown>
      </div>

      <div>
        <Text variant="label" className="mb-2 block">Bottom End</Text>
        <Dropdown>
          <DropdownTrigger>
            <Button variant="default">Bottom End</Button>
          </DropdownTrigger>
          <DropdownContent position="bottom-end">
            <DropdownItem>Item 1</DropdownItem>
            <DropdownItem>Item 2</DropdownItem>
          </DropdownContent>
        </Dropdown>
      </div>
    </Stack>
  ),
};

/**
 * Navigation dropdown use case (like in Navbar).
 */
export const NavigationMenu = {
  render: () => (
    <Dropdown>
      <DropdownTrigger asChild>
        <button className="flex items-center gap-1 text-gray-300 hover:text-white transition-colors py-2 cursor-pointer">
          <Text variant="body" className="text-inherit">About</Text>
          <svg className="w-4 h-4 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </DropdownTrigger>
      <DropdownContent>
        <DropdownItem onClick={() => alert("Who is GDG")}>Who is GDG</DropdownItem>
        <DropdownItem onClick={() => alert("Our Team")}>Our Team</DropdownItem>
        <DropdownItem onClick={() => alert("History")}>History</DropdownItem>
        <DropdownItem onClick={() => alert("Partnership")}>Partnership</DropdownItem>
        <DropdownItem onClick={() => alert("GDG on TOP")}>GDG on TOP</DropdownItem>
      </DropdownContent>
    </Dropdown>
  ),
};

/**
 * Complex dropdown with multiple sections.
 */
export const ComplexMenu = {
  render: () => (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="default">Complex Menu</Button>
      </DropdownTrigger>
      <DropdownContent>
        <DropdownLabel>Account</DropdownLabel>
        <DropdownItem
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          }
          shortcut="⌘P"
        >
          Profile
        </DropdownItem>
        <DropdownItem
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          }
          shortcut="⌘S"
        >
          Settings
        </DropdownItem>
        
        <DropdownSeparator />
        
        <DropdownLabel>Team</DropdownLabel>
        <DropdownItem>Invite Members</DropdownItem>
        <DropdownItem disabled>Manage Team (Pro)</DropdownItem>
        
        <DropdownSeparator />
        
        <DropdownLabel>Billing</DropdownLabel>
        <DropdownItem variant="success">Upgrade Plan</DropdownItem>
        <DropdownItem>Payment Methods</DropdownItem>
        
        <DropdownSeparator />
        
        <DropdownItem
          variant="danger"
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          }
          shortcut="⌘Q"
        >
          Logout
        </DropdownItem>
      </DropdownContent>
    </Dropdown>
  ),
};

/**
 * Controlled dropdown example.
 */
export const Controlled = {
  args: {},
  render: function ControlledExample() {
    const [open, setOpen] = useState(false);

    return (
      <Stack gap="md">
        <div>
          <Text variant="body">Dropdown is {open ? "open" : "closed"}</Text>
          <button 
            onClick={() => setOpen(!open)}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
          >
            Toggle from outside
          </button>
        </div>
        
        <Dropdown open={open} onOpenChange={setOpen}>
          <DropdownTrigger>
            <Button variant="default">Controlled Menu</Button>
          </DropdownTrigger>
          <DropdownContent>
            <DropdownItem>Item 1</DropdownItem>
            <DropdownItem>Item 2</DropdownItem>
            <DropdownItem>Item 3</DropdownItem>
          </DropdownContent>
        </Dropdown>
      </Stack>
    );
  },
};
