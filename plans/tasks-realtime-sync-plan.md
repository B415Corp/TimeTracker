# План реал-тайм синхронизации карточек задач (Kanban & Table)

- [ ] Этап 1. Backend: Gateway и события
  - [ ] Создать `TaskGateway` (Socket.IO) в NestJS.
  - [ ] Определить события: `task:created`, `task:updated`, `task:deleted`, `task:status_changed`.
  - [ ] Формировать комнату по `projectId` или `userId` (в зависимости от требований доступа).

- [ ] Этап 2. Domain Events
  - [ ] Ввести события `TaskCreatedEvent`, `TaskUpdatedEvent`, `TaskStatusChangedEvent`.
  - [ ] Реализовать `TaskRealtimeListener`, который слушает доменные события и передаёт данные в `TaskGateway`.

- [ ] Этап 3. Frontend: Socket-клиент
  - [ ] Создать модуль `tasksSocket` (Context7/Socket.IO client).
  - [ ] Подписка на события `task:*`.
  - [ ] На входе данных обновлять RTK EntityAdapter для `tasksSlice`.

- [ ] Этап 4. Канбан и Табличный вид
  - [ ] При событии `task:status_changed` перемещать карточку между колонками.
  - [ ] При `task:updated` обновлять подписи, дедлайны и т.п.
  - [ ] При `task:created` добавлять карточку в соответствующую колонку и таблицу.
  - [ ] При `task:deleted` удалять карточку.

- [ ] Этап 5. Optimistic UI для drag-and-drop
  - [ ] При перетаскивании локально менять колонку.
  - [ ] Если сервер возвращает ошибку — откат позиции и вывести тост.

- [ ] Этап 6. Тесты
  - [ ] Unit: `TaskRealtimeListener` корректно эмитит в Gateway.
  - [ ] E2E: два клиента, drag-and-drop на первом → второй мгновенно видит изменение.
  - [ ] Playwright component: корректное обновление `TaskCard`.

- [ ] Этап 7. Документация и метрики
  - [ ] Swagger: описать сокет-события.
  - [ ] Prometheus: `tasks_updates_total`, `tasks_ws_connections`. 