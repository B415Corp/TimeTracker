import type { Meta, StoryObj } from '@storybook/react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
} from './card';
import { Button } from './button';
import { MoreVertical } from 'lucide-react';

const meta = {
  title: 'UI/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description goes here</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This is the card content area where you can place any content.</p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          Action
        </Button>
      </CardFooter>
    </Card>
  ),
};

export const WithAction: Story = {
  render: () => (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>Project Status</CardTitle>
        <CardDescription>Current project metrics and information</CardDescription>
        <CardAction>
          <Button variant="ghost" size="icon">
            <MoreVertical />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Tasks Completed</span>
            <span className="font-semibold">24/30</span>
          </div>
          <div className="flex justify-between">
            <span>Time Logged</span>
            <span className="font-semibold">48h 30m</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <Button variant="outline" className="flex-1">
          Cancel
        </Button>
        <Button className="flex-1">View Details</Button>
      </CardFooter>
    </Card>
  ),
};

export const Simple: Story = {
  render: () => (
    <Card className="w-[350px] p-6">
      <h3 className="text-lg font-semibold">Simple Card</h3>
      <p className="text-sm text-muted-foreground mt-2">
        This is a simple card without using the subcomponents.
      </p>
    </Card>
  ),
};

export const ContentOnly: Story = {
  render: () => (
    <Card className="w-[400px]">
      <CardContent>
        <p>This card only has content, no header or footer.</p>
      </CardContent>
    </Card>
  ),
};

export const MultipleCards: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4 w-[800px]">
      <Card>
        <CardHeader>
          <CardTitle>Card 1</CardTitle>
          <CardDescription>First card description</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Content for the first card</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Card 2</CardTitle>
          <CardDescription>Second card description</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Content for the second card</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Card 3</CardTitle>
          <CardDescription>Third card description</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Content for the third card</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Card 4</CardTitle>
          <CardDescription>Fourth card description</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Content for the fourth card</p>
        </CardContent>
      </Card>
    </div>
  ),
};
