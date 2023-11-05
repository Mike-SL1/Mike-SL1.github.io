//Задание 5
//Напишите функцию, которая принимает два натуральных числа x и n и возвращает x в степени n. 
//Иначе говоря, умножает x на себя n раз и возвращает результат.
//Используйте Arrow Function синтаксис.
//Протестируйте функцию на любых значениях и выведите результат в консоль.
//-------------------------------------------------------------------------
const pwr = (X,N)=>{console.log(X,'в степени',N);let R=1;while (N) {R=R*X;N--;} return R;}	

console.log(pwr(3,3));	console.log(pwr(2,0));	console.log(pwr(5,3));	console.log(pwr(5,2));
console.log(pwr(2,10));	console.log(pwr(2,1));	console.log(pwr(2,8));	console.log(pwr(10,6));

console.log(pwr(4,3));	console.log(pwr(256,2));console.log(pwr(9,3));	console.log(pwr(64,2));