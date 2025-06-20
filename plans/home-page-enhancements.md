- [ ] Stage 1 — Анализ и подготовка 
  - [x] Изучить текущий компонент `HomePageFeature` и связанные API.
  - [x] Проверить наличие необходимых бекенд-эндпоинтов (dueToday, timeLogs/weekStats, lastActiveTask). _Необходимые эндпоинты отсутствуют, будем добавлять в следующих этапах._
  - [x] Составить интерфейсы DTO при необходимости. _Новые DTO будут созданы при реализации Stage 2–4._

- [ ] Stage 2 — Виджет «Сегодня»
  - [x] Backend: добавить/расширить эндпоинт `GET /tasks?due=today`.
  - [x] Frontend: создать feature-модуль `home/today-widget`.
  - [x] Компонент UI: список задач на сегодня с чекбоксами завершения.
  - [x] Интегрировать в `HomePageFeature` под заголовком.

- [ ] Stage 3 — «Быстрый таймер»
  - [x] Backend: эндпоинт `POST /time_logs/quick-start` (task_id). _Использован существующий `/time-logs/:task_id/start`, отдельный эндпоинт не потребовался._
  - [x] Frontend: widget `home/quick-timer` с кнопкой Start/Stop.
  - [x] Использовать существующий компонент `Timer` из entities. _Виджет QuickTimer был реализован, но по запросу пользователя исключён из UI._

- [ ] Stage 4 — Статистика недели
  - [x] Backend: эндпоинт `GET /time_logs/stats?range=7d`.
  - [x] Frontend: feature-модуль `home/weekly-stats`.
  - [x] Компонент диаграммы (Chart.js / Recharts) с TOP-3 задачами.

- [ ] Stage 5 — Обновление UI домашней страницы
  - [x] Добавить новые виджеты в `HomePageFeature` с адаптивной сеткой.
  - [x] Провести ручную проверку на desktop и mobile.

- [ ] Stage 6 — Тесты и документация
  - [ ] Написать unit-тесты для новых сервисов API.
  - [ ] E2E-тесты Playwright для быстрого таймера.
  - [ ] Обновить README и Storybook при наличии.

- [ ] Stage 7 — Ревью и рефакторинг
  - [ ] Проверить SOLID/OOP принципы.
  - [ ] Оптимизировать производительность (memo, lazy, suspense).
  - [ ] Подготовить changelog и провести релиз в ветке `dev`. 