import { ROUTES } from "@/app/router/routes.enum";
import { Button } from "@ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@ui/card";
import { useSearcV2Query } from "@/shared/api/search.service";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdvantageCard } from "@/shared/ui/advantage-card";
import TaskCardMain from "@/features/tasks/task-cards/task-card-main.root";
import { ClientItem } from "@/entities/client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/select";
import { useGetProjectsMeQuery } from "@/shared/api/projects.service";
import CreateTaskForm from "@/features/tasks/forms/create-task.form";
import { Task } from "@/shared/interfaces/task.interface";

const TASK_ADVANTAGES = [
  {
    title: "Быстрый старт",
    description:
      "Создайте первую задачу и начните эффективно управлять своими проектами.",
  },
  {
    title: "Удобная организация",
    description:
      "Группируйте задачи, отслеживайте прогресс и повышайте продуктивность.",
  },
  {
    title: "Контроль сроков",
    description: "Следите за дедлайнами и не пропускайте важные этапы.",
  },
  {
    title: "Приоритеты",
    description:
      "Устанавливайте приоритеты для эффективного распределения ресурсов.",
  },
  {
    title: "Коллаборация",
    description: "Назначайте задачи участникам команды и работайте вместе.",
  },
  {
    title: "История изменений",
    description: "Отслеживайте все изменения и комментарии по задачам.",
  },
];

const PROJECT_ADVANTAGES = [
  {
    title: "Стартуйте новый проект",
    description:
      "Создайте проект для централизованного управления задачами и командой.",
  },
  {
    title: "Аналитика и контроль",
    description:
      "Получайте статистику по проектам и принимайте решения на основе данных.",
  },
  {
    title: "Гибкое управление",
    description: "Настраивайте этапы, статусы и роли под ваши бизнес-процессы.",
  },
  {
    title: "Совместная работа",
    description:
      "Приглашайте коллег, распределяйте задачи и достигайте целей вместе.",
  },
  {
    title: "История изменений",
    description:
      "Вся история изменений и активности по проекту всегда под рукой.",
  },
  {
    title: "Безопасность данных",
    description:
      "Ваши проекты и информация защищены и доступны только вашей команде.",
  },
];

type Advantage = { title: string; description: string };

function AdvantageGrid({ items }: { items: Advantage[] }) {
  return (
    <div className="col-span-full w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item, idx) => (
          <AdvantageCard 
            key={item.title + idx} 
            title={item.title} 
            description={item.description} 
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Feature-компонент: главная страница с бизнес-логикой, api, состоянием и UI
 */
export function HomePageFeature() {
  const navigate = useNavigate();
  const { data: projectsData } = useSearcV2Query({
    searchLocation: "projects",
  });
  const { data: tasksData } = useSearcV2Query({ searchLocation: "tasks" });

  // Состояние для модального окна создания задачи
  const [dialogOpen, setDialogOpen] = useState(false);
  // Выбранный проект
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");

  // Получаем список проектов пользователя
  const { data: myProjectsResponse } = useGetProjectsMeQuery({
    page: 1,
    limit: 100,
  });
  const myProjects = myProjectsResponse?.data || [];

  /**
   * Закрыть диалог и сбросить выбранный проект
   */
  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedProjectId("");
  };

  /**
   * После успешного создания задачи переходим на страницу задачи
   */
  const handleTaskCreated = (task: Task) => {
    if (!task?.task_id) {
      console.error("task_id is missing in created task", task);
      return;
    }
    handleDialogClose();
    navigate(`/${ROUTES.TASKS}/${task.task_id}`);
  };

  return (
    <div className="w-full h-full flex flex-col p-4">
      <div className="flex flex-wrap justify-between gap-2">
        <h1 className="text-2xl font-bold mb-4">Главная</h1>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-4">
        {/* <TodayWidget /> */}
        {/* <WeeklyStats /> */}
      </div>
      <div className="flex flex-col overflow-y-auto">
        <div className="flex flex-col gap-4 w-full pb-6 ">
          <div className="flex items-center gap-4 mb-2">
            <h2 className="text-xl">Последние задачи</h2>
            <Dialog
              open={dialogOpen}
              onOpenChange={(open) => setDialogOpen(open)}
            >
              <DialogTrigger asChild>
                <Button onClick={() => setDialogOpen(true)}>Создать</Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Создать новую задачу</DialogTitle>
                </DialogHeader>
                {/* Выбор проекта */}
                <div className="space-y-4">
                  <div>
                    <Select
                      value={selectedProjectId}
                      onValueChange={(val) => setSelectedProjectId(val)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Выберите проект" />
                      </SelectTrigger>
                      <SelectContent>
                        {myProjects?.map((project: any) => (
                          <SelectItem
                            key={project.project_id}
                            value={project.project_id}
                          >
                            {project.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {/* Форма создания задачи отображается только после выбора проекта */}
                  {selectedProjectId && (
                    <CreateTaskForm
                      key={selectedProjectId}
                      projectId={selectedProjectId}
                      onSuccess={handleTaskCreated}
                      onClose={handleDialogClose}
                    />
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="grid w-full gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {tasksData?.tasks?.length === 0 && (
              <AdvantageGrid items={TASK_ADVANTAGES} />
            )}
            {tasksData?.tasks?.map((el) => (
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
        <div className="flex flex-col gap-4 w-full pb-6">
          <div className="flex items-center gap-4 mb-2">
            <h2 className="text-xl">Последние проекты</h2>
            <Button onClick={() => navigate(`/${ROUTES.PROJECTS}`)}>
              Создать
            </Button>
          </div>
          <div className="grid w-full gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {projectsData?.projects?.length === 0 && (
              <AdvantageGrid items={PROJECT_ADVANTAGES} />
            )}
            {projectsData?.projects?.map((el) => (
              <Card key={el?.project_id} className="min-w-64 w-96 md:w-fit">
                <CardHeader>
                  <CardTitle>{el?.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ClientItem name={el?.client?.name || ""} />
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={() =>
                      navigate(`/${ROUTES.PROJECTS}/${el?.project_id}`)
                    }
                  >
                    Перейти
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
