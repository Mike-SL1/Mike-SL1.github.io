﻿'use strict';		
/* uBase - users personal data from 'userbase.js' */
let user=[],	usrID=null,	cBase=null,	rBase=null;
const normal = 'normal',	
   userRatingChangesLimit = 1,  	// rating counter changes attempts limit
   defaultSortMenuItemNumber = 2,	// [0..3]
   maxTextLength = 100,			// comment text max length 	
   menuSort=[{'text':'По дате',			'krit':'date'},
	     {'text':'По количеству оценок',	'krit':'rate'},
	     {'text':'По актуальности',		'krit':normal},
	     {'text':'По количеству ответов',	'krit':'answers'}],
  centeredWrap = doc.querySelector('.bin1'),
  container = doc.querySelector('.commentContainer'),
  commntsAmount = doc.querySelector('.commntsAmount'),
  commntsHeaderLine = doc.querySelector('.commntsHeaderLine'),	favControl = doc.querySelector('.favCntrl');
centeredWrap.style.display='block';

/* bases initialization procedure */
const baseInit = (keyName,cbFunction)=>{
let xValue = sTor(keyName);
  if (xValue===null) {xValue=cbFunction();
		      sTor(keyName,xValue);}
  return xValue;
};
/* user ID index base init */
usrID = baseInit ('usrID',()=>{
				let out ={'byCIDX':[],	/* to get user ID number by comment index */
					  'byRIDX':[],	/* to get user (replier) ID number by reply index */
					  'byName':{}	/* to get user ID number by user name */
					 }; 
     				     		return out;
			      }
);	
/* comments base init */
cBase = baseInit ('cBase',()=>{
				let out =[];	return out;	
			      }
);
/* replies base init */
rBase = baseInit ('rBase',()=>{
				let out =[];	return out;	
			      }
);
const getDateTime = () => {const tday1 = new Date(), date1 = [	tday1.getDate(), tday1.getMonth()+1,
/* Actual Date and Time Acquisition */	   			tday1.getHours(),tday1.getMinutes()];
			   date1.forEach((x,n,date1item)=>{if (x<10){date1item[n]='0'+x;}});
return {'date':`${date1[0]}.${date1[1]}`, 'time':`${date1[2]}:${date1[3]}`};
};
let auxMockDateTime=null;		// to store the previous function mockDateTime return value
const mockDateTime = (a) => {
	const tday1 = new Date(); 
	let day,month,monthPlus=false,date1;
	  if (a) {
		  day=Number(a['date'].slice(0,2));	
		  month=Number(a['date'].slice(3,5));	
	  } else {day=0;month=1;}
			     
	day++;	if (day>30) {day=1;monthPlus=true; }
	if (monthPlus) {month++;monthPlus=false; if (month>12){month=1;}}
				date1 = [day,month,tday1.getHours(),tday1.getMinutes()];
			   	date1.forEach((x,n,date1item)=>{if (x<10){date1item[n]='0'+x;}});
return {'date':`${date1[0]}.${date1[1]}`, 'time':`${date1[2]}:${date1[3]}`};
};
const buildUsersIndexTable = () => {
// ext. for new users enrollment to acquire userID by name
	uBase.forEach((i,count)=>{usrID['byName'][i['name']]=count;});
};    buildUsersIndexTable(); baseToStor(usrID);
class Comment{  
		static iniSortOrder = true;		
		constructor(userName){					
					this.user = userName;		this.showFavoritesOnly = false;
 
		let loadParams = [{'keyName':'uFav',	 'initValue':{'cIDX':[],'rIDX':[]}},
				  {'keyName':'uChange',  'initValue':{'rPermissions':[],'cPermissions':[]}},
				  {'keyName':'uSort',    'initValue':{'sortCriteria':null,'sortOrder':Comment.iniSortOrder}}
				 ];
		loadParams.forEach((paramObj,n)=>{
					const sTorKeyName =`${paramObj['keyName']}-${userName}`;
			      		if (sTor(sTorKeyName) === null) {sTor(sTorKeyName,paramObj['initValue'])};
					loadParams[n]['keyName'] = sTorKeyName;			
		});
			      this.uFav    = sTor(loadParams[0]['keyName']);
			      this.uChange = sTor(loadParams[1]['keyName']);
			      this.uSort   = sTor(loadParams[2]['keyName']);					 
		}
		get getName() 	    {return this.user;}
		get getIDByName()   {return usrID['byName'][this.user];}
		rebuildComments() {}
		placeComment(){ }
		placeReply  (){ }
		allowToChangeRate (){}
		showFavOnly(state=null)	    {if (state) {this.showFavoritesOnly=!this.showFavoritesOnly;}
					     return this.showFavoritesOnly;}
		setFav() {}
		findFav() {}
}
class User extends Comment{
		placeComment(commentText){
				auxMockDateTime = mockDateTime(auxMockDateTime);
				let dateTime1 = auxMockDateTime;
	// Get real Date and Time if no Date and Time specified
	if (!dateTime1) {dateTime1 = getDateTime();}
				let messageRecord= {'text':commentText,'rate':0,
						    'date':dateTime1['date'],'time':dateTime1['time'],'answers':0};
				usrID['byCIDX'].push(this.getIDByName);					 
		
				cBase.push(messageRecord);	baseToStor(usrID);
								baseToStor(cBase);		
				showComment(cBase.length-1);	showComntsAmount();
		}
		placeReply(comIDX,orderNumber){					
				auxMockDateTime=mockDateTime(auxMockDateTime);
				inputTextForm (this.user,orderNumber,auxMockDateTime,comIDX);				
		}
		allowToChangeRate (IDX,base){
			const poolTest = (auxPool,IDX) => {    const zero = 0;
					let maxChanges = userRatingChangesLimit,changes= zero;
					maxChanges--; if (maxChanges<zero) {maxChanges = zero;}
					auxPool.forEach((i)=>{if (i===IDX){changes++;}});		
					if (changes > maxChanges) {return false;} else {return true;}
			};	
			if (base===cBase) {if (poolTest (this.uChange['cPermissions'],IDX)){
						this.uChange['cPermissions'].push(IDX);
						sTor(`uChange-${this.user}`,this.uChange);
						return true;}
			} else {	   if (poolTest (this.uChange['rPermissions'],IDX)){
						this.uChange['rPermissions'].push(IDX);
						sTor(`uChange-${this.user}`,this.uChange);
						return true;}
				};	return false;
		}
		rebuildComments(sortCriteria=null,reverse=false){			
			const ordPic = doc.querySelector('.ordPic'), ordPicStl = ordPic.style,
			      vShift = Math.round(Number(ordPicStl.height.slice(0,2))*2)+'%';	
			commntsAmount.style.textDecoration = 'underline';
			commntsAmount.style.textUnderlinePosition='under';
			if (sortCriteria===null) {if (this.uSort['sortCriteria']===null) {
							 sortCriteria=defaultSortMenuItemNumber;
						 } else {sortCriteria=this.uSort['sortCriteria'];}
			};

			dispChoice (sortCriteria);
			
			if (this.uSort['sortCriteria']===sortCriteria) {
				if (reverse) {this.uSort['sortOrder']=!this.uSort['sortOrder'];}
			} else {this.uSort['sortOrder']=Comment.iniSortOrder;}
			
			rebuildAll(menuSort[sortCriteria]['krit'],this.uSort['sortOrder']);
			if (this.uSort['sortOrder'])  {
						ordPicStl.rotate='-135deg';		ordPicStl.translate=`0px -${vShift}`;
					      } 
				 	else {	
						ordPicStl.rotate='45deg';		ordPicStl.translate=`0px +${vShift}`;				      
					      };
			this.uSort['sortCriteria']=sortCriteria;
				sTor(`uSort-${this.user}`,this.uSort);
		}
		setFav(commentIndex,baseType=cBase) {
			let favAux = [], inBase=true, favTyp = 'cIDX';
			if (baseType===rBase) {favTyp = 'rIDX';}
				this.uFav[favTyp].forEach((uFavCommentIndex)=>{ 
					if (commentIndex===uFavCommentIndex)  {
						inBase=false;
					} else {
						favAux.push(uFavCommentIndex);
					};
				});
				if (inBase) {favAux.push(commentIndex);}
				this.uFav[favTyp] = favAux;
			sTor(`uFav-${this.user}`,this.uFav);
		return inBase;
		}
		findFav(commentIndex,baseType=cBase) {
			let inBase=false, favTyp = 'cIDX';
			if (baseType===rBase) {favTyp = 'rIDX';}
			this.uFav[favTyp].forEach((uFavCommentIndex)=>{
				if (commentIndex===uFavCommentIndex)  {inBase=true;}	
			});
		 return inBase;
		}
}
uBase.forEach((uBaseItem)=>{user.push(new User(uBaseItem['name']))});		
let activeUser = user[Math.floor(Math.random()*4)];						
const cls = (remForm=false) => {
/* cls(false) - keep main input form;
   cls(true)  - remove everything (include the form) */
		   const iNameToRemove =['.commentBlock','.commentBlockSeparator','.spHoop','.replyForm','.replyBlock'];
		   if (remForm) {iNameToRemove.push('.inputForm');}
		   let blocksToRemove=[];
		   iNameToRemove.forEach((i)=>{blocksToRemove.push(doc.querySelectorAll(i));});
		   blocksToRemove.forEach((blocks)=>{blocks.forEach((block)=>{block.remove();});});
};
// add event handlers to all class bottomF0 div's (comment's reply Buttons)
let funcPool =[];	// to store event handlers functions pool, only for 'buildReplyButtonsHandlers'
const buildReplyButtonsHandlers = () => {
   /* old handlers removing */
	funcPool.forEach((arg)=>{arg['node'].removeEventListener('click',arg['function']);});
	funcPool =[];
   /* setting new handlers */
	const replyBtn = doc.querySelectorAll('.bottomCommentF0');
	 replyBtn.forEach((i,orderNumber)=>{
	    	const placeReplyForm = (event) => {activeUser.placeReply(Number(event.target.dataset.cIDX),orderNumber);}; 	
		funcPool.push({'node':i,'function':placeReplyForm});	
		i.addEventListener('click', placeReplyForm);			
	 }); 
};
const dateToNumber = (stringDate) =>{const a=Number(stringDate),b=Math.floor(a);
					    return b + Math.round((a-b)*100*31);
};
// sort by normal,answers,rate,date						
const rebuildAll = (krit = normal,order=false) =>{
   let auxArray = [];
      cls(true);
      container.style.display = 'block'; 	   
if (krit===normal) {
	// sort by normal
	cBase.forEach((commentRecord,cIDX)=>{if (order) {auxArray.push(cIDX);} else {auxArray.unshift(cIDX);}
});
} else {
 	// sort by answers,rate,date
	let sBase = [];  	
	//sBase Fill
	let locBas=null;
	cBase.forEach((commentRecord)=>{
		   let result;
		   if (commentRecord) {
			if (krit==='date') {
					    result = dateToNumber (commentRecord['date']);
					    }
			else {result = commentRecord[krit];}
		       sBase.push(result);
		       /* locBase searching */
		       if (locBas===null) {
					   locBas=result;
		       } else {	
				if ((order && result>locBas) || (!order && result<locBas)) {locBas=result;}
		       };		
		   };
	}); 
	    if (order) {locBas++;} else {locBas--;}	// local base setting
	let lockNext, cIDXi;
	do {lockNext = locBas; cIDXi = null;
	    sBase.forEach((ans,n)=>{
				if ((order && ans<lockNext) || (!order && ans>lockNext)) {lockNext=ans;cIDXi =n;}
	    });
		if (cIDXi === null) {
				     break;
		} else {
			auxArray.push(cIDXi);
			sBase[cIDXi]=locBas;}				
	} while (true);
};
auxArray.forEach((comIDX)=>{
			if (!activeUser.showFavOnly() || activeUser.findFav (comIDX)) {showComment(comIDX,krit,order);}
					 
});  buildReplyButtonsHandlers();
//main comment form 0 - main form	
const inputTextFormMain = doc.querySelector('.inputForm');
 if (!inputTextFormMain) {inputTextForm (activeUser.getName,0);}	     	
};
const putDiv=(className,baseForm,mode=null,innerContent='') =>{
	let retVal = null;   if (mode===null) {mode=2;}
	const sampDiv = doc.createElement("div");	sampDiv.className = className;	
							sampDiv.innerHTML=innerContent;
	switch (mode){case 0: container.insertBefore(sampDiv,baseForm); break;
		      case 1: baseForm.innerHTML='';
		      case 2: baseForm.appendChild(sampDiv); 	case 3: break;
	default:console.log('putDiv:incorrect operMode -',mode);}		
return sampDiv;};
// 			---	comments on/off Menu control	---
const showComntsAmount = () => {
	commntsAmount.innerHTML=`Комментарии (${cBase.length})`;	
};    showComntsAmount();

commntsAmount.addEventListener('click',()=>{
		if (doc.querySelector('.commentBlock')) {
			cls(true);  commntsAmount.style.textDecoration = '';
				    container.style.display = 'none';
		} else {activeUser.rebuildComments();};
});
// 			---	sort order Menu selector	---
const sortMenuWrap = doc.querySelector('.sortMenuWrap'),
	sortMenuLink = putDiv('sortMenu',sortMenuWrap),	
	sortMenuBottom = sortMenuLink.getBoundingClientRect().bottom,	
		listContainer = putDiv('listContainer',sortMenuWrap),
		sortOrdPicWrap= putDiv('sortMenuOrdPic',sortMenuWrap),
			ordPic= putDiv('ordPic',sortOrdPicWrap),
			ordPicWidth = ordPic.getBoundingClientRect().width, 
	back = window.getComputedStyle(ordPic,null).getPropertyValue('background-color'),
	srtMnuSty=listContainer.style,	ordPicStl = ordPic.style;
		ordPicStl.background=`linear-gradient(135deg, ${back} 50%, transparent 50%)`;
		ordPicStl.transform ='skew(15deg, 15deg)';	
		ordPicStl.height = ordPicWidth+px;
		sortOrdPicWrap.style.width=Math.round(Math.sqrt(3*Math.pow(ordPicWidth,2)))+px;	
	sortMenuWrap.style.position='relative'; 
	srtMnuSty.display = 'none';		srtMnuSty.position='absolute';		
						srtMnuSty.zIndex='1';
    						srtMnuSty.top=Math.round(sortMenuBottom *0.7)+px;
const dispChoice = (iNumber) =>{		
	  const itemMark = doc.querySelectorAll('.itemMark');	       
	  	itemMark.forEach((mark)=>{mark.style.opacity='0';});
			     itemMark[iNumber].style.opacity='1';
				sortMenuLink.innerHTML = `${menuSort[iNumber]['text']}`;
};	
menuSort.forEach((i,n)=>{ 
	const itemLine = putDiv('listItem',listContainer),
		 mark1 = putDiv('itemMark',itemLine),	     		mark1Stl = mark1.style,
		markSign = putDiv('markSign',mark1),			markSignStl= markSign.style,
	      itemDesc = putDiv('itemDesc',itemLine,2,`${i['text']}`);
		if (i['krit']===normal) {mark1Stl.opacity='1';} else {mark1Stl.opacity='0';}
 	
		markSignStl.borderColor = 'red';	markSignStl.borderStyle='solid';
		markSignStl.rotate='30deg';		markSignStl.borderWidth='0 2px 2px 0';

	      markSign.dataset.choiceNum=n;	itemLine.dataset.choiceNum=n;
		 mark1.dataset.choiceNum=n;	itemDesc.dataset.choiceNum=n;	
  							
	itemLine.addEventListener('click',(ev)=>{
		const iNumber = Number(ev.target.dataset.choiceNum);	
			dispChoice (iNumber);
				activeUser.rebuildComments(iNumber,true);
	srtMnuSty.display = 'none';	
	});
});
sortMenuLink.addEventListener('click',() =>{
    if (srtMnuSty.display === 'block') {srtMnuSty.display = 'none'; return;} else {srtMnuSty.display = 'block';}
		
const	itemMark = doc.querySelectorAll('.itemMark'), 	itemDesc = doc.querySelector('.itemDesc'),
	itemDescDim = itemDesc.getBoundingClientRect(),	markDim  = Math.floor(itemDescDim.height),
	markSign = doc.querySelectorAll('.markSign');
   itemMark.forEach((mark)=>{
		const markStl = mark.style;	markStl.width =markDim+px;
						markStl.height=markDim+px;});
   markSign.forEach((sign)=>{
		const signStl = sign.style;							
		signStl.width = Math.floor(markDim/2.7) +px;	signStl.height =Math.floor(markDim/1.5) +px;
		signStl.translate='0px -' + Math.floor(markDim/5) + px;});
});
doc.addEventListener('click',(ev)=>{
	if (!(ev.target===listContainer || ev.target===sortMenuLink) && srtMnuSty.display === 'block') {srtMnuSty.display = 'none';}
});
listContainer.addEventListener('click',()=>{srtMnuSty.display = 'none';});
// end of 		---	sort order Menu selector		---
//         		---	favorites on/off Menu control		---
const favBackClr = () =>{
	const favStl= favControl.style;
	if (activeUser.showFavOnly()) {
		favStl.background='pink';
	} else {favStl.background='palegreen';}
};
favControl.addEventListener('click',(ev)=>{
				     activeUser.showFavOnly(1);
				     favBackClr();
				activeUser.rebuildComments();
});
// end of 		---	favorites on/off Menu control		---
const putBtn = (className1,baseForm,caption,func) => {
	const sample = doc.createElement("button");	sample.innerHTML=caption;	
							sample.className = className1; 	
	if (baseForm) {baseForm.appendChild(sample);
	} else {baseForm=doc.querySelector('div');doc.body.insertBefore(sample, baseForm);}			
sample.addEventListener('click',func);
return sample;
};
const buildBlock = (baseForm,IDX,baseType=false) =>{
const setItemWidth = (i) =>{const iHeight = Math.floor(i.getBoundingClientRect().height)+'px';i.style.width = iHeight;}
let userNamereplyToComment = '* unknown *',
	    userData = uBase[usrID['byCIDX'][IDX]],   	hFC = [],		
	    base=cBase,bottomF = 'bottomCommentF',	bFC = [],
	    comment=true, favItemOrder = 1; 
			
			if (baseType) {	comment=false; 			
					base=rBase;
					userData = uBase[usrID['byRIDX'][IDX]];
					bottomF = 'bottomReplyF';  favItemOrder = 0;						
					userNamereplyToComment=uBase[usrID['byCIDX'][base[IDX]['tocIDX']]]['name'];
					hFC = ['1.BackArrow',userNamereplyToComment];
					}
			else {bFC.push('0.Reply');}
		bFC.push('FAV');		bFC.push('-');	bFC.push(base[IDX]['rate']); 	bFC.push('+');
	    	hFC.unshift(userData['name']);
		hFC.push(base[IDX]['date']);		hFC.push('*S*');	hFC.push(base[IDX]['time']);
	/*User Avatar Section*/
		putDiv("userAvatarWrap",baseForm,2,`<img src=${userData['imgSrc']} class="userAvatar">`);		
	/*User Content Section: Header (FIO, BackArrow Sign, Date, Time*/
		const usrCntnt = putDiv("userContent",baseForm);
			/*User content section header container*/ 
			const contentHeader = putDiv("contentHeader",usrCntnt);   	
/*Header blocks building*/		
	/* hFC = [userData['name'],'1.BackArrow',userNamereplyToComment,base[IDX]['date'],'*S*',base[IDX]['time']]; */     
			hFC.forEach((hFC,i)=>{putDiv(`headerF headerF${i}`,contentHeader,2,`${hFC}`);});
				/*User Comment Textblock*/
				putDiv("commentText",usrCntnt,2,`${base[IDX]['text']}`);
			/*User content section bottom container*/
			const contentBottom = putDiv("contentBottom",usrCntnt);/*
/*Bottom blocks building*/
   	/* bFC = ['0.Reply',`${base[IDX]['fav']}`,`${base[IDX]['rate']}`]; */
let minusF = null;
const minusColor = 'red', plusColor = 'green';
		bFC.forEach((bFC,i)=>{ 
				let contentBottomFclass = '';
				switch (bFC) {case '-':contentBottomFclass =`rateCtrl`; break;
					      case '+':contentBottomFclass =`rateCtrl`; break;
					       default:contentBottomFclass =`bottomF ${bottomF}${i}`;}
				const contentBottomF = putDiv(contentBottomFclass,contentBottom,2,`${bFC}`),
				// cBFs - auxiliary local constant
				cBFs = contentBottomF.style; 
if (bFC=== '-' || bFC=== '+') {
	setItemWidth(contentBottomF);
   contentBottomF.addEventListener('click',(ev) =>{
	let rateDisplayEl = ev.target.nextSibling;
	if (activeUser.allowToChangeRate (IDX,base)){
		if (ev.target.style.color===minusColor) {
			base[IDX]['rate']--;
		} else {base[IDX]['rate']++;   rateDisplayEl = ev.target.previousSibling;}	
		baseToStor(base);	       rateDisplayEl.innerHTML=base[IDX]['rate'];	
	};
   });
};	switch (bFC) {case '-':	
				minusF = contentBottomF;
				cBFs.color=minusColor;		break;
		      case '+':	
				cBFs.color=plusColor;		break;
	default:contentBottomF.dataset.cIDX=IDX; 
		if (favItemOrder === i) {				      	
			if (activeUser.findFav(IDX,base)) {cBFs.background = 'red';} else {cBFs.background = 'green';}

		contentBottomF.addEventListener('click',(ev) =>{
			if (activeUser.setFav (Number(ev.target.dataset.cIDX),base)) {
			         cBFs.background = 'red';
				 // parent comment switch to favorite	
			         if (base===rBase) {
					if (!activeUser.findFav(rBase[IDX]['tocIDX'])) {
				   	// comment block favorite display on
			            	   const cmntFavFPool= doc.querySelectorAll('.bottomCommentF1');
			            	   cmntFavFPool.forEach((i)=>{
							if (Number(i.dataset.cIDX)===rBase[IDX]['tocIDX']) {
								i.style.background='red';}
					   });			   
			            	   activeUser.setFav(rBase[IDX]['tocIDX']);}
				 };
			} else {
				 cBFs.background = 'green';
			   if (base===cBase) {
				// reply blocks favorites displays off 
				const rplytFavFPool= doc.querySelectorAll('.bottomReplyF0');
				   	rBase.forEach((i,rIDX)=>{
					   if (i['tocIDX']===IDX && activeUser.findFav(rIDX,rBase)) {
						activeUser.setFav(rIDX,rBase);
						// all replies favorites displays set off
						rplytFavFPool.forEach((replyFav)=>{
							if (Number(replyFav.dataset.cIDX)===rIDX){
								replyFav.style.background='green';
							}
						});
					   };					
				   	});
			   };
			};

		});
		};
		};
		});
	// rating field background color
	if (minusF) minusF.nextSibling.style.background='yellow';
}
const showReply = (frameElement,rIDX)=> {
putDiv("commentBlockSeparator",frameElement,0);
const replyBlock = putDiv('replyBlock',frameElement,0); frameElement.remove();
	 	   putDiv('spHoop',replyBlock);	
const innerReplyBlock = putDiv("innerReplyBlock",replyBlock);	buildBlock(innerReplyBlock,rIDX,true);
};
const inputTextForm = (userName,orderNumber,dateTime=null,comIDX=null) =>{
	let textLength = 0, allowComment=false, messageRecord, separ;	
	const senderID = usrID['byName'][userName],		/* message length warning display colors */
	      tooLongMessage = 'Слишком длинное сообщение',		inactive ='#000000', active = '#FF0000',
	      max1000chrsMessage = `Макс. ${maxTextLength} символов`,
	 commBlocksArray = doc.querySelectorAll('.commentBlock'),
		inputForm = putDiv("inputForm",null,3), userData = uBase[usrID['byName'][userName]],
		inputFormAva = putDiv("userAvatarWrap",inputForm,2,`<img src=${userData['imgSrc']} class="userAvatar">`),
		inputFormContainer = putDiv("inputFormContainer",inputForm),
			inputFormHeader = putDiv("inputFormHeader",inputFormContainer),	
				userNameField = putDiv("userNameField",inputFormHeader,2,userName),
				symbolCounter = putDiv("symbolCounter",inputFormHeader,2,`${textLength}/${maxTextLength}`),
				warningField  = putDiv("warningField",inputFormHeader,2,max1000chrsMessage),
			inputFormMain = putDiv("inputFormMain",inputFormContainer),
		   textInput = doc.createElement("textarea");	
			warningField.style.color=inactive;	
				textInput.className = "textInput";   
				textInput.placeholder = 'Введите здесь текст Вашего комментария';
 				textInput.name = 'userInputText';	textInput.style.resize='none';
									inputFormMain.appendChild(textInput);
			textInput.addEventListener('input',(i)=>{
				const maxLength = 50, rowsQuantity = 2; textLength = textInput.value.length;
				  textInput.rows = rowsQuantity+Math.floor(textLength / maxLength);
				symbolCounter.innerHTML=`${textLength}/${maxTextLength}`;
				if (textLength > maxTextLength)	{
					warningField.style.color=active; 	allowComment = false;
					warningField.innerHTML=tooLongMessage;
				} else {warningField.style.color=inactive; 	allowComment = true;
					warningField.innerHTML=max1000chrsMessage;}	
});
  if (comIDX!=null) {/* reply form */
			commBlocksArray[orderNumber].insertAdjacentElement('afterend', inputForm);
		      	separ = putDiv("commentBlockSeparator",inputForm,0);} 
	       else {/* comment form */
		     if (doc.querySelector('.commentBlock')) {
		      		separ = putDiv("commentBlockSeparator",commBlocksArray[orderNumber],0);
		     };
		      centeredWrap.insertBefore(inputForm,container);	}
				 
     putBtn('formSendBtn',inputFormMain,'SEND',()=>{ 
	// Get real Date and Time if no Date and Time specified
	if (!dateTime) {dateTime = getDateTime();}
	if (allowComment && textLength) {
		if (comIDX!=null) { 
			      /* reply form */
				messageRecord = {'tocIDX':comIDX,'text':textInput.value,'rate':0,'date':dateTime['date'],
					         'time':dateTime['time']};
				cBase[comIDX]['answers']++;		baseToStor(cBase);
				usrID['byRIDX'].push(senderID);		baseToStor(usrID);	
				separ.remove();
				rBase.push(messageRecord);		baseToStor(rBase);	
								showReply(inputForm,rBase.length-1);
									
		} else	    {
			      /* comment form */
				activeUser.placeComment(textInput.value);	textInput.value = ''; 	
							   			textLength=0;
				buildReplyButtonsHandlers();		
			    };
	};
     });				
	if (comIDX!=null) {putBtn('replyFormCnclBtn',inputFormMain,'Cancel',()=>{inputForm.remove();separ.remove();});}
};

const showComment = (comIDX,krit=null,order=true)=> {	
let replyForm, replierName, auxArray = [];	 
	const prevCmntBlk = doc.querySelector('.commentBlock');			
	/*Comment Block Root Element*/
	const emptyDiv = putDiv("commentBlockSeparator",prevCmntBlk,0),
	       commBlk =  putDiv("commentBlock",emptyDiv,0);
	if (krit) {
		rBase.forEach((reply,rIDX)=>{
					if ((reply['tocIDX']===comIDX) && (!activeUser.showFavOnly() || activeUser.findFav (rIDX,rBase))) {
							auxArray.push({'reply':reply,'rIDX':rIDX});
					}
		});
	
	/* auxArray sorting */
		switch (krit) { case 'rate': auxArray.sort(function(a, b){return a['reply']['rate'] - b['reply']['rate']}); 	break;
				case 'date': auxArray.sort(function(a, b){
				return dateToNumber (a['reply']['date']) - dateToNumber (b['reply']['date'])}); 		break;
		};
	/* reversing order */
		if (order || krit==='answers') auxArray.reverse();
	/* auxArray output */
		auxArray.forEach((i)=>{
			replyForm=putDiv("replyForm",emptyDiv,0);
			showReply (replyForm,i['rIDX']);
		});
};			
// remove the lowest separator
	if (!prevCmntBlk) {emptyDiv.remove();}
buildBlock(commBlk,comIDX,false);	
return commBlk;
};
/* Test comments */
const testComments = () =>{
if (sTor('testPass')) {return null;}
	const comusr = ' тестовый комментарий пользователя ';
	user[0].placeComment(`Первый${comusr}${uBase[0]['name']}`);
	user[0].placeComment(`Второй${comusr}${uBase[0]['name']}`);
	user[0].placeComment(`Третий${comusr}${uBase[0]['name']}`);
	user[1].placeComment(`Первый${comusr}${uBase[1]['name']}`);
	user[1].placeComment(`Второй${comusr}${uBase[1]['name']}`);
	user[2].placeComment(`Первый${comusr}${uBase[2]['name']}`);
	user[2].placeComment(`Второй${comusr}${uBase[2]['name']}`);
	user[0].placeComment(`Четвёртый${comusr}${uBase[0]['name']}`);
	user[1].placeComment(`Третий${comusr}${uBase[1]['name']}`);
 	user[3].placeComment(`Первый${comusr}${uBase[3]['name']} - idx 10 AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA`);
buildReplyButtonsHandlers();
sTor('testPass',true);
};
	testComments();
/* active user selector control block */
let lastButton;
const activeUserName = () =>{
	const text = `Активен пользователь: ${activeUser.getName} (userID ${activeUser.getIDByName})`,
	textLen = text.length+1, nameFieldStyle = doc.querySelector('.nameField').style;	
	nameFieldStyle.width=textLen+'ch';
	return text;
};
const 	firstDiv = doc.querySelector('div'),  
	usrSlct = putDiv('usrSelector',firstDiv,3),	usrSlctStyl = usrSlct.style,
        nameField = putDiv('nameField',usrSlct,2,activeUserName),
	cr = doc.createElement("br"),			nFldStyl = nameField.style;		

usrSlctStyl.display = 'inline-flex';	usrSlctStyl.padding = '2px';
usrSlctStyl.border='1px solid lime'; 	usrSlctStyl.boxShadow='5px 5px 0px 0px lightgray';

					nFldStyl.textAlign='center';  
					nFldStyl.padding='5px';		nFldStyl.background='mistyrose';

	doc.body.insertBefore(cr,firstDiv);	
	doc.body.insertBefore(usrSlct,cr);		
/* user switch buttons */
uBase.forEach((i)=>{let btnStl;
		    lastButton=putBtn('eventBtn1',usrSlct,i['name'],(ev)=>{
				newUserLogIn(i['name']);
				btnStl = ev.target.style;	btnStl.fontWeight='700';	btnStl.boxShadow='0px 0px 3px 2px yellow';	
								btnStl.borderColor='lime';	btnStl.background='greenyellow';								
		    });		btnStl = lastButton.style;		
								btnStl.marginRight='10px';	btnStl.background='limegreen';
});    		    lastButton.insertAdjacentElement('afterend', nameField);
/* user login proc */
const newUserLogIn = (userName) => {
			const eventBtns1 = doc.querySelectorAll('.eventBtn1'), userNumber = usrID['byName'][userName];
			activeUser = user[userNumber];
			activeUser.rebuildComments();				
			favBackClr();	    
			eventBtns1.forEach((i,n)=>{
						const iSt = i.style;
							if (n===userNumber) {
							iSt.boxShadow='0px 0px 3px 2px yellow';		iSt.background='greenyellow';
							iSt.borderColor='lime';				iSt.fontWeight='700';	
						} else {
							iSt.boxShadow='0px 0px 0px 0px';		iSt.background='limegreen';
							iSt.borderColor='black';			iSt.fontWeight='400';}});
				    nameField.innerHTML = activeUserName();
};
newUserLogIn (activeUser.getName);	//to show main comment form at page start/refresh

/* Diag section */
const diag = () =>{console.clear();	const ast ='     ';
console.log(ast,ast,'   ---   Diag begin   ---');
console.log(ast,'*','users:');			uBase.forEach((i,n)=>{console.log('user#',n,' :',i);});
console.log(ast,'*','comments:');		cBase.forEach((i)=>{console.log(i);});
console.log(ast,'*','userID By cIDX Table');	
	usrID['byCIDX'].forEach((i,n)=>{console.log('commentIDX ',n,' ','user# ',i,'(',uBase[i]['name'],')');});
console.log(ast,'*','replies:');		rBase.forEach((i)=>{console.log(i);});
console.log(ast,'*','userID By rIDX Table');	
	usrID['byRIDX'].forEach((i,n)=>{console.log('replyIDX ',n,' ','user# ',i,'(',uBase[i]['name'],')');});
 return ast+ast+ast+'   ---   Diag end   ---';};	//diag();