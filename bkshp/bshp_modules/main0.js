// BookShop-MS v.0.19.5 main module
'use strict';
const 
categorySelect = function () {	
	let lastCategory ={}, genLoader;
	const bookblk = cnst.d7.querySelector('.goodsBlock'), loadMoreBtn = cnst.d7.querySelector('.ldMoreBtn'),
	      zero = 0,	
bookblkWidth = () =>{return getProp2(bookblk,'width');
},
//scrolls up to the top once when cards have been dealt
scrUp = function () {
	const numThreshold = cnst.cardQuantity-1;
	let runOnce = true, intervalID, num;
   function runScrUp () {
	if (runOnce) {
		runOnce=false;
		// numThreshold waiting/watching
		intervalID = setInterval(()=>{
		num = cnst.d7.querySelectorAll('.cardContainer').length;  
		msgSrv({'scrUp cards':num});					
			if (num>numThreshold){
					clearInterval(intervalID);
					msgSrv({'scrUp scrollUp by':window.innerHeight});
					window.scrollBy(zero, -window.innerHeight);}
			},100);
	};
   };
return runScrUp;
}(),
bookBlockEmpty = ()  =>{if (bookblk.children.length) {return false;} else {return true;}},
ringProp = () =>{
	const divider = 5, ringDim = bookblkWidth()/divider, 
	ringDimPX = plusPX(ringDim), brThknss =plusPX(ringDim/divider) ;
return {'ringDim':ringDimPX, 'borderTh':brThknss};
},
loaderShow = (state=true) => {
	const RD = ringProp(), genLoaderClassName = 'genLoader', flexCentr = 'flex_centr';  
	if (state) {loadMoreBtn.style.display='none';
		    genLoader = putEl('loaderRing '+genLoaderClassName);
		    
		    setProp(genLoader,{ 'height':RD.ringDim, 'width':RD.ringDim, 'borderWidth':RD.borderTh, 'margin':'0'});
		 if (bookBlockEmpty()) {bookblk.style.backgroundColor='gainsboro';bookblk.classList.add(flexCentr);
					bookblk.appendChild(genLoader); /* 1 */}
		 else { genLoader.style.margin='1% auto 10%';
	    		bookblk.appendChild(genLoader);	/* 2 */window.scrollBy(zero, window.innerHeight);}
	}
	  else { loadMoreBtn.style.display='block';  
		 if (cnst.d7.querySelector('.'+genLoaderClassName)) {bookblk.removeChild(genLoader);} 		 
		 if (bookBlockEmpty()) {   bookblk.classList.remove(flexCentr); 
		   			   bookblk.style.backgroundColor='';	 	}
	};
},
//goods cards building preparation
cardDeal = (cardData,localData=false) => {
	
	  loaderShow(false);
	
    if (!bookBlockEmpty() && localData) {return;} 
    cardData = cardData.items;	
    for (let i=zero;i<cnst.cardQuantity;i++){
		const volInf = cardData[i].volumeInfo,
		      imgLinks = volInf.imageLinks,		      
		      searchInf = cardData[i].searchInfo,
		      volAuthors = volInf.authors,
		      saleInfo = cardData[i].saleInfo;		
		
		let authorCaption = '',cena = zero,		imageCoverURL ='',
	         		       annot = 'No annotation';
		if (imgLinks) {imageCoverURL = imgLinks.thumbnail};
 		if (searchInf) {if ('textSnippet' in searchInf) {annot = searchInf.textSnippet;}}
		if (saleInfo.saleability==='FOR_SALE') {cena = saleInfo.retailPrice.amount+' '+saleInfo.retailPrice.currencyCode;}
		if (volAuthors) {authorCaption=volAuthors[zero];
			volAuthors.forEach ((i,n)=>{ if (n) {authorCaption=authorCaption+', '+i;}});
		};
		let ratingsCount = volInf.ratingsCount, averageRating = volInf.averageRating;
		if (!ratingsCount) {ratingsCount=zero;}    if (!averageRating) {averageRating=zero;}
	const cardContainer = putEl('cardContainer');
		bookblk.appendChild(cardContainer);

	buildCard(cardContainer, {
		'imageSrc':imageCoverURL, 
	 	'author':authorCaption,
	 	'caption':volInf.title,
		'averageRating':averageRating,
		'reviewCnt':ratingsCount,
	 	'annot':annot,
	 	'price':cena});
    };//for (let i=0;i<cnst.cardQuantity;i++)...
	scrUp();
},
loadMoreBtnHeight = () =>{
	const bblkWidth = bookblkWidth();
   	setProp(loadMoreBtn,{'height':plusPX(bblkWidth/15), 'fontSize':plusPX(bblkWidth/35)});
};
function categorySelect (category,indexPlus=false) {
	/* fires when sidebar category selected (call from sidebar2.js - category selection by user) */
	/* category: {'number':number,'name':String} */
 	if (!category) {category={'number':zero,'name':siList[zero]};}
	if (lastCategory != category) {bookblk.innerHTML=''; }

 	  loaderShow();

	setTimeout(()=>{fetchData(category.name,cardDeal,indexPlus);},cnst.loadDelay);
 		
lastCategory = category};
//cart_bage element content initial fill (Init00.js)
cartBage();
//initial category selection + sidebar state setting (sidebar2.js)
categorySelect(sbItemSel(zero));
//load More Button
loadMoreBtnHeight();	
	loadMoreBtn.addEventListener('click',()=>{categorySelect(lastCategory,true);
	});
	window.addEventListener('resize',()=>{	
		const RD = ringProp();
		loadMoreBtnHeight();
		setProp(genLoader,{'height':RD.ringDim, 'width':RD.ringDim, 'borderWidth':RD.borderTh});
	});
return categorySelect;
}();
