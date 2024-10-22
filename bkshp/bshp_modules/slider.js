//slider module v.3.2.9 for bookshop prj
// dependencies : bshp_modules/Init00.js - plusPX func, putEl func
'use strict';
msgSrv({'':'slider module v.3.2.9 loaded'});

const slider=function(speed="slow", frameclass="sliderContainer", 	bPrefx="img/slide", 	bPstf="png"){
msgSrv({'slider speed' : speed,'frameclass': frameclass});	
		const container = cnst.d7.querySelector('.'+frameclass),
		      picFrame = putEl(),	warnBlk = putEl(),  	      		      
		      bPstfx="."+bPstf, 	none = 'none',
		      cntr = 'center', 		zpx =`${cntr}, `+plusPX()+cntr,	/* center, 0px center */
		      backGndCLr = getProp2(container,'background-color'); 
	     
		if (!container) return function (){const noPrnt ='Slider no parent/wrong container name for slider module'; 
						   cnst.d7.write(noPrnt+'<br>');	                  msgSrv({'':noPrnt});};
		let previousSlide = null, movSlow, frmWidth, 
		picShiftX,
		frameStep,warnFontSize,loadErr=false; 
function frameDim(){
	const picRatio = 1.58;
	frmWidth = getProp2(container,'width');	
        frameStep = 1+Math.floor(frmWidth/200);	warnFontSize = (1+Math.floor(frmWidth/50));
	setProp(picFrame,{'height':plusPX(frmWidth/picRatio)});
	
};
frameDim();
window.addEventListener('resize',frameDim);
												
	setProp(picFrame,{'width':'100%', 'backgroundSize':'contain', 'backgroundColor':backGndCLr,
			  'backgroundRepeat':'no-repeat', 'display':'flex', 'justifyContent':cntr, 'alignItems':cntr});	
	container.appendChild(picFrame);
	
	setProp(warnBlk,{'color':'gray', 'backgroundColor':'gainsboro', 'opacity':'0.95', 'display':none,
			 'maxWidth':'90%', 'padding':'1%', 'fontSize':plusPX(warnFontSize*1.7),
			 'fontWeight':'600', 'letterSpacing':plusPX(frameStep), 'textAlign':cntr, 'overflowWrap':'break-word'});					 			
	picFrame.appendChild(warnBlk);   

        switch (speed) 	{case "slow":	 movSlow = 25;	break;
		 	 case "moderate":movSlow = 15;	break;
		 	 case "normal":	 movSlow = 8;	break;
		 	 case "fast":	 movSlow = 3;	break;
			 case "veryfast":movSlow = 0;	break;	default: movSlow = 10;}								 	
	function slider(nextSlide=0){
		let probeImg = putEl('',`${bPrefx}${nextSlide}${bPstfx}`,'slide picture'), idA, movInterval, loadFail = true;
		msgSrv({'slider module':nextSlide+' image: '+probeImg.src});

		    warnBlk.innerHTML=`<span style="color:salmon;">No image available at</span><br>${probeImg.src}`;
		probeImg.addEventListener("error", () => {warnBlk.style.display='block';});
		    
		probeImg.addEventListener("load", () => {
				warnBlk.style.display=none;
				if (previousSlide===null) {setProp(picFrame,{'backgroundImage':`url('${bPrefx}${nextSlide}${bPstfx}')`});				
				} else {
				if (previousSlide!=nextSlide) {	
						setProp(picFrame,{'backgroundImage':`url('${bPrefx}${nextSlide}${bPstfx}'), url('${bPrefx}${previousSlide}${bPstfx}')`});
					picShiftX = frmWidth;
					function frameMoving (){
							// Xpx center, 0px center 
							setProp(picFrame,{'backgroundPosition':plusPX(picShiftX)+zpx});

				        	movInterval = null;
						if (picShiftX>0) {
						      picShiftX-=frameStep;
						      if (movSlow) {
							  movInterval = setTimeout (()=>{requestAnimationFrame(frameMoving);},movSlow);
						      } else {requestAnimationFrame(frameMoving);}
						} else {
							cancelAnimationFrame(idA);
							setProp(picFrame,{'backgroundImage':`url('${bPrefx}${nextSlide}${bPstfx}')`});
								// 0px center, 0px center 
							setProp(picFrame,{'backgroundPosition':plusPX()+zpx});	
							};
					};
					idA = requestAnimationFrame(frameMoving);
				};};	previousSlide = nextSlide;	
		    });			
	};
return slider;},

slideShow=function(amount=0, timeout = 0, inactClr="rgb(209, 208, 216)", actClr="rgb(138, 132, 225)", 
		   frameclass="sliderSwitch", sliderName=launchSlide){
		const switchBlock = cnst.d7.querySelector('.'+frameclass);
if (!switchBlock) return function (){const noPrnt ='SliderControl: no parent/wrong container name for sliderControl module'; 
				     cnst.d7.write(noPrnt+'<br>');	                  msgSrv({'':noPrnt});
				    };
		const   slideControlButtonClassName = "slideCtrlButton", slideShowPauseCount = 2;
		let ctrlBtn = null, pauseShow = 0, slideNum = 0,
		    swHeightNum,  swWidthNum,  maxAmount, amountMinusOne;
setProp(switchBlock,{'display':'flex', 'justifyContent':'space-between'});
function switchDim (){
	swHeightNum = getProp2(switchBlock,'height');		
	swWidthNum = getProp2(switchBlock,'width');			
};
	switchDim ();
maxAmount = Math.round((swWidthNum/swHeightNum+0.5)/1.5);	
if ((amount<2) || (amount>maxAmount))  {amount = maxAmount};		
amountMinusOne = amount-1;
// switch block clear
switchBlock.innerHTML='';
for (let i=0;i<amount;i++) {ctrlBtn =putEl(slideControlButtonClassName); 
		    setProp(ctrlBtn,{'cursor':'pointer', 'borderRadius':'50%', 'backgroundColor':inactClr, 
			 	     'width':plusPX(swHeightNum), 'height':plusPX(swHeightNum)});	
    switchBlock.appendChild(ctrlBtn);
};
ctrlBtn	= cnst.d7.querySelectorAll('.'+slideControlButtonClassName);
// switch block onresize
window.addEventListener('resize',()=>{	
		switchDim ();		
		ctrlBtn.forEach((i)=>{setProp(i,{'width':plusPX(swHeightNum), 'height':plusPX(swHeightNum)});});	
});	
function swState(activeBtnNumber){
		ctrlBtn.forEach((i,n)=>{if (activeBtnNumber===n){i.style.backgroundColor=actClr;  sliderName(n);  slideNum=n;
					} 	else		{i.style.backgroundColor=inactClr;}})
};	ctrlBtn.forEach((i)=>{
		i.addEventListener('click',(ev)=>{
			pauseShow = slideShowPauseCount;
			ctrlBtn.forEach((i1,n)=>{if (ev.target===i1) {swState(n);}});
		});
});
if ((timeout>0) && (timeout<101)) {
	      timeout *= 1000;
	      swState(slideNum);
	      setInterval(()=>{if (pauseShow) {pauseShow--;}
			       else {slideNum+=1; 
				     if (slideNum>amountMinusOne){slideNum=0;}					 
				     swState(slideNum);}
			      },timeout);}			 	
	function slide(n=0){
				swState(n);				
	};
return slide;};

slideShow(3,8,undefined,undefined,undefined, slider('moderate'));
