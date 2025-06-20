- [ ] Stage 1 — Анализ и подготовка 
  - [ ] Изучить текущий компонент `HomePageFeature` и связанные API.
  - [ ] Проверить наличие необходимых бекенд-эндпоинтов (dueToday, timeLogs/weekStats, lastActiveTask).
  - [ ] Составить интерфейсы DTO при необходимости.

- [ ] Stage 2 — Виджет «Сегодня»
  - [ ] Backend: добавить/расширить эндпоинт `GET /tasks?due=today`.
  - [ ] Frontend: создать feature-модуль `home/today-widget`.
  - [ ] Компонент UI: список задач на сегодня с чекбоксами завершения.
  - [ ] Интегрировать в `HomePageFeature` под заголовком.

- [ ] Stage 3 — «Быстрый таймер»
  - [ ] Backend: эндпоинт `POST /time_logs/quick-start` (task_id).
  - [ ] Frontend: widget `home/quick-timer` с кнопкой Start/Stop.
  - [ ] Использовать существующий компонент `Timer` из entities.

- [ ] Stage 4 — Статистика недели
  - [ ] Backend: эндпоинт `GET /time_logs/stats?range=7d`.
  - [ ] Frontend: feature-модуль `home/weekly-stats`.
  - [ ] Компонент диаграммы (Chart.js / Recharts) с TOP-3 задачами.

- [ ] Stage 5 — Обновление UI домашней страницы
  - [ ] Добавить новые виджеты в `HomePageFeature` с адаптивной сеткой.
  - [ ] Провести ручную проверку на desktop и mobile.

- [ ] Stage 6 — Тесты и документация
  - [ ] Написать unit-тесты для новых сервисов API.
  - [ ] E2E-тесты Playwright для быстрого таймера.
  - [ ] Обновить README и Storybook при наличии.

- [ ] Stage 7 — Ревью и рефакторинг
  - [ ] Проверить SOLID/OOP принципы.
  - [ ] Оптимизировать производительность (memo, lazy, suspense).
  - [ ] Подготовить changelog и провести релиз в ветке `dev`. 