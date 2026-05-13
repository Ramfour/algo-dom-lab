# Дорожная карта Junior PHP Developer

Что нужно знать, чтобы устроиться на первую работу PHP-разработчиком.

---

## 1. PHP Core (обязательная база)

### Синтаксис и основы
- Переменные (`$name`), типы данных (string, int, float, bool, array, object, null)
- Константы (`define()`, `const`)
- Операторы: арифметические, сравнения, логические, строковые (конкатенация `.`)
- Условия: `if/else`, `elseif`, `switch`, тернарный оператор `?:`, null coalescing `??`
- Циклы: `for`, `while`, `do/while`, `foreach`
- Управление потоком: `break`, `continue`, `return`

### Массивы (глубоко)
- Indexed arrays: `$arr = [1, 2, 3]`
- Associative arrays: `$arr = ["key" => "value"]`
- Multidimensional arrays
- Итерация: `foreach ($arr as $key => $value)`
- Функции для работы:
  - `array_map()` — трансформация
  - `array_filter()` — фильтрация
  - `array_reduce()` — свёртка
  - `array_merge()`, `array_diff()`, `array_intersect()`
  - `in_array()`, `array_key_exists()`, `isset()`
  - `sort()`, `asort()`, `ksort()`
  - `array_push()`, `array_pop()`, `array_shift()`, `array_unshift()`

### Строки
- Конкатенация: `"Hello " . $name`
- Интерполяция: `"Hello $name"` или `"Hello {$name}"`
- Функции: `strlen()`, `strpos()`, `substr()`, `str_replace()`, `trim()`, `explode()`, `implode()`, `sprintf()`
- Регулярные выражения: `preg_match()`, `preg_replace()` (базовое знание)

### Функции
- Объявление: `function name($param) { return $value; }`
- Параметры: обязательные, опциональные (default значения)
- Type hints: `function foo(string $name): int`
- Anonymous functions (closures)
- Arrow functions (PHP 7.4+): `fn($x) => $x * 2`
- Callback функции

### Работа с файлами
- `file_get_contents()` — чтение всего файла
- `file_put_contents()` — запись в файл
- `fopen()`, `fread()`, `fwrite()`, `fclose()` — потоковая работа
- `json_encode()`, `json_decode()` — работа с JSON
- `is_file()`, `is_dir()`, `file_exists()`, `mkdir()`

---

## 2. ООП (объектно-ориентированное программирование)

### Основы
- Классы и объекты: `class User { }`, `$user = new User()`
- Свойства и методы
- Конструктор: `__construct()`
- Модификаторы доступа: `public`, `private`, `protected`
- `$this` — доступ к свойствам объекта
- Статические свойства и методы: `static`, `self::`, `ClassName::`

### Наследование и полиморфизм
- Наследование: `class Admin extends User`
- `parent::` — вызов родительского метода
- Переопределение методов (overriding)
- Полиморфизм: объекты разных классов с одинаковым интерфейсом

### Интерфейсы и трейты
- Интерфейсы: `interface Logger { public function log(); }`
- Реализация: `class FileLogger implements Logger`
- Трейты: `trait Timestampable { }`, `use Timestampable`
- Разница: интерфейс — контракт, трейт — повторное использование кода

### Абстрактные классы
- `abstract class Animal`
- Абстрактные методы: `abstract public function speak()`
- Нельзя создать экземпляр абстрактного класса

### Дополнительно
- Пространства имён: `namespace App\Models`
- `use` для импорта: `use App\Models\User`
- Автозагрузка PSR-4 и Composer
- Магические методы: `__toString()`, `__get()`, `__set()`, `__isset()`, `__unset()`

---

## 3. Базы данных

### SQL (обязательно)
- **CRUD**: SELECT, INSERT, UPDATE, DELETE
- **WHERE**, **ORDER BY**, **LIMIT**, **OFFSET**
- **JOIN**: INNER JOIN, LEFT JOIN, RIGHT JOIN
- **GROUP BY**, **HAVING**, агрегатные функции (COUNT, SUM, AVG, MIN, MAX)
- Подзапросы
- Индексы (понимание зачем нужны)

### PDO (PHP Data Objects)
```php
$pdo = new PDO("mysql:host=localhost;dbname=test", $user, $pass);

// Подготовленные запросы — защита от SQL-инъекций!
$stmt = $pdo->prepare("SELECT * FROM users WHERE id = :id");
$stmt->execute([":id" => $id]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);
```
- Подготовленные запросы (prepared statements) — обязательно!
- Режимы выборки: `FETCH_ASSOC`, `FETCH_OBJ`, `FETCH_CLASS`
- `fetchAll()`, `fetch()`, `rowCount()`

### Транзакции
```php
$pdo->beginTransaction();
try {
    // несколько запросов
    $pdo->commit();
} catch (Exception $e) {
    $pdo->rollBack();
}
```

---

## 4. Фреймворк (Laravel — самый популярный)

### Основы
- Установка: `composer create-project laravel/laravel app`
- Структура проекта: `app/`, `config/`, `database/`, `routes/`, `resources/`

### Маршрутизация (Routes)
```php
// routes/web.php
Route::get("/users", [UserController::class, "index"]);
Route::post("/users", [UserController::class, "store"]);
Route::get("/users/{id}", [UserController::class, "show"]);
```

### Контроллеры
```php
class UserController extends Controller {
    public function index() {
        return view("users.index", ["users" => User::all()]);
    }
}
```

### Eloquent ORM
- Модели: `php artisan make:model User`
- CRUD: `create()`, `find()`, `update()`, `delete()`
- Отношения:
  - `hasOne()` — один к одному
  - `hasMany()` — один ко многим
  - `belongsTo()` — обратная связь
  - `belongsToMany()` — многие ко многим
- Запросы: `where()`, `orderBy()`, `with()` (eager loading)

### Миграции и сиды
- `php artisan make:migration create_users_table`
- `php artisan migrate`, `php artisan migrate:rollback`
- `php artisan db:seed`

### Blade шаблонизатор
- `{{ $variable }}` — вывод с экранированием
- `{!! $html !!}` — вывод без экранирования
- `@if`, `@foreach`, `@for`
- `@extends`, `@section`, `@yield`, `@include`
- Компоненты: `@component`, `@slot`

### Валидация
```php
$validated = $request->validate([
    "email" => "required|email|unique:users",
    "password" => "required|min:8",
]);
```

### Middleware
```php
// app/Http/Middleware/CheckAge.php
public function handle($request, Closure $next) {
    if ($request->age < 18) {
        return redirect("home");
    }
    return $next($request);
}
```

### Дополнительно
- Сервис-контейнер и dependency injection
- Фасады (Facades)
- Events и Listeners
- Queues (очереди) — базовое понимание
- Кеширование

---

## 5. Инструменты разработчика

### Git (критично важно!)
- `git init`, `git clone`
- `git add`, `git commit`, `git push`, `git pull`
- `git status`, `git log`, `git diff`
- Ветки: `git branch`, `git checkout`, `git merge`
- Pull Requests (GitHub/GitLab)
- `.gitignore`

### Composer
- `composer install`, `composer update`
- `composer require vendor/package`
- `composer.json`, `composer.lock`
- Автозагрузка PSR-4
- Разница между require и require-dev

### Docker (базовое понимание)
- Что такое контейнер
- `docker-compose.yml`
- Dockerfile — базовый синтаксис
- Поднять Laravel проект через Docker

### PHPUnit (тестирование)
```php
class UserTest extends TestCase {
    public function test_user_can_be_created() {
        $user = User::factory()->create();
        $this->assertDatabaseHas("users", ["id" => $user->id]);
    }
}
```

### Другие инструменты
- Postman/Insomnia — тестирование API
- Xdebug — отладка
- PHP_CodeSniffer, PHP-CS-Fixer — стиль кода

---

## 6. Веб-разработка

### HTTP
- Методы: GET, POST, PUT, PATCH, DELETE
- Статусы: 200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 500 Server Error
- Заголовки: Content-Type, Authorization

### REST API
- Принципы RESTful
- JSON формат
- Создание API endpoints
- API Resource в Laravel
- Версионирование API
- Документирование API (Swagger/OpenAPI)

### Сессии и аутентификация
- `$_SESSION`, `session_start()`
- Cookies: `setcookie()`, `$_COOKIE`
- Laravel Sanctum для API токенов
- JWT (базовое понимание)

### Безопасность (критично!)
- SQL-инъекции и защита от них (prepared statements)
- XSS (Cross-Site Scripting): `htmlspecialchars()`, экранирование вывода
- CSRF (Cross-Site Request Forgery): CSRF-токены в формах
- Хеширование паролей: `password_hash()`, `password_verify()`
- HTTPS

---

## 7. Алгоритмы и структуры данных

### Сложность алгоритмов (Big O)
- O(1) — константная
- O(n) — линейная
- O(log n) — логарифмическая
- O(n²) — квадратичная
- Понимание, как оценить эффективность кода

### Сортировки
- Пузырьковая (bubble sort) — O(n²)
- Сортировка выбором (selection sort) — O(n²)
- Сортировка вставками (insertion sort) — O(n²)
- Быстрая сортировка (quick sort) — O(n log n) в среднем
- PHP: `sort()`, `asort()`, `usort()` с callback

### Поиск
- Линейный поиск — O(n)
- Бинарный поиск — O(log n) (только на отсортированном массиве)

### Структуры данных
- Массивы (всё в PHP фактически hash table)
- Стек (LIFO) — `array_push()`, `array_pop()`
- Очередь (FIFO) — `array_push()`, `array_shift()`
- Генераторы (`yield`) — для работы с большими данными

---

## 8. Частые вопросы на собеседованиях

### Теория PHP
- Разница между `==` и `===`
- Что такое `null coalescing operator` (`??`)
- Что такое `spaceship operator` (`<=>`)
- Разница между `include` и `require`
- Что такое `Trait` и чем отличается от `Interface`
- Замыкания (closures) и использование `use`
- Генераторы и `yield`
- Разница между `self` и `static`
- `__autoload` vs `spl_autoload_register`

### Практика
- Написать функцию для сортировки массива
- Реализовать Singleton
- Написать SQL запрос с JOIN
- Обработать форму с валидацией

### Паттерны проектирования (база)
- Singleton
- Factory Method
- Repository Pattern
- MVC (Model-View-Controller)

---

## 9. Soft Skills

### Для работы
- Умение читать документацию (php.net, Laravel docs)
- Английский на уровне чтения технических текстов
- Умение гуглить ошибки и читать Stack Overflow
- Понимание Git workflow

### Личные качества
- Умение учиться (технологии меняются)
- Внимание к деталям
- Коммуникация в команде
- Умение принимать код-ревью

---

## 10. Ресурсы для обучения

### Документация
- [php.net](https://php.net) — официальная документация PHP
- [Laravel Docs](https://laravel.com/docs) — документация Laravel
- [PHP The Right Way](https://phptherightway.com) — must read!

### Видеокурсы
- Laracasts (бесплатные серии по Laravel)
- YouTube каналы: Андрей Кудлай, Loftschool, WebDev с нуля

### Практика
- Codewars — алгоритмы
- LeetCode — сложные задачи
- Exercism — практика с менторством
- Создать свой проект!

### Проекты для портфолио
1. **CRUD приложение** — список задач (Todo), библиотека книг
2. **API** — REST API с авторизацией (посты, комментарии)
3. **E-commerce** — магазин с корзиной и оплатой
4. **Парсер** — сбор данных с сайтов
5. **Telegram/Discord бот**

---

## Контрольный список готовности

Отметь, что уже знаешь:

### PHP Core
- [ ] Переменные, типы, операторы
- [ ] Массивы: создание, итерация, функции
- [ ] Строки и их методы
- [ ] Функции, анонимные функции, стрелочные функции
- [ ] Работа с файлами и JSON

### ООП
- [ ] Классы, объекты, свойства, методы
- [ ] Наследование, полиморфизм
- [ ] Интерфейсы и трейты
- [ ] Модификаторы доступа
- [ ] Пространства имён и автозагрузка

### Базы данных
- [ ] SQL: SELECT, INSERT, UPDATE, DELETE, JOIN
- [ ] PDO и подготовленные запросы
- [ ] Транзакции

### Laravel
- [ ] Установка и структура проекта
- [ ] Маршруты и контроллеры
- [ ] Eloquent ORM и отношения
- [ ] Миграции и сиды
- [ ] Blade шаблоны
- [ ] Валидация форм
- [ ] Middleware

### Инструменты
- [ ] Git: commit, push, pull, branch, merge
- [ ] Composer: install, require
- [ ] Docker: базовые команды

### Безопасность
- [ ] SQL-инъекции и защита
- [ ] XSS и защита
- [ ] CSRF-токены
- [ ] Хеширование паролей

### Дополнительно
- [ ] REST API
- [ ] Алгоритмы и Big O
- [ ] PHPUnit тесты

---

## Совет на последок

Не пытайся выучить всё сразу. Начни с:
1. PHP Core + ООП
2. SQL + PDO
3. Laravel + небольшой проект
4. Git
5. Безопасность

Практика важнее теории. Создай свой проект и выложи на GitHub — это лучшее, что можно показать работодателю.
