import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@ui/button';
import { Play, Pause, LoaderCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@ui/tooltip';
import { useState } from 'react';

// Упрощенный компонент кнопки таймера для демонстрации
function TimerButton({
  isPlaying = false,
  isLoading = false,
  isActive = false,
  variant = 'button',
  onToggle,
}: {
  isPlaying?: boolean;
  isLoading?: boolean;
  isActive?: boolean;
  variant?: 'button' | 'icon';
  onToggle?: () => void;
}) {
  return (
    <div className="relative">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="outline"
              className={`${!isPlaying ? 'text-emerald-400' : 'text-orange-400'} ${variant === 'icon' && 'size-6'} active:scale-90 duration-150 ${isActive ? 'pointer-events-none grayscale-100' : ''}`}
              onClick={onToggle}
            >
              {isLoading ? (
                <LoaderCircle className={`animate-spin ${variant === 'icon' && 'size-3'}`} />
              ) : !isPlaying ? (
                <Play className={`${variant === 'icon' && 'size-3'}`} />
              ) : (
                <Pause className={`animate-pulse ${variant === 'icon' && 'size-3'}`} />
              )}
            </Button>
          </TooltipTrigger>
          {isActive && (
            <TooltipContent>
              <p>Эта задача уже выполняется другим пользователем</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
      {isActive && (
        <div className="absolute -bottom-0.5 -right-0.5 bg-rose-400 size-2.5 rounded-full" />
      )}
    </div>
  );
}

const meta = {
  title: 'Features/TimeLogs/TimerButton',
  component: TimerButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof TimerButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Stopped: Story = {
  args: {
    isPlaying: false,
    isLoading: false,
  },
};

export const Playing: Story = {
  args: {
    isPlaying: true,
    isLoading: false,
  },
};

export const Loading: Story = {
  args: {
    isLoading: true,
  },
};

export const ActiveByOtherUser: Story = {
  args: {
    isPlaying: false,
    isActive: true,
  },
};

export const SmallVariant: Story = {
  args: {
    isPlaying: false,
    variant: 'icon',
  },
};

export const SmallPlaying: Story = {
  args: {
    isPlaying: true,
    variant: 'icon',
  },
};

export const Interactive: Story = {
  render: () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleToggle = () => {
      setIsLoading(true);
      setTimeout(() => {
        setIsPlaying(!isPlaying);
        setIsLoading(false);
      }, 500);
    };

    return (
      <div className="space-y-4">
        <TimerButton
          isPlaying={isPlaying}
          isLoading={isLoading}
          onToggle={handleToggle}
        />
        <p className="text-sm text-muted-foreground">
          Статус: {isLoading ? 'Загрузка...' : isPlaying ? 'Работает' : 'Остановлен'}
        </p>
      </div>
    );
  },
};

export const WithTimer: Story = {
  render: () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [seconds, setSeconds] = useState(0);

    const handleToggle = () => {
      setIsPlaying(!isPlaying);
    };

    // Простой таймер
    useState(() => {
      const interval = setInterval(() => {
        if (isPlaying) {
          setSeconds((s) => s + 1);
        }
      }, 1000);
      return () => clearInterval(interval);
    });

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return (
      <div className="flex items-center gap-4">
        <TimerButton isPlaying={isPlaying} onToggle={handleToggle} />
        <div className="text-xl font-mono">
          {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(secs).padStart(2, '0')}
        </div>
      </div>
    );
  },
};

export const InTaskCard: Story = {
  render: () => {
    const [isPlaying, setIsPlaying] = useState(false);

    return (
      <div className="w-[400px] border rounded-lg p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Разработка API</h3>
          <TimerButton
            isPlaying={isPlaying}
            variant="icon"
            onToggle={() => setIsPlaying(!isPlaying)}
          />
        </div>
        <p className="text-sm text-muted-foreground">
          Создание REST API для управления пользователями
        </p>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Ставка</span>
          <span className="font-semibold">₽2000/час</span>
        </div>
      </div>
    );
  },
};

export const MultipleTimers: Story = {
  render: () => {
    const [timers, setTimers] = useState([
      { id: 1, name: 'Разработка API', isPlaying: true },
      { id: 2, name: 'Code Review', isPlaying: false },
      { id: 3, name: 'Тестирование', isPlaying: false },
      { id: 4, name: 'Документация', isPlaying: false },
    ]);

    const toggleTimer = (id: number) => {
      setTimers((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, isPlaying: !t.isPlaying } : t
        )
      );
    };

    return (
      <div className="w-[500px] space-y-2">
        {timers.map((timer) => (
          <div
            key={timer.id}
            className="flex items-center justify-between p-3 border rounded hover:bg-muted/50"
          >
            <span className="font-medium">{timer.name}</span>
            <TimerButton
              isPlaying={timer.isPlaying}
              variant="icon"
              onToggle={() => toggleTimer(timer.id)}
            />
          </div>
        ))}
      </div>
    );
  },
};
