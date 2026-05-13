# Функции как значения: callback, обёртки и адаптеры

---

## 1. Функция — это значение

В JavaScript функция — это обычное значение, как число или строка.
Её можно положить в переменную, передать в другую функцию, вернуть из функции.

```js
function sayHello() {
  console.log('Hello');
}

const fn = sayHello;  // положили функцию в переменную
fn();                 // вызвали — выведет 'Hello'
```

---

## 2. Callback — функция, переданная как аргумент

Когда функция принимает другую функцию как аргумент — эта переданная функция называется **callback**.

```js
function doTwice(callback) {
  callback();
  callback();
}

doTwice(sayHello);  // выведет 'Hello' дважды
```

`callback` — это просто параметр. Внутри функции ты вызываешь его как обычную функцию.

---

## 3. Анонимная функция — функция без имени

Вместо того, чтобы объявлять отдельную именованную функцию,
можно создать её прямо на месте и сразу передать.

```js
// Именованная функция:
function double(x) {
  return x * 2;
}
doSomething(double);

// То же самое, но анонимно:
doSomething(function(x) {
  return x * 2;
});
```

---

## 4. Стрелочная функция — короткая запись

```js
// Обычная:
function double(x) {
  return x * 2;
}

// Стрелочная:
const double = (x) => x * 2;
//              ↑       ↑
//           параметр  тело (return подразумевается)
```

Если тело одна строка — фигурные скобки и `return` не нужны.

---

## 5. Разбор записи `(arr) => findMin(arr, compareAsc).value`

```js
createResultObject(testData, (arr) => findMin(arr, compareAsc).value)
```

Читаем по частям:

```
(arr)                      — параметр анонимной функции
=>                         — стрелка, разделяет параметры и тело
findMin(arr, compareAsc)   — вызов findMin, передаём arr и компаратор
.value                     — берём только поле value из возвращённого объекта
```

`findMin` возвращает объект: `{ index: 2, value: 1 }`.
`.value` достаёт из него только число `1`.

---

## 6. Почему нельзя просто передать `findMin`

```js
// Передаём findMin напрямую:
createResultObject(testData, findMin)

// Внутри createResultObject вызывается:
result[name] = findMin(arr, compareAsc)
// findMin вернёт: { index: 2, value: 1 }
// в карточке отобразится: "[object Object]" — не то, что нужно
```

```js
// Передаём обёртку:
createResultObject(testData, (arr) => findMin(arr, compareAsc).value)

// Внутри createResultObject вызывается:
result[name] = ((arr) => findMin(arr, compareAsc).value)(arr)
// вернёт: 1 — уже число
```

---

## 7. Обёртка (wrapper) — адаптер между двумя интерфейсами

Когда функция возвращает не то, что нужно, оборачиваем её:

```js
// findMin возвращает объект { index, value }
// нам нужно только число

// Обёртка для значения:
(arr) => findMin(arr, compareAsc).value   // вернёт 1

// Обёртка для индекса:
(arr) => findMin(arr, compareAsc).index   // вернёт 2
```

Обёртка не меняет оригинальную функцию.
Она просто трансформирует результат "на лету".

---

## 8. Сравнение: именованная vs анонимная обёртка

```js
// Длинный вариант — именованная функция:
function getMinValue(arr) {
  return findMin(arr, compareAsc).value;
}
createResultObject(testData, getMinValue);


// Короткий вариант — анонимная стрелочная:
createResultObject(testData, (arr) => findMin(arr, compareAsc).value);
```

Оба варианта делают одно и то же.
Анонимная удобна, когда функцию используешь только один раз.
Именованная удобна, когда планируешь переиспользовать.

---

## 9. Реальные примеры из JS

```js
// Array.map — callback вызывается для каждого элемента:
[1, 2, 3].map((x) => x * 2);         // [2, 4, 6]

// Array.filter — callback возвращает true/false:
[1, 2, 3, 4].filter((x) => x > 2);   // [3, 4]

// Array.sort — callback-компаратор:
[3, 1, 2].sort((a, b) => a - b);      // [1, 2, 3]
```

Во всех случаях ты передаёшь анонимную стрелочную функцию как callback.

---

## 10. Жёсткая связь vs Dependency Injection

### Жёсткая связь (tight coupling)

Когда функция напрямую вызывает другую, глобальную функцию — она жёстко привязана к ней:

```js
function average(arr) {
  if (arr.length === 0) return 0;
  return sum(arr) / arr.length;  // жёстко завязана на глобальную sum
}

// average нельзя использовать с другой реализацией суммы
// average нельзя протестировать с мок-функцией
```

### Dependency Injection через параметр

Передаём зависимость параметром — функция становится гибкой:

```js
function average(arr, sumFn) {
  if (arr.length === 0) return 0;
  return sumFn(arr) / arr.length;  // работает с любой sumFn
}

// Используем с разными функциями:
average([1, 2, 3], sum);                    // наша функция
average([1, 2, 3], (arr) => arr.reduce(...)); // inline
average([1, 2, 3], mockSum);                 // для тестов
```

### Параметр по умолчанию

Комбинируем гибкость и удобство — значение по умолчанию:

```js
function average(arr, sumFn = sum) {
  if (arr.length === 0) return 0;
  return sumFn(arr) / arr.length;
}

// Можно вызвать без параметра — используется дефолт:
average([1, 2, 3])  // sumFn = sum

// Можно подменить:
average([1, 2, 3], myCustomSum)
```

### Скрытый параметр через rest

Если функция вызывается из другой функции, которая всегда передаёт лишний аргумент:

```js
// createResultObject всегда передаёт compareAsc вторым аргументом
result[name] = callback(arr, compareAsc);

// average может игнорировать его:
function average(arr, ...args) {
  const sumFn = args[0] || sum;  // args[0] это compareAsc, берём дефолт sum
  if (arr.length === 0) return 0;
  return sumFn(arr) / arr.length;
}
```

**Почему это работает:** `args` — массив всех аргументов после `arr`. `args[0]` — это `compareAsc`, но мы его игнорируем и берём `sum` по умолчанию.

### Правило большого пальца

| Ситуация | Подход |
|----------|--------|
| Внутренние связанные функции в одном модуле | Жёсткая связь — проще читать |
| Функция может понадобиться с разными реализациями | Dependency injection |
| Публичное API, библиотека | Dependency injection + дефолты |
| Тестирование (юнит-тесты) | Dependency injection — обязательно |

---

## 11. Задания для практики

**Задание 1: Сделать average гибкой**

Перепиши `average` так, чтобы она принимала функцию суммирования параметром с дефолтом:

```js
function average(arr, sumFn = sum) {
  // твой код
}
```

Проверь, что работает:
- `average([1, 2, 3])` — использует глобальную `sum`
- `average([1, 2, 3], (arr) => arr.reduce(...))` — использует переданную функцию

---

**Задание 2: Функция product (произведение)**

Напиши функцию `product(arr, multiplyFn)`, которая перемножает все числа в массиве.

```js
// multiplyFn по умолчанию: (arr) => arr.reduce((acc, n) => acc * n, 1)
product([2, 3, 4])        // 24
product([2, 3, 4], myMul) // может быть другой результат
```

---

**Задание 3: Максимум с кастомным сравнением**

`findMax` использует `compare`. Сделай версию, которая по умолчанию ищет максимум, но может искать "максимум по модулю":

```js
function flexibleMax(arr, keyFn = (x) => x) {
  // keyFn преобразует элемент перед сравнением
  // по умолчанию: keyFn(5) === 5
  // для модуля: keyFn(-10) === 10
}

flexibleMax([1, -5, 3])              // -5 (обычный максимум)
flexibleMax([1, -5, 3], Math.abs)    // -5 (максимум по модулю, это -5, модуль 10)
```

---

**Задание 4: compose — композиция функций**

Напиши функцию `compose`, которая принимает две функции и возвращает новую:

```js
const double = (x) => x * 2;
const addOne = (x) => x + 1;

const doubleThenAddOne = compose(addOne, double);
// doubleThenAddOne(5) → double(5)=10 → addOne(10)=11 → 11

doubleThenAddOne(5)  // 11
```

**Подсказка:** `compose(f, g)` возвращает функцию `(x) => f(g(x))`

---

**Задание 5: pipe — цепочка обработки**

Напиши функцию `pipe`, которая принимает массив функций и применяет их последовательно:

```js
const steps = [
  (arr) => arr.filter(x => x > 0),  // убрать отрицательные
  (arr) => arr.map(x => x * 2),     // удвоить
  (arr) => arr.reduce((a, b) => a + b, 0)  // сложить
];

pipe([-1, 2, -3, 4], steps)  // 2*2 + 4*2 = 12
```

**Подсказка:** используй `reduce` для прохода по массиву функций.

---

## 12. Вопросы для самопроверки

1. Чем отличается `doSomething(findMin)` от `doSomething(() => findMin())`?
2. Что вернёт `(arr) => findMin(arr, compareAsc)` если убрать `.value`?
3. Почему `.value` работает — что должна вернуть `findMin`, чтобы это сработало?
4. Когда лучше использовать именованную функцию, а когда анонимную?
5. Как переписать `(arr) => findMin(arr, compareAsc).value` без стрелки?
