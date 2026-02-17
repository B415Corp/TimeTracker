import {
  createContext,
  useContext,
  ReactNode,
  useState,
  Suspense,
} from "react";
import { Button } from "@ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@ui/dropdown-menu";
import {
  ChevronLeft,
  CoinsIcon,
  Kanban,
  LogOut,
  MoreVerticalIcon,
  PencilIcon,
  Table,
  Timer,
  TrashIcon,
  User2Icon,
  FileText,
} from "lucide-react";
import { useGetDocumentsByProjectQuery, useCreateDocumentMutation, useDeleteDocumentMutation } from '@shared/api/documentsApi';
import {
  useDeleteProjectMutation,
  useGetProjectByIdQuery,
} from "@/shared/api/projects.service";
import { useGetUserQuery } from "@/shared/api/user.service";
import InvitedUsers from "@/features/project/invited-users/invited-users";
import LeaveProjectDialog from "@/features/project/leave-project.dialog";
import EditProjectForm from "@/features/project/forms/edit-project.form";
import { RoleComponentFeature } from "@/features/role/RoleComponentFeature";
import { PROJECT_ROLE, SUBSCRIPTION } from "@/shared/enums";
import { OWNER_ONLY, PROJECT_MANAGERS, PROJECT_MEMBERS } from "@/shared/constants";
import CreateTaskForm from "@/features/tasks/forms/create-task.form";
import { ROUTES, TASKS_VIEW } from "@/app/router/routes.enum";
import { useNavigate } from "react-router-dom";
import { TasksListBoardPage } from "@/pages/tasks/tasks-list-board.page";
import { TasksListTablePage } from "@/pages/tasks/tasks-list-table.page";
import { Separator } from "@radix-ui/react-separator";
import { User } from "@/shared/interfaces/user.interface";
import { UserAvatar } from "@ui/base/user-avatar";
import { formatMilliseconds } from "@/lib/format-seconds";
import RoleBadge from "@/entities/role/role-badge";

interface ProjectDetailFeatureProps {
  projectId: string;
}

interface ProjectContext {
  userMe: User;
  id: string;
}

const ProjectDetailContext = createContext<ProjectContext | null>(null);

/**
 * Feature-компонент: детальная страница проекта с бизнес-логикой, api, состоянием и UI
 */
export function ProjectDetailFeature({ projectId }: ProjectDetailFeatureProps) {
  const { data: userMe } = useGetUserQuery();
  const contextProps: ProjectContext | null = userMe ? { userMe, id: projectId } : null;
  if (!contextProps) return null;

  return (
    <ProjectDetailContext.Provider value={contextProps}>
      <div className="w-full h-full flex flex-col">
        <Header />
        <ViewSection />
      </div>
    </ProjectDetailContext.Provider>
  );
}

function Header() {
  return (
    <div className="w-full">
      <div className="flex justify-between w-full">
        <div className="flex flex-col w-full">
          <div className="flex flex-col w-full p-4 gap-2">
            <HeaderTop />
            <HeaderBottom />
          </div>
        </div>
      </div>
    </div>
  );
}

function HeaderTop() {
  return (
    <div className="flex items-center gap-4 border-b-2 py-2 justify-between w-full">
      <ProjectTitle />
      <div className="flex items-center gap-4">
        <UsersOnProject />
        <CreateTaskBtn />
      </div>
    </div>
  );
}

function ProjectTitle() {
  const context = useContext(ProjectDetailContext);
  const [deleteProject] = useDeleteProjectMutation();
  const [dialogIsOpen, setDialogIsOpen] = useState<"edit" | "delete" | "leave" | null>(null);
  const navigate = useNavigate();
  const project_id = context?.id;
  const { data: projectData } = useGetProjectByIdQuery({ id: project_id || "" });
  const project = projectData?.project || null;

  return (
    <>
      <LeaveProjectDialog
        project_id={project?.project_id || ""}
        member_id={project?.members.find((el) => el.user.user_id === context?.userMe?.user_id)?.member_id || ""}
        dialogIsOpen={dialogIsOpen === "leave"}
        setDialogIsOpen={(data) => setDialogIsOpen(data ? "leave" : null)}
        projectRefetch={function (): void {}}
      />
      <Dialog open={dialogIsOpen === "edit"} onOpenChange={(data) => setDialogIsOpen(data ? "edit" : null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Редактировать проект</DialogTitle>
          </DialogHeader>
          <EditProjectForm
            projectId={project?.project_id || ""}
            initialData={{ name: project?.name || "", client_id: project?.client?.client_id, tag_ids: [] }}
            onSuccess={() => setDialogIsOpen(null)}
            onClose={() => setDialogIsOpen(null)}
          />
        </DialogContent>
      </Dialog>
      <Dialog open={dialogIsOpen === "delete"} onOpenChange={(data) => setDialogIsOpen(data ? "delete" : null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Подтверждение удаления</DialogTitle>
          </DialogHeader>
          <p>Вы уверены, что хотите удалить этот проект?</p>
          <p className="text-gray-400">Все приглашенные пользователи получат уведомление об удалении проекта.</p>
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setDialogIsOpen(null)}>
              Отмена
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
                navigate("/projects");
                setDialogIsOpen(null);
                await deleteProject(context?.id || "");
              }}
            >
              Удалить
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <div className="flex items-center gap-4">
        <Button className="size-6" size={"icon"} variant={"outline"} onClick={() => navigate(`/${ROUTES.PROJECTS}`)}>
          <ChevronLeft />
        </Button>
        <div className="flex gap-4 text-xl font-bold items-center">
          <p className="uppercase">{project?.name}</p>
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex size-6 text-muted-foreground data-[state=open]:bg-muted ml-auto" size="icon">
                  <MoreVerticalIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <RoleComponentFeature
                  roles={OWNER_ONLY}
                  userRole={project?.members.find((m) => m.user?.user_id === context?.userMe?.user_id)?.role as PROJECT_ROLE}
                  showChildren={false}
                >
                  <DropdownMenuItem onClick={() => setDialogIsOpen("edit")}> <PencilIcon className="mr-2 size-4" /> <span>Редактировать</span> </DropdownMenuItem>
                </RoleComponentFeature>
                <RoleComponentFeature
                  roles={OWNER_ONLY}
                  userRole={project?.members.find((m) => m.user?.user_id === context?.userMe?.user_id)?.role as PROJECT_ROLE}
                  showChildren={false}
                >
                  <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => setDialogIsOpen("delete")}> <TrashIcon className="mr-2 size-4" /> <span>Удалить</span> </DropdownMenuItem>
                </RoleComponentFeature>
                <RoleComponentFeature
                  roles={PROJECT_MEMBERS}
                  userRole={project?.members.find((m) => m.user?.user_id === context?.userMe?.user_id)?.role as PROJECT_ROLE}
                  showChildren={false}
                >
                  <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => setDialogIsOpen("leave")}> <LogOut className="mr-2 size-4" /> <span>Покинуть проект</span> </DropdownMenuItem>
                </RoleComponentFeature>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </>
  );
}

function CreateTaskBtn() {
  const context = useContext(ProjectDetailContext);
  const project_id = context?.id;
  const { data: projectData } = useGetProjectByIdQuery({ id: project_id || "" });
  const [dialogIsOpen, setDialogIsOpen] = useState<"create" | "edit" | "delete" | "invite" | "leave" | null>(null);
  const project = projectData?.project || null;
  return (
    <Dialog open={dialogIsOpen === "create"} onOpenChange={(data) => setDialogIsOpen(data ? "create" : null)}>
      <RoleComponentFeature
        roles={PROJECT_MANAGERS}
        userRole={project?.members.find((m) => m.user?.user_id === context?.userMe?.user_id)?.role as PROJECT_ROLE}
        showChildren={false}
      >
        <DialogTrigger asChild>
          <Button size={"sm"} className="w-fit">Добавить задачу</Button>
        </DialogTrigger>
      </RoleComponentFeature>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Создать новую задачу</DialogTitle>
        </DialogHeader>
        <CreateTaskForm onSuccess={(_task) => setDialogIsOpen(null)} onClose={() => setDialogIsOpen(null)} projectId={project_id || ""} />
      </DialogContent>
    </Dialog>
  );
}

function UsersOnProject() {
  const context = useContext(ProjectDetailContext);
  const project_id = context?.id;
  const { data: projectData } = useGetProjectByIdQuery({ id: project_id || "" });
  const project = projectData?.project || null;
  return (
    <RoleComponentFeature
      roles={PROJECT_MANAGERS}
      userRole={project?.members.find((m) => m.user?.user_id === context?.userMe?.user_id)?.role as PROJECT_ROLE}
      showChildren={false}
    >
      <div className="flex flex-row gap-1">
        <InvitedUsers members={project?.members || []} project_id={project?.project_id || ""} />
      </div>
    </RoleComponentFeature>
  );
}

function HeaderBottom() {
  const context = useContext(ProjectDetailContext);
  const project_id = context?.id;
  const { data: projectData } = useGetProjectByIdQuery({ id: project_id || "" });
  const info = projectData?.info || null;
  const { hours, minutes, seconds } = formatMilliseconds(info?.projectDuration || 0);
  return (
    <>
      <div className="flex flex-row gap-2">
        <div className="flex flex-row gap-1 items-center">
          <RoleBadge role={info?.myRole} />
        </div>
        <Separator orientation="vertical" className="min-h-4 border-1" />
        <div className="flex flex-row gap-1 items-center">
          <UserAvatar name={info?.owner?.user?.name || ""} planId={SUBSCRIPTION.FREE} size={"xs"} />
          <p className="text-sm text-muted-foreground">{info?.owner?.user?.name}</p>
        </div>
        <Separator orientation="vertical" className="min-h-4 border-1" />
        <div className="flex flex-row gap-1 items-center">
          <CoinsIcon className="size-3.5" />
          <p className="text-sm text-muted-foreground">{info?.myPaymentType} {"/"} {info?.myCurrency.symbol}{info?.myRate}</p>
        </div>
        {info?.client && (
          <>
            <Separator orientation="vertical" className="min-h-4 border-1" />
            <div className="flex flex-row gap-1 items-center">
              <User2Icon className="size-3.5" />
              <p className="text-sm text-muted-foreground">{info?.client?.name}</p>
            </div>
          </>
        )}
        <Separator orientation="vertical" className="min-h-4 border-1" />
        <div className="flex flex-row gap-1 items-center">
          <Timer className="size-3.5" />
          <p className="text-sm text-muted-foreground">{hours}:{minutes}:{seconds}</p>
        </div>
      </div>
    </>
  );
}

function ViewSection() {
  const context = useContext(ProjectDetailContext);
  const project_id = context?.id;
  const [view, setView] = useState<TASKS_VIEW>(TASKS_VIEW.BOARD);
  return (
    <>
      <div className="flex items-center gap-2 p-4">
        <Button onClick={() => setView(TASKS_VIEW.BOARD)} size={"sm"} variant={view === TASKS_VIEW.BOARD ? "outline" : "ghost"}>
          <Kanban />
          <span>Доска</span>
        </Button>
        <Button onClick={() => setView(TASKS_VIEW.TABLE)} size={"sm"} variant={view === TASKS_VIEW.TABLE ? "outline" : "ghost"}>
          <Table />
          <span>Таблица</span>
        </Button>
        <Button 
          onClick={() => setView(TASKS_VIEW.DOCUMENTS)} 
          size={"sm"} 
          variant={view === TASKS_VIEW.DOCUMENTS ? "outline" : "ghost"}
        >
          <FileText />
          <span>Документы</span>
        </Button>
      </div>
      <div className="flex-1 overflow-hidden">
        <Suspense fallback={<div>Загрузка...</div>}>
          {view === TASKS_VIEW.BOARD && <TasksListBoardPage />}
          {view === TASKS_VIEW.TABLE && <TasksListTablePage />}
          {view === TASKS_VIEW.DOCUMENTS && <DocumentsView projectId={project_id || ""} />}
        </Suspense>
      </div>
    </>
  );
}

function DocumentsView({ projectId }: { projectId: string }) {
  const navigate = useNavigate();
  const { data: documents = [], isLoading } = useGetDocumentsByProjectQuery(projectId);
  const [createDocument] = useCreateDocumentMutation();
  const [deleteDocument] = useDeleteDocumentMutation();

  const handleCreateDocument = async () => {
    try {
      const newDoc = await createDocument({
        projectId,
        title: 'Untitled',
      }).unwrap();
      navigate(`/projects/${projectId}/documents/${newDoc.document_id}`);
    } catch (error) {
      console.error('Failed to create document:', error);
    }
  };

  const handleDeleteDocument = async (documentId: string) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        await deleteDocument(documentId).unwrap();
      } catch (error) {
        console.error('Failed to delete document:', error);
      }
    }
  };

  if (isLoading) {
    return <div className="p-8">Loading documents...</div>;
  }

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Documents</h2>
          <Button onClick={handleCreateDocument}>
            <FileText className="w-4 h-4 mr-2" />
            New Document
          </Button>
        </div>

        {documents.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No documents yet</h3>
            <p className="text-gray-500 mb-4">Get started by creating your first document</p>
            <Button onClick={handleCreateDocument}>
              <FileText className="w-4 h-4 mr-2" />
              Create Document
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {documents.map((doc) => (
              <div
                key={doc.document_id}
                onClick={() => navigate(`/projects/${projectId}/documents/${doc.document_id}`)}
                className="block p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2 flex-1">
                    {doc.icon && <span className="text-2xl">{doc.icon}</span>}
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{doc.title}</h3>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteDocument(doc.document_id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                  >
                    <TrashIcon className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
                <p className="text-sm text-gray-500">
                  Updated {new Date(doc.updated_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 