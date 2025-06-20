import React from "react";
import {useGetTasksDueTodayQuery} from "@/shared/api/task.service";
import TaskCardMain from "@/features/tasks/task-cards/task-card-main.root";
import {Skeleton} from "@/shared/ui/skeleton";
import {Button} from "@ui/button";

/**
 * Виджет «Сегодня»: отображает задачи, у которых дед-лайн сегодня.
 */
export function TodayWidget() {
  const {data: tasks, isLoading, isError} = useGetTasksDueTodayQuery();

  if (isLoading) {
    return (
      <div className="flex gap-4 overflow-x-auto py-2">
        {Array.from({length: 3}).map((_, idx) => (
          <Skeleton key={idx} className="w-64 h-36" />
        ))}
      </div>
    );
  }

  if (isError || !tasks || tasks.length === 0) {
    return (
      <div className="flex flex-col gap-2 w-full pb-6">
        <div className="flex items-center gap-4 mb-2">
          <h2 className="text-xl">Сегодня</h2>
          <Button variant="secondary" size="sm">Создать задачу</Button>
        </div>
        <div className="text-muted-foreground text-sm">На сегодня задач нет 👍</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 w-full pb-6">
      <div className="flex items-center gap-4 mb-2">
        <h2 className="text-xl">Сегодня</h2>
        <Button variant="secondary" size="sm">Все задачи</Button>
      </div>
      <div className="w-full flex flex-wrap gap-4">
        {tasks.map((el) => (
          <TaskCardMain.Root
            key={el.task_id || el.name}
            project_id={el.project_id || ""}
            task_id={el.task_id || ""}
            name={el.name || ""}
            symbol={el.currency.symbol}
            rate={Number(el.rate) || 0}
            payment_type={el.payment_type}
          >
            <TaskCardMain.Header />
            <TaskCardMain.Body />
            <TaskCardMain.Footer />
          </TaskCardMain.Root>
        ))}
      </div>
    </div>
  );
} 