import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/select";
import { Button } from "@ui/button";
import { useGetProjectsMeQuery } from "@/shared/api/projects.service";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@ui/dialog";
import CreateProjectForm from "./forms/create-project.form";
import { PanelTop } from "lucide-react";
import React, { useEffect, useState } from "react";
import { formatDate } from "@/lib/dateUtils";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/app/router/routes.enum";
import { UserAvatar } from "@ui/base/user-avatar";
import { PROJECT_ROLE } from "@/shared/enums";
import { useGetUserQuery } from "@/shared/api/user.service";
import ProjectInvitationDialog from "./project-invitation/project-invitation.dialog";
import OwnerUi from "@/shared/ui/owner.ui";
import { GetPeojectMeDTO } from "@/entities/project/project.interface";

/**
 * Feature-компонент: список проектов с бизнес-логикой и работой с API
 */
export function ProjectsListFeature() {
  const navigate = useNavigate();
  const { data: userMe } = useGetUserQuery();
  const [filter, setFilter] = useState<GetPeojectMeDTO>({
    page: 1,
    limit: undefined,
    client_id: undefined,
    role: undefined,
    sortOrder: undefined,
    sortBy: undefined,
  });
  const { data, refetch: refetchProjects } = useGetProjectsMeQuery(filter);
  const [dialogIsOpen, setDialogIsOpen] = useState<
    "create" | "invitations" | null
  >(null);

  useEffect(() => {
    refetchProjects();
  }, [filter, refetchProjects]);

  return (
    <div className="w-full flex flex-col p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">Проекты</h1>
        </div>
        <div className="flex gap-6 items-center">
          <ProjectInvitationDialog
            dialogIsOpen={dialogIsOpen === "invitations"}
            setDialogIsOpen={(_el) =>
              setDialogIsOpen(_el ? "invitations" : null)
            }
            refetchProjects={() => refetchProjects()}
          />
          <Dialog
            open={dialogIsOpen === "create"}
            onOpenChange={(_el) => setDialogIsOpen(_el ? "create" : null)}
          >
            <DialogTrigger asChild>
              <Button size={"sm"}>Добавить проект</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Создать новый проект</DialogTitle>
              </DialogHeader>
              <CreateProjectForm
                onSuccess={() => setDialogIsOpen(null)}
                onClose={() => setDialogIsOpen(null)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex-1 flex flex-col">
          <Table className="flex-1 w-full">
            <TableHeader className="">
              <TableHead className="flex items-center gap-2 h-16">
                <div className="flex gap-2">
                  {/* Select для сортировки по типу */}
                  <Select
                    onValueChange={(el) =>
                      setFilter({
                        ...filter,
                        sortBy:
                          el === "reset"
                            ? undefined
                            : (el as "name" | "created_at"),
                      })
                    }
                    value={filter.sortBy}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Тип" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem
                        value="reset"
                        key="reset"
                        className="bg-primary/50 border-2"
                      >
                        Сбросить
                      </SelectItem>
                      {["name", "created_at"].map((el) => (
                        <SelectItem key={el} value={el}>
                          {el === "name" ? "Наименование" : "Дата"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Select для порядка сортировки */}
                  <Select
                    onValueChange={(el) =>
                      setFilter({
                        ...filter,
                        sortOrder:
                          el === "reset" ? undefined : (el as "ASC" | "DESC"),
                      })
                    }
                    value={filter.sortOrder}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="По дате" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem
                        value="reset"
                        key="reset"
                        className="bg-primary/50 border-2"
                      >
                        Сбросить
                      </SelectItem>
                      {["ASC", "DESC"].map((el) => (
                        <SelectItem key={el} value={el}>
                          {el === "ASC"
                            ? "Дата по возрастанию"
                            : "Дата по убыванию"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Select для роли */}
                  <Select
                    onValueChange={(el) =>
                      setFilter({
                        ...filter,
                        role: el === "reset" ? undefined : (el as PROJECT_ROLE),
                      })
                    }
                    value={filter.role}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Роль" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem
                        value="reset"
                        key="reset"
                        className="bg-primary/50 border-2"
                      >
                        Сбросить
                      </SelectItem>
                      {Object.entries(PROJECT_ROLE).map(([key, value]) => (
                        <SelectItem key={key} value={value}>
                          {value === PROJECT_ROLE.OWNER && "Владелец"}
                          {value === PROJECT_ROLE.EXECUTOR && "Исполнитель"}
                          {value === PROJECT_ROLE.GUEST && "Гость"}
                          {value === PROJECT_ROLE.MANAGER && "Менеджер"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </TableHead>

              <TableRow>
                <TableHead className="w-1/6">Наименование</TableHead>
                <TableHead className="w-1/6">Пользователи</TableHead>
                <TableHead className="w-1/6">Клиент</TableHead>
                <TableHead className="w-1/6">Дата</TableHead>
                <TableHead className="w-1/6">Владелец</TableHead>
                <TableHead className="w-1/6">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.data?.map((project) => (
                <TableRow
                  key={project.project_id}
                  className="hover:bg-accent cursor-pointer"
                  onClick={() => navigate(`/${ROUTES.PROJECTS}/${project.project_id}`)}
                >
                  <TableCell>{project.name}</TableCell>
                  <TableCell>
                    {project.members.map((member) => (
                      <UserAvatar
                        key={member.user.user_id}
                        name={member.user.name}
                        planId={member.user.subscriptions?.[0]?.planId || 'free'}
                        size="small"
                      />
                    ))}
                  </TableCell>
                  <TableCell>{project?.client?.name}</TableCell>
                  <TableCell>{formatDate(project.created_at)}</TableCell>
                  <TableCell>
                    {project.members.map((member) => (
                      <OwnerUi key={member.user.user_id} isOwner={userMe?.user_id === member.user.user_id} />
                    ))}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/${ROUTES.PROJECTS}/${project.project_id}`);
                      }}
                    >
                      <PanelTop className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {/* Пагинация */}
        {data?.meta && (
          <div className="flex items-center justify-between px-4 py-4 border-t">
            <div className="text-sm text-muted-foreground">
              Страница {data.meta.page} из {data.meta.totalPages}
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setFilter((prev) => ({
                    ...prev,
                    page: Math.max((prev.page || 1) - 1, 1),
                  }))
                }
                disabled={filter.page <= 1}
              >
                Назад
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setFilter((prev) => ({
                    ...prev,
                    page: Math.min((prev.page || 1) + 1, data.meta.totalPages),
                  }))
                }
                disabled={filter.page >= data.meta.totalPages}
              >
                Вперед
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 