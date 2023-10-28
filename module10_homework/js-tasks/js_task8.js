//Задание 8
//Создайте произвольный массив Map. Получите его ключи и выведите в консоль все значения в виде «Ключ — Х, значение — Y». 
//Используйте шаблонные строки.
//---------------------------------------------------------------------------------------------------

let toys=new Map([[9,'xpy-xpu-xpy'],['parovozik','chuh-chuh-chuh'],['chainik','bool-bool-bool'],[220,380],['roses','are red'],['violets','are blue'],['this test','is st***y'],['as','you'],['Name','Ivan'],['SurName','Rogozin'],['Gender','Male'],['Age',25],['Married',false],['Height',1.67],['Weight',67.3],['EyeColor','DarkBrown'],['Grade','Bachelor'],['Occupation','ChemistryEngineer'],['Employed',true]]);

function out434(prompts,key){	const maxSpcLen=12;const dlm=' - ';
				let pr1=prompts[0];s=key[0]; sb=s+''; a=maxSpcLen-sb.length;
				let pr2=prompts[1];s1=key[1];spc=','; if (a>0) {for (h=1;h<a;h++){spc=spc+' ';}}			
				return `${pr1}${dlm}${s}${spc}${pr2}${dlm}${s1}`};

for (let para of toys){console.log(out434`КЛЮЧ${para}ЗНАЧЕНИЕ`);}