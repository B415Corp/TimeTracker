import type { Meta, StoryObj } from '@storybook/react';
import TaskCardMain from './task-card-main.root';
import { PAYMENT } from '@/shared/interfaces/task.interface';
import { MemoryRouter } from 'react-router-dom';

const meta = {
  title: 'Features/Tasks/TaskCardMain',
  component: TaskCardMain.Root,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
} satisfies Meta<typeof TaskCardMain.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockTask = {
  project_id: 'proj-1',
  task_id: 'task-1',
  name: 'Разработка API для пользователей',
  symbol: '₽',
  rate: 2000,
  payment_type: PAYMENT.HOURLY,
};

const mockFixedTask = {
  project_id: 'proj-2',
  task_id: 'task-2',
  name: 'Дизайн главной страницы',
  symbol: '$',
  rate: 500,
  payment_type: PAYMENT.FIXED,
};

export const Default: Story = {
  render: () => (
    <TaskCardMain.Root {...mockTask}>
      <TaskCardMain.Header />
      <TaskCardMain.Body />
      <TaskCardMain.Footer />
    </TaskCardMain.Root>
  ),
};

export const FixedPayment: Story = {
  render: () => (
    <TaskCardMain.Root {...mockFixedTask}>
      <TaskCardMain.Header />
      <TaskCardMain.Body />
      <TaskCardMain.Footer />
    </TaskCardMain.Root>
  ),
};

export const WithoutFooter: Story = {
  render: () => (
    <TaskCardMain.Root {...mockTask}>
      <TaskCardMain.Header />
      <TaskCardMain.Body />
    </TaskCardMain.Root>
  ),
};

export const LongTaskName: Story = {
  render: () => (
    <TaskCardMain.Root
      {...mockTask}
      name="Разработка сложной многоуровневой системы аутентификации с поддержкой OAuth2, JWT токенов и двухфакторной аутентификации"
    >
      <TaskCardMain.Header />
      <TaskCardMain.Body />
      <TaskCardMain.Footer />
    </TaskCardMain.Root>
  ),
};

export const MultipleCards: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <TaskCardMain.Root {...mockTask}>
        <TaskCardMain.Header />
        <TaskCardMain.Body />
        <TaskCardMain.Footer />
      </TaskCardMain.Root>
      
      <TaskCardMain.Root {...mockFixedTask}>
        <TaskCardMain.Header />
        <TaskCardMain.Body />
        <TaskCardMain.Footer />
      </TaskCardMain.Root>
      
      <TaskCardMain.Root
        project_id="proj-3"
        task_id="task-3"
        name="Тестирование приложения"
        symbol="€"
        rate={1500}
        payment_type={PAYMENT.HOURLY}
      >
        <TaskCardMain.Header />
        <TaskCardMain.Body />
        <TaskCardMain.Footer />
      </TaskCardMain.Root>
      
      <TaskCardMain.Root
        project_id="proj-4"
        task_id="task-4"
        name="Написание документации"
        symbol="₽"
        rate={50000}
        payment_type={PAYMENT.FIXED}
      >
        <TaskCardMain.Header />
        <TaskCardMain.Body />
        <TaskCardMain.Footer />
      </TaskCardMain.Root>
    </div>
  ),
};

export const DifferentCurrencies: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <TaskCardMain.Root
        {...mockTask}
        symbol="₽"
        rate={2000}
        name="Задача в рублях"
      >
        <TaskCardMain.Header />
        <TaskCardMain.Body />
        <TaskCardMain.Footer />
      </TaskCardMain.Root>
      
      <TaskCardMain.Root
        {...mockTask}
        task_id="task-usd"
        symbol="$"
        rate={50}
        name="Задача в долларах"
      >
        <TaskCardMain.Header />
        <TaskCardMain.Body />
        <TaskCardMain.Footer />
      </TaskCardMain.Root>
      
      <TaskCardMain.Root
        {...mockTask}
        task_id="task-eur"
        symbol="€"
        rate={45}
        name="Задача в евро"
      >
        <TaskCardMain.Header />
        <TaskCardMain.Body />
        <TaskCardMain.Footer />
      </TaskCardMain.Root>
    </div>
  ),
};
