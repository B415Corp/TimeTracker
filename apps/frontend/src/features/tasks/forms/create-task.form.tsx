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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { useCreateTaskMutation } from "@/shared/api/task.service";
import { Textarea } from "@/components/ui/textarea";
import { useCreateNotesMutation } from "@/shared/api/notes.service";

// Схема валидации формы
const createTaskSchema = z.object({
  name: z.string().min(1, "Название задачи обязательно"),
  project_id: z.string().min(1, "Проект обязателен"),
  is_paid: z.boolean().default(false),
  order: z.number().int().min(0, "Порядок должен быть неотрицательным"),
  tag_ids: z.array(z.string()).default([]),
  note_content: z.string().min(1, "Содержание заметки обязательно"),
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
  const [createTask, { isLoading: isCreatingTask }] = useCreateTaskMutation();
  const [createNote, { isLoading: isCreatingNote }] = useCreateNotesMutation();

  const form = useForm<CreateTaskFormValues>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      name: "",
      project_id: projectId,
      is_paid: false,
      order: 0,
      tag_ids: [],
      note_content: "",
    },
  });

  const isLoading = isCreatingTask || isCreatingNote;

  async function onSubmit(values: CreateTaskFormValues) {
    try {
      await createTask(values).unwrap();
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

        <div className="border rounded-lg p-4 bg-muted/40">
          <FormField
            control={form.control}
            name="note_content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Содержание заметки</FormLabel>
                <FormControl>
                  <Textarea
                    className="min-h-32"
                    placeholder="Детальная информация, требования, ссылки..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Отмена
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Создание..." : "Создать задачу"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

export default CreateTaskForm;
