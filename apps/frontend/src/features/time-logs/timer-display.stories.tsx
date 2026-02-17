import type { Meta, StoryObj } from '@storybook/react';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@ui/card';
import { Button } from '@ui/button';
import { Play, Pause, RotateCcw } from 'lucide-react';

// Компонент отображения времени
function TimerDisplay({
  milliseconds = 0,
  size = 'default',
}: {
  milliseconds?: number;
  size?: 'small' | 'default' | 'large';
}) {
  const hours = Math.floor(milliseconds / 3600000);
  const minutes = Math.floor((milliseconds % 3600000) / 60000);
  const seconds = Math.floor((milliseconds % 60000) / 1000);

  const sizeClasses = {
    small: 'text-base',
    default: 'text-xl',
    large: 'text-4xl',
  };

  return (
    <div className={`font-mono ${sizeClasses[size]}`}>
      {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
    </div>
  );
}

const meta = {
  title: 'Features/TimeLogs/TimerDisplay',
  component: TimerDisplay,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof TimerDisplay>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Zero: Story = {
  args: {
    milliseconds: 0,
  },
};

export const OneMinute: Story = {
  args: {
    milliseconds: 60000, // 1 минута
  },
};

export const OneHour: Story = {
  args: {
    milliseconds: 3600000, // 1 час
  },
};

export const WorkDay: Story = {
  args: {
    milliseconds: 28800000, // 8 часов
  },
};

export const SmallSize: Story = {
  args: {
    milliseconds: 7200000, // 2 часа
    size: 'small',
  },
};

export const LargeSize: Story = {
  args: {
    milliseconds: 7200000, // 2 часа
    size: 'large',
  },
};

export const LiveTimer: Story = {
  render: () => {
    const [isRunning, setIsRunning] = useState(false);
    const [milliseconds, setMilliseconds] = useState(0);

    useEffect(() => {
      let interval: NodeJS.Timeout;
      if (isRunning) {
        interval = setInterval(() => {
          setMilliseconds((ms) => ms + 100);
        }, 100);
      }
      return () => clearInterval(interval);
    }, [isRunning]);

    return (
      <div className="space-y-4">
        <TimerDisplay milliseconds={milliseconds} size="large" />
        <div className="flex gap-2">
          <Button onClick={() => setIsRunning(!isRunning)}>
            {isRunning ? <Pause className="mr-2" /> : <Play className="mr-2" />}
            {isRunning ? 'Пауза' : 'Старт'}
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setIsRunning(false);
              setMilliseconds(0);
            }}
          >
            <RotateCcw className="mr-2" />
            Сброс
          </Button>
        </div>
      </div>
    );
  },
};

export const InTaskCard: Story = {
  render: () => {
    const [time, setTime] = useState(14400000); // 4 часа

    return (
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Разработка веб-приложения</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Затрачено времени</span>
            <TimerDisplay milliseconds={time} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Ставка</span>
            <span className="font-semibold">₽2000/час</span>
          </div>
          <div className="flex items-center justify-between border-t pt-4">
            <span className="font-medium">Итого</span>
            <span className="font-semibold text-lg">₽8,000</span>
          </div>
        </CardContent>
      </Card>
    );
  },
};

export const MultipleTimers: Story = {
  render: () => {
    const tasks = [
      { name: 'Разработка API', time: 14400000 }, // 4 часа
      { name: 'Code Review', time: 5400000 }, // 1.5 часа
      { name: 'Тестирование', time: 7200000 }, // 2 часа
      { name: 'Документация', time: 3600000 }, // 1 час
    ];

    const totalTime = tasks.reduce((sum, task) => sum + task.time, 0);

    return (
      <div className="w-[500px] space-y-4">
        <div className="space-y-2">
          {tasks.map((task, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 border rounded"
            >
              <span className="font-medium">{task.name}</span>
              <TimerDisplay milliseconds={task.time} size="small" />
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between p-4 border-2 border-primary rounded-lg bg-primary/5">
          <span className="font-semibold">Всего</span>
          <TimerDisplay milliseconds={totalTime} />
        </div>
      </div>
    );
  },
};

export const DifferentFormats: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <h4 className="font-medium">Маленький размер</h4>
        <TimerDisplay milliseconds={7323000} size="small" />
      </div>
      <div className="space-y-2">
        <h4 className="font-medium">Обычный размер</h4>
        <TimerDisplay milliseconds={7323000} size="default" />
      </div>
      <div className="space-y-2">
        <h4 className="font-medium">Большой размер</h4>
        <TimerDisplay milliseconds={7323000} size="large" />
      </div>
    </div>
  ),
};
