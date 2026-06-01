# Проблемы проекта и их решения

Конспект архитектурных решений, принятых в ходе разработки `algo-dom-lab`.
Будет использован как основа для README.

---

## 1. Жёсткий `compareAsc` в `createResultObject`

**Проблема:**
`createResultObject` всегда передавала `compareAsc` вторым аргументом в callback, даже когда алгоритм его не использует или ожидает другой аргумент.

```js
// было — compareAsc жёстко зашит
result[name] = callback(arr, compareAsc);
```

Для `linearSearch` нужен `target`, а не компаратор. С жёстким `compareAsc` поиск всегда получал функцию вместо числа.

**Решение:**
Добавить параметр `arg` с дефолтным значением `compareAsc`:

```js
function createResultObject(data, callback, arg = compareAsc) {
  const result = {};
  for (const [name, arr] of Object.entries(data)) {
    result[name] = callback(arr, arg);
  }
  return result;
}
```

Теперь при вызове без третьего аргумента поведение не меняется, но можно передать любой нужный аргумент:

```js
createResultObject(testData, linearSearch, 7); // ищем число 7
createResultObject(testData, bubbleSort);       // compareAsc по умолчанию
```

**Паттерн:** параметр с дефолтным значением как мягкая зависимость.

---

## 2. Большой `switch` в `handleAlgorithmChange`

**Проблема:**
`switch` с 15+ кейсами — плохо масштабируется. Добавление нового алгоритма требует вставки нового `case` в середину функции. Каждый кейс повторяет одну и ту же структуру `renderCards(createResultObject(...), createArrayCard)`.

```js
// было — повторяющийся шаблон на каждый алгоритм
case 'sum':
  const sumResult = createResultObject(testData, sum);
  renderCards(sumResult, createArrayCard);
  break;
case 'average':
  const averageResult = createResultObject(testData, average);
  renderCards(averageResult, createArrayCard);
  break;
// ... ещё 13 кейсов
```

**Решение:**
Объект-диспетчер (dispatch table) — объект, где ключ = название алгоритма, значение = функция-обработчик:

```js
const algorithmHandlers = {
  'sum':     () => renderCards(createResultObject(testData, sum), createArrayCard),
  'average': () => renderCards(createResultObject(testData, average), createArrayCard),
  // ...
};

function handleAlgorithmChange(name) {
  const handler = algorithmHandlers[name];
  if (handler) handler();
}
```

**Результат:**
- `handleAlgorithmChange` сжалась с ~60 строк до 3
- Добавить новый алгоритм = одна строка в объекте
- Нет `break`, нет `case`, нет риска "провала" (fall-through)

**Паттерн:** Command pattern / dispatch table.

---

## 3. Фрукты несовместимы с числовыми данными

**Проблема:**
`fruits` был массивом объектов `[{kind, color, weight}]`, а вся инфраструктура (`createResultObject`, `renderCards`) работала с объектом массивов `{key: [...]}`.

**Решение:**
Привести `fruits` к тому же формату:

```js
const fruitsData = {
  mango:  { kind: 'Манго',  color: 'желтый',  weight: 10 },
  kiwi:   { kind: 'Киви',   color: 'зеленый', weight: 5  },
  // ...
};
```

`renderCards` работает с `fruitsData` без изменений — нужно только передать правильный `createFruitCard` вместо `createArrayCard`.

**Принцип:** единый формат данных позволяет переиспользовать инфраструктурные функции.

---

## 4. Дублирование сортировки фруктов

**Проблема:**
Каждый кейс сортировки фруктов повторял одно и то же:

```js
case 'Фрукты — по весу ↑': {
  const sorted = Object.fromEntries(
    Object.entries(fruitsData).sort(([, a], [, b]) => compareByWeightAsc(b, a) ? 1 : -1)
  );
  renderCards(sorted, createFruitCard);
  break;
}
// то же самое для ↓, А→Я, Я→А
```

**Решение:**
Вынести повторяющуюся логику в вспомогательную функцию:

```js
const sortFruits = (compare) => Object.fromEntries(
  Object.entries(fruitsData).sort(([, a], [, b]) => compare(b, a) ? 1 : -1)
);

// использование — одна строка на кейс:
'Фрукты — по весу ↑': () => renderCards(sortFruits(compareByWeightAsc), createFruitCard),
```

**Принцип:** DRY (Don't Repeat Yourself) — повторяющийся код → вспомогательная функция с параметром.

---

## 5. Плоский список алгоритмов в селекторе

**Проблема:**
Все алгоритмы (числовые и фруктовые) находились в одном плоском массиве `algorithms`. При добавлении фруктов список стал смешанным и нечитаемым.

**Решение:**
Разбить на группы через `<optgroup>`. Данные переструктурированы:

```js
const algorithmGroups = [
  { label: 'Числа',   options: ['findMin', 'findMax', ...] },
  { label: 'Фрукты',  options: ['Фрукты — исходные', ...] },
];
```

`createAlgorithmSelector` обновлена для работы с группами — создаёт `<optgroup>` для каждой группы.

**Результат:** селектор визуально разделён, легко добавить новую группу данных.

---

## 6. `switch` vs объект-диспетчер — когда что применять

### Названия концепции

Объект-диспетчер известен под несколькими именами:
- **Dispatch table** — самое точное название
- **Lookup table** — общее: "найди по ключу вместо if/else"
- **Command pattern** — паттерн из Gang of Four: действие обёрнуто в объект
- **Strategy pattern** — алгоритм выбирается по ключу в рантайме

### Когда `switch`

- Кейсов мало (3–5) и список закрытый
- Нужен fall-through (несколько кейсов → один блок)
- Логика кейсов сильно отличается друг от друга
- Разовый скрипт, не библиотека

### Когда объект-диспетчер

- Кейсов много (6+) и список будет расти
- Все кейсы имеют одинаковую структуру
- Нужно добавлять новые кейсы без изменения основной функции
- Обработчики нужно передавать как данные

### Как запомнить

> `switch` — это **ветвление**: "смотри на значение, делай разное".
> Объект-диспетчер — это **таблица**: "ищи по ключу, вызывай найденное".

### Уровень

`switch` — джун. Объект-диспетчер и понимание когда его применять — мидл.

### Пример из проекта

```js
// было — switch на 60 строк, каждый кейс повторяет шаблон
switch (selectedAlgorithm) {
  case 'sum':
    const sumResult = createResultObject(testData, sum);
    renderCards(sumResult, createArrayCard);
    break;
  // ... ещё 13 кейсов
}

// стало — dispatch table, handleAlgorithmChange = 3 строки
const algorithmHandlers = {
  'sum':     () => renderCards(createResultObject(testData, sum), createArrayCard),
  'average': () => renderCards(createResultObject(testData, average), createArrayCard),
  // добавить новый алгоритм = одна строка
};

function handleAlgorithmChange(name) {
  const handler = algorithmHandlers[name];
  if (handler) handler();
}
```

---

## Итого: применённые паттерны

| Паттерн | Где применён |
|---|---|
| Default parameter | `createResultObject(data, callback, arg = compareAsc)` |
| Dispatch table | `algorithmHandlers` вместо `switch` |
| DRY / вспомогательная функция | `sortFruits(compare)` |
| Единый формат данных | `fruitsData` как объект, аналогичный `testData` |
| Optgroup / группировка | `algorithmGroups` с `label` и `options` |

---

## Чеклист чистоты кода перед публикацией

Что считается мусором в коде и должно быть убрано перед показом работодателю:

### Убрать обязательно

- `console.log` оставшиеся от отладки — в проекте есть `console.log('Выбран алгоритм:', selectedAlgorithm)` в обработчике селектора
- `// TODO` без планов реализации

### Оставить (учебный контекст)

- Закомментированные альтернативные реализации с пояснением — например в `sum` и `average`, они показывают что автор знает несколько подходов
- Комментарии объясняющие логику алгоритма
- `MISTAKES.md` — показывает рефлексию и рост
- `PROBLEMS_AND_SOLUTIONS.md` — показывает архитектурное мышление

### Что добавить перед публикацией

- `README.md` — что за проект, какие алгоритмы реализованы, как запустить. Основа — этот файл.
