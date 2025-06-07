import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@ui/form";
import { EditUserNameDTO, EditUserNameSchema } from "@/shared/interfaces/user.interface";

/**
 * Форма изменения имени пользователя
 * @param {string} initialName - начальное имя пользователя
 * @param {boolean} isLoading - индикатор загрузки
 * @param {function} onSubmit - обработчик submit
 */
export function AccountNameForm({ initialName, isLoading, onSubmit }: { initialName: string, isLoading: boolean, onSubmit: (data: EditUserNameDTO) => void }) {
  const form = useForm({
    resolver: zodResolver(EditUserNameSchema),
    defaultValues: { name: initialName },
  });
  const { isDirty } = form.formState;

  useEffect(() => {
    form.reset({ name: initialName });
  }, [initialName, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => { if (isDirty) onSubmit(data); })} className="space-y-2">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl style={{ width: "100%" }}>
                <Input
                  {...field}
                  placeholder="Имя пользователя"
                  className="rounded-lg"
                  onBlur={form.handleSubmit((data) => { if (isDirty) onSubmit(data); })}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
} 