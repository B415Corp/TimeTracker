import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@ui/form";
import { Button } from "@ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/select";
import { useGetClientsQuery } from "@/shared/api/client.service";
import { useUpdateProjectMutation } from "@/shared/api/projects.service";
import { DialogFooter } from "@ui/dialog";

const selectClientSchema = z.object({
  client_id: z.string({ required_error: "Выберите клиента" }),
});

type SelectClientFormValues = z.infer<typeof selectClientSchema>;

interface SelectClientFormProps {
  projectId: string;
  onSuccess: () => void;
  onClose: () => void;
}

function SelectClientForm({ projectId, onSuccess, onClose }: SelectClientFormProps) {
  const { data: clients, isLoading: isLoadingClients } = useGetClientsQuery({ page: 1 });

  const [updateProject, { isLoading: isUpdating }] = useUpdateProjectMutation();

  const form = useForm<SelectClientFormValues>({
    resolver: zodResolver(selectClientSchema),
    defaultValues: {
      client_id: "",
    },
  });

  const onSubmit = async (values: SelectClientFormValues) => {
    try {
      await updateProject({ id: projectId, data: { client_id: values.client_id } as any }).unwrap();
      onSuccess();
      onClose();
    } catch (e) {
      console.error("Ошибка при назначении клиента", e);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="client_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Клиент</FormLabel>
              <Select disabled={isLoadingClients} onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите клиента" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {clients?.data.map((client) => (
                    <SelectItem key={client.client_id} value={client.client_id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter>
          <Button type="submit" disabled={isUpdating}>
            {isUpdating ? "Сохранение..." : "Сохранить"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

export default SelectClientForm; 