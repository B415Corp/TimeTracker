import { useParams, useNavigate } from "react-router-dom";
import { useGetClientByIdQuery } from "@/shared/api/client.service";
import { useGetProjectsMeQuery } from "@/shared/api/projects.service";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@ui/table";
import { Button } from "@ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/card";
import ClientItem from "@/entities/client/client-item";
import { useState } from "react";

export default function ClientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);

  const { data: clientData, isLoading: clientLoading } = useGetClientByIdQuery({ client_id: id || "" }, { skip: !id });
  const {
    data: projectsData,
    isLoading: projectsLoading,
  } = useGetProjectsMeQuery({ page, client_id: id || "" }, { skip: !id });

  if (clientLoading) return <p className="p-4">Загрузка...</p>;
  if (!clientData) return <p className="p-4">Клиент не найден</p>;

  return (
    <div className="p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Информация о клиенте</CardTitle>
        </CardHeader>
        <CardContent>
          <ClientItem name={clientData.name} />
          {clientData.additional_fields && clientData.additional_fields.length > 0 && (
            <div className="mt-4 space-y-1">
              {clientData.additional_fields.map((field, idx) => (
                <p key={idx} className="text-sm text-muted-foreground">
                  {field.type}: {field.value}
                </p>
              ))}
            </div>
          )}
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
              {projectsLoading && <tr><td className="p-4">Загрузка...</td></tr>}
              {!projectsLoading && projectsData?.data && projectsData.data.map((project) => (
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
                onClick={() => setPage((p) => Math.min(p + 1, projectsData.meta.totalPages))}
                disabled={page >= projectsData.meta.totalPages}
              >
                Вперед
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 