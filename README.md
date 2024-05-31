### Подробное описание и гайд по установке и запуску приложения

#### Описание проекта

**GQT-Recomendation** — это веб-приложение, разработанное с использованием Flask и SQLAlchemy, предназначенное для управления диетами и рекомендациями по питанию. Приложение включает следующие основные компоненты:

- **app.py**: Основной файл приложения, содержащий маршруты и логику обработки запросов.
- **models.py**: Модель базы данных для хранения диетических карточек.
- **parceDiet.py**: Модуль для обработки и предоставления данных о диетах и продуктах.
- **process_json.py**: Модуль для обработки JSON-файлов и сопоставления продуктов из диет с каталогом продуктов.
- **static**: Статические файлы, включая стили CSS, скрипты JavaScript и медиафайлы.
- **templates**: Шаблоны HTML для рендеринга страниц.

#### Гайд по установке и запуску

##### Требования

- Python 3.7 или выше
- pip (Python package installer)
- Git

##### Установка

1. **Клонирование репозитория**

   ```bash
   git clone https://github.com/yourusername/GQT-Recomendation.git
   cd GQT-Recomendation
   ```

2. **Создание виртуального окружения**

   ```bash
   python -m venv venv
   source venv/bin/activate  # Для Windows: venv\Scripts\activate
   ```

3. **Установка зависимостей**

   ```bash
   pip install -r requirements.txt
   ```

##### Настройка базы данных

1. **Инициализация базы данных**

   В файле `app.py` уже предусмотрена функция `create_tables`, которая создаст необходимые таблицы в базе данных при первом запуске приложения.

##### Запуск приложения

1. **Запуск сервера**

   ```bash
   python app.py
   ```

   Приложение будет доступно по адресу `http://localhost:5001`.

##### Основные маршруты

- **`/`**: Главная страница приложения.
- **`/fetch_data`**: Получение данных о диетах.
- **`/get_images`**: Получение списка изображений.
- **`/add_diet`**: Добавление новой диетической карточки (POST).
- **`/get_diets`**: Получение списка всех диетических карточек.
- **`/update_diet/<int:diet_id>`**: Обновление диетической карточки (PUT).
- **`/delete_diet/<int:diet_id>`**: Удаление диетической карточки (DELETE).

##### Пример использования

1. **Добавление новой диеты**

   ```bash
   curl -X POST -H "Content-Type: application/json" -d '{"title": "Новая диета", "content": {"Day 1": {"Breakfast": {"Greek Yogurt with Honey and Nuts": {"description": "Греческий йогурт с медом и орехами", "ingredients": {"Yogurt": {"type of product": "dairy products"}, "Honey": {"type of product": "sweets"}, "Nuts": {"type of product": "bakery products"}}}}}}}' http://localhost:5001/add_diet
   ```

2. **Получение списка диет**

   ```bash
   curl http://localhost:5001/get_diets
   ```

3. **Обновление диеты**

   ```bash
   curl -X PUT -H "Content-Type: application/json" -d '{"title": "Обновленная диета"}' http://localhost:5001/update_diet/1
   ```

4. **Удаление диеты**

   ```bash
   curl -X DELETE http://localhost:5001/delete_diet/1
   ```