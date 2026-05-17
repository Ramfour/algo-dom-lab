// DOM ЭЛЕМЕНТЫ
const container = document.querySelector('.tasks-container');
const algorithmSelector = document.querySelector('.algorithm-selector');


// ДАННЫЕ
const testData = {
  numbers1: [6, 3, 1, 7, 8, 10, 0],
  numbers2: [1, 2, 3, 4, 5],
  numbers3: [5, 4, 3, 2, 1],
  numbers4: [1],
  numbers5: [],
  numbers6: [3, 3, 1, 2, 2],
};

const fruitsData = {
  mango:  { kind: 'Манго', color: 'желтый', weight: 10},
  kiwi:   { kind: 'Киви', color: 'зеленый', weight: 5},
  papaya: { kind: 'Папайя', color: 'оранжевый', weight: 15},
  lychee: { kind: 'Личи', color: 'розово-красный', weight: 3},
};

const algorithmGroups = [
  {
    label: 'Числа',
    options: [
      'Выберите алгоритм',
      'findMin', 'findMax', 'findMinIndex', 'findMaxIndex',
      'swap', 'isSortedAsc', 'isSortedDesc', 'sum',
      'average', 'reverseArray', 'Bubble Sort', 
      'Selection Sort', 'Insertion Sort', 'Linear Search',
    ],
  },
  {
    label: 'Фрукты',
    options: [
      'Фрукты — исходные',
      'Фрукты — по весу ↑',
      'Фрукты — по весу ↓',
      'Фрукты — по цвету А→Я',
      'Фрукты — по цвету Я→А',
    ],
  },
];


// УТИЛИТЫ (Вспомогательные функции compare)
const compareAsc = (a, b) => a > b;
const compareDesc = (a, b) => a < b;
const compareByWeightAsc = (a, b) => a.weight > b.weight;
const compareByWeightDesc = (a, b) => a.weight < b.weight;
const compareByColorAsc = (a, b) => a.color.localeCompare(b.color) > 0;
const compareByColorDesc = (a, b) => b.color.localeCompare(a.color) > 0;


// АЛГОРИТМЫ
function findMin(arr, compare) {
    if (arr.length === 0) return { index: undefined, value: undefined };
    let minIndex = 0;
    for (let i = 1; i < arr.length; i++) {
      if (compare(arr[minIndex], arr[i])) {
        minIndex = i;
      }
    }
    return {index:minIndex, value:arr[minIndex]};
}

function findMax(arr, compare) {
  if (arr.length === 0) return { index: undefined, value: undefined };
  let maxIndex = 0;
  for (let i = 1; i < arr.length; i++) {
    if (compare(arr[i], arr[maxIndex])) {
      maxIndex = i;
    }
  }
  return {index:maxIndex, value:arr[maxIndex]};
}

  function bubbleSort (arr, compare){
    const result = [...arr];
    for (let i = 0, l = result.length - 1, flag;  i < l; i++)
      {
        flag = false;
        for (let j = 0; j < l - i ; j++ ){
          if (compare(result[j], result[j + 1])) {
            [result[j], result[j + 1]] = [result[j + 1], result[j]];
            flag = true;
          }
        }
        if (!flag) break;        
      }
      return result;
  }

  function insertionSort (arr, compare){
    const result = [...arr];
    for (let i = 1, l = result.length; i < l; i++ ){
      const current = result[i];
      let j = i - 1;
      while (j >= 0 && compare(result[j], current)) {
        result[j + 1] = result[j];
        j--;
      }
      result[j + 1] = current;
    }

    return result;
  }

  function swap(arr, i, j){
    const result = [...arr];
    if (result.length <= 0 || i >= result.length || j >= result.length) return undefined;
    [result[i], result[j]] = [result[j], result[i]];
    return result
  };

  function isSortedAsc(arr, compare){
    if (arr.length == 0) return 'Массив пуст';
    for (let i = 0, l = arr.length - 1; i < l; i++){
      if (!compare(arr[i + 1], arr[i]) && arr[i] !== arr[i + 1]) {
        return false;
      }
    }
    return true;
  }

  function isSortedDesc(arr, compare){
    if (arr.length == 0) return 'Массив пуст';
    for (let i = 0, l = arr.length - 1; i < l; i++){
      if (!compare(arr[i], arr[i + 1]) && arr[i] !== arr[i + 1]) {
        return false;
      }
    }
    return true;
  }

  function sum(arr){
    /*
    let result = 0;
    for (let i = 0, l = arr.length - 1; i < l; i++){
      result += arr[i]
    }
    return result
    Один из способов
    */
    return arr.reduce((acc, number) => acc + number, 0)
  }

  function average (arr){
    if (arr.length === 0) return 0;
    // Тут можно воспользоваться сделанной заранее функцией.
    // # В это раз callback не передаем, так как он сломает логику createResultObject
    return sum(arr) / arr.length; 
    /*
    Если бы остутствовал sum:
    let sum = arr.reduce((acc, number) => acc + number, 0);
    return Math.round( sum / arr.length * 100 ) / 100
    */
  }

  function reverseArray (arr){
    if (arr.length <= 1) return arr;
    const result = [...arr];
    for (let i = 0, l = result.length - 1; i < l ; i++, l--){
      [result[i], result[l]] = [result[l], result[i]];  
    }
    return result
  }
  // функция линейного поиска O(n)
  function linearSearch(arr, target){ // arr не изменняется, поэтому не мутирует
    let result = - 1;
    if (arr.length == 0) return result;
    for (let i = 0, l = arr.length - 1; i < l; i++){
      if (arr[i] == target) {
        result = i;
        return result; // Можно вернуть после цикла, но я хочу до первого совпадения
      }
    }
    return result;
  }

// DOM-ФУНКЦИИ (создание элементов)
function createFruitCard(name, fruit, parentContainer) { // функция создания карточки фрукта
  const card = document.createElement('div');
  card.className = 'fruit-card';

  const title = document.createElement('h3');
  title.className = 'fruit-card__name';
  title.textContent = fruit.kind;

  const tags = document.createElement('div');
  tags.className = 'fruit-card__tags';

  const colorTag = document.createElement('span');
  colorTag.className = 'fruit-card__tag';
  colorTag.textContent = fruit.color;

  const weightTag = document.createElement('span');
  weightTag.className = 'fruit-card__tag fruit-card__tag--weight';
  weightTag.textContent = fruit.weight + ' г';

  tags.append(colorTag, weightTag);
  card.append(title, tags);
  parentContainer.appendChild(card);
}

function createArrayCard(name, arr, parentContainer) { // функция создания карточки массива
  const card = document.createElement('div');
  card.className = 'array-card';

  const title = document.createElement('h3');
  title.textContent = name;

  const pre = document.createElement('pre');
  pre.textContent = JSON.stringify(arr, null, 2);

  const inputContainer = createSwapControls(pre);

  const isSortedAscContainer = createIsSortedAscContainer(pre);
  const isSortedDescContainer = createIsSortedDescContainer(pre);
  
  card.append(title, pre, inputContainer, isSortedAscContainer, isSortedDescContainer);
  parentContainer.appendChild(card);

}

function createSwapControls(pre) { // функция создания контролов для swap
   const inputContainer = document.createElement('div');
  inputContainer.className = 'input-container';
  
  const input1 = document.createElement('input');
  input1.type = 'text';
  input1.className = 'array-input-i';
  input1.placeholder = 'Введите первый индекс';

  const input2 = document.createElement('input');
  input2.type = 'text';
  input2.className = 'array-input-j';
  input2.placeholder = 'Введите второй индекс';

  const button = document.createElement('button');
  button.textContent = 'Применить';
  button.className = 'apply-button';

  button.addEventListener('click', () => { // через замыкание получаем доступ к pre
    const currentArr = JSON.parse(pre.textContent);
    const i = parseInt(input1.value);
    const j = parseInt(input2.value);
    const result = swap(currentArr, i, j);
    pre.textContent = JSON.stringify(result, null, 2);
  });

  inputContainer.append(button, input1, input2);
  inputContainer.classList.add('hidden');

  return inputContainer;
}

function createIsSortedAscContainer(pre) {
  const isSortedAscContainer = document.createElement('div');
  isSortedAscContainer.className = 'is-sorted-container';
  isSortedAscContainer.classList.add('hidden');
  const currentArr = JSON.parse(pre.textContent);
  const isSorted = isSortedAsc(currentArr, compareAsc);
  const result = document.createElement('div');
  if (isSorted === 'Массив пуст') {
    result.textContent = 'Массив пуст';
  } else {
    result.textContent = isSorted ? 'Массив отсортирован по возрастанию' : 'Массив не отсортирован по возрастанию';
  }
  isSortedAscContainer.appendChild(result);
  return isSortedAscContainer;
}

function createIsSortedDescContainer(pre) {
  const isSortedDescContainer = document.createElement('div');
  isSortedDescContainer.className = 'is-sorted-desc-container';
  isSortedDescContainer.classList.add('hidden');
  const currentArr = JSON.parse(pre.textContent);
  const isSorted = isSortedDesc(currentArr, compareDesc);
  const result = document.createElement('div');
  if (isSorted === 'Массив пуст') {
    result.textContent = 'Массив пуст';
  } else {
    result.textContent = isSorted ? 'Массив отсортирован по убыванию' : 'Массив не отсортирован по убыванию';
  }
  isSortedDescContainer.appendChild(result);
  return isSortedDescContainer;
}

function inputNowVisible(inputContainer) { // функция показа инпута
  inputContainer.classList.remove('hidden');
}

function createAlgorithmSelector(parentContainer, groups) { // функция создания селекта с алгоритмами
  const select = document.createElement('select');
  select.className = 'algorithm-select';

  groups.forEach(group => {
    const optgroup = document.createElement('optgroup');
    optgroup.label = group.label;
    group.options.forEach(name => {
      const option = document.createElement('option');
      option.value = name;
      option.textContent = name;
      optgroup.appendChild(option);
    });
    select.appendChild(optgroup);
  });

  parentContainer.appendChild(select);
}


// КОНТРОЛЛЕРЫ (связка логики и DOM)
function createResultObject(data, callback, arg = compareAsc) { // функция создает объект с результатами работы алгоритма
  const result = {};
  for (const [name, arr] of Object.entries(data)) {
    result[name] = callback(arr, arg);
  }
  return result;
}



function renderCards(data, callback) { // функция рендерит карточки с массивами
  container.innerHTML = '';
  for (const [name, arr] of Object.entries(data)) {
    callback(name, arr, container);
  }
}

const sortFruits = (compare) => Object.fromEntries( // вспомогательная: сортирует fruitsData по компаратору
  Object.entries(fruitsData).sort(([, a], [, b]) => compare(b, a) ? 1 : -1)
);

const algorithmHandlers = { // объект-диспетчер: ключ — название алгоритма, значение — функция-обработчик
  'Выберите алгоритм': () => renderCards(testData, createArrayCard),

  'findMin':      () => renderCards(createResultObject(testData, arr => findMin(arr, compareAsc).value), createArrayCard),
  'findMax':      () => renderCards(createResultObject(testData, arr => findMax(arr, compareAsc).value), createArrayCard),
  'findMinIndex': () => renderCards(createResultObject(testData, arr => findMin(arr, compareAsc).index), createArrayCard),
  'findMaxIndex': () => renderCards(createResultObject(testData, arr => findMax(arr, compareAsc).index), createArrayCard),

  'swap': () => {
    renderCards(testData, createArrayCard);
    document.querySelectorAll('.input-container').forEach(inputNowVisible);
  },
  'isSortedAsc': () => {
    renderCards(testData, createArrayCard);
    document.querySelectorAll('.is-sorted-container').forEach(inputNowVisible);
  },
  'isSortedDesc': () => {
    renderCards(testData, createArrayCard);
    document.querySelectorAll('.is-sorted-desc-container').forEach(inputNowVisible);
  },

  'sum':          () => renderCards(createResultObject(testData, sum), createArrayCard),
  'average':      () => renderCards(createResultObject(testData, average), createArrayCard),
  'reverseArray': () => renderCards(createResultObject(testData, reverseArray), createArrayCard),
  'Bubble Sort':  () => renderCards(createResultObject(testData, bubbleSort), createArrayCard),
  'Insertion Sort': () => renderCards(createResultObject(testData, insertionSort), createArrayCard),
  'Selection Sort': () => { /* TODO */ },

  'Linear Search': () => {
    const target = prompt('Введите число, индекс которого надо найти');
    renderCards(createResultObject(testData, linearSearch, target), createArrayCard);
  },

  'Фрукты — исходные':   () => renderCards(fruitsData, createFruitCard),
  'Фрукты — по весу ↑':  () => renderCards(sortFruits(compareByWeightAsc), createFruitCard),
  'Фрукты — по весу ↓':  () => renderCards(sortFruits(compareByWeightDesc), createFruitCard),
  'Фрукты — по цвету А→Я': () => renderCards(sortFruits(compareByColorAsc), createFruitCard),
  'Фрукты — по цвету Я→А': () => renderCards(sortFruits(compareByColorDesc), createFruitCard),
};

function handleAlgorithmChange(selectedAlgorithm) { // функция обрабатывает выбор алгоритма
  const handler = algorithmHandlers[selectedAlgorithm];
  if (handler) handler();
}


// ИНИЦИАЛИЗАЦИЯ
createAlgorithmSelector(algorithmSelector, algorithmGroups); // создаем селектор с алгоритмами
renderCards(testData, createArrayCard); // рендерим карточки с массивами

algorithmSelector.addEventListener('change', (event) => { // добавляем обработчик события изменения селектора
  const selectedAlgorithm = event.target.value;
  console.log('Выбран алгоритм:', selectedAlgorithm);
  handleAlgorithmChange(selectedAlgorithm);
});

