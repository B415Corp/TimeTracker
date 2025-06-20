import { useForm, useFieldArray } from "react-hook-form";
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
import { Input } from "@ui/input";
import { Button } from "@ui/button";
import { DialogFooter } from "@ui/dialog";
import { useEditClientsMutation } from "@/shared/api/client.service";
import { EditClientDTO } from "@/entities/client/client.interface";
import { PlusIcon, TrashIcon } from "lucide-react";

// Схема валидации формы
const fieldSchema = z.object({
  type: z.string().min(1, "Тип обязателен"),
  value: z.string().min(1, "Значение обязательно"),
});

const updateClientSchema = z.object({
  name: z.string().min(1, "Наименование клиента обязательно"),
  additional_fields: z.array(fieldSchema).max(50).optional(),
});

type UpdateClientFormValues = z.infer<typeof updateClientSchema>;

interface UpdateClientFormProps {
  defaults: EditClientDTO;
  onSuccess: () => void;
  onClose: () => void;
}

function UpdateClientForm({
  defaults,
  onSuccess,
  onClose,
}: UpdateClientFormProps) {
  const [updateClient, { isLoading: isCreating }] = useEditClientsMutation();
  const form = useForm<UpdateClientFormValues>({
    resolver: zodResolver(updateClientSchema),
    defaultValues: {
      name: "",
      additional_fields: [],
    },
    values: defaults,
  });

  async function onSubmit(values: UpdateClientFormValues) {
    try {
      await updateClient({
        client_id: defaults.client_id,
        name: values.name,
        additional_fields: values.additional_fields,
      }).unwrap();

      form.reset();
      onSuccess();
      onClose(); // Закрываем форму после успешного создания проекта
    } catch (error) {
      console.error("Ошибка при создании проекта:", error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Наименвоание клиента</FormLabel>
              <FormControl>
                <Input placeholder="B415 inc." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <DynamicFieldsSection form={form} />

        <DialogFooter>
          <Button type="submit" disabled={isCreating}>
            {isCreating ? "Сохранение..." : "Изменить клиента"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

interface DynamicFieldsSectionProps {
  form: ReturnType<typeof useForm<UpdateClientFormValues>>;
}

function DynamicFieldsSection({ form }: DynamicFieldsSectionProps) {
  const { control } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "additional_fields",
  });

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <FormLabel>Дополнительные поля</FormLabel>
        <Button
          variant="outline"
          type="button"
          size="icon"
          disabled={fields.length >= 50}
          onClick={() => append({ type: "", value: "" })}
        >
          <PlusIcon className="size-4" />
        </Button>
      </div>
      {fields.map((field, index) => (
        <div key={field.id} className="flex gap-2 items-end">
          <FormField
            control={control}
            name={`additional_fields.${index}.type`}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Тип</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className="border rounded p-2 w-full bg-background"
                  >
                    <option value="">Выберите тип</option>
                    <option value="email">Email</option>
                    <option value="phone">Телефон</option>
                    <option value="social">Ссылка на соц. сеть</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name={`additional_fields.${index}.value`}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Значение</FormLabel>
                <FormControl>
                  <Input placeholder="value" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            variant="destructive"
            size="icon"
            type="button"
            onClick={() => remove(index)}
          >
            <TrashIcon className="size-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}

export default UpdateClientForm;
