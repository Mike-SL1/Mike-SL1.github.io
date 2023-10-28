//Задание 7
//Дан массив. Нужно вывести в консоль количество чётных и нечётных элементов в массиве. Если в массиве есть нулевой элемент, 
//то он учитывается и выводится отдельно.
//При выполнении задания необходимо учесть, что массив может содержать не только числа, но и, например, знаки, null и так далее.
//----------------------------------------------------------------------------------------------------------------
let rum = [1,2,0,3,'1',null,'2','3',true,0,false,'abc123','0',52.5,-1,-10,-1.5,false,1.5,0.5,-0.5,null,50,0,101]
let rum_len=rum.length;
let zeroes=0; let odds=0; let evens=0; let r=0;
	      arr_odds=[];arr_evens=[];let nules=0;	let pre_mas='массив';
console.log('исследуемый',pre_mas,':',rum);	      
for (i=0;i<rum_len;i++){
			if (typeof rum[i]=='number') 
{r=rum[i];if (r) {if (r===Math.trunc(r)) 
		 {if (r%2) {arr_odds.push(r);odds++} else {arr_evens.push(r);evens++;}}} 
	  else zeroes++;}
			else {if (rum[i]==null){nules++;}}} 
			
let pre_ev='чётных';let pre_od='нечётных';let po_elem='элементов';						     
console.log('нулей',zeroes); 		console.log('нулевых',po_elem,nules);
console.log(pre_ev,po_elem,evens);	console.log(pre_mas,pre_ev,po_elem,arr_evens);	
console.log(pre_od,po_elem,odds);	console.log(pre_mas,pre_od,po_elem,arr_odds);
