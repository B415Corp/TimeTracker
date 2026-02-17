import type { Meta, StoryObj } from '@storybook/react';
import SidebarSeparator from './sidebar-separator';

const meta = {
  title: 'Features/Sidebar/SidebarSeparator',
  component: SidebarSeparator,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SidebarSeparator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="w-[300px]">
      <SidebarSeparator />
    </div>
  ),
};

export const InSidebarContext: Story = {
  render: () => (
    <div className="w-[280px] bg-muted/30 p-4 rounded-lg border">
      <div className="space-y-1">
        <div className="px-3 py-2 hover:bg-accent rounded cursor-pointer">
          Главная
        </div>
        <div className="px-3 py-2 hover:bg-accent rounded cursor-pointer">
          Проекты
        </div>
        <div className="px-3 py-2 hover:bg-accent rounded cursor-pointer">
          Задачи
        </div>
      </div>
      
      <SidebarSeparator />
      
      <div className="space-y-1">
        <div className="px-3 py-2 hover:bg-accent rounded cursor-pointer">
          Документы
        </div>
        <div className="px-3 py-2 hover:bg-accent rounded cursor-pointer">
          Отчеты
        </div>
      </div>
      
      <SidebarSeparator />
      
      <div className="space-y-1">
        <div className="px-3 py-2 hover:bg-accent rounded cursor-pointer">
          Настройки
        </div>
        <div className="px-3 py-2 hover:bg-accent rounded cursor-pointer">
          Помощь
        </div>
      </div>
    </div>
  ),
};

export const MultipleSeparators: Story = {
  render: () => (
    <div className="w-[320px] space-y-0 border rounded-lg p-4">
      <h3 className="font-semibold mb-2">Навигация</h3>
      <SidebarSeparator />
      <p className="text-sm text-muted-foreground py-2">Основное</p>
      <SidebarSeparator />
      <div className="py-2">Контент...</div>
      <SidebarSeparator />
      <p className="text-sm text-muted-foreground py-2">Дополнительно</p>
      <SidebarSeparator />
      <div className="py-2">Еще контент...</div>
    </div>
  ),
};
