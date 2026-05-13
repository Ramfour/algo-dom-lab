/*Тренировка написания сортировки пузырьком 
*/
const numbersArray = [6, 3, 1, 7, 8, 10, 0];

const compareAsc = (number1, number2) => 
  number1 > number2;
function bubbleSort (numbersArray, compareAsc){
  for (let i = 0, l = numbersArray.length - 1; i < l; i++ ){
    // l - i, так как пузырьковый метод точно гарантирует, что после всплытия
    // последний элемент точно отсоритован
    for (let j = 0; j < l - i; j++){
      if (compareAsc(numbersArray[j], numbersArray[j + 1])){
        [numbersArray[j], numbersArray[j + 1]] = [numbersArray[j + 1], numbersArray[j]] 
      }
    }
  }
  return numbersArray
}
console.log(bubbleSort(numbersArray, compareAsc))

// Самый простой для реализации метод, медленный