# План оптимизации механизма уведомлений

- [ ] Этап 1. Backend — реал-тайм доставка через WebSocket
  - [ ] Создать `NotificationGateway` в NestJS (Socket.IO).
  - [ ] Формировать room по `userId` и отправлять событие `notification:new` только соответствующему пользователю.
  - [ ] Подключить `@nestjs/event-emitter`.
  - [ ] Ввести доменные события (`FriendInvitationAcceptedEvent` и пр.), слушатель `NotificationListener` вызывает `NotificationService.createNotification` и триггерит Gateway.

- [ ] Этап 2. Оптимизация репозитория уведомлений
  - [ ] Переписать `readAllNotifications` и `markNotificationAsRead` c использованием `Repository.update`.
  - [ ] Добавить пагинацию (`limit`, `offset`, `onlyUnread`), возвращать `PaginatedResponseDto`.

- [ ] Этап 3. Структурированные данные
  - [ ] Изменить тип колонки `data` на `jsonb`.
  - [ ] Создать миграцию с помощью TypeORM CLI.
  - [ ] Обновить DTO/Entity-валидацию.

- [ ] Этап 4. Кэширование и индексация
  - [ ] Индекс `created_at DESC`, `isRead`.
  - [ ] Внедрить Redis-кэш на `getNotifications` (key: userId+page+filters).

- [ ] Этап 5. Frontend — WebSocket интеграция
  - [ ] Создать модуль `notificationsSocket` (Context7/Socket.IO client).
  - [ ] При событии `notification:new` добавлять запись в RTK store без полного refetch.
  - [ ] Сохранить fallback-polling 60 сек.

- [ ] Этап 6. Модернизация RTK Query
  - [ ] Перейти на `createEntityAdapter` для уведомлений.
  - [ ] Добавить селектор `selectUnreadCount`.
  - [ ] Хранить `lastSeenAt` в `notification.slice`.

- [ ] Этап 7. UI-улучшения
  - [ ] Заменить `<ScrollArea>` на виртуализацию (`@tanstack/virtual`).
  - [ ] Расширить `parseNotificationMessage` для внутренних ссылок.
  - [ ] Добавить всплывающие тосты при приходе новых уведомлений.

- [ ] Этап 8. Enum-sharing
  - [ ] Генерировать `notification-type.enum.ts` из backend-enum при CI-сборке (`ts-morph`).

- [ ] Этап 9. Тестирование
  - [ ] Unit-тесты: listener, gateway.
  - [ ] E2E-тесты: WebSocket поток, read-all запросы.
  - [ ] Playwright: получение нового уведомления в UI, действия «Принять/Отклонить».

- [ ] Этап 10. Обслуживание и мониторинг
  - [ ] Крон-задача: удаление уведомлений старше 90 дней.
  - [ ] Prometheus/Grafana: метрика `unread_notifications_total`, `notification_delivery_seconds`.
  - [ ] Обновить Swagger и README.

- [ ] Этап 11. Индивидуальные настройки уведомлений пользователей
  - [ ] Backend
    - [ ] Создать таблицу `notification_settings` (`setting_id`, `user_id`, `scope` enum [`global`, `project`, `task`], `scope_id`, `event_type`, `sound`, `browser`, `chat_indicator`, `mobile_push`).
    - [ ] Реализовать `NotificationSettingsService` и контроллер для CRUD-операций.
    - [ ] При создании уведомления учитывать настройки конкретного пользователя (падение до глобальных при отсутствии override).
    - [ ] Таблица общая для всех пользователей: ключ `(user_id, scope, scope_id, event_type)`, никакого отдельного schema per user.
    - [ ] Алгоритм приоритета: `task` → `project` → `global` (берётся первая найденная запись).
    - [ ] При регистрации создавать набор *global* записей по умолчанию; новые project/task записи добавляются лениво при изменении настроек.
    - [ ] `UPSERT` через `INSERT ... ON CONFLICT` для bulk-обновлений.
    - [ ] Индекс `(user_id, scope, scope_id, event_type)` для быстрого поиска.
  - [ ] Frontend
    - [ ] Страница «Настройки → Уведомления» с матрицей переключателей по примеру YouGile.
    - [ ] Компонент `NotificationSettingsMatrix` для глобального уровня.
    - [ ] В настройках проекта добавить вкладку «Уведомления» (`scope = project`, `project_id`).
    - [ ] В меню задачи добавить пункт «Уведомления» для локальных override (`scope = task`, `task_id`).
    - [ ] RTK Query: `GET /notification-settings`, `PUT /notification-settings/bulk`.
  - [ ] Миграция: создать дефолтные записи настроек для всех текущих пользователей.
  - [ ] Тесты
    - [ ] Unit: сервис настроек, фильтрация каналов.
    - [ ] E2E: переключение тумблеров + получение/неполучение уведомлений. 