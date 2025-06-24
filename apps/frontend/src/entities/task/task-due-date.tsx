import React from "react";
import { differenceInCalendarDays, format } from "date-fns";

/**
 * Компонент для отображения срока выполнения задачи.
 * Подсвечивает дату окончания:
 *  - красным, если срок просрочен;
 *  - жёлтым, если до дедлайна осталось ≤ 3 календарных дней.
 *
 * @param startDate   Дата начала задачи (опционально).
 * @param endDate     Крайний срок выполнения (опционально).
 * @param fallbackDate Дата, которую нужно показать, если endDate не указан (например, дата создания).
 * @example
 * <TaskDueDate startDate="2024-05-01" endDate="2024-05-10" />
 */
export function TaskDueDate({
  startDate,
  endDate,
  fallbackDate,
}: {
  startDate?: string | Date | null;
  endDate?: string | Date | null;
  fallbackDate?: string | Date | null;
}) {
  // Преобразуем входные данные к экземплярам Date при наличии
  const start = startDate ? new Date(startDate) : null;
  const end = endDate ? new Date(endDate) : null;
  const fallback = fallbackDate ? new Date(fallbackDate) : null;

  // Выбираем, что отображать в качестве конечной даты
  const endToShow = end || fallback;

  // Определяем класс подсветки для даты окончания
  let endDateClass = "";
  if (end) {
    const diff = differenceInCalendarDays(end, new Date());
    if (diff < 0) endDateClass = "text-red-500"; // Просрочено
    else if (diff <= 3) endDateClass = "text-yellow-600"; // Скоро дедлайн
  }

  return (
    <span className="flex items-center gap-0.5">
      {start && (
        <>
          <span className="opacity-80">{format(start, "dd.MM")}</span>
          <span className="mx-0.5">—</span>
        </>
      )}
      {endToShow && (
        <span className={endDateClass}>{format(endToShow, "dd.MM")}</span>
      )}
    </span>
  );
}

export default TaskDueDate; 