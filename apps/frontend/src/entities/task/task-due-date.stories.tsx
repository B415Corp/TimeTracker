import type { Meta, StoryObj } from '@storybook/react';
import { TaskDueDate } from './task-due-date';
import { Card, CardContent } from '@ui/card';
import { CalendarDays } from 'lucide-react';

const meta = {
  title: 'Entities/Task/TaskDueDate',
  component: TaskDueDate,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof TaskDueDate>;

export default meta;
type Story = StoryObj<typeof meta>;

// Создаем даты относительно текущей даты
const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
const twoDaysLater = new Date(today);
twoDaysLater.setDate(twoDaysLater.getDate() + 2);
const nextWeek = new Date(today);
nextWeek.setDate(nextWeek.getDate() + 7);
const lastWeek = new Date(today);
lastWeek.setDate(lastWeek.getDate() - 7);

export const OverdueTask: Story = {
  args: {
    endDate: yesterday.toISOString(),
  },
};

export const DueTomorrow: Story = {
  args: {
    endDate: tomorrow.toISOString(),
  },
};

export const DueInTwoDays: Story = {
  args: {
    endDate: twoDaysLater.toISOString(),
  },
};

export const DueNextWeek: Story = {
  args: {
    endDate: nextWeek.toISOString(),
  },
};

export const WithStartDate: Story = {
  args: {
    startDate: lastWeek.toISOString(),
    endDate: nextWeek.toISOString(),
  },
};

export const WithStartAndEndOverdue: Story = {
  args: {
    startDate: lastWeek.toISOString(),
    endDate: yesterday.toISOString(),
  },
};

export const OnlyFallback: Story = {
  args: {
    fallbackDate: lastWeek.toISOString(),
  },
};

export const InTaskCard: Story = {
  render: () => (
    <Card className="w-[400px]">
      <CardContent className="pt-6 space-y-4">
        <div>
          <h3 className="font-semibold mb-2">Разработка API</h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays className="w-4 h-4" />
            <TaskDueDate
              startDate={lastWeek.toISOString()}
              endDate={tomorrow.toISOString()}
            />
          </div>
        </div>
        
        <div>
          <h3 className="font-semibold mb-2">Code Review (просрочено)</h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays className="w-4 h-4" />
            <TaskDueDate endDate={yesterday.toISOString()} />
          </div>
        </div>
        
        <div>
          <h3 className="font-semibold mb-2">Тестирование</h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays className="w-4 h-4" />
            <TaskDueDate endDate={nextWeek.toISOString()} />
          </div>
        </div>
      </CardContent>
    </Card>
  ),
};

export const TaskListExample: Story = {
  render: () => {
    const tasks = [
      { name: 'Разработка API', start: lastWeek, end: yesterday, status: 'Просрочено' },
      { name: 'Code Review', start: new Date(), end: tomorrow, status: 'Срочно' },
      { name: 'Тестирование', start: new Date(), end: twoDaysLater, status: 'Срочно' },
      { name: 'Документация', start: new Date(), end: nextWeek, status: 'В работе' },
    ];

    return (
      <div className="w-[600px] space-y-2">
        {tasks.map((task, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 border rounded hover:bg-muted/50"
          >
            <div className="flex-1">
              <h4 className="font-medium">{task.name}</h4>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                <CalendarDays className="w-4 h-4" />
                <TaskDueDate
                  startDate={task.start.toISOString()}
                  endDate={task.end.toISOString()}
                />
              </div>
            </div>
            <span className="text-sm text-muted-foreground">{task.status}</span>
          </div>
        ))}
      </div>
    );
  },
};

export const ColorCoding: Story = {
  render: () => (
    <div className="space-y-4 w-[500px]">
      <div className="space-y-2">
        <h4 className="font-medium">Просроченные задачи (красный)</h4>
        <div className="p-3 border rounded">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4" />
            <TaskDueDate endDate={yesterday.toISOString()} />
            <span className="text-sm text-muted-foreground ml-auto">
              -1 день
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="font-medium">Срочные (≤3 дня, желтый)</h4>
        <div className="space-y-1">
          <div className="p-3 border rounded">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4" />
              <TaskDueDate endDate={tomorrow.toISOString()} />
              <span className="text-sm text-muted-foreground ml-auto">
                +1 день
              </span>
            </div>
          </div>
          <div className="p-3 border rounded">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4" />
              <TaskDueDate endDate={twoDaysLater.toISOString()} />
              <span className="text-sm text-muted-foreground ml-auto">
                +2 дня
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="font-medium">Обычные (>3 дня)</h4>
        <div className="p-3 border rounded">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4" />
            <TaskDueDate endDate={nextWeek.toISOString()} />
            <span className="text-sm text-muted-foreground ml-auto">
              +7 дней
            </span>
          </div>
        </div>
      </div>
    </div>
  ),
};
