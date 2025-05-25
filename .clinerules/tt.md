Монорепозиторий frontend и backend.
- Frontend '/apps/frontend/'
    - библиотеки:
        - React 19 
        - shadcn
        - react-hook-form
        - react router
    - собирается в dist и далее хост идет на стороне backend
- Backend '/apps/backend/'
    - библиотеки:
        - Nest 10 
    - запускается в своем контейнере
    - хостит api на '/api'
    - хостит frontend на '/' как SPA
    