import { Button } from "@ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@ui/dropdown-menu";
import { TableCell } from "@ui/table";
import { MoreVerticalIcon, PencilIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import { useDeletelientsMutation } from "@/shared/api/client.service";
import UpdateClientForm from "@/features/clients/update-clients.form";
import { Client } from "@/entities/client/client.interface";
import ClientItem from "@/entities/client/client-item";

export default function ClientTableRow(client: Client) {
  const [deleteClient] = useDeletelientsMutation();
  const [editDialogIsOpen, setEditDialogIsOpen] = useState<boolean>(false);
  const [clientToDelete, setClientToDelete] = useState<string | null>(null);

  return (
    <>
      {client && (
        <>
          <Dialog open={editDialogIsOpen} onOpenChange={setEditDialogIsOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Обновить клиента</DialogTitle>
              </DialogHeader>
              <UpdateClientForm
                onSuccess={() => setEditDialogIsOpen(false)}
                onClose={() => setEditDialogIsOpen(false)}
                defaults={{ ...client, additional_fields: client.additional_fields ?? undefined }}
              />
            </DialogContent>
          </Dialog>
          <Dialog
            open={clientToDelete !== null}
            onOpenChange={() => setClientToDelete(null)}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Подтверждение удаления</DialogTitle>
              </DialogHeader>
              <p>Вы уверены, что хотите удалить этого клиента?</p>
              <div className="flex justify-end space-x-2 mt-4">
                <Button
                  variant="outline"
                  onClick={() => setClientToDelete(null)}
                >
                  Отмена
                </Button>
                <Button
                  variant="destructive"
                  onClick={async () => {
                    await deleteClient({ id: clientToDelete || "" });
                    setClientToDelete(null);
                  }}
                >
                  Удалить
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}

      <TableCell className="font-medium flex items-center gap-2 py-2 w-full">
        <ClientItem
          name={client?.name}
          additional_fields={client?.additional_fields ?? undefined}
        />
      </TableCell>
    </>
  );
}
