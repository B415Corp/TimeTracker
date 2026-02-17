import type { Meta, StoryObj } from '@storybook/react';
import { AdvantageCard } from './advantage-card';

const meta = {
  title: 'Shared/AdvantageCard',
  component: AdvantageCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof AdvantageCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Fast Performance',
    description: 'Lightning-fast load times and smooth interactions.',
  },
};

export const LongDescription: Story = {
  args: {
    title: 'Secure by Default',
    description: 'Built with security in mind from the ground up. All data is encrypted at rest and in transit, with regular security audits and updates.',
  },
};

export const ShortContent: Story = {
  args: {
    title: 'Easy to Use',
    description: 'Simple and intuitive.',
  },
};

export const FeatureShowcase: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl">
      <AdvantageCard
        title="Real-time Collaboration"
        description="Work together with your team in real-time. See changes as they happen and stay in sync."
      />
      <AdvantageCard
        title="Cloud Storage"
        description="All your documents are safely stored in the cloud and accessible from anywhere."
      />
      <AdvantageCard
        title="Version History"
        description="Never lose your work. Access previous versions and restore them at any time."
      />
      <AdvantageCard
        title="Custom Fields"
        description="Add any custom fields you need to track information specific to your workflow."
      />
      <AdvantageCard
        title="Rich Formatting"
        description="Create beautiful documents with headings, lists, code blocks, and more."
      />
      <AdvantageCard
        title="Integrations"
        description="Connect with your favorite tools and automate your workflow."
      />
    </div>
  ),
};

export const TwoColumnLayout: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4 max-w-4xl">
      <AdvantageCard
        title="Time Tracking"
        description="Track time spent on tasks and projects with built-in timers and manual entry options."
      />
      <AdvantageCard
        title="Reporting"
        description="Generate detailed reports to analyze productivity and project progress."
      />
    </div>
  ),
};
