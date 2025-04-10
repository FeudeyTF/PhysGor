# PhysGor

PhysGor — это интерактивное веб-приложение, разработанное для помощи школьникам в изучении и повторении законов и формул физики с помощью карточек и интерактивных режимов тренировки.

## 📖 Описание

Приложение предоставляет несколько способов обучения и запоминания физических законов и формул:

- **Карточки**: Просматривайте коллекцию физических законов, формул и пояснений
- **Интерактивные тренировки**: Проверяйте свои знания с помощью различных режимов тренировки
- **Редактор формул**: Просматривайте и редактируйте физические формулы с помощью редактора форматированного текста

## ✨ Функции

- **Каталог законов**: Просматривайте и ищите физические законы с фильтрацией по категории, сложности и школьному классу
- **Несколько режимов тренировки**:
  - **Карточки**: Классический способ повторения физических законов с помощью карточек
  - **Тесты**: Обучение на основе тестов с несколькими вариантами ответов
  - **Соответствия**: Сопоставление формул с названиями законов
  - **Запись формул**: Практика написания формул по памяти
- **Панель администратора**: Добавление, редактирование и удаление физических законов (требуется аутентификация)
- **Адаптивный дизайн**: Работает на настольных и мобильных устройствах
- **Поддержка тем**: Светлая и темная темы оформления

## 🔧 Установка

### Требования

- [Node v22.11+](https://nodejs.org/en/download/)

### Настройка

1. Клонируйте репозиторий (или скачайте [отсюда](https://github.com/FeudeyTF/PhysGor) ZIP архив):
   ```bash
   git clone https://github.com/FeudeyTF/PhysGor
   cd PhysGor
   ```

2. Установите зависимости:
   ```bash
   npm install
   ```

3. Настройте приложение:
   - Обновите `server/config.json` с предпочитаемым портом и ключом аутентификации для backend-сервера
   - Настройте `src/config.json` для корректного взаимодействия с backend-сервером со стороны клиента

4. Запустите проект:

    С помощью команды (запустит dev-сервер)
   ```bash
   npm start
   ```
   
   Или используйте скрипты из папки `bin`:
   - `physgor-dev.bat` - Запуск dev-сервера
   - `physgor-server.bat` - Запуск production-сервера
   - `build.bat` - Создаст оптимизированную сборку приложения
   - `clean.bat` - Очистка артефактов сборки

## 🚀 Использование

После запуска приложения:

1. Создавайте и просматривайте физические законы на главной странице
2. Используйте фильтры для поиска конкретных законов по категории, сложности или школьному классу
3. Перейдите на страницу тренировки, чтобы проверить свои знания
4. Выберите один из четырех различных режимов тренировки в зависимости от ваших предпочтений в обучении
5. Для администраторов: войдите с помощью ключа аутентификации для управления контентом

## 📋 Структура проекта

```
├── bin/                  # BAT скрипты для запуска
├── public/               # Папка со статическими файлами
├── server/               # Серверная часть приложения (backend)
│   ├── api.js            # Реализация backend-сервера
│   ├── config.json       # Конфигурация сервера
│   └── laws.json         # База данных физических законов
├── src/                  # Клиентская часть приложения (frontend)
│   ├── components/       # Компоненты
│   ├── context/          # Компонент аутентификации и темы фронтенда
│   ├── data/             # Управление данными
│   ├── modals/           # Код модальных окон
│   ├── pages/            # Код страниц фронтенда
│   ├── styles/           # SCSS стили
│   └── types/            # Абстрактные типы данных
├── package.json          # Зависимости npm и скрипты
└── tsconfig.json         # Конфигурация TypeScript
```

## 📄 Лицензия

Весь код в проекте лицензирован под [MIT](LICENSE).

## 📬 Контакты

Проект создан и поддерживается [FeudeyTF](https://github.com/FeudeyTF).
