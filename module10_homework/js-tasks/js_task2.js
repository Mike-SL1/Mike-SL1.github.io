//Задание 2
//Дана переменная x, которая может принимать любое значение. Написать программу, которая в зависимости от типа данных x 
//выводит в консоль сообщение вида: «x — число».
//Опишите три случая: когда х = числу, строке или логическому типу. В других случаях выводите сообщение: «Тип x не определён».
//Примечание: в этом задании использовать promt не нужно.
//------------------------------------------------------------------------------------------
let x; /*
x=11; 
x='11';*/
x=true;
let s=typeof x;
let flag=true;
switch (s) {case 'string':console.log('x — строка');flag=false;break;
	    case 'number':console.log('x — число');flag=false;break;
	    case 'boolean':console.log('x — логический тип');flag=false;}
if (flag) console.log ('Тип x не определён');