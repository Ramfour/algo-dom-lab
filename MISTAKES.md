# Мои ошибки и слабые места

---

## Категория 1. Переменные и объявления

### `const` вместо `let` для мутируемых переменных

**Где:** закомментированный вариант `sum`

**Было (ошибка):**
```js
function sum(arr) {
  const result = 0;           // ← const нельзя изменить
  for (let i = 0; i < arr.length; i++) {
    result += arr[i];         // TypeError: Assignment to constant variable
  }
  return result;
}
```

**Стало (правильно):**
```js
function sum(arr) {
  let result = 0;             // ← let можно переназначать
  for (let i = 0; i < arr.length; i++) {
    result += arr[i];
  }
  return result;
}
```

**Почему ошибка:** `const` означает "эта переменная не будет переназначена". Накопитель по определению изменяется на каждом шаге цикла, поэтому `const` здесь семантически неверен и вызовет `TypeError` в рантайме.

**Практика:**
- Напиши функцию `product(arr)` — перемножает все элементы. Используй `let` для накопителя.
- Напиши функцию `countPositive(arr)` — считает количество положительных чисел. Убедись что счётчик `let`.
- Правило: если переменная появляется слева от `=` хоть раз после объявления — это `let`.

---

## Категория 2. Флаги в циклах

### Флаг не сбрасывается перед каждым проходом

**Где:** `bubbleSort`

**Было (ошибка):**
```js
function bubbleSort(arr, compare) {
  const result = [...arr];
  for (let i = 0, l = result.length - 1, flag = false; i < l; i++) {
    // flag = false здесь нет — флаг сбрасывается только при инициализации for
    for (let j = 0; j < l - i; j++) {
      if (compare(result[j], result[j + 1])) {
        [result[j], result[j + 1]] = [result[j + 1], result[j]];
        flag = true;
      }
    }
    if (!flag) break;  // никогда не сработает после первого прохода, если была перестановка
  }
  return result;
}
```

**Стало (правильно):**
```js
function bubbleSort(arr, compare) {
  const result = [...arr];
  for (let i = 0, l = result.length - 1; i < l; i++) {
    let flag = false;           // ← сбрасываем перед каждым проходом
    for (let j = 0; j < l - i; j++) {
      if (compare(result[j], result[j + 1])) {
        [result[j], result[j + 1]] = [result[j + 1], result[j]];
        flag = true;
      }
    }
    if (!flag) break;           // теперь корректно: если проход чистый — выходим
  }
  return result;
}
```

**Почему ошибка:** флаг `flag` — это вопрос "было ли что-то сделано в этом конкретном проходе". Если не сбрасывать его перед каждым проходом, он остаётся `true` с предыдущего прохода и `break` никогда не срабатывает — оптимизация теряет смысл. Массив `[1, 2, 3, 4, 5]` (уже отсортированный) должен завершаться за один проход, но без сброса будет проходить все `n-1` раз.

**Практика:**
- Прогони `bubbleSort([1, 2, 3])` вручную по шагам — когда сработает `break`?
- Напиши флаговую версию любого цикла: "найти первый дубликат" — сбрасывай флаг правильно.
- Общее правило: спроси себя — "этот флаг про всю функцию или про одну итерацию?" Если про итерацию — объявляй внутри цикла.

---

## Категория 3. Логика ветвлений

### Лишняя ветка if/else когда одна ветка ничего не делает

**Где:** `isSortedAsc`, `isSortedDesc`

**Было (ошибка):**
```js
function isSortedAsc(arr, compare) {
  if (arr.length == 0) return 'Массив пуст';
  let flag = true;
  for (let i = 0, l = arr.length - 1; i < l; i++) {
    if (compare(arr[i + 1], arr[i]) || arr[i] == arr[i + 1]) {
      flag = true;   // ← ничего не делает, flag и так true
    } else {
      flag = false;
      break;
    }
  }
  return flag;
}
```

**Стало (правильно):**
```js
function isSortedAsc(arr, compare) {
  if (arr.length == 0) return 'Массив пуст';
  for (let i = 0, l = arr.length - 1; i < l; i++) {
    if (!compare(arr[i + 1], arr[i]) && arr[i] !== arr[i + 1]) {
      return false;  // ← нашли нарушение — сразу выходим
    }
  }
  return true;       // ← дошли до конца без нарушений
}
```

**Почему ошибка:** ветка `flag = true` не меняет состояния — это шум. Читающий код человек тратит время на понимание "а зачем это?". Кроме того, наличие внешней переменной `flag` усложняет логику без причины. Паттерн "early return" — вернуть `false` как только нашли нарушение — проще, понятнее и не требует лишней переменной.

**Практика:**
- Перепиши `isSortedDesc` самостоятельно без флага, используя early return.
- Напиши `hasNegative(arr)` — возвращает `true` если в массиве есть хотя бы одно отрицательное число. Используй early return.
- Напиши `allPositive(arr)` — возвращает `true` если все элементы положительные. Используй early return.

---

## Категория 4. Область видимости (scope)

### Глобальный поиск в DOM вместо локального

**Где:** ранняя версия обработчика кнопки в `createSwapControls`

**Было (ошибка):**
```js
function createSwapControls(pre) {
  const input1 = document.createElement('input');
  input1.className = 'array-input-i';
  // ...
  button.addEventListener('click', () => {
    const i = parseInt(document.querySelector('.array-input-i').value);
    //                  ↑ ищет ПЕРВЫЙ элемент с этим классом на всей странице
    //                    при нескольких карточках — всегда читает первую карточку
  });
}
```

**Стало (правильно):**
```js
function createSwapControls(pre) {
  const input1 = document.createElement('input');
  input1.className = 'array-input-i';
  // ...
  button.addEventListener('click', () => {
    const i = parseInt(input1.value);
    //                  ↑ замыкание: input1 — конкретная переменная этой карточки
  });
}
```

**Почему ошибка:** `document.querySelector` ищет по всему документу и возвращает первый найденный элемент. Когда на странице несколько карточек с одинаковым классом, все обработчики читают один и тот же элемент — первый на странице. Замыкание решает это: обработчик "запоминает" конкретную переменную `input1`, созданную именно для этой карточки.

**Практика:**
- Объясни себе словами: что такое замыкание и почему `input1` доступен внутри `addEventListener` после того как `createSwapControls` завершила выполнение?
- Создай три карточки вручную и проверь что каждая кнопка работает со своими input-ами.

---

## Категория 5. Параметры и зависимости

### Параметр с именем глобальной функции (variable shadowing)

**Где:** начальный вариант `average`

**Было (ошибка):**
```js
function average(arr, sum) {
  //                   ↑ параметр "sum" затеняет глобальную функцию sum()
  return sum(arr) / arr.length;
  // sum здесь — это второй аргумент, а не глобальная функция
}

// При вызове через createResultObject:
result[name] = callback(arr, compareAsc);
// average получает: arr = массив, sum = compareAsc
// sum(arr) вызывает compareAsc(arr) → вернёт undefined или NaN
```

**Стало (правильно):**
```js
function average(arr) {
  if (arr.length === 0) return 0;
  return sum(arr) / arr.length;  // sum — глобальная функция, не параметр
}
```

**Почему ошибка:** когда параметр называется так же как внешняя переменная или функция, он её "перекрывает" внутри функции. JavaScript будет использовать параметр, а не глобальную функцию. Это называется variable shadowing. Особенно опасно когда функция вызывается из другого места с неожиданным аргументом (как `createResultObject` с `compareAsc`).

**Практика:**
- Напиши функцию, которая намеренно использует shadowing и объясни что произойдёт:
```js
const x = 10;
function test(x) {
  return x * 2;  // какой x?
}
test(5);  // что вернёт?
```
- Придумай правило именования параметров чтобы избежать shadowing.

---

## Категория 6. Методы строк и объектов

### Вызов `.localeCompare` на объекте вместо строки

**Где:** `compareByColorDesc`

**Было (ошибка):**
```js
const compareByColorDesc = (a, b) => b.localeCompare(a) == 1;
//                                    ↑ a и b — объекты { kind, color, weight }
//                                    у объекта нет метода .localeCompare → TypeError
//                                    нужно обращаться к строковому полю .color
```

**Стало (правильно):**
```js
const compareByColorAsc  = (a, b) => a.color.localeCompare(b.color) > 0;
const compareByColorDesc = (a, b) => b.color.localeCompare(a.color) > 0;
//                                    ↑ .localeCompare вызывается на строке a.color
```

**Почему ошибка:** `localeCompare` — метод прототипа `String`. Объект фрукта (`{ kind, color, weight }`) его не имеет, вызов упадёт с `TypeError: b.localeCompare is not a function`. Нужно сначала достать строку из объекта через `.color`, и уже на ней вызывать метод.

**Второй баг:** `== 1` ненадёжно — `localeCompare` возвращает любое положительное число (не обязательно `1`), отрицательное или `0`. Правильная проверка — `> 0`.

**Практика:**
- Что вернёт `'banana'.localeCompare('apple')`? А `'apple'.localeCompare('banana')`?
- Отсортируй массив `fruits` по `color` через `bubbleSort(fruits, compareByColorAsc)` и проверь порядок в консоли.
- Запомни: перед вызовом метода убедись, что значение именно того типа, у которого этот метод есть.

---

## Слабые места — чекбоксы для повторения

- [ ] `const` vs `let`: когда что использовать
- [ ] Флаги в циклах: область видимости и сброс
- [ ] Early return: когда заменяет if/else с флагом
- [ ] Замыкания: почему переменная "помнится" внутри обработчика
- [ ] Variable shadowing: параметры не должны перекрывать нужные глобальные имена
- [ ] DOM scope: `element.querySelector` vs `document.querySelector`
- [ ] Coupling: зависимость через параметры vs жёсткая связь
