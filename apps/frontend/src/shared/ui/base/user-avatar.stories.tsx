import type { Meta, StoryObj } from '@storybook/react';
import { Avatar, AvatarFallback, AvatarImage } from '@ui/avatar';
import { Badge } from '@ui/badge';

// Упрощенный компонент User Avatar для демонстрации
function UserAvatar({
  name = 'John Doe',
  email,
  size = 'default',
  imageUrl,
  badge,
}: {
  name?: string;
  email?: string;
  size?: 'xs' | 'sm' | 'default' | 'lg';
  imageUrl?: string;
  badge?: string;
}) {
  const sizeClasses = {
    xs: 'size-6',
    sm: 'size-8',
    default: 'size-10',
    lg: 'size-12',
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <Avatar className={sizeClasses[size]}>
          {imageUrl && <AvatarImage src={imageUrl} alt={name} />}
          <AvatarFallback>{getInitials(name)}</AvatarFallback>
        </Avatar>
        {badge && (
          <Badge
            variant="secondary"
            className="absolute -bottom-1 -right-1 h-5 px-1 text-xs"
          >
            {badge}
          </Badge>
        )}
      </div>
      {email && (
        <div className="flex flex-col">
          <span className="text-sm font-medium">{name}</span>
          <span className="text-xs text-muted-foreground">{email}</span>
        </div>
      )}
    </div>
  );
}

const meta = {
  title: 'Shared/UserAvatar',
  component: UserAvatar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof UserAvatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: 'Иван Петров',
  },
};

export const WithEmail: Story = {
  args: {
    name: 'Мария Иванова',
    email: 'maria@example.com',
  },
};

export const WithImage: Story = {
  args: {
    name: 'Алексей Смирнов',
    imageUrl: 'https://github.com/shadcn.png',
  },
};

export const WithBadge: Story = {
  args: {
    name: 'Анна Кузнецова',
    badge: 'PRO',
  },
};

export const SmallSize: Story = {
  args: {
    name: 'Петр Сидоров',
    size: 'sm',
  },
};

export const ExtraSmall: Story = {
  args: {
    name: 'Ольга Попова',
    size: 'xs',
  },
};

export const LargeSize: Story = {
  args: {
    name: 'Дмитрий Васильев',
    size: 'lg',
    email: 'dmitry@example.com',
  },
};

export const UserList: Story = {
  render: () => {
    const users = [
      { name: 'Иван Петров', email: 'ivan@example.com', badge: 'Admin' },
      { name: 'Мария Иванова', email: 'maria@example.com', badge: 'Pro' },
      { name: 'Алексей Смирнов', email: 'alexey@example.com' },
      { name: 'Анна Кузнецова', email: 'anna@example.com' },
      { name: 'Петр Сидоров', email: 'petr@example.com' },
    ];

    return (
      <div className="w-[400px] space-y-3">
        {users.map((user, index) => (
          <div
            key={index}
            className="p-3 border rounded hover:bg-muted/50 transition-colors"
          >
            <UserAvatar
              name={user.name}
              email={user.email}
              badge={user.badge}
            />
          </div>
        ))}
      </div>
    );
  },
};

export const TeamMembers: Story = {
  render: () => (
    <div className="w-[500px] space-y-4">
      <h3 className="font-semibold">Команда проекта</h3>
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 border rounded text-center">
          <UserAvatar name="Иван Петров" size="lg" badge="Lead" />
          <p className="mt-2 text-sm font-medium">Team Lead</p>
        </div>
        <div className="p-4 border rounded text-center">
          <UserAvatar name="Мария Иванова" size="lg" badge="Dev" />
          <p className="mt-2 text-sm font-medium">Senior Dev</p>
        </div>
        <div className="p-4 border rounded text-center">
          <UserAvatar name="Алексей Смирнов" size="lg" badge="Dev" />
          <p className="mt-2 text-sm font-medium">Middle Dev</p>
        </div>
        <div className="p-4 border rounded text-center">
          <UserAvatar name="Анна Кузнецова" size="lg" badge="QA" />
          <p className="mt-2 text-sm font-medium">QA Engineer</p>
        </div>
      </div>
    </div>
  ),
};

export const SizeComparison: Story = {
  render: () => (
    <div className="flex items-end gap-6">
      <div className="flex flex-col items-center gap-2">
        <UserAvatar name="XS" size="xs" />
        <span className="text-xs text-muted-foreground">Extra Small</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <UserAvatar name="SM" size="sm" />
        <span className="text-xs text-muted-foreground">Small</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <UserAvatar name="MD" size="default" />
        <span className="text-xs text-muted-foreground">Default</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <UserAvatar name="LG" size="lg" />
        <span className="text-xs text-muted-foreground">Large</span>
      </div>
    </div>
  ),
};

export const InComment: Story = {
  render: () => (
    <div className="w-[500px] border rounded-lg p-4">
      <div className="flex gap-3">
        <UserAvatar name="Мария Иванова" size="sm" />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-sm">Мария Иванова</span>
            <span className="text-xs text-muted-foreground">2 часа назад</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Отличная работа! Код выглядит чисто и соответствует всем требованиям.
            Можем мержить в main.
          </p>
        </div>
      </div>
    </div>
  ),
};
