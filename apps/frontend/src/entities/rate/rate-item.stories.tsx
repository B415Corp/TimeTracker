import type { Meta, StoryObj } from '@storybook/react';
import { RateItem } from './rate-item';
import { Card, CardContent, CardHeader, CardTitle } from '@ui/card';

const meta = {
  title: 'Entities/RateItem',
  component: RateItem,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof RateItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: '₽2000',
  },
};

export const DollarRate: Story = {
  args: {
    value: '$50/час',
  },
};

export const EuroRate: Story = {
  args: {
    value: '€45/час',
  },
};

export const FixedRate: Story = {
  args: {
    value: '₽50000',
  },
};

export const LargeAmount: Story = {
  args: {
    value: '$10,000',
  },
};

export const InTaskCard: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Разработка веб-приложения</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Ставка</span>
            <RateItem value="₽2000/час" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Затрачено</span>
            <span className="text-sm">25 часов</span>
          </div>
          <div className="flex items-center justify-between border-t pt-2">
            <span className="text-sm font-medium">Итого</span>
            <RateItem value="₽50,000" />
          </div>
        </div>
      </CardContent>
    </Card>
  ),
};

export const ComparisonList: Story = {
  render: () => (
    <div className="w-[400px] space-y-2">
      <div className="flex items-center justify-between p-3 border rounded">
        <span>Junior разработчик</span>
        <RateItem value="₽1500/час" />
      </div>
      <div className="flex items-center justify-between p-3 border rounded">
        <span>Middle разработчик</span>
        <RateItem value="₽2500/час" />
      </div>
      <div className="flex items-center justify-between p-3 border rounded">
        <span>Senior разработчик</span>
        <RateItem value="₽4000/час" />
      </div>
      <div className="flex items-center justify-between p-3 border rounded">
        <span>Tech Lead</span>
        <RateItem value="₽6000/час" />
      </div>
    </div>
  ),
};

export const DifferentFormats: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <h4 className="font-medium">Почасовая оплата</h4>
        <div className="flex gap-4">
          <RateItem value="₽2000/ч" />
          <RateItem value="$50/hour" />
          <RateItem value="€45/hr" />
        </div>
      </div>
      <div className="space-y-2">
        <h4 className="font-medium">Фиксированная ставка</h4>
        <div className="flex gap-4">
          <RateItem value="₽50,000" />
          <RateItem value="$1,200" />
          <RateItem value="€1,000" />
        </div>
      </div>
    </div>
  ),
};
