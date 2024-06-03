/*users base*/
let uBase=[{'name':'Андрей',	
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
 reply base -    [{'tocIDX':2,'text':'комментарий 0 - user 0','rate':10,'date':dateM,'time':timeM}
]
*/
let validUser = 0,	errorFlag = false;
const doc=document, 	px = 'px',	requestString = "https://randomuser.me/api/",

messageWrap = doc.createElement('div'),progressWrap = doc.createElement('div'), 

	meStyl = messageWrap.style,	progStyl = progressWrap.style,	
uBaseLen = uBase.length, timing1 = 2000, timing2 = timing1 / 4, brdWdth ='1px solid ', shadow = '3px 3px 2px 1px lightgray';

meStyl.border = brdWdth+'red';     meStyl.padding = 8+px;         meStyl.display = 'inline-block'; 	meStyl.fontSize=22+px;
progStyl.border = brdWdth+'blue';  progStyl.minWidth = 100+px;    progStyl.display = 'inline-flex';	meStyl.boxShadow = shadow;
progStyl.marginLeft = 10+px;	   progStyl.background = 'green'; progStyl.boxShadow = shadow;

const insBrik = () => {
const progressBrik = doc.createElement('div'),	  brikStyl = progressBrik.style;
brikStyl.width = 20+px;  brikStyl.height = 10+px; brikStyl.background = 'red';
progressWrap.appendChild(progressBrik);
};    
const messageShow = () => {
let text; const basyP =' базы пользователей ';
switch (errorFlag) {case false: text= `Загрузка${basyP}из ${requestString}: Загружено ${validUser} записей из ${uBaseLen}`; break;
	    	    case  true: text= `Ошибка загрузки${basyP}из ${requestString}. Используем локальную базу.`;		    break;}
messageWrap.innerHTML = text;
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
const loadScript2 = () => {
const script2 = doc.createElement('script');
      script2.src = "commsys6.js";
      doc.head.append(script2);
};
const auxBase = true; //sTor('uBase');
  if (auxBase) {
	// uBase = auxBase;
	loadScript2();
  } else {
	doc.body.insertBefore(progressWrap,undefined);
	doc.body.insertBefore(messageWrap,progressWrap);
	messageShow();
	insBrik ();
	uBase.forEach(()=>{requestUserData();});
	let intervalId = setInterval(()=>{
				  messageShow();
				  if (!(validUser<uBaseLen) || errorFlag){
					clearInterval(intervalId);
					if (errorFlag) {		progressWrap.remove();
					} else {baseToStor(uBase);}
					setTimeout(()=>{
						messageWrap.remove();	progressWrap.remove();																		
						loadScript2();						
					},timing1);
				  };
	},timing2);
  };