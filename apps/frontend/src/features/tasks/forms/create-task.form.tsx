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
import { Input } from "@ui/input";
import { Button } from "@ui/button";
import { DialogFooter } from "@ui/dialog";
import { useCreateTaskMutation } from "@/shared/api/task.service";
import { Textarea } from "@ui/textarea";
import { DateRangePicker } from "@ui/date-range-picker";
import React from "react";
import { TiptapEditor } from "@/entities/tiptap/TiptapEditor";

// Схема валидации формы
const createTaskSchema = z.object({
  name: z.string().min(1, "Название задачи обязательно"),
  project_id: z.string().min(1, "Проект обязателен"),
  description: z.string().min(1, "Описание обязательно"), // Убрали .optional()
  is_paid: z.boolean().default(false),
  order: z.number().int().min(0, "Порядок должен быть неотрицательным"),
  tag_ids: z.array(z.string()).default([]),
  dateRange: z
    .object({
      from: z.date().optional(),
      to: z.date().optional(),
    })
    .optional(),
  note_content: z.string().optional(),
});

type CreateTaskFormValues = z.infer<typeof createTaskSchema>;

interface CreateTaskFormProps {
  onSuccess: () => void;
  onClose: () => void;
  projectId: string;
}

function CreateTaskForm({
  onSuccess,
  onClose,
  projectId,
}: CreateTaskFormProps) {
  const [createTask, { isLoading: isCreating }] = useCreateTaskMutation();
  const form = useForm<CreateTaskFormValues>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      name: "",
      project_id: projectId,
      description: "",
      is_paid: false,
      order: 0,
      tag_ids: [],
      dateRange: undefined,
      note_content: "<p></p>",
    },
  });

  const [dateRange, setDateRange] = React.useState<{ from?: Date; to?: Date }>();

  async function onSubmit(values: CreateTaskFormValues) {
    try {
      const payload: any = {
        ...values,
        start_date: values.dateRange?.from?.toISOString(),
        end_date: values.dateRange?.to?.toISOString(),
        note_content: values.note_content,
      };
      delete payload.dateRange;
      await createTask(payload).unwrap();
      form.reset();
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Ошибка при создании задачи:", error);
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
              <FormLabel>Название задачи</FormLabel>
              <FormControl>
                <Input placeholder="Разработка функционала" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Описание</FormLabel>
              <FormControl>
                <Textarea
                  className="max-h-32"
                  placeholder="Детальное описание задачи..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dateRange"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Сроки выполнения</FormLabel>
              <FormControl>
                <DateRangePicker
                  date={dateRange}
                  onChange={(range) => {
                    setDateRange(range);
                    field.onChange(range);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="note_content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Заметка</FormLabel>
              <FormControl>
                <TiptapEditor
                  initialContent={field.value || ""}
                  onChange={(content) => field.onChange(content)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Отмена
          </Button>
          <Button type="submit" disabled={isCreating}>
            {isCreating ? "Создание..." : "Создать задачу"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

export default CreateTaskForm;
