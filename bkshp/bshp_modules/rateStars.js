// rateModule for bookshop prj
// dependencies : bshp_modules/Init00.js
'use strict';
const paintStar = function (){
			     let figNo = 1; 
msgSrv({'':'paintStar'+'v.2.1.2 loaded ---'});	
function mekeStar (color='', colorA = 'rgb(242, 201, 76)', colorB = 'rgb(238, 237, 245)') {
   const 
	mainSvgCode =`<path d="M6 0L7.80568 3.5147L11.7063 4.1459L8.92165 6.9493L9.52671 10.8541L6 9.072L2.47329 10.8541L3.07835 6.9493L0.293661 4.1459L4.19432 3.5147L6 0Z" `, 
	pre1 = `<stop class="stp`, mid1 = `" offset="`, ps1 = `%"/>`,
	mid2 = `{stop-color:`, linGrd = `linearGradient`, figId = `ast${figNo}`, pre2=`fill="`;
let gradientDefs='', ps2=`${pre2}${color}"`, gradPaint = true;
if (!isNaN(color)) {
	if (color>99) {ps2=`${pre2}${colorA}"`;gradPaint = false;}
	if (color<1)  {ps2=`${pre2}${colorB}"`;gradPaint = false;}
	if (gradPaint) {
	gradientDefs= `<defs>
    			<${linGrd} id="Gr${figNo}">
				${pre1}1${mid1}0${ps1}		${pre1}2${mid1}${color}${ps1}
				${pre1}3${mid1}${color}${ps1}	${pre1}4${mid1}100${ps1}           
    			</${linGrd}>    
    			<style type="text/css">
      				<![CDATA[
              				#${figId}{fill: url(#Gr${figNo}); }
              				.stp1${mid2}${colorA};} .stp2${mid2}${colorA};}
              				.stp3${mid2}${colorB};} .stp4${mid2}${colorB};}
            			]]>
    			</style>
  		       </defs>`;
	ps2 = `id="${figId}"`;
	figNo++;	msgSrv({'paintStar':'mekeStar figNo'+figNo});
	};
};
return `<svg viewBox="0 0 12 11" fill="none">${gradientDefs}${mainSvgCode}${ps2}/></svg>`;
};
return mekeStar;
}(),

rateModule = (quantity=5, rateModul, space = 20) => { 
const   starWrapClasName = 'starWrap', spcBlkClasName = 'spcBlk',
	moduleName = 'rateModule',     moduleVer =' v.6.1.1 ',		sto = 100,
	//error handle function
	dumbFunc = () =>{console.log('dumbFunc');return null;};
	if (!rateModul) {msgSrv({'':moduleName+' No '+moduleName+' DomElement Specified'}); return dumbFunc;} 
// successful loading report
msgSrv({'':moduleName+moduleVer+'loaded ---'});	
const 
spaceBlocks = rateModul.querySelectorAll('.'+spcBlkClasName),
starWrapHeightD = getProp2(rateModul,'height'),  starWrapHeight = plusPX(starWrapHeightD),
 starWrapWidthD = starWrapHeightD*12/11, 	 starWrapWidth = plusPX(starWrapWidthD),
rateStep = Math.round(sto/quantity);
						let starWraps = rateModul.querySelectorAll('.'+starWrapClasName); 
space = plusPX(starWrapWidthD*space/sto); 				
msgSrv({'height':moduleName+' '+starWrapHeight});					  		
//.ratStar = rateModul
if (starWraps.length){
	msgSrv({'rateModule':'resizing existing elements'});
	starWraps.forEach((starWrapI)=>{setProp(starWrapI,{'height':starWrapHeight, 'width':starWrapWidth});});
	spaceBlocks.forEach((spaceBlockI)=>{spaceBlockI.style.width=space;});
} else {
starWraps = [];
rateModul.style.display='flex';				
msgSrv({'rateModule':'building new one'});
/* rating block filling with stars and space hoopers between */
for (let i=0;i<quantity;i++){
	const starWrap=putEl(starWrapClasName,paintStar(0)), spcBlk = putEl(spcBlkClasName);	
	starWraps.push(starWrap);				  
	setProp(starWrap,{'height':starWrapHeight, 'width':starWrapWidth});  				
	rateModul.appendChild(starWrap);
	if (i) {
		spcBlk.style.width=space;
		rateModul.insertBefore(spcBlk,starWrap);};
};} //if (starWraps){...

/* main function - rating stars fill */
function ratingDisplay(rate=75) {	
	msgSrv({'rateModule':'rating '+rate});	
	if (rate<1) {return;}	
		let i=0;   
	if (rate>99) {
		starWraps.forEach((starWrapI)=>{starWrapI.innerHTML=paintStar(sto);});
		return;
	};
/* I */
rate = Math.round(rate)-rateStep;
while (rate>0){rate=rate-rateStep;    	       
               starWraps[i].innerHTML=paintStar(sto);		i++;
};	
/* II */
rate=Math.round((rate+rateStep)*sto/rateStep);
starWraps[i].innerHTML=paintStar(rate);

}; return ratingDisplay;
};
