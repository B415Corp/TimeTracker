Монорепозиторий frontend и backend.
- Проект развернут на домашнем сервере к которму пожно подключиться по ssh deploy@192.168.0.102
- Для развертывания оспользуется gh-actions self-hosted
- Во время развертывания workflow делает сборку ипроверяет ее работоспособность, после чего в случае отсутствия ошибок приступает к финальному развертыванию.
- PSQL
    - база данных
- Adminer
    - доступ к администрированию бд
- Redis
    - пока не используется
    - сохранение активных сессий
    - кэширование запросов
- Frontend '/apps/frontend/'
    - собираетсяи хостится в отдельном контейнере frontend
        - в роли сервера выступает nginx с настройкой под SPA
    - библиотеки:
        - node.js - v20.10.0
        - npm - 10.2.5
        - React 19 
        - shadcn
        - react-hook-form
        - react router
    
- Backend '/apps/backend/'
    - собираетсяи хостится в отдельном контейнере backend
        - в ролм сервера выступает node.js
    - библиотеки:
        - node.js - v20.10.0
        - npm - 10.2.5
        - Nest 10 
        - typeORM
    - хостит api на '/api'
    - хостит frontend на '/' как SPA
    