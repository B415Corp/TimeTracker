import { ROUTES } from "@/app/router/routes.enum";
import { useGetTasksByProjectQuery } from "@/shared/api/task.service";
import {
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@ui/sidebar";
import { CheckSquare, List, Loader2 } from "lucide-react";
import { Link } from "react-router";

interface RecentItemsListProps {
  projectId: string;
}

export default function RecentItemsList({ projectId }: RecentItemsListProps) {
  const { data: tasks, isLoading: isLoadingTasks } = useGetTasksByProjectQuery(
    projectId,
    { skip: !projectId },
  );

  if (!projectId) {
    return null;
  }

  const recentTasks = tasks?.slice(0, 5) || [];

  if (isLoadingTasks) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton disabled>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Загрузка задач...</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  if (recentTasks.length === 0) {
    return null;
  }

  return (
    <SidebarMenuSub>
      <SidebarMenuSubItem>
        <SidebarMenuButton>
          <Link
            className="flex items-center gap-2 w-full"
            to={`/${ROUTES.PROJECTS}/${projectId}`}
          >
            <List className="h-4 w-4" />
            <span>Все задачи</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuSubItem>

      <SidebarMenuSubItem>
        <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">
          Последние задачи
        </div>
      </SidebarMenuSubItem>

      {recentTasks.map((task) => (
        <SidebarMenuItem key={task.task_id}>
          <SidebarMenuButton>
            <Link
              to={`/${ROUTES.TASKS}/${task.task_id}`}
              className="flex items-center gap-2 w-full"
            >
              <CheckSquare className="h-4 w-4" />
              {task.name}
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenuSub>
  );
}
