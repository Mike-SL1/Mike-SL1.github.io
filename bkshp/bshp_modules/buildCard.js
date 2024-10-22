//building card with loader and dynamic PH
//dependencies: Init00.js, rateStars.js, rst-0.css, cardStyl.css
'use strict';
const buildCard = (container,   opt1={},
     				klas={},
     				opt2={}) => {
const opt1Default = {
	'imageSrc':'goodImg0.png',
	'imagePlaceHolderSrc':cnst.placeHolderSrc,
	'imageAlt':'book cover image',
	'author':'HO Commission on Social Determinants of Health, World Health Organization',
	'caption':'Harry Potter: Crochet Wizardry | Crochet Patterns | Harry Potter Crafts',
	'averageRating':0,
	'maxAverageRating':5,
	'reviewCnt':354, 
	'annot':'The Outrageously Funny Debut Novel About Three Super-Rich, Pedigreed Chinese Families And The Gossip about third world war',
	'price':0,
	'buyNowBtnTxt':'BuY nOW',
	'inCartTxt':'IN THE CART'
},
klasDefault={
	'goodImgWrap':'goodImgWrap',
	'coverPH':'coverPH',
	'goodImg':'goodImg',
	'loaderRing':'loaderRing',
	'spc1':'spc1',
	'goodDesc':'goodDesc',
	'author':'author',
	'caption':'caption',
	'rating':'rating',
	'ratStar':'ratStar',
	'reviewCnt':'reviewCnt',
	'annot':'annot',
	'price':'price',
//buyNowBtn key value should contain 'Btn' in the name
	'buyNowBtn':'buyNow'+cnst.buttonClasId,
	'noBuyBtn':'noBuy'+cnst.buttonClasId
},
opt2Default={
	'noCvrImgText':'NO COVER IMAGE',
	'coverShdClr':'lightgray'
},
//fill options with defaults meanings
fillDef = (defaults, inputOptions) => {
	for (let key in defaults){	
		if (!(key in inputOptions)){inputOptions[key]=defaults[key];}
	};
};	fillDef(opt1Default,opt1);	fillDef(klasDefault,klas);	fillDef(opt2Default,opt2);
msgSrv({'':'buildCard module loaded'});
const 	flx = 'flex', sto = 100, blk = 'block', none = 'none',
	buyNowBtnCaption = opt1.buyNowBtnTxt.toUpperCase(),
	goodImgWrap = putEl(klas.goodImgWrap), 	goodImg = putEl(klas.goodImg,opt1.imagePlaceHolderSrc,opt1.imageAlt),
	loader = putEl(klas.loaderRing),	coverPH = putEl(klas.coverPH,'LAZY LOADING...'), 
	goodDesc = putEl(klas.goodDesc), rating = putEl(klas.rating), rateDisplay = putEl(klas.ratStar),					      
	price = putEl(klas.price,opt1.price),  itemID = {'author':opt1.author,'caption':opt1.caption},
	innerCart = processCart(), rateInPercents = opt1.averageRating*sto/opt1.maxAverageRating,
	
//set card container height 78% of width
setPropCard =() => {
	let rateBlk;
	const cardContainerWidth = getProp2 (container,'width'), loaderDim = cardContainerWidth/15, loaderDimPX = plusPX(loaderDim),
		shd1=plusPX(cardContainerWidth*.04),shd2=plusPX(cardContainerWidth*.036),
		shd3=plusPX(cardContainerWidth*.024);
	setProp(loader,{'height':loaderDimPX, 'width':loaderDimPX, 'borderWidth':plusPX(loaderDim/5)});
	setProp(container,{'height':plusPX(cardContainerWidth/1.277), 'fontSize':plusPX(cardContainerWidth/54.6)});	
	goodImg.style.boxShadow=plusPX()+shd1+shd2+'-'+shd3+opt2.coverShdClr;
	//goodDesc.style.height=plusPX(getProp2 (goodDesc,'width')*1.14);	//width:294 x height:336
    if (opt1.averageRating) {
	rateBlk = rateModule(opt1.maxAverageRating,rateDisplay);
	rateBlk(rateInPercents);	
    };
},
colNoWrap='column nowrap';
let review=' review', 
	btnClass = klas.buyNowBtn, buyNowBtnCaption1 = buyNowBtnCaption, buyNowBtn;
//building card
setProp(container,{'display':flx, 'flexFlow':'row nowrap'}); setProp(goodDesc,{'display':flx, 'flexFlow':colNoWrap});
rating.style.display=flx;
goodImgWrap.classList.add('flex_centr'); //../styl/rst-0.css
	goodImgWrap.style.flexFlow=colNoWrap;
							
container.appendChild(goodImgWrap);
// loader, placeholder, book cover image append to goodImg Wrap
   loader.style.display=none;			setProp(goodImg, {'height':sto+'%', 'width':sto+'%'});
   goodImgWrap.appendChild(loader);		goodImgWrap.appendChild(goodImg);
						goodImg.dataset.src = opt1.imageSrc;
						
   coverPH.style.display=none;
   coverPH.dataset.bText = opt2.noCvrImgText;
   goodImgWrap.appendChild(coverPH);
						watchInScope(goodImg);	
//space block 	
container.appendChild(putEl(klas.spc1));
//item description
container.appendChild(goodDesc);
	goodDesc.appendChild(putEl(klas.author,opt1.author));
	goodDesc.appendChild(putEl(klas.caption,opt1.caption));
	goodDesc.appendChild(rating);
	   //4. Рейтинг: от 1 до 5 звёздочек плюс общее количество отзывов. Если в данных о книге нет рейтинга, не показывать эту строчку.
	   if (opt1.averageRating) {		   
		rating.appendChild(rateDisplay);			
		if (Number(opt1.reviewCnt)>1) {review=review+'s';}
		rating.appendChild(putEl(klas.reviewCnt,opt1.reviewCnt+review));
	   } else {rating.classList.add('noRateData');};
	goodDesc.appendChild(putEl(klas.annot,opt1.annot));	   
//button 'BUY NOW' and price block	   
	  innerCart.forEach ((i)=>{
		if (JSON.stringify(i)===JSON.stringify(itemID)) {
			buyNowBtnCaption1=opt1.inCartTxt;   btnClass = klas.buyNowBtn+ " buyNowBtnPressed";}
	  });
		buyNowBtn=  putEl(btnClass,buyNowBtnCaption1);
		//6. Цена с указанием валюты. Если в данных о книге нет цены, не показывать эту строчку.
		if (opt1.price) {
		     goodDesc.appendChild(price);
			buyNowBtn.addEventListener('click',(ev)=>{
				const buyBtn = ev.target;
				if (buyBtn.textContent===buyNowBtnCaption) {buyBtn.textContent=opt1.inCartTxt;									
									 buyBtn.classList.add("buyNowBtnPressed");
									//put item to buyer cart (Init00.js)
									 processCart(itemID,true);
									 
				} else {buyBtn.textContent=buyNowBtnCaption;
					//remove item from buyer cart (Init00.js)
					processCart(itemID,false); 
				      	buyBtn.classList.remove("buyNowBtnPressed");}
				//cart_bage element content fill (Init00.js)
				cartBage();
			});
		} else {price.style.opacity = '0.4';buyNowBtn =  putEl(klas.noBuyBtn,buyNowBtnCaption);}
	goodDesc.appendChild(buyNowBtn);
//set card container height			
setPropCard();
msgSrv({'buildCard image width':getProp2(goodImgWrap,'width'), 'buildCard image height':getProp2(goodImgWrap,'height')});
//set card container height on resize event
window.addEventListener('resize',setPropCard);
};