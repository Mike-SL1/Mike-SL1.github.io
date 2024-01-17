// Игра "Змейка". Автор Слугин М. В. 2024 Файл - zmey2.js
// ---------------------------------------------------------------------------------- 
// random([<minimal value>],[<maximal value>],[<previous value to escape repeating>])
// setApple()
// hereApple(position) - определение есть яблоко или нет в ячейке с коорд. xPos,yPos
// paintHead(position)
// dead(position of death) - game termination proc
// lives(<lives remain count>)	- lives counter and lightbox blinker
// resolve(x)		- after wall collision direction resolving
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
let xPos=random(1,20); let yPos=random(1,20); 	//snake head initial position
let direction;										
if (xPos<10) {direction='Right';} else 	{direction='Left';}
let livesCount=5; 				//lives counter	setup to max value		
let apples=1;	let appleImageSrc= 'url("img/apple.gif")';
let keyRepeat=false;	//false	- no keyboard keypressed repeat		
let zmeyLength=0;	let zmey=[];   	let intervalID567;	//zmey speed timer		
let position0=0;			let rainbowTimeout;	//after apple rainbow mode timer									
const gameOver=document.querySelector('.finish'); 		//gameOver message block pointer
//цвет головы
let headColor='red'; 				  
//bodycolor control : constant or random cell color
let a1; 
let bodyColor='blue'; 			let rainbowMode=false;   let colorChanging=true;
if (!(rainbowMode)) {if (colorChanging) {setInterval(function(){a1=random(0,colorsArrayLength,a1);bodyColor=clrs[a1];},5000);}}	

// --------------------------- игровое поле 20 x 20 ячеек ---------------------------
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
const bum=document.querySelector('.boom');				
// делает из координат X и Y номер ячейки массива кружочков / кубиков
function checkPos(xPos,yPos){R=0; let pos=R;	
			     if ((xPos<1) || (xPos>20)) {return R;}	if ((yPos<1) || (yPos>20)) {return R;}
	       xPos--;yPos--;	pos=xPos+yPos*20;	 return pos;}
//apple setting up
function setApple(){   let flagApple=true;		let position=checkPos(xPos,yPos);
		    while (flagApple){flagApple=false;	    position=random(0,399,position);     
				 zmey.forEach((i)=>{if (i===position){flagApple=true;}});}
				squares[position].style.background='';
				squares[position].style.backgroundImage=appleImageSrc;
}
//here was apple + включение rainbowMode на 7 секунд
function hereApple(position){	
				let appleImg=squares[position].style.backgroundImage;						
		 if (appleImg===appleImageSrc) {squares[position].style.backgroundImage=""; 
						setApple();
						scor.innerHTML=`СЧЁТ: ${apples}`; apples++;	
					rainbowMode=true; clearTimeout(rainbowTimeout);
					rainbowTimeout=setTimeout(function(){rainbowMode=false;},7000);	
						    return true;}
		 else return false;
}
function makeGradient(endColor){
return `radial-gradient(circle at center, white, ${endColor} 60%, ${endColor} 69%, darkturquoise 69%)`;}

function paintHead(position){  	circs[position].style.background=makeGradient(headColor);
			  	circs[position].innerHTML=`<img src="img/face.GIF" class="face">`;	
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
	 headColor='#48D1CC';	setTimeout(function(){headColor=lastHeadColor;},500);	                
}					
//счётчик жизней + мигалка
function lives(){livesCount--;	live.innerHTML=`Жизни: ${livesCount}`;		boom(xPos,yPos);	
		/*помигать*/ 
		live.style.fontWeight="600";	live.style.background="black";	live.style.color="red";
		setTimeout(function(){		live.style.background="red";	live.style.color="white";
			  setTimeout(function(){live.style.fontWeight="";	live.style.background="";
						live.style.color="";
						},100);
				     },100);	      	
		if (livesCount<1) {dead(0);	return false;} 
//удаление рисунка взрыва если игра не окончена
	else {setTimeout(function(){bum.style.display='';},400);
						return true;}			
					 
}				
//разрешение направления при столкновении со стенкой, при движении вдоль стенки направление не менять
function resolve(p){let liveOrDead=lives();
		     if (p) {if (xPos>10) {direction='Left';xPos--;} else {direction='Right';xPos++;}}	//resolve x
	    	     else   {if (yPos>10) {direction='Up';  yPos--;} else {direction='Down'; yPos++;}}	//resolve y		     		     
return liveOrDead;}// true для обратного отсчёта жизней и отображения взрыва при столкновении
//--------------------------------------------   MAIN   --------------------------------------------
function snakeGo_Go(){let currentPosition;			let flagResolve;//for boom and lives count control	
		      						let noTailBit;	//inverted collision state	
intervalID567=setInterval(function(){		        	flagResolve=true;		
//previous cell smile removing	
	currentPosition=checkPos(xPos,yPos);	      
	 
switch (direction) {case 'Up':   yPos--;	if (yPos<1)  {yPos=1; flagResolve=resolve(1);} break;
		    case 'Down': yPos++;	if (yPos>20) {yPos=20;flagResolve=resolve(1);} break;
		    case 'Right':xPos++;	if (xPos>20) {xPos=20;flagResolve=resolve(0);} break;
		    case 'Left': xPos--;	if (xPos<1)  {xPos=1; flagResolve=resolve(0);} 
		    }				    		  
//boom and lives count control implementation
if (flagResolve) {
	//previous cell smile removing
		circs[currentPosition].innerHTML=``;
	//если длина > яблок+1 - удалять последний 
      		if (zmeyLength<apples) {zmeyLength++;} else {circs[zmey[zmeyLength]].style.background='';zmey.pop();}		
	//new head position
	currentPosition=checkPos(xPos,yPos);
	//head
	zmey.unshift(currentPosition);
	//eating apple if it is and setup new one
	hereApple(currentPosition);
}
//tail bit detection and body colorize
noTailBit=true;
for (let i=1;i<apples;i++){if (zmey[0]===zmey[i]) {noTailBit=false;}
			   if (rainbowMode) {a1=random(0,colorsArrayLength,a1);bodyColor=clrs[a1];}
			   circs[zmey[i]].style.background=makeGradient(bodyColor);}
//if no tail bit - paint head, else dead in current position
if (noTailBit) {paintHead(currentPosition);} else {dead(currentPosition);}			
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
//initial snake and apple position
position0=checkPos(xPos,yPos);
paintHead(position0); 	zmey.unshift(position0);	setApple();
//initial score and lives displays setup	
scor.innerHTML=`СЧЁТ: 0`;	live.innerHTML=`Жизни: ${livesCount}`;
//пуск
snakeGo_Go(); 
























