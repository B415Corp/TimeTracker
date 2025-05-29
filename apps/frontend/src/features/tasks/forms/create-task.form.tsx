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
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

// Схема валидации формы
const createTaskSchema = z.object({
  name: z.string().min(1, "Название задачи обязательно"),
  project_id: z.string().min(1, "Проект обязателен"),
  description: z.string().optional(),
  is_paid: z.boolean().default(false),
  order: z.number().int().min(0, "Порядок должен быть неотрицательным"),
  tag_ids: z.array(z.string()).default([]),
  // Поля для заметки
  note_name: z.string().optional(),
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
  const [createTask, { isLoading: isCreatingTask }] = useCreateTaskMutation();
  const [createNote, { isLoading: isCreatingNote }] = useCreateNotesMutation();
  const [activeTab, setActiveTab] = useState<"basic" | "notes">("basic");
  
  const form = useForm<CreateTaskFormValues>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      name: "",
      project_id: projectId,
      description: "",
      is_paid: false,
      order: 0,
      tag_ids: [],
      note_name: "",
      note_content: "",
    },
  });

  const isLoading = isCreatingTask || isCreatingNote;

  async function onSubmit(values: CreateTaskFormValues) {
    try {
      // Создаем задачу
      const task = await createTask(values).unwrap();
      
      // Если есть заметка, создаем её и связываем с задачей
      if (values.note_name && values.note_content) {
        await createNote({
          name: values.note_name,
          text_content: values.note_content,
          task_id: task.task_id,
        }).unwrap();
      }
      
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
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "basic" | "notes")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic">Основная информация</TabsTrigger>
            <TabsTrigger value="notes">Заметки</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-4">
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
          </TabsContent>
          
          <TabsContent value="notes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Дополнительная заметка
                </CardTitle>
                <CardDescription>
                  Создайте заметку, которая будет связана с этой задачей
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="note_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Название заметки</FormLabel>
                      <FormControl>
                        <Input placeholder="Техническое задание" {...field} />
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
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

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
