import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Tabs, TabsList, TabsTrigger, TabsContent, Card } from "@packages/spark-ui";

const meta = {
  title: "Components/Tabs",
  component: Tabs,
  tags: ["autodocs"],
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: <></>,
  },
  render: () => (
    <Tabs defaultValue="tab1">
      <TabsList>
        <TabsTrigger value="tab1">Overview</TabsTrigger>
        <TabsTrigger value="tab2">Details</TabsTrigger>
        <TabsTrigger value="tab3">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">
        <p>Overview content goes here.</p>
      </TabsContent>
      <TabsContent value="tab2">
        <p>Details content goes here.</p>
      </TabsContent>
      <TabsContent value="tab3">
        <p>Settings content goes here.</p>
      </TabsContent>
    </Tabs>
  ),
};

export const Pills: Story = {
  args: {
    children: <></>,
  },
  render: () => (
    <Tabs defaultValue="account">
      <TabsList variant="pills">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <Card className="p-6">
          <h3 className="font-semibold mb-2">Account Settings</h3>
          <p className="text-sm text-muted-foreground">
            Manage your account settings and preferences.
          </p>
        </Card>
      </TabsContent>
      <TabsContent value="password">
        <Card className="p-6">
          <h3 className="font-semibold mb-2">Password</h3>
          <p className="text-sm text-muted-foreground">
            Change your password and security settings.
          </p>
        </Card>
      </TabsContent>
      <TabsContent value="notifications">
        <Card className="p-6">
          <h3 className="font-semibold mb-2">Notifications</h3>
          <p className="text-sm text-muted-foreground">
            Configure how you receive notifications.
          </p>
        </Card>
      </TabsContent>
    </Tabs>
  ),
};

export const WithCards: Story = {
  args: {
    children: <></>,
  },
  render: () => (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="reports">Reports</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">Dashboard Overview</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 border border-border rounded-md">
              <p className="text-sm text-muted-foreground">Total Users</p>
              <p className="text-2xl font-bold">1,234</p>
            </div>
            <div className="p-4 border border-border rounded-md">
              <p className="text-sm text-muted-foreground">Active</p>
              <p className="text-2xl font-bold">892</p>
            </div>
            <div className="p-4 border border-border rounded-md">
              <p className="text-sm text-muted-foreground">New Today</p>
              <p className="text-2xl font-bold">43</p>
            </div>
          </div>
        </Card>
      </TabsContent>
      <TabsContent value="analytics">
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">Analytics Data</h2>
          <p className="text-muted-foreground">
            View detailed analytics and insights about your application.
          </p>
        </Card>
      </TabsContent>
      <TabsContent value="reports">
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">Reports</h2>
          <p className="text-muted-foreground">
            Generate and download various reports.
          </p>
        </Card>
      </TabsContent>
    </Tabs>
  ),
};

export const DisabledTab: Story = {
  args: {
    children: <></>,
  },
  render: () => (
    <Tabs defaultValue="available">
      <TabsList>
        <TabsTrigger value="available">Available</TabsTrigger>
        <TabsTrigger value="unavailable" disabled>
          Unavailable
        </TabsTrigger>
        <TabsTrigger value="coming-soon" disabled>
          Coming Soon
        </TabsTrigger>
      </TabsList>
      <TabsContent value="available">
        <p>This content is available.</p>
      </TabsContent>
      <TabsContent value="unavailable">
        <p>This content is unavailable.</p>
      </TabsContent>
      <TabsContent value="coming-soon">
        <p>This content is coming soon.</p>
      </TabsContent>
    </Tabs>
  ),
};
