//  v.6.33 (comsys63.js)
/* users passports base */
'use strict';	
let uBase=[
	{'name':'Андрей',	
		 'imgSrc':'img/a.jpg'},  		/*	uBase[0]	*/

     	{'name':'Борис',	
		 'imgSrc':'img/b.jpg'}, 		/*	uBase[1]	*/

      	{'name':'Вика',	
		 'imgSrc':'img/c.jpg'},			/*	uBase[2]	*/

	{'name':'Гоша',
		 'imgSrc':'img/g.jpg'}];		/*	uBase[3]	*/
/*
 users base -    [{'name':'a',		
		   'imgSrc':'a.jpg'} 
]
 comment base  - [{'text':'комментарий 0 - user 0','rate':10,'date':dateM,'time':timeM,'answers':0}
]
 reply base -    [{'toCIDX':2,'text':'комментарий 0 - user 0','rate':10,'date':dateM,'time':timeM}
]
*/
let validUser = 0,	errorFlag = false, user=[],	usrID=null,	cBase=null,	rBase=null,	
mobile376 = false, 
auxMockDateTime=null,		// to store the previous function mockDateTime return value
activeUser, funcPool =[];	// to store event handlers functions pool, only for 'buildReplyButtonsHandlers'

const doc=document, 	 px = 'px',	requestString = "https://randomuser.me/api/",
      normal = 'normal', ver = 633,	minusColor = 'red', 	plusColor = 'rgb(138,197,64)',
					dec = '-',		inc = '+',	    
messageWrap = doc.createElement('div'), progressWrap = doc.createElement('div'), 

	meStyl = messageWrap.style,	progStyl = progressWrap.style,	
uBaseLen = uBase.length, timing1 = 2000, timing2 = timing1 / 4, brdWdth ='1px solid ', shadow = '3px 3px 2px 1px lightgray';

meStyl.border = brdWdth+'red';     meStyl.padding = 8+px;         meStyl.display = 'inline-block'; 	meStyl.fontSize=22+px;
progStyl.border = brdWdth+'blue';  progStyl.minWidth = 100+px;    progStyl.display = 'inline-flex';	meStyl.boxShadow = shadow;
progStyl.marginLeft = 10+px;	   progStyl.background = 'green'; progStyl.boxShadow = shadow;
/* mobile version width marker */
const   widthBrkPnt = 376,			
/* rating counter changes attempts limit */
   userRatingChangesLimit = 1,  
/* in range [0..3] */	
   defaultSortMenuItemNumber = 2,
/* user input comment text max length limit */
   maxTextLength = 1000,	
/* sort menu items */			
   menuSort=[{'text':'По дате',			'krit':'date'},
	     {'text':'По количеству оценок',	'krit':'rate'},
	     {'text':'По актуальности',		'krit':normal},
	     {'text':'По количеству ответов',	'krit':'answers'}],	inActFavPic = 'Gry', actFavPic = 'Red', 
  centeredWrap = doc.querySelector('.bin1'),
  container = doc.querySelector('.commentContainer'),
  commntsAmount = doc.querySelector('.commntsAmount'),
  commntsHeaderLine = doc.querySelector('.commntsHeaderLine'),	favControl = doc.querySelector('.favCntrl');

const insBrik = () => {
const progressBrik = doc.createElement('div'),	  brikStyl = progressBrik.style;
brikStyl.width = 20+px;  brikStyl.height = 10+px; brikStyl.background = 'red';
progressWrap.appendChild(progressBrik);
};    
const messageShow = () => {
let text; const basyP =' базы пользователей ';
switch (errorFlag) {case false: text= `Загрузка${basyP}из ${requestString}: Загружено ${validUser} записей из ${uBaseLen}`; break;
	    	    case  true: text= `Ошибка загрузки${basyP}из ${requestString}. Используем локальную базу`;		    break;}
messageWrap.innerHTML = text+'.';
};    
function requestUserData() {	
  let xhR = new XMLHttpRequest();
      xhR.open("get", requestString);
      xhR.onload = function () {
      	if (xhR.status === 200) {
          	let xhRResp = JSON.parse(xhR.response)['results'][0], 
		name = xhRResp['name']['first']+' '+xhRResp['name']['last'],    
		picURL = xhRResp['picture']['large'];
		uBase[validUser]={'name':name,'imgSrc':picURL};
		      validUser++; insBrik ();		 
        };
	}; 
      xhR.onerror = function () {errorFlag = true;}	              
      xhR.send();         
}; 
/* Data save to and load from local browser storage */
const sTor = (keyName=null,value=null) =>{
   let functionOut=null;
   /* if no arguments (i.e. keyName=null) then con('stor: ERR - no args') and return */
	if (keyName===null) {
		console.log('sTor: ERR - function call with no arguments');		
	} else 	{if (value===null) {
			/* request to local Stor for key named `keyName` */
			value = localStorage.getItem(keyName);
			if (value===null) {
				/* console.log('sTor: no key named - ',keyName,' in storage'); */
			} else {
				functionOut = JSON.parse(value);
			}  
		} else {
			/* save the value named as `keyName` value */
			 localStorage.setItem(keyName,JSON.stringify(value));
		};
	};
return functionOut;
};
/* saving base to local storage */
const baseToStor = (base) => {
	switch (base) {case uBase: sTor('uBase',uBase); break;
		       case cBase: sTor('cBase',cBase); break;
		       case rBase: sTor('rBase',rBase); break;
		       case usrID: sTor('usrID',usrID); break;
	};
};
/* bases initialization procedure */
const baseInit = (keyName,cbFunction)=>{
let xValue = sTor(keyName);
  if (xValue===null) {xValue=cbFunction();
		      sTor(keyName,xValue);}
  return xValue;
};
/* load previous users base from storage */
const auxBase = sTor('uBase'); 
const script2 = () => {			/*	----	M A i N  	P R O C E D U R E 	----	*/
							/* script 2 - v.6.3 */	
/* spHoopWidth - summarized space Hooper width for Reply block left margin (showReply())*/
let spHoopWidth = sTor('spHoopWidth');
centeredWrap.style.display='block';
/* user ID index base init */
usrID = baseInit ('usrID',()=>{
				return {'byCIDX':[],	/* to get user ID number by comment index */
				        'byRIDX':[],	/* to get user (replier) ID number by reply index */
				        'byName':{}	/* to get user ID number by user name */
				        }; 
			      }
);	
/* comments base init */
cBase = baseInit ('cBase',()=>{
				return [];		
			      }
);
/* replies base init */
rBase = baseInit ('rBase',()=>{
				return [];	
			      }
);
const getDateTime = () => {const tday1 = new Date(), date1 = [	tday1.getDate(), tday1.getMonth()+1,
/* Actual Date and Time Acquisition */	   			tday1.getHours(),tday1.getMinutes()];
			   date1.forEach((x,n,date1item)=>{if (x<10){date1item[n]='0'+x;}});
return {'date':`${date1[0]}.${date1[1]}`, 'time':`${date1[2]}:${date1[3]}`};
};
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
		showFavOnly(state=null)	    {					
					switch (state){case true:this.showFavoritesOnly=true; break;
						      case false:this.showFavoritesOnly=false;break;}
					     return this.showFavoritesOnly;}
		setFav() {}
		findFav() {}
}

class User extends Comment{
		placeComment(commentText){
				auxMockDateTime = mockDateTime(auxMockDateTime);
				let dateTime1 = auxMockDateTime, cBaseLen;
	// Get real Date and Time if no Date and Time specified
	if (!dateTime1) {dateTime1 = getDateTime();}
				let messageRecord= {'text':commentText,'rate':0,
						    'date':dateTime1['date'],'time':dateTime1['time'],'answers':0};
				usrID['byCIDX'].push(this.getIDByName);					 
		
				cBase.push(messageRecord);	baseToStor(usrID);
								baseToStor(cBase);
				cBaseLen = cBase.length-1;						
				showComment(cBaseLen);		underLineSwitch();
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
			const ordPic = doc.querySelector('.ordPic'), ordPicStl = ordPic.style;
			  let vShift = Math.round(Number(ordPicStl.height.slice(0,2))*2),	
			  shiftSign='', angle = 45;
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
						angle = -135;	shiftSign='-';	vShift+=15; };
				ordPicStl.rotate=`${angle}deg`;
				ordPicStl.translate=`0px ${shiftSign}${vShift}%`;
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
 			heartSwitch();
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
activeUser = user[Math.floor(Math.random()*4)];

const favPresent = () =>{
if (activeUser.uFav['cIDX'].length
	||
    activeUser.uFav['rIDX'].length) {return true;} else {return false;}
};
const heartSwitch = () =>{
let heartPic = inActFavPic; if (favPresent()) {heartPic = actFavPic;}
doc.querySelector('.heartPic').src = `img/heart${heartPic}.gif`; 
};
						
const cls = (remForm=false) => {
/* cls(false) - keep main input form;
   cls(true)  - remove everything (include the form) */
		   const iNameToRemove =['.commentBlock','.commentBlockSeparator','.spHoop','.vertMargin','.replyForm','.replyBlock'];
		   if (remForm) {iNameToRemove.push('.inputForm');}
		   let blocksToRemove=[];
		   iNameToRemove.forEach((i)=>{blocksToRemove.push(doc.querySelectorAll(i));});
		   blocksToRemove.forEach((blocks)=>{blocks.forEach((block)=>{block.remove();});});
};
const parentElFind = (event) =>{
let element = event.target;	
if (element.tagName==='IMG') {element = event.target.parentElement;}
return element;
};
// add event handlers to all class bottomF0 div's (comment's reply Buttons)
const buildReplyButtonsHandlers = () => {
   /* old handlers removing */
	funcPool.forEach((arg)=>{arg['node'].removeEventListener('click',arg['function']);});
	funcPool =[];
   /* setting new handlers */
	const replyBtn = doc.querySelectorAll('.bottomCommentF0');
	 replyBtn.forEach((i,orderNumber)=>{
	    	const placeReplyForm = (event) => {activeUser.placeReply(Number(parentElFind(event).dataset.cIDX),orderNumber);}; 	
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
const getProp = (DomElement,propertyName) =>{
return window.getComputedStyle(DomElement,null).getPropertyValue(propertyName);
};
const putDiv=(className,baseForm=null,mode=null,innerContent='') =>{   	
	if (mode===null) {
		if (baseForm===null) {
			mode=3;
		} else {mode=2;}	  
	};
	const sampDiv = doc.createElement("div");	sampDiv.className = className;	
							sampDiv.innerHTML=innerContent;
	switch (mode){case 0: container.insertBefore(sampDiv,baseForm); break;
		      case 1: baseForm.innerHTML='';
		      case 2: baseForm.appendChild(sampDiv); 	case 3: break;
	default:console.log('putDiv:incorrect operMode -',mode);}
		
return sampDiv;};
// 			---	sort order Menu selector	---
const   sortMenuWrap = doc.querySelector('.sortMenuWrap'),
	sortMenuLink = putDiv('sortMenu',sortMenuWrap),	
	sortMenuBottom = sortMenuLink.getBoundingClientRect().bottom,	
		listContainer = putDiv('listContainer',sortMenuWrap),
		sortOrdPicWrap= putDiv('sortMenuOrdPic',sortMenuWrap),
			ordPic= putDiv('ordPic',sortOrdPicWrap),
			ordPicWidth = ordPic.getBoundingClientRect().width, 
		
	back = getProp(ordPic,'background-color'),
	srtMnuSty=listContainer.style,	ordPicStl = ordPic.style;
		ordPicStl.background=`linear-gradient(135deg, ${back} 50%, transparent 50%)`;
		ordPicStl.transform ='skew(15deg, 15deg)';	
		ordPicStl.height = ordPicWidth+px;
		sortOrdPicWrap.style.width=Math.round(Math.sqrt(3*Math.pow(ordPicWidth,2)))+px;	
	sortMenuWrap.style.position='relative'; 
	srtMnuSty.display = 'none';		srtMnuSty.position='absolute';		
						srtMnuSty.zIndex='1';
    						srtMnuSty.top=Math.round(sortMenuBottom *0.7)+px;
const underLineSwitch = (evTarget=null) =>{

const comHeaderChilds = [commntsAmount,sortMenuLink,favControl],
	activeClr = 'black', inActiveClr = 'gray', borderThickness = 5+px;
	
comHeaderChilds.forEach((i)=>{						
  const ist = i.style;
	if (i===evTarget) {ist.color=activeClr;	
			   ist.textDecoration='';	ist.borderBottom=`${borderThickness} solid ${activeClr}`;	
	} else {
		ist.color=inActiveClr;			ist.borderBottom=`${borderThickness} solid transparent`;
		ist.textDecoration='underline';		
		ist.textUnderlinePosition='under';}
});	
    if (evTarget===favControl) {activeUser.showFavOnly(true);	
	     		} else {activeUser.showFavOnly(false);	
    };	
activeUser.rebuildComments();
};    
commntsAmount.addEventListener('click',()=>{
				             underLineSwitch(commntsAmount);
});
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
 	
							markSignStl.borderStyle='solid';
		markSignStl.rotate='35deg';		

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
   					     underLineSwitch(sortMenuLink);		
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
favControl.addEventListener('click',()=>{				     
				             underLineSwitch(favControl);
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
const strToNum = (str) =>{
return Number(str.match( /\d+/ ));
};
/* mobile 376 px width mode */	
const checkWidth = () => {
if (strToNum(getProp(centeredWrap,'width'))===widthBrkPnt) {mobile376=true;} else {mobile376 = false;}
};    
const buildBlock = (baseForm,IDX,baseType=false) =>{
const prefixFv = `<img class='cmntFavFild' src='img/heart`, postfix1 = `.gif'>В избранно`,
      inFav = `${prefixFv}${actFavPic}${postfix1}м`,
      toFav = `${prefixFv}${inActFavPic}${postfix1}е`,  startDiv = '<div class=',	termDiv = '</div>',
							backArrowPic= `<img class='talkBackArrow' src='img/talkBackArrow.gif'>`,
						        dateTimeFieldClass = `${startDiv}'dateTimeField'>`,
      dateTimeSepar = '89162318y', dateTimeSpace = 9; 
let replyToName = '* unknown *',
	    userData = uBase[usrID['byCIDX'][IDX]],   	hFC = [],		
	    base=cBase,bottomF = 'bottomCommentF',	bFC = [],
	    reply=false, favItemOrder = 1; 
const pushReplyTo = () =>{	hFC.push(`${backArrowPic}`);
				hFC.push(`${startDiv}'replyToName'>${replyToName}${termDiv}`);
};			
			if (baseType) {	reply=true; 			
					base=rBase;
					userData = uBase[usrID['byRIDX'][IDX]];
					bottomF = 'bottomReplyF';  favItemOrder = 0;						
					replyToName=uBase[usrID['byCIDX'][base[IDX]['toCIDX']]]['name'];
					if (!mobile376) {pushReplyTo();}
					}
			else {bFC.push(`${backArrowPic}Ответить`);
			};
		bFC.push(toFav);
hFC.unshift(userData['name']);
		hFC.push(`${dateTimeFieldClass}${base[IDX]['date']}${termDiv}`);		
hFC.push(dateTimeSepar);	
		hFC.push(`${dateTimeFieldClass}${base[IDX]['time']}${termDiv}`);
/* Rating control block preforming */
const rateBlock0 = [dec, base[IDX]['rate'], inc]; let rateBlock = rateBlock0;
if (mobile376) {rateBlock = rateBlock0.toReversed();
		if (reply) {pushReplyTo();}}
bFC = bFC.concat(rateBlock);

	/*User Avatar Section*/
		putDiv("userAvatarWrap",baseForm,2,`<img src=${userData['imgSrc']} class="userAvatar">`);
	/*User Content Section Left Margin */
		putDiv("userContentLMargin",baseForm);	
	/*User Content Section: Header (FIO, BackArrow Sign, Date, Time*/
		const usrCntnt = putDiv("userContent",baseForm);
			/*User content section header container*/ 
			const contentHeader = putDiv("contentHeader",usrCntnt);   	
/*Header blocks building*/		
	/* hFC = [userData['name'],'1.BackArrow',replyToName,base[IDX]['date'],'*S*',base[IDX]['time']]; */   		
			hFC.forEach((hFC,i)=>{
				let space=putDiv(`headerF headerF${i}`,contentHeader,2,hFC);				
				if (hFC===dateTimeSepar) {space.style.width=dateTimeSpace+px; space.innerHTML='';} 
			});				
			/*User Comment Textblock*/
				putDiv("commentText",usrCntnt,2,`${base[IDX]['text']}`);
			/*User content section bottom container*/
			const contentBottom = putDiv("contentBottom",usrCntnt);
/*Bottom blocks building*/
   	/* bFC = ['0.Reply',`${base[IDX]['fav']}`,`${base[IDX]['rate']}`]; */

const rateClr = (rateValue,elementStyle) => {
	if (rateValue>0) {elementStyle.color=plusColor;
	} else {if (rateValue===0) {elementStyle.color='';} else {elementStyle.color=minusColor;}}
};
let rateCtrlWrap = null;
		bFC.forEach((bFC,i)=>{ 
				let contentBottomF = null;   
if ((bFC===inc || bFC===dec) && !rateCtrlWrap) {rateCtrlWrap = putDiv("rateCtrlWrap",contentBottom);}
if (rateCtrlWrap) {
   		   contentBottomF = putDiv(`rateCtrl`,rateCtrlWrap,2,`${bFC}`);
   		   if (mobile376) {contentBottomF.style.margin=0+px;}	
	}  else  { contentBottomF = putDiv(`bottomF ${bottomF}${i}`,contentBottom,2,`${bFC}`);}
// cBFs - auxiliary local constant
const cBFs = contentBottomF.style;
if (bFC===inc || bFC===dec) {
	cBFs.borderRadius = '50%'; cBFs.backgroundColor = 'rgb(230,230,230)';
      if (bFC===inc) {cBFs.color=plusColor;} else {cBFs.color=minusColor;}
	/* set + and - rating control wrap width equal to the height from CSS */
	const iHeight = Math.floor(contentBottomF.getBoundingClientRect().height);
 cBFs.width = iHeight+px;
   contentBottomF.addEventListener('click',(ev) =>{	
	const bottomBlock = ev.target.parentElement, 	rateDisplayEl = bottomBlock.querySelector('.rateCtrl').nextSibling;
	if (activeUser.allowToChangeRate (IDX,base)){
		if (ev.target.innerHTML===dec) {
						base[IDX]['rate']--;
					} else {base[IDX]['rate']++;  }	
							rateClr (base[IDX]['rate'],rateDisplayEl.style);
		baseToStor(base);	      		rateDisplayEl.innerHTML=base[IDX]['rate'];	
	};
   });
} else {	
	if (rateCtrlWrap) {	
			// rating counter style
			cBFs.cursor='default';
			rateClr (base[IDX]['rate'],cBFs);
			cBFs.fontWeight='600';}
	contentBottomF.dataset.cIDX=IDX; 
		if (favItemOrder === i) { 
			if (reply) {cBFs.marginLeft='';} else {cBFs.marginLeft=15+px;}				      	
			if (activeUser.findFav(IDX,base)) {				
				contentBottomF.innerHTML = inFav;				
			} else {
				contentBottomF.innerHTML = toFav;	
			};
		
		contentBottomF.addEventListener('click',(ev) =>{
			if (activeUser.setFav (Number(parentElFind(ev).dataset.cIDX),base)) {
				 contentBottomF.innerHTML = inFav;		
				 // parent comment switch to favorite	
			         if (base===rBase) {
					if (!activeUser.findFav(rBase[IDX]['toCIDX'])) {
				   	// comment block favorite display on
			            	   const cmntFavFPool= doc.querySelectorAll('.bottomCommentF1');
			            	   cmntFavFPool.forEach((i)=>{
							if (Number(i.dataset.cIDX)===rBase[IDX]['toCIDX']) {
								i.innerHTML = inFav;	
							};
					   });			   
			            	   activeUser.setFav(rBase[IDX]['toCIDX']);}
				 };
			} else {
				 contentBottomF.innerHTML = toFav;	
			   if (base===cBase) {
				// reply blocks favorites displays off 
				const rplytFavFPool= doc.querySelectorAll('.bottomReplyF0');
				   	rBase.forEach((i,rIDX)=>{
					   if (i['toCIDX']===IDX && activeUser.findFav(rIDX,rBase)) {
						activeUser.setFav(rIDX,rBase);
						// all replies favorites displays set off
						rplytFavFPool.forEach((replyFav)=>{
							if (Number(replyFav.dataset.cIDX)===rIDX){
								replyFav.innerHTML = toFav;
							}
						});
					   };					
				   	});
			   };
			};

		});
		};
		};	//bFC is not plus or minus (else end)
		});	//bFC.forEach end
};
/* get summarized space Hooper width for Reply block left margin (showReply())*/
const getSpHoopWidth = (clasName) => {
  const className = '.'+ clasName;
  if (doc.querySelector(className)) {
          return strToNum(getProp(doc.querySelector(className), "width"));
  } else {return 0}; 
  };
const showReply = (frameElement,rIDX)=> {
putDiv("commentBlockSeparator",frameElement,0);
const replyBlock = putDiv('replyBlock',frameElement,0),
	 spHoop	 = putDiv('spHoop',replyBlock);
	if (!spHoopWidth) {
	 	spHoopWidth = getSpHoopWidth('userAvatarWrap') 
				+ 
			      getSpHoopWidth('userContentLMargin');
		sTor('spHoopWidth',spHoopWidth);}
	 spHoop.style.width = spHoopWidth +px;
frameElement.remove();
		   putDiv('vertMargin',replyBlock,0);	
const innerReplyBlock = putDiv("innerReplyBlock",replyBlock);	buildBlock(innerReplyBlock,rIDX,true);
};
const inputTextForm = (userName,orderNumber,dateTime=null,comIDX=null) =>{
	let textLength = 0, maxLen=0, allowComment=false, messageRecord, separ, headerWidth = 400 +px, sumWidth =0; 

const sumComponents = ['width','padding-left','padding-right'],		
	 senderID = usrID['byName'][userName],		/* message length warning display colors */
	      tooLongMessage = 'Слишком длинное сообщение',	  warningActiveClr = '#FF0000',
		inputYourText = 'Введите здесь текст Вашего ',	  btnSndActiveClr='black', 
								  buttonActiveBackgroundClr = 'rgb(171,216,115)',
		firstComment = 'Комментариев пока нет. Напишите здесь первый!', 
	      max1000chrsMessage = `Макс. ${maxTextLength} символов`,
	 commBlocksArray = doc.querySelectorAll('.commentBlock'),
	prevRplyForms = container.querySelectorAll('.inputForm'),
      	inputForm = putDiv("inputForm"), userData = uBase[usrID['byName'][userName]],
		inputFormAva = putDiv("userAvatarWrap",inputForm,2,`<img src=${userData['imgSrc']} class="userAvatar">`),
		inputFormContainer = putDiv("inputFormContainer",inputForm),
			inputFormHeader = putDiv("inputFormHeader",inputFormContainer),
			 headerStyle = 	inputFormHeader.style,			
				userNameField = putDiv("userNameField",inputFormHeader,2,userName),
				warningField  = putDiv("warningFWrap",inputFormHeader),
				warnFldStyle = warningField.style,
					symbCounter = putDiv("symbCounter",warningField),					
					symbCntStyle = symbCounter.style,
					warningFieldText = putDiv("text",warningField,2,max1000chrsMessage),
				
			inputFormMain = putDiv("inputFormMain",inputFormContainer),
		   txtInput = doc.createElement("textarea"), txtInpInitRows = 2, txtInpStyle = txtInput.style;
	let inpPlaceholderTxt = firstComment,
		refreshAfterSend = false;	
				txtInput.className = "textInput";   				
 				txtInput.name = 'userInputText';	txtInpStyle.resize='none';
									txtInpStyle.overflowY='hidden';
	inputFormMain.appendChild(txtInput);
	
/* show symbol counter or warning message at inputFormHeader */	
const showHeader = (messageType=null)=>{
if (messageType==='warning') {
	symbCounter.innerHTML='';
	warningFieldText.innerHTML=max1000chrsMessage;
} else {
	symbCounter.innerHTML=`${textLength}/${maxTextLength}`;
};
if (messageType==='counter') {
	allowComment = true;
	warningFieldText.innerHTML='';
} else {
	allowComment = false;
};
if (messageType===null) { 
	warningFieldText.innerHTML=tooLongMessage; 		warnFldStyle.fontStyle=normal;								
	symbCntStyle.color=warningActiveClr; 			headerStyle.width = '';
	warningFieldText.style.color=warningActiveClr;		symbCntStyle.marginRight = 50+px;
} else {
	warnFldStyle.fontStyle='';
	symbCntStyle.color=''; 			headerStyle.width = headerWidth;
	warningFieldText.style.color='';	symbCntStyle.marginRight = '';
};	
};	
const txtInputViewReset = (dontKeepValue=true) =>{
	const returnTxt = txtInput.value;					
	txtInput.rows = txtInpInitRows;		txtInpStyle.padding='';		maxLen=0;
	if (dontKeepValue) {txtInput.value = '';textLength=0; showHeader('warning');}
return returnTxt;
};

const buttonSend = putBtn('formSendBtn',inputFormMain,'Отправить',()=>{ 
	// Get real Date and Time if no Date and Time specified
	if (!dateTime) {dateTime = getDateTime();}
	/* allow to place comment or reply if the comment text length is smaller than the maxTextLength value 
	   and the input field contains at least one character (i.e. textLength variable value is greater than zero */
	if (allowComment) {	
		if (comIDX===null) { 
			      /* comment form send button reaction */
				activeUser.placeComment(txtInputViewReset());
				// if no comment blocks on display, switch to display all blocks (not fav only) and
				// rebuild all blocks to set comment block under the main input form
				if (refreshAfterSend 
					|| 
				   (!favPresent() && activeUser.showFavOnly())) {
						underLineSwitch(commntsAmount);refreshAfterSend=false;}										
				buildReplyButtonsHandlers();
		}   else    {
			      /* reply form send button reaction */
				messageRecord = {'toCIDX':comIDX,'text':txtInputViewReset(),'rate':0,'date':dateTime['date'],
					         'time':dateTime['time']};
				cBase[comIDX]['answers']++;		baseToStor(cBase);
				usrID['byRIDX'].push(senderID);		baseToStor(usrID);	
				rBase.push(messageRecord);		baseToStor(rBase);	
								showReply(inputForm,rBase.length-1);						
			    };  
	};	
	buttonSendActive();
     });
const btnSndStyle = buttonSend.style;	

const buttonSendActive = (state=false) =>{
if (state) {btnSndStyle.color = btnSndActiveClr;	btnSndStyle.backgroundColor = buttonActiveBackgroundClr;}
      else {btnSndStyle.color = '';			btnSndStyle.backgroundColor = '';}
};
txtInput.addEventListener('input',()=>{	
	textLength = txtInput.value.length; 
	if (txtInput.scrollTop) {txtInpStyle.paddingTop=20+px; txtInpStyle.paddingBottom=20+px;
				  if (!maxLen) {maxLen = Math.floor((textLength-1)/txtInpInitRows);}}
	if (maxLen) {txtInput.rows = Math.floor(textLength/maxLen)+txtInpInitRows-1;}  
	if (txtInput.rows<txtInpInitRows) {txtInputViewReset(false); btnSndStyle.alignSelf='';}
		                  if (txtInput.rows>txtInpInitRows) {btnSndStyle.alignSelf='flex-start';}
		
	if (textLength > maxTextLength)	{
					 showHeader();
					 buttonSendActive();
				} else  {	
					{if (textLength) {	buttonSendActive(true);
								showHeader('counter');}
					 else {		showHeader('warning'); 
							buttonSendActive();	}	 
					};
	};
});
  if (comIDX===null) {
		/* comment form building */
		        if (doc.querySelector('.commentBlock')) {				
		      		separ = putDiv("commentBlockSeparator");
				centeredWrap.insertBefore(separ,container);			
		        } else {
				// if no comment blocks on display set 'refreshAfterSend' to true
				refreshAfterSend = true;}
		     if (cBase.length) {inpPlaceholderTxt = inputYourText+'комментария';}
		     centeredWrap.insertBefore(inputForm,separ);
	     }  else {
		/* previous _EMPTY_ reply forms removing to escape _EMPTY_ reply forms dubbing */	
		prevRplyForms.forEach((i)=>{
				if (!i.querySelector('.textInput').value) {i.remove();}});
		/* reply form building */
			inpPlaceholderTxt = inputYourText+'ответа';
			commBlocksArray[orderNumber].insertAdjacentElement('afterend', inputForm);
			txtInput.focus();	
  	        };
txtInput.placeholder = 	inpPlaceholderTxt+'.';		
//inputFormHeader width calculation 
sumComponents.forEach((componentWidth)=>{sumWidth = sumWidth + strToNum(getProp(txtInput,componentWidth));});
sumWidth = sumWidth - strToNum(getProp(txtInput,'margin-left'));
headerWidth = sumWidth+px;	headerStyle.width = headerWidth;		
};
const showComment = (comIDX,krit=null,order=true)=> {	
let replyForm, auxArray = [];	 
	const prevCmntBlk = doc.querySelector('.commentBlock');			
	/*Comment Block Root Element*/
	const emptyDiv = putDiv("commentBlockSeparator",prevCmntBlk,0),
	      commBlk =  putDiv("commentBlock",emptyDiv,0);
	if (krit) {
		rBase.forEach((reply,rIDX)=>{
					if ((reply['toCIDX']===comIDX) && (!activeUser.showFavOnly() || activeUser.findFav (rIDX,rBase))) {
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
};
/* --------------------------------- Test/Init/User login section ---------------------------- */
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
/* active user selector control block related */
const displayActiveUserName = (userNumber) =>{
	const text = `Активен пользователь: ${uBase[userNumber]['name']} (userID ${userNumber}) *(v.${ver})`,
	nameField = doc.querySelector('.nameField'),
	textLen = text.length+ver.length+1,
	eventBtns1 = doc.querySelectorAll('.eventBtn1');				    
eventBtns1.forEach((i,n)=>{
			   const iSt = i.style;
			   if (n===userNumber) {
							iSt.boxShadow='0px 0px 3px 2px yellow';		iSt.background='greenyellow';
							iSt.borderColor='lime';				iSt.fontWeight='700';	
						} else {
							iSt.boxShadow='0px 0px 0px 0px';		iSt.background='limegreen';
							iSt.borderColor='black';			iSt.fontWeight='400';}});	 
	if (nameField) {nameField.style.width=textLen+'ch';	nameField.innerHTML = text;}
};
/* active user selector control block build */
const buildUserSelector = () => {
let lastButton; 
	// previous selector block removing
const prevUsrSlct = doc.querySelector('.usrSelector');
  if (prevUsrSlct) {prevUsrSlct.remove();
		    doc.querySelector('br').remove();}
const 	firstDiv = doc.querySelector('div'),  
	usrSlct = putDiv('usrSelector'),	usrSlctStyl = usrSlct.style,
	selectorLeftMargin = strToNum(getProp (centeredWrap,'margin-left')),
        nameField = putDiv('nameField',usrSlct),
	cr = doc.createElement("br"),		 nFldStyl = nameField.style;		

usrSlctStyl.display = 'inline-flex';	usrSlctStyl.padding = '2px';
usrSlctStyl.flexFlow = 'row wrap';	usrSlctStyl.marginLeft = selectorLeftMargin+px;
usrSlctStyl.border='1px solid lime'; 	usrSlctStyl.boxShadow='5px 5px 0px 0px lightgray';

if (mobile376) {usrSlctStyl.width = (widthBrkPnt-7)+px;	}

					nFldStyl.textAlign='center';  
					nFldStyl.padding='5px 8px 5px 8px';	nFldStyl.background='mistyrose';

	doc.body.insertBefore(cr,firstDiv);	
	doc.body.insertBefore(usrSlct,cr);							
/* user switch buttons with handlers */
uBase.forEach((i)=>{lastButton=putBtn('eventBtn1',usrSlct,i['name'],()=>{
				displayActiveUserName(newUserLogIn(i['name']));	});				
		    lastButton.style.margin='3px 10px 3px 0px';	
});    		    lastButton.insertAdjacentElement('afterend', nameField);
};	// end of active user selector control block building ('buildUserSelector' procedure)

/* user login procedure */
const newUserLogIn = (userName) => {
			const userNumber = usrID['byName'][userName];
			commntsAmount.innerHTML=`Комментарии <span class='commentsQuantity'>(${cBase.length})</span>`;
			checkWidth();
			activeUser = user[userNumber];
			heartSwitch();
			if (activeUser.showFavOnly()) {underLineSwitch(favControl);} else {underLineSwitch(commntsAmount);}	
return userNumber;		  
};
const pageInit = () =>{
	const userNumber = newUserLogIn (activeUser.getName);	//to show main comment form at page start/refresh
	buildUserSelector();
	displayActiveUserName(userNumber);
	// set name field top margin on selector height > 30 px
	let blkWidth = getProp(doc.querySelector('.usrSelector'),'height');
	if (strToNum(blkWidth)>30) {doc.querySelector('.nameField').style.marginTop=10+px;}
};    pageInit();

/* rebuild comments blocks at screen size change */
window.onresize  = pageInit;
					/*	----	E N D   O F   M A i N  	P R O C E D U R E 	----	*/
};					/*		(script2)			*/
  if (auxBase) { 
	uBase=auxBase;	
	script2();
  } else {
	doc.body.insertBefore(progressWrap,null);
	doc.body.insertBefore(messageWrap,progressWrap);
	messageShow();
	insBrik ();
	uBase.forEach(()=>{requestUserData();});
	let intervalId = setInterval(()=>{
				  messageShow();
				  if (!(validUser<uBaseLen) || errorFlag){
					clearInterval(intervalId);
					if (errorFlag) {		progressWrap.remove();
					} else {
						localStorage.clear();
						baseToStor(uBase);					
					}
					setTimeout(()=>{
						messageWrap.remove();	progressWrap.remove();																		
						script2();						
					},timing1);
				  };
	},timing2);
  };

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