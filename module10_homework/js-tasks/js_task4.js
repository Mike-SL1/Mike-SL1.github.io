//Задание 4
//Записать в переменную случайное целое число в диапазоне [0; 100]. Используйте объект Math. 
//-----------------------------------------------------------------------------------------
let rnd; let zeroes=0; let hundreds=0; let cycles=1000000; let half_bands=0; let exceed=0; let i=0;
let prefix1='относительная частота появления'; let prefix2='всего';
console.log('Испытание генератора случайных чисел');
console.log('------------------------------------');
for (i=0; i<cycles;i++){rnd=Math.random();rnd100=Math.floor(rnd*101);
    		         rnd100_truncated=Math.trunc(rnd100);if (rnd100_truncated===0) zeroes++;
    		         				     if (rnd100_truncated===50) half_bands++;
    		     					     if (rnd100_truncated===100) hundreds++;
    		     					     if (rnd100_truncated>100) exceed++;
    		     					     if (rnd100_truncated<0) exceed++;}
    		     console.log(prefix1,'нуля:',zeroes/i); 
    		     console.log(prefix1,'числа 50:',half_bands/i); 
    		     console.log(prefix1,'сотни:',hundreds/i);  
    		     console.log(prefix2,'циклов:',i);   
    		     console.log(prefix2,'нулей:',zeroes); 
    		     console.log(prefix2,'сотен:',hundreds); 
    		     console.log(prefix2,'пятидесяток:',half_bands); 
    		     console.log('выходов за пределы диапазона:',exceed); 
    		     console.log('последнее случайное число:',rnd100_truncated); 