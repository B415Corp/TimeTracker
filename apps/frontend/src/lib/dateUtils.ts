export const formatDate = (dateString: string): string => {
  if (!dateString) return "";

  const date = new Date(dateString);

  // Проверка на валидность даты
  if (isNaN(date.getTime())) return dateString;

  // Форматирование даты в формат "ДД.ММ.ГГГГ"
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  return `${day}.${month}.${year}`;
};

export const formatDurationToHours = (durationMs?: number): string => {
  if (!durationMs || isNaN(durationMs)) return "00:00:00";

  const totalSeconds = Math.floor(durationMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (num: number): string => num.toString().padStart(2, "0");

  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
};
