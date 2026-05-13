/* ## Этап 1. База массивов и индексов

Задания:
1. Напиши `findMin(arr)` — принимает массив чисел, возвращает наименьшее число.
2. Напиши `findMax(arr)` — принимает массив чисел, возвращает наибольшее число.
3. Напиши `findMinIndex(arr)` — принимает массив чисел, возвращает индекс наименьшего 
элемента.
4. Напиши `findMaxIndex(arr)` — принимает массив чисел, возвращает индекс наибольшего 
элемента.
5. Напиши `swap(arr, i, j)` — принимает массив и два индекса, меняет элементы на этих 
позициях местами, возвращает изменённый массив.
6. Напиши `isSortedAsc(arr)` — принимает массив чисел, возвращает `true`, если каждый 
следующий элемент больше или равен предыдущему, иначе `false`.
7. Напиши `isSortedDesc(arr)` — принимает массив чисел, возвращает `true`, если каждый 
следующий элемент меньше или равен предыдущему, иначе `false`.
8. Напиши `sum(arr)` — принимает массив чисел, возвращает их сумму.
9. Напиши `average(arr)` — принимает массив чисел, возвращает среднее арифметическое.
10. Напиши `reverseArray(arr)` без `reverse()` — принимает массив, возвращает новый 
массив с элементами в обратном порядке.
*/

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

const algorithms = [
  'Выберите алгоритм',
  'findMin',
  'findMax',
  'findMinIndex',
  'findMaxIndex',
  'swap',
  'isSortedAsc',
  'isSortedDesc',
  'sum',
  'average',
  'reverseArray',
  'Bubble Sort',
  'Selection Sort',
  'Insertion Sort',
];


// УТИЛИТЫ
const compareAsc = (a, b) => a > b;


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
    for (let i = 0, l = result.length - 1, flag = false ;  i < l; i++)
      {
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
    let flag = true;
    for (let i = 0, l = arr.length - 1; i < l; i++){
      if (compare(arr[i + 1], arr[i]) || arr[i] == arr[i + 1]) {
        flag = true
      }else {
        flag = false;
        break;
      }
    }
    return flag;
  }

  function sum(arr){
    /*
    const result = 0;
    for (let i = 0, l = arr.length - 1; i < l; i++){
      result += arr[i]
    }
    return result
    Один из способов
    */
    return arr.reduce((acc, number) => acc + number, 0)
  }

// DOM-ФУНКЦИИ (создание элементов)
function createArrayCard(name, arr, parentContainer) { // функция создания карточки массива
  const card = document.createElement('div');
  card.className = 'array-card';

  const title = document.createElement('h3');
  title.textContent = name;

  const pre = document.createElement('pre');
  pre.textContent = JSON.stringify(arr, null, 2);

  const inputContainer = createSwapControls(pre);

  const isSortedAscContainer = createIsSortedAscContainer(pre);
  
  card.append(title, pre, inputContainer, isSortedAscContainer);
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
  console.log(isSorted);
  isSortedAscContainer.appendChild(result);
  return isSortedAscContainer;
}

function inputNowVisible(inputContainer) { // функция показа инпута
  inputContainer.classList.remove('hidden');
}

function createAlgorithmSelector(parentContainer, algorithmList) { // функция создания селекта с алгоритмами
  const select = document.createElement('select');
  select.className = 'algorithm-select';

  algorithmList.forEach(algorithm => {
    const option = document.createElement('option');
    option.value = algorithm;
    option.textContent = algorithm;
    select.appendChild(option);
  });

  parentContainer.appendChild(select);
}


// КОНТРОЛЛЕРЫ (связка логики и DOM)
function createResultObject(data, callback) { // функция создает объект с результатами работы алгоритма
  const result = {};
  for (const [name, arr] of Object.entries(data)) {
    result[name] = callback(arr, compareAsc);
  }
  return result;
}



function renderCards(data, callback) { // функция рендерит карточки с массивами
  container.innerHTML = '';
  for (const [name, arr] of Object.entries(data)) {
    callback(name, arr, container);
  }
}

function handleAlgorithmChange(selectedAlgorithm) { // функция обрабатывает выбор алгоритма
  switch (selectedAlgorithm) {
    case 'Выберите алгоритм':
      renderCards(testData, createArrayCard);
      break;
    case 'findMin':
      const minResult = createResultObject(testData, (arr) => findMin(arr, compareAsc).value);
      renderCards(minResult, createArrayCard);
      break;
    case 'findMax':
      const maxResult = createResultObject(testData, (arr) => findMax(arr, compareAsc).value);
      renderCards(maxResult, createArrayCard);
      break;
    case 'findMinIndex':
      const minIndexResult = createResultObject(testData, (arr) => findMin(arr, compareAsc).index);
      renderCards(minIndexResult, createArrayCard);
      break;
    case 'findMaxIndex':
      const maxIndexResult = createResultObject(testData, (arr) => findMax(arr, compareAsc).index);
      renderCards(maxIndexResult, createArrayCard);
      break;
    case 'swap':
      renderCards(testData, createArrayCard); // сначала рендерим карточки с массивами
      // затем делаем видимыми input элементы через forEach и функцию inputNowVisible, 
      // обращаясь ко всем элементам с классом .input-container
      document.querySelectorAll('.input-container').forEach(el => inputNowVisible(el)); 
      break;
    case 'isSortedAsc':
      renderCards(testData, createArrayCard);
      document.querySelectorAll('.is-sorted-container').forEach(el => inputNowVisible(el));
      break;
    case 'isSortedDesc':
      const isSortedDescResult = createResultObject(testData, isSortedAsc);
      renderCards(isSortedDescResult, createArrayCard);
      document.querySelectorAll('.is-sorted-container').forEach(el => inputNowVisible(el));
      break;
    case 'sum':
      const sumResult = createResultObject(testData, sum);
      renderCards(sumResult, createArrayCard);
      break;
    case 'average':
      const averageResult = createResultObject(testData, average);
      renderCards(averageResult, createArrayCard);
      break;
    case 'reverseArray':
      const reverseArrayResult = createResultObject(testData, reverseArray);
      renderCards(reverseArrayResult, createArrayCard);
      break;
    case 'Bubble Sort':
      const bubbleResult = createResultObject(testData, bubbleSort);
      renderCards(bubbleResult, createArrayCard);
      break;
    case 'Selection Sort':
      // TODO
      break;
    case 'Insertion Sort':
      const insertionResult = createResultObject(testData, insertionSort);
      renderCards(insertionResult, createArrayCard);
      break;
  }
}


// ИНИЦИАЛИЗАЦИЯ
createAlgorithmSelector(algorithmSelector, algorithms); // создаем селектор с алгоритмами
renderCards(testData, createArrayCard); // рендерим карточки с массивами

algorithmSelector.addEventListener('change', (event) => { // добавляем обработчик события изменения селектора
  const selectedAlgorithm = event.target.value;
  console.log('Выбран алгоритм:', selectedAlgorithm);
  handleAlgorithmChange(selectedAlgorithm);
});

