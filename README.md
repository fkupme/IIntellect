# IIntellect

## 1. Общая информация о проекте

Проект представляет собой веб-приложение, которое позволяет пользователям отвечать на вопросы, получать комментарии от нейросети (например, Hugging Face) и сохранять результаты в базу данных. Для реализации используется современный стек технологий:

### Фронтенд:

- **Nuxt**
- **TypeScript**
- **Pinia**
- **Element Plus**
- **Fetch API / `useFetch`**

### Бэкенд:

- **NestJS**
- **TypeScript**
- **Prisma**
- **PostgreSQL**
- **Hugging Face Inference API**

---

## 2. Архитектурная схема

```plaintext
+-------------------+
|     Фронтенд      |
|   (Nuxt.js v3)    |
+-------------------+
            |
            |
            v
+-------------------+           +-------------------+
|       Бэкенд      |-----------|     Нейросеть     |
|    (NestJS)       |           |   (Hugging Face)  |
+-------------------+           +-------------------+
            |
            |
            v
+-------------------+
|     База данных   |
|   (PostgreSQL)    |
+-------------------+
```

# План работы

## Этап 1: Настройка окружения

### Фронтенд:

1. **Создать проект Nuxt.js:**
   ```bash
   npx nuxi init iintellect-frontend
   cd frontend
   npm install
   ```
2. **Установить зависимости:**
   ```bash
   npm install pinia @pinia/nuxt element-plus
   ```
3. **Настроить TypeScript (tsconfig.json).**

### Бэкенд:

1. **Создать проект NestJS:**
   ```bash
   npx @nestjs/cli new backend
   cd backend
   npm install
   ```
2. **Установить зависимости:**
   ```bash
   npm install @prisma/client dotenv
   npm install --save-dev prisma typescript @types/node
   ```
3. **Инициализировать Prisma:**

````bash
 npx prisma init
## Этап 2: Разработка бэкенда

1. Определение моделей данных:
- Настроить модели в `prisma/schema.prisma`. Пример:

```prisma
model Question {
id        Int      @id @default(autoincrement())
text      String
answers   Answer[]
}

model Answer {
id         Int      @id @default(autoincrement())
text       String
isCorrect  Boolean
questionId Int
question   Question @relation(fields: [questionId], references: [id])
}
````

2. Создание миграций:

```bash
npx prisma migrate dev --name init
```

3. Разработка сервисов и контроллеров:

- Создать модуль и сервис для работы с Prisma :

```bash
nest generate module prisma
nest generate service prisma
```

- Создать модуль и сервис для работы с вопросами :

```bash
nest generate module questions
nest generate service questions
```

4. Интеграция с Hugging Face API:
   Реализовать метод для отправки запросов к Hugging Face.

## Этап 3: Разработка фронтенда

### Создание страниц:

- **Главная страница** (`pages/index.vue`) для отображения вопросов.
- **Страница результатов** (`pages/results.vue`).

### Настройка Pinia:

Создать хранилище для управления состоянием (например, `stores/questions.ts`).

### Добавление UI-компонентов:

Использовать **Element Plus** для создания интерфейса.

### Интеграция с бэкендом:

Использовать `useFetch` или `useAsyncData` для получения данных. Пример:

```javascript
const { data, error } = await useFetch('/api/questions');
```

## Этап 4: Тестирование и доработка

### Написание тестов:

- Для компонентов: **Jest** или **Vitest**.
- Для Pinia: тестирование состояния.
- Для бэкенда: **Jest** и **Supertest**.

### Проверка работоспособности:

Протестировать все функции, включая интеграцию с **Hugging Face**.

### Внесение исправлений:

Устранить выявленные ошибки.

## Этап 5: Деплой и поддержка

### Подготовка проекта к деплою:

#### Сборка фронтенда:

```bash
npm run build
npm run start
```

#### Сборка бэкенда:

```bash
npm run build
npm run start
```

### Выбор платформы для деплоя:

- **Frontend**: Vercel.
- **Backend**: Heroku.

### Настройка CI/CD:

GitHub Actions или GitLab CI/CD.

### Мониторинг и поддержка:

**Sentry**

# Анализ диаграммы базы данных

## Таблицы

### Users (Пользователи)

| Поле          | Описание                                       |
| ------------- | ---------------------------------------------- |
| id            | Уникальный идентификатор пользователя.         |
| username      | Имя пользователя.                              |
| email         | Электронная почта.                             |
| password_hash | Хэш пароля.                                    |
| created_at    | Дата создания.                                 |
| updated_at    | Дата обновления.                               |
| role          | Роль пользователя (например, "admin", "user"). |
| phone         | Номер телефона.                                |
| first_name    | Имя.                                           |
| last_name     | Фамилия.                                       |
| second_name   | Отчество.                                      |

### Tests (Тесты)

| Поле        | Описание                                          |
| ----------- | ------------------------------------------------- |
| id          | Уникальный идентификатор теста.                   |
| user_id     | ID пользователя, создавшего тест (связь с users). |
| title       | Название теста.                                   |
| description | Описание теста.                                   |
| created_at  | Дата создания.                                    |
| updated_at  | Дата обновления.                                  |
| category    | Категория теста.                                  |

### Questions (Вопросы)

| Поле         | Описание                                                       |
| ------------ | -------------------------------------------------------------- |
| id           | Уникальный идентификатор вопроса.                              |
| test_id      | ID теста, к которому относится вопрос (связь с tests).         |
| title        | Заголовок вопроса.                                             |
| text         | Текст вопроса.                                                 |
| created_at   | Дата создания.                                                 |
| updated_at   | Дата обновления.                                               |
| has_variants | Флаг, указывающий, есть ли варианты ответов для этого вопроса. |
| variants     | Массив строк (текст вариантов ответов).                        |

### Answers (Ответы)

| Поле        | Описание                                     |
| ----------- | -------------------------------------------- |
| id          | Уникальный идентификатор ответа.             |
| question_id | ID вопроса (связь с questions).              |
| answer      | Текст ответа или индекс выбранного варианта. |
| comment     | Комментарий к ответу (опционально).          |
| created_at  | Дата создания.                               |
| updated_at  | Дата обновления.                             |

### User_Tests (Пройденные тесты)

| Поле         | Описание                                             |
| ------------ | ---------------------------------------------------- |
| id           | Уникальный идентификатор записи о прохождении теста. |
| user_id      | ID пользователя (связь с users).                     |
| test_id      | ID теста (связь с tests).                            |
| started_at   | Дата начала прохождения теста.                       |
| completed_at | Дата завершения теста.                               |
| score        | Общий балл за тест.                                  |

### User_Answer (Ответы пользователей)

| Поле         | Описание                                                  |
| ------------ | --------------------------------------------------------- |
| id           | Уникальный идентификатор ответа пользователя.             |
| user_test_id | ID записи о прохождении теста (связь с user_tests).       |
| question_id  | ID вопроса (связь с questions).                           |
| answer       | Текст ответа пользователя или индекс выбранного варианта. |
| is_correct   | Флаг, указывающий, был ли ответ правильным.               |
| answered_at  | Дата ответа.                                              |
| answer_id    | ID ответа из таблицы answers (если применимо).            |

## Объяснение связей

1. **users → tests**: Один пользователь может создать много тестов. Связь: `user_id` в таблице `tests` ссылается на `id` в таблице `users`.
2. **tests → questions**: Один тест может содержать много вопросов. Связь: `test_id` в таблице `questions` ссылается на `id` в таблице `tests`.
3. **questions → answers**: Один вопрос может иметь один или несколько ответов. Связь: `question_id` в таблице `answers` ссылается на `id` в таблице `questions`.
4. **users → user_tests**: Один пользователь может пройти много тестов. Связь: `user_id` в таблице `user_tests` ссылается на `id` в таблице `users`.
5. **tests → user_tests**: Один тест может быть пройден многими пользователями. Связь: `test_id` в таблице `user_tests` ссылается на `id` в таблице `tests`.
6. **user_tests → user_answer**: Одна запись о прохождении теста может содержать много ответов. Связь: `user_test_id` в таблице `user_answer` ссылается на `id` в таблице `user_tests`.
7. **questions → user_answer**: Каждый ответ пользователя связан с конкретным вопросом. Связь: `question_id` в таблице `user_answer` ссылается на `id` в таблице `questions`.
8. **answers → user_answer**: Если вопрос имеет варианты ответов, ответ пользователя связан с конкретным ответом из таблицы `answers`. Связь: `answer_id` в таблице `user_answer` ссылается на `id` в таблице `answers`.

API endpoints:
** tests **
1. Create test:

POST /tests
### request body:
```json
{
  "title": "Тест по математике",
  "description": "Основы алгебры",
  "categoryId": 1,
  "themeId": 2,
  "subthemeId": 3,
  "tags": ["математика", "алгебра"],
  "questions": [
    {
      "title": "Вопрос 1",
      "text": "Как решить уравнение x + 2 = 5?",
      "has_variants": true,
      "variants": ["x = 3", "x = 7"],
      "answers": [
        { "answer": "x = 3", "comment": "Правильный ответ" },
        { "answer": "x = 7", "comment": "Неправильный ответ" }
      ]
    }
  ]
}
```
### response:
```json
{
  "id": 1,
  "title": "Тест по математике",
  "description": "Основы алгебры",
  "categoryId": 1,
  "themeId": 2,
  "subthemeId": 3,
  "tags": ["математика", "алгебра"],
  "questions": [
    {
      "id": 1,
      "title": "Вопрос 1",
      "text": "Как решить уравнение x + 2 = 5?",
      "has_variants": true,
      "variants": ["x = 3", "x = 7"],
      "answers": [
        { "id": 1, "answer": "x = 3", "comment": "Правильный ответ" },
        { "id": 2, "answer": "x = 7", "comment": "Неправильный ответ" }
      ]
    }
  ]
}
```
2. Получение теста по ID
GET /tests/:id
id — уникальный ID теста (например, 1).

### response:
```json
{
  "id": 1,
  "title": "Тест по математике",
  "description": "Основы алгебры",
  "categoryId": 1,
  "themeId": 2,
  "subthemeId": 3,
  "tags": ["математика", "алгебра"],
  "questions": [
    {
      "id": 1,
      "title": "Вопрос 1",
      "text": "Как решить уравнение x + 2 = 5?",
      "has_variants": true,
      "variants": ["x = 3", "x = 7"],
      "answers": [
        { "id": 1, "answer": "x = 3", "comment": "Правильный ответ" },
        { "id": 2, "answer": "x = 7", "comment": "Неправильный ответ" }
      ]
    }
  ]
}
```
3. Обновление теста:
id — уникальный ID теста (например, 1).

### request:
```json
{
  "title": "Обновленный тест по математике",
  "description": "Новые основы алгебры",
  "categoryId": 1,
  "themeId": 2,
  "subthemeId": 3,
  "tags": ["математика", "алгебра"],
  "questions": [
    {
      "id": 1,
      "text": "Как решить уравнение x + 3 = 8?",
      "has_variants": true,
      "variants": ["x = 5", "x = 10"],
      "answers": [
        { "id": 1, "answer": "x = 5", "comment": "Правильный ответ" }
      ]
    }
  ]
}
```
### response:
```json
{
  "id": 1,
  "title": "Обновленный тест по математике",
  "description": "Новые основы алгебры",
  "categoryId": 1,
  "themeId": 2,
  "subthemeId": 3,
  "tags": ["математика", "алгебра"],
  "questions": [
    {
      "id": 1,
      "title": "Вопрос 1",
      "text": "Как решить уравнение x + 3 = 8?",
      "has_variants": true,
      "variants": ["x = 5", "x = 10"],
      "answers": [
        { "id": 1, "answer": "x = 5", "comment": "Правильный ответ" }
      ]
    }
  ]
}
```
4. Удаление теста
DELETE /tests/:id
id — уникальный ID теста (например, 1).

### response:
```json
{
  "message": "Тест успешно удален"
}
```

5. Получение списка всех тестов
GET /tests
#### Параметры (опционально)
- categoryId — фильтр по категории (например, 1).
- themeId — фильтр по теме (например, 2).
- subthemeId — фильтр по подтеме (например, 3).

Итоговый список эндпоинтов
POST
/tests
Создание нового теста
Да
Нет
GET
/tests/:id
Получение теста по ID
Нет
id
PUT
/tests/:id
Обновление теста
Да
id
DELETE
/tests/:id
Удаление теста
Нет
id
GET
/tests
Получение списка всех тестов
Нет
Опционально:
categoryId
,
themeId
,
subthemeId

| Метод | Путь         | Описание                     | Параметры (опционально) | Тело запроса |
|-------|--------------|------------------------------|-------------------------|--------------|
| POST  | /tests       | Создание нового теста         |                         | Да           |
| GET   | /tests/:id   | Получение теста по ID         | id                      | Нет          |
| PUT   | /tests/:id   | Обновление теста              | id                      | Да           |
| DELETE| /tests/:id   | Удаление теста                | id                      | Нет          |
| GET   | /tests       | Получение списка всех тестов  | categoryId, themeId, subthemeId | Нет          |







