import type { Meta, StoryObj } from '@storybook/react';
import PaymentType from './payment-type';
import { PAYMENT } from '@/shared/interfaces/task.interface';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Badge } from './badge';

const meta = {
  title: 'Shared/PaymentType',
  component: PaymentType,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof PaymentType>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FixedMedium: Story = {
  args: {
    type: PAYMENT.FIXED,
    varian: 'md',
  },
};

export const FixedSmall: Story = {
  args: {
    type: PAYMENT.FIXED,
    varian: 'sm',
  },
};

export const HourlyMedium: Story = {
  args: {
    type: PAYMENT.HOURLY,
    varian: 'md',
  },
};

export const HourlySmall: Story = {
  args: {
    type: PAYMENT.HOURLY,
    varian: 'sm',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4 w-[400px]">
      <div className="space-y-2">
        <h4 className="font-medium">Medium Size</h4>
        <div className="flex gap-4">
          <Badge variant="outline">
            <PaymentType type={PAYMENT.FIXED} varian="md" />
          </Badge>
          <Badge variant="outline">
            <PaymentType type={PAYMENT.HOURLY} varian="md" />
          </Badge>
        </div>
      </div>
      <div className="space-y-2">
        <h4 className="font-medium">Small Size</h4>
        <div className="flex gap-4">
          <Badge variant="secondary">
            <PaymentType type={PAYMENT.FIXED} varian="sm" />
          </Badge>
          <Badge variant="secondary">
            <PaymentType type={PAYMENT.HOURLY} varian="sm" />
          </Badge>
        </div>
      </div>
    </div>
  ),
};

export const InTaskCard: Story = {
  render: () => (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>Разработка веб-приложения</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Тип оплаты</span>
          <Badge variant="outline">
            <PaymentType type={PAYMENT.HOURLY} varian="md" />
          </Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Ставка</span>
          <span className="font-semibold">1500 ₽/час</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Время</span>
          <span>25 часов</span>
        </div>
      </CardContent>
    </Card>
  ),
};

export const InTaskList: Story = {
  render: () => (
    <div className="w-[600px] space-y-2">
      <div className="flex items-center justify-between p-3 border rounded hover:bg-muted/50">
        <div className="flex-1">
          <h4 className="font-medium">Дизайн UI/UX</h4>
          <p className="text-sm text-muted-foreground">Срок: 2 недели</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="secondary">
            <PaymentType type={PAYMENT.FIXED} varian="sm" />
          </Badge>
          <span className="font-semibold">50,000 ₽</span>
        </div>
      </div>
      <div className="flex items-center justify-between p-3 border rounded hover:bg-muted/50">
        <div className="flex-1">
          <h4 className="font-medium">Backend разработка</h4>
          <p className="text-sm text-muted-foreground">Срок: 1 месяц</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="secondary">
            <PaymentType type={PAYMENT.HOURLY} varian="sm" />
          </Badge>
          <span className="font-semibold">2000 ₽/ч</span>
        </div>
      </div>
      <div className="flex items-center justify-between p-3 border rounded hover:bg-muted/50">
        <div className="flex-1">
          <h4 className="font-medium">Тестирование</h4>
          <p className="text-sm text-muted-foreground">Срок: 1 неделя</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="secondary">
            <PaymentType type={PAYMENT.FIXED} varian="sm" />
          </Badge>
          <span className="font-semibold">25,000 ₽</span>
        </div>
      </div>
    </div>
  ),
};
