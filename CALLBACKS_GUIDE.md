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

## 10. Вопросы для самопроверки

1. Чем отличается `doSomething(findMin)` от `doSomething(() => findMin())`?
2. Что вернёт `(arr) => findMin(arr, compareAsc)` если убрать `.value`?
3. Почему `.value` работает — что должна вернуть `findMin`, чтобы это сработало?
4. Когда лучше использовать именованную функцию, а когда анонимную?
5. Как переписать `(arr) => findMin(arr, compareAsc).value` без стрелки?
