import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Button,
} from "@packages/spark-ui";

const meta = {
  title: "Components/Card",
  component: Card,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A flexible card component for displaying content. Composed of multiple sub-components (CardHeader, CardTitle, CardDescription, CardContent, CardFooter) that can be used together to create rich card layouts.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "elevated", "outlined"],
      description: "The visual style variant of the card",
      table: {
        defaultValue: { summary: "default" },
      },
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic card with title and content.
 */
export const Default: Story = {
  render: (args) => (
    <Card {...args} className="w-80">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This is the card content area where you can place any content.</p>
      </CardContent>
    </Card>
  ),
};

/**
 * Card with elevated shadow for more prominence.
 */
export const Elevated: Story = {
  render: () => (
    <Card variant="elevated" className="w-80">
      <CardHeader>
        <CardTitle>Elevated Card</CardTitle>
        <CardDescription>This card has more shadow</CardDescription>
      </CardHeader>
      <CardContent>
        <p>The elevated variant adds a stronger shadow effect.</p>
      </CardContent>
    </Card>
  ),
};

/**
 * Card with thicker border outline.
 */
export const Outlined: Story = {
  render: () => (
    <Card variant="outlined" className="w-80">
      <CardHeader>
        <CardTitle>Outlined Card</CardTitle>
        <CardDescription>This card has a thicker border</CardDescription>
      </CardHeader>
      <CardContent>
        <p>The outlined variant uses a 2px border.</p>
      </CardContent>
    </Card>
  ),
};

/**
 * Complete card with all sections including footer actions.
 */
export const WithFooter: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Event Registration</CardTitle>
        <CardDescription>Register for upcoming event</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Join us for an exciting workshop on modern web development.</p>
        <div className="mt-4 text-sm text-muted-foreground">
          <p>📅 Date: March 15, 2026</p>
          <p>📍 Location: Online</p>
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <Button variant="primary">Register</Button>
        <Button variant="ghost">Learn More</Button>
      </CardFooter>
    </Card>
  ),
};

/**
 * Card used for displaying user profile information.
 */
export const UserProfile: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-xl font-semibold">JD</span>
          </div>
          <div>
            <CardTitle>John Doe</CardTitle>
            <CardDescription>john.doe@example.com</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Events Attended</span>
            <span className="font-medium">12</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Member Since</span>
            <span className="font-medium">Jan 2025</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Role</span>
            <span className="font-medium">Organizer</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="primary" className="w-full">
          View Profile
        </Button>
      </CardFooter>
    </Card>
  ),
};

/**
 * Card displaying event information.
 */
export const EventCard: Story = {
  render: () => (
    <Card variant="elevated" className="w-80">
      <div className="h-40 bg-gradient-to-br from-blue-500 to-purple-600 rounded-t-lg" />
      <CardHeader>
        <CardTitle>Web Development Workshop</CardTitle>
        <CardDescription>Learn modern web technologies</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <span>🗓️</span>
            <span>March 15, 2026 at 2:00 PM</span>
          </div>
          <div className="flex items-center gap-2">
            <span>👥</span>
            <span>45 attendees registered</span>
          </div>
          <div className="flex items-center gap-2">
            <span>📍</span>
            <span>Virtual Event</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button variant="primary" className="flex-1">
          Register
        </Button>
        <Button variant="ghost">Share</Button>
      </CardFooter>
    </Card>
  ),
};

/**
 * Minimal card with just content, no header or footer.
 */
export const ContentOnly: Story = {
  render: () => (
    <Card className="w-80">
      <CardContent className="pt-6">
        <p className="text-center text-sm text-muted-foreground">
          This card only has content without header or footer sections.
        </p>
      </CardContent>
    </Card>
  ),
};

/**
 * Example showing all card variants side by side.
 */
export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-4">
      <Card className="w-60">
        <CardHeader>
          <CardTitle>Default</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">Standard card styling</p>
        </CardContent>
      </Card>
      <Card variant="elevated" className="w-60">
        <CardHeader>
          <CardTitle>Elevated</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">Enhanced shadow</p>
        </CardContent>
      </Card>
      <Card variant="outlined" className="w-60">
        <CardHeader>
          <CardTitle>Outlined</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">Thicker border</p>
        </CardContent>
      </Card>
    </div>
  ),
};
