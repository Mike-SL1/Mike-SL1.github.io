// Игра "Змейка". Автор Слугин М. В. 2024 Файл - zmey2.js
// ---------------------------------------------------------------------------------- 
// random([<minimal value>],[<maximal value>],[<previous value to escape repeating>])
// setApple()
// hereApple(xPos,yPos) - определение есть яблоко или нет в ячейке с коорд. xPos,yPos
// paint(<X position>,<Y position>,[<color - by default - blue>]
// dead(position of death) - game termination proc
// lives(<lives remain count>)	- lives counter and lightbox blinker
// resolve()		- after wall collision direction resolving
// boom(x,y)		- shows a picture of explosion
// snakeGo_Go()		- MAIN Procedure snake movement / no arguments /
// keyboard interface	- keyboard keys EventListener
const random = (min=0, max=0, last=0.5) => {let aux1;
				    if (isNaN(min)) {min=0;}if (isNaN(max)) {max=0;} if (isNaN(last)) {last=0.5;}	   
				    if (min==max) return min; else {if (min>max) {aux1=min;min=max;max=aux1;}}
			      	    aux1=max-min+1;  const rnd =()=> min+Math.floor(Math.random()*aux1);
			      	    let first=rnd ();while (last===first){first=rnd ();}           return first;}
let clrs=['burlywood','cadetblue','chartreuse','darkgreen','yellowgreen','chocolate','coral','cornflowerblue','darkkhaki',
'darkmagenta','darkolivegreen','darkviolet','deeppink','crimson','cyan','darkorange','darkorchid','darkred','darkturquoise',
'blue','blueviolet','brown','darkblue','darkcyan','darkgoldenrod','darkseagreen','darkslateblue','mediumaquamarine','firebrick',
'forestgreen','hotpink','indianred','violet','magenta','maroon','fuchsia','gold',
'lawngreen','lightseagreen','green','greenyellow','tomato','springgreen',
'mediumspringgreen','mediumturquoise','mediumvioletred','orange','orangered','orchid','purple','rebeccapurple',
'dodgerblue','midnightblue','mistyrose','royalblue','teal',
'moccasin','navajowhite','navy','palevioletred','saddlebrown','sandybrown','mediumslateblue','olive','olivedrab',
'peru','plum','seagreen','sienna','mediumseagreen','mediumpurple','slateblue','limegreen','lime',
'red'];//0-75
let colorsArrayLength=clrs.length-1;
let xPos=random(1,20); let yPos=random(1,20); 	//начальные координаты змея 
let direction;	
if (xPos<10) {direction='Right';} else 	{direction='Left';}
let previousDirection=direction;
let livesCount=5; 			//количество жизней			
let apples=0;	let keyRepeat=false;	//false	- no repeat		
		let zmey=[];   		let intervalID567;	//zmey speed timer		
					let rainbowTimeout;	//after apple rainbow mode timer									
const gameOver=document.querySelector('.finish'); //gameOver message block pointer
//цвет головы
let headColor='red'; 				  
//bodycolor control : constant or random cell color
let a1; 
let bodyColor;  			let rainbowMode=false;   let colorChanging=true;
if (!(rainbowMode)) {if (colorChanging) {setInterval(function(){a1=random(0,colorsArrayLength,a1);bodyColor=clrs[a1];},5000);} 
		     else {bodyColor='blue';}}	
// --------------------------- игровое поле ---------------------------
let cubBorderBottom=' cubBorderBottom'; 	let cubBorderRight='';		let j=0; 
const centrDiv=document.querySelector('.playground'); 		
for (let i=0;i<400;i++){
	    		if (j===0) {cubBorderRight=' cubBorderRight';}
  	  j++;  					if (j===20){j=0;cubBorderRight='';}
	    		if (i>379) {cubBorderBottom='';}  
centrDiv.insertAdjacentHTML('beforeend','<div class="cub'+cubBorderBottom+cubBorderRight+'"><div class="cir"></div></div>');}

const circs=document.querySelectorAll('.cir');	// кружочки
const squares=document.querySelectorAll('.cub');// кубики
const scor=document.querySelector('.score'); 	// счёт	
const live=document.querySelector('.lives'); 	// жизни		
const bum=document.querySelector('.boom');				scor.innerHTML=`СЧЁТ: 0`;
// делает из координат X и Y номер ячейки массива кружочков / кубиков
function checkPos(xPos,yPos){R=0; let pos=R;	
			     if ((xPos<1) || (xPos>20)) {return R;}	if ((yPos<1) || (yPos>20)) {return R;}
	       xPos--;yPos--;	pos=xPos+yPos*20;	 return pos;}
//установка яблока
function setApple(){let x=xPos; let y=yPos; let flag=true;	let position=0;
			while (flag){x=random(1,20,x); 		y=random(1,20,y); flag=false;
				     position=checkPos(x,y);	zmey.forEach((i)=>{if (i===position){flag=true;}});}
				squares[position].style.background='';
				squares[position].style.backgroundImage="url('img/apple.gif')";
}
//тут было яблоко + включение rainbowMode на 7 секунд
function hereApple(xPos,yPos){	let position=checkPos(xPos,yPos); let cellWithSomething=document.querySelectorAll('.cub');
				let appleImg=cellWithSomething[position].style.backgroundImage;	
//поиск строки apple.gif в backgroundImage	
				let appleExp=/apple\.gif/;	
		 if (appleImg.match(appleExp)) {squares[position].style.backgroundImage=""; 
						setApple();
						apples++; scor.innerHTML=`СЧЁТ: ${apples}`;	
					rainbowMode=true;clearTimeout(rainbowTimeout);
					rainbowTimeout=setTimeout(function(){rainbowMode=false;},7000);	
						    return true;}
		 else return false;
}
function makeGradient(endColor){
return `radial-gradient(circle at center, white, ${endColor} 60%, ${endColor} 69%, darkturquoise 69%)`;}
//закрасить кружочек + вставить смайл если цвет равен headColor
function paint(xPos,yPos,colorName=bodyColor){let position=checkPos(xPos,yPos);
						circs[position].style.background=makeGradient(colorName);
					      if (colorName===headColor) {
						circs[position].innerHTML=`<img src="img/face.GIF" class="face">`;}	
}
//окончание игры  z - position number where cuicide committed
function dead(z){let flagBoomBlink=true;	let flagGameOverSlowFlash=true;
		 rainbowMode=false; 		bodyColor='black';
clearInterval(intervalID567);
		 squares.forEach((item1,count)=>{if (count!=z) {item1.style.opacity='0.5';}});
                 circs.forEach((item1,count)=>  {if (count!=z) {item1.style.opacity='0.5';}});
gameOver.style.opacity='1';
	setInterval(function (){gameOver.style.color=clrs[random(0,colorsArrayLength)];
				if (flagGameOverSlowFlash){gameOver.style.opacity='0.3';} 
						     else {gameOver.style.opacity='1';}
				flagGameOverSlowFlash=!flagGameOverSlowFlash;},1100);
//голову разрывает взрывом (от досады) при укусе собственного хвоста 						
	  if (z){live.innerHTML=`Укус за хвост`;
		 circs[z].style.background='';	squares[z].style.opacity='1';
		 setInterval(function (){flagBoomBlink=!flagBoomBlink; 
			if (flagBoomBlink) {squares[z].style.background='';} 
			else {squares[z].style.backgroundImage="url('img/boom.gif')";}},500);}
//голова синеет после смерти, если смерть наступила в результате удара об стену, а не суицида
	  else {headColor='blue';}
}	
//взрыв при столкновении со стенкой, углы не обрабатываются
function boom(x,y){let vert; let horz; 	let lastHeadColor=headColor;
switch (x) {case 1:horz=-2.5;	vert=y*5.05-5.5; 	break;	//левая стенка
	    case 20:horz=97.5;	vert=y*5.05-5.5; 	break;	//правая стенка
	    default:horz=x*5-5; 
		    switch (y) {case 1: vert=-2;	break;	//потолок
				case 20:vert=97;}		//пол
	   }
	   bum.style.top=`${vert}%`; 
	   bum.style.left=`${horz}%`; bum.style.display='block'; 
//голова слегка синеет на некоторое время после удара об стену
	 headColor='#48D1CC';	setTimeout(function(){headColor=lastHeadColor;},200);	                
}					
//счётчик жизней + мигалка
function lives(){livesCount--;		boom(xPos,yPos);	
		/*помигать*/ 
		live.style.fontWeight="600";	live.style.background="black";	live.style.color="red";
		setTimeout(function(){		live.style.background="red";	live.style.color="white";
			  setTimeout(function(){live.style.fontWeight="";	live.style.background="";
						live.style.color="";
						},100);
				     },100);	      	
		if (livesCount<1) {dead(0);} 
//удаление рисунка взрыва если игра не окончена
	else {setTimeout(function(){bum.style.display='';},400);}			
		live.innerHTML=`Жизни: ${livesCount}`;			 
}				
//разрешение направления при столкновении со стенкой, при движении вдоль стенки направление не менять
function resolve(){if ((direction==='Up')||(direction==='Down')) {
					  if ((previousDirection==='Left')||(previousDirection==='Right')) {
						direction=previousDirection;	return false;}
					  if (xPos>10) {direction='Left';} else {direction='Right';}	//resolve x
		     			 }			     
		         else 		 {if ((previousDirection==='Up')||(previousDirection==='Down')) {
						direction=previousDirection;	return false;}
					  if (yPos>10) {direction='Up';} else {direction='Down';}}		//resolve y		     
return true;}// true для обратного отсчёта жизней и отображения взрыва при столкновении
//------------------------------   MAIN   --------------------------------------------
function snakeGo_Go(){let currentPosition;			let flagResolve;//for boom and lives count control	
		      let lastPosition;				let noTailBit;	//inverted collision state	
intervalID567=setInterval(function(){		        	flagResolve=false;					
		lastPosition=checkPos(xPos,yPos);	 
switch (direction) {case 'Up':   yPos--;	if (yPos<1)  {yPos=1; flagResolve=resolve();} break;
		    case 'Down': yPos++;	if (yPos>20) {yPos=20;flagResolve=resolve();} break;
		    case 'Right':xPos++;	if (xPos>20) {xPos=20;flagResolve=resolve();} break;
		    case 'Left': xPos--;	if (xPos<1)  {xPos=1; flagResolve=resolve();} 
		    }				    		  
//boom and lives count control implementation
if (flagResolve) {lives();}	
//удаление смайла из предыдущей ячейки				
circs[lastPosition].innerHTML=``;	
//новые коорд. головы
currentPosition=checkPos(xPos,yPos);
//если яблоко - то съесть
hereApple(xPos,yPos);		
// here is zmey body ------------------------------------------------------------------------------
zmey[apples]=lastPosition;	//первый после головы
								 noTailBit=true;	
zmey.forEach((x,i)=>{if (i) {if (rainbowMode) {a1=random(0,colorsArrayLength,a1);bodyColor=clrs[a1];}
		//обнаружение укуса за хвост
			 if ((i<apples)&&(x===currentPosition)) {noTailBit=false;}	
							circs[x].style.background=makeGradient(bodyColor);
				}else {if ((livesCount)&&(noTailBit)) {circs[x].style.background='';}
					          else {circs[x].style.background=makeGradient(bodyColor);}}});	
			for (let i=0;i<apples;i++){zmey[i]=zmey[i+1];}
//------------------------------------------------------------------------------------------------
//отрисовка головы, если не укушен хвост
if (noTailBit) {paint(xPos,yPos,headColor);} else {dead(currentPosition);}			
previousDirection=direction;
//zmey speed timer
},300);		}	
				
//keyboard interface			    
document.addEventListener('keydown', function(event) {
if (!(event.repeat)||(keyRepeat)) {								
switch (event.code){case 'ArrowUp':   if ((direction!='Down')&&(yPos>1))  {direction='Up';} 	break;
		    case 'ArrowDown': if ((direction!='Up') && (yPos<20)) {direction='Down';} 	break;
		    case 'ArrowRight':if ((direction!='Left')&&(xPos<20)) {direction='Right';} 	break;
		    case 'ArrowLeft': if ((direction!='Right')&&(xPos>1)) {direction='Left';} 

		    }
}					});		
//установка в начальные координаты змея и яблока
paint(xPos,yPos,headColor);		setApple();	
//начальная установка табло жизней	
live.innerHTML=`Жизни: ${livesCount}`;
//пуск
snakeGo_Go(); 
























