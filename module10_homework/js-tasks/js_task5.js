//Задание 5
//Дан произвольный массив. Необходимо вывести количество элементов массива, 
//затем перебрать его и вывести в консоль каждый элемент массива.
//-------------------------------------------------------------------------
let rnd_array1=[]; let rnd; let alfa_rnd;			//формирование одномерного массива целых, дробных, строк
let alfa=['a','b','c','d','e','f','g','h','i','j','k','l','m'];
let alfa_length=alfa.length;
let alfa_postfix=alfa.map(function(item,idd){return item+'-000-'+idd});
for (let i=0;i<25;i++){rnd=Math.trunc(Math.random()*1001)/16;
			alfa_rnd=alfa_postfix[Math.trunc(Math.random()*alfa_length)];
			if (!(i%2)) {rnd_array1.push(alfa_rnd)} else {if (i%3) {rnd_array1.push(rnd)} 
			else rnd_array1.push(i+Math.trunc(Math.random()*10));}}
			
console.log('одномерный массив целых, дробных, строк',rnd_array1);//вывод сформированного массива
let rnd_array_length=rnd_array1.length;				  //определение длины массива
console.log('количество элементов -',rnd_array_length);		  //вывод значения длины массива
console.log(' --- перебор первым методом - без цикла  ---  ');
rnd_array1.map(function(x,y){console.log('Элемент с индексом',y,':',x)});//перебор и вывод значения каждого элемента
console.log('  ---  перебор вторым методом - с циклом  ---  ');
for (i=0;i<rnd_array_length;i++){
		console.log('Элемент с индексом',i,':',rnd_array1[i]);}//перебор и вывод значения каждого элемента