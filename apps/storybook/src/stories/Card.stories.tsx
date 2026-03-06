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
        component: `
## Card Component

A flexible, composable card component with glassmorphism effect and customizable structure. Built following Figma specifications for consistent design.

### Features
- 🎴 **Modular Composition**: Header, Title, Description, Content, and Footer sub-components
- 🌟 **Glassmorphism**: Semi-transparent background with backdrop blur
- 📐 **Figma Specifications**: 28px border radius, 20px padding, 10px gap
- ♿ **Accessible**: Semantic HTML with proper heading hierarchy
- 🎨 **Customizable**: Flexible layout with gap-based spacing

### Design Specifications
- **Border Radius**: 28px for smooth, modern corners
- **Border**: 1px solid white (#FFFFFF)
- **Background**: Semi-transparent white (rgba(255, 255, 255, 0.05))
- **Padding**: 20px internal spacing
- **Gap**: 10px between flex children
- **Backdrop Filter**: 10px blur for glassmorphism effect

### Sub-Components

#### CardHeader
Container for the card's title and description. Provides proper spacing and layout.

#### CardTitle
Main heading for the card (renders as h3). Should be concise and descriptive.

#### CardDescription
Subtitle or supporting text for the card. Uses muted colors for hierarchy.

#### CardContent
Main content area of the card. Can contain any elements with proper gap spacing.

#### CardFooter
Action area at the bottom of the card. Perfect for buttons and CTAs.

### Usage Guidelines
- Use cards to **group related content** and create visual hierarchy
- Keep titles **short and descriptive** (3-7 words)
- Place **primary actions** in the footer for consistency
- Use **CardDescription** for context or metadata
- Combine with other components like Buttons, Badges, and Avatars

### Accessibility
- Proper heading hierarchy (h3 for CardTitle)
- Semantic HTML structure
- Supports ARIA attributes through props spreading
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default"],
      description: "The visual style variant of the card (currently only default available)",
      table: {
        type: { summary: "'default'" },
        defaultValue: { summary: "'default'" },
      },
    },
    className: {
      control: "text",
      description: "Additional CSS classes to apply to the card",
      table: {
        type: { summary: "string" },
      },
    },
    children: {
      control: false,
      description: "The content of the card (typically composed of sub-components)",
      table: {
        type: { summary: "React.ReactNode" },
      },
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

// ====================
// PRIMARY EXAMPLES
// ====================

/**
 * Interactive playground to test card props and compositions.
 * Use the controls panel to experiment with different configurations.
 */
export const Playground: Story = {
  args: {
    variant: "default",
    className: "w-80",
  },
  render: (args) => (
    <Card {...args}>
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
 * Basic card with title, description, and content.
 * The most common card composition for simple information display.
 */
export const Default: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Welcome to GDG PUP</CardTitle>
        <CardDescription>Google Developer Group at PUP</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-300">
          Join our community of developers, designers, and tech enthusiasts. 
          Learn, collaborate, and grow together.
        </p>
      </CardContent>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: "Standard card with header and content sections. Perfect for displaying basic information and descriptions.",
      },
    },
  },
};

// ====================
// COMPOSITIONAL EXAMPLES
// ====================

/**
 * Complete card with all sub-components including footer actions.
 * Demonstrates the full card structure with call-to-action buttons.
 */
export const WithFooter: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Event Registration</CardTitle>
        <CardDescription>Register for upcoming workshop</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-300 mb-4">
          Join us for an exciting workshop on modern web development technologies.
        </p>
        <div className="space-y-2 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <span>📅</span>
            <span>March 15, 2026</span>
          </div>
          <div className="flex items-center gap-2">
            <span>📍</span>
            <span>Online Event</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-3">
        <Button variant="default" size="sm" className="flex-1">Register</Button>
        <Button variant="default" size="sm" className="flex-1">Learn More</Button>
      </CardFooter>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: "Card with footer section containing action buttons. Use CardFooter for CTAs and interactive elements.",
      },
    },
  },
};

/**
 * Card with only title (no description) and content.
 * Simplified layout when subtitle context isn't needed.
 */
export const TitleOnly: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Upcoming Events</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm">Web Dev Workshop</span>
            <span className="text-xs text-gray-400">Mar 15</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Design Systems Talk</span>
            <span className="text-xs text-gray-400">Mar 22</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Hackathon 2026</span>
            <span className="text-xs text-gray-400">Apr 5</span>
          </div>
        </div>
      </CardContent>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: "Card without CardDescription. Great for simple lists or when context is clear from the title alone.",
      },
    },
  },
};

/**
 * Minimal card with just content, no header or footer.
 * Perfect for simple content blocks or widgets.
 */
export const ContentOnly: Story = {
  render: () => (
    <Card className="w-80">
      <CardContent>
        <p className="text-sm text-gray-300 text-center">
          "The best way to predict the future is to invent it."
        </p>
        <p className="text-xs text-gray-500 text-center mt-2">
          — Alan Kay
        </p>
      </CardContent>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: "Minimalist approach with only CardContent. Useful for quotes, stats, or simple widgets.",
      },
    },
  },
};

// ====================
// REAL-WORLD EXAMPLES
// ====================

/**
 * User profile card with avatar and statistics.
 * Common pattern for member directories and dashboards.
 */
export const UserProfile: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
            JD
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg">John Doe</CardTitle>
            <CardDescription>john.doe@example.com</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Events Attended</span>
            <span className="font-medium text-white">12</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Member Since</span>
            <span className="font-medium text-white">Jan 2025</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Role</span>
            <span className="font-medium text-white">Organizer</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="default" size="sm" className="w-full">
          View Profile
        </Button>
      </CardFooter>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: "Profile card with avatar, stats, and action button. Common in dashboards and member directories.",
      },
    },
  },
};

/**
 * Event card with image header and detailed information.
 * Perfect for event listings and promotional content.
 */
export const EventCard: Story = {
  render: () => (
    <Card className="w-80">
      <div className="h-40 bg-linear-to-br from-blue-500 to-purple-600 rounded-t-[28px] flex items-center justify-center">
        <span className="text-6xl">🚀</span>
      </div>
      <CardHeader>
        <CardTitle>Web Development Workshop</CardTitle>
        <CardDescription>Learn modern web technologies</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-gray-300">
            <span>🗓️</span>
            <span>March 15, 2026 at 2:00 PM</span>
          </div>
          <div className="flex items-center gap-2 text-gray-300">
            <span>👥</span>
            <span>45 attendees registered</span>
          </div>
          <div className="flex items-center gap-2 text-gray-300">
            <span>📍</span>
            <span>Virtual Event</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-3">
        <Button variant="default" size="sm" className="flex-1">
          Register
        </Button>
        <Button variant="default" size="sm">
          Share
        </Button>
      </CardFooter>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: "Event card with visual header. Note the image border-radius matches the card (28px) for seamless integration.",
      },
    },
  },
};

/**
 * Stats card displaying metrics and data.
 * Ideal for dashboards and analytics interfaces.
 */
export const StatsCard: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Community Growth</CardTitle>
        <CardDescription>Last 30 days</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-3xl font-bold text-blue-400">234</div>
            <div className="text-xs text-gray-400 mt-1">New Members</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-400">18</div>
            <div className="text-xs text-gray-400 mt-1">Events</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-purple-400">92%</div>
            <div className="text-xs text-gray-400 mt-1">Satisfaction</div>
          </div>
        </div>
      </CardContent>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: "Metrics card displaying key statistics. Perfect for dashboards and data visualization.",
      },
    },
  },
};

/**
 * Notification card with time-sensitive information.
 * Useful for alerts, updates, and announcements.
 */
export const NotificationCard: Story = {
  render: () => (
    <Card className="w-80">
      <CardContent>
        <div className="flex items-start gap-3">
          <div className="text-2xl">🔔</div>
          <div className="flex-1">
            <h4 className="font-semibold text-white mb-1">New Event Posted</h4>
            <p className="text-sm text-gray-300 mb-2">
              "Cloud Architecture Workshop" has been scheduled for next week
            </p>
            <p className="text-xs text-gray-500">2 hours ago</p>
          </div>
        </div>
      </CardContent>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: "Notification-style card with icon and timestamp. Great for activity feeds and alert systems.",
      },
    },
  },
};

// ====================
// LAYOUT EXAMPLES
// ====================

/**
 * Multiple cards in a grid layout.
 * Demonstrates how cards work together in responsive layouts.
 */
export const CardGrid: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Design</CardTitle>
          <CardDescription>UI/UX principles</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-300">
            Learn the fundamentals of user interface design and user experience.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Development</CardTitle>
          <CardDescription>Code & build</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-300">
            Master modern development tools, frameworks, and best practices.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Cloud</CardTitle>
          <CardDescription>Infrastructure</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-300">
            Explore cloud computing, deployment, and scalable architecture.
          </p>
        </CardContent>
      </Card>
    </div>
  ),
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        story: "Cards arranged in a responsive grid. They maintain consistent spacing and adapt to different screen sizes.",
      },
    },
  },
};

/**
 * Demonstration of card hover effects.
 * Shows the subtle hover interaction built into the card component.
 */
export const HoverEffect: Story = {
  render: () => (
    <div className="flex gap-4">
      <Card className="w-60">
        <CardHeader>
          <CardTitle className="text-lg">Hover Me</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-300">
            Notice the subtle background and border brightening on hover
          </p>
        </CardContent>
      </Card>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Hover over the card to see the built-in hover effect: background changes to rgba(255, 255, 255, 0.08) and border brightens to 90% white.",
      },
    },
  },
};

/**
 * Complete visual hierarchy showcasing all card compositions.
 * Comprehensive reference for all card patterns and use cases.
 */
export const CompleteHierarchy: Story = {
  render: () => (
    <div className="p-8 space-y-8 bg-gray-900">
      {/* Basic Cards */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">Basic Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Title Only</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-300">Simple card with title and content.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>With Description</CardTitle>
              <CardDescription>Includes subtitle</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-300">Card with descriptive subtitle.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>With Footer</CardTitle>
              <CardDescription>Includes actions</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-300">Card with action buttons.</p>
            </CardContent>
            <CardFooter>
              <Button variant="default" size="sm">Action</Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* Real-World Examples */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">Real-World Examples</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  JS
                </div>
                <div>
                  <CardTitle className="text-base">Jane Smith</CardTitle>
                  <CardDescription className="text-xs">Developer</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">Events</span>
                  <span className="text-white">8</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <div className="text-center py-2">
                <div className="text-4xl font-bold text-blue-400">127</div>
                <div className="text-sm text-gray-400 mt-1">Active Members</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <div className="flex items-center gap-2">
                <span className="text-xl">✅</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">Task Completed</p>
                  <p className="text-xs text-gray-400">5 minutes ago</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2 text-center text-xs">
                <div>
                  <div className="font-bold text-green-400">↑ 23%</div>
                  <div className="text-gray-400">Growth</div>
                </div>
                <div>
                  <div className="font-bold text-blue-400">156</div>
                  <div className="text-gray-400">Total</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Glassmorphism Showcase */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">Glassmorphism Effect</h2>
        <div 
          className="p-8 rounded-2xl relative bg-linear-[135deg,#667eea_0%,#764ba2_100%]"
        >
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Glassmorphism Card</CardTitle>
              <CardDescription>Semi-transparent with backdrop blur</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-300">
                The card has a semi-transparent background (5% white) with a 10px backdrop blur,
                creating the glassmorphism effect. Notice how it subtly shows the gradient behind.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  ),
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        story: "Comprehensive showcase of all card patterns, compositions, and real-world use cases in a single view.",
      },
    },
  },
};
