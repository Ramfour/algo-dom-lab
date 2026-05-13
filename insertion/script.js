/*Тренировка написания сортировки вставками
*/
const numbersArray = [6, 3, 1, 7, 8, 10, 0];

const compareAsc = (number1, number2) => 
  number1 > number2;
function InsertSort(numbersArray, compareAsc) {
  for (let i = 1; i < numbersArray.length; i++) {
    const current = numbersArray[i]; // сохраняем до сдвигов
    let j = i - 1;
    while (j >= 0 && compareAsc(numbersArray[j], current)) {
      numbersArray[j + 1] = numbersArray[j]; // сдвигаем вправо
      j--;
    }
    numbersArray[j + 1] = current; // вставляем на место
  }
  return numbersArray;
}
console.log(InsertSort(numbersArray, compareAsc))

