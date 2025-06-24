# План создания дизайн-макета в Figma для «TimeTracker»

> Цель: сформировать полный дизайн-макет, соответствующий описанному UI/UX, с готовой библиотекой компонентов, стилями и интерактивным прототипом.

## 📌 Общие правила
- Все стили хранятся в библиотечных переменных
- Использовать Auto-Layout для адаптивности
- Компоненты именуются по схеме `TT/[Category]/[Component]/[Variant]`
- Экспорт токенов через **Figma Tokens** для синхронизации с кодом

---

## 📋 Этапы работ

### Этап 1: Структура файла и стили
- [ ] Создать файл **TimeTracker-Design** и страницы: `Styles`, `Components`, `Pages`, `Prototypes`
- [ ] На странице `Styles` добавить секции: **Color**, **Typography**, **Elevation**, **Spacing**, **Grid**
- [ ] Завести цветовые стили согласно токенам `ui-design.md`
- [ ] Завести текстовые стили (`text-xs` … `text-3xl`)
- [ ] Создать эффекты теней (`elevation-sm`, `elevation-md`, `elevation-lg`)
- [ ] Определить 4-px spacing scale в переменных

### Этап 2: Библиотека атомов
- [ ] **Button**: primary/secondary/ghost; sm/md/lg; disabled
- [ ] **IconButton**: круглая/квадратная; sizes 32/40/48
- [ ] **Input**: default, with-icon, error
- [ ] **Checkbox**, **Radio**, **Switch** с состояниями
- [ ] **Badge**: success/error/warning/info
- [ ] **Avatar** с fallback-инициалами

### Этап 3: Молекулы и организмы
- [ ] **Navbar**: logo + search + userMenu
- [ ] **Sidebar**: collapsible list + tooltips
- [ ] **Card**: surface + elevation + optional actions
- [ ] **Modal** компонент с overlay + header/footer слотовой системой
- [ ] **Toast** stack (auto-layout vertical, max 3)

### Этап 4: Специфические виджеты
- [ ] **KanbanColumn**: header + counter + droppable area
- [ ] **KanbanTaskCard**: status badge, title, assignee avatars, time badge
- [ ] **TimeTrackerWidget**: play/pause button, counter, project selector
- [ ] **AnalyticsChart** (placeholder для Recharts)

### Этап 5: Шаблоны страниц (Page Templates)
- [ ] **Dashboard**: 2-col grid, widgets auto-layout
- [ ] **Projects List**: table + toolbar + pagination
- [ ] **Project Board**: sidebar + kanban board + detail modal overlay
- [ ] **Tasks Board**: фильтры сверху + kanban + right drawer
- [ ] **Time Logs**: calendar + data table + export modal
- [ ] **Settings**: tabs + forms

### Этап 6: Реализация пользовательских потоков
- [ ] Прототип «Регистрация» (wizard → email confirm)
- [ ] Прототип «Создание задачи» (modal → board update)
- [ ] Прототип «Трекинг времени» (play → pause → log modal)

### Этап 7: Интерактивный прототип и передача
- [ ] Настроить интерактивы (Hover, Press, Drag) в прототипах
- [ ] Проверить навигацию через `Cmd+K` CommandPalette
- [ ] Опубликовать библиотеку компонентов как **Team Library**
- [ ] Экспорт токенов JSON (`figma.tokens.json`) для Tailwind

---

## 🔄 Синхронизация с кодовой базой
- Интеграция токенов через **StyleDictionary → tailwind.config.ts**
- Автоматизация экспорта SVG-иконок в `src/shared/ui/icons`
- Проверка визуальных регрессий через **Chromatic** после импорта компонентов

---

> Документ предназначен для автоматизированной обработки. Выполнять этапы последовательно; каждый чек-бокс соответствует дискретной задаче в CI/CD пайплайне генерации макета. 