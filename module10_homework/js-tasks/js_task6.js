//Задание 6
//Дан массив. Проверить, одинаковые ли элементы в массиве и вывести результат true или false в консоль. Речь идёт не о 
//двух рядом стоящих одинаковых элементах, а обо всех. Проверить, все ли элементы в массиве одинаковые.
//---------------------------------------------------------------------------------------------------------
let arr4 = [];

for (i=0;i<6;i++){arr4.push(1);}/*arr4.push('ddd');for (i=0;i<5;i++){arr4.push(1);}arr4.push('ddd');
arr4.splice(0,1,2);arr4.splice(5,1,8);*/arr4.splice(5,1,'g');
console.log('Массив',arr4);

let j=0;   let len=arr4.length; console.log('   ---   ВАРИАНТ - 1 Перебор циклами   ---   ');
let f=false;
for (i=0;i<len;i++) {f=false;
	for (k=i+1;k<len;k++){
		     	    if ((typeof arr4[k])==(typeof arr4[i])) {if (arr4[k]!==arr4[i]) f=true} else f=true;}
		     if (f) j++}		    
if (j) {console.log('отличия есть')} else console.log('отличий нет');

let j1=0;  let len1=arr4.length;console.log('   ---   ВАРИАНТ - 2 Перебор функцией forEach   ---   ');
let f1=false;
arr4.forEach(function(arr, i1, array) {f1=false;
				       for (k1=i1+1;k1<len1;k1++){if ((typeof array[k1])==(typeof arr)) {if (array[k1]!==arr) f1=true} 
								  else f1=true;}
								  if (f1) j1++});
if (j1) {console.log('отличия есть')} else console.log('отличий нет');
