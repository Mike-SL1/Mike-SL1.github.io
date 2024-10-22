//Iitialization module v.9.1.3 for bookshop prj
'use strict';
const verbose = false, startMark ='    --- ' ;		if (verbose) {console.log(startMark+'Init00 module loaded ---');}
//false true
const msgSrv = (msgObj) => {
	if (!verbose) {return;}
	let msgObjKey;
	if (typeof msgObj !='object') {console.log('msgSrv error');return;}
	for (let key in msgObj){
		msgObjKey = msgObj[key];
		if (key.length<2) {
			console.log(startMark,msgObjKey.match(/\b\w{1,}\b/)[0],':',msgObjKey.match(/\s.+/)[0]);
		} else {console.log(key,': ',msgObjKey);};
	};
},
cnst = {'d7':document, 'loadDelay':500, 'cardQuantity':6, 
	'buttonClasId':'Btn', 'placeHolderSrc':'img/plcHldr.jpg'},
//goods categories
siList=['Architecture','Art & Fashion','Biography','Business','Crafts & Hobbies','Drama','Fiction','Food & Drink',
	'Health & Wellbeing','History & Politics','Humor','Poetry','Psychology','Science','Technology','Travel & Maps'],

getProp2 = (DomElement,propertyName) =>{
	   const funcName = 'getProp2 ';
	   let prVal = window.getComputedStyle(DomElement,null).getPropertyValue(propertyName);		
		if (prVal.match(/px/)) {prVal=Math.round(prVal.match( /\d+/ )[0]);}
	msgSrv( {'A':funcName+'func loaded',
		 'getProp2 DomElement':DomElement,
		 'getProp2 propertyName':propertyName,
		 'getProp2_return':prVal})
	return prVal;	
},
//setting style properties	
setProp = (domEl,propObj)=>{
   if (domEl) {
	const elementStyle = domEl.style; 
	for (let prop in propObj){	elementStyle[prop]=propObj[prop];	}
   };
},
//get header color from body background color
headerColor = function () {
	msgSrv({'headerColor func': 'loaded'});
	const body=cnst.d7.body,
	bodyColor= getProp2(body,'background-color'),	headerWrap=cnst.d7.querySelector('.header_wrap');
msgSrv({'body-color':bodyColor});
   if (headerWrap){let headerWrapStyle=headerWrap.style;

	if (bodyColor==='rgba(0, 0, 0, 0)') {headerWrapStyle.backgroundColor = 'white';
	} else {headerWrapStyle.backgroundColor = bodyColor;}

   } else {return;} 
}(),
//returns DOM element with className
putEl = (className='',innerContent='',altTxt='') => {
	let aux; 
	if (altTxt) {
		aux = cnst.d7.createElement('img');	aux.src =innerContent;	  	aux.alt=altTxt;
	} else {
		if (className.match(cnst.buttonClasId)) {aux = cnst.d7.createElement('button');}
		else {aux = cnst.d7.createElement('div');}	
		aux.innerHTML=innerContent;} 
	if (className) { aux.className=className; }	return aux;
},
// add 'px' to the input value
plusPX = (value=0)=>{
	const px = 'px ';
	if (isNaN(value)) {return '0'+px;
	} else {
		if (value>1) {return Math.round(value)+px;} 
			else {return value+px;}
	};
},
//cart to local store bridge	
processCart = (itemID=null, putToCart=false, emptyCart=false) => {
msgSrv({'':'processCart func loaded','write to Cart':putToCart,'value':itemID});
     const keyName = 'cart9170436'; 
     let aux=localStorage.getItem(keyName), temp=[], putToCartEnable = true;	
 	if (aux) {
		  if (emptyCart) {localStorage.setItem(keyName,JSON.stringify([]));
				  msgSrv({'processCart': 'client cart has been cleaned out'});return true;}
		  aux=JSON.parse(aux);		
	  } else {aux=[];}
	aux.forEach((i)=>{			
			if (JSON.stringify(itemID)===JSON.stringify(i)) {putToCartEnable = false;} else {temp.push(i);}
			});
	//returns cart contents when called with no args 
	if (itemID===null) {msgSrv({'processCart read Cart': aux}); return aux;}
	//put an item to the cart if the cart doesn't have it
	if (putToCart) {if (putToCartEnable) {aux.push(itemID);} else { msgSrv({'processCart': 'item is already in cart','processCart rejected':itemID});
									return  putToCartEnable;}}
	else { 	
	      putToCartEnable = true;	
	      aux=temp;						  
	};		localStorage.setItem(keyName,JSON.stringify(aux));
// returns true if cart operation was successful
return putToCartEnable;	
},
//cart_bage element content fill
cartBage = () =>{
const cart_bage=cnst.d7.querySelector('.cart_bage'), cartItemsQuantity = processCart().length; 
msgSrv({'':'cartBage func loaded','cartBage volume':cartItemsQuantity});
	if (cartItemsQuantity) {
		cart_bage.style.display='flex'; cart_bage.innerHTML=cartItemsQuantity;}
	else {	cart_bage.style.display=''; }						  
},
watchInScope = function () {
   msgSrv({'':'watchInScope func loaded'});
	const 
	none = 'none', blk = 'block',
	optObj = {root:document.querySelector('#scroll'), threshold:1},	
	cbFunc1 = (entriesArr,observer) =>{
		entriesArr.forEach((entry)=>{let targetImg=entry.target,
					     loader = targetImg.previousSibling,
					     coverPH = targetImg.nextSibling;
			const showNoCoverMessage = (mode=true) => {
					loader.style.display=none;
					if (mode) {coverPH.innerHTML=coverPH.dataset.bText;
					   } else {coverPH.style.display=none;	targetImg.style.display=blk;}						    	      
			};
			if (entry.isIntersecting) {	
				observer.unobserve(targetImg);	msgSrv({'watchInScope caught in scope':targetImg});
				targetImg.src = targetImg.dataset.src;
				targetImg.style.display=none;	coverPH.style.display=blk;
								loader.style.display=blk;
				if (targetImg.src) {
					targetImg.addEventListener('load', ()=>{
						setTimeout(()=>{ showNoCoverMessage(false);},cnst.loadDelay);
					});
					targetImg.addEventListener('error',()=>{
						setTimeout(()=>{showNoCoverMessage();},cnst.loadDelay);
					});
				} else {showNoCoverMessage();msgSrv({'watchInScope':'no image src'});}	
			};
		});
	},    observer = new IntersectionObserver(cbFunc1,optObj);	
	function obsyr (img) {			     
			      observer.observe(img);}
	return 	obsyr;	
}();
//-------------------------------------------------------

// this mod defined constants list display
const shC173392 = function () {
const globConstList = {
	'verbose':verbose,
	'cnst':cnst,
	'siList':siList,
	'getProp2':getProp2,
	'setProp':setProp,
	'headerColor':headerColor,
	'putEl':putEl,
	'plusPX':plusPX,
	'processCart':processCart,
	'cartBage':cartBage,
	'watchInScope':watchInScope}, prefix2 ='Init00 --- ';
let globConstListPlus ={'':prefix2+'module global func/const list ---'}, keyName2;
for (let key in globConstList) {keyName2 = prefix2+key;
				globConstListPlus[keyName2] = globConstList[key];}
msgSrv(globConstListPlus);
}();





