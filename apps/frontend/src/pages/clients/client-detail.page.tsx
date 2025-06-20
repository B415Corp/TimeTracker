import { useParams, useNavigate } from "react-router-dom";
import { useGetClientByIdQuery, useDeletelientsMutation } from "@/shared/api/client.service";
import { useGetProjectsMeQuery } from "@/shared/api/projects.service";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@ui/table";
import { Button } from "@ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/card";
import ClientItem from "@/entities/client/client-item";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@ui/dropdown-menu";
import { MoreVerticalIcon, PencilIcon, TrashIcon, ArrowLeftIcon } from "lucide-react";
import UpdateClientForm from "@/features/clients/update-clients.form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@ui/dialog";

export default function ClientDetailPage() {
  const { id = "" } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteClient] = useDeletelientsMutation();

  const { data: clientData, isLoading: clientLoading } = useGetClientByIdQuery(
    { client_id: id },
    { skip: !id }
  );
  const { data: projectsData, isLoading: projectsLoading } =
    useGetProjectsMeQuery(
      { page, client_id: id },
      { skip: !id }
    );

  if (clientLoading) return <p className="p-4">Загрузка...</p>;
  if (!clientData) return <p className="p-4">Клиент не найден</p>;

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate(-1)} className="flex gap-1 items-center">
          <ArrowLeftIcon className="size-4" /> Назад
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="size-8">
              <MoreVerticalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => setEditOpen(true)}>
              <PencilIcon className="mr-2 size-4" /> Редактировать
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => setDeleteOpen(true)}
            >
              <TrashIcon className="mr-2 size-4" /> Удалить
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Информация о клиенте</CardTitle>
        </CardHeader>
        <CardContent>
          <ClientItem name={clientData.name} />
          {clientData.additional_fields?.length ? (
            <div className="mt-4 space-y-1">
              {clientData.additional_fields.map((field, idx) => (
                <p key={idx} className="text-sm text-muted-foreground">
                  {field.type}: {field.value}
                </p>
              ))}
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Проекты клиента</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Наименование</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projectsLoading && (
                <tr>
                  <td className="p-4">Загрузка...</td>
                </tr>
              )}
              {projectsData?.data?.map((project) => (
                <TableRow
                  key={project.project_id}
                  className="cursor-pointer hover:bg-muted"
                  onClick={() => navigate(`/projects/${project.project_id}`)}
                >
                  <td className="p-2">{project.name}</td>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {projectsData?.meta && (
            <div className="flex items-center justify-between pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page <= 1}
              >
                Назад
              </Button>
              <span className="text-sm text-muted-foreground">
                Страница {projectsData.meta.page} из {projectsData.meta.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setPage((p) =>
                    Math.min(p + 1, projectsData.meta.totalPages)
                  )
                }
                disabled={page >= projectsData.meta.totalPages}
              >
                Вперед
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Редактировать клиента</DialogTitle>
          </DialogHeader>
          <UpdateClientForm
            defaults={{
              client_id: clientData.client_id,
              name: clientData.name,
              additional_fields: clientData.additional_fields ?? undefined,
            }}
            onSuccess={() => setEditOpen(false)}
            onClose={() => setEditOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* confirm delete dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Удалить клиента?</DialogTitle>
          </DialogHeader>
          <p>Это действие невозможно отменить. Вы уверены, что хотите продолжить?</p>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Отмена
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
                await deleteClient({ id: clientData.client_id });
                setDeleteOpen(false);
                navigate(-1);
              }}
            >
              Удалить
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 