//Задание 1
//В прошлом модуле в юните «Циклы» вы выполняли следующее задание:
//Дан массив. Нужно вывести в консоль количество чётных и нечётных элементов в массиве. 
//Если в массиве есть нулевой элемент, то он учитывается и выводится отдельно. 
//При выполнении задания необходимо учесть, что массив может содержать не только числа, но и знаки, например null и так далее.
//На этот раз оформите решение в виде функции: постарайтесь дать этой функции корректное название, 
//вызовите функцию, проанализируйте синтаксис.
//------------------------------------------------------------------------------------------------------------
function array_parsing(rum)							//function 'array_parsing' declaration - map structure as return
			   {let rum_len=rum.length;				//'rum_length' variable declare - array 'rum' length			   
			    let zeroes=0; let odds=0; let evens=0; let r=0;     //operation variables declaration
	      		    arr_odds=[];arr_evens=[]; let nules=0;	
	      		    const pre_ev=' чётных';const pre_od=' нечётных';	//output labels prefixes/postfixes declaration
	      		    const po_elem=' элементов';const pre_mas='массив';	      		    			   
/*parsing procedure begins*/for (i=0;i<rum_len;i++){if (typeof rum[i]=='number') //if input is a number
						   {r=rum[i];if (r) {if (r===Math.trunc(r)) //check input whether it is ((not equal to zero) and (integer)) 
		 				   	{if (r%2) {arr_odds.push(r);odds++} //input is an odd number - 'odds' counter incrementing
		 				   			else {arr_evens.push(r);evens++;}}} //input is an even number - 'evens' counter incrementing
	  					    	     else zeroes++;}		    //input is equal to zero - zeroes counter incrementing
						    else {if (rum[i]==null){nules++;}}} //if input is not a number and it is equal to 'null' - 'nules' counter incrementing
//operation results output to returnMap array 	
let returnMap=new Map([['исследуемый '+pre_mas,rum],['нулей',zeroes],['нулевых(null)'+po_elem,nules],[pre_ev+po_elem,evens],
		      [pre_mas+pre_ev+po_elem,arr_evens],[pre_od+po_elem,odds],[pre_mas+pre_od+po_elem,arr_odds]]); 	
//function 'array_parsing' return/output				    			     
return returnMap;}

function form_outprint(array_pair)						//function 'form_outprint' declaration
				  {let clnSymb=': ';				//semicolon symbol for formatted console output
				   let spc8='        ';				//tabulation sign - 8 white spaces
				   if (Array.isArray(array_pair[1])) {console.log(spc8+array_pair[0]+clnSymb); //array output procedure
				   				      array_pair[1].map(function(arr_item){console.log(spc8+spc8+arr_item);})}
				   else console.log(array_pair[0]+clnSymb+array_pair[1]); //non array output procedure
				   }
/*---------------------------  MAIN PROGRAM BEGINS ---------------------------*/
let array_1 = [1,2,0,3,'1',null,'2','3',true,0,false,'abc123','0',52.5,-1,-10,-1.5,false,1.5,0.5,-0.5,null,50,0,101]
let anRes=array_parsing(array_1); 		//function 'array_parsing' call - anres Map structure as function return
for (let out_1 of anRes){form_outprint(out_1);} //console formatted output cyclic calling