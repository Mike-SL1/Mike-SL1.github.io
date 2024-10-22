'use strict';
const paintStar = function (){
			     let figNo = 1, clrNo = 1, clrA = 'red', clrB = 'blue'; 
function mekeStar (color='', colorA = '', colorB = '') {
	const 
	pre0 = `<svg viewBox="0 0 12 11" fill="none">`, 
	mainSvgCode =`<path d="M6 0L7.80568 3.5147L11.7063 4.1459L8.92165 6.9493L9.52671 10.8541L6 9.072L2.47329 10.8541L3.07835 6.9493L0.293661 4.1459L4.19432 3.5147L6 0Z" `, 
	pre1 = `<stop class="stp`, mid1 = `" offset="`, ps1 = `%"/>`,
	mid2 = `{stop-color:`, linGrd = `linearGradient`, figId = `ast${figNo}`, pre2=`fill="`;
let gradientDefs='', ps2=`${pre2}${color}"`, gradPaint = true;
if (colorA+colorB) {
	if ((colorA+colorB)!=(clrA+clrB)) {clrA=colorA;clrB=colorB;clrNo++;} 	
} else {colorA=clrA;colorB=clrB;};
if (!isNaN(color)) {
	if (color>99) {ps2=`${pre2}${colorA}"`;gradPaint = false;}
	if (color<1)  {ps2=`${pre2}${colorB}"`;gradPaint = false;}
	if (gradPaint) {
	gradientDefs= `<defs>
    			<${linGrd} id="Gr${figNo}">
				${pre1}1${clrNo}${mid1}0${ps1}		${pre1}2${clrNo}${mid1}${color}${ps1}
				${pre1}3${clrNo}${mid1}${color}${ps1}	${pre1}4${clrNo}${mid1}100${ps1}           
    			</${linGrd}>    
    			<style type="text/css">
      				<![CDATA[
              				#${figId}{fill: url(#Gr${figNo}); }
              				.stp1${clrNo}${mid2}${colorA};} .stp2${clrNo}${mid2}${colorA};}
              				.stp3${clrNo}${mid2}${colorB};} .stp4${clrNo}${mid2}${colorB};}
            			]]>
    			</style>
  		       </defs>`;
	ps2 = `id="${figId}"`;
	figNo++;
	};
};
return `${pre0}${gradientDefs}${mainSvgCode}${ps2}/></svg>`;
};
return mekeStar;
}();